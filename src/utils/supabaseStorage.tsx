
import { supabase } from '@/integrations/supabase/client';
import { validateSurveyResponse } from './validation';

interface SurveyResponse {
  id: string;
  survey_id: string;
  participant_id: string;
  responses: Record<string, string>;
  metadata: Record<string, any>;
  ip_hash?: string;
  user_agent?: string;
  completion_time?: string;
  created_at: string;
  updated_at: string;
}

// Generate a simple hash for IP addresses (for rate limiting)
const hashIP = async (ip: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + 'survey-salt-key');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
};

// Save survey response to Supabase
export const saveSecureResponse = async (responseData: {
  surveyId: string;
  responses: Record<string, string>;
}) => {
  try {
    // Validate and sanitize responses
    const validation = validateSurveyResponse(responseData.responses);
    
    if (!validation.isValid) {
      console.warn('Validation errors:', validation.errors);
    }

    // Get client IP hash for rate limiting (in production, this would be server-side)
    let ipHash = '';
    try {
      ipHash = await hashIP('client-session-' + Date.now());
    } catch (error) {
      console.warn('Could not generate IP hash:', error);
    }

    // Use the Supabase function for secure insertion
    const { data, error } = await supabase.rpc('submit_survey_response', {
      p_survey_id: responseData.surveyId,
      p_responses: validation.data,
      p_completion_time: null,
      p_ip_hash: ipHash
    });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Survey response saved securely to Supabase:', data);
    return { success: true, id: data };
  } catch (error) {
    console.error('Error saving secure response:', error);
    return { success: false, error: 'Failed to save response securely' };
  }
};

// Get stored responses from Supabase (for admins)
export const getStoredResponses = async (): Promise<SurveyResponse[]> => {
  try {
    const { data, error } = await supabase
      .from('survey_responses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error retrieving stored responses:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error retrieving stored responses:', error);
    return [];
  }
};

// Export CSV with data anonymization
export const exportSecureCSV = (responses: SurveyResponse[], anonymize: boolean = true) => {
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
    ...Array.from(allQuestionIds)
  ];
  
  const csvContent = [
    headers.join(','),
    ...responses.map(response => [
      anonymize ? response.id.slice(-8) : response.id,
      response.survey_id,
      response.created_at,
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

// Check if user is authenticated
export const checkAuth = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
};

// Get user profile
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
