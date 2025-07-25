import { Question } from '@/components/SurveyQuestion';

export interface SurveyVariation {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

// Fixed demographic and social media questions
const demographicQuestions: Question[] = [
  {
    id: 'age',
    type: 'dropdown',
    question: 'What is your age?',
    options: ['18–24', '25–34', '35–44', '45–54', '55–64', '65 or older'],
    required: true,
  },
  {
    id: 'gender',
    type: 'multiple-choice',
    question: 'What is your gender identity?',
    options: ['Woman', 'Man', 'Other'],
    required: true,
  },
  {
    id: 'race-ethnicity',
    type: 'multi-select',
    question: 'How do you identify your race/ethnicity? (Select all that apply)',
    options: [
      'White',
      'Black or African American',
      'Hispanic',
      'Asian',
      'Native American or Alaska Native',
      'Native Hawaiian or Pacific Islander',
      'Other'
    ],
    required: true,
  },
  {
    id: 'social-media-platforms',
    type: 'multi-select',
    question: 'Which social media platforms do you use regularly? (Select all that apply)',
    options: ['Instagram', 'TikTok', 'Facebook', 'Snapchat', 'YouTube', 'Twitter/X', 'Other'],
    required: true,
  },
  {
    id: 'beauty-content-engagement',
    type: 'multiple-choice',
    question: 'How often do you engage with beauty-related content on social media? (e.g., following beauty influencers, liking/commenting on beauty posts)',
    options: ['Never', 'Occasionally', 'Sometimes', 'Often', 'Very Often'],
    required: true,
  },
  {
    id: 'photo-filters',
    type: 'multiple-choice',
    question: 'Do you use photo-enhancing tools or filters on images of yourself before posting on social media?',
    options: ['Never', 'Occasionally', 'Sometimes', 'Often', 'Always'],
    required: true,
  },
];

// Image display questions for randomization
const generateImageQuestions = (imageGroup: 'A' | 'B'): Question[] => [
  {
    id: 'image-display',
    type: 'image-display',
    question: imageGroup === 'A' 
      ? '' 
      : 'GROUP B – Unedited + Edited Images',
    instruction: imageGroup === 'A' 
      ? 'Please view the following 5 images. Afterward, you\'ll be asked a few questions about your perceptions and attitudes.'
      : 'Please view the following 5 sets of images. Each set shows the original image followed by an edited version. Afterward, you\'ll be asked a few questions about your perceptions and attitudes.',
    imageGroup: imageGroup,
    required: true,
  },
  {
    id: 'women-count',
    type: 'multiple-choice',
    question: 'How many women were you shown?',
    options: ['1', '2', '3', '4', '5'],
    required: true,
  },
];

// Body Image State Scale (BISS) questions
const bissQuestions: Question[] = [
  {
    id: 'biss-satisfied-appearance',
    type: 'rating',
    question: 'I feel satisfied with my appearance.',
    scale: { min: 1, max: 9, labels: ['Not at all', 'Extremely'] },
    required: true,
  },
  {
    id: 'biss-physically-attractive',
    type: 'rating',
    question: 'I feel physically attractive.',
    scale: { min: 1, max: 9, labels: ['Not at all', 'Extremely'] },
    required: true,
  },
  {
    id: 'biss-satisfied-weight',
    type: 'rating',
    question: 'I feel satisfied with my weight.',
    scale: { min: 1, max: 9, labels: ['Not at all', 'Extremely'] },
    required: true,
  },
  {
    id: 'biss-happy-look',
    type: 'rating',
    question: 'I feel happy with the way I look.',
    scale: { min: 1, max: 9, labels: ['Not at all', 'Extremely'] },
    required: true,
  },
  {
    id: 'biss-unhappy-appearance',
    type: 'rating',
    question: 'I feel unhappy with my appearance. (reverse-scored)',
    scale: { min: 1, max: 9, labels: ['Not at all', 'Extremely'] },
    required: true,
  },
  {
    id: 'biss-comfortable-body',
    type: 'rating',
    question: 'I feel comfortable with my body.',
    scale: { min: 1, max: 9, labels: ['Not at all', 'Extremely'] },
    required: true,
  },
];

// Acceptance of Cosmetic Surgery Scale (ACSS) questions
const acssQuestions: Question[] = [
  {
    id: 'acss-enhance-self-image',
    type: 'rating',
    question: 'It makes sense to have cosmetic surgery to enhance self-image.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: true,
  },
  {
    id: 'acss-beneficial-tool',
    type: 'rating',
    question: 'Cosmetic surgery can be a beneficial tool for self-improvement.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: true,
  },
  {
    id: 'acss-feel-better',
    type: 'rating',
    question: 'It is reasonable to have cosmetic surgery if it can make you feel better about yourself.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: true,
  },
  {
    id: 'acss-career-benefit',
    type: 'rating',
    question: 'If it would benefit my career, I would think about having cosmetic surgery.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: true,
  },
  {
    id: 'acss-attractive-others',
    type: 'rating',
    question: 'I would seriously consider having cosmetic surgery if I thought it would make me more attractive to others.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: true,
  },
  {
    id: 'acss-relationship',
    type: 'rating',
    question: 'I would think about having cosmetic surgery if it helped me get or keep a relationship.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: true,
  },
  {
    id: 'acss-never-consider',
    type: 'rating',
    question: 'I would never consider having cosmetic surgery. (reverse-scored)',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: true,
  },
  {
    id: 'acss-sometimes-thought',
    type: 'rating',
    question: 'I have sometimes thought about having cosmetic surgery.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: true,
  },
  {
    id: 'acss-might-consider',
    type: 'rating',
    question: 'I might consider having cosmetic surgery in the future.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: true,
  },
  {
    id: 'acss-no-side-effects',
    type: 'rating',
    question: 'If I knew there would be no negative side effects or pain, I would consider cosmetic surgery.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: true,
  },
  {
    id: 'acss-if-free',
    type: 'rating',
    question: 'If cosmetic surgery were free, I would consider trying it.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: true,
  },
  {
    id: 'acss-not-embarrassed',
    type: 'rating',
    question: 'I would not be embarrassed if people knew I had cosmetic surgery.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: true,
  },
  {
    id: 'acss-positive-psychological',
    type: 'rating',
    question: 'I believe that cosmetic surgery can have positive psychological effects.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: true,
  },
  {
    id: 'acss-unhappy-should-consider',
    type: 'rating',
    question: 'People who are unhappy with their appearance should consider cosmetic surgery.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: true,
  },
  {
    id: 'acss-good-option',
    type: 'rating',
    question: 'Cosmetic surgery is a good option for people who want to improve their body.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: true,
  },
];

// Generate a survey with randomized image group
export const generateRandomizedSurvey = (): SurveyVariation => {
  // Randomly assign to Group A or B
  const imageGroup: 'A' | 'B' = Math.random() < 0.5 ? 'A' : 'B';
  
  // Generate image questions based on group
  const imageQuestions = generateImageQuestions(imageGroup);

  // Combine all questions in order
  const allQuestions = [
    ...demographicQuestions,
    ...imageQuestions,
    ...bissQuestions,
    ...acssQuestions,
  ];
  
  return {
    id: `body-image-surgery-study-group-${imageGroup}`,
    title: 'Body Image and Cosmetic Surgery Attitudes Study',
    description: 'A research study examining the relationship between body image, social media usage, and attitudes toward cosmetic surgery',
    questions: allQuestions,
  };
};

export const getRandomSurvey = (): SurveyVariation => {
  return generateRandomizedSurvey();
};