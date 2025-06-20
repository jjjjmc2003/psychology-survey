
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Shield } from 'lucide-react';

interface SurveyCompletionProps {
  onRestart: () => void;
}

const SurveyCompletion: React.FC<SurveyCompletionProps> = ({ onRestart }) => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="border-0 shadow-lg text-center">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Thank You for Your Participation!
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-gray-600 mb-6">
            Your responses have been securely recorded for this psychology research study. 
            Your participation helps advance our understanding of mental health and body image.
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-center text-sm text-blue-700 mb-2">
              <Shield className="w-4 h-4 mr-2" />
              Data Privacy
            </div>
            <p className="text-xs text-blue-600">
              All responses are anonymous and will be used solely for academic research purposes in accordance with research ethics guidelines.
            </p>
          </div>
          
          <Button
            onClick={onRestart}
            className="px-8 py-2 bg-blue-600 hover:bg-blue-700"
          >
            Take Survey Again
          </Button>
          
          <p className="text-xs text-gray-500 mt-4">
            Research administrators can access results at /admin
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurveyCompletion;
