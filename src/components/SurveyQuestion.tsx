
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface Question {
  id: string;
  type: 'multiple-choice' | 'multi-select' | 'text' | 'rating' | 'image-display' | 'dropdown';
  question: string;
  options?: string[];
  required?: boolean;
  imageGroup?: 'A' | 'B';
  imageSrc?: string;
  instruction?: string;
  scale?: { min: number; max: number; labels?: string[] };
  title?: string;
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

  const [selectedOptions, setSelectedOptions] = useState<string[]>(() => {
    try {
      return value ? JSON.parse(value) : [];
    } catch {
      return [];
    }
  });

  const handleMultiSelectChange = (option: string, checked: boolean) => {
    const newSelected = checked 
      ? [...selectedOptions, option]
      : selectedOptions.filter(item => item !== option);
    setSelectedOptions(newSelected);
    onChange(JSON.stringify(newSelected));
  };

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
      
      case 'multi-select':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Checkbox
                  id={`checkbox-${index}`}
                  checked={selectedOptions.includes(option)}
                  onCheckedChange={(checked) => handleMultiSelectChange(option, checked as boolean)}
                />
                <Label htmlFor={`checkbox-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      case 'dropdown':
        return (
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an option..." />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'image-display':
        const imageToShow = question.imageGroup === 'A' 
          ? '/lovable-uploads/b4e15463-8c57-4a26-be66-1b1105f76ec8.png'
          : '/lovable-uploads/95ad6e7d-2e88-4d17-baf5-62d95e42aed3.png';
        return (
          <div className="space-y-6">
            {question.instruction && (
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <p className="text-blue-800 font-medium">{question.instruction}</p>
              </div>
            )}
            <div className="flex justify-center">
              <img 
                src={imageToShow} 
                alt={`Survey images - Group ${question.imageGroup}`}
                className="max-w-full h-auto rounded-lg shadow-lg"
                onLoad={() => console.log('Image loaded successfully:', imageToShow)}
                onError={(e) => console.error('Image failed to load:', imageToShow, e)}
              />
            </div>
            <div className="text-center">
              <Button 
                onClick={() => {
                  onChange('viewed');
                  setTimeout(onNext, 500);
                }}
                className="mt-4"
              >
                Continue
              </Button>
            </div>
          </div>
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
        const scale = question.scale || { min: 1, max: 5 };
        const range = Array.from({ length: scale.max - scale.min + 1 }, (_, i) => scale.min + i);
        
        return (
          <div className="space-y-4">
            <div className="flex justify-center space-x-2 flex-wrap">
              {range.map((rating) => (
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
            {scale.labels && (
              <div className="flex justify-between text-sm text-gray-600 px-2">
                <span>{scale.labels[0]}</span>
                <span>{scale.labels[1]}</span>
              </div>
            )}
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
             <div className="text-x1 text-red-600 mb-2">{question.title}</div>
             <div></div>
             <div className="mt-2">{question.question}</div>
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
