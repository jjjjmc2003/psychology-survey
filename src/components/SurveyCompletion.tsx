
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

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
            Thank You!
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-gray-600 mb-6">
            Your responses have been recorded. We appreciate you taking the time to complete our survey.
          </p>
          <Button
            onClick={onRestart}
            className="px-8 py-2 bg-blue-600 hover:bg-blue-700"
          >
            Take Another Survey
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurveyCompletion;
