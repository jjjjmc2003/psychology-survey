import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Download, Shield, BarChart3, PieChart, TrendingUp, LogOut, AlertTriangle, Trash2, Users } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import DataVisualizations from './DataVisualizations';
import AdminInviteSection from './AdminInviteSection';
import { AgeAnalysis } from './AgeAnalysis';
import { getStoredResponses, exportSecureCSV } from '@/utils/supabaseStorage';
import { useAuth } from './AuthWrapper';
import { supabase } from '@/integrations/supabase/client';

// Define the interface that matches our Supabase data structure
interface AdminSurveyResponse {
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

const AdminDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [surveyResponses, setSurveyResponses] = useState<AdminSurveyResponse[]>([]);
  const [selectedResponse, setSelectedResponse] = useState<AdminSurveyResponse | null>(null);
  const { toast } = useToast();
  const { user, signOut, loading } = useAuth();

  useEffect(() => {
    if (user) {
      loadSurveyData();
      logAdminAction('dashboard_accessed', 'admin_dashboard');
    }
  }, [user]);

  const logAdminAction = async (action: string, resourceType: string, resourceId?: string, details?: Record<string, any>) => {
    try {
      await supabase.rpc('log_admin_action', {
        p_action: action,
        p_resource_type: resourceType,
        p_resource_id: resourceId,
        p_details: details || {}
      });
    } catch (error) {
      console.warn('Failed to log admin action:', error);
    }
  };

  const loadSurveyData = async () => {
    try {
      setIsLoading(true);
      const responses = await getStoredResponses();
      setSurveyResponses(responses);
      console.log('Loaded survey responses from Supabase:', responses.length);
    } catch (error) {
      console.error('Error loading survey data:', error);
      toast({
        title: "Data Load Error",
        description: "Failed to load survey responses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logAdminAction('admin_logout', 'auth_session');
      await signOut();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSecureExport = async () => {
    if (surveyResponses.length === 0) {
      toast({
        title: "No Data to Export",
        description: "There are no survey responses to export.",
        variant: "destructive",
      });
      return;
    }

    try {
      await logAdminAction('data_export', 'survey_responses', undefined, {
        response_count: surveyResponses.length,
        export_type: 'anonymized_csv'
      });
      
      exportSecureCSV(surveyResponses, true); // Anonymized export
      toast({
        title: "Export Successful",
        description: "Survey data has been exported securely with anonymization.",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export survey data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteResponse = async (responseId: string) => {
    try {
      await logAdminAction('response_delete_attempt', 'survey_response', responseId);
      
      const { error } = await supabase
        .from('survey_responses')
        .delete()
        .eq('id', responseId);

      if (error) {
        console.error('Error deleting survey response:', error);
        await logAdminAction('response_delete_failed', 'survey_response', responseId, { error: error.message });
        toast({
          title: "Delete Failed",
          description: "Failed to delete survey response. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Remove the deleted response from local state
      setSurveyResponses(prev => prev.filter(response => response.id !== responseId));
      
      await logAdminAction('response_deleted', 'survey_response', responseId);
      toast({
        title: "Response Deleted",
        description: "Survey response has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting survey response:', error);
      await logAdminAction('response_delete_error', 'survey_response', responseId, { error: String(error) });
      toast({
        title: "Delete Failed",
        description: "Failed to delete survey response. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Transform data for DataVisualizations component
  const transformDataForVisualization = (responses: AdminSurveyResponse[]) => {
    return responses.map(response => ({
      id: response.id,
      surveyId: response.survey_id,
      responses: response.responses,
      timestamp: response.created_at,
      metadata: response.metadata || {}
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // AuthWrapper will handle redirecting to auth page
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Psychology Research Dashboard</h1>
              <p className="text-gray-600">Mental Health & Cosmetic Surgery Analysis</p>
              <p className="text-sm text-blue-600 mt-1">Welcome, {user.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                <Shield className="w-4 h-4 mr-2" />
                Secured & Audited
              </div>
              <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="age-analysis" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Age Analysis
            </TabsTrigger>
            <TabsTrigger value="responses" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Raw Data
            </TabsTrigger>
            <TabsTrigger value="admin-management" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Admin Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading survey data...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total Responses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">{surveyResponses.length}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Female Participants</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-pink-600">
                      {surveyResponses.filter(r => r.responses.sex === 'Female').length}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Completion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      {surveyResponses.length > 0 ? '100%' : '0%'}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Latest Response</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-600">
                      {surveyResponses.length > 0 
                        ? new Date(surveyResponses[0].created_at).toLocaleString()
                        : 'No responses yet'
                      }
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics">
            <DataVisualizations responses={transformDataForVisualization(surveyResponses)} />
          </TabsContent>

          <TabsContent value="age-analysis">
            <AgeAnalysis responses={surveyResponses} />
          </TabsContent>

          <TabsContent value="responses">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Survey Response Details</h2>
              <div className="space-x-4">
                <Button onClick={handleSecureExport} disabled={surveyResponses.length === 0}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Secure CSV
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Response ID</TableHead>
                      <TableHead>Survey Variation</TableHead>
                      <TableHead>Sex</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {surveyResponses.map((response) => (
                      <TableRow key={response.id}>
                        <TableCell className="font-mono text-sm">
                          {response.id.slice(-8)}
                        </TableCell>
                        <TableCell>{response.survey_id}</TableCell>
                        <TableCell>{response.responses.sex || 'N/A'}</TableCell>
                        <TableCell>{response.responses.age || 'N/A'}</TableCell>
                        <TableCell>{new Date(response.created_at).toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedResponse(response);
                                logAdminAction('response_viewed', 'survey_response', response.id);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this survey response.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteResponse(response.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {surveyResponses.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No survey responses yet
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin-management">
            <AdminInviteSection />
          </TabsContent>
        </Tabs>

        {selectedResponse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Response Details - {selectedResponse.id.slice(-8)}</CardTitle>
                <p className="text-sm text-gray-600">
                  Survey: {selectedResponse.survey_id} | 
                  Completed: {new Date(selectedResponse.created_at).toLocaleString()}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(selectedResponse.responses).map(([questionId, answer]) => (
                    <div key={questionId} className="border-b pb-3">
                      <dt className="font-medium text-gray-900 mb-1">
                        {questionId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </dt>
                      <dd className="text-gray-700">{answer}</dd>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <Button onClick={() => setSelectedResponse(null)}>
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
