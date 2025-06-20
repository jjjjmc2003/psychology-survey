import { supabase } from '@/integrations/supabase/client';
import { validateSurveyResponse, validateSurveyId } from './validation';

// Define the interface that matches our Supabase table structure
interface SupabaseSurveyResponse {
  id: string;
  survey_id: string;
  participant_id: string | null;
  responses: Record<string, string>;
  metadata?: Record<string, any>;
  ip_hash?: string | null;
  user_agent?: string | null;
  completion_time?: string | null;
  created_at: string;
  updated_at: string;
}

// Generate a simple hash for session tracking
const generateSessionHash = (sessionId: string): string => {
  // Simple hash function for session tracking
  let hash = 0;
  const str = sessionId + '-' + Date.now();
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).slice(0, 16);
};

// Simplified anonymous response saving
export const saveAnonymousResponse = async (responseData: {
  surveyId: string;
  responses: Record<string, string>;
  sessionId: string;
}) => {
  try {
    console.log('Attempting to save anonymous response');

    // Basic validation
    if (!responseData.surveyId || !responseData.responses || !responseData.sessionId) {
      return { 
        success: false, 
        error: 'Missing required data' 
      };
    }

    // Simple validation - just check if we have responses
    if (Object.keys(responseData.responses).length === 0) {
      return { 
        success: false, 
        error: 'No responses provided' 
      };
    }

    // Generate simple session hash
    const sessionHash = generateSessionHash(responseData.sessionId);

    // Insert directly without complex validation
    const { data, error } = await supabase
      .from('survey_responses')
      .insert({
        survey_id: responseData.surveyId,
        participant_id: null, // Anonymous
        responses: responseData.responses,
        completion_time: null,
        ip_hash: sessionHash,
        user_agent: navigator.userAgent?.slice(0, 200) || 'unknown',
        metadata: {
          session_id: responseData.sessionId,
          anonymous: true,
          timestamp: new Date().toISOString(),
          version: '1.0'
        }
      })
      .select('id')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return { 
        success: false, 
        error: `Database error: ${error.message}` 
      };
    }

    console.log('Anonymous survey response saved successfully:', data?.id);
    return { success: true, id: data?.id };
  } catch (error: any) {
    console.error('Error saving anonymous response:', error);
    return { 
      success: false, 
      error: `Failed to save: ${error.message || 'Unknown error'}` 
    };
  }
};

// Enhanced secure response saving
export const saveSecureResponse = async (responseData: {
  surveyId: string;
  responses: Record<string, string>;
}) => {
  try {
    // Validate survey ID
    if (!validateSurveyId(responseData.surveyId)) {
      return { 
        success: false, 
        error: 'Invalid survey identifier' 
      };
    }

    // Enhanced validation and sanitization
    const validation = validateSurveyResponse(responseData.responses, responseData.surveyId);
    
    if (!validation.isValid) {
      console.warn('Validation errors:', validation.errors);
      return { 
        success: false, 
        error: 'Invalid survey data provided' 
      };
    }

    // Log security warnings
    if (validation.securityWarnings && validation.securityWarnings.length > 0) {
      console.warn('Security warnings during validation:', validation.securityWarnings);
    }

    // Generate secure session hash
    const sessionHash = generateSessionHash('authenticated-session-' + Date.now());

    // Use the enhanced Supabase function for secure insertion
    const { data, error } = await supabase.rpc('submit_survey_response', {
      p_survey_id: responseData.surveyId,
      p_responses: validation.data,
      p_completion_time: null,
      p_ip_hash: sessionHash
    });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Survey response saved securely with validation:', data);
    return { success: true, id: data };
  } catch (error) {
    console.error('Error saving secure response:', error);
    return { success: false, error: 'Failed to save response securely' };
  }
};

// Get stored responses from Supabase (for admins)
export const getStoredResponses = async (): Promise<SupabaseSurveyResponse[]> => {
  try {
    const { data, error } = await supabase
      .from('survey_responses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error retrieving stored responses:', error);
      return [];
    }

    // Transform the Supabase data to match our interface
    const transformedData: SupabaseSurveyResponse[] = (data || []).map(item => ({
      id: item.id,
      survey_id: item.survey_id,
      participant_id: item.participant_id,
      responses: item.responses as Record<string, string>,
      metadata: item.metadata as Record<string, any> || {},
      ip_hash: item.ip_hash,
      user_agent: item.user_agent,
      completion_time: item.completion_time ? String(item.completion_time) : null,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));

    return transformedData;
  } catch (error) {
    console.error('Error retrieving stored responses:', error);
    return [];
  }
};

// Export CSV with data anonymization
export const exportSecureCSV = (responses: SupabaseSurveyResponse[], anonymize: boolean = true) => {
  if (responses.length === 0) return null;
  
  // Get all unique question IDs
  const allQuestionIds = new Set<string>();
  responses.forEach(response => {
    Object.keys(response.responses).forEach(id => allQuestionIds.add(id));
  });
  
  const headers = [
    anonymize ? 'Response Hash' : 'Response ID',
    'Survey ID',
    'Timestamp',
    'Type',
    ...Array.from(allQuestionIds)
  ];
  
  const csvContent = [
    headers.join(','),
    ...responses.map(response => [
      anonymize ? response.id.slice(-8) : response.id,
      response.survey_id,
      response.created_at,
      response.participant_id ? 'Authenticated' : 'Anonymous',
      ...Array.from(allQuestionIds).map(id => `"${response.responses[id] || ''}"`)
    ].join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `survey-responses-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
  
  console.log('CSV export completed:', {
    responseCount: responses.length,
    anonymized: anonymize,
    timestamp: new Date().toISOString()
  });
};

// Check if user is authenticated (for admin functions)
export const checkAuth = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
};

// Get user profile (for admin functions)
export const getUserProfile = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data;
};
