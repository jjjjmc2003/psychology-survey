const WOMAN_VALUES = new Set(['woman', 'women', 'female', 'f']);
const MAN_VALUES = new Set(['man', 'men', 'male', 'm']);
const OTHER_VALUES = new Set([
  'other',
  'non-binary',
  'nonbinary',
  'non binary',
  'nb',
  'prefer not to say',
]);

const normalizeKey = (value?: string): string => value?.trim().toLowerCase() || '';

export const getParticipantGender = (responses: Record<string, string>): string => {
  const rawGender = responses.gender ?? responses.sex;
  if (!rawGender) return 'Unknown';

  const normalizedGender = normalizeKey(rawGender);
  if (WOMAN_VALUES.has(normalizedGender)) return 'Woman';
  if (MAN_VALUES.has(normalizedGender)) return 'Man';
  if (OTHER_VALUES.has(normalizedGender)) return 'Other';

  return rawGender.trim();
};

export const isWomanParticipant = (responses: Record<string, string>): boolean => {
  return getParticipantGender(responses) === 'Woman';
};
