'use client';

import { useEffect, useState } from 'react';
import { Compass, Check, Plus, Minus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useCEOStore } from '@/lib/store';

const LIFE_AREAS = [
  { key: 'career', label: 'Career / Work' },
  { key: 'relationships', label: 'Relationships' },
  { key: 'health', label: 'Health' },
  { key: 'finances', label: 'Finances' },
  { key: 'meaning', label: 'Meaning / Purpose' },
  { key: 'fun', label: 'Fun / Adventure' },
] as const;

export default function NorthStarPage() {
  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);
  const { northStar, updateNorthStar } = useCEOStore();

  const [formData, setFormData] = useState(northStar);

  useEffect(() => {
    setMounted(true);
    setFormData(northStar);
  }, [northStar]);

  const handleSave = () => {
    updateNorthStar(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateRanking = (area: string, field: 'rank' | 'why', value: string | number) => {
    const newRankings = formData.areaRankings.map((r) =>
      r.area === area ? { ...r, [field]: value } : r
    );
    setFormData({ ...formData, areaRankings: newRankings });
  };

  const addToArray = (field: 'nonNegotiables' | 'sayingNoTo') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const updateArrayItem = (field: 'nonNegotiables' | 'sayingNoTo', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const removeFromArray = (field: 'nonNegotiables' | 'sayingNoTo', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray.length ? newArray : [''] });
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Compass className="h-8 w-8" />
          North Star
        </h1>
        <p className="text-muted-foreground mt-1">
          Your current direction. Not a life sentence — a snapshot of where you&apos;re pointed.
        </p>
      </div>

      {/* The One Sentence */}
      <Card>
        <CardHeader>
          <CardTitle>The One Sentence</CardTitle>
          <CardDescription>
            If this year goes well, what will be true by the end?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Write one sentence. Not a goal list. A direction."
            value={formData.oneSentence}
            onChange={(e) => setFormData({ ...formData, oneSentence: e.target.value })}
            rows={3}
            className="text-lg"
          />
        </CardContent>
      </Card>

      {/* Current Chapter */}
      <Card>
        <CardHeader>
          <CardTitle>Current Chapter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Stage of Life</Label>
              <Input
                placeholder="e.g., Building, Scaling, Transitioning..."
                value={formData.stageOfLife}
                onChange={(e) => setFormData({ ...formData, stageOfLife: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Years in this chapter</Label>
              <Input
                type="number"
                min={0}
                value={formData.yearsInChapter || ''}
                onChange={(e) =>
                  setFormData({ ...formData, yearsInChapter: parseInt(e.target.value) || 0 })
                }
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Primary Role</Label>
              <Input
                placeholder="Your current title/function"
                value={formData.primaryRole}
                onChange={(e) => setFormData({ ...formData, primaryRole: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Company / Organization</Label>
              <Input
                placeholder="Where you work"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>What defines this chapter?</Label>
            <Textarea
              placeholder="What makes this period distinct from what came before?"
              value={formData.whatDefinesChapter}
              onChange={(e) => setFormData({ ...formData, whatDefinesChapter: e.target.value })}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* What Matters Most */}
      <Card>
        <CardHeader>
          <CardTitle>What Matters Most (Right Now)</CardTitle>
          <CardDescription>
            Rank these 1-6 based on where your attention needs to be this year
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {LIFE_AREAS.map((area) => {
            const ranking = formData.areaRankings.find((r) => r.area === area.key);
            return (
              <div key={area.key} className="flex items-start gap-4 p-4 rounded-lg border">
                <div className="space-y-2 w-24">
                  <Label className="text-sm font-medium">{area.label}</Label>
                  <Input
                    type="number"
                    min={1}
                    max={6}
                    placeholder="#"
                    value={ranking?.rank || ''}
                    onChange={(e) => updateRanking(area.key, 'rank', parseInt(e.target.value) || 0)}
                    className="w-16"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label className="text-xs text-muted-foreground">Why this ranking?</Label>
                  <Input
                    placeholder="Brief reason..."
                    value={ranking?.why || ''}
                    onChange={(e) => updateRanking(area.key, 'why', e.target.value)}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Non-Negotiables */}
      <Card>
        <CardHeader>
          <CardTitle>The Non-Negotiables</CardTitle>
          <CardDescription>What must remain true regardless of circumstances?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {(formData.nonNegotiables.length ? formData.nonNegotiables : ['']).map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder="A non-negotiable..."
                value={item}
                onChange={(e) => updateArrayItem('nonNegotiables', index, e.target.value)}
              />
              {formData.nonNegotiables.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromArray('nonNegotiables', index)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => addToArray('nonNegotiables')}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </CardContent>
      </Card>

      {/* Saying No To */}
      <Card>
        <CardHeader>
          <CardTitle>What You&apos;re Saying No To</CardTitle>
          <CardDescription>
            Clarity requires boundaries. What are you explicitly not pursuing right now?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {(formData.sayingNoTo.length ? formData.sayingNoTo : ['']).map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder="Something you're not pursuing..."
                value={item}
                onChange={(e) => updateArrayItem('sayingNoTo', index, e.target.value)}
              />
              {formData.sayingNoTo.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromArray('sayingNoTo', index)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => addToArray('sayingNoTo')}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </CardContent>
      </Card>

      {/* The Central Question */}
      <Card>
        <CardHeader>
          <CardTitle>The Question You&apos;re Living</CardTitle>
          <CardDescription>
            What&apos;s the central question you&apos;re trying to answer in this chapter of your life?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="One question. The one that keeps surfacing."
            value={formData.centralQuestion}
            onChange={(e) => setFormData({ ...formData, centralQuestion: e.target.value })}
            rows={2}
            className="text-lg"
          />
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
          <CardDescription>Additional context that doesn&apos;t fit above</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Any other thoughts..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={4}
          />
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
            'Save North Star'
          )}
        </Button>
      </div>
    </div>
  );
}
