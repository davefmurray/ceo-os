'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Check, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCEOStore } from '@/lib/store';
import type { LifeMapScores } from '@/lib/types';

const LIFE_AREAS = [
  {
    key: 'career',
    label: 'Career / Work',
    description: 'Your professional contribution and growth',
    color: 'bg-blue-500',
  },
  {
    key: 'relationships',
    label: 'Relationships',
    description: 'Partner, family, friendships, community',
    color: 'bg-pink-500',
  },
  {
    key: 'health',
    label: 'Health',
    description: 'Physical body, energy, longevity',
    color: 'bg-green-500',
  },
  {
    key: 'finances',
    label: 'Finances',
    description: 'Money, security, freedom, wealth',
    color: 'bg-yellow-500',
  },
  {
    key: 'meaning',
    label: 'Meaning / Purpose',
    description: 'Why you\'re here, contribution, legacy',
    color: 'bg-purple-500',
  },
  {
    key: 'fun',
    label: 'Fun / Adventure',
    description: 'Play, novelty, experiences, joy',
    color: 'bg-orange-500',
  },
] as const;

type AreaKey = (typeof LIFE_AREAS)[number]['key'];

export default function LifeMapPage() {
  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);
  const { currentLifeMap, updateCurrentLifeMap } = useCEOStore();

  const [formData, setFormData] = useState<LifeMapScores>(currentLifeMap);

  useEffect(() => {
    setMounted(true);
    setFormData(currentLifeMap);
  }, [currentLifeMap]);

  const handleSave = () => {
    updateCurrentLifeMap(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const getScoreKey = (area: AreaKey): keyof LifeMapScores => area;
  const getTrendKey = (area: AreaKey): keyof LifeMapScores => `${area}Trend` as keyof LifeMapScores;
  const getNoteKey = (area: AreaKey): keyof LifeMapScores => `${area}Note` as keyof LifeMapScores;

  const updateArea = (area: AreaKey, field: 'score' | 'trend' | 'note', value: number | string) => {
    if (field === 'score') {
      setFormData({ ...formData, [area]: value as number });
    } else if (field === 'trend') {
      setFormData({ ...formData, [`${area}Trend`]: value as 'up' | 'down' | 'stable' });
    } else {
      setFormData({ ...formData, [`${area}Note`]: value as string });
    }
  };

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
    if (trend === 'up') return <TrendingUp className="h-5 w-5 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="h-5 w-5 text-red-500" />;
    return <Minus className="h-5 w-5 text-muted-foreground" />;
  };

  const getAverageScore = () => {
    const scores = LIFE_AREAS.map((area) => formData[getScoreKey(area.key)] as number);
    return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BookOpen className="h-8 w-8" />
          Life Map
        </h1>
        <p className="text-muted-foreground mt-1">
          A holistic view of your life across six interconnected areas.
        </p>
      </div>

      {/* Summary Card */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Overall Score</CardTitle>
          <CardDescription>
            A successful life is not one area at 100% — it&apos;s all areas at sustainable levels.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="text-4xl font-bold">{getAverageScore()}</div>
            <div className="flex-1 space-y-2">
              {LIFE_AREAS.map((area) => (
                <div key={area.key} className="flex items-center gap-2">
                  <span className="w-28 text-xs">{area.label}</span>
                  <Progress
                    value={(formData[getScoreKey(area.key)] as number) * 10}
                    className="flex-1 h-2"
                  />
                  <span className="w-6 text-xs text-right">
                    {formData[getScoreKey(area.key)]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Areas */}
      {LIFE_AREAS.map((area) => (
        <Card key={area.key}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${area.color}`} />
                  {area.label}
                </CardTitle>
                <CardDescription>{area.description}</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <TrendIcon trend={formData[getTrendKey(area.key)] as 'up' | 'down' | 'stable'} />
                <span className="text-3xl font-bold">
                  {formData[getScoreKey(area.key)]}/10
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Score (1-10)</Label>
                <span className="text-sm text-muted-foreground">
                  1 = Crisis, 10 = Couldn&apos;t be better
                </span>
              </div>
              <Slider
                value={[formData[getScoreKey(area.key)] as number]}
                onValueChange={([v]) => updateArea(area.key, 'score', v)}
                max={10}
                min={1}
                step={1}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Trend</Label>
                <Select
                  value={formData[getTrendKey(area.key)] as string}
                  onValueChange={(v) => updateArea(area.key, 'trend', v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="up">
                      <span className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        Improving
                      </span>
                    </SelectItem>
                    <SelectItem value="stable">
                      <span className="flex items-center gap-2">
                        <Minus className="h-4 w-4" />
                        Stable
                      </span>
                    </SelectItem>
                    <SelectItem value="down">
                      <span className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-red-500" />
                        Declining
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes / Observation</Label>
              <Textarea
                placeholder={`What's happening in ${area.label.toLowerCase()}?`}
                value={formData[getNoteKey(area.key)] as string}
                onChange={(e) => updateArea(area.key, 'note', e.target.value)}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Analysis Prompt */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Reflection Questions</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Which area is dragging everything else down?</li>
            <li>• Which area, if improved, would positively impact multiple others?</li>
            <li>• What trade-offs are you currently making that you&apos;ll regret in 5 years?</li>
            <li>• If you could only maintain THREE areas at a high level, which would they be?</li>
          </ul>
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex justify-end gap-4 pt-4">
        <Button size="lg" onClick={handleSave} className="min-w-32">
          {saved ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Saved
            </>
          ) : (
            'Save Life Map'
          )}
        </Button>
      </div>
    </div>
  );
}
