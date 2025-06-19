
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

export interface Question {
  id: string;
  type: 'multiple-choice' | 'text' | 'rating';
  question: string;
  options?: string[];
  required?: boolean;
}

interface SurveyQuestionProps {
  question: Question;
  currentQuestion: number;
  totalQuestions: number;
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  isFirst: boolean;
  isLast: boolean;
}

const SurveyQuestion: React.FC<SurveyQuestionProps> = ({
  question,
  currentQuestion,
  totalQuestions,
  value,
  onChange,
  onNext,
  onPrevious,
  canGoNext,
  isFirst,
  isLast,
}) => {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <RadioGroup value={value} onValueChange={onChange} className="space-y-3">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
      case 'text':
        return (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your answer here..."
            className="min-h-[120px] resize-none"
          />
        );
      case 'rating':
        return (
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => onChange(rating.toString())}
                className={`w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                  value === rating.toString()
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">
            Question {currentQuestion + 1} of {totalQuestions}
          </span>
          <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-gray-800">
            {question.question}
            {question.required && <span className="text-red-500 ml-1">*</span>}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {renderQuestionContent()}
        </CardContent>
      </Card>

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isFirst}
          className="px-6"
        >
          Previous
        </Button>
        <Button
          onClick={onNext}
          disabled={!canGoNext}
          className="px-6 bg-blue-600 hover:bg-blue-700"
        >
          {isLast ? 'Submit' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default SurveyQuestion;
