'use client';

import { useEffect, useState } from 'react';
import { format, subDays, parseISO } from 'date-fns';
import {
  Sun,
  ChevronLeft,
  ChevronRight,
  Check,
  Battery,
  Brain,
  Heart,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { useCEOStore } from '@/lib/store';

export default function DailyCheckIn() {
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [saved, setSaved] = useState(false);

  const { getDailyCheckIn, addDailyCheckIn, updateDailyCheckIn, getRecentDailyCheckIns } =
    useCEOStore();

  const [formData, setFormData] = useState({
    energyPhysical: 5,
    energyMental: 5,
    energyEmotional: 5,
    energyWord: '',
    meaningfulWin: '',
    frictionPoint: '',
    letGo: '',
    tomorrowPriority: '',
    notes: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const existing = getDailyCheckIn(selectedDate);
      if (existing) {
        setFormData({
          energyPhysical: existing.energyPhysical,
          energyMental: existing.energyMental,
          energyEmotional: existing.energyEmotional,
          energyWord: existing.energyWord,
          meaningfulWin: existing.meaningfulWin,
          frictionPoint: existing.frictionPoint,
          letGo: existing.letGo,
          tomorrowPriority: existing.tomorrowPriority,
          notes: existing.notes || '',
        });
      } else {
        setFormData({
          energyPhysical: 5,
          energyMental: 5,
          energyEmotional: 5,
          energyWord: '',
          meaningfulWin: '',
          frictionPoint: '',
          letGo: '',
          tomorrowPriority: '',
          notes: '',
        });
      }
      setSaved(false);
    }
  }, [selectedDate, mounted, getDailyCheckIn]);

  const handleSave = () => {
    const existing = getDailyCheckIn(selectedDate);
    if (existing) {
      updateDailyCheckIn(existing.id, { ...formData, date: selectedDate });
    } else {
      addDailyCheckIn({ ...formData, date: selectedDate });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const goToPreviousDay = () => {
    setSelectedDate(format(subDays(parseISO(selectedDate), 1), 'yyyy-MM-dd'));
  };

  const goToNextDay = () => {
    const nextDate = format(
      new Date(parseISO(selectedDate).getTime() + 86400000),
      'yyyy-MM-dd'
    );
    if (nextDate <= format(new Date(), 'yyyy-MM-dd')) {
      setSelectedDate(nextDate);
    }
  };

  const goToToday = () => {
    setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const isToday = selectedDate === format(new Date(), 'yyyy-MM-dd');
  const existingCheckIn = getDailyCheckIn(selectedDate);
  const avgEnergy = Math.round(
    (formData.energyPhysical + formData.energyMental + formData.energyEmotional) / 3
  );

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Sun className="h-8 w-8" />
            Daily Check-in
          </h1>
          <p className="text-muted-foreground mt-1">5 minutes to clarity</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPreviousDay}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={goToToday} disabled={isToday}>
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNextDay}
            disabled={isToday}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Date Display */}
      <div className="text-center py-4 border-b">
        <p className="text-2xl font-semibold">
          {format(parseISO(selectedDate), 'EEEE, MMMM d, yyyy')}
        </p>
        {existingCheckIn && (
          <p className="text-sm text-muted-foreground mt-1">
            Last updated: {format(parseISO(existingCheckIn.updatedAt), 'h:mm a')}
          </p>
        )}
      </div>

      {/* Energy Section */}
      <Card>
        <CardHeader>
          <CardTitle>Energy Level</CardTitle>
          <CardDescription>
            How do you feel today? Average: {avgEnergy}/10
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Battery className="h-4 w-4" />
                  Physical
                </Label>
                <span className="text-sm font-medium">{formData.energyPhysical}/10</span>
              </div>
              <Slider
                value={[formData.energyPhysical]}
                onValueChange={([v]) => setFormData({ ...formData, energyPhysical: v })}
                max={10}
                min={1}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Mental
                </Label>
                <span className="text-sm font-medium">{formData.energyMental}/10</span>
              </div>
              <Slider
                value={[formData.energyMental]}
                onValueChange={([v]) => setFormData({ ...formData, energyMental: v })}
                max={10}
                min={1}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Emotional
                </Label>
                <span className="text-sm font-medium">{formData.energyEmotional}/10</span>
              </div>
              <Slider
                value={[formData.energyEmotional]}
                onValueChange={([v]) => setFormData({ ...formData, energyEmotional: v })}
                max={10}
                min={1}
                step={1}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="energyWord">One word for today&apos;s energy</Label>
            <Input
              id="energyWord"
              placeholder="e.g., focused, scattered, hopeful, tired..."
              value={formData.energyWord}
              onChange={(e) => setFormData({ ...formData, energyWord: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Meaningful Win */}
      <Card>
        <CardHeader>
          <CardTitle>One Meaningful Win</CardTitle>
          <CardDescription>
            What&apos;s one thing you accomplished or experienced today that actually mattered?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Today I..."
            value={formData.meaningfulWin}
            onChange={(e) => setFormData({ ...formData, meaningfulWin: e.target.value })}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Friction Point */}
      <Card>
        <CardHeader>
          <CardTitle>One Friction Point</CardTitle>
          <CardDescription>
            What created friction, frustration, or resistance today?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="The hardest part was..."
            value={formData.frictionPoint}
            onChange={(e) => setFormData({ ...formData, frictionPoint: e.target.value })}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Let Go */}
      <Card>
        <CardHeader>
          <CardTitle>One Thing to Let Go</CardTitle>
          <CardDescription>
            What thought, worry, task, or emotion can you release? What doesn&apos;t deserve more
            mental space?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="I'm releasing..."
            value={formData.letGo}
            onChange={(e) => setFormData({ ...formData, letGo: e.target.value })}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Tomorrow's Priority */}
      <Card>
        <CardHeader>
          <CardTitle>Tomorrow&apos;s Priority</CardTitle>
          <CardDescription>
            If you could only accomplish ONE thing tomorrow, what would make the day a success?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Tomorrow I will..."
            value={formData.tomorrowPriority}
            onChange={(e) => setFormData({ ...formData, tomorrowPriority: e.target.value })}
            rows={2}
          />
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notes (Optional)</CardTitle>
          <CardDescription>Anything else worth capturing</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Additional thoughts..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
          />
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
          ) : existingCheckIn ? (
            'Update'
          ) : (
            'Save Check-in'
          )}
        </Button>
      </div>

      {/* Recent Check-ins Preview */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Recent Check-ins</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {getRecentDailyCheckIns(5).map((checkIn) => (
              <button
                key={checkIn.id}
                onClick={() => setSelectedDate(checkIn.date)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  checkIn.date === selectedDate
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {format(parseISO(checkIn.date), 'EEE, MMM d')}
                  </span>
                  <span className="text-sm opacity-75">
                    Energy: {Math.round(
                      (checkIn.energyPhysical + checkIn.energyMental + checkIn.energyEmotional) / 3
                    )}
                    /10
                  </span>
                </div>
                {checkIn.energyWord && (
                  <p className="text-sm opacity-75 mt-1">{checkIn.energyWord}</p>
                )}
              </button>
            ))}
            {getRecentDailyCheckIns(5).length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-4">
                No check-ins yet. Start building your streak!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
