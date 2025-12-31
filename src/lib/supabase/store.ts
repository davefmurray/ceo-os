'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from './client';
import type { Database } from './types';
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
  LifeMapScores,
  GoalArea,
  AreaRanking,
} from '../types';
import type { User } from '@supabase/supabase-js';

// Type aliases for database rows
type DbDailyCheckIn = Database['public']['Tables']['daily_check_ins']['Row'];
type DbWeeklyReview = Database['public']['Tables']['weekly_reviews']['Row'];
type DbQuarterlyReview = Database['public']['Tables']['quarterly_reviews']['Row'];
type DbAnnualReview = Database['public']['Tables']['annual_reviews']['Row'];
type DbGoal = Database['public']['Tables']['goals']['Row'];
type DbNorthStar = Database['public']['Tables']['north_star']['Row'];
type DbLifeMap = Database['public']['Tables']['life_map']['Row'];
type DbMemory = Database['public']['Tables']['memory']['Row'];
type DbInterviewResponse = Database['public']['Tables']['interview_responses']['Row'];

// ============================================================================
// Transformation helpers: Database <-> App types
// ============================================================================

function dbToAppDailyCheckIn(db: DbDailyCheckIn): DailyCheckIn {
  return {
    id: db.id,
    date: db.date,
    energyPhysical: db.energy_physical ?? 5,
    energyMental: db.energy_mental ?? 5,
    energyEmotional: db.energy_emotional ?? 5,
    energyWord: db.energy_word ?? '',
    meaningfulWin: db.meaningful_win ?? '',
    frictionPoint: db.friction_point ?? '',
    letGo: db.let_go ?? '',
    tomorrowPriority: db.tomorrow_priority ?? '',
    notes: db.notes ?? undefined,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

function appToDbDailyCheckIn(
  app: Omit<DailyCheckIn, 'id' | 'createdAt' | 'updatedAt'>,
  userId: string
): Database['public']['Tables']['daily_check_ins']['Insert'] {
  return {
    user_id: userId,
    date: app.date,
    energy_physical: app.energyPhysical,
    energy_mental: app.energyMental,
    energy_emotional: app.energyEmotional,
    energy_word: app.energyWord,
    meaningful_win: app.meaningfulWin,
    friction_point: app.frictionPoint,
    let_go: app.letGo,
    tomorrow_priority: app.tomorrowPriority,
    notes: app.notes ?? null,
  };
}

function dbToAppWeeklyReview(db: DbWeeklyReview): WeeklyReview {
  return {
    id: db.id,
    week: db.week,
    startDate: db.start_date,
    endDate: db.end_date,
    movedNeedle: db.moved_needle ?? [],
    wasNoise: db.was_noise ?? [],
    timeLeaked: db.time_leaked ?? '',
    averageEnergy: db.average_energy ?? 5,
    bestDay: db.best_day ?? '',
    bestDayWhy: db.best_day_why ?? '',
    worstDay: db.worst_day ?? '',
    worstDayWhy: db.worst_day_why ?? '',
    whoEnergized: db.who_energized ?? '',
    whoDrained: db.who_drained ?? '',
    shouldConnect: db.should_connect ?? '',
    strategicInsight: db.strategic_insight ?? '',
    adjustment: db.adjustment ?? '',
    nextPriorities: db.next_priorities ?? [],
    gratitude: db.gratitude ?? '',
    wins: db.wins ?? [],
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

function appToDbWeeklyReview(
  app: Omit<WeeklyReview, 'id' | 'createdAt' | 'updatedAt'>,
  userId: string
): Database['public']['Tables']['weekly_reviews']['Insert'] {
  return {
    user_id: userId,
    week: app.week,
    start_date: app.startDate,
    end_date: app.endDate,
    moved_needle: app.movedNeedle,
    was_noise: app.wasNoise,
    time_leaked: app.timeLeaked,
    average_energy: app.averageEnergy,
    best_day: app.bestDay,
    best_day_why: app.bestDayWhy,
    worst_day: app.worstDay,
    worst_day_why: app.worstDayWhy,
    who_energized: app.whoEnergized,
    who_drained: app.whoDrained,
    should_connect: app.shouldConnect,
    strategic_insight: app.strategicInsight,
    adjustment: app.adjustment,
    next_priorities: app.nextPriorities,
    gratitude: app.gratitude,
    wins: app.wins,
  };
}

function dbToAppQuarterlyReview(db: DbQuarterlyReview): QuarterlyReview {
  return {
    id: db.id,
    quarter: db.quarter,
    startDate: db.start_date,
    endDate: db.end_date,
    goalProgress: (db.goal_progress as unknown as QuarterlyReview['goalProgress']) ?? [],
    lifeMapScores: (db.life_map_scores as unknown as LifeMapScores) ?? defaultLifeMapScores(),
    averageEnergy: db.average_energy ?? 5,
    bestMonth: db.best_month ?? '',
    bestMonthWhy: db.best_month_why ?? '',
    worstMonth: db.worst_month ?? '',
    worstMonthWhy: db.worst_month_why ?? '',
    energizers: db.energizers ?? [],
    drainers: db.drainers ?? [],
    sustainablePace: db.sustainable_pace ?? '',
    workingOnWhatMatters: db.working_on_what_matters ?? '',
    timeGap: db.time_gap ?? '',
    saidYesShouldntHave: db.said_yes_shouldnt_have ?? '',
    missedOpportunity: db.missed_opportunity ?? '',
    keyWins: db.key_wins ?? [],
    unexpectedWin: db.unexpected_win ?? '',
    keyChallenges: db.key_challenges ?? [],
    persistentProblem: db.persistent_problem ?? '',
    avoidingDecision: db.avoiding_decision ?? '',
    lessonLearned: db.lesson_learned ?? '',
    newKnowledge: db.new_knowledge ?? '',
    clearerPattern: db.clearer_pattern ?? '',
    startDoing: db.start_doing ?? [],
    stopDoing: db.stop_doing ?? [],
    continueDoing: db.continue_doing ?? [],
    nextQuarterTheme: db.next_quarter_theme ?? '',
    nextPriorities: db.next_priorities ?? [],
    whatWillBeTrue: db.what_will_be_true ?? '',
    oneThingEasier: db.one_thing_easier ?? '',
    directionStillAccurate: db.direction_still_accurate ?? '',
    needsToChange: db.needs_to_change ?? '',
    memoryInsights: db.memory_insights ?? [],
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

function appToDbQuarterlyReview(
  app: Omit<QuarterlyReview, 'id' | 'createdAt' | 'updatedAt'>,
  userId: string
): Database['public']['Tables']['quarterly_reviews']['Insert'] {
  return {
    user_id: userId,
    quarter: app.quarter,
    start_date: app.startDate,
    end_date: app.endDate,
    goal_progress: app.goalProgress as unknown as Database['public']['Tables']['quarterly_reviews']['Insert']['goal_progress'],
    life_map_scores: app.lifeMapScores as unknown as Database['public']['Tables']['quarterly_reviews']['Insert']['life_map_scores'],
    average_energy: app.averageEnergy,
    best_month: app.bestMonth,
    best_month_why: app.bestMonthWhy,
    worst_month: app.worstMonth,
    worst_month_why: app.worstMonthWhy,
    energizers: app.energizers,
    drainers: app.drainers,
    sustainable_pace: app.sustainablePace,
    working_on_what_matters: app.workingOnWhatMatters,
    time_gap: app.timeGap,
    said_yes_shouldnt_have: app.saidYesShouldntHave,
    missed_opportunity: app.missedOpportunity,
    key_wins: app.keyWins,
    unexpected_win: app.unexpectedWin,
    key_challenges: app.keyChallenges,
    persistent_problem: app.persistentProblem,
    avoiding_decision: app.avoidingDecision,
    lesson_learned: app.lessonLearned,
    new_knowledge: app.newKnowledge,
    clearer_pattern: app.clearerPattern,
    start_doing: app.startDoing,
    stop_doing: app.stopDoing,
    continue_doing: app.continueDoing,
    next_quarter_theme: app.nextQuarterTheme,
    next_priorities: app.nextPriorities,
    what_will_be_true: app.whatWillBeTrue,
    one_thing_easier: app.oneThingEasier,
    direction_still_accurate: app.directionStillAccurate,
    needs_to_change: app.needsToChange,
    memory_insights: app.memoryInsights,
  };
}

// Annual Review types (for the hook)
interface AnnualReview {
  id: string;
  year: number;
  startDate: string;
  endDate: string;
  oneSentenceSummary: string;
  yearTheme: string;
  goalsAchieved: unknown;
  lifeMapScores: LifeMapScores;
  topWins: string[];
  proudestMoment: string;
  biggestSurprise: string;
  biggestChallenges: string[];
  whatDidntWork: string;
  whatWouldDoDifferently: string;
  skillsGained: string[];
  lessonsLearned: string[];
  mostImportantLesson: string;
  keyRelationships: string;
  relationshipChanges: string;
  averageEnergy: number;
  healthSummary: string;
  nextYearIntention: string;
  nextYearWord: string;
  gratitude: string;
  quotesToRemember: unknown;
  createdAt: string;
  updatedAt: string;
}

function dbToAppAnnualReview(db: DbAnnualReview): AnnualReview {
  return {
    id: db.id,
    year: db.year,
    startDate: db.start_date,
    endDate: db.end_date,
    oneSentenceSummary: db.one_sentence_summary ?? '',
    yearTheme: db.year_theme ?? '',
    goalsAchieved: (db.goals_achieved as unknown as AnnualReview['goalsAchieved']) ?? [],
    lifeMapScores: (db.life_map_scores as unknown as LifeMapScores) ?? defaultLifeMapScores(),
    topWins: (db.top_wins as unknown as string[]) ?? [],
    proudestMoment: db.proudest_moment ?? '',
    biggestSurprise: db.biggest_surprise ?? '',
    biggestChallenges: (db.biggest_challenges as unknown as string[]) ?? [],
    whatDidntWork: db.what_didnt_work ?? '',
    whatWouldDoDifferently: db.what_would_do_differently ?? '',
    skillsGained: (db.skills_gained as unknown as string[]) ?? [],
    lessonsLearned: (db.lessons_learned as unknown as string[]) ?? [],
    mostImportantLesson: db.most_important_lesson ?? '',
    keyRelationships: db.key_relationships ?? '',
    relationshipChanges: db.relationship_changes ?? '',
    averageEnergy: db.average_energy ?? 5,
    healthSummary: db.health_summary ?? '',
    nextYearIntention: db.next_year_intention ?? '',
    nextYearWord: db.next_year_word ?? '',
    gratitude: db.gratitude ?? '',
    quotesToRemember: (db.quotes_to_remember as unknown as unknown) ?? [],
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

function appToDbAnnualReview(
  app: Omit<AnnualReview, 'id' | 'createdAt' | 'updatedAt'>,
  userId: string
): Database['public']['Tables']['annual_reviews']['Insert'] {
  return {
    user_id: userId,
    year: app.year,
    start_date: app.startDate,
    end_date: app.endDate,
    one_sentence_summary: app.oneSentenceSummary,
    year_theme: app.yearTheme,
    goals_achieved: app.goalsAchieved as Database['public']['Tables']['annual_reviews']['Insert']['goals_achieved'],
    life_map_scores: app.lifeMapScores as unknown as Database['public']['Tables']['annual_reviews']['Insert']['life_map_scores'],
    top_wins: app.topWins,
    proudest_moment: app.proudestMoment,
    biggest_surprise: app.biggestSurprise,
    biggest_challenges: app.biggestChallenges,
    what_didnt_work: app.whatDidntWork,
    what_would_do_differently: app.whatWouldDoDifferently,
    skills_gained: app.skillsGained,
    lessons_learned: app.lessonsLearned,
    most_important_lesson: app.mostImportantLesson,
    key_relationships: app.keyRelationships,
    relationship_changes: app.relationshipChanges,
    average_energy: app.averageEnergy,
    health_summary: app.healthSummary,
    next_year_intention: app.nextYearIntention,
    next_year_word: app.nextYearWord,
    gratitude: app.gratitude,
    quotes_to_remember: app.quotesToRemember as Database['public']['Tables']['annual_reviews']['Insert']['quotes_to_remember'],
  };
}

function dbToAppNorthStar(db: DbNorthStar): NorthStar {
  return {
    oneSentence: db.one_sentence ?? '',
    stageOfLife: db.stage_of_life ?? '',
    primaryRole: db.primary_role ?? '',
    company: db.company ?? '',
    yearsInChapter: db.years_in_chapter ?? 0,
    whatDefinesChapter: db.what_defines_chapter ?? '',
    areaRankings: (db.area_rankings as unknown as AreaRanking[]) ?? defaultAreaRankings(),
    nonNegotiables: (db.non_negotiables as unknown as string[]) ?? [],
    sayingNoTo: (db.saying_no_to as unknown as string[]) ?? [],
    centralQuestion: db.central_question ?? '',
    notes: db.notes ?? '',
    updatedAt: db.updated_at,
  };
}

function appToDbNorthStar(
  app: Partial<NorthStar>,
  userId: string
): Database['public']['Tables']['north_star']['Insert'] {
  return {
    user_id: userId,
    one_sentence: app.oneSentence ?? '',
    stage_of_life: app.stageOfLife ?? '',
    primary_role: app.primaryRole ?? '',
    company: app.company ?? '',
    years_in_chapter: app.yearsInChapter ?? 0,
    what_defines_chapter: app.whatDefinesChapter ?? '',
    area_rankings: (app.areaRankings ?? defaultAreaRankings()) as unknown as Database['public']['Tables']['north_star']['Insert']['area_rankings'],
    non_negotiables: app.nonNegotiables ?? [],
    saying_no_to: app.sayingNoTo ?? [],
    central_question: app.centralQuestion ?? '',
    notes: app.notes ?? '',
  };
}

function dbToAppLifeMap(db: DbLifeMap): LifeMapScores & { id: string; snapshotDate: string } {
  return {
    id: db.id,
    snapshotDate: db.snapshot_date,
    career: db.career_score ?? 5,
    careerTrend: (db.career_trend as unknown as LifeMapScores['careerTrend']) ?? 'stable',
    careerNote: db.career_note ?? '',
    relationships: db.relationships_score ?? 5,
    relationshipsTrend: (db.relationships_trend as unknown as LifeMapScores['relationshipsTrend']) ?? 'stable',
    relationshipsNote: db.relationships_note ?? '',
    health: db.health_score ?? 5,
    healthTrend: (db.health_trend as unknown as LifeMapScores['healthTrend']) ?? 'stable',
    healthNote: db.health_note ?? '',
    finances: db.finances_score ?? 5,
    financesTrend: (db.finances_trend as unknown as LifeMapScores['financesTrend']) ?? 'stable',
    financesNote: db.finances_note ?? '',
    meaning: db.meaning_score ?? 5,
    meaningTrend: (db.meaning_trend as unknown as LifeMapScores['meaningTrend']) ?? 'stable',
    meaningNote: db.meaning_note ?? '',
    fun: db.fun_score ?? 5,
    funTrend: (db.fun_trend as unknown as LifeMapScores['funTrend']) ?? 'stable',
    funNote: db.fun_note ?? '',
  };
}

function appToDbLifeMap(
  app: Partial<LifeMapScores>,
  userId: string,
  snapshotDate?: string
): Database['public']['Tables']['life_map']['Insert'] {
  return {
    user_id: userId,
    snapshot_date: snapshotDate ?? new Date().toISOString().split('T')[0],
    career_score: app.career,
    career_trend: app.careerTrend,
    career_note: app.careerNote ?? '',
    relationships_score: app.relationships,
    relationships_trend: app.relationshipsTrend,
    relationships_note: app.relationshipsNote ?? '',
    health_score: app.health,
    health_trend: app.healthTrend,
    health_note: app.healthNote ?? '',
    finances_score: app.finances,
    finances_trend: app.financesTrend,
    finances_note: app.financesNote ?? '',
    meaning_score: app.meaning,
    meaning_trend: app.meaningTrend,
    meaning_note: app.meaningNote ?? '',
    fun_score: app.fun,
    fun_trend: app.funTrend,
    fun_note: app.funNote ?? '',
  };
}

function dbToAppMemory(db: DbMemory): Memory {
  return {
    executiveSummary: db.executive_summary ?? '',
    strengths: (db.strengths as unknown as string[]) ?? [],
    growthEdges: (db.growth_edges as unknown as string[]) ?? [],
    energizedBy: (db.energized_by as unknown as string[]) ?? [],
    drainedBy: (db.drained_by as unknown as string[]) ?? [],
    optimalConditions: db.optimal_conditions ?? '',
    overIndexes: db.over_indexes ?? '',
    underWeights: db.under_weights ?? '',
    blindSpots: (db.blind_spots as unknown as string[]) ?? [],
    goalArchaeology: (db.goal_archaeology as unknown as Memory['goalArchaeology']) ?? [],
    insightsByYear: (db.insights_by_year as unknown as Memory['insightsByYear']) ?? [],
    lessonsWork: (db.lessons_work as unknown as string[]) ?? [],
    lessonsRelationships: (db.lessons_relationships as unknown as string[]) ?? [],
    lessonsSelf: (db.lessons_self as unknown as string[]) ?? [],
    lessonsLife: (db.lessons_life as unknown as string[]) ?? [],
    quotesFromPastSelf: (db.quotes_from_past_self as unknown as Memory['quotesFromPastSelf']) ?? [],
    warningsToFutureSelf: (db.warnings_to_future_self as unknown as string[]) ?? [],
    rawNotes: db.raw_notes ?? '',
    updatedAt: db.updated_at,
  };
}

function appToDbMemory(
  app: Partial<Memory>,
  userId: string
): Database['public']['Tables']['memory']['Insert'] {
  return {
    user_id: userId,
    executive_summary: app.executiveSummary ?? '',
    strengths: app.strengths ?? [],
    growth_edges: app.growthEdges ?? [],
    energized_by: app.energizedBy ?? [],
    drained_by: app.drainedBy ?? [],
    optimal_conditions: app.optimalConditions ?? '',
    over_indexes: app.overIndexes ?? '',
    under_weights: app.underWeights ?? '',
    blind_spots: app.blindSpots ?? [],
    goal_archaeology: (app.goalArchaeology ?? []) as unknown as Database['public']['Tables']['memory']['Insert']['goal_archaeology'],
    insights_by_year: (app.insightsByYear ?? []) as unknown as Database['public']['Tables']['memory']['Insert']['insights_by_year'],
    lessons_work: app.lessonsWork ?? [],
    lessons_relationships: app.lessonsRelationships ?? [],
    lessons_self: app.lessonsSelf ?? [],
    lessons_life: app.lessonsLife ?? [],
    quotes_from_past_self: (app.quotesFromPastSelf ?? []) as unknown as Database['public']['Tables']['memory']['Insert']['quotes_from_past_self'],
    warnings_to_future_self: app.warningsToFutureSelf ?? [],
    raw_notes: app.rawNotes ?? '',
  };
}

function dbToAppInterviewResponse(db: DbInterviewResponse): InterviewResponse {
  return {
    id: db.id,
    interviewType: db.interview_type as InterviewResponse['interviewType'],
    responses: (db.responses as unknown as Record<string, string>) ?? {},
    completedAt: db.completed_at ?? db.created_at,
    createdAt: db.created_at,
  };
}

function appToDbInterviewResponse(
  app: Omit<InterviewResponse, 'id' | 'createdAt'>,
  userId: string
): Database['public']['Tables']['interview_responses']['Insert'] {
  return {
    user_id: userId,
    interview_type: app.interviewType,
    responses: app.responses as unknown as Database['public']['Tables']['interview_responses']['Insert']['responses'],
    completed_at: app.completedAt,
  };
}

// Goal transformations
function dbToAppYearGoals(db: DbGoal): YearGoals {
  return {
    year: db.period_start,
    theme: db.theme ?? '',
    ifGoesWell: db.if_goes_well ?? '',
    career: (db.career as unknown as GoalArea) ?? defaultGoalArea(),
    relationships: (db.relationships as unknown as GoalArea) ?? defaultGoalArea(),
    health: (db.health as unknown as GoalArea) ?? defaultGoalArea(),
    finances: (db.finances as unknown as GoalArea) ?? defaultGoalArea(),
    meaning: (db.meaning as unknown as GoalArea) ?? defaultGoalArea(),
    fun: (db.fun as unknown as GoalArea) ?? defaultGoalArea(),
    criticalThree: (db.critical_three as unknown as string[]) ?? [],
    antiGoals: (db.anti_goals as unknown as string[]) ?? [],
    habitsToBuild: (db.habits_to_build as unknown as YearGoals['habitsToBuild']) ?? [],
    habitsToBreak: (db.habits_to_break as unknown as YearGoals['habitsToBreak']) ?? [],
    updatedAt: db.updated_at,
  };
}

function dbToAppVisionGoals(db: DbGoal): VisionGoals {
  return {
    periodStart: db.period_start,
    periodEnd: db.period_end ?? db.period_start + 3,
    snapshot: db.snapshot ?? '',
    whereLive: db.where_live ?? '',
    whatDo: db.what_do ?? '',
    keyPeople: db.key_people ?? '',
    typicalWeek: db.typical_week ?? '',
    whatsDifferent: db.whats_different ?? '',
    career: typeof db.career === 'string' ? db.career : '',
    relationships: typeof db.relationships === 'string' ? db.relationships : '',
    health: typeof db.health === 'string' ? db.health : '',
    finances: typeof db.finances === 'string' ? db.finances : '',
    meaning: typeof db.meaning === 'string' ? db.meaning : '',
    fun: typeof db.fun === 'string' ? db.fun : '',
    bigBets: (db.big_bets as unknown as string[]) ?? [],
    needsToEnd: (db.needs_to_end as unknown as string[]) ?? [],
    needsToBegin: (db.needs_to_begin as unknown as string[]) ?? [],
    updatedAt: db.updated_at,
  };
}

// ============================================================================
// Default values
// ============================================================================

function defaultGoalArea(): GoalArea {
  return {
    primaryGoal: '',
    whyMatters: '',
    q1Milestone: '',
    q2Milestone: '',
    q3Milestone: '',
    q4Milestone: '',
    successCriteria: '',
    commitment: 5,
  };
}

function defaultAreaRankings(): AreaRanking[] {
  return [
    { area: 'career', rank: 0, why: '' },
    { area: 'relationships', rank: 0, why: '' },
    { area: 'health', rank: 0, why: '' },
    { area: 'finances', rank: 0, why: '' },
    { area: 'meaning', rank: 0, why: '' },
    { area: 'fun', rank: 0, why: '' },
  ];
}

function defaultLifeMapScores(): LifeMapScores {
  return {
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
}

function defaultYearGoals(): YearGoals {
  return {
    year: new Date().getFullYear(),
    theme: '',
    ifGoesWell: '',
    career: defaultGoalArea(),
    relationships: defaultGoalArea(),
    health: defaultGoalArea(),
    finances: defaultGoalArea(),
    meaning: defaultGoalArea(),
    fun: defaultGoalArea(),
    criticalThree: ['', '', ''],
    antiGoals: [],
    habitsToBuild: [],
    habitsToBreak: [],
    updatedAt: new Date().toISOString(),
  };
}

function defaultVisionGoals(yearsOut: number): VisionGoals {
  return {
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
  };
}

function defaultNorthStar(): NorthStar {
  return {
    oneSentence: '',
    stageOfLife: '',
    primaryRole: '',
    company: '',
    yearsInChapter: 0,
    whatDefinesChapter: '',
    areaRankings: defaultAreaRankings(),
    nonNegotiables: [],
    sayingNoTo: [],
    centralQuestion: '',
    notes: '',
    updatedAt: new Date().toISOString(),
  };
}

function defaultMemory(): Memory {
  return {
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
}

// ============================================================================
// useUser hook
// ============================================================================

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}

// ============================================================================
// useDailyCheckIns hook
// ============================================================================

export function useDailyCheckIns() {
  const { user } = useUser();
  const [data, setData] = useState<DailyCheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const supabase = createClient();
      const { data: rows, error: fetchError } = await supabase
        .from('daily_check_ins')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (fetchError) throw fetchError;
      setData((rows ?? []).map(dbToAppDailyCheckIn));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch daily check-ins'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const add = useCallback(
    async (checkIn: Omit<DailyCheckIn, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (!user) throw new Error('User not authenticated');

      // Optimistic update
      const tempId = crypto.randomUUID();
      const now = new Date().toISOString();
      const optimisticCheckIn: DailyCheckIn = {
        ...checkIn,
        id: tempId,
        createdAt: now,
        updatedAt: now,
      };
      setData((prev) => [optimisticCheckIn, ...prev]);

      try {
        const supabase = createClient();
        const { data: inserted, error: insertError } = await supabase
          .from('daily_check_ins')
          .insert(appToDbDailyCheckIn(checkIn, user.id))
          .select()
          .single();

        if (insertError) throw insertError;

        // Replace optimistic entry with real one
        setData((prev) =>
          prev.map((c) => (c.id === tempId ? dbToAppDailyCheckIn(inserted) : c))
        );
        return dbToAppDailyCheckIn(inserted);
      } catch (err) {
        // Rollback on error
        setData((prev) => prev.filter((c) => c.id !== tempId));
        throw err;
      }
    },
    [user]
  );

  const update = useCallback(
    async (id: string, updates: Partial<DailyCheckIn>) => {
      if (!user) throw new Error('User not authenticated');

      // Store previous state for rollback
      const previous = data.find((c) => c.id === id);
      if (!previous) throw new Error('Check-in not found');

      // Optimistic update
      setData((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
        )
      );

      try {
        const supabase = createClient();
        const dbUpdates: Database['public']['Tables']['daily_check_ins']['Update'] = {
          ...(updates.date !== undefined && { date: updates.date }),
          ...(updates.energyPhysical !== undefined && { energy_physical: updates.energyPhysical }),
          ...(updates.energyMental !== undefined && { energy_mental: updates.energyMental }),
          ...(updates.energyEmotional !== undefined && { energy_emotional: updates.energyEmotional }),
          ...(updates.energyWord !== undefined && { energy_word: updates.energyWord }),
          ...(updates.meaningfulWin !== undefined && { meaningful_win: updates.meaningfulWin }),
          ...(updates.frictionPoint !== undefined && { friction_point: updates.frictionPoint }),
          ...(updates.letGo !== undefined && { let_go: updates.letGo }),
          ...(updates.tomorrowPriority !== undefined && { tomorrow_priority: updates.tomorrowPriority }),
          ...(updates.notes !== undefined && { notes: updates.notes }),
          updated_at: new Date().toISOString(),
        };

        const { error: updateError } = await supabase
          .from('daily_check_ins')
          .update(dbUpdates)
          .eq('id', id)
          .eq('user_id', user.id);

        if (updateError) throw updateError;
      } catch (err) {
        // Rollback on error
        setData((prev) => prev.map((c) => (c.id === id ? previous : c)));
        throw err;
      }
    },
    [user, data]
  );

  const getByDate = useCallback(
    (date: string) => data.find((c) => c.date === date),
    [data]
  );

  const getRecent = useCallback(
    (count: number) => data.slice(0, count),
    [data]
  );

  return { data, loading, error, add, update, getByDate, getRecent };
}

// ============================================================================
// useWeeklyReviews hook
// ============================================================================

export function useWeeklyReviews() {
  const { user } = useUser();
  const [data, setData] = useState<WeeklyReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const supabase = createClient();
      const { data: rows, error: fetchError } = await supabase
        .from('weekly_reviews')
        .select('*')
        .eq('user_id', user.id)
        .order('week', { ascending: false });

      if (fetchError) throw fetchError;
      setData((rows ?? []).map(dbToAppWeeklyReview));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch weekly reviews'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const add = useCallback(
    async (review: Omit<WeeklyReview, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (!user) throw new Error('User not authenticated');

      const tempId = crypto.randomUUID();
      const now = new Date().toISOString();
      const optimisticReview: WeeklyReview = {
        ...review,
        id: tempId,
        createdAt: now,
        updatedAt: now,
      };
      setData((prev) => [optimisticReview, ...prev]);

      try {
        const supabase = createClient();
        const { data: inserted, error: insertError } = await supabase
          .from('weekly_reviews')
          .insert(appToDbWeeklyReview(review, user.id))
          .select()
          .single();

        if (insertError) throw insertError;

        setData((prev) =>
          prev.map((r) => (r.id === tempId ? dbToAppWeeklyReview(inserted) : r))
        );
        return dbToAppWeeklyReview(inserted);
      } catch (err) {
        setData((prev) => prev.filter((r) => r.id !== tempId));
        throw err;
      }
    },
    [user]
  );

  const update = useCallback(
    async (id: string, updates: Partial<WeeklyReview>) => {
      if (!user) throw new Error('User not authenticated');

      const previous = data.find((r) => r.id === id);
      if (!previous) throw new Error('Review not found');

      setData((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
        )
      );

      try {
        const supabase = createClient();
        const dbUpdates: Database['public']['Tables']['weekly_reviews']['Update'] = {
          ...(updates.week !== undefined && { week: updates.week }),
          ...(updates.startDate !== undefined && { start_date: updates.startDate }),
          ...(updates.endDate !== undefined && { end_date: updates.endDate }),
          ...(updates.movedNeedle !== undefined && { moved_needle: updates.movedNeedle }),
          ...(updates.wasNoise !== undefined && { was_noise: updates.wasNoise }),
          ...(updates.timeLeaked !== undefined && { time_leaked: updates.timeLeaked }),
          ...(updates.averageEnergy !== undefined && { average_energy: updates.averageEnergy }),
          ...(updates.bestDay !== undefined && { best_day: updates.bestDay }),
          ...(updates.bestDayWhy !== undefined && { best_day_why: updates.bestDayWhy }),
          ...(updates.worstDay !== undefined && { worst_day: updates.worstDay }),
          ...(updates.worstDayWhy !== undefined && { worst_day_why: updates.worstDayWhy }),
          ...(updates.whoEnergized !== undefined && { who_energized: updates.whoEnergized }),
          ...(updates.whoDrained !== undefined && { who_drained: updates.whoDrained }),
          ...(updates.shouldConnect !== undefined && { should_connect: updates.shouldConnect }),
          ...(updates.strategicInsight !== undefined && { strategic_insight: updates.strategicInsight }),
          ...(updates.adjustment !== undefined && { adjustment: updates.adjustment }),
          ...(updates.nextPriorities !== undefined && { next_priorities: updates.nextPriorities }),
          ...(updates.gratitude !== undefined && { gratitude: updates.gratitude }),
          ...(updates.wins !== undefined && { wins: updates.wins }),
          updated_at: new Date().toISOString(),
        };

        const { error: updateError } = await supabase
          .from('weekly_reviews')
          .update(dbUpdates)
          .eq('id', id)
          .eq('user_id', user.id);

        if (updateError) throw updateError;
      } catch (err) {
        setData((prev) => prev.map((r) => (r.id === id ? previous : r)));
        throw err;
      }
    },
    [user, data]
  );

  const getByWeek = useCallback(
    (week: string) => data.find((r) => r.week === week),
    [data]
  );

  const getRecent = useCallback(
    (count: number) => data.slice(0, count),
    [data]
  );

  return { data, loading, error, add, update, getByWeek, getRecent };
}

// ============================================================================
// useQuarterlyReviews hook
// ============================================================================

export function useQuarterlyReviews() {
  const { user } = useUser();
  const [data, setData] = useState<QuarterlyReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const supabase = createClient();
      const { data: rows, error: fetchError } = await supabase
        .from('quarterly_reviews')
        .select('*')
        .eq('user_id', user.id)
        .order('quarter', { ascending: false });

      if (fetchError) throw fetchError;
      setData((rows ?? []).map(dbToAppQuarterlyReview));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch quarterly reviews'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const add = useCallback(
    async (review: Omit<QuarterlyReview, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (!user) throw new Error('User not authenticated');

      const tempId = crypto.randomUUID();
      const now = new Date().toISOString();
      const optimisticReview: QuarterlyReview = {
        ...review,
        id: tempId,
        createdAt: now,
        updatedAt: now,
      };
      setData((prev) => [optimisticReview, ...prev]);

      try {
        const supabase = createClient();
        const { data: inserted, error: insertError } = await supabase
          .from('quarterly_reviews')
          .insert(appToDbQuarterlyReview(review, user.id))
          .select()
          .single();

        if (insertError) throw insertError;

        setData((prev) =>
          prev.map((r) => (r.id === tempId ? dbToAppQuarterlyReview(inserted) : r))
        );
        return dbToAppQuarterlyReview(inserted);
      } catch (err) {
        setData((prev) => prev.filter((r) => r.id !== tempId));
        throw err;
      }
    },
    [user]
  );

  const update = useCallback(
    async (id: string, updates: Partial<QuarterlyReview>) => {
      if (!user) throw new Error('User not authenticated');

      const previous = data.find((r) => r.id === id);
      if (!previous) throw new Error('Review not found');

      setData((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
        )
      );

      try {
        const supabase = createClient();
        const dbUpdates: Database['public']['Tables']['quarterly_reviews']['Update'] = {
          ...(updates.quarter !== undefined && { quarter: updates.quarter }),
          ...(updates.startDate !== undefined && { start_date: updates.startDate }),
          ...(updates.endDate !== undefined && { end_date: updates.endDate }),
          ...(updates.goalProgress !== undefined && { goal_progress: updates.goalProgress as unknown as Database['public']['Tables']['quarterly_reviews']['Update']['goal_progress'] }),
          ...(updates.lifeMapScores !== undefined && { life_map_scores: updates.lifeMapScores as unknown as Database['public']['Tables']['quarterly_reviews']['Update']['life_map_scores'] }),
          ...(updates.averageEnergy !== undefined && { average_energy: updates.averageEnergy }),
          ...(updates.bestMonth !== undefined && { best_month: updates.bestMonth }),
          ...(updates.bestMonthWhy !== undefined && { best_month_why: updates.bestMonthWhy }),
          ...(updates.worstMonth !== undefined && { worst_month: updates.worstMonth }),
          ...(updates.worstMonthWhy !== undefined && { worst_month_why: updates.worstMonthWhy }),
          ...(updates.energizers !== undefined && { energizers: updates.energizers }),
          ...(updates.drainers !== undefined && { drainers: updates.drainers }),
          ...(updates.sustainablePace !== undefined && { sustainable_pace: updates.sustainablePace }),
          ...(updates.workingOnWhatMatters !== undefined && { working_on_what_matters: updates.workingOnWhatMatters }),
          ...(updates.timeGap !== undefined && { time_gap: updates.timeGap }),
          ...(updates.saidYesShouldntHave !== undefined && { said_yes_shouldnt_have: updates.saidYesShouldntHave }),
          ...(updates.missedOpportunity !== undefined && { missed_opportunity: updates.missedOpportunity }),
          ...(updates.keyWins !== undefined && { key_wins: updates.keyWins }),
          ...(updates.unexpectedWin !== undefined && { unexpected_win: updates.unexpectedWin }),
          ...(updates.keyChallenges !== undefined && { key_challenges: updates.keyChallenges }),
          ...(updates.persistentProblem !== undefined && { persistent_problem: updates.persistentProblem }),
          ...(updates.avoidingDecision !== undefined && { avoiding_decision: updates.avoidingDecision }),
          ...(updates.lessonLearned !== undefined && { lesson_learned: updates.lessonLearned }),
          ...(updates.newKnowledge !== undefined && { new_knowledge: updates.newKnowledge }),
          ...(updates.clearerPattern !== undefined && { clearer_pattern: updates.clearerPattern }),
          ...(updates.startDoing !== undefined && { start_doing: updates.startDoing }),
          ...(updates.stopDoing !== undefined && { stop_doing: updates.stopDoing }),
          ...(updates.continueDoing !== undefined && { continue_doing: updates.continueDoing }),
          ...(updates.nextQuarterTheme !== undefined && { next_quarter_theme: updates.nextQuarterTheme }),
          ...(updates.nextPriorities !== undefined && { next_priorities: updates.nextPriorities }),
          ...(updates.whatWillBeTrue !== undefined && { what_will_be_true: updates.whatWillBeTrue }),
          ...(updates.oneThingEasier !== undefined && { one_thing_easier: updates.oneThingEasier }),
          ...(updates.directionStillAccurate !== undefined && { direction_still_accurate: updates.directionStillAccurate }),
          ...(updates.needsToChange !== undefined && { needs_to_change: updates.needsToChange }),
          ...(updates.memoryInsights !== undefined && { memory_insights: updates.memoryInsights }),
          updated_at: new Date().toISOString(),
        };

        const { error: updateError } = await supabase
          .from('quarterly_reviews')
          .update(dbUpdates)
          .eq('id', id)
          .eq('user_id', user.id);

        if (updateError) throw updateError;
      } catch (err) {
        setData((prev) => prev.map((r) => (r.id === id ? previous : r)));
        throw err;
      }
    },
    [user, data]
  );

  const getByQuarter = useCallback(
    (quarter: string) => data.find((r) => r.quarter === quarter),
    [data]
  );

  return { data, loading, error, add, update, getByQuarter };
}

// ============================================================================
// useAnnualReviews hook
// ============================================================================

export function useAnnualReviews() {
  const { user } = useUser();
  const [data, setData] = useState<AnnualReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const supabase = createClient();
      const { data: rows, error: fetchError } = await supabase
        .from('annual_reviews')
        .select('*')
        .eq('user_id', user.id)
        .order('year', { ascending: false });

      if (fetchError) throw fetchError;
      setData((rows ?? []).map(dbToAppAnnualReview));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch annual reviews'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const add = useCallback(
    async (review: Omit<AnnualReview, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (!user) throw new Error('User not authenticated');

      const tempId = crypto.randomUUID();
      const now = new Date().toISOString();
      const optimisticReview: AnnualReview = {
        ...review,
        id: tempId,
        createdAt: now,
        updatedAt: now,
      };
      setData((prev) => [optimisticReview, ...prev]);

      try {
        const supabase = createClient();
        const { data: inserted, error: insertError } = await supabase
          .from('annual_reviews')
          .insert(appToDbAnnualReview(review, user.id))
          .select()
          .single();

        if (insertError) throw insertError;

        setData((prev) =>
          prev.map((r) => (r.id === tempId ? dbToAppAnnualReview(inserted) : r))
        );
        return dbToAppAnnualReview(inserted);
      } catch (err) {
        setData((prev) => prev.filter((r) => r.id !== tempId));
        throw err;
      }
    },
    [user]
  );

  const update = useCallback(
    async (id: string, updates: Partial<AnnualReview>) => {
      if (!user) throw new Error('User not authenticated');

      const previous = data.find((r) => r.id === id);
      if (!previous) throw new Error('Review not found');

      setData((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
        )
      );

      try {
        const supabase = createClient();
        const dbUpdates: Database['public']['Tables']['annual_reviews']['Update'] = {
          ...(updates.year !== undefined && { year: updates.year }),
          ...(updates.startDate !== undefined && { start_date: updates.startDate }),
          ...(updates.endDate !== undefined && { end_date: updates.endDate }),
          ...(updates.oneSentenceSummary !== undefined && { one_sentence_summary: updates.oneSentenceSummary }),
          ...(updates.yearTheme !== undefined && { year_theme: updates.yearTheme }),
          ...(updates.goalsAchieved !== undefined && { goals_achieved: updates.goalsAchieved as Database['public']['Tables']['annual_reviews']['Update']['goals_achieved'] }),
          ...(updates.lifeMapScores !== undefined && { life_map_scores: updates.lifeMapScores as unknown as Database['public']['Tables']['annual_reviews']['Update']['life_map_scores'] }),
          ...(updates.topWins !== undefined && { top_wins: updates.topWins }),
          ...(updates.proudestMoment !== undefined && { proudest_moment: updates.proudestMoment }),
          ...(updates.biggestSurprise !== undefined && { biggest_surprise: updates.biggestSurprise }),
          ...(updates.biggestChallenges !== undefined && { biggest_challenges: updates.biggestChallenges }),
          ...(updates.whatDidntWork !== undefined && { what_didnt_work: updates.whatDidntWork }),
          ...(updates.whatWouldDoDifferently !== undefined && { what_would_do_differently: updates.whatWouldDoDifferently }),
          ...(updates.skillsGained !== undefined && { skills_gained: updates.skillsGained }),
          ...(updates.lessonsLearned !== undefined && { lessons_learned: updates.lessonsLearned }),
          ...(updates.mostImportantLesson !== undefined && { most_important_lesson: updates.mostImportantLesson }),
          ...(updates.keyRelationships !== undefined && { key_relationships: updates.keyRelationships }),
          ...(updates.relationshipChanges !== undefined && { relationship_changes: updates.relationshipChanges }),
          ...(updates.averageEnergy !== undefined && { average_energy: updates.averageEnergy }),
          ...(updates.healthSummary !== undefined && { health_summary: updates.healthSummary }),
          ...(updates.nextYearIntention !== undefined && { next_year_intention: updates.nextYearIntention }),
          ...(updates.nextYearWord !== undefined && { next_year_word: updates.nextYearWord }),
          ...(updates.gratitude !== undefined && { gratitude: updates.gratitude }),
          ...(updates.quotesToRemember !== undefined && { quotes_to_remember: updates.quotesToRemember as Database['public']['Tables']['annual_reviews']['Update']['quotes_to_remember'] }),
          updated_at: new Date().toISOString(),
        };

        const { error: updateError } = await supabase
          .from('annual_reviews')
          .update(dbUpdates)
          .eq('id', id)
          .eq('user_id', user.id);

        if (updateError) throw updateError;
      } catch (err) {
        setData((prev) => prev.map((r) => (r.id === id ? previous : r)));
        throw err;
      }
    },
    [user, data]
  );

  const getByYear = useCallback(
    (year: number) => data.find((r) => r.year === year),
    [data]
  );

  return { data, loading, error, add, update, getByYear };
}

// ============================================================================
// useGoals hook
// ============================================================================

export function useGoals() {
  const { user } = useUser();
  const [oneYear, setOneYear] = useState<YearGoals>(defaultYearGoals());
  const [threeYear, setThreeYear] = useState<VisionGoals>(defaultVisionGoals(3));
  const [tenYear, setTenYear] = useState<VisionGoals>(defaultVisionGoals(10));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [goalIds, setGoalIds] = useState<{ oneYear?: string; threeYear?: string; tenYear?: string }>({});

  const fetchData = useCallback(async () => {
    if (!user) {
      setOneYear(defaultYearGoals());
      setThreeYear(defaultVisionGoals(3));
      setTenYear(defaultVisionGoals(10));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const supabase = createClient();
      const { data: rows, error: fetchError } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;

      const ids: { oneYear?: string; threeYear?: string; tenYear?: string } = {};

      (rows ?? []).forEach((row) => {
        if (row.goal_type === 'one_year') {
          setOneYear(dbToAppYearGoals(row));
          ids.oneYear = row.id;
        } else if (row.goal_type === 'three_year') {
          setThreeYear(dbToAppVisionGoals(row));
          ids.threeYear = row.id;
        } else if (row.goal_type === 'ten_year') {
          setTenYear(dbToAppVisionGoals(row));
          ids.tenYear = row.id;
        }
      });

      setGoalIds(ids);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch goals'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateOneYear = useCallback(
    async (updates: Partial<YearGoals>) => {
      if (!user) throw new Error('User not authenticated');

      const previous = oneYear;
      setOneYear((prev) => ({ ...prev, ...updates, updatedAt: new Date().toISOString() }));

      try {
        const supabase = createClient();

        if (goalIds.oneYear) {
          // Update existing
          const dbUpdates: Database['public']['Tables']['goals']['Update'] = {
            ...(updates.year !== undefined && { period_start: updates.year }),
            ...(updates.theme !== undefined && { theme: updates.theme }),
            ...(updates.ifGoesWell !== undefined && { if_goes_well: updates.ifGoesWell }),
            ...(updates.career !== undefined && { career: updates.career as unknown as Database['public']['Tables']['goals']['Update']['career'] }),
            ...(updates.relationships !== undefined && { relationships: updates.relationships as unknown as Database['public']['Tables']['goals']['Update']['relationships'] }),
            ...(updates.health !== undefined && { health: updates.health as unknown as Database['public']['Tables']['goals']['Update']['health'] }),
            ...(updates.finances !== undefined && { finances: updates.finances as unknown as Database['public']['Tables']['goals']['Update']['finances'] }),
            ...(updates.meaning !== undefined && { meaning: updates.meaning as unknown as Database['public']['Tables']['goals']['Update']['meaning'] }),
            ...(updates.fun !== undefined && { fun: updates.fun as unknown as Database['public']['Tables']['goals']['Update']['fun'] }),
            ...(updates.criticalThree !== undefined && { critical_three: updates.criticalThree }),
            ...(updates.antiGoals !== undefined && { anti_goals: updates.antiGoals }),
            ...(updates.habitsToBuild !== undefined && { habits_to_build: updates.habitsToBuild as unknown as Database['public']['Tables']['goals']['Update']['habits_to_build'] }),
            ...(updates.habitsToBreak !== undefined && { habits_to_break: updates.habitsToBreak as unknown as Database['public']['Tables']['goals']['Update']['habits_to_break'] }),
            updated_at: new Date().toISOString(),
          };

          const { error: updateError } = await supabase
            .from('goals')
            .update(dbUpdates)
            .eq('id', goalIds.oneYear)
            .eq('user_id', user.id);

          if (updateError) throw updateError;
        } else {
          // Insert new
          const merged = { ...oneYear, ...updates };
          const insertData: Database['public']['Tables']['goals']['Insert'] = {
            user_id: user.id,
            goal_type: 'one_year',
            period_start: merged.year,
            theme: merged.theme,
            if_goes_well: merged.ifGoesWell,
            career: merged.career as unknown as Database['public']['Tables']['goals']['Insert']['career'],
            relationships: merged.relationships as unknown as Database['public']['Tables']['goals']['Insert']['relationships'],
            health: merged.health as unknown as Database['public']['Tables']['goals']['Insert']['health'],
            finances: merged.finances as unknown as Database['public']['Tables']['goals']['Insert']['finances'],
            meaning: merged.meaning as unknown as Database['public']['Tables']['goals']['Insert']['meaning'],
            fun: merged.fun as unknown as Database['public']['Tables']['goals']['Insert']['fun'],
            critical_three: merged.criticalThree,
            anti_goals: merged.antiGoals,
            habits_to_build: merged.habitsToBuild as unknown as Database['public']['Tables']['goals']['Insert']['habits_to_build'],
            habits_to_break: merged.habitsToBreak as unknown as Database['public']['Tables']['goals']['Insert']['habits_to_break'],
          };

          const { data: inserted, error: insertError } = await supabase
            .from('goals')
            .insert(insertData)
            .select()
            .single();

          if (insertError) throw insertError;
          setGoalIds((prev) => ({ ...prev, oneYear: inserted.id }));
        }
      } catch (err) {
        setOneYear(previous);
        throw err;
      }
    },
    [user, oneYear, goalIds.oneYear]
  );

  const updateThreeYear = useCallback(
    async (updates: Partial<VisionGoals>) => {
      if (!user) throw new Error('User not authenticated');

      const previous = threeYear;
      setThreeYear((prev) => ({ ...prev, ...updates, updatedAt: new Date().toISOString() }));

      try {
        const supabase = createClient();

        if (goalIds.threeYear) {
          const dbUpdates: Database['public']['Tables']['goals']['Update'] = {
            ...(updates.periodStart !== undefined && { period_start: updates.periodStart }),
            ...(updates.periodEnd !== undefined && { period_end: updates.periodEnd }),
            ...(updates.snapshot !== undefined && { snapshot: updates.snapshot }),
            ...(updates.whereLive !== undefined && { where_live: updates.whereLive }),
            ...(updates.whatDo !== undefined && { what_do: updates.whatDo }),
            ...(updates.keyPeople !== undefined && { key_people: updates.keyPeople }),
            ...(updates.typicalWeek !== undefined && { typical_week: updates.typicalWeek }),
            ...(updates.whatsDifferent !== undefined && { whats_different: updates.whatsDifferent }),
            ...(updates.career !== undefined && { career: updates.career }),
            ...(updates.relationships !== undefined && { relationships: updates.relationships }),
            ...(updates.health !== undefined && { health: updates.health }),
            ...(updates.finances !== undefined && { finances: updates.finances }),
            ...(updates.meaning !== undefined && { meaning: updates.meaning }),
            ...(updates.fun !== undefined && { fun: updates.fun }),
            ...(updates.bigBets !== undefined && { big_bets: updates.bigBets }),
            ...(updates.needsToEnd !== undefined && { needs_to_end: updates.needsToEnd }),
            ...(updates.needsToBegin !== undefined && { needs_to_begin: updates.needsToBegin }),
            updated_at: new Date().toISOString(),
          };

          const { error: updateError } = await supabase
            .from('goals')
            .update(dbUpdates)
            .eq('id', goalIds.threeYear)
            .eq('user_id', user.id);

          if (updateError) throw updateError;
        } else {
          const merged = { ...threeYear, ...updates };
          const insertData: Database['public']['Tables']['goals']['Insert'] = {
            user_id: user.id,
            goal_type: 'three_year',
            period_start: merged.periodStart,
            period_end: merged.periodEnd,
            snapshot: merged.snapshot,
            where_live: merged.whereLive,
            what_do: merged.whatDo,
            key_people: merged.keyPeople,
            typical_week: merged.typicalWeek,
            whats_different: merged.whatsDifferent,
            career: merged.career,
            relationships: merged.relationships,
            health: merged.health,
            finances: merged.finances,
            meaning: merged.meaning,
            fun: merged.fun,
            big_bets: merged.bigBets,
            needs_to_end: merged.needsToEnd,
            needs_to_begin: merged.needsToBegin,
          };

          const { data: inserted, error: insertError } = await supabase
            .from('goals')
            .insert(insertData)
            .select()
            .single();

          if (insertError) throw insertError;
          setGoalIds((prev) => ({ ...prev, threeYear: inserted.id }));
        }
      } catch (err) {
        setThreeYear(previous);
        throw err;
      }
    },
    [user, threeYear, goalIds.threeYear]
  );

  const updateTenYear = useCallback(
    async (updates: Partial<VisionGoals>) => {
      if (!user) throw new Error('User not authenticated');

      const previous = tenYear;
      setTenYear((prev) => ({ ...prev, ...updates, updatedAt: new Date().toISOString() }));

      try {
        const supabase = createClient();

        if (goalIds.tenYear) {
          const dbUpdates: Database['public']['Tables']['goals']['Update'] = {
            ...(updates.periodStart !== undefined && { period_start: updates.periodStart }),
            ...(updates.periodEnd !== undefined && { period_end: updates.periodEnd }),
            ...(updates.snapshot !== undefined && { snapshot: updates.snapshot }),
            ...(updates.whereLive !== undefined && { where_live: updates.whereLive }),
            ...(updates.whatDo !== undefined && { what_do: updates.whatDo }),
            ...(updates.keyPeople !== undefined && { key_people: updates.keyPeople }),
            ...(updates.typicalWeek !== undefined && { typical_week: updates.typicalWeek }),
            ...(updates.whatsDifferent !== undefined && { whats_different: updates.whatsDifferent }),
            ...(updates.career !== undefined && { career: updates.career }),
            ...(updates.relationships !== undefined && { relationships: updates.relationships }),
            ...(updates.health !== undefined && { health: updates.health }),
            ...(updates.finances !== undefined && { finances: updates.finances }),
            ...(updates.meaning !== undefined && { meaning: updates.meaning }),
            ...(updates.fun !== undefined && { fun: updates.fun }),
            ...(updates.bigBets !== undefined && { big_bets: updates.bigBets }),
            ...(updates.needsToEnd !== undefined && { needs_to_end: updates.needsToEnd }),
            ...(updates.needsToBegin !== undefined && { needs_to_begin: updates.needsToBegin }),
            updated_at: new Date().toISOString(),
          };

          const { error: updateError } = await supabase
            .from('goals')
            .update(dbUpdates)
            .eq('id', goalIds.tenYear)
            .eq('user_id', user.id);

          if (updateError) throw updateError;
        } else {
          const merged = { ...tenYear, ...updates };
          const insertData: Database['public']['Tables']['goals']['Insert'] = {
            user_id: user.id,
            goal_type: 'ten_year',
            period_start: merged.periodStart,
            period_end: merged.periodEnd,
            snapshot: merged.snapshot,
            where_live: merged.whereLive,
            what_do: merged.whatDo,
            key_people: merged.keyPeople,
            typical_week: merged.typicalWeek,
            whats_different: merged.whatsDifferent,
            career: merged.career,
            relationships: merged.relationships,
            health: merged.health,
            finances: merged.finances,
            meaning: merged.meaning,
            fun: merged.fun,
            big_bets: merged.bigBets,
            needs_to_end: merged.needsToEnd,
            needs_to_begin: merged.needsToBegin,
          };

          const { data: inserted, error: insertError } = await supabase
            .from('goals')
            .insert(insertData)
            .select()
            .single();

          if (insertError) throw insertError;
          setGoalIds((prev) => ({ ...prev, tenYear: inserted.id }));
        }
      } catch (err) {
        setTenYear(previous);
        throw err;
      }
    },
    [user, tenYear, goalIds.tenYear]
  );

  return { oneYear, threeYear, tenYear, loading, error, updateOneYear, updateThreeYear, updateTenYear };
}

// ============================================================================
// useNorthStar hook
// ============================================================================

export function useNorthStar() {
  const { user } = useUser();
  const [data, setData] = useState<NorthStar>(defaultNorthStar());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [recordId, setRecordId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) {
      setData(defaultNorthStar());
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const supabase = createClient();
      const { data: row, error: fetchError } = await supabase
        .from('north_star')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (row) {
        setData(dbToAppNorthStar(row));
        setRecordId(row.id);
      } else {
        setData(defaultNorthStar());
        setRecordId(null);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch north star'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const update = useCallback(
    async (updates: Partial<NorthStar>) => {
      if (!user) throw new Error('User not authenticated');

      const previous = data;
      setData((prev) => ({ ...prev, ...updates, updatedAt: new Date().toISOString() }));

      try {
        const supabase = createClient();

        if (recordId) {
          const dbUpdates: Database['public']['Tables']['north_star']['Update'] = {
            ...(updates.oneSentence !== undefined && { one_sentence: updates.oneSentence }),
            ...(updates.stageOfLife !== undefined && { stage_of_life: updates.stageOfLife }),
            ...(updates.primaryRole !== undefined && { primary_role: updates.primaryRole }),
            ...(updates.company !== undefined && { company: updates.company }),
            ...(updates.yearsInChapter !== undefined && { years_in_chapter: updates.yearsInChapter }),
            ...(updates.whatDefinesChapter !== undefined && { what_defines_chapter: updates.whatDefinesChapter }),
            ...(updates.areaRankings !== undefined && { area_rankings: updates.areaRankings as unknown as Database['public']['Tables']['north_star']['Update']['area_rankings'] }),
            ...(updates.nonNegotiables !== undefined && { non_negotiables: updates.nonNegotiables }),
            ...(updates.sayingNoTo !== undefined && { saying_no_to: updates.sayingNoTo }),
            ...(updates.centralQuestion !== undefined && { central_question: updates.centralQuestion }),
            ...(updates.notes !== undefined && { notes: updates.notes }),
            updated_at: new Date().toISOString(),
          };

          const { error: updateError } = await supabase
            .from('north_star')
            .update(dbUpdates)
            .eq('id', recordId)
            .eq('user_id', user.id);

          if (updateError) throw updateError;
        } else {
          const merged = { ...data, ...updates };
          const { data: inserted, error: insertError } = await supabase
            .from('north_star')
            .insert(appToDbNorthStar(merged, user.id))
            .select()
            .single();

          if (insertError) throw insertError;
          setRecordId(inserted.id);
        }
      } catch (err) {
        setData(previous);
        throw err;
      }
    },
    [user, data, recordId]
  );

  return { data, loading, error, update };
}

// ============================================================================
// useLifeMap hook
// ============================================================================

export function useLifeMap() {
  const { user } = useUser();
  const [current, setCurrent] = useState<LifeMapScores & { id?: string; snapshotDate?: string }>(defaultLifeMapScores());
  const [history, setHistory] = useState<(LifeMapScores & { id: string; snapshotDate: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) {
      setCurrent(defaultLifeMapScores());
      setHistory([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const supabase = createClient();
      const { data: rows, error: fetchError } = await supabase
        .from('life_map')
        .select('*')
        .eq('user_id', user.id)
        .order('snapshot_date', { ascending: false });

      if (fetchError) throw fetchError;

      const mapped = (rows ?? []).map(dbToAppLifeMap);
      if (mapped.length > 0) {
        setCurrent(mapped[0]);
        setHistory(mapped);
      } else {
        setCurrent(defaultLifeMapScores());
        setHistory([]);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch life map'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const update = useCallback(
    async (updates: Partial<LifeMapScores>, createNewSnapshot = false) => {
      if (!user) throw new Error('User not authenticated');

      const previous = current;
      const today = new Date().toISOString().split('T')[0];

      // Optimistic update
      setCurrent((prev) => ({ ...prev, ...updates }));

      try {
        const supabase = createClient();

        // Check if we should update existing or create new
        const shouldCreateNew = createNewSnapshot || !current.id || current.snapshotDate !== today;

        if (shouldCreateNew) {
          // Create new snapshot
          const merged = { ...current, ...updates };
          const { data: inserted, error: insertError } = await supabase
            .from('life_map')
            .insert(appToDbLifeMap(merged, user.id, today))
            .select()
            .single();

          if (insertError) throw insertError;

          const newEntry = dbToAppLifeMap(inserted);
          setCurrent(newEntry);
          setHistory((prev) => [newEntry, ...prev.filter((h) => h.id !== inserted.id)]);
        } else {
          // Update existing
          const dbUpdates: Database['public']['Tables']['life_map']['Update'] = {
            ...(updates.career !== undefined && { career_score: updates.career }),
            ...(updates.careerTrend !== undefined && { career_trend: updates.careerTrend }),
            ...(updates.careerNote !== undefined && { career_note: updates.careerNote }),
            ...(updates.relationships !== undefined && { relationships_score: updates.relationships }),
            ...(updates.relationshipsTrend !== undefined && { relationships_trend: updates.relationshipsTrend }),
            ...(updates.relationshipsNote !== undefined && { relationships_note: updates.relationshipsNote }),
            ...(updates.health !== undefined && { health_score: updates.health }),
            ...(updates.healthTrend !== undefined && { health_trend: updates.healthTrend }),
            ...(updates.healthNote !== undefined && { health_note: updates.healthNote }),
            ...(updates.finances !== undefined && { finances_score: updates.finances }),
            ...(updates.financesTrend !== undefined && { finances_trend: updates.financesTrend }),
            ...(updates.financesNote !== undefined && { finances_note: updates.financesNote }),
            ...(updates.meaning !== undefined && { meaning_score: updates.meaning }),
            ...(updates.meaningTrend !== undefined && { meaning_trend: updates.meaningTrend }),
            ...(updates.meaningNote !== undefined && { meaning_note: updates.meaningNote }),
            ...(updates.fun !== undefined && { fun_score: updates.fun }),
            ...(updates.funTrend !== undefined && { fun_trend: updates.funTrend }),
            ...(updates.funNote !== undefined && { fun_note: updates.funNote }),
            updated_at: new Date().toISOString(),
          };

          const { error: updateError } = await supabase
            .from('life_map')
            .update(dbUpdates)
            .eq('id', current.id!)
            .eq('user_id', user.id);

          if (updateError) throw updateError;

          // Update history as well
          setHistory((prev) =>
            prev.map((h) => (h.id === current.id ? { ...h, ...updates } : h))
          );
        }
      } catch (err) {
        setCurrent(previous);
        throw err;
      }
    },
    [user, current]
  );

  return { current, history, loading, error, update };
}

// ============================================================================
// useMemory hook
// ============================================================================

export function useMemory() {
  const { user } = useUser();
  const [data, setData] = useState<Memory>(defaultMemory());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [recordId, setRecordId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) {
      setData(defaultMemory());
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const supabase = createClient();
      const { data: row, error: fetchError } = await supabase
        .from('memory')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (row) {
        setData(dbToAppMemory(row));
        setRecordId(row.id);
      } else {
        setData(defaultMemory());
        setRecordId(null);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch memory'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const update = useCallback(
    async (updates: Partial<Memory>) => {
      if (!user) throw new Error('User not authenticated');

      const previous = data;
      setData((prev) => ({ ...prev, ...updates, updatedAt: new Date().toISOString() }));

      try {
        const supabase = createClient();

        if (recordId) {
          const dbUpdates: Database['public']['Tables']['memory']['Update'] = {
            ...(updates.executiveSummary !== undefined && { executive_summary: updates.executiveSummary }),
            ...(updates.strengths !== undefined && { strengths: updates.strengths }),
            ...(updates.growthEdges !== undefined && { growth_edges: updates.growthEdges }),
            ...(updates.energizedBy !== undefined && { energized_by: updates.energizedBy }),
            ...(updates.drainedBy !== undefined && { drained_by: updates.drainedBy }),
            ...(updates.optimalConditions !== undefined && { optimal_conditions: updates.optimalConditions }),
            ...(updates.overIndexes !== undefined && { over_indexes: updates.overIndexes }),
            ...(updates.underWeights !== undefined && { under_weights: updates.underWeights }),
            ...(updates.blindSpots !== undefined && { blind_spots: updates.blindSpots }),
            ...(updates.goalArchaeology !== undefined && { goal_archaeology: updates.goalArchaeology as unknown as Database['public']['Tables']['memory']['Update']['goal_archaeology'] }),
            ...(updates.insightsByYear !== undefined && { insights_by_year: updates.insightsByYear as unknown as Database['public']['Tables']['memory']['Update']['insights_by_year'] }),
            ...(updates.lessonsWork !== undefined && { lessons_work: updates.lessonsWork }),
            ...(updates.lessonsRelationships !== undefined && { lessons_relationships: updates.lessonsRelationships }),
            ...(updates.lessonsSelf !== undefined && { lessons_self: updates.lessonsSelf }),
            ...(updates.lessonsLife !== undefined && { lessons_life: updates.lessonsLife }),
            ...(updates.quotesFromPastSelf !== undefined && { quotes_from_past_self: updates.quotesFromPastSelf as unknown as Database['public']['Tables']['memory']['Update']['quotes_from_past_self'] }),
            ...(updates.warningsToFutureSelf !== undefined && { warnings_to_future_self: updates.warningsToFutureSelf }),
            ...(updates.rawNotes !== undefined && { raw_notes: updates.rawNotes }),
            updated_at: new Date().toISOString(),
          };

          const { error: updateError } = await supabase
            .from('memory')
            .update(dbUpdates)
            .eq('id', recordId)
            .eq('user_id', user.id);

          if (updateError) throw updateError;
        } else {
          const merged = { ...data, ...updates };
          const { data: inserted, error: insertError } = await supabase
            .from('memory')
            .insert(appToDbMemory(merged, user.id))
            .select()
            .single();

          if (insertError) throw insertError;
          setRecordId(inserted.id);
        }
      } catch (err) {
        setData(previous);
        throw err;
      }
    },
    [user, data, recordId]
  );

  return { data, loading, error, update };
}

// ============================================================================
// useInterviewResponses hook
// ============================================================================

export function useInterviewResponses() {
  const { user } = useUser();
  const [data, setData] = useState<InterviewResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const supabase = createClient();
      const { data: rows, error: fetchError } = await supabase
        .from('interview_responses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setData((rows ?? []).map(dbToAppInterviewResponse));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch interview responses'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const save = useCallback(
    async (response: Omit<InterviewResponse, 'id' | 'createdAt'>) => {
      if (!user) throw new Error('User not authenticated');

      const tempId = crypto.randomUUID();
      const now = new Date().toISOString();
      const optimisticResponse: InterviewResponse = {
        ...response,
        id: tempId,
        createdAt: now,
      };
      setData((prev) => [optimisticResponse, ...prev]);

      try {
        const supabase = createClient();
        const { data: inserted, error: insertError } = await supabase
          .from('interview_responses')
          .insert(appToDbInterviewResponse(response, user.id))
          .select()
          .single();

        if (insertError) throw insertError;

        setData((prev) =>
          prev.map((r) => (r.id === tempId ? dbToAppInterviewResponse(inserted) : r))
        );
        return dbToAppInterviewResponse(inserted);
      } catch (err) {
        setData((prev) => prev.filter((r) => r.id !== tempId));
        throw err;
      }
    },
    [user]
  );

  const getByType = useCallback(
    (type: InterviewResponse['interviewType']) => data.filter((r) => r.interviewType === type),
    [data]
  );

  return { data, loading, error, save, getByType };
}

// ============================================================================
// useStats hook
// ============================================================================

export function useStats() {
  const { data: checkIns, loading } = useDailyCheckIns();

  const getStreak = useCallback(() => {
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
        // Allow missing today but break on any other gap
        break;
      }
    }

    return streak;
  }, [checkIns]);

  const getAverageEnergy = useCallback(
    (days: number) => {
      const recent = checkIns.slice(0, days);
      if (recent.length === 0) return 0;

      const total = recent.reduce((sum, c) => {
        return sum + (c.energyPhysical + c.energyMental + c.energyEmotional) / 3;
      }, 0);

      return Math.round((total / recent.length) * 10) / 10;
    },
    [checkIns]
  );

  return { getStreak, getAverageEnergy, loading };
}

// ============================================================================
// Export types for consumers
// ============================================================================

export type { AnnualReview };
