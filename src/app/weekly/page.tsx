'use client';

import { useEffect, useState } from 'react';
import { format, startOfWeek, endOfWeek, getWeek, getYear, parseISO, subWeeks } from 'date-fns';
import { CalendarDays, Plus, Minus, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { useCEOStore } from '@/lib/store';

export default function WeeklyReview() {
  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  const { getWeeklyReview, addWeeklyReview, updateWeeklyReview, getRecentWeeklyReviews } =
    useCEOStore();

  const getWeekKey = (offset: number) => {
    const date = subWeeks(new Date(), -offset);
    const week = getWeek(date, { weekStartsOn: 1 });
    const year = getYear(date);
    return `${year}-W${week.toString().padStart(2, '0')}`;
  };

  const weekKey = getWeekKey(currentWeekOffset);
  const weekStart = startOfWeek(
    currentWeekOffset === 0
      ? new Date()
      : subWeeks(new Date(), -currentWeekOffset),
    { weekStartsOn: 1 }
  );
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });

  const [formData, setFormData] = useState({
    movedNeedle: ['', '', ''],
    wasNoise: ['', ''],
    timeLeaked: '',
    averageEnergy: 5,
    bestDay: '',
    bestDayWhy: '',
    worstDay: '',
    worstDayWhy: '',
    whoEnergized: '',
    whoDrained: '',
    shouldConnect: '',
    strategicInsight: '',
    adjustment: '',
    nextPriorities: ['', '', ''],
    gratitude: '',
    wins: [''],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const existing = getWeeklyReview(weekKey);
      if (existing) {
        setFormData({
          movedNeedle: existing.movedNeedle.length >= 3 ? existing.movedNeedle : [...existing.movedNeedle, '', ''].slice(0, 3),
          wasNoise: existing.wasNoise.length >= 2 ? existing.wasNoise : [...existing.wasNoise, ''].slice(0, 2),
          timeLeaked: existing.timeLeaked,
          averageEnergy: existing.averageEnergy,
          bestDay: existing.bestDay,
          bestDayWhy: existing.bestDayWhy,
          worstDay: existing.worstDay,
          worstDayWhy: existing.worstDayWhy,
          whoEnergized: existing.whoEnergized,
          whoDrained: existing.whoDrained,
          shouldConnect: existing.shouldConnect,
          strategicInsight: existing.strategicInsight,
          adjustment: existing.adjustment,
          nextPriorities: existing.nextPriorities.length >= 3 ? existing.nextPriorities : [...existing.nextPriorities, '', ''].slice(0, 3),
          gratitude: existing.gratitude,
          wins: existing.wins || [''],
        });
      } else {
        setFormData({
          movedNeedle: ['', '', ''],
          wasNoise: ['', ''],
          timeLeaked: '',
          averageEnergy: 5,
          bestDay: '',
          bestDayWhy: '',
          worstDay: '',
          worstDayWhy: '',
          whoEnergized: '',
          whoDrained: '',
          shouldConnect: '',
          strategicInsight: '',
          adjustment: '',
          nextPriorities: ['', '', ''],
          gratitude: '',
          wins: [''],
        });
      }
      setSaved(false);
    }
  }, [weekKey, mounted, getWeeklyReview]);

  const handleSave = () => {
    const existing = getWeeklyReview(weekKey);
    const reviewData = {
      ...formData,
      week: weekKey,
      startDate: format(weekStart, 'yyyy-MM-dd'),
      endDate: format(weekEnd, 'yyyy-MM-dd'),
      movedNeedle: formData.movedNeedle.filter(Boolean),
      wasNoise: formData.wasNoise.filter(Boolean),
      nextPriorities: formData.nextPriorities.filter(Boolean),
      wins: formData.wins?.filter(Boolean) || [],
    };

    if (existing) {
      updateWeeklyReview(existing.id, reviewData);
    } else {
      addWeeklyReview(reviewData);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateArrayItem = (
    field: 'movedNeedle' | 'wasNoise' | 'nextPriorities' | 'wins',
    index: number,
    value: string
  ) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: 'wins') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (field: 'wins', index: number) => {
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

  const existingReview = getWeeklyReview(weekKey);
  const isCurrentWeek = currentWeekOffset === 0;

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <CalendarDays className="h-8 w-8" />
            Weekly Review
          </h1>
          <p className="text-muted-foreground mt-1">15 minutes to perspective</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentWeekOffset(0)}
            disabled={isCurrentWeek}
          >
            This Week
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
            disabled={isCurrentWeek}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Week Display */}
      <div className="text-center py-4 border-b">
        <p className="text-2xl font-semibold">Week {weekKey.split('-W')[1]}, {weekKey.split('-')[0]}</p>
        <p className="text-muted-foreground">
          {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
        </p>
        {existingReview && (
          <p className="text-sm text-muted-foreground mt-1">
            Last updated: {format(parseISO(existingReview.updatedAt), 'MMM d, h:mm a')}
          </p>
        )}
      </div>

      {/* What Moved the Needle */}
      <Card>
        <CardHeader>
          <CardTitle>What Moved the Needle?</CardTitle>
          <CardDescription>
            What actually mattered this week? What created real progress?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {formData.movedNeedle.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {index + 1}
              </span>
              <Input
                placeholder={`Key accomplishment ${index + 1}...`}
                value={item}
                onChange={(e) => updateArrayItem('movedNeedle', index, e.target.value)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* What Was Noise */}
      <Card>
        <CardHeader>
          <CardTitle>What Was Noise?</CardTitle>
          <CardDescription>
            What felt urgent but wasn&apos;t important? Busy-work disguised as productivity?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {formData.wasNoise.map((item, index) => (
            <Input
              key={index}
              placeholder={`Noise item ${index + 1}...`}
              value={item}
              onChange={(e) => updateArrayItem('wasNoise', index, e.target.value)}
            />
          ))}
        </CardContent>
      </Card>

      {/* Time Leaked */}
      <Card>
        <CardHeader>
          <CardTitle>Where Did Time Leak?</CardTitle>
          <CardDescription>
            Where did hours disappear that you can&apos;t account for or justify?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Time leaked to..."
            value={formData.timeLeaked}
            onChange={(e) => setFormData({ ...formData, timeLeaked: e.target.value })}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Energy Check */}
      <Card>
        <CardHeader>
          <CardTitle>Energy Check</CardTitle>
          <CardDescription>Average energy this week: {formData.averageEnergy}/10</CardDescription>
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
              <Label>Best Day</Label>
              <Input
                placeholder="e.g., Tuesday"
                value={formData.bestDay}
                onChange={(e) => setFormData({ ...formData, bestDay: e.target.value })}
              />
              <Textarea
                placeholder="Why was it the best?"
                value={formData.bestDayWhy}
                onChange={(e) => setFormData({ ...formData, bestDayWhy: e.target.value })}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Worst Day</Label>
              <Input
                placeholder="e.g., Thursday"
                value={formData.worstDay}
                onChange={(e) => setFormData({ ...formData, worstDay: e.target.value })}
              />
              <Textarea
                placeholder="Why was it the worst?"
                value={formData.worstDayWhy}
                onChange={(e) => setFormData({ ...formData, worstDayWhy: e.target.value })}
                rows={2}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Relationship Pulse */}
      <Card>
        <CardHeader>
          <CardTitle>Relationship Pulse</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Who energized you this week?</Label>
            <Input
              placeholder="Name(s)..."
              value={formData.whoEnergized}
              onChange={(e) => setFormData({ ...formData, whoEnergized: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Who drained you?</Label>
            <Input
              placeholder="Name(s)..."
              value={formData.whoDrained}
              onChange={(e) => setFormData({ ...formData, whoDrained: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Who should you have connected with but didn&apos;t?</Label>
            <Input
              placeholder="Name(s)..."
              value={formData.shouldConnect}
              onChange={(e) => setFormData({ ...formData, shouldConnect: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Strategic Insight */}
      <Card>
        <CardHeader>
          <CardTitle>One Strategic Insight</CardTitle>
          <CardDescription>
            What did you learn or realize this week that changes how you think or act?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="This week I realized..."
            value={formData.strategicInsight}
            onChange={(e) => setFormData({ ...formData, strategicInsight: e.target.value })}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* One Adjustment */}
      <Card>
        <CardHeader>
          <CardTitle>One Adjustment</CardTitle>
          <CardDescription>
            Based on this week, what ONE thing will you do differently next week?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Next week I will..."
            value={formData.adjustment}
            onChange={(e) => setFormData({ ...formData, adjustment: e.target.value })}
            rows={2}
          />
        </CardContent>
      </Card>

      {/* Next Week's Priorities */}
      <Card>
        <CardHeader>
          <CardTitle>Next Week&apos;s Top 3 Priorities</CardTitle>
          <CardDescription>If the week goes well, these three things will be done</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
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
        </CardContent>
      </Card>

      {/* Gratitude */}
      <Card>
        <CardHeader>
          <CardTitle>Gratitude</CardTitle>
          <CardDescription>One thing you&apos;re grateful for from this week</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="I'm grateful for..."
            value={formData.gratitude}
            onChange={(e) => setFormData({ ...formData, gratitude: e.target.value })}
            rows={2}
          />
        </CardContent>
      </Card>

      {/* Wins Log */}
      <Card>
        <CardHeader>
          <CardTitle>Wins Log (Optional)</CardTitle>
          <CardDescription>Small wins worth remembering</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {formData.wins.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder="A win this week..."
                value={item}
                onChange={(e) => updateArrayItem('wins', index, e.target.value)}
              />
              {formData.wins.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeArrayItem('wins', index)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => addArrayItem('wins')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Win
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
