'use client';

import { useEffect, useState } from 'react';
import { format, getYear, subYears } from 'date-fns';
import {
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Star,
  Heart,
  Lightbulb,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

interface AnnualReviewData {
  year: number;
  // Part 1: Look Back
  oneWordForYear: string;
  overallRating: number;
  ifGoesWellResult: string;
  themeReflection: string;
  lifeMapScores: LifeMapScores;
  // Part 2: Wins & Lessons
  biggestWins: string[];
  proudestMoment: string;
  biggestChallenge: string;
  howOvercame: string;
  biggestFailure: string;
  lessonFromFailure: string;
  unexpectedSurprise: string;
  risksTaken: string[];
  playedSafe: string;
  // Part 3: Relationships
  relationshipHighlight: string;
  whoMissed: string;
  whoOutgrew: string;
  relationshipToNurture: string;
  whoThanked: string;
  whoNeedsThanking: string;
  // Part 4: Work & Career
  biggestProfessionalWin: string;
  skillsDeveloped: string[];
  projectsProud: string;
  projectsDropped: string;
  careerQuestion: string;
  // Part 5: Health & Energy
  healthHighlight: string;
  healthLowlight: string;
  averageEnergy: number;
  whatGaveEnergy: string[];
  whatDrainedEnergy: string[];
  habitKept: string;
  habitBroke: string;
  // Part 6: Finances
  financialWin: string;
  financialLesson: string;
  moneyRelationship: string;
  // Part 7: Inner Life
  meaningMoment: string;
  growthEdge: string;
  limitingBelief: string;
  newBelief: string;
  gratefulFor: string[];
  // Part 8: Pattern Recognition
  recurringTheme: string;
  consistentStrength: string;
  persistentWeakness: string;
  whatKeptShowing: string;
  whatAvoided: string;
  selfKnowledge: string;
  // Part 9: Forward Look
  nextYearTheme: string;
  nextYearWord: string;
  oneThingDifferent: string;
  bigBet: string;
  nonNegotiable: string;
  lettingGo: string;
  nextYearSuccess: string;
  // Part 10: Memory Captures
  quotesFromSelf: string[];
  photoMoments: string[];
  warningsToFutureSelf: string[];
  notes: string;
}

const defaultReviewData: AnnualReviewData = {
  year: new Date().getFullYear(),
  oneWordForYear: '',
  overallRating: 5,
  ifGoesWellResult: '',
  themeReflection: '',
  lifeMapScores: defaultLifeMapScores,
  biggestWins: ['', '', '', '', ''],
  proudestMoment: '',
  biggestChallenge: '',
  howOvercame: '',
  biggestFailure: '',
  lessonFromFailure: '',
  unexpectedSurprise: '',
  risksTaken: ['', ''],
  playedSafe: '',
  relationshipHighlight: '',
  whoMissed: '',
  whoOutgrew: '',
  relationshipToNurture: '',
  whoThanked: '',
  whoNeedsThanking: '',
  biggestProfessionalWin: '',
  skillsDeveloped: ['', ''],
  projectsProud: '',
  projectsDropped: '',
  careerQuestion: '',
  healthHighlight: '',
  healthLowlight: '',
  averageEnergy: 5,
  whatGaveEnergy: ['', ''],
  whatDrainedEnergy: ['', ''],
  habitKept: '',
  habitBroke: '',
  financialWin: '',
  financialLesson: '',
  moneyRelationship: '',
  meaningMoment: '',
  growthEdge: '',
  limitingBelief: '',
  newBelief: '',
  gratefulFor: ['', '', ''],
  recurringTheme: '',
  consistentStrength: '',
  persistentWeakness: '',
  whatKeptShowing: '',
  whatAvoided: '',
  selfKnowledge: '',
  nextYearTheme: '',
  nextYearWord: '',
  oneThingDifferent: '',
  bigBet: '',
  nonNegotiable: '',
  lettingGo: '',
  nextYearSuccess: '',
  quotesFromSelf: [''],
  photoMoments: [''],
  warningsToFutureSelf: [''],
  notes: '',
};

export default function AnnualReviewPage() {
  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [yearOffset, setYearOffset] = useState(0);
  const [annualReviews, setAnnualReviews] = useState<Record<number, AnnualReviewData>>({});

  const currentYear = getYear(subYears(new Date(), -yearOffset));

  const [formData, setFormData] = useState<AnnualReviewData>({
    ...defaultReviewData,
    year: currentYear,
  });

  const { goals } = useCEOStore();

  useEffect(() => {
    setMounted(true);
    // Load from localStorage
    const stored = localStorage.getItem('ceo-os-annual-reviews');
    if (stored) {
      setAnnualReviews(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      const existing = annualReviews[currentYear];
      if (existing) {
        setFormData(existing);
      } else {
        setFormData({
          ...defaultReviewData,
          year: currentYear,
          themeReflection: goals.oneYear.theme || '',
          ifGoesWellResult: goals.oneYear.ifGoesWell || '',
        });
      }
      setSaved(false);
    }
  }, [currentYear, mounted, annualReviews, goals.oneYear.theme, goals.oneYear.ifGoesWell]);

  const handleSave = () => {
    const updated = { ...annualReviews, [currentYear]: formData };
    setAnnualReviews(updated);
    localStorage.setItem('ceo-os-annual-reviews', JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateArrayItem = (
    field: keyof AnnualReviewData,
    index: number,
    value: string
  ) => {
    const newArray = [...(formData[field] as string[])];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: keyof AnnualReviewData) => {
    setFormData({ ...formData, [field]: [...(formData[field] as string[]), ''] });
  };

  const removeArrayItem = (field: keyof AnnualReviewData, index: number) => {
    const newArray = (formData[field] as string[]).filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray.length ? newArray : [''] });
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

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const isCurrentYear = yearOffset === 0;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Calendar className="h-8 w-8" />
            Annual Review
          </h1>
          <p className="text-muted-foreground mt-1">
            A half-day with your year. Take your time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setYearOffset(yearOffset - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => setYearOffset(0)}
            disabled={isCurrentYear}
          >
            This Year
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setYearOffset(yearOffset + 1)}
            disabled={isCurrentYear}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Year Display */}
      <div className="text-center py-6 border-b">
        <p className="text-4xl font-bold">{currentYear}</p>
        <p className="text-muted-foreground mt-2">Annual Review</p>
      </div>

      <Tabs defaultValue="look-back" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="look-back">Look Back</TabsTrigger>
          <TabsTrigger value="wins-lessons">Wins & Lessons</TabsTrigger>
          <TabsTrigger value="life-areas">Life Areas</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="forward">Forward</TabsTrigger>
        </TabsList>

        {/* Part 1: Look Back */}
        <TabsContent value="look-back" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                The Year in One Word
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>If you had to describe {currentYear} in ONE word, what would it be?</Label>
                <Input
                  placeholder="One word..."
                  value={formData.oneWordForYear}
                  onChange={(e) => setFormData({ ...formData, oneWordForYear: e.target.value })}
                  className="text-2xl font-bold text-center"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Overall Rating</CardTitle>
              <CardDescription>How would you rate {currentYear} overall?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Worst year</span>
                <span className="text-3xl font-bold">{formData.overallRating}/10</span>
                <span className="text-sm text-muted-foreground">Best year</span>
              </div>
              <Slider
                value={[formData.overallRating]}
                onValueChange={([v]) => setFormData({ ...formData, overallRating: v })}
                max={10}
                min={1}
                step={1}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Year Theme Reflection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.themeReflection && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Your theme was:</p>
                  <p className="font-medium">{formData.themeReflection}</p>
                </div>
              )}
              <div className="space-y-2">
                <Label>Did you live up to your theme? What happened?</Label>
                <Textarea
                  placeholder="Reflect on your year theme..."
                  value={formData.ifGoesWellResult}
                  onChange={(e) => setFormData({ ...formData, ifGoesWellResult: e.target.value })}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Life Map - End of Year</CardTitle>
              <CardDescription>Rate each area as it stands now</CardDescription>
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
                        <SelectValue placeholder="Year trend" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="up">Improved this year</SelectItem>
                        <SelectItem value="stable">Stayed same</SelectItem>
                        <SelectItem value="down">Declined this year</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Note..."
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
        </TabsContent>

        {/* Part 2: Wins & Lessons */}
        <TabsContent value="wins-lessons" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Top 5 Wins
              </CardTitle>
              <CardDescription>What were your biggest accomplishments?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {formData.biggestWins.map((win, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yellow-500 text-xs text-white">
                    {index + 1}
                  </span>
                  <Input
                    placeholder={`Win ${index + 1}...`}
                    value={win}
                    onChange={(e) => updateArrayItem('biggestWins', index, e.target.value)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Proudest Moment</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="The moment you're most proud of..."
                value={formData.proudestMoment}
                onChange={(e) => setFormData({ ...formData, proudestMoment: e.target.value })}
                rows={3}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Biggest Challenge</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>What was your biggest challenge?</Label>
                <Textarea
                  value={formData.biggestChallenge}
                  onChange={(e) => setFormData({ ...formData, biggestChallenge: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>How did you overcome it (or not)?</Label>
                <Textarea
                  value={formData.howOvercame}
                  onChange={(e) => setFormData({ ...formData, howOvercame: e.target.value })}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Biggest Failure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>What was your biggest failure or disappointment?</Label>
                <Textarea
                  value={formData.biggestFailure}
                  onChange={(e) => setFormData({ ...formData, biggestFailure: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>What did you learn from it?</Label>
                <Textarea
                  value={formData.lessonFromFailure}
                  onChange={(e) => setFormData({ ...formData, lessonFromFailure: e.target.value })}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Unexpected Surprise</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="What surprised you this year?"
                value={formData.unexpectedSurprise}
                onChange={(e) => setFormData({ ...formData, unexpectedSurprise: e.target.value })}
                rows={3}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Risks you took</Label>
                {formData.risksTaken.map((risk, index) => (
                  <Input
                    key={index}
                    placeholder="A risk you took..."
                    value={risk}
                    onChange={(e) => updateArrayItem('risksTaken', index, e.target.value)}
                  />
                ))}
              </div>
              <div className="space-y-2">
                <Label>Where did you play too safe?</Label>
                <Textarea
                  value={formData.playedSafe}
                  onChange={(e) => setFormData({ ...formData, playedSafe: e.target.value })}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Part 3: Life Areas */}
        <TabsContent value="life-areas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-500" />
                Relationships
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Relationship highlight of the year</Label>
                <Textarea
                  value={formData.relationshipHighlight}
                  onChange={(e) => setFormData({ ...formData, relationshipHighlight: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Who did you miss spending time with?</Label>
                  <Input
                    value={formData.whoMissed}
                    onChange={(e) => setFormData({ ...formData, whoMissed: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Who did you outgrow?</Label>
                  <Input
                    value={formData.whoOutgrew}
                    onChange={(e) => setFormData({ ...formData, whoOutgrew: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>One relationship to nurture next year</Label>
                <Input
                  value={formData.relationshipToNurture}
                  onChange={(e) => setFormData({ ...formData, relationshipToNurture: e.target.value })}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Who did you thank?</Label>
                  <Input
                    value={formData.whoThanked}
                    onChange={(e) => setFormData({ ...formData, whoThanked: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Who still needs thanking?</Label>
                  <Input
                    value={formData.whoNeedsThanking}
                    onChange={(e) => setFormData({ ...formData, whoNeedsThanking: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Work & Career</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Biggest professional win</Label>
                <Textarea
                  value={formData.biggestProfessionalWin}
                  onChange={(e) => setFormData({ ...formData, biggestProfessionalWin: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Skills developed</Label>
                {formData.skillsDeveloped.map((skill, index) => (
                  <Input
                    key={index}
                    placeholder="A skill you developed..."
                    value={skill}
                    onChange={(e) => updateArrayItem('skillsDeveloped', index, e.target.value)}
                  />
                ))}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Projects you&apos;re proud of</Label>
                  <Textarea
                    value={formData.projectsProud}
                    onChange={(e) => setFormData({ ...formData, projectsProud: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Projects you should have dropped</Label>
                  <Textarea
                    value={formData.projectsDropped}
                    onChange={(e) => setFormData({ ...formData, projectsDropped: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Career question you&apos;re still wrestling with</Label>
                <Textarea
                  value={formData.careerQuestion}
                  onChange={(e) => setFormData({ ...formData, careerQuestion: e.target.value })}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Health & Energy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Health highlight</Label>
                  <Textarea
                    value={formData.healthHighlight}
                    onChange={(e) => setFormData({ ...formData, healthHighlight: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Health lowlight</Label>
                  <Textarea
                    value={formData.healthLowlight}
                    onChange={(e) => setFormData({ ...formData, healthLowlight: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Average energy this year: {formData.averageEnergy}/10</Label>
                <Slider
                  value={[formData.averageEnergy]}
                  onValueChange={([v]) => setFormData({ ...formData, averageEnergy: v })}
                  max={10}
                  min={1}
                  step={1}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>What gave you energy?</Label>
                  {formData.whatGaveEnergy.map((item, index) => (
                    <Input
                      key={index}
                      placeholder="Energizer..."
                      value={item}
                      onChange={(e) => updateArrayItem('whatGaveEnergy', index, e.target.value)}
                    />
                  ))}
                </div>
                <div className="space-y-2">
                  <Label>What drained your energy?</Label>
                  {formData.whatDrainedEnergy.map((item, index) => (
                    <Input
                      key={index}
                      placeholder="Drainer..."
                      value={item}
                      onChange={(e) => updateArrayItem('whatDrainedEnergy', index, e.target.value)}
                    />
                  ))}
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Habit you kept</Label>
                  <Input
                    value={formData.habitKept}
                    onChange={(e) => setFormData({ ...formData, habitKept: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Habit you broke</Label>
                  <Input
                    value={formData.habitBroke}
                    onChange={(e) => setFormData({ ...formData, habitBroke: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Finances</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Financial win</Label>
                <Textarea
                  value={formData.financialWin}
                  onChange={(e) => setFormData({ ...formData, financialWin: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Financial lesson</Label>
                <Textarea
                  value={formData.financialLesson}
                  onChange={(e) => setFormData({ ...formData, financialLesson: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>How has your relationship with money changed?</Label>
                <Textarea
                  value={formData.moneyRelationship}
                  onChange={(e) => setFormData({ ...formData, moneyRelationship: e.target.value })}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-purple-500" />
                Inner Life & Meaning
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Most meaningful moment</Label>
                <Textarea
                  value={formData.meaningMoment}
                  onChange={(e) => setFormData({ ...formData, meaningMoment: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Where did you grow?</Label>
                <Textarea
                  value={formData.growthEdge}
                  onChange={(e) => setFormData({ ...formData, growthEdge: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Limiting belief you let go of</Label>
                  <Textarea
                    value={formData.limitingBelief}
                    onChange={(e) => setFormData({ ...formData, limitingBelief: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>New belief you adopted</Label>
                  <Textarea
                    value={formData.newBelief}
                    onChange={(e) => setFormData({ ...formData, newBelief: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Three things you&apos;re grateful for</Label>
                {formData.gratefulFor.map((item, index) => (
                  <Input
                    key={index}
                    placeholder={`Grateful for ${index + 1}...`}
                    value={item}
                    onChange={(e) => updateArrayItem('gratefulFor', index, e.target.value)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Part 4: Patterns */}
        <TabsContent value="patterns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pattern Recognition</CardTitle>
              <CardDescription>
                What patterns are you noticing about yourself?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Recurring theme this year</Label>
                <Textarea
                  placeholder="What theme kept showing up?"
                  value={formData.recurringTheme}
                  onChange={(e) => setFormData({ ...formData, recurringTheme: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>A consistent strength you relied on</Label>
                <Textarea
                  value={formData.consistentStrength}
                  onChange={(e) => setFormData({ ...formData, consistentStrength: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>A persistent weakness that held you back</Label>
                <Textarea
                  value={formData.persistentWeakness}
                  onChange={(e) => setFormData({ ...formData, persistentWeakness: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>What kept showing up that you ignored?</Label>
                <Textarea
                  value={formData.whatKeptShowing}
                  onChange={(e) => setFormData({ ...formData, whatKeptShowing: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>What did you avoid dealing with?</Label>
                <Textarea
                  value={formData.whatAvoided}
                  onChange={(e) => setFormData({ ...formData, whatAvoided: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>What do you know about yourself now that you didn&apos;t a year ago?</Label>
                <Textarea
                  placeholder="New self-knowledge..."
                  value={formData.selfKnowledge}
                  onChange={(e) => setFormData({ ...formData, selfKnowledge: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Part 5: Forward */}
        <TabsContent value="forward" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Next Year Vision</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Theme for {currentYear + 1}</Label>
                  <Input
                    placeholder="What will next year be about?"
                    value={formData.nextYearTheme}
                    onChange={(e) => setFormData({ ...formData, nextYearTheme: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>One word for {currentYear + 1}</Label>
                  <Input
                    placeholder="One word..."
                    value={formData.nextYearWord}
                    onChange={(e) => setFormData({ ...formData, nextYearWord: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>One thing you&apos;ll do differently</Label>
                <Textarea
                  value={formData.oneThingDifferent}
                  onChange={(e) => setFormData({ ...formData, oneThingDifferent: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>One big bet you&apos;ll make</Label>
                <Textarea
                  value={formData.bigBet}
                  onChange={(e) => setFormData({ ...formData, bigBet: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>One non-negotiable for next year</Label>
                <Textarea
                  value={formData.nonNegotiable}
                  onChange={(e) => setFormData({ ...formData, nonNegotiable: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>What you&apos;re letting go of</Label>
                <Textarea
                  value={formData.lettingGo}
                  onChange={(e) => setFormData({ ...formData, lettingGo: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>If {currentYear + 1} goes well, what will be true by December 31?</Label>
                <Textarea
                  placeholder="Describe success..."
                  value={formData.nextYearSuccess}
                  onChange={(e) => setFormData({ ...formData, nextYearSuccess: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Memory Captures</CardTitle>
              <CardDescription>Preserve these for future you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Quotes from yourself this year</Label>
                {formData.quotesFromSelf.map((quote, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Textarea
                      placeholder="Something you said or wrote..."
                      value={quote}
                      onChange={(e) => updateArrayItem('quotesFromSelf', index, e.target.value)}
                      rows={2}
                    />
                    {formData.quotesFromSelf.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeArrayItem('quotesFromSelf', index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addArrayItem('quotesFromSelf')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Quote
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Photo/memory moments to preserve</Label>
                {formData.photoMoments.map((moment, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder="A moment worth remembering..."
                      value={moment}
                      onChange={(e) => updateArrayItem('photoMoments', index, e.target.value)}
                    />
                    {formData.photoMoments.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeArrayItem('photoMoments', index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addArrayItem('photoMoments')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Moment
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Warnings to future self</Label>
                {formData.warningsToFutureSelf.map((warning, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Textarea
                      placeholder="Don't forget..."
                      value={warning}
                      onChange={(e) => updateArrayItem('warningsToFutureSelf', index, e.target.value)}
                      rows={2}
                    />
                    {formData.warningsToFutureSelf.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeArrayItem('warningsToFutureSelf', index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addArrayItem('warningsToFutureSelf')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Warning
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Anything else to capture..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={6}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end gap-4 pt-4">
        <Button size="lg" onClick={handleSave} className="min-w-32">
          {saved ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Saved
            </>
          ) : annualReviews[currentYear] ? (
            'Update Review'
          ) : (
            'Save Review'
          )}
        </Button>
      </div>
    </div>
  );
}
