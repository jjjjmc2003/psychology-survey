
import { Question } from '@/components/SurveyQuestion';

export interface SurveyVariation {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export const surveyVariations: SurveyVariation[] = [
  {
    id: 'customer-satisfaction-v1',
    title: 'Customer Satisfaction Survey',
    description: 'Help us improve your experience',
    questions: [
      {
        id: 'satisfaction',
        type: 'rating',
        question: 'How satisfied are you with our service?',
        required: true,
      },
      {
        id: 'recommendation',
        type: 'multiple-choice',
        question: 'How likely are you to recommend us to a friend?',
        options: ['Very likely', 'Likely', 'Neutral', 'Unlikely', 'Very unlikely'],
        required: true,
      },
      {
        id: 'feedback',
        type: 'text',
        question: 'What could we improve?',
        required: false,
      },
    ],
  },
  {
    id: 'product-feedback-v2',
    title: 'Product Feedback Survey',
    description: 'Tell us about your product experience',
    questions: [
      {
        id: 'usage-frequency',
        type: 'multiple-choice',
        question: 'How often do you use our product?',
        options: ['Daily', 'Weekly', 'Monthly', 'Rarely', 'First time'],
        required: true,
      },
      {
        id: 'ease-of-use',
        type: 'rating',
        question: 'Rate the ease of use (1-5)',
        required: true,
      },
      {
        id: 'favorite-feature',
        type: 'text',
        question: 'What is your favorite feature and why?',
        required: false,
      },
      {
        id: 'missing-features',
        type: 'text',
        question: 'What features would you like to see added?',
        required: false,
      },
    ],
  },
  {
    id: 'user-experience-v3',
    title: 'User Experience Study',
    description: 'Share your thoughts on our website',
    questions: [
      {
        id: 'first-impression',
        type: 'multiple-choice',
        question: 'What was your first impression of our website?',
        options: ['Excellent', 'Good', 'Average', 'Poor', 'Very poor'],
        required: true,
      },
      {
        id: 'navigation',
        type: 'rating',
        question: 'How easy was it to find what you were looking for?',
        required: true,
      },
      {
        id: 'design-rating',
        type: 'rating',
        question: 'How would you rate our visual design?',
        required: true,
      },
      {
        id: 'suggestions',
        type: 'text',
        question: 'Any suggestions for improvement?',
        required: false,
      },
    ],
  },
  {
    id: 'brand-awareness-v4',
    title: 'Brand Awareness Survey',
    description: 'Help us understand brand perception',
    questions: [
      {
        id: 'brand-familiarity',
        type: 'multiple-choice',
        question: 'How familiar are you with our brand?',
        options: ['Very familiar', 'Somewhat familiar', 'Not very familiar', 'Never heard of it'],
        required: true,
      },
      {
        id: 'brand-trust',
        type: 'rating',
        question: 'How much do you trust our brand?',
        required: true,
      },
      {
        id: 'discovery-method',
        type: 'multiple-choice',
        question: 'How did you first hear about us?',
        options: ['Social media', 'Search engine', 'Word of mouth', 'Advertisement', 'Other'],
        required: true,
      },
      {
        id: 'brand-perception',
        type: 'text',
        question: 'What words come to mind when you think of our brand?',
        required: false,
      },
    ],
  },
];

export const getRandomSurvey = (): SurveyVariation => {
  const randomIndex = Math.floor(Math.random() * surveyVariations.length);
  return surveyVariations[randomIndex];
};
