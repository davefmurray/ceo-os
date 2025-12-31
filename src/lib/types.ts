// CEO OS Types

export interface DailyCheckIn {
  id: string;
  date: string; // YYYY-MM-DD
  energyPhysical: number;
  energyMental: number;
  energyEmotional: number;
  energyWord: string;
  meaningfulWin: string;
  frictionPoint: string;
  letGo: string;
  tomorrowPriority: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyReview {
  id: string;
  week: string; // YYYY-WXX
  startDate: string;
  endDate: string;
  movedNeedle: string[];
  wasNoise: string[];
  timeLeaked: string;
  averageEnergy: number;
  bestDay: string;
  bestDayWhy: string;
  worstDay: string;
  worstDayWhy: string;
  whoEnergized: string;
  whoDrained: string;
  shouldConnect: string;
  strategicInsight: string;
  adjustment: string;
  nextPriorities: string[];
  gratitude: string;
  wins?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface QuarterlyReview {
  id: string;
  quarter: string; // YYYY-QX
  startDate: string;
  endDate: string;
  goalProgress: GoalProgress[];
  lifeMapScores: LifeMapScores;
  averageEnergy: number;
  bestMonth: string;
  bestMonthWhy: string;
  worstMonth: string;
  worstMonthWhy: string;
  energizers: string[];
  drainers: string[];
  sustainablePace: string;
  workingOnWhatMatters: string;
  timeGap: string;
  saidYesShouldntHave: string;
  missedOpportunity: string;
  keyWins: string[];
  unexpectedWin: string;
  keyChallenges: string[];
  persistentProblem: string;
  avoidingDecision: string;
  lessonLearned: string;
  newKnowledge: string;
  clearerPattern: string;
  startDoing: string[];
  stopDoing: string[];
  continueDoing: string[];
  nextQuarterTheme: string;
  nextPriorities: string[];
  whatWillBeTrue: string;
  oneThingEasier: string;
  directionStillAccurate: string;
  needsToChange: string;
  memoryInsights: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GoalProgress {
  goal: string;
  status: 'on-track' | 'behind' | 'ahead' | 'abandoned';
  progress: number;
  notes: string;
}

export interface LifeMapScores {
  career: number;
  careerTrend: 'up' | 'down' | 'stable';
  careerNote: string;
  relationships: number;
  relationshipsTrend: 'up' | 'down' | 'stable';
  relationshipsNote: string;
  health: number;
  healthTrend: 'up' | 'down' | 'stable';
  healthNote: string;
  finances: number;
  financesTrend: 'up' | 'down' | 'stable';
  financesNote: string;
  meaning: number;
  meaningTrend: 'up' | 'down' | 'stable';
  meaningNote: string;
  fun: number;
  funTrend: 'up' | 'down' | 'stable';
  funNote: string;
}

export interface Goals {
  oneYear: YearGoals;
  threeYear: VisionGoals;
  tenYear: VisionGoals;
}

export interface YearGoals {
  year: number;
  theme: string;
  ifGoesWell: string;
  career: GoalArea;
  relationships: GoalArea;
  health: GoalArea;
  finances: GoalArea;
  meaning: GoalArea;
  fun: GoalArea;
  criticalThree: string[];
  antiGoals: string[];
  habitsToBuild: Habit[];
  habitsToBreak: HabitToBreak[];
  updatedAt: string;
}

export interface GoalArea {
  primaryGoal: string;
  whyMatters: string;
  q1Milestone: string;
  q2Milestone: string;
  q3Milestone: string;
  q4Milestone: string;
  successCriteria: string;
  commitment: number;
}

export interface VisionGoals {
  periodStart: number;
  periodEnd: number;
  snapshot: string;
  whereLive: string;
  whatDo: string;
  keyPeople: string;
  typicalWeek: string;
  whatsDifferent: string;
  career: string;
  relationships: string;
  health: string;
  finances: string;
  meaning: string;
  fun: string;
  bigBets: string[];
  needsToEnd: string[];
  needsToBegin: string[];
  updatedAt: string;
}

export interface Habit {
  habit: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  whyMatters: string;
}

export interface HabitToBreak {
  habit: string;
  replacement: string;
  strategy: string;
}

export interface NorthStar {
  oneSentence: string;
  stageOfLife: string;
  primaryRole: string;
  company: string;
  yearsInChapter: number;
  whatDefinesChapter: string;
  areaRankings: AreaRanking[];
  nonNegotiables: string[];
  sayingNoTo: string[];
  centralQuestion: string;
  notes: string;
  updatedAt: string;
}

export interface AreaRanking {
  area: 'career' | 'relationships' | 'health' | 'finances' | 'meaning' | 'fun';
  rank: number;
  why: string;
}

export interface Memory {
  executiveSummary: string;
  strengths: string[];
  growthEdges: string[];
  energizedBy: string[];
  drainedBy: string[];
  optimalConditions: string;
  overIndexes: string;
  underWeights: string;
  blindSpots: string[];
  goalArchaeology: GoalArchaeologyItem[];
  insightsByYear: YearInsight[];
  lessonsWork: string[];
  lessonsRelationships: string[];
  lessonsSelf: string[];
  lessonsLife: string[];
  quotesFromPastSelf: Quote[];
  warningsToFutureSelf: string[];
  rawNotes: string;
  updatedAt: string;
}

export interface GoalArchaeologyItem {
  goal: string;
  firstAppeared: string;
  timesRepeated: number;
  status: 'achieved' | 'in-progress' | 'abandoned' | 'recurring';
  notes: string;
}

export interface YearInsight {
  year: number;
  insights: string[];
}

export interface Quote {
  quote: string;
  source: string;
  date: string;
}

export interface InterviewResponse {
  id: string;
  interviewType: 'past-year' | 'identity-values' | 'future-self';
  responses: Record<string, string>;
  completedAt: string;
  createdAt: string;
}

// Framework content (static, but stored for reference)
export interface Framework {
  id: string;
  name: string;
  description: string;
  credit: string;
  sections: FrameworkSection[];
}

export interface FrameworkSection {
  title: string;
  content: string;
  prompts?: string[];
}
