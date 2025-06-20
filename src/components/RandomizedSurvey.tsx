
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SurveyQuestion from './SurveyQuestion';
import SurveyCompletion from './SurveyCompletion';
import { SurveyVariation, getRandomSurvey } from '@/data/surveyVariations';
import { FileText, Shuffle } from 'lucide-react';

const RandomizedSurvey: React.FC = () => {
  const [currentSurvey, setCurrentSurvey] = useState<SurveyVariation | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const loadRandomSurvey = () => {
    const survey = getRandomSurvey();
    setCurrentSurvey(survey);
    setCurrentQuestionIndex(0);
    setResponses({});
    setIsCompleted(false);
    setHasStarted(false);
    console.log('Loaded survey variation:', survey.id, survey.title);
    console.log('Random questions included:', survey.questions.slice(30).map(q => q.id));
  };

  useEffect(() => {
    loadRandomSurvey();
  }, []);

  const startSurvey = () => {
    setHasStarted(true);
  };

  const handleAnswer = (questionId: string, value: string) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const saveResponse = () => {
    if (!currentSurvey) return;

    const responseData = {
      id: `response-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      surveyId: currentSurvey.id,
      timestamp: new Date().toISOString(),
      responses: responses
    };

    // Save to localStorage
    const existingResponses = JSON.parse(localStorage.getItem('surveyResponses') || '[]');
    existingResponses.push(responseData);
    localStorage.setItem('surveyResponses', JSON.stringify(existingResponses));

    console.log('Survey response saved:', responseData);
  };

  const handleNext = () => {
    if (!currentSurvey) return;

    if (currentQuestionIndex < currentSurvey.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Survey completed - save the response
      saveResponse();
      setIsCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    loadRandomSurvey();
  };

  if (!currentSurvey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading survey...</p>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <SurveyCompletion onRestart={handleRestart} />
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <Card className="max-w-lg w-full border-0 shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
              {currentSurvey.title}
            </CardTitle>
            <p className="text-gray-600">{currentSurvey.description}</p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center text-sm text-blue-700 mb-1">
                  <Shuffle className="w-4 h-4 mr-2" />
                  Randomized Survey
                </div>
                <p className="text-xs text-blue-600">
                  33 questions total (30 standard + 3 randomized)
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">
                  {currentSurvey.questions.length} questions
                </p>
                <p className="text-xs text-gray-500">
                  Estimated time: {Math.ceil(currentSurvey.questions.length * 0.75)} minutes
                </p>
              </div>
              
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <p className="text-xs text-yellow-800">
                  This research study examines mental health and body image. Your responses are anonymous and will be used for academic research purposes only.
                </p>
              </div>
              
              <Button 
                onClick={startSurvey}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                Begin Survey
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = currentSurvey.questions[currentQuestionIndex];
  const currentResponse = responses[currentQuestion.id] || '';
  const canGoNext = !currentQuestion.required || currentResponse.trim() !== '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <SurveyQuestion
        question={currentQuestion}
        currentQuestion={currentQuestionIndex}
        totalQuestions={currentSurvey.questions.length}
        value={currentResponse}
        onChange={(value) => handleAnswer(currentQuestion.id, value)}
        onNext={handleNext}
        onPrevious={handlePrevious}
        canGoNext={canGoNext}
        isFirst={currentQuestionIndex === 0}
        isLast={currentQuestionIndex === currentSurvey.questions.length - 1}
      />
    </div>
  );
};

export default RandomizedSurvey;
