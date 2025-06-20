
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Download, Lock } from 'lucide-react';

interface SurveyResponse {
  id: string;
  surveyId: string;
  timestamp: string;
  responses: Record<string, string>;
}

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [surveyResponses, setSurveyResponses] = useState<SurveyResponse[]>([]);
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);

  // Simple password authentication (in production, use proper authentication)
  const ADMIN_PASSWORD = 'psychology2024';

  useEffect(() => {
    // Load survey responses from localStorage
    const stored = localStorage.getItem('surveyResponses');
    if (stored) {
      setSurveyResponses(JSON.parse(stored));
    }
  }, []);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('Incorrect password');
    }
  };

  const exportToCSV = () => {
    if (surveyResponses.length === 0) return;

    // Get all unique question IDs
    const allQuestionIds = new Set<string>();
    surveyResponses.forEach(response => {
      Object.keys(response.responses).forEach(id => allQuestionIds.add(id));
    });

    const headers = ['Response ID', 'Survey ID', 'Timestamp', ...Array.from(allQuestionIds)];
    const csvContent = [
      headers.join(','),
      ...surveyResponses.map(response => [
        response.id,
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
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-0 shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Admin Access
            </CardTitle>
            <p className="text-gray-600">Enter password to view survey results</p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
              <Button onClick={handleLogin} className="w-full">
                Access Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Survey Response Dashboard</h1>
          <p className="text-gray-600">Psychology Research: Mental Health & Cosmetic Surgery</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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
              <CardTitle className="text-lg">Latest Response</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">
                {surveyResponses.length > 0 
                  ? new Date(surveyResponses[surveyResponses.length - 1].timestamp).toLocaleString()
                  : 'No responses yet'
                }
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Survey Responses</h2>
          <div className="space-x-4">
            <Button onClick={exportToCSV} disabled={surveyResponses.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
              Logout
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
                    <TableCell>{response.surveyId}</TableCell>
                    <TableCell>{response.responses.sex || 'N/A'}</TableCell>
                    <TableCell>{response.responses.age || 'N/A'}</TableCell>
                    <TableCell>{new Date(response.timestamp).toLocaleString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedResponse(response)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
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

        {selectedResponse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Response Details - {selectedResponse.id.slice(-8)}</CardTitle>
                <p className="text-sm text-gray-600">
                  Survey: {selectedResponse.surveyId} | 
                  Completed: {new Date(selectedResponse.timestamp).toLocaleString()}
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
