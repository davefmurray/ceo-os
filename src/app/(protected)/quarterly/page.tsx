'use client';

import { useEffect, useState } from 'react';
import { format, getQuarter, getYear, parseISO, startOfQuarter, endOfQuarter, subQuarters } from 'date-fns';
import {
  BarChart3,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  TrendingUp,
  TrendingDown,
  Circle,
  Target,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCEOStore } from '@/lib/store';
import type { GoalProgress, LifeMapScores } from '@/lib/types';

const LIFE_AREAS = [
  { key: 'career', label: 'Career / Work', color: 'bg-blue-500' },
  { key: 'relationships', label: 'Relationships', color: 'bg-pink-500' },
  { key: 'health', label: 'Health', color: 'bg-green-500' },
  { key: 'finances', label: 'Finances', color: 'bg-yellow-500' },
  { key: 'meaning', label: 'Meaning / Purpose', color: 'bg-purple-500' },
  { key: 'fun', label: 'Fun / Adventure', color: 'bg-orange-500' },
] as const;

type AreaKey = (typeof LIFE_AREAS)[number]['key'];

const defaultLifeMapScores: LifeMapScores = {
  career: 5,
  careerTrend: 'stable',
  careerNote: '',
  relationships: 5,
  relationshipsTrend: 'stable',
  relationshipsNote: '',
  health: 5,
  healthTrend: 'stable',
  healthNote: '',
  finances: 5,
  financesTrend: 'stable',
  financesNote: '',
  meaning: 5,
  meaningTrend: 'stable',
  meaningNote: '',
  fun: 5,
  funTrend: 'stable',
  funNote: '',
};

export default function QuarterlyReview() {
  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [currentQuarterOffset, setCurrentQuarterOffset] = useState(0);

  const { getQuarterlyReview, addQuarterlyReview, updateQuarterlyReview, goals } = useCEOStore();

  const getQuarterKey = (offset: number) => {
    const date = subQuarters(new Date(), -offset);
    const quarter = getQuarter(date);
    const year = getYear(date);
    return `${year}-Q${quarter}`;
  };

  const quarterKey = getQuarterKey(currentQuarterOffset);
  const quarterDate = subQuarters(new Date(), -currentQuarterOffset);
  const quarterStart = startOfQuarter(quarterDate);
  const quarterEnd = endOfQuarter(quarterDate);

  const [formData, setFormData] = useState({
    goalProgress: [] as GoalProgress[],
    lifeMapScores: defaultLifeMapScores,
    averageEnergy: 5,
    bestMonth: '',
    bestMonthWhy: '',
    worstMonth: '',
    worstMonthWhy: '',
    energizers: ['', ''],
    drainers: ['', ''],
    sustainablePace: '',
    workingOnWhatMatters: '',
    timeGap: '',
    saidYesShouldntHave: '',
    missedOpportunity: '',
    keyWins: ['', '', ''],
    unexpectedWin: '',
    keyChallenges: ['', '', ''],
    persistentProblem: '',
    avoidingDecision: '',
    lessonLearned: '',
    newKnowledge: '',
    clearerPattern: '',
    startDoing: ['', ''],
    stopDoing: ['', ''],
    continueDoing: ['', ''],
    nextQuarterTheme: '',
    nextPriorities: ['', '', ''],
    whatWillBeTrue: '',
    oneThingEasier: '',
    directionStillAccurate: '',
    needsToChange: '',
    memoryInsights: [''],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const existing = getQuarterlyReview(quarterKey);
      if (existing) {
        setFormData({
          goalProgress: existing.goalProgress,
          lifeMapScores: existing.lifeMapScores,
          averageEnergy: existing.averageEnergy,
          bestMonth: existing.bestMonth,
          bestMonthWhy: existing.bestMonthWhy,
          worstMonth: existing.worstMonth,
          worstMonthWhy: existing.worstMonthWhy,
          energizers: existing.energizers.length >= 2 ? existing.energizers : [...existing.energizers, ''].slice(0, 2),
          drainers: existing.drainers.length >= 2 ? existing.drainers : [...existing.drainers, ''].slice(0, 2),
          sustainablePace: existing.sustainablePace,
          workingOnWhatMatters: existing.workingOnWhatMatters,
          timeGap: existing.timeGap,
          saidYesShouldntHave: existing.saidYesShouldntHave,
          missedOpportunity: existing.missedOpportunity,
          keyWins: existing.keyWins.length >= 3 ? existing.keyWins : [...existing.keyWins, '', ''].slice(0, 3),
          unexpectedWin: existing.unexpectedWin,
          keyChallenges: existing.keyChallenges.length >= 3 ? existing.keyChallenges : [...existing.keyChallenges, '', ''].slice(0, 3),
          persistentProblem: existing.persistentProblem,
          avoidingDecision: existing.avoidingDecision,
          lessonLearned: existing.lessonLearned,
          newKnowledge: existing.newKnowledge,
          clearerPattern: existing.clearerPattern,
          startDoing: existing.startDoing.length >= 2 ? existing.startDoing : [...existing.startDoing, ''].slice(0, 2),
          stopDoing: existing.stopDoing.length >= 2 ? existing.stopDoing : [...existing.stopDoing, ''].slice(0, 2),
          continueDoing: existing.continueDoing.length >= 2 ? existing.continueDoing : [...existing.continueDoing, ''].slice(0, 2),
          nextQuarterTheme: existing.nextQuarterTheme,
          nextPriorities: existing.nextPriorities.length >= 3 ? existing.nextPriorities : [...existing.nextPriorities, '', ''].slice(0, 3),
          whatWillBeTrue: existing.whatWillBeTrue,
          oneThingEasier: existing.oneThingEasier,
          directionStillAccurate: existing.directionStillAccurate,
          needsToChange: existing.needsToChange,
          memoryInsights: existing.memoryInsights.length ? existing.memoryInsights : [''],
        });
      } else {
        // Load critical three as default goal progress
        const criticalGoals = goals.oneYear.criticalThree
          .filter(Boolean)
          .map((goal) => ({
            goal,
            status: 'on-track' as const,
            progress: 25,
            notes: '',
          }));
        setFormData({
          goalProgress: criticalGoals.length ? criticalGoals : [],
          lifeMapScores: defaultLifeMapScores,
          averageEnergy: 5,
          bestMonth: '',
          bestMonthWhy: '',
          worstMonth: '',
          worstMonthWhy: '',
          energizers: ['', ''],
          drainers: ['', ''],
          sustainablePace: '',
          workingOnWhatMatters: '',
          timeGap: '',
          saidYesShouldntHave: '',
          missedOpportunity: '',
          keyWins: ['', '', ''],
          unexpectedWin: '',
          keyChallenges: ['', '', ''],
          persistentProblem: '',
          avoidingDecision: '',
          lessonLearned: '',
          newKnowledge: '',
          clearerPattern: '',
          startDoing: ['', ''],
          stopDoing: ['', ''],
          continueDoing: ['', ''],
          nextQuarterTheme: '',
          nextPriorities: ['', '', ''],
          whatWillBeTrue: '',
          oneThingEasier: '',
          directionStillAccurate: '',
          needsToChange: '',
          memoryInsights: [''],
        });
      }
      setSaved(false);
    }
  }, [quarterKey, mounted, getQuarterlyReview, goals.oneYear.criticalThree]);

  const handleSave = () => {
    const existing = getQuarterlyReview(quarterKey);
    const reviewData = {
      ...formData,
      quarter: quarterKey,
      startDate: format(quarterStart, 'yyyy-MM-dd'),
      endDate: format(quarterEnd, 'yyyy-MM-dd'),
      energizers: formData.energizers.filter(Boolean),
      drainers: formData.drainers.filter(Boolean),
      keyWins: formData.keyWins.filter(Boolean),
      keyChallenges: formData.keyChallenges.filter(Boolean),
      startDoing: formData.startDoing.filter(Boolean),
      stopDoing: formData.stopDoing.filter(Boolean),
      continueDoing: formData.continueDoing.filter(Boolean),
      nextPriorities: formData.nextPriorities.filter(Boolean),
      memoryInsights: formData.memoryInsights.filter(Boolean),
    };

    if (existing) {
      updateQuarterlyReview(existing.id, reviewData);
    } else {
      addQuarterlyReview(reviewData);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateArrayItem = (
    field: 'energizers' | 'drainers' | 'keyWins' | 'keyChallenges' | 'startDoing' | 'stopDoing' | 'continueDoing' | 'nextPriorities' | 'memoryInsights',
    index: number,
    value: string
  ) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const updateGoalProgress = (index: number, field: keyof GoalProgress, value: string | number) => {
    const newProgress = [...formData.goalProgress];
    newProgress[index] = { ...newProgress[index], [field]: value };
    setFormData({ ...formData, goalProgress: newProgress });
  };

  const updateLifeMapScore = (area: AreaKey, field: 'score' | 'trend' | 'note', value: number | string) => {
    if (field === 'score') {
      setFormData({
        ...formData,
        lifeMapScores: { ...formData.lifeMapScores, [area]: value as number },
      });
    } else if (field === 'trend') {
      setFormData({
        ...formData,
        lifeMapScores: { ...formData.lifeMapScores, [`${area}Trend`]: value as 'up' | 'down' | 'stable' },
      });
    } else {
      setFormData({
        ...formData,
        lifeMapScores: { ...formData.lifeMapScores, [`${area}Note`]: value as string },
      });
    }
  };

  const addMemoryInsight = () => {
    setFormData({ ...formData, memoryInsights: [...formData.memoryInsights, ''] });
  };

  const removeMemoryInsight = (index: number) => {
    const newInsights = formData.memoryInsights.filter((_, i) => i !== index);
    setFormData({ ...formData, memoryInsights: newInsights.length ? newInsights : [''] });
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const existingReview = getQuarterlyReview(quarterKey);
  const isCurrentQuarter = currentQuarterOffset === 0;

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const StatusIcon = ({ status }: { status: GoalProgress['status'] }) => {
    switch (status) {
      case 'ahead':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'on-track':
        return <Target className="h-4 w-4 text-blue-500" />;
      case 'behind':
        return <TrendingDown className="h-4 w-4 text-yellow-500" />;
      case 'abandoned':
        return <Circle className="h-4 w-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Quarterly Review
          </h1>
          <p className="text-muted-foreground mt-1">60 minutes to recalibrate</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentQuarterOffset(currentQuarterOffset - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentQuarterOffset(0)}
            disabled={isCurrentQuarter}
          >
            This Quarter
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentQuarterOffset(currentQuarterOffset + 1)}
            disabled={isCurrentQuarter}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quarter Display */}
      <div className="text-center py-4 border-b">
        <p className="text-2xl font-semibold">{quarterKey}</p>
        <p className="text-muted-foreground">
          {format(quarterStart, 'MMM d')} - {format(quarterEnd, 'MMM d, yyyy')}
        </p>
        {existingReview && (
          <p className="text-sm text-muted-foreground mt-1">
            Last updated: {format(parseISO(existingReview.updatedAt), 'MMM d, h:mm a')}
          </p>
        )}
      </div>

      {/* Goal Progress */}
      {formData.goalProgress.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Goal Progress Check</CardTitle>
            <CardDescription>How are your critical priorities tracking?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.goalProgress.map((goal, index) => (
              <div key={index} className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <p className="font-medium flex-1">{goal.goal}</p>
                  <StatusIcon status={goal.status} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={goal.status}
                      onValueChange={(v) => updateGoalProgress(index, 'status', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ahead">Ahead of schedule</SelectItem>
                        <SelectItem value="on-track">On track</SelectItem>
                        <SelectItem value="behind">Behind</SelectItem>
                        <SelectItem value="abandoned">Abandoned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Progress</Label>
                      <span className="text-sm">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} />
                    <Slider
                      value={[goal.progress]}
                      onValueChange={([v]) => updateGoalProgress(index, 'progress', v)}
                      max={100}
                      min={0}
                      step={5}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="What's the current state?"
                    value={goal.notes}
                    onChange={(e) => updateGoalProgress(index, 'notes', e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Life Map Snapshot */}
      <Card>
        <CardHeader>
          <CardTitle>Life Map Snapshot</CardTitle>
          <CardDescription>How do you rate each area this quarter?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {LIFE_AREAS.map((area) => (
            <div key={area.key} className="space-y-2 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${area.color}`} />
                  <span className="font-medium">{area.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendIcon
                    trend={
                      formData.lifeMapScores[
                        `${area.key}Trend` as keyof LifeMapScores
                      ] as 'up' | 'down' | 'stable'
                    }
                  />
                  <span className="text-lg font-bold">
                    {formData.lifeMapScores[area.key as keyof LifeMapScores]}/10
                  </span>
                </div>
              </div>
              <Slider
                value={[formData.lifeMapScores[area.key as keyof LifeMapScores] as number]}
                onValueChange={([v]) => updateLifeMapScore(area.key, 'score', v)}
                max={10}
                min={1}
                step={1}
              />
              <div className="grid gap-2 md:grid-cols-2">
                <Select
                  value={
                    formData.lifeMapScores[
                      `${area.key}Trend` as keyof LifeMapScores
                    ] as string
                  }
                  onValueChange={(v) => updateLifeMapScore(area.key, 'trend', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Trend" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="up">Improving</SelectItem>
                    <SelectItem value="stable">Stable</SelectItem>
                    <SelectItem value="down">Declining</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Quick note..."
                  value={
                    formData.lifeMapScores[
                      `${area.key}Note` as keyof LifeMapScores
                    ] as string
                  }
                  onChange={(e) => updateLifeMapScore(area.key, 'note', e.target.value)}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Energy Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Energy Analysis</CardTitle>
          <CardDescription>Average energy this quarter: {formData.averageEnergy}/10</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Slider
            value={[formData.averageEnergy]}
            onValueChange={([v]) => setFormData({ ...formData, averageEnergy: v })}
            max={10}
            min={1}
            step={1}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Best Month</Label>
              <Input
                placeholder="e.g., February"
                value={formData.bestMonth}
                onChange={(e) => setFormData({ ...formData, bestMonth: e.target.value })}
              />
              <Textarea
                placeholder="Why was it the best?"
                value={formData.bestMonthWhy}
                onChange={(e) => setFormData({ ...formData, bestMonthWhy: e.target.value })}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Worst Month</Label>
              <Input
                placeholder="e.g., March"
                value={formData.worstMonth}
                onChange={(e) => setFormData({ ...formData, worstMonth: e.target.value })}
              />
              <Textarea
                placeholder="Why was it the worst?"
                value={formData.worstMonthWhy}
                onChange={(e) => setFormData({ ...formData, worstMonthWhy: e.target.value })}
                rows={2}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>What energized you?</Label>
              {formData.energizers.map((item, index) => (
                <Input
                  key={index}
                  placeholder="Energizer..."
                  value={item}
                  onChange={(e) => updateArrayItem('energizers', index, e.target.value)}
                />
              ))}
            </div>
            <div className="space-y-2">
              <Label>What drained you?</Label>
              {formData.drainers.map((item, index) => (
                <Input
                  key={index}
                  placeholder="Drainer..."
                  value={item}
                  onChange={(e) => updateArrayItem('drainers', index, e.target.value)}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Audit */}
      <Card>
        <CardHeader>
          <CardTitle>Time & Focus Audit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Was your pace sustainable?</Label>
            <Textarea
              placeholder="Reflect on your work/life balance this quarter..."
              value={formData.sustainablePace}
              onChange={(e) => setFormData({ ...formData, sustainablePace: e.target.value })}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Were you working on what matters most?</Label>
            <Textarea
              placeholder="Did your time match your priorities?"
              value={formData.workingOnWhatMatters}
              onChange={(e) => setFormData({ ...formData, workingOnWhatMatters: e.target.value })}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Where did time go that you can&apos;t justify?</Label>
            <Textarea
              placeholder="Time sinks and leaks..."
              value={formData.timeGap}
              onChange={(e) => setFormData({ ...formData, timeGap: e.target.value })}
              rows={2}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>What did you say yes to that you shouldn&apos;t have?</Label>
              <Textarea
                value={formData.saidYesShouldntHave}
                onChange={(e) => setFormData({ ...formData, saidYesShouldntHave: e.target.value })}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>What opportunity did you miss?</Label>
              <Textarea
                value={formData.missedOpportunity}
                onChange={(e) => setFormData({ ...formData, missedOpportunity: e.target.value })}
                rows={2}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wins & Challenges */}
      <Card>
        <CardHeader>
          <CardTitle>Wins & Challenges</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Key Wins (Top 3)</Label>
            {formData.keyWins.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500 text-xs text-white">
                  {index + 1}
                </span>
                <Input
                  placeholder={`Win ${index + 1}...`}
                  value={item}
                  onChange={(e) => updateArrayItem('keyWins', index, e.target.value)}
                />
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Label>Unexpected Win</Label>
            <Input
              placeholder="Something good you didn't plan for..."
              value={formData.unexpectedWin}
              onChange={(e) => setFormData({ ...formData, unexpectedWin: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Key Challenges (Top 3)</Label>
            {formData.keyChallenges.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yellow-500 text-xs text-white">
                  {index + 1}
                </span>
                <Input
                  placeholder={`Challenge ${index + 1}...`}
                  value={item}
                  onChange={(e) => updateArrayItem('keyChallenges', index, e.target.value)}
                />
              </div>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>What problem keeps showing up?</Label>
              <Textarea
                value={formData.persistentProblem}
                onChange={(e) => setFormData({ ...formData, persistentProblem: e.target.value })}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>What decision are you avoiding?</Label>
              <Textarea
                value={formData.avoidingDecision}
                onChange={(e) => setFormData({ ...formData, avoidingDecision: e.target.value })}
                rows={2}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning */}
      <Card>
        <CardHeader>
          <CardTitle>Learning & Patterns</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>One lesson that changed how you think</Label>
            <Textarea
              placeholder="The biggest insight this quarter..."
              value={formData.lessonLearned}
              onChange={(e) => setFormData({ ...formData, lessonLearned: e.target.value })}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>New knowledge or skill acquired</Label>
            <Textarea
              value={formData.newKnowledge}
              onChange={(e) => setFormData({ ...formData, newKnowledge: e.target.value })}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>What pattern about yourself is becoming clearer?</Label>
            <Textarea
              placeholder="A recurring theme you're noticing..."
              value={formData.clearerPattern}
              onChange={(e) => setFormData({ ...formData, clearerPattern: e.target.value })}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Start/Stop/Continue */}
      <Card>
        <CardHeader>
          <CardTitle>Start / Stop / Continue</CardTitle>
          <CardDescription>Changes for next quarter</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-green-500">Start Doing</Label>
            {formData.startDoing.map((item, index) => (
              <Input
                key={index}
                placeholder="Something to begin..."
                value={item}
                onChange={(e) => updateArrayItem('startDoing', index, e.target.value)}
              />
            ))}
          </div>
          <div className="space-y-2">
            <Label className="text-red-500">Stop Doing</Label>
            {formData.stopDoing.map((item, index) => (
              <Input
                key={index}
                placeholder="Something to end..."
                value={item}
                onChange={(e) => updateArrayItem('stopDoing', index, e.target.value)}
              />
            ))}
          </div>
          <div className="space-y-2">
            <Label className="text-blue-500">Continue Doing</Label>
            {formData.continueDoing.map((item, index) => (
              <Input
                key={index}
                placeholder="Something working well..."
                value={item}
                onChange={(e) => updateArrayItem('continueDoing', index, e.target.value)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Quarter */}
      <Card>
        <CardHeader>
          <CardTitle>Next Quarter Planning</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Theme for Next Quarter</Label>
            <Input
              placeholder="In a few words, what is next quarter about?"
              value={formData.nextQuarterTheme}
              onChange={(e) => setFormData({ ...formData, nextQuarterTheme: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Top 3 Priorities</Label>
            {formData.nextPriorities.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {index + 1}
                </span>
                <Input
                  placeholder={`Priority ${index + 1}...`}
                  value={item}
                  onChange={(e) => updateArrayItem('nextPriorities', index, e.target.value)}
                />
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Label>If next quarter goes well, what will be true?</Label>
            <Textarea
              placeholder="By end of next quarter..."
              value={formData.whatWillBeTrue}
              onChange={(e) => setFormData({ ...formData, whatWillBeTrue: e.target.value })}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>What ONE thing could make everything else easier?</Label>
            <Textarea
              value={formData.oneThingEasier}
              onChange={(e) => setFormData({ ...formData, oneThingEasier: e.target.value })}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Direction Check */}
      <Card>
        <CardHeader>
          <CardTitle>Direction Check</CardTitle>
          <CardDescription>Is your North Star still accurate?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Is your direction still accurate?</Label>
            <Textarea
              placeholder="Does your North Star still feel right?"
              value={formData.directionStillAccurate}
              onChange={(e) => setFormData({ ...formData, directionStillAccurate: e.target.value })}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>What, if anything, needs to change?</Label>
            <Textarea
              value={formData.needsToChange}
              onChange={(e) => setFormData({ ...formData, needsToChange: e.target.value })}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Memory Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Add to Memory</CardTitle>
          <CardDescription>
            Insights worth preserving for your future self
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {formData.memoryInsights.map((insight, index) => (
            <div key={index} className="flex items-center gap-2">
              <Textarea
                placeholder="An insight to remember..."
                value={insight}
                onChange={(e) => updateArrayItem('memoryInsights', index, e.target.value)}
                rows={2}
              />
              {formData.memoryInsights.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeMemoryInsight(index)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addMemoryInsight}>
            <Plus className="h-4 w-4 mr-2" />
            Add Insight
          </Button>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-4 pt-4">
        <Button size="lg" onClick={handleSave} className="min-w-32">
          {saved ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Saved
            </>
          ) : existingReview ? (
            'Update'
          ) : (
            'Save Review'
          )}
        </Button>
      </div>
    </div>
  );
}
