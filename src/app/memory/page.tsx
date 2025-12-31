'use client';

import { useEffect, useState } from 'react';
import {
  Brain,
  Check,
  Plus,
  Minus,
  Lightbulb,
  Target,
  AlertTriangle,
  Quote,
  Book,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useCEOStore } from '@/lib/store';
import type { Memory, GoalArchaeologyItem, Quote as QuoteType, YearInsight } from '@/lib/types';

export default function MemoryPage() {
  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);
  const { memory, updateMemory } = useCEOStore();

  const [formData, setFormData] = useState<Memory>(memory);

  useEffect(() => {
    setMounted(true);
    setFormData(memory);
  }, [memory]);

  const handleSave = () => {
    updateMemory(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateStringArray = (field: keyof Memory, index: number, value: string) => {
    const arr = [...(formData[field] as string[])];
    arr[index] = value;
    setFormData({ ...formData, [field]: arr });
  };

  const addStringArrayItem = (field: keyof Memory) => {
    const arr = [...(formData[field] as string[])];
    setFormData({ ...formData, [field]: [...arr, ''] });
  };

  const removeStringArrayItem = (field: keyof Memory, index: number) => {
    const arr = (formData[field] as string[]).filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: arr.length ? arr : [''] });
  };

  const updateGoalArchaeology = (index: number, field: keyof GoalArchaeologyItem, value: string | number) => {
    const goals = [...formData.goalArchaeology];
    goals[index] = { ...goals[index], [field]: value };
    setFormData({ ...formData, goalArchaeology: goals });
  };

  const addGoalArchaeology = () => {
    setFormData({
      ...formData,
      goalArchaeology: [
        ...formData.goalArchaeology,
        { goal: '', firstAppeared: '', timesRepeated: 1, status: 'in-progress', notes: '' },
      ],
    });
  };

  const removeGoalArchaeology = (index: number) => {
    const goals = formData.goalArchaeology.filter((_, i) => i !== index);
    setFormData({ ...formData, goalArchaeology: goals });
  };

  const updateQuote = (index: number, field: keyof QuoteType, value: string) => {
    const quotes = [...formData.quotesFromPastSelf];
    quotes[index] = { ...quotes[index], [field]: value };
    setFormData({ ...formData, quotesFromPastSelf: quotes });
  };

  const addQuote = () => {
    setFormData({
      ...formData,
      quotesFromPastSelf: [
        ...formData.quotesFromPastSelf,
        { quote: '', source: '', date: '' },
      ],
    });
  };

  const removeQuote = (index: number) => {
    const quotes = formData.quotesFromPastSelf.filter((_, i) => i !== index);
    setFormData({ ...formData, quotesFromPastSelf: quotes });
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
          <Brain className="h-8 w-8" />
          Memory
        </h1>
        <p className="text-muted-foreground mt-1">
          Your accumulated self-knowledge. What you&apos;ve learned about yourself over time.
        </p>
      </div>

      {/* Intro Card */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            This is your living document of self-knowledge. Update it as you learn more about yourself
            through daily practice, reviews, and interviews. The goal is to never re-learn the same lessons.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="core" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="core">Core</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="archive">Archive</TabsTrigger>
        </TabsList>

        {/* Core Self-Knowledge */}
        <TabsContent value="core" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Executive Summary
              </CardTitle>
              <CardDescription>
                Who are you in a few paragraphs? Your &quot;user manual.&quot;
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Write a summary of who you are - your essence, what drives you, how you operate..."
                value={formData.executiveSummary}
                onChange={(e) => setFormData({ ...formData, executiveSummary: e.target.value })}
                rows={6}
              />
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Strengths</CardTitle>
                <CardDescription>What you&apos;re genuinely good at</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {(formData.strengths.length ? formData.strengths : ['']).map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder="A strength..."
                      value={item}
                      onChange={(e) => updateStringArray('strengths', index, e.target.value)}
                    />
                    {formData.strengths.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStringArrayItem('strengths', index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addStringArrayItem('strengths')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Growth Edges</CardTitle>
                <CardDescription>Areas for development</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {(formData.growthEdges.length ? formData.growthEdges : ['']).map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder="A growth edge..."
                      value={item}
                      onChange={(e) => updateStringArray('growthEdges', index, e.target.value)}
                    />
                    {formData.growthEdges.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStringArrayItem('growthEdges', index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addStringArrayItem('growthEdges')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-green-500">Energized By</CardTitle>
                <CardDescription>What gives you energy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {(formData.energizedBy.length ? formData.energizedBy : ['']).map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder="Something that energizes you..."
                      value={item}
                      onChange={(e) => updateStringArray('energizedBy', index, e.target.value)}
                    />
                    {formData.energizedBy.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStringArrayItem('energizedBy', index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addStringArrayItem('energizedBy')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-red-500">Drained By</CardTitle>
                <CardDescription>What depletes your energy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {(formData.drainedBy.length ? formData.drainedBy : ['']).map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder="Something that drains you..."
                      value={item}
                      onChange={(e) => updateStringArray('drainedBy', index, e.target.value)}
                    />
                    {formData.drainedBy.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStringArrayItem('drainedBy', index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addStringArrayItem('drainedBy')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Optimal Conditions</CardTitle>
              <CardDescription>When do you perform your best?</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Time of day, environment, state of mind, preparation needed..."
                value={formData.optimalConditions}
                onChange={(e) => setFormData({ ...formData, optimalConditions: e.target.value })}
                rows={3}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Patterns & Blind Spots */}
        <TabsContent value="patterns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tendencies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>What do you over-index on?</Label>
                <Textarea
                  placeholder="Things you do too much of, focus on excessively..."
                  value={formData.overIndexes}
                  onChange={(e) => setFormData({ ...formData, overIndexes: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>What do you under-weight?</Label>
                <Textarea
                  placeholder="Things you consistently neglect or undervalue..."
                  value={formData.underWeights}
                  onChange={(e) => setFormData({ ...formData, underWeights: e.target.value })}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Blind Spots
              </CardTitle>
              <CardDescription>
                What do others see that you don&apos;t? Recurring feedback?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {(formData.blindSpots.length ? formData.blindSpots : ['']).map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Textarea
                    placeholder="A blind spot or recurring feedback..."
                    value={item}
                    onChange={(e) => updateStringArray('blindSpots', index, e.target.value)}
                    rows={2}
                  />
                  {formData.blindSpots.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeStringArrayItem('blindSpots', index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addStringArrayItem('blindSpots')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Blind Spot
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Goal Archaeology
              </CardTitle>
              <CardDescription>
                Track goals that keep appearing. Which ones are truly important vs. just familiar?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.goalArchaeology.map((goal, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <Input
                      placeholder="The goal..."
                      value={goal.goal}
                      onChange={(e) => updateGoalArchaeology(index, 'goal', e.target.value)}
                      className="font-medium"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeGoalArchaeology(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="space-y-1">
                      <Label className="text-xs">First appeared</Label>
                      <Input
                        placeholder="e.g., 2020"
                        value={goal.firstAppeared}
                        onChange={(e) => updateGoalArchaeology(index, 'firstAppeared', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Times repeated</Label>
                      <Input
                        type="number"
                        min={1}
                        value={goal.timesRepeated}
                        onChange={(e) =>
                          updateGoalArchaeology(index, 'timesRepeated', parseInt(e.target.value) || 1)
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Status</Label>
                      <Select
                        value={goal.status}
                        onValueChange={(v) => updateGoalArchaeology(index, 'status', v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="achieved">Achieved</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="abandoned">Abandoned</SelectItem>
                          <SelectItem value="recurring">Recurring (annual)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Textarea
                    placeholder="Notes - Why does this keep appearing? Is it truly important?"
                    value={goal.notes}
                    onChange={(e) => updateGoalArchaeology(index, 'notes', e.target.value)}
                    rows={2}
                  />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addGoalArchaeology}>
                <Plus className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lessons Learned */}
        <TabsContent value="lessons" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Lessons by Domain
              </CardTitle>
              <CardDescription>
                What have you learned that you never want to forget?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="font-semibold">Work & Career</Label>
                {(formData.lessonsWork.length ? formData.lessonsWork : ['']).map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Textarea
                      placeholder="A lesson about work..."
                      value={item}
                      onChange={(e) => updateStringArray('lessonsWork', index, e.target.value)}
                      rows={2}
                    />
                    {formData.lessonsWork.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStringArrayItem('lessonsWork', index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addStringArrayItem('lessonsWork')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="font-semibold">Relationships</Label>
                {(formData.lessonsRelationships.length ? formData.lessonsRelationships : ['']).map(
                  (item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Textarea
                        placeholder="A lesson about relationships..."
                        value={item}
                        onChange={(e) =>
                          updateStringArray('lessonsRelationships', index, e.target.value)
                        }
                        rows={2}
                      />
                      {formData.lessonsRelationships.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeStringArrayItem('lessonsRelationships', index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addStringArrayItem('lessonsRelationships')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="font-semibold">Self</Label>
                {(formData.lessonsSelf.length ? formData.lessonsSelf : ['']).map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Textarea
                      placeholder="A lesson about yourself..."
                      value={item}
                      onChange={(e) => updateStringArray('lessonsSelf', index, e.target.value)}
                      rows={2}
                    />
                    {formData.lessonsSelf.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStringArrayItem('lessonsSelf', index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addStringArrayItem('lessonsSelf')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="font-semibold">Life in General</Label>
                {(formData.lessonsLife.length ? formData.lessonsLife : ['']).map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Textarea
                      placeholder="A life lesson..."
                      value={item}
                      onChange={(e) => updateStringArray('lessonsLife', index, e.target.value)}
                      rows={2}
                    />
                    {formData.lessonsLife.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStringArrayItem('lessonsLife', index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addStringArrayItem('lessonsLife')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Archive */}
        <TabsContent value="archive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Quote className="h-5 w-5" />
                Quotes From Past Self
              </CardTitle>
              <CardDescription>
                Things you wrote or said that you want to remember
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.quotesFromPastSelf.map((q, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <Textarea
                    placeholder="The quote..."
                    value={q.quote}
                    onChange={(e) => updateQuote(index, 'quote', e.target.value)}
                    rows={2}
                    className="italic"
                  />
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input
                      placeholder="Source (journal, interview, etc.)"
                      value={q.source}
                      onChange={(e) => updateQuote(index, 'source', e.target.value)}
                    />
                    <Input
                      placeholder="Date"
                      value={q.date}
                      onChange={(e) => updateQuote(index, 'date', e.target.value)}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuote(index)}
                    className="text-muted-foreground"
                  >
                    <Minus className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addQuote}>
                <Plus className="h-4 w-4 mr-2" />
                Add Quote
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-500">
                <AlertTriangle className="h-5 w-5" />
                Warnings to Future Self
              </CardTitle>
              <CardDescription>
                Things you know will tempt you. Traps to avoid.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {(formData.warningsToFutureSelf.length ? formData.warningsToFutureSelf : ['']).map(
                (item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Textarea
                      placeholder="A warning or reminder..."
                      value={item}
                      onChange={(e) => updateStringArray('warningsToFutureSelf', index, e.target.value)}
                      rows={2}
                    />
                    {formData.warningsToFutureSelf.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStringArrayItem('warningsToFutureSelf', index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addStringArrayItem('warningsToFutureSelf')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Warning
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Raw Notes</CardTitle>
              <CardDescription>
                Anything else you want to preserve. Unstructured thoughts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Notes, observations, anything..."
                value={formData.rawNotes}
                onChange={(e) => setFormData({ ...formData, rawNotes: e.target.value })}
                rows={8}
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
          ) : (
            'Save Memory'
          )}
        </Button>
      </div>
    </div>
  );
}
