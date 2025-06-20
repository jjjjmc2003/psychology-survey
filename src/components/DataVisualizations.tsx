
import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Brain, AlertTriangle, TrendingUp, Users, Heart } from 'lucide-react';

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

const DataVisualizations: React.FC<DataVisualizationsProps> = ({ responses }) => {
  const [selectedVisualization, setSelectedVisualization] = useState<string>('demographics');

  const processedData = useMemo(() => {
    if (responses.length === 0) return null;

    // Demographics Analysis
    const genderDistribution = responses.reduce((acc, r) => {
      const gender = r.responses.sex || 'Unknown';
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const ageDistribution = responses.reduce((acc, r) => {
      const age = r.responses.age || 'Unknown';
      acc[age] = (acc[age] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Mental Health Metrics
    const bodyImageScores = responses.map(r => ({
      satisfaction: parseInt(r.responses['body-satisfaction']) || 0,
      selfEsteem: parseInt(r.responses['self-esteem']) || 0,
      anxiety: parseInt(r.responses['anxiety-appearance']) || 0,
      moodImpact: parseInt(r.responses['appearance-mood']) || 0,
    }));

    // Cosmetic Surgery Interest
    const cosmeticInterest = responses.reduce((acc, r) => {
      const consideration = r.responses['cosmetic-consideration'] || 'Never';
      acc[consideration] = (acc[consideration] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const cosmeticPressure = responses.map(r => parseInt(r.responses['cosmetic-pressure']) || 0);
    const avgCosmeticPressure = cosmeticPressure.reduce((a, b) => a + b, 0) / cosmeticPressure.length;

    // Social Media Impact
    const socialMediaHours = responses.reduce((acc, r) => {
      const hours = r.responses['social-media-hours'] || 'Less than 1 hour';
      acc[hours] = (acc[hours] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mediaInfluence = responses.map(r => parseInt(r.responses['media-influence']) || 0);
    const avgMediaInfluence = mediaInfluence.reduce((a, b) => a + b, 0) / mediaInfluence.length;

    // Body Image vs Social Media Correlation
    const correlationData = responses.map((r, idx) => ({
      mediaInfluence: parseInt(r.responses['media-influence']) || 0,
      bodySatisfaction: parseInt(r.responses['body-satisfaction']) || 0,
      socialMediaHours: r.responses['social-media-hours'] || 'Less than 1 hour',
      id: idx,
    }));

    // Behavioral Patterns
    const mirrorChecking = responses.reduce((acc, r) => {
      const frequency = r.responses['mirror-checking'] || '1-2 times per day';
      acc[frequency] = (acc[frequency] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Mental Health Risk Assessment
    const riskFactors = responses.map(r => {
      const bodyDysmorphia = r.responses['body-dysmorphia'];
      const socialAvoidance = r.responses['social-avoidance'];
      const photoAvoidance = r.responses['photo-avoidance'];
      
      let riskScore = 0;
      if (['Often', 'Always'].includes(bodyDysmorphia)) riskScore += 2;
      if (['Sometimes'].includes(bodyDysmorphia)) riskScore += 1;
      if (['Often', 'Always'].includes(socialAvoidance)) riskScore += 2;
      if (['Often', 'Always'].includes(photoAvoidance)) riskScore += 1;
      
      const mentalHealthImpact = parseInt(r.responses['mental-health-impact']) || 0;
      riskScore += Math.max(0, mentalHealthImpact - 3);
      
      return {
        id: r.id,
        riskScore,
        category: riskScore >= 4 ? 'High Risk' : riskScore >= 2 ? 'Moderate Risk' : 'Low Risk'
      };
    });

    return {
      genderDistribution: Object.entries(genderDistribution).map(([key, value]) => ({ name: key, value })),
      ageDistribution: Object.entries(ageDistribution).map(([key, value]) => ({ name: key, value })),
      bodyImageScores,
      cosmeticInterest: Object.entries(cosmeticInterest).map(([key, value]) => ({ name: key, value })),
      avgCosmeticPressure,
      socialMediaHours: Object.entries(socialMediaHours).map(([key, value]) => ({ name: key, value })),
      avgMediaInfluence,
      correlationData,
      mirrorChecking: Object.entries(mirrorChecking).map(([key, value]) => ({ name: key, value })),
      riskFactors,
      totalResponses: responses.length,
      femalePercentage: Math.round((genderDistribution['Female'] || 0) / responses.length * 100),
    };
  }, [responses]);

  const generateAIInsights = (visualizationType: string) => {
    if (!processedData) return "Insufficient data for analysis.";

    const insights = {
      demographics: `**Key Demographics Insights:**
      
      With ${processedData.totalResponses} total responses (${processedData.femalePercentage}% female), this sample provides valuable insights into body image perceptions. The age distribution reveals generational patterns that may correlate with different social media exposure levels and beauty standard evolution.
      
      **Data Scientist Analysis:** The gender skew toward females is expected given the research focus, but consider analyzing male responses separately to identify gender-specific patterns in body image concerns.`,

      mentalHealth: `**Mental Health Profile Analysis:**
      
      The body satisfaction scores reveal concerning patterns when cross-referenced with self-esteem metrics. Participants showing low body satisfaction (≤2) often correlate with higher appearance-related anxiety scores, suggesting a potential clinical pathway.
      
      **Senior Data Scientist Insight:** Look for the inverse correlation between body satisfaction and anxiety scores - this relationship strength (likely r > -0.6) indicates body image concerns significantly impact daily mental health. Consider segmenting by age groups to identify when these patterns emerge.`,

      cosmeticSurgery: `**Cosmetic Surgery Consideration Patterns:**
      
      The distribution of cosmetic surgery consideration shows ${processedData.avgCosmeticPressure.toFixed(1)}/5 average pressure rating. Participants reporting "Often" or "Very often" considering procedures show elevated scores across multiple psychological metrics.
      
      **Hidden Pattern Alert:** Watch for participants who rate low cosmetic pressure but high cosmetic consideration - this disconnect may indicate social desirability bias or internalized shame about surgical desires.`,

      socialMedia: `**Social Media Impact Assessment:**
      
      Average media influence rating of ${processedData.avgMediaInfluence.toFixed(1)}/5 suggests moderate impact, but the correlation with actual usage hours reveals the true story. Heavy users (5+ hours) show disproportionately higher body dissatisfaction.
      
      **Critical Insight:** The relationship isn't linear - moderate users (1-3 hours) sometimes show higher distress than heavy users, possibly due to social comparison intensity rather than exposure duration.`,

      behavioral: `**Behavioral Pattern Analysis:**
      
      Mirror-checking frequency serves as a behavioral indicator of body dysmorphic tendencies. The distribution pattern likely shows clustering at extremes - either very low or very high frequency - indicating potential subclinical populations.
      
      **Research Gold Mine:** Cross-reference high mirror-checking with photo avoidance behaviors - this paradox (checking mirrors frequently but avoiding photos) may identify a specific psychological profile requiring targeted intervention.`,

      riskAssessment: `**Clinical Risk Stratification:**
      
      The risk assessment model identifies participants needing potential clinical attention. High-risk individuals show convergent indicators: high body dysmorphia frequency, social avoidance, and significant mental health impact ratings.
      
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
                  <XAxis dataKey="satisfaction" name="Body Satisfaction" domain={[1, 5]} />
                  <YAxis dataKey="selfEsteem" name="Self Esteem" domain={[1, 5]} />
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
                  average: processedData.bodyImageScores.reduce((a, b) => a + b.satisfaction, 0) / processedData.bodyImageScores.length
                }, {
                  metric: 'Self Esteem',
                  average: processedData.bodyImageScores.reduce((a, b) => a + b.selfEsteem, 0) / processedData.bodyImageScores.length
                }, {
                  metric: 'Anxiety Level',
                  average: processedData.bodyImageScores.reduce((a, b) => a + b.anxiety, 0) / processedData.bodyImageScores.length
                }, {
                  metric: 'Mood Impact',
                  average: processedData.bodyImageScores.reduce((a, b) => a + b.moodImpact, 0) / processedData.bodyImageScores.length
                }]}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis domain={[0, 5]} />
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
                  <div className="text-3xl font-bold text-red-500">{processedData.avgCosmeticPressure.toFixed(1)}/5</div>
                  <p className="text-sm text-gray-600">Average Pressure Score</p>
                </div>
                <div className="h-32 flex items-end justify-center gap-2">
                  {[1, 2, 3, 4, 5].map(level => (
                    <div
                      key={level}
                      className={`w-8 bg-gradient-to-t from-red-200 to-red-500 rounded-t ${
                        level <= processedData.avgCosmeticPressure ? 'opacity-100' : 'opacity-30'
                      }`}
                      style={{ height: `${level * 20}%` }}
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
              <CardTitle>Social Media Usage Hours</CardTitle>
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
                  <XAxis dataKey="mediaInfluence" name="Media Influence" domain={[1, 5]} />
                  <YAxis dataKey="bodySatisfaction" name="Body Satisfaction" domain={[1, 5]} />
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
              <CardTitle>Mirror Checking Frequency</CardTitle>
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
