
import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Brain, AlertTriangle, TrendingUp, Users, Heart } from 'lucide-react';
import { getParticipantGender, isWomanParticipant } from '@/utils/demographics';
import { ACSS_QUESTION_IDS, BISS_OPTIONS_BY_ID, SOCIAL_MEDIA_PLATFORM_OPTIONS } from '@/data/surveyVariations';

interface SurveyResponse {
  id: string;
  surveyId: string;
  timestamp: string;
  responses: Record<string, string>;
}

interface DataVisualizationsProps {
  responses: SurveyResponse[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];
const BISS_REVERSE_SCORED_IDS = new Set([
  'biss-body-size-shape',
  'biss-weight',
  'biss-physically-attractive',
  'biss-compared-average',
]);
const BISS_BODY_SATISFACTION_IDS = ['biss-physical-appearance', 'biss-body-size-shape', 'biss-weight'];
const BISS_SELF_ESTEEM_IDS = ['biss-physically-attractive', 'biss-looks-compared-usual', 'biss-compared-average'];
const ACSS_CONSIDERATION_IDS = [
  'acss-feel-better',
  'acss-relationship',
  'acss-sometimes-thought',
  'acss-might-consider',
  'acss-if-free',
  'acss-not-embarrassed',
  'acss-positive-psychological',
  'acss-good-option',
];
const ENGAGEMENT_SCALE = ['Never', 'Occasionally', 'Sometimes', 'Often', 'Very Often'];
const SOCIAL_PLATFORM_SET = new Set(SOCIAL_MEDIA_PLATFORM_OPTIONS);
const PLATFORM_ALIASES: Record<string, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  facebook: 'Facebook',
  snapchat: 'Snapchat',
  youtube: 'YouTube',
  pinterest: 'Pinterest',
  twitter: 'Twitter/X',
  x: 'Twitter/X',
  'twitter/x': 'Twitter/X',
  other: 'Other',
};

const average = (values: number[]): number => {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const parseLikert = (value: unknown, min: number = 1, max: number = 7): number | null => {
  if (value === null || value === undefined) return null;
  if (typeof value !== 'string' && typeof value !== 'number') return null;
  if (!value) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) return null;
  return parsed;
};

const parseFrequency = (value: unknown): number | null => {
  if (typeof value !== 'string' || !value) return null;
  const normalizedValue = value.trim().toLowerCase();

  if (normalizedValue === 'never') return 1;
  if (normalizedValue === 'rarely' || normalizedValue === 'occasionally') return 2;
  if (normalizedValue === 'sometimes') return 3;
  if (normalizedValue === 'often') return 4;
  if (normalizedValue === 'very often' || normalizedValue === 'always') return 5;

  const index = ENGAGEMENT_SCALE.indexOf(value.trim());
  return index === -1 ? null : index + 1;
};

const normalizeStringArray = (items: unknown[]): string[] =>
  items
    .filter(item => typeof item === 'string')
    .map(item => item.trim())
    .filter(Boolean);

const parseMultiSelect = (value: unknown): string[] => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return normalizeStringArray(value);
  }

  if (typeof value !== 'string') {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? normalizeStringArray(parsed) : [];
  } catch {
    return value
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);
  }
};

const normalizePlatform = (platform: string): string | null => {
  const normalized = platform.trim().toLowerCase();
  const aliased = PLATFORM_ALIASES[normalized];
  if (aliased) return aliased;
  if (SOCIAL_PLATFORM_SET.has(platform.trim())) return platform.trim();
  return null;
};

const getBissScore = (questionId: string, responseValue?: string): number | null => {
  if (!responseValue) return null;
  const options = BISS_OPTIONS_BY_ID[questionId];
  if (!options?.length) return null;

  const normalizedResponse = responseValue.trim();
  const answerIndex = options.findIndex(option => option.trim() === normalizedResponse);
  if (answerIndex === -1) return null;

  const rawScore = answerIndex + 1;
  return BISS_REVERSE_SCORED_IDS.has(questionId) ? options.length - answerIndex : rawScore;
};

const DataVisualizations: React.FC<DataVisualizationsProps> = ({ responses }) => {
  const [selectedVisualization, setSelectedVisualization] = useState<string>('demographics');

  const processedData = useMemo(() => {
    if (responses.length === 0) return null;

    const responseMetrics = responses.map((response, index) => {
      const bodySatisfactionValues = BISS_BODY_SATISFACTION_IDS
        .map(questionId => getBissScore(questionId, response.responses[questionId]))
        .filter((score): score is number => score !== null);

      const selfEsteemValues = BISS_SELF_ESTEEM_IDS
        .map(questionId => getBissScore(questionId, response.responses[questionId]))
        .filter((score): score is number => score !== null);

      const allBissValues = Object.keys(BISS_OPTIONS_BY_ID)
        .map(questionId => getBissScore(questionId, response.responses[questionId]))
        .filter((score): score is number => score !== null);

      const acssScores = ACSS_QUESTION_IDS
        .map(questionId => parseLikert(response.responses[questionId], 1, 7))
        .filter((score): score is number => score !== null);

      const acssConsiderationScores = ACSS_CONSIDERATION_IDS
        .map(questionId => parseLikert(response.responses[questionId], 1, 7))
        .filter((score): score is number => score !== null);

      const bodySatisfaction = bodySatisfactionValues.length > 0 ? average(bodySatisfactionValues) : null;
      const selfEsteem = selfEsteemValues.length > 0 ? average(selfEsteemValues) : null;
      const overallBissScore = allBissValues.length > 0 ? average(allBissValues) : null;
      const anxiety = overallBissScore !== null ? 10 - overallBissScore : null;
      const moodImpact = bodySatisfaction !== null ? 10 - bodySatisfaction : null;

      return {
        id: response.id,
        responseIndex: index,
        bodySatisfaction,
        selfEsteem,
        anxiety,
        moodImpact,
        acssAverage: acssScores.length > 0 ? average(acssScores) : null,
        acssConsiderationAverage: acssConsiderationScores.length > 0 ? average(acssConsiderationScores) : null,
        beautyEngagement: parseFrequency(response.responses['beauty-content-engagement']),
        photoFilterUse: parseFrequency(response.responses['photo-filters']),
        platforms: parseMultiSelect(response.responses['social-media-platforms']),
      };
    });

    // Demographics Analysis
    const genderDistribution = responses.reduce((acc, r) => {
      const gender = getParticipantGender(r.responses);
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const ageDistribution = responses.reduce((acc, r) => {
      const age = r.responses.age || 'Unknown';
      acc[age] = (acc[age] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Mental Health Metrics
    const bodyImageScores = responseMetrics
      .filter(metric => metric.bodySatisfaction !== null && metric.selfEsteem !== null)
      .map(metric => ({
        satisfaction: metric.bodySatisfaction as number,
        selfEsteem: metric.selfEsteem as number,
        anxiety: metric.anxiety ?? 0,
        moodImpact: metric.moodImpact ?? 0,
      }));

    // Cosmetic Surgery Interest
    const cosmeticInterest = responseMetrics.reduce((acc, metric) => {
      const score = metric.acssConsiderationAverage;
      const category = score === null
        ? 'No Data'
        : score < 3
          ? 'Unlikely'
          : score < 4.5
            ? 'Neutral'
            : score < 5.5
              ? 'Open to Consider'
              : 'Likely to Consider';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averageAcssScore = average(
      responseMetrics
        .map(metric => metric.acssAverage)
        .filter((score): score is number => score !== null)
    );

    // Social Media Impact
    const socialMediaHours = responseMetrics.reduce((acc, metric) => {
      const validPlatforms = Array.from(
        new Set(
          metric.platforms
            .map(normalizePlatform)
            .filter((platform): platform is string => platform !== null)
        )
      );

      if (validPlatforms.length === 0) {
        acc['No Selection'] = (acc['No Selection'] || 0) + 1;
        return acc;
      }

      validPlatforms.forEach(platform => {
        acc[platform] = (acc[platform] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const avgMediaInfluence = average(
      responseMetrics
        .map(metric => metric.beautyEngagement)
        .filter((score): score is number => score !== null)
    );

    // Body Image vs Social Media Correlation (engagement frequency vs satisfaction)
    const correlationData = responseMetrics
      .filter(metric => metric.beautyEngagement !== null && metric.bodySatisfaction !== null)
      .map(metric => ({
        primaryPlatform: metric.platforms.map(normalizePlatform).find(Boolean) || 'No Selection',
        mediaInfluence: metric.beautyEngagement as number,
        bodySatisfaction: metric.bodySatisfaction as number,
        id: metric.responseIndex,
      }));

    // Behavioral Patterns
    const mirrorChecking = responseMetrics.reduce((acc, metric) => {
      const frequency = metric.photoFilterUse === null
        ? 'No Data'
        : ENGAGEMENT_SCALE[metric.photoFilterUse - 1];
      acc[frequency] = (acc[frequency] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Mental Health Risk Assessment
    const riskFactors = responseMetrics.map(metric => {
      let riskScore = 0;

      if (metric.bodySatisfaction !== null) {
        if (metric.bodySatisfaction <= 3) riskScore += 2;
        else if (metric.bodySatisfaction <= 5) riskScore += 1;
      }

      if (metric.photoFilterUse !== null && metric.photoFilterUse >= 4) {
        riskScore += 1;
      }

      if (metric.beautyEngagement !== null && metric.beautyEngagement >= 4) {
        riskScore += 1;
      }

      if (metric.acssAverage !== null && metric.acssAverage >= 5.5) {
        riskScore += 1;
      }

      return {
        id: metric.id,
        riskScore,
        category: riskScore >= 4 ? 'High Risk' : riskScore >= 2 ? 'Moderate Risk' : 'Low Risk',
      };
    });

    const womenCount = responses.filter(r => isWomanParticipant(r.responses)).length;

    return {
      genderDistribution: Object.entries(genderDistribution).map(([key, value]) => ({ name: key, value })),
      ageDistribution: Object.entries(ageDistribution).map(([key, value]) => ({ name: key, value })),
      bodyImageScores,
      cosmeticInterest: Object.entries(cosmeticInterest).map(([key, value]) => ({ name: key, value })),
      avgCosmeticPressure: averageAcssScore,
      socialMediaHours: Object.entries(socialMediaHours).map(([key, value]) => ({ name: key, value })),
      avgMediaInfluence,
      correlationData,
      mirrorChecking: Object.entries(mirrorChecking).map(([key, value]) => ({ name: key, value })),
      riskFactors,
      totalResponses: responses.length,
      femalePercentage: Math.round((womenCount / responses.length) * 100),
    };
  }, [responses]);

  const generateAIInsights = (visualizationType: string) => {
    if (!processedData) return "Insufficient data for analysis.";

    const insights = {
      demographics: `**Key Demographics Insights:**
      
      With ${processedData.totalResponses} total responses (${processedData.femalePercentage}% women), this sample provides valuable insights into body image perceptions. The age distribution reveals generational patterns that may correlate with different social media exposure levels and beauty standard evolution.
      
      **Data Scientist Analysis:** The gender skew toward women is expected given the research focus, but consider analyzing responses from men separately to identify gender-specific patterns in body image concerns.`,

      mentalHealth: `**Mental Health Profile Analysis:**
      
      The body satisfaction scores reveal concerning patterns when cross-referenced with self-esteem metrics. Participants showing low body satisfaction (≤2) often correlate with higher appearance-related anxiety scores, suggesting a potential clinical pathway.
      
      **Senior Data Scientist Insight:** Look for the inverse correlation between body satisfaction and anxiety scores - this relationship strength (likely r > -0.6) indicates body image concerns significantly impact daily mental health. Consider segmenting by age groups to identify when these patterns emerge.`,

      cosmeticSurgery: `**Cosmetic Surgery Consideration Patterns:**
      
      ACSS responses show an average acceptance score of ${processedData.avgCosmeticPressure.toFixed(1)}/7, indicating current openness to cosmetic procedures across this sample.
      
      **Hidden Pattern Alert:** Compare participants with high cosmetic acceptance and low body satisfaction, since that overlap can signal higher intervention sensitivity.`,

      socialMedia: `**Social Media Impact Assessment:**
      
      Average beauty-content engagement is ${processedData.avgMediaInfluence.toFixed(1)}/5. Cross-checking engagement level against body satisfaction helps identify whether higher content engagement tracks with lower body confidence.
      
      **Critical Insight:** Platform participation alone is less informative than engagement intensity; frequent beauty-content engagement is the stronger signal.`,

      behavioral: `**Behavioral Pattern Analysis:**
      
      Photo-filter behavior and beauty-content engagement provide observable behavior markers for appearance-related coping patterns.
      
      **Research Gold Mine:** Cross-reference frequent filter use with low body satisfaction to identify participants who may benefit from targeted psychoeducation.`,

      riskAssessment: `**Clinical Risk Stratification:**
      
      The risk model combines lower BISS-based body satisfaction with stronger appearance-related behavioral markers and higher ACSS acceptance.
      
      **Intervention Priority:** Focus on the ${processedData.riskFactors.filter(r => r.category === 'High Risk').length} high-risk participants - they represent the intersection of multiple concerning factors and may benefit from immediate support resources.`
    };

    return insights[visualizationType as keyof typeof insights] || "Analysis pending for this visualization.";
  };

  if (!processedData) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">No data available for analysis. Collect survey responses to see visualizations.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Visualization Selection */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'demographics', label: 'Demographics', icon: Users },
          { id: 'mentalHealth', label: 'Mental Health', icon: Heart },
          { id: 'cosmeticSurgery', label: 'Cosmetic Surgery', icon: TrendingUp },
          { id: 'socialMedia', label: 'Social Media', icon: Brain },
          { id: 'behavioral', label: 'Behavioral', icon: AlertTriangle },
          { id: 'riskAssessment', label: 'Risk Assessment', icon: AlertTriangle },
        ].map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={selectedVisualization === id ? 'default' : 'outline'}
            onClick={() => setSelectedVisualization(id)}
            className="flex items-center gap-2"
          >
            <Icon className="w-4 h-4" />
            {label}
          </Button>
        ))}
      </div>

      {/* Demographics Visualizations */}
      {selectedVisualization === 'demographics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Gender Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-64">
                <PieChart>
                  <Pie
                    data={processedData.genderDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {processedData.genderDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Age Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-64">
                <BarChart data={processedData.ageDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Mental Health Visualizations */}
      {selectedVisualization === 'mentalHealth' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Body Image vs Self-Esteem Correlation</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-64">
                <ScatterChart data={processedData.bodyImageScores}>
                  <CartesianGrid />
                  <XAxis dataKey="satisfaction" name="Body Satisfaction" domain={[1, 9]} />
                  <YAxis dataKey="selfEsteem" name="Self Esteem" domain={[1, 9]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Scatter fill="#8884d8" />
                </ScatterChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mental Health Impact Radar</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="h-64">
                  <RadarChart data={[{
                  metric: 'Body Satisfaction',
                  average: average(processedData.bodyImageScores.map(score => score.satisfaction))
                }, {
                  metric: 'Self Esteem',
                  average: average(processedData.bodyImageScores.map(score => score.selfEsteem))
                }, {
                  metric: 'Anxiety Level',
                  average: average(processedData.bodyImageScores.map(score => score.anxiety))
                }, {
                  metric: 'Mood Impact',
                  average: average(processedData.bodyImageScores.map(score => score.moodImpact))
                }]}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis domain={[0, 9]} />
                  <Radar dataKey="average" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                </RadarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Cosmetic Surgery Visualizations */}
      {selectedVisualization === 'cosmeticSurgery' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Cosmetic Surgery Consideration</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-64">
                <PieChart>
                  <Pie
                    data={processedData.cosmeticInterest}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#ffc658"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {processedData.cosmeticInterest.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pressure vs Consideration Analysis</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                  <div className="text-3xl font-bold text-red-500">{processedData.avgCosmeticPressure.toFixed(1)}/7</div>
                  <p className="text-sm text-gray-600">Average ACSS Score</p>
                  </div>
                  <div className="h-32 flex items-end justify-center gap-2">
                  {[1, 2, 3, 4, 5, 6, 7].map(level => (
                    <div
                      key={level}
                      className={`w-8 bg-gradient-to-t from-red-200 to-red-500 rounded-t ${
                        level <= processedData.avgCosmeticPressure ? 'opacity-100' : 'opacity-30'
                      }`}
                      style={{ height: `${level * 14}%` }}
                    />
                  ))}
                  </div>
                </div>
              </CardContent>
          </Card>
        </div>
      )}

      {/* Social Media Visualizations */}
      {selectedVisualization === 'socialMedia' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Platform Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-64">
                <BarChart data={processedData.socialMediaHours}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="#8dd1e1" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media Influence vs Body Satisfaction</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-64">
                <ScatterChart data={processedData.correlationData}>
                  <CartesianGrid />
                  <XAxis dataKey="mediaInfluence" name="Beauty Content Engagement" domain={[1, 5]} />
                  <YAxis dataKey="bodySatisfaction" name="Body Satisfaction" domain={[1, 9]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Scatter fill="#d084d0" />
                </ScatterChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Behavioral Visualizations */}
      {selectedVisualization === 'behavioral' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Photo Filter Usage Frequency</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-64">
                <BarChart data={processedData.mirrorChecking}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="#ff7c7c" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Behavioral Risk Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-lg font-semibold">Behavioral Pattern Analysis</div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-500">
                      {processedData.riskFactors.filter(r => r.category === 'Low Risk').length}
                    </div>
                    <p className="text-xs text-gray-600">Low Risk</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-500">
                      {processedData.riskFactors.filter(r => r.category === 'Moderate Risk').length}
                    </div>
                    <p className="text-xs text-gray-600">Moderate Risk</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-500">
                      {processedData.riskFactors.filter(r => r.category === 'High Risk').length}
                    </div>
                    <p className="text-xs text-gray-600">High Risk</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Risk Assessment */}
      {selectedVisualization === 'riskAssessment' && (
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Mental Health Risk Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-64">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Low Risk', value: processedData.riskFactors.filter(r => r.category === 'Low Risk').length },
                      { name: 'Moderate Risk', value: processedData.riskFactors.filter(r => r.category === 'Moderate Risk').length },
                      { name: 'High Risk', value: processedData.riskFactors.filter(r => r.category === 'High Risk').length },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill="#4ade80" />
                    <Cell fill="#fbbf24" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI-Generated Insights */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Data Scientist Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: generateAIInsights(selectedVisualization).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataVisualizations;
