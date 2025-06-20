
import { z } from "zod";

// Survey response validation schema
export const surveyResponseSchema = z.object({
  sex: z.enum(['Male', 'Female', 'Other', 'Prefer not to say']).optional(),
  age: z.string()
    .min(1, "Age is required")
    .regex(/^\d+$/, "Age must be a number")
    .refine((val) => {
      const age = parseInt(val);
      return age >= 18 && age <= 100;
    }, "Age must be between 18 and 100"),
  
  // Mental health related questions
  'depression-score': z.string()
    .regex(/^[1-5]$/, "Score must be between 1 and 5")
    .optional(),
  
  'anxiety-level': z.string()
    .regex(/^[1-5]$/, "Level must be between 1 and 5")
    .optional(),
  
  // Text responses with length limits
  'cosmetic-procedures': z.string()
    .max(500, "Response too long (max 500 characters)")
    .optional(),
  
  'social-media-hours': z.string()
    .regex(/^\d+(\.\d+)?$/, "Must be a valid number")
    .refine((val) => {
      const hours = parseFloat(val);
      return hours >= 0 && hours <= 24;
    }, "Hours must be between 0 and 24")
    .optional(),
});

// Sanitize text input to prevent XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .slice(0, 1000); // Limit length
};

// Validate and sanitize survey response
export const validateSurveyResponse = (responses: Record<string, string>) => {
  const sanitizedResponses: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(responses)) {
    if (typeof value === 'string') {
      sanitizedResponses[key] = sanitizeInput(value);
    }
  }
  
  try {
    // Validate common fields
    const commonFields = {
      sex: sanitizedResponses.sex,
      age: sanitizedResponses.age,
      'depression-score': sanitizedResponses['depression-score'],
      'anxiety-level': sanitizedResponses['anxiety-level'],
      'cosmetic-procedures': sanitizedResponses['cosmetic-procedures'],
      'social-media-hours': sanitizedResponses['social-media-hours'],
    };
    
    const validatedFields = surveyResponseSchema.parse(commonFields);
    
    return {
      isValid: true,
      data: { ...sanitizedResponses, ...validatedFields },
      errors: null
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        data: sanitizedResponses,
        errors: error.errors
      };
    }
    
    return {
      isValid: false,
      data: sanitizedResponses,
      errors: [{ message: 'Validation failed' }]
    };
  }
};

// Rate limiting helper (simple in-memory implementation)
const submissionTimes = new Map<string, number[]>();

export const checkRateLimit = (identifier: string, maxAttempts: number = 3, windowMs: number = 60000): boolean => {
  const now = Date.now();
  const attempts = submissionTimes.get(identifier) || [];
  
  // Remove old attempts outside the time window
  const recentAttempts = attempts.filter(time => now - time < windowMs);
  
  if (recentAttempts.length >= maxAttempts) {
    return false; // Rate limit exceeded
  }
  
  // Add current attempt
  recentAttempts.push(now);
  submissionTimes.set(identifier, recentAttempts);
  
  return true; // Within rate limit
};
