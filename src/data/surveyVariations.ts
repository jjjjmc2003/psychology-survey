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
    title: '(Questions 1-6 will be about yourself)',
    type: 'dropdown',
    question: 'What is your age?',
    options: [
      ...Array.from({ length: 82 }, (_, i) => (i + 18).toString()), // 18-99
      '99+'
    ],
    required: false,
  },
  {
    id: 'gender',
    type: 'multiple-choice',
    question: 'What is your gender identity?',
    options: ['Woman', 'Man', 'Other'],
    required: false,
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
    required: false,
  },
  {
    id: 'social-media-platforms',
    type: 'multi-select',
    question: 'Which social media platforms do you use regularly? (Select all that apply)',
    options: ['Instagram', 'TikTok', 'Facebook', 'Snapchat', 'YouTube', 'Twitter/X', 'Other'],
    required: false,
  },
  {
    id: 'beauty-content-engagement',
    type: 'multiple-choice',
    question: 'How often do you engage with beauty-related content on social media? (e.g., following beauty influencers, liking/commenting on beauty posts)',
    options: ['Never', 'Occasionally', 'Sometimes', 'Often', 'Very Often'],
    required: false,
  },
  {
    id: 'photo-filters',
    type: 'multiple-choice',
    question: 'Do you use photo-enhancing tools or filters on images of yourself before posting on social media?',
    options: ['Never', 'Occasionally', 'Sometimes', 'Often', 'Always'],
    required: false,
  },
];

// Image display questions for randomization
const generateImageQuestions = (imageGroup: 'A' | 'B'): Question[] => [
  {
    id: 'image-display',
    type: 'image-display',
    question: imageGroup === 'A' 
      ? '' 
      : '',
    instruction: imageGroup === 'A' 
      ? 'Please view the following images. Afterward, you\'ll be asked a few questions about your perceptions and attitudes.'
      : 'Please view the following images. Afterward, you\'ll be asked a few questions about your perceptions and attitudes.',
    imageGroup: imageGroup,
    required: false,
  },
  {
    id: 'women-count',
    title: 'Section 1: Body Image State Scale (BISS). This section asks you how you feel right now, at this very moment about your physical appearance. You will be presented with 6 items. For each item, please select the response that best reflects how you feel at this exact moment.Please answer each item based on your current feelings, not how you usually feel or how you wish you felt.'
    type: 'multiple-choice',
    question: 'How many women were you shown?',
    options: ['1', '2', '3', '4', '5'],
    required: false,
  },
];

// Body Image State Scale (BISS) questions
const bissQuestions: Question[] = [
  {
    id: 'biss-satisfied-appearance',
    type: 'rating',
    question: 'I feel satisfied with my appearance.',
    instruction: 'Please rate how you feel right now using the scale below.',
    scale: { min: 1, max: 9, labels: ['Not at all', 'Extremely'] },
    required: false,
  },
  {
    id: 'biss-physically-attractive',
    type: 'rating',
    question: 'I feel physically attractive.',
    instruction: 'Please rate how you feel right now using the scale below.',
    scale: { min: 1, max: 9, labels: ['Not at all', 'Extremely'] },
    required: false,
  },
  {
    id: 'biss-satisfied-weight',
    type: 'rating',
    question: 'I feel satisfied with my weight.',
    instruction: 'Please rate how you feel right now using the scale below.',
    scale: { min: 1, max: 9, labels: ['Not at all', 'Extremely'] },
    required: false,
  },
  {
    id: 'biss-happy-look',
    type: 'rating',
    question: 'I feel happy with the way I look.',
    instruction: 'Please rate how you feel right now using the scale below.',
    scale: { min: 1, max: 9, labels: ['Not at all', 'Extremely'] },
    required: false,
  },
  {
    id: 'biss-unhappy-appearance',
    type: 'rating',
    question: 'I feel unhappy with my appearance.',
    instruction: 'Please rate how you feel right now using the scale below.',
    scale: { min: 1, max: 9, labels: ['Not at all', 'Extremely'] },
    required: false,
  },
  {
    id: 'biss-comfortable-body',
    type: 'rating',
    question: 'I feel comfortable with my body.',
    instruction: 'Please rate how you feel right now using the scale below.',
    scale: { min: 1, max: 9, labels: ['Not at all', 'Extremely'] },
    required: false,
  },
];

// Acceptance of Cosmetic Surgery Scale (ACSS) questions
const acssQuestions: Question[] = [
  {
    id: 'acss-enhance-self-image',
    type: 'rating',
    question: 'It makes sense to have cosmetic surgery to enhance self-image.',
    instruction: 'Please indicate how much you agree or disagree with each statement.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: false,
  },
  {
    id: 'acss-beneficial-tool',
    type: 'rating',
    question: 'Cosmetic surgery can be a beneficial tool for self-improvement.',
    instruction: 'Please indicate how much you agree or disagree with each statement.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: false,
  },
  {
    id: 'acss-feel-better',
    type: 'rating',
    question: 'It is reasonable to have cosmetic surgery if it can make you feel better about yourself.',
    instruction: 'Please indicate how much you agree or disagree with each statement.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: false,
  },
  {
    id: 'acss-career-benefit',
    type: 'rating',
    question: 'If it would benefit my career, I would think about having cosmetic surgery.',
    instruction: 'Please indicate how much you agree or disagree with each statement.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: false,
  },
  {
    id: 'acss-attractive-others',
    type: 'rating',
    question: 'I would seriously consider having cosmetic surgery if I thought it would make me more attractive to others.',
    instruction: 'Please indicate how much you agree or disagree with each statement.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: false,
  },
  {
    id: 'acss-relationship',
    type: 'rating',
    question: 'I would think about having cosmetic surgery if it helped me get or keep a relationship.',
    instruction: 'Please indicate how much you agree or disagree with each statement.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: false,
  },
  {
    id: 'acss-never-consider',
    type: 'rating',
    question: 'I would never consider having cosmetic surgery.',
    instruction: 'Please indicate how much you agree or disagree with each statement.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: false,
  },
  {
    id: 'acss-sometimes-thought',
    type: 'rating',
    question: 'I have sometimes thought about having cosmetic surgery.',
    instruction: 'Please indicate how much you agree or disagree with each statement.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: false,
  },
  {
    id: 'acss-might-consider',
    type: 'rating',
    question: 'I might consider having cosmetic surgery in the future.',
    instruction: 'Please indicate how much you agree or disagree with each statement.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: false,
  },
  {
    id: 'acss-no-side-effects',
    type: 'rating',
    question: 'If I knew there would be no negative side effects or pain, I would consider cosmetic surgery.',
    instruction: 'Please indicate how much you agree or disagree with each statement.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: false,
  },
  {
    id: 'acss-if-free',
    type: 'rating',
    question: 'If cosmetic surgery were free, I would consider trying it.',
    instruction: 'Please indicate how much you agree or disagree with each statement.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: false,
  },
  {
    id: 'acss-not-embarrassed',
    type: 'rating',
    question: 'I would not be embarrassed if people knew I had cosmetic surgery.',
    instruction: 'Please indicate how much you agree or disagree with each statement.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: false,
  },
  {
    id: 'acss-positive-psychological',
    type: 'rating',
    question: 'I believe that cosmetic surgery can have positive psychological effects.',
    instruction: 'Please indicate how much you agree or disagree with each statement.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: false,
  },
  {
    id: 'acss-unhappy-should-consider',
    type: 'rating',
    question: 'People who are unhappy with their appearance should consider cosmetic surgery.',
    instruction: 'Please indicate how much you agree or disagree with each statement.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: false,
  },
  {
    id: 'acss-good-option',
    type: 'rating',
    question: 'Cosmetic surgery is a good option for people who want to improve their body.',
    instruction: 'Please indicate how much you agree or disagree with each statement.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: false,
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
    title: 'The Impact of Edited Beauty-Related Content on Body Image Satisfaction and Acceptance of Cosmetic Procedures',
    description: 'Principal Investigator: Martha Castillo, B.A., Student Investigator, Keiser University \n Co-Investigator(s) or Faculty Advisor: Dr. Lori Daniels, Ph.D., Keiser University (Faculty Advisor) Dr. Jennifer Danilowski, Ph.D., Keiser University (Committee Member) Dr. Steven Whitaker, Ph.D., Keiser University (Committee Member)',
    questions: allQuestions,
  };
};

export const getRandomSurvey = (): SurveyVariation => {
  return generateRandomizedSurvey();
};