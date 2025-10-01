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
    type: 'multiple-choice',
    question: 'How many women were you shown?',
    options: ['1', '2', '3', '4', '5'],
    required: false,
  },
];

// Body Image State Scale (BISS) questions
const bissQuestions: Question[] = [
  {
    id: 'biss-physical-appearance',
    title: '(In this section, you will be presented with 6 items. For each item, please select the response that best reflects how you feel at this exact moment.Please answer each item based on your current feelings, not how you usually feel or how you wish you felt.)',
    type: 'multiple-choice',
    question: 'Right now I feel...',
    options: [
      'Extremely dissatisfied with my physical appearance',
      'Mostly dissatisfied with my physical appearance',
      'Moderately dissatisfied with my physical appearance',
      'Slightly dissatisfied with my physical appearance',
      'Neither dissatisfied nor satisfied with my physical appearance',
      'Slightly satisfied with my physical appearance',
      'Moderately satisfied with my physical appearance',
      'Mostly satisfied with my physical appearance',
      'Extremely satisfied with my physical appearance'
    ],
    required: false,
  },
  {
    id: 'biss-body-size-shape',
    type: 'multiple-choice',
    question: 'Right now I feel...',
    options: [
      'Extremely satisfied with my body size and shape',
      'Mostly satisfied with my body size and shape',
      'Moderately satisfied with my body size and shape',
      'Slightly satisfied with my body size and shape',
      'Neither dissatisfied nor satisfied with my body size and shape',
      'Slightly dissatisfied with my body size and shape',
      'Moderately dissatisfied with my body size and shape',
      'Mostly dissatisfied with my body size and shape',
      'Extremely dissatisfied with my body size and shape'
    ],
    required: false,
  },
  {
    id: 'biss-weight',
    type: 'multiple-choice',
    question: 'Right now I feel...',
    options: [
      'Extremely satisfied with my weight',
      'Mostly satisfied with my weight',
      'Moderately satisfied with my weight',
      'Slightly satisfied with my weight',
      'Neither dissatisfied nor satisfied with my weight',
      'Slightly dissatisfied with my weight',
      'Moderately dissatisfied with my weight',
      'Mostly dissatisfied with my weight',
      'Extremely dissatisfied with my weight'
    ],
    required: false,
  },
  {
    id: 'biss-physically-attractive',
    type: 'multiple-choice',
    question: 'Right now I feel...',
    options: [
      'Extremely physically attractive',
      'Very physically attractive',
      'Moderately physically attractive',
      'Slightly physically attractive',
      'Neither attractive nor unattractive',
      'Slightly physically unattractive',
      'Moderately physically unattractive',
      'Very physically unattractive',
      'Extremely physically unattractive'
    ],
    required: false,
  },
  {
    id: 'biss-looks-compared-usual',
    type: 'multiple-choice',
    question: 'Right now I feel...',
    options: [
      'A great deal worse about my looks than I usually feel',
      'Much worse about my looks than I usually feel',
      'Somewhat worse about my looks than I usually feel',
      'Just slightly worse about my looks than I usually feel',
      'About the same about my looks as usual',
      'Just slightly better about my looks than I usually feel',
      'Somewhat better about my looks than I usually feel',
      'Much better about my looks than I usually feel',
      'A great deal better about my looks than I usually feel'
    ],
    required: false,
  },
  {
    id: 'biss-compared-average',
    type: 'multiple-choice',
    question: 'Right now I feel that I look...',
    options: [
      'A great deal better than the average person looks',
      'Much better than the average person looks',
      'Somewhat better than the average person looks',
      'Just slightly better than the average person looks',
      'About the same as the average person looks',
      'Just slightly worse than the average person looks',
      'Somewhat worse than the average person looks',
      'Much worse than the average person looks',
      'A great deal worse than the average person looks'
    ],
    required: false,
  },
];

// Acceptance of Cosmetic Surgery Scale (ACSS) questions
const acssQuestions: Question[] = [
  {
    id: 'acss-enhance-self-image',
    title: '(In this section you will be asked to respond to 15 statements. These statements reflect personal beliefs, perceived social norms, and likelihood of considering surgery. Please respond based on your general beliefs or hypothetical considerations, not necessarily your past actions.)',
    type: 'rating',
    question: 'It makes sense to have minor cosmetic surgery rather than spending years feeling bad about the way you look',
    instruction: 'Please indicate how much you agree or disagree with each statement.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: false,
  },
  {
    id: 'acss-beneficial-tool',
    type: 'rating',
    question: 'Cosmetic surgery is a good thing because it can help people feel better about themselves.',
    instruction: 'Please indicate how much you agree or disagree with each statement.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: false,
  },
  {
    id: 'acss-feel-better',
    type: 'rating',
    question: 'In the future, I could end up having some kind of cosmetic surgery',
    instruction: 'Please indicate how much you agree or disagree with each statement.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: false,
  },
  {
    id: 'acss-career-benefit',
    type: 'rating',
    question: 'People who are very unhappy with their physical appearance should consider cosmetic surgery as one option',
    instruction: 'Please indicate how much you agree or disagree with each statement.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: false,
  },
  {
    id: 'acss-attractive-others',
    type: 'rating',
    question: 'If cosmetic surgery can make someone happier with the way they look, then they should try it',
    instruction: 'Please indicate how much you agree or disagree with each statement.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: false,
  },
  {
    id: 'acss-relationship',
    type: 'rating',
    question: 'If I could have a surgical procedure done for free I would consider trying cosmetic surgery',
    instruction: 'Please indicate how much you agree or disagree with each statement.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: false,
  },
  {
    id: 'acss-never-consider',
    type: 'rating',
    question: 'If I knew there would be no negative side effects or pain, I would like to try cosmetic surgery',
    instruction: 'Please indicate how much you agree or disagree with each statement.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: false,
  },
  {
    id: 'acss-sometimes-thought',
    type: 'rating',
    question: 'I have sometimes thought about having cosmetic surgery',
    instruction: 'Please indicate how much you agree or disagree with each statement.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: false,
  },
  {
    id: 'acss-might-consider',
    type: 'rating',
    question: 'I would seriously consider having cosmetic surgery if my partner thought it was a good idea',
    instruction: 'Please indicate how much you agree or disagree with each statement.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: false,
  },
  {
    id: 'acss-no-side-effects',
    type: 'rating',
    question: 'I would never have any kind of plastic surgery',
    instruction: 'Please indicate how much you agree or disagree with each statement.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: false,
  },
  {
    id: 'acss-if-free',
    type: 'rating',
    question: 'I would think about having cosmetic surgery in order to keep looking young',
    instruction: 'Please indicate how much you agree or disagree with each statement.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: false,
  },
  {
    id: 'acss-not-embarrassed',
    type: 'rating',
    question: 'If it would benefit my career I would think about having plastic surgery',
    instruction: 'Please indicate how much you agree or disagree with each statement.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: false,
  },
  {
    id: 'acss-positive-psychological',
    type: 'rating',
    question: 'I would seriously consider having cosmetic surgery if I thought my partner would find me more attractive',
    instruction: 'Please indicate how much you agree or disagree with each statement.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: false,
  },
  {
    id: 'acss-unhappy-should-consider',
    type: 'rating',
    question: "Cosmetic surgery can be a big benefit to people's self-image",
    instruction: 'Please indicate how much you agree or disagree with each statement.',
    scale: { min: 1, max: 7, labels: ['Strongly Disagree', 'Strongly Agree'] },
    required: false,
  },
  {
    id: 'acss-good-option',
    type: 'rating',
    question: 'If a simple cosmetic surgery procedure would make me more attractive to others, I would think about trying it',
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