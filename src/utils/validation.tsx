import { z } from "zod";

// Simplified survey response validation schema
export const surveyResponseSchema = z.object({
  gender: z.string().optional(),
  sex: z.string().optional(),
  age: z.string().optional(),
  'depression-score': z.string().optional(),
  'anxiety-level': z.string().optional(),
  'cosmetic-procedures': z.string().max(2000, "Response too long").optional(),
  'social-media-hours': z.string().optional(),
});

// Basic sanitization to prevent XSS
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim()
    // Limit length
    .slice(0, 2000);
};

// Validate survey ID
export const validateSurveyId = (surveyId: string): boolean => {
  if (typeof surveyId !== 'string') return false;
  return surveyId.length > 0 && surveyId.length <= 100;
};

// Simplified validation for survey responses
export const validateSurveyResponse = (responses: Record<string, string>, surveyId?: string) => {
  const sanitizedResponses: Record<string, string> = {};
  
  // Validate survey ID if provided
  if (surveyId && !validateSurveyId(surveyId)) {
    return {
      isValid: false,
      data: {},
      errors: [{ message: 'Invalid survey identifier' }],
      securityWarnings: []
    };
  }
  
  // Sanitize each response
  for (const [key, value] of Object.entries(responses)) {
    if (typeof value === 'string') {
      sanitizedResponses[key] = sanitizeInput(value);
    }
  }
  
  return {
    isValid: true,
    data: sanitizedResponses,
    errors: null,
    securityWarnings: []
  };
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
      console.error('Rate limit check failed:', error);
      return false; // Fail safe - block on error
    }
    
    return data === true;
  } catch (error) {
    console.error('Rate limit check error:', error);
    return false; // Fail safe - block on error
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
