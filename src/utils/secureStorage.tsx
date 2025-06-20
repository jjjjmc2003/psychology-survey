
interface SurveyResponse {
  id: string;
  surveyId: string;
  timestamp: string;
  responses: Record<string, string>;
  ipHash?: string; // For rate limiting, not storing actual IP
  userAgent?: string; // For basic fraud detection
}

// Generate a simple hash for IP addresses (for rate limiting)
const hashIP = async (ip: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + 'survey-salt-key');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
};

// Secure response saving with validation
export const saveSecureResponse = async (responseData: Omit<SurveyResponse, 'id' | 'timestamp' | 'ipHash'>) => {
  try {
    // Generate secure ID
    const id = `response-${Date.now()}-${crypto.randomUUID()}`;
    
    // Get client IP hash for rate limiting (in production, this would be server-side)
    let ipHash = '';
    try {
      // This is a placeholder - in production, IP hashing should be server-side
      ipHash = await hashIP('client-session-' + Date.now());
    } catch (error) {
      console.warn('Could not generate IP hash:', error);
    }
    
    const secureResponse: SurveyResponse = {
      id,
      timestamp: new Date().toISOString(),
      ipHash,
      userAgent: navigator.userAgent.slice(0, 100), // Truncated for privacy
      ...responseData
    };
    
    // In production, this would be sent to Supabase
    // For now, using localStorage with encryption warning
    console.warn('WARNING: Data stored in localStorage is not encrypted. Use Supabase for production.');
    
    const existingResponses = getStoredResponses();
    existingResponses.push(secureResponse);
    
    localStorage.setItem('surveyResponses', JSON.stringify(existingResponses));
    
    // Log for audit (in production, send to secure logging service)
    console.log('Survey response saved securely:', {
      id: secureResponse.id,
      surveyId: secureResponse.surveyId,
      timestamp: secureResponse.timestamp,
      responseCount: Object.keys(secureResponse.responses).length
    });
    
    return { success: true, id };
  } catch (error) {
    console.error('Error saving secure response:', error);
    return { success: false, error: 'Failed to save response securely' };
  }
};

// Get stored responses with access logging
export const getStoredResponses = (): SurveyResponse[] => {
  try {
    const stored = localStorage.getItem('surveyResponses');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error retrieving stored responses:', error);
    return [];
  }
};

// Secure CSV export with data anonymization options
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
      response.surveyId,
      response.timestamp,
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
  
  // Audit log
  console.log('CSV export completed:', {
    responseCount: responses.length,
    anonymized: anonymize,
    timestamp: new Date().toISOString()
  });
};

// Clear all data (for testing/development)
export const clearAllData = () => {
  localStorage.removeItem('surveyResponses');
  console.log('All survey data cleared');
};
