'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  DailyCheckIn,
  WeeklyReview,
  QuarterlyReview,
  Goals,
  YearGoals,
  VisionGoals,
  NorthStar,
  Memory,
  InterviewResponse,
  GoalArea,
  LifeMapScores,
} from './types';

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Default empty goal area
const emptyGoalArea: GoalArea = {
  primaryGoal: '',
  whyMatters: '',
  q1Milestone: '',
  q2Milestone: '',
  q3Milestone: '',
  q4Milestone: '',
  successCriteria: '',
  commitment: 5,
};

// Default year goals
const defaultYearGoals: YearGoals = {
  year: new Date().getFullYear(),
  theme: '',
  ifGoesWell: '',
  career: { ...emptyGoalArea },
  relationships: { ...emptyGoalArea },
  health: { ...emptyGoalArea },
  finances: { ...emptyGoalArea },
  meaning: { ...emptyGoalArea },
  fun: { ...emptyGoalArea },
  criticalThree: ['', '', ''],
  antiGoals: [],
  habitsToBuild: [],
  habitsToBreak: [],
  updatedAt: new Date().toISOString(),
};

// Default vision goals
const defaultVisionGoals = (yearsOut: number): VisionGoals => ({
  periodStart: new Date().getFullYear(),
  periodEnd: new Date().getFullYear() + yearsOut,
  snapshot: '',
  whereLive: '',
  whatDo: '',
  keyPeople: '',
  typicalWeek: '',
  whatsDifferent: '',
  career: '',
  relationships: '',
  health: '',
  finances: '',
  meaning: '',
  fun: '',
  bigBets: [],
  needsToEnd: [],
  needsToBegin: [],
  updatedAt: new Date().toISOString(),
});

// Default North Star
const defaultNorthStar: NorthStar = {
  oneSentence: '',
  stageOfLife: '',
  primaryRole: '',
  company: '',
  yearsInChapter: 0,
  whatDefinesChapter: '',
  areaRankings: [
    { area: 'career', rank: 0, why: '' },
    { area: 'relationships', rank: 0, why: '' },
    { area: 'health', rank: 0, why: '' },
    { area: 'finances', rank: 0, why: '' },
    { area: 'meaning', rank: 0, why: '' },
    { area: 'fun', rank: 0, why: '' },
  ],
  nonNegotiables: [],
  sayingNoTo: [],
  centralQuestion: '',
  notes: '',
  updatedAt: new Date().toISOString(),
};

// Default Memory
const defaultMemory: Memory = {
  executiveSummary: '',
  strengths: [],
  growthEdges: [],
  energizedBy: [],
  drainedBy: [],
  optimalConditions: '',
  overIndexes: '',
  underWeights: '',
  blindSpots: [],
  goalArchaeology: [],
  insightsByYear: [],
  lessonsWork: [],
  lessonsRelationships: [],
  lessonsSelf: [],
  lessonsLife: [],
  quotesFromPastSelf: [],
  warningsToFutureSelf: [],
  rawNotes: '',
  updatedAt: new Date().toISOString(),
};

// Default life map scores
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

interface CEOStore {
  // Daily Check-ins
  dailyCheckIns: DailyCheckIn[];
  addDailyCheckIn: (checkIn: Omit<DailyCheckIn, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDailyCheckIn: (id: string, checkIn: Partial<DailyCheckIn>) => void;
  getDailyCheckIn: (date: string) => DailyCheckIn | undefined;
  getRecentDailyCheckIns: (count: number) => DailyCheckIn[];

  // Weekly Reviews
  weeklyReviews: WeeklyReview[];
  addWeeklyReview: (review: Omit<WeeklyReview, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateWeeklyReview: (id: string, review: Partial<WeeklyReview>) => void;
  getWeeklyReview: (week: string) => WeeklyReview | undefined;
  getRecentWeeklyReviews: (count: number) => WeeklyReview[];

  // Quarterly Reviews
  quarterlyReviews: QuarterlyReview[];
  addQuarterlyReview: (review: Omit<QuarterlyReview, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateQuarterlyReview: (id: string, review: Partial<QuarterlyReview>) => void;
  getQuarterlyReview: (quarter: string) => QuarterlyReview | undefined;

  // Goals
  goals: Goals;
  updateOneYearGoals: (goals: Partial<YearGoals>) => void;
  updateThreeYearGoals: (goals: Partial<VisionGoals>) => void;
  updateTenYearGoals: (goals: Partial<VisionGoals>) => void;

  // North Star
  northStar: NorthStar;
  updateNorthStar: (northStar: Partial<NorthStar>) => void;

  // Memory
  memory: Memory;
  updateMemory: (memory: Partial<Memory>) => void;

  // Interviews
  interviewResponses: InterviewResponse[];
  saveInterviewResponse: (response: Omit<InterviewResponse, 'id' | 'createdAt'>) => void;
  getInterviewResponses: (type: InterviewResponse['interviewType']) => InterviewResponse[];

  // Current Life Map (quick access)
  currentLifeMap: LifeMapScores;
  updateCurrentLifeMap: (scores: Partial<LifeMapScores>) => void;

  // Stats and computed values
  getStreak: () => number;
  getAverageEnergy: (days: number) => number;
}

export const useCEOStore = create<CEOStore>()(
  persist(
    (set, get) => ({
      // Daily Check-ins
      dailyCheckIns: [],
      addDailyCheckIn: (checkIn) => {
        const now = new Date().toISOString();
        const newCheckIn: DailyCheckIn = {
          ...checkIn,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          dailyCheckIns: [newCheckIn, ...state.dailyCheckIns],
        }));
      },
      updateDailyCheckIn: (id, checkIn) => {
        set((state) => ({
          dailyCheckIns: state.dailyCheckIns.map((c) =>
            c.id === id ? { ...c, ...checkIn, updatedAt: new Date().toISOString() } : c
          ),
        }));
      },
      getDailyCheckIn: (date) => get().dailyCheckIns.find((c) => c.date === date),
      getRecentDailyCheckIns: (count) => get().dailyCheckIns.slice(0, count),

      // Weekly Reviews
      weeklyReviews: [],
      addWeeklyReview: (review) => {
        const now = new Date().toISOString();
        const newReview: WeeklyReview = {
          ...review,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          weeklyReviews: [newReview, ...state.weeklyReviews],
        }));
      },
      updateWeeklyReview: (id, review) => {
        set((state) => ({
          weeklyReviews: state.weeklyReviews.map((r) =>
            r.id === id ? { ...r, ...review, updatedAt: new Date().toISOString() } : r
          ),
        }));
      },
      getWeeklyReview: (week) => get().weeklyReviews.find((r) => r.week === week),
      getRecentWeeklyReviews: (count) => get().weeklyReviews.slice(0, count),

      // Quarterly Reviews
      quarterlyReviews: [],
      addQuarterlyReview: (review) => {
        const now = new Date().toISOString();
        const newReview: QuarterlyReview = {
          ...review,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          quarterlyReviews: [newReview, ...state.quarterlyReviews],
        }));
      },
      updateQuarterlyReview: (id, review) => {
        set((state) => ({
          quarterlyReviews: state.quarterlyReviews.map((r) =>
            r.id === id ? { ...r, ...review, updatedAt: new Date().toISOString() } : r
          ),
        }));
      },
      getQuarterlyReview: (quarter) => get().quarterlyReviews.find((r) => r.quarter === quarter),

      // Goals
      goals: {
        oneYear: defaultYearGoals,
        threeYear: defaultVisionGoals(3),
        tenYear: defaultVisionGoals(10),
      },
      updateOneYearGoals: (goals) => {
        set((state) => ({
          goals: {
            ...state.goals,
            oneYear: { ...state.goals.oneYear, ...goals, updatedAt: new Date().toISOString() },
          },
        }));
      },
      updateThreeYearGoals: (goals) => {
        set((state) => ({
          goals: {
            ...state.goals,
            threeYear: { ...state.goals.threeYear, ...goals, updatedAt: new Date().toISOString() },
          },
        }));
      },
      updateTenYearGoals: (goals) => {
        set((state) => ({
          goals: {
            ...state.goals,
            tenYear: { ...state.goals.tenYear, ...goals, updatedAt: new Date().toISOString() },
          },
        }));
      },

      // North Star
      northStar: defaultNorthStar,
      updateNorthStar: (northStar) => {
        set((state) => ({
          northStar: { ...state.northStar, ...northStar, updatedAt: new Date().toISOString() },
        }));
      },

      // Memory
      memory: defaultMemory,
      updateMemory: (memory) => {
        set((state) => ({
          memory: { ...state.memory, ...memory, updatedAt: new Date().toISOString() },
        }));
      },

      // Interviews
      interviewResponses: [],
      saveInterviewResponse: (response) => {
        const newResponse: InterviewResponse = {
          ...response,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          interviewResponses: [newResponse, ...state.interviewResponses],
        }));
      },
      getInterviewResponses: (type) =>
        get().interviewResponses.filter((r) => r.interviewType === type),

      // Current Life Map
      currentLifeMap: defaultLifeMapScores,
      updateCurrentLifeMap: (scores) => {
        set((state) => ({
          currentLifeMap: { ...state.currentLifeMap, ...scores },
        }));
      },

      // Stats
      getStreak: () => {
        const checkIns = get().dailyCheckIns;
        if (checkIns.length === 0) return 0;

        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 365; i++) {
          const checkDate = new Date(today);
          checkDate.setDate(checkDate.getDate() - i);
          const dateStr = checkDate.toISOString().split('T')[0];

          if (checkIns.some((c) => c.date === dateStr)) {
            streak++;
          } else if (i > 0) {
            break;
          }
        }

        return streak;
      },

      getAverageEnergy: (days) => {
        const checkIns = get().getRecentDailyCheckIns(days);
        if (checkIns.length === 0) return 0;

        const total = checkIns.reduce((sum, c) => {
          return sum + (c.energyPhysical + c.energyMental + c.energyEmotional) / 3;
        }, 0);

        return Math.round((total / checkIns.length) * 10) / 10;
      },
    }),
    {
      name: 'ceo-os-storage',
    }
  )
);
