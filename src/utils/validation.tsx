
import { z } from "zod";

// Enhanced survey response validation schema with stricter security
export const surveyResponseSchema = z.object({
  sex: z.enum(['Male', 'Female', 'Other', 'Prefer not to say']).optional(),
  age: z.string()
    .min(1, "Age is required")
    .max(3, "Age must be a valid number")
    .regex(/^\d+$/, "Age must be a number")
    .refine((val) => {
      const age = parseInt(val);
      return age >= 18 && age <= 120;
    }, "Age must be between 18 and 120"),
  
  // Mental health related questions with strict validation
  'depression-score': z.string()
    .regex(/^[1-5]$/, "Score must be between 1 and 5")
    .optional(),
  
  'anxiety-level': z.string()
    .regex(/^[1-5]$/, "Level must be between 1 and 5")
    .optional(),
  
  // Text responses with enhanced length limits and content validation
  'cosmetic-procedures': z.string()
    .max(1000, "Response too long (max 1000 characters)")
    .refine((val) => {
      if (!val) return true;
      // Check for suspicious patterns that might indicate injection attempts
      const suspiciousPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /data:text\/html/gi,
        /vbscript:/gi
      ];
      return !suspiciousPatterns.some(pattern => pattern.test(val));
    }, "Invalid content detected")
    .optional(),
  
  'social-media-hours': z.string()
    .regex(/^\d+(\.\d{1,2})?$/, "Must be a valid number with up to 2 decimal places")
    .refine((val) => {
      const hours = parseFloat(val);
      return hours >= 0 && hours <= 24;
    }, "Hours must be between 0 and 24")
    .optional(),
});

// Enhanced sanitization to prevent XSS and injection attacks
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove vbscript: protocol
    .replace(/vbscript:/gi, '')
    // Remove data: URLs that could contain HTML
    .replace(/data:text\/html[^;]*;[^,]*,/gi, '')
    // Remove event handlers
    .replace(/on\w+\s*=/gi, '')
    // Remove potential SQL injection patterns
    .replace(/('\s*(or|and|union|select|insert|update|delete|drop|create|alter)\s*')/gi, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim()
    // Limit length as final safety measure
    .slice(0, 2000);
};

// Validate survey ID to prevent tampering
export const validateSurveyId = (surveyId: string): boolean => {
  if (typeof surveyId !== 'string') return false;
  
  // Survey IDs should be alphanumeric with hyphens/underscores
  const validSurveyIdPattern = /^[a-zA-Z0-9_-]+$/;
  return validSurveyIdPattern.test(surveyId) && surveyId.length <= 50;
};

// Enhanced validation for survey responses with security checks
export const validateSurveyResponse = (responses: Record<string, string>, surveyId?: string) => {
  const sanitizedResponses: Record<string, string> = {};
  const securityWarnings: string[] = [];
  
  // Validate survey ID if provided
  if (surveyId && !validateSurveyId(surveyId)) {
    return {
      isValid: false,
      data: {},
      errors: [{ message: 'Invalid survey identifier' }],
      securityWarnings: ['Suspicious survey ID detected']
    };
  }
  
  // Sanitize and validate each response
  for (const [key, value] of Object.entries(responses)) {
    if (typeof value === 'string') {
      const originalLength = value.length;
      const sanitized = sanitizeInput(value);
      
      // Check if significant content was removed during sanitization
      if (originalLength > 0 && sanitized.length < originalLength * 0.8) {
        securityWarnings.push(`Suspicious content removed from field: ${key}`);
      }
      
      sanitizedResponses[key] = sanitized;
    }
  }
  
  try {
    // Validate common fields with enhanced schema
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
      errors: null,
      securityWarnings
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        data: sanitizedResponses,
        errors: error.errors,
        securityWarnings
      };
    }
    
    return {
      isValid: false,
      data: sanitizedResponses,
      errors: [{ message: 'Validation failed' }],
      securityWarnings
    };
  }
};

// Server-side rate limiting check (calls Supabase function)
export const checkServerRateLimit = async (
  identifier: string, 
  actionType: string, 
  maxAttempts: number = 5, 
  windowMinutes: number = 15
): Promise<boolean> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data, error } = await supabase.rpc('check_rate_limit', {
      p_identifier: identifier,
      p_action_type: actionType,
      p_max_attempts: maxAttempts,
      p_window_minutes: windowMinutes
    });
    
    if (error) {
      console.warn('Rate limit check failed:', error);
      return true; // Allow on error to prevent blocking legitimate users
    }
    
    return data === true;
  } catch (error) {
    console.warn('Rate limit service unavailable:', error);
    return true; // Allow on error
  }
};

// Legacy client-side rate limiting (kept for fallback)
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

// Content Security Policy validation
export const validateCSPCompliance = (content: string): boolean => {
  const dangerousPatterns = [
    /javascript:/gi,
    /vbscript:/gi,
    /data:text\/html/gi,
    /on\w+\s*=/gi,
    /<script\b/gi,
    /<iframe\b/gi,
    /<object\b/gi,
    /<embed\b/gi,
    /<link\b/gi,
    /<style\b/gi
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(content));
};
