'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  MessageSquare,
  Clock,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Check,
  History,
  Play,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCEOStore } from '@/lib/store';
import type { InterviewResponse } from '@/lib/types';

interface InterviewQuestion {
  id: string;
  question: string;
  hint?: string;
}

interface Interview {
  id: 'past-year' | 'identity-values' | 'future-self';
  title: string;
  description: string;
  duration: string;
  questions: InterviewQuestion[];
}

const INTERVIEWS: Interview[] = [
  {
    id: 'past-year',
    title: 'Past Year Reflection',
    description: 'A guided conversation with your recent past. What happened? What did you learn?',
    duration: '30-45 min',
    questions: [
      {
        id: 'year-word',
        question: 'If you had to describe the past year in one word, what would it be?',
        hint: 'Don\'t overthink it. What\'s the first word that comes to mind?',
      },
      {
        id: 'biggest-shift',
        question: 'What was the biggest shift in your life this year?',
        hint: 'This could be external (job, relationship, location) or internal (perspective, belief, priority).',
      },
      {
        id: 'proudest-moment',
        question: 'What moment from this year are you most proud of?',
        hint: 'Think about both achievements and character moments.',
      },
      {
        id: 'hardest-moment',
        question: 'What was your hardest moment?',
        hint: 'What challenged you most? What kept you up at night?',
      },
      {
        id: 'lesson-learned',
        question: 'What\'s one lesson you learned that you\'ll carry forward?',
        hint: 'Something you know now that you didn\'t know a year ago.',
      },
      {
        id: 'relationship-change',
        question: 'How did your relationships change this year?',
        hint: 'Who became more important? Who did you drift from? Why?',
      },
      {
        id: 'health-check',
        question: 'How did your relationship with your body/health change?',
        hint: 'Energy, fitness, habits, relationship with aging.',
      },
      {
        id: 'money-story',
        question: 'What\'s your money story from this year?',
        hint: 'Not just numbers - your relationship with money, fears, growth.',
      },
      {
        id: 'work-reflection',
        question: 'What did you learn about your work/career this year?',
        hint: 'About your strengths, interests, what energizes vs. drains you.',
      },
      {
        id: 'avoided',
        question: 'What did you avoid dealing with this year?',
        hint: 'The hard conversation, the decision, the change you know needs to happen.',
      },
      {
        id: 'surprised',
        question: 'What surprised you about yourself this year?',
        hint: 'Something you didn\'t expect to feel, think, or do.',
      },
      {
        id: 'thank-past-self',
        question: 'What would you thank your past self for?',
        hint: 'A decision, a habit, a risk, a boundary.',
      },
    ],
  },
  {
    id: 'identity-values',
    title: 'Identity & Values',
    description: 'Who are you? What do you stand for? A deep dive into your core.',
    duration: '45-60 min',
    questions: [
      {
        id: 'describe-self',
        question: 'How would you describe yourself to someone who doesn\'t know you?',
        hint: 'Not your job title. Who are you?',
      },
      {
        id: 'core-values',
        question: 'What are your top 5 values? Why these?',
        hint: 'Values are what you\'d fight for. What you can\'t compromise on.',
      },
      {
        id: 'values-conflict',
        question: 'When have your values been in conflict with each other?',
        hint: 'Freedom vs. security. Achievement vs. relationships. Growth vs. comfort.',
      },
      {
        id: 'principles',
        question: 'What principles guide your decisions?',
        hint: 'If/then statements. "When X happens, I do Y."',
      },
      {
        id: 'strengths',
        question: 'What are you genuinely good at?',
        hint: 'Things that come naturally. What people ask you for.',
      },
      {
        id: 'weaknesses',
        question: 'What are your genuine weaknesses?',
        hint: 'Not "I work too hard." Real patterns that hold you back.',
      },
      {
        id: 'blind-spots',
        question: 'What are your blind spots?',
        hint: 'What do others see that you don\'t? What feedback keeps recurring?',
      },
      {
        id: 'triggers',
        question: 'What triggers you emotionally? Why?',
        hint: 'Anger, fear, sadness. What situations bring these out?',
      },
      {
        id: 'energy-sources',
        question: 'What gives you energy? What drains it?',
        hint: 'People, activities, environments, topics.',
      },
      {
        id: 'non-negotiables',
        question: 'What are your non-negotiables in life?',
        hint: 'Things you\'ll protect regardless of circumstances.',
      },
      {
        id: 'change-world',
        question: 'If you could change one thing about the world, what would it be?',
        hint: 'This often reveals your deepest values.',
      },
      {
        id: 'legacy',
        question: 'How do you want to be remembered?',
        hint: 'Not what you achieved. How you made people feel. What you stood for.',
      },
    ],
  },
  {
    id: 'future-self',
    title: 'Future Self Interview',
    description: 'A conversation with who you\'re becoming. Where are you going?',
    duration: '30-45 min',
    questions: [
      {
        id: 'three-years',
        question: 'It\'s three years from now. Describe your typical day.',
        hint: 'Morning to night. Where are you? What are you doing? With whom?',
      },
      {
        id: 'biggest-change',
        question: 'What\'s the biggest change between now and then?',
        hint: 'The one thing that made the most difference.',
      },
      {
        id: 'fears-overcome',
        question: 'What fears did you overcome to get there?',
        hint: 'What scared you that you had to face?',
      },
      {
        id: 'let-go',
        question: 'What did you have to let go of?',
        hint: 'Beliefs, relationships, habits, identities.',
      },
      {
        id: 'decisions',
        question: 'What were the 2-3 key decisions that got you there?',
        hint: 'The forks in the road. The big bets.',
      },
      {
        id: 'advice-present',
        question: 'What advice would your future self give you right now?',
        hint: 'Looking back with wisdom, what would you tell yourself?',
      },
      {
        id: 'warning',
        question: 'What would your future self warn you about?',
        hint: 'Pitfalls, traps, mistakes to avoid.',
      },
      {
        id: 'proud-of',
        question: 'What is your future self most proud of?',
        hint: 'Not achievements necessarily. Character, growth, impact.',
      },
      {
        id: 'relationships-future',
        question: 'Who are the key people in your future life?',
        hint: 'Who\'s still there? Who\'s new? Who\'s gone?',
      },
      {
        id: 'contribution',
        question: 'What contribution are you making to the world?',
        hint: 'How are you helping? What\'s your impact?',
      },
      {
        id: 'feel-like',
        question: 'How does your future self feel most of the time?',
        hint: 'Emotions, state of being, general vibe.',
      },
      {
        id: 'first-step',
        question: 'What\'s the very first step you need to take toward this future?',
        hint: 'Not the whole plan. Just the next action.',
      },
    ],
  },
];

export default function InterviewsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeInterview, setActiveInterview] = useState<Interview | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedHistoryType, setSelectedHistoryType] = useState<Interview['id'] | null>(null);

  const { saveInterviewResponse, getInterviewResponses } = useCEOStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const startInterview = (interview: Interview) => {
    setActiveInterview(interview);
    setCurrentQuestionIndex(0);
    setResponses({});
  };

  const handleResponse = (questionId: string, value: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const nextQuestion = () => {
    if (activeInterview && currentQuestionIndex < activeInterview.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const finishInterview = () => {
    if (activeInterview) {
      saveInterviewResponse({
        interviewType: activeInterview.id,
        responses,
        completedAt: new Date().toISOString(),
      });
      setActiveInterview(null);
      setCurrentQuestionIndex(0);
      setResponses({});
    }
  };

  const viewHistory = (type: Interview['id']) => {
    setSelectedHistoryType(type);
    setHistoryDialogOpen(true);
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const historyResponses = selectedHistoryType ? getInterviewResponses(selectedHistoryType) : [];
  const selectedInterview = INTERVIEWS.find((i) => i.id === selectedHistoryType);

  // Active Interview View
  if (activeInterview) {
    const currentQuestion = activeInterview.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / activeInterview.questions.length) * 100;
    const isLastQuestion = currentQuestionIndex === activeInterview.questions.length - 1;
    const hasResponse = responses[currentQuestion.id]?.trim().length > 0;

    return (
      <div className="p-8 max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setActiveInterview(null)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Exit Interview
          </Button>
          <span className="text-sm text-muted-foreground">
            {currentQuestionIndex + 1} of {activeInterview.questions.length}
          </span>
        </div>

        {/* Progress */}
        <Progress value={progress} className="h-2" />

        {/* Interview Title */}
        <div className="text-center pb-4">
          <h2 className="text-xl font-semibold">{activeInterview.title}</h2>
        </div>

        {/* Question Card */}
        <Card className="min-h-[400px]">
          <CardHeader>
            <CardTitle className="text-2xl leading-relaxed">
              {currentQuestion.question}
            </CardTitle>
            {currentQuestion.hint && (
              <CardDescription className="text-base mt-2">
                {currentQuestion.hint}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Take your time. Write freely..."
              value={responses[currentQuestion.id] || ''}
              onChange={(e) => handleResponse(currentQuestion.id, e.target.value)}
              rows={8}
              className="text-lg"
              autoFocus
            />
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          {isLastQuestion ? (
            <Button onClick={finishInterview} disabled={!hasResponse}>
              <Check className="h-4 w-4 mr-2" />
              Finish Interview
            </Button>
          ) : (
            <Button onClick={nextQuestion}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Main Interview Selection View
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <MessageSquare className="h-8 w-8" />
          Interviews
        </h1>
        <p className="text-muted-foreground mt-1">
          Guided conversations with yourself. Take your time with these.
        </p>
      </div>

      {/* Intro Card */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            These interviews are designed to surface insights that stay hidden in daily life.
            Find a quiet space. Block 30-60 minutes. Answer honestly - no one else will see this.
          </p>
        </CardContent>
      </Card>

      {/* Interview Cards */}
      <div className="space-y-4">
        {INTERVIEWS.map((interview) => {
          const pastResponses = getInterviewResponses(interview.id);
          const hasCompleted = pastResponses.length > 0;

          return (
            <Card key={interview.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {interview.title}
                      {hasCompleted && (
                        <Badge variant="secondary" className="text-xs">
                          Completed {pastResponses.length}x
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {interview.description}
                    </CardDescription>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {interview.duration}
                      </span>
                      <span>{interview.questions.length} questions</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-2">
                  <Button onClick={() => startInterview(interview)}>
                    <Play className="h-4 w-4 mr-2" />
                    {hasCompleted ? 'Start Again' : 'Begin'}
                  </Button>
                  {hasCompleted && (
                    <Button variant="outline" onClick={() => viewHistory(interview.id)}>
                      <History className="h-4 w-4 mr-2" />
                      View Past Responses
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tips Card */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">Tips for Better Self-Interviews</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Find a quiet space where you won&apos;t be interrupted</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Write in stream of consciousness - don&apos;t edit as you go</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>If a question is hard, that&apos;s usually a sign it&apos;s important</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>You can always come back and do these again - you&apos;ll get different answers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Consider doing these at different times: morning, evening, different moods</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* History Dialog */}
      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedInterview?.title} - Past Responses</DialogTitle>
            <DialogDescription>
              Your previous answers to this interview
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {historyResponses.map((response) => (
              <Card key={response.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Completed {format(new Date(response.completedAt), 'MMMM d, yyyy \'at\' h:mm a')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedInterview?.questions.map((q) => (
                    <div key={q.id}>
                      <Label className="text-sm font-medium text-muted-foreground">
                        {q.question}
                      </Label>
                      <p className="mt-1 text-sm whitespace-pre-wrap">
                        {response.responses[q.id] || <em className="text-muted-foreground">No response</em>}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
            {historyResponses.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No completed interviews yet.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
