'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  Sun,
  CalendarDays,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useCEOStore } from '@/lib/store';

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const {
    getRecentDailyCheckIns,
    getRecentWeeklyReviews,
    getStreak,
    getAverageEnergy,
    currentLifeMap,
    northStar,
    goals,
  } = useCEOStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const recentCheckIns = getRecentDailyCheckIns(7);
  const recentWeeklyReviews = getRecentWeeklyReviews(4);
  const streak = getStreak();
  const avgEnergy = getAverageEnergy(7);
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayCheckIn = recentCheckIns.find((c) => c.date === today);

  const lifeMapAreas = [
    { name: 'Career', score: currentLifeMap.career, trend: currentLifeMap.careerTrend },
    { name: 'Relationships', score: currentLifeMap.relationships, trend: currentLifeMap.relationshipsTrend },
    { name: 'Health', score: currentLifeMap.health, trend: currentLifeMap.healthTrend },
    { name: 'Finances', score: currentLifeMap.finances, trend: currentLifeMap.financesTrend },
    { name: 'Meaning', score: currentLifeMap.meaning, trend: currentLifeMap.meaningTrend },
    { name: 'Fun', score: currentLifeMap.fun, trend: currentLifeMap.funTrend },
  ];

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Good {getGreeting()}</h1>
        <p className="text-muted-foreground">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/daily">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Daily Check-in</CardTitle>
              <Sun className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {todayCheckIn ? 'Complete' : 'Not done'}
              </div>
              <p className="text-xs text-muted-foreground">
                {todayCheckIn ? 'View or edit today\'s entry' : '5 minutes to clarity'}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streak} days</div>
            <p className="text-xs text-muted-foreground">
              Consistency compounds
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Energy (7d)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgEnergy || '—'}/10</div>
            <p className="text-xs text-muted-foreground">
              Your energy is data
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* North Star */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              North Star
            </CardTitle>
            <CardDescription>Your current direction</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {northStar.oneSentence ? (
              <blockquote className="border-l-4 border-primary pl-4 italic">
                &ldquo;{northStar.oneSentence}&rdquo;
              </blockquote>
            ) : (
              <p className="text-muted-foreground">
                No north star defined yet.
              </p>
            )}
            {northStar.centralQuestion && (
              <p className="text-sm text-muted-foreground">
                <strong>Question you&apos;re living:</strong> {northStar.centralQuestion}
              </p>
            )}
            <Link href="/north-star">
              <Button variant="outline" size="sm" className="mt-2">
                {northStar.oneSentence ? 'Edit' : 'Define your direction'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Life Map Snapshot */}
        <Card>
          <CardHeader>
            <CardTitle>Life Map</CardTitle>
            <CardDescription>Current state across all areas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {lifeMapAreas.map((area) => (
              <div key={area.name} className="flex items-center gap-3">
                <span className="w-24 text-sm">{area.name}</span>
                <Progress value={area.score * 10} className="flex-1" />
                <span className="w-8 text-sm text-right">{area.score}</span>
                <TrendIcon trend={area.trend} />
              </div>
            ))}
            <Link href="/life-map">
              <Button variant="outline" size="sm" className="mt-2 w-full">
                Update Life Map
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* This Year's Focus */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              {new Date().getFullYear()} Focus
            </CardTitle>
            <CardDescription>
              {goals.oneYear.theme || 'Define your yearly theme'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {goals.oneYear.criticalThree.filter(Boolean).length > 0 ? (
              <ul className="space-y-2">
                {goals.oneYear.criticalThree.filter(Boolean).map((goal, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {i + 1}
                    </span>
                    <span className="text-sm">{goal}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">
                No critical priorities set for this year.
              </p>
            )}
            <Link href="/goals">
              <Button variant="outline" size="sm" className="mt-2 w-full">
                View All Goals
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest check-ins and reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCheckIns.length === 0 && recentWeeklyReviews.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No activity yet. Start with a daily check-in.
                </p>
              ) : (
                <>
                  {recentCheckIns.slice(0, 3).map((checkIn) => (
                    <div
                      key={checkIn.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4 text-muted-foreground" />
                        <span>{format(new Date(checkIn.date), 'MMM d')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          Energy: {Math.round((checkIn.energyPhysical + checkIn.energyMental + checkIn.energyEmotional) / 3)}
                        </span>
                      </div>
                    </div>
                  ))}
                  {recentWeeklyReviews.slice(0, 2).map((review) => (
                    <div
                      key={review.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        <span>Week {review.week.split('-W')[1]}</span>
                      </div>
                      <div className="text-muted-foreground">
                        Energy: {review.averageEnergy}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prompts */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Daily Reflection</h3>
              <p className="text-muted-foreground text-sm">
                {getReflectionPrompt()}
              </p>
            </div>
            <Link href="/daily">
              <Button>
                {todayCheckIn ? 'Review' : 'Check In'}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

function getReflectionPrompt() {
  const prompts = [
    "What's the one thing that would make today a success?",
    "What decision have you been avoiding?",
    "Who deserves your attention today?",
    "What would future you thank you for doing today?",
    "Where is your energy best spent right now?",
    "What can you let go of today?",
    "What's the simplest path forward?",
  ];
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return prompts[dayOfYear % prompts.length];
}
