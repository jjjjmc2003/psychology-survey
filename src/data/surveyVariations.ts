
import { Question } from '@/components/SurveyQuestion';

export interface SurveyVariation {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

// Fixed questions that appear in every survey
const fixedQuestions: Question[] = [
  {
    id: 'sex',
    type: 'multiple-choice',
    question: 'What is your biological sex?',
    options: ['Female', 'Male', 'Prefer not to answer'],
    required: true,
  },
  {
    id: 'age',
    type: 'multiple-choice',
    question: 'What is your age range?',
    options: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
    required: true,
  },
  {
    id: 'body-satisfaction',
    type: 'rating',
    question: 'How satisfied are you with your overall physical appearance? (1 = Very dissatisfied, 5 = Very satisfied)',
    required: true,
  },
  {
    id: 'social-media-hours',
    type: 'multiple-choice',
    question: 'How many hours per day do you spend on social media platforms?',
    options: ['Less than 1 hour', '1-2 hours', '3-4 hours', '5-6 hours', 'More than 6 hours'],
    required: true,
  },
  {
    id: 'cosmetic-consideration',
    type: 'multiple-choice',
    question: 'Have you ever considered cosmetic surgery or procedures?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very often'],
    required: true,
  },
  {
    id: 'media-influence',
    type: 'rating',
    question: 'How much do images in media (magazines, social media, TV) influence how you feel about your appearance? (1 = Not at all, 5 = Extremely)',
    required: true,
  },
  {
    id: 'self-esteem',
    type: 'rating',
    question: 'Rate your overall self-esteem (1 = Very low, 5 = Very high)',
    required: true,
  },
  {
    id: 'comparison-frequency',
    type: 'multiple-choice',
    question: 'How often do you compare your appearance to others on social media?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
    required: true,
  },
  {
    id: 'filter-usage',
    type: 'multiple-choice',
    question: 'How often do you use filters or editing apps on your photos?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
    required: true,
  },
  {
    id: 'anxiety-appearance',
    type: 'rating',
    question: 'How anxious do you feel about your appearance in social situations? (1 = Not anxious, 5 = Extremely anxious)',
    required: true,
  },
  {
    id: 'cosmetic-pressure',
    type: 'rating',
    question: 'How much pressure do you feel to alter your appearance through cosmetic procedures? (1 = No pressure, 5 = Extreme pressure)',
    required: true,
  },
  {
    id: 'body-dysmorphia',
    type: 'multiple-choice',
    question: 'Do you spend significant time thinking about perceived flaws in your appearance?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
    required: true,
  },
  {
    id: 'mirror-checking',
    type: 'multiple-choice',
    question: 'How often do you check your appearance in mirrors or reflective surfaces?',
    options: ['1-2 times per day', '3-5 times per day', '6-10 times per day', '11-20 times per day', 'More than 20 times per day'],
    required: true,
  },
  {
    id: 'beauty-standards',
    type: 'rating',
    question: 'How much do current beauty standards affect your self-perception? (1 = Not at all, 5 = Extremely)',
    required: true,
  },
  {
    id: 'cosmetic-research',
    type: 'multiple-choice',
    question: 'Have you researched cosmetic procedures online?',
    options: ['Never', 'Once or twice', 'A few times', 'Many times', 'Extensively'],
    required: true,
  },
  {
    id: 'photo-avoidance',
    type: 'multiple-choice',
    question: 'Do you avoid having your photo taken?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
    required: true,
  },
  {
    id: 'compliment-acceptance',
    type: 'multiple-choice',
    question: 'When someone compliments your appearance, how do you typically respond?',
    options: ['Accept gracefully', 'Feel uncomfortable', 'Dismiss or deflect', 'Don\'t believe them', 'Feel suspicious'],
    required: true,
  },
  {
    id: 'appearance-mood',
    type: 'rating',
    question: 'How much does your appearance affect your daily mood? (1 = Not at all, 5 = Extremely)',
    required: true,
  },
  {
    id: 'celebrity-comparison',
    type: 'multiple-choice',
    question: 'How often do you compare yourself to celebrities or influencers?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
    required: true,
  },
  {
    id: 'cosmetic-budget',
    type: 'multiple-choice',
    question: 'Have you ever saved money specifically for cosmetic procedures?',
    options: ['Never', 'Considered it', 'Started saving', 'Have saved some', 'Have saved enough'],
    required: true,
  },
  {
    id: 'peer-influence',
    type: 'rating',
    question: 'How much do your friends\' opinions about appearance influence you? (1 = Not at all, 5 = Extremely)',
    required: true,
  },
  {
    id: 'makeup-dependency',
    type: 'multiple-choice',
    question: 'How comfortable are you leaving the house without makeup?',
    options: ['Very comfortable', 'Somewhat comfortable', 'Neutral', 'Somewhat uncomfortable', 'Very uncomfortable'],
    required: true,
  },
  {
    id: 'body-part-focus',
    type: 'text',
    question: 'If you could change one thing about your appearance, what would it be? (Optional)',
    required: false,
  },
  {
    id: 'mental-health-impact',
    type: 'rating',
    question: 'How much do concerns about your appearance impact your mental health? (1 = Not at all, 5 = Extremely)',
    required: true,
  },
  {
    id: 'social-avoidance',
    type: 'multiple-choice',
    question: 'Do you avoid social situations because of appearance concerns?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
    required: true,
  },
  {
    id: 'exercise-motivation',
    type: 'multiple-choice',
    question: 'What is your primary motivation for exercise?',
    options: ['Health benefits', 'Appearance improvement', 'Stress relief', 'Social activity', 'Don\'t exercise regularly'],
    required: true,
  },
  {
    id: 'diet-behavior',
    type: 'multiple-choice',
    question: 'How would you describe your relationship with food and dieting?',
    options: ['Very healthy', 'Mostly healthy', 'Neutral', 'Somewhat problematic', 'Very problematic'],
    required: true,
  },
  {
    id: 'appearance-investment',
    type: 'multiple-choice',
    question: 'How much time do you spend on your appearance daily?',
    options: ['Less than 30 minutes', '30-60 minutes', '1-2 hours', '2-3 hours', 'More than 3 hours'],
    required: true,
  },
  {
    id: 'confidence-change',
    type: 'multiple-choice',
    question: 'How has your confidence about your appearance changed over the past 5 years?',
    options: ['Significantly improved', 'Somewhat improved', 'Stayed the same', 'Somewhat declined', 'Significantly declined'],
    required: true,
  },
  {
    id: 'support-system',
    type: 'rating',
    question: 'How supportive is your social circle regarding body positivity? (1 = Not supportive, 5 = Very supportive)',
    required: true,
  },
];

// Pool of questions from which 3 will be randomly selected
const randomizableQuestions: Question[] = [
  {
    id: 'cosmetic-stigma',
    type: 'rating',
    question: 'How much stigma do you think exists around cosmetic surgery? (1 = No stigma, 5 = Extreme stigma)',
    required: true,
  },
  {
    id: 'natural-beauty',
    type: 'rating',
    question: 'How important is "natural beauty" to you personally? (1 = Not important, 5 = Extremely important)',
    required: true,
  },
  {
    id: 'procedure-knowledge',
    type: 'multiple-choice',
    question: 'How knowledgeable are you about different cosmetic procedures?',
    options: ['Not knowledgeable', 'Slightly knowledgeable', 'Moderately knowledgeable', 'Very knowledgeable', 'Expert level'],
    required: true,
  },
  {
    id: 'recovery-concerns',
    type: 'rating',
    question: 'How concerned are you about recovery time from cosmetic procedures? (1 = Not concerned, 5 = Extremely concerned)',
    required: true,
  },
  {
    id: 'financial-barrier',
    type: 'rating',
    question: 'How much does cost prevent you from considering cosmetic procedures? (1 = Not a barrier, 5 = Major barrier)',
    required: true,
  },
  {
    id: 'family-opinion',
    type: 'rating',
    question: 'How much would your family\'s opinion influence your decision about cosmetic surgery? (1 = Not at all, 5 = Extremely)',
    required: true,
  },
];

// Function to get 3 random questions from the pool
const getRandomQuestions = (pool: Question[], count: number): Question[] => {
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Generate a survey with fixed questions + 3 random questions
export const generateRandomizedSurvey = (): SurveyVariation => {
  const randomQuestions = getRandomQuestions(randomizableQuestions, 3);
  const allQuestions = [...fixedQuestions, ...randomQuestions];
  
  // Generate a unique ID based on which random questions were selected
  const randomIds = randomQuestions.map(q => q.id).sort().join('-');
  
  return {
    id: `psychology-survey-${randomIds}`,
    title: 'Mental Health & Cosmetic Surgery Survey',
    description: 'A research study examining the relationship between mental health, body image, and cosmetic surgery considerations',
    questions: allQuestions,
  };
};

export const getRandomSurvey = (): SurveyVariation => {
  return generateRandomizedSurvey();
};
