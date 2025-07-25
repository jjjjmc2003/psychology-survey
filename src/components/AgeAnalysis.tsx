import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface AgeAnalysisProps {
  responses: Array<{
    id: string;
    responses: Record<string, any>;
  }>;
}

export const AgeAnalysis: React.FC<AgeAnalysisProps> = ({ responses }) => {
  const [groupGap, setGroupGap] = useState<number | 'individual'>('individual');

  const ageData = useMemo(() => {
    const ages = responses
      .map(r => r.responses.age)
      .filter(age => age && age !== undefined)
      .map(age => {
        if (age === '99+') return 99;
        const numAge = parseInt(age, 10);
        return isNaN(numAge) ? null : numAge;
      })
      .filter(age => age !== null) as number[];

    if (groupGap === 'individual') {
      // Group by individual ages
      const ageCounts: Record<number, number> = {};
      ages.forEach(age => {
        ageCounts[age] = (ageCounts[age] || 0) + 1;
      });
      
      return Object.entries(ageCounts)
        .map(([age, count]) => ({
          label: age === '99' ? '99+' : age,
          count,
          ages: [parseInt(age)]
        }))
        .sort((a, b) => parseInt(a.label) - parseInt(b.label));
    } else {
      // Group by age ranges
      const gap = groupGap as number;
      const groups: Record<string, { count: number; ages: number[] }> = {};
      
      ages.forEach(age => {
        const groupStart = Math.floor((age - 18) / gap) * gap + 18;
        const groupEnd = Math.min(groupStart + gap - 1, 99);
        const groupKey = groupStart === groupEnd ? `${groupStart}` : `${groupStart}-${groupEnd}`;
        
        if (!groups[groupKey]) {
          groups[groupKey] = { count: 0, ages: [] };
        }
        groups[groupKey].count++;
        if (!groups[groupKey].ages.includes(age)) {
          groups[groupKey].ages.push(age);
        }
      });

      return Object.entries(groups)
        .map(([label, data]) => ({
          label: label.includes('-') ? label : label,
          count: data.count,
          ages: data.ages.sort((a, b) => a - b)
        }))
        .sort((a, b) => {
          const aStart = parseInt(a.label.split('-')[0]);
          const bStart = parseInt(b.label.split('-')[0]);
          return aStart - bStart;
        });
    }
  }, [responses, groupGap]);

  const totalResponses = responses.filter(r => r.responses.age).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Age Distribution Analysis</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Group by:</span>
            <Select
              value={groupGap.toString()}
              onValueChange={(value) => setGroupGap(value === 'individual' ? 'individual' : parseInt(value))}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="1">Gap: 1</SelectItem>
                <SelectItem value="2">Gap: 2</SelectItem>
                <SelectItem value="3">Gap: 3</SelectItem>
                <SelectItem value="5">Gap: 5</SelectItem>
                <SelectItem value="10">Gap: 10</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Total responses with age data: {totalResponses}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {ageData.map((group, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-sm font-medium">
                  Age {group.label}
                </Badge>
                <span className="text-sm text-gray-600">
                  {group.count} participant{group.count !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium">
                  {((group.count / totalResponses) * 100).toFixed(1)}%
                </div>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(group.count / Math.max(...ageData.map(g => g.count))) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {ageData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No age data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};