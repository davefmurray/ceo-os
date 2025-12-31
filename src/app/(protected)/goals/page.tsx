'use client';

import { useEffect, useState } from 'react';
import { Target, Check, Plus, Minus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCEOStore } from '@/lib/store';
import type { GoalArea, YearGoals, VisionGoals } from '@/lib/types';

const LIFE_AREAS = [
  { key: 'career', label: 'Career / Work' },
  { key: 'relationships', label: 'Relationships' },
  { key: 'health', label: 'Health' },
  { key: 'finances', label: 'Finances' },
  { key: 'meaning', label: 'Meaning / Purpose' },
  { key: 'fun', label: 'Fun / Adventure' },
] as const;

type AreaKey = (typeof LIFE_AREAS)[number]['key'];

export default function GoalsPage() {
  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);
  const { goals, updateOneYearGoals, updateThreeYearGoals, updateTenYearGoals } = useCEOStore();

  const [oneYearData, setOneYearData] = useState<YearGoals>(goals.oneYear);
  const [threeYearData, setThreeYearData] = useState<VisionGoals>(goals.threeYear);
  const [tenYearData, setTenYearData] = useState<VisionGoals>(goals.tenYear);

  useEffect(() => {
    setMounted(true);
    setOneYearData(goals.oneYear);
    setThreeYearData(goals.threeYear);
    setTenYearData(goals.tenYear);
  }, [goals]);

  const handleSaveOneYear = () => {
    updateOneYearGoals(oneYearData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveThreeYear = () => {
    updateThreeYearGoals(threeYearData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveTenYear = () => {
    updateTenYearGoals(tenYearData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateOneYearArea = (area: AreaKey, field: keyof GoalArea, value: string | number) => {
    setOneYearData({
      ...oneYearData,
      [area]: { ...oneYearData[area], [field]: value },
    });
  };

  const updateCriticalThree = (index: number, value: string) => {
    const newCritical = [...oneYearData.criticalThree];
    newCritical[index] = value;
    setOneYearData({ ...oneYearData, criticalThree: newCritical });
  };

  const updateAntiGoals = (index: number, value: string) => {
    const newAntiGoals = [...oneYearData.antiGoals];
    newAntiGoals[index] = value;
    setOneYearData({ ...oneYearData, antiGoals: newAntiGoals });
  };

  const addAntiGoal = () => {
    setOneYearData({ ...oneYearData, antiGoals: [...oneYearData.antiGoals, ''] });
  };

  const removeAntiGoal = (index: number) => {
    const newAntiGoals = oneYearData.antiGoals.filter((_, i) => i !== index);
    setOneYearData({ ...oneYearData, antiGoals: newAntiGoals.length ? newAntiGoals : [''] });
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
          <Target className="h-8 w-8" />
          Goals
        </h1>
        <p className="text-muted-foreground mt-1">
          Define where you&apos;re going across different time horizons.
        </p>
      </div>

      <Tabs defaultValue="1-year" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="1-year">1 Year</TabsTrigger>
          <TabsTrigger value="3-year">3 Year</TabsTrigger>
          <TabsTrigger value="10-year">10 Year</TabsTrigger>
        </TabsList>

        {/* 1 Year Goals */}
        <TabsContent value="1-year" className="space-y-6">
          {/* Theme */}
          <Card>
            <CardHeader>
              <CardTitle>{new Date().getFullYear()} Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Year Theme</Label>
                <Input
                  placeholder="In a few words, what is this year about?"
                  value={oneYearData.theme}
                  onChange={(e) => setOneYearData({ ...oneYearData, theme: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>If This Year Goes Well...</Label>
                <Textarea
                  placeholder="By December 31st, I will be able to say..."
                  value={oneYearData.ifGoesWell}
                  onChange={(e) => setOneYearData({ ...oneYearData, ifGoesWell: e.target.value })}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Critical Three */}
          <Card>
            <CardHeader>
              <CardTitle>The Critical Three</CardTitle>
              <CardDescription>
                If you could only accomplish THREE things this year, what would they be?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {oneYearData.criticalThree.map((goal, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
                    {index + 1}
                  </span>
                  <Input
                    placeholder={`Critical priority ${index + 1}...`}
                    value={goal}
                    onChange={(e) => updateCriticalThree(index, e.target.value)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Goals by Area */}
          {LIFE_AREAS.map((area) => (
            <Card key={area.key}>
              <CardHeader>
                <CardTitle>{area.label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Primary Goal</Label>
                  <Textarea
                    placeholder={`Your main ${area.label.toLowerCase()} goal for the year...`}
                    value={oneYearData[area.key].primaryGoal}
                    onChange={(e) => updateOneYearArea(area.key, 'primaryGoal', e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Why This Matters</Label>
                  <Input
                    placeholder="Why is this important?"
                    value={oneYearData[area.key].whyMatters}
                    onChange={(e) => updateOneYearArea(area.key, 'whyMatters', e.target.value)}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Q1 Milestone</Label>
                    <Input
                      placeholder="By end of Q1..."
                      value={oneYearData[area.key].q1Milestone}
                      onChange={(e) => updateOneYearArea(area.key, 'q1Milestone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Q2 Milestone</Label>
                    <Input
                      placeholder="By end of Q2..."
                      value={oneYearData[area.key].q2Milestone}
                      onChange={(e) => updateOneYearArea(area.key, 'q2Milestone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Q3 Milestone</Label>
                    <Input
                      placeholder="By end of Q3..."
                      value={oneYearData[area.key].q3Milestone}
                      onChange={(e) => updateOneYearArea(area.key, 'q3Milestone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Q4 Milestone</Label>
                    <Input
                      placeholder="By end of Q4..."
                      value={oneYearData[area.key].q4Milestone}
                      onChange={(e) => updateOneYearArea(area.key, 'q4Milestone', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Commitment Level</Label>
                    <span className="text-sm font-medium">{oneYearData[area.key].commitment}/10</span>
                  </div>
                  <Slider
                    value={[oneYearData[area.key].commitment]}
                    onValueChange={([v]) => updateOneYearArea(area.key, 'commitment', v)}
                    max={10}
                    min={1}
                    step={1}
                  />
                  <p className="text-xs text-muted-foreground">
                    If below 8, either increase commitment or drop the goal.
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Anti-Goals */}
          <Card>
            <CardHeader>
              <CardTitle>Anti-Goals</CardTitle>
              <CardDescription>What are you explicitly NOT pursuing this year?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {(oneYearData.antiGoals.length ? oneYearData.antiGoals : ['']).map((goal, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="Something you're NOT pursuing..."
                    value={goal}
                    onChange={(e) => updateAntiGoals(index, e.target.value)}
                  />
                  {oneYearData.antiGoals.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => removeAntiGoal(index)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addAntiGoal}>
                <Plus className="h-4 w-4 mr-2" />
                Add Anti-Goal
              </Button>
            </CardContent>
          </Card>

          {/* Save */}
          <div className="flex justify-end">
            <Button size="lg" onClick={handleSaveOneYear} className="min-w-32">
              {saved ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Saved
                </>
              ) : (
                'Save 1-Year Goals'
              )}
            </Button>
          </div>
        </TabsContent>

        {/* 3 Year Vision */}
        <TabsContent value="3-year" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>3-Year Vision</CardTitle>
              <CardDescription>
                Close enough to plan for, far enough to think big.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>The Snapshot</Label>
                <Textarea
                  placeholder="It's three years from today. Describe your life."
                  value={threeYearData.snapshot}
                  onChange={(e) => setThreeYearData({ ...threeYearData, snapshot: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Where do you live?</Label>
                  <Input
                    value={threeYearData.whereLive}
                    onChange={(e) => setThreeYearData({ ...threeYearData, whereLive: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>What do you do?</Label>
                  <Input
                    value={threeYearData.whatDo}
                    onChange={(e) => setThreeYearData({ ...threeYearData, whatDo: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>What&apos;s different from today?</Label>
                <Textarea
                  value={threeYearData.whatsDifferent}
                  onChange={(e) =>
                    setThreeYearData({ ...threeYearData, whatsDifferent: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Areas */}
          {LIFE_AREAS.map((area) => (
            <Card key={area.key}>
              <CardHeader>
                <CardTitle>{area.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={`Where will you be in ${area.label.toLowerCase()} in 3 years?`}
                  value={threeYearData[area.key]}
                  onChange={(e) =>
                    setThreeYearData({ ...threeYearData, [area.key]: e.target.value })
                  }
                  rows={3}
                />
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-end">
            <Button size="lg" onClick={handleSaveThreeYear} className="min-w-32">
              {saved ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Saved
                </>
              ) : (
                'Save 3-Year Vision'
              )}
            </Button>
          </div>
        </TabsContent>

        {/* 10 Year Vision */}
        <TabsContent value="10-year" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>10-Year Vision</CardTitle>
              <CardDescription>Your long game. Think big.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>The Snapshot</Label>
                <Textarea
                  placeholder="It's ten years from today. Describe your life."
                  value={tenYearData.snapshot}
                  onChange={(e) => setTenYearData({ ...tenYearData, snapshot: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Where do you live?</Label>
                  <Input
                    value={tenYearData.whereLive}
                    onChange={(e) => setTenYearData({ ...tenYearData, whereLive: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>What do you do?</Label>
                  <Input
                    value={tenYearData.whatDo}
                    onChange={(e) => setTenYearData({ ...tenYearData, whatDo: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>What&apos;s different from today?</Label>
                <Textarea
                  value={tenYearData.whatsDifferent}
                  onChange={(e) =>
                    setTenYearData({ ...tenYearData, whatsDifferent: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Areas */}
          {LIFE_AREAS.map((area) => (
            <Card key={area.key}>
              <CardHeader>
                <CardTitle>{area.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={`Where will you be in ${area.label.toLowerCase()} in 10 years?`}
                  value={tenYearData[area.key]}
                  onChange={(e) => setTenYearData({ ...tenYearData, [area.key]: e.target.value })}
                  rows={3}
                />
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-end">
            <Button size="lg" onClick={handleSaveTenYear} className="min-w-32">
              {saved ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Saved
                </>
              ) : (
                'Save 10-Year Vision'
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
