'use client';

import { useState } from 'react';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Target,
  Compass,
  Calculator,
  Map,
  Clock,
  Brain,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Framework {
  id: string;
  name: string;
  description: string;
  credit: string;
  icon: React.ReactNode;
  tags: string[];
  sections: {
    title: string;
    content: string;
    prompts?: string[];
  }[];
}

const FRAMEWORKS: Framework[] = [
  {
    id: 'gustin-annual',
    name: 'Gustin Annual Review',
    description: 'A comprehensive framework for reviewing your year and planning the next one. Used by CEOs and high performers.',
    credit: 'Sam Gustin',
    icon: <Target className="h-5 w-5" />,
    tags: ['Annual', 'Reflection', 'Planning'],
    sections: [
      {
        title: 'Part 1: The Year in Review',
        content: 'Start by looking back at the year that was. This isn\'t about judgment - it\'s about clarity.',
        prompts: [
          'What word would you use to describe this year?',
          'What was your biggest win?',
          'What was your biggest challenge?',
          'What did you learn?',
          'What would you do differently?',
        ],
      },
      {
        title: 'Part 2: Life Areas Audit',
        content: 'Rate yourself 1-10 in each of the six life areas. Be honest. The goal is awareness, not perfection.',
        prompts: [
          'Career/Work - How fulfilled are you professionally?',
          'Relationships - How connected do you feel?',
          'Health - How\'s your physical and mental state?',
          'Finances - How secure and aligned is your financial life?',
          'Meaning/Purpose - How clear is your why?',
          'Fun/Adventure - How much joy are you experiencing?',
        ],
      },
      {
        title: 'Part 3: Goal Archaeology',
        content: 'Look at goals you\'ve set in the past. Which ones keep appearing? Which ones have you abandoned?',
        prompts: [
          'What goals have you been setting for 3+ years?',
          'Which goals did you finally achieve this year?',
          'Which goals should you stop pursuing?',
          'What\'s a goal you\'re afraid to admit you want?',
        ],
      },
      {
        title: 'Part 4: Looking Forward',
        content: 'Now turn your attention to the year ahead. What matters most?',
        prompts: [
          'What is your theme for next year?',
          'What are your top 3 priorities?',
          'What will you stop doing?',
          'What is your one non-negotiable?',
          'If next year goes well, what will be true?',
        ],
      },
    ],
  },
  {
    id: 'vivid-vision',
    name: 'Vivid Vision',
    description: 'A detailed 3-year vision exercise that creates a clear picture of your future life.',
    credit: 'Cameron Herold',
    icon: <Compass className="h-5 w-5" />,
    tags: ['Vision', 'Long-term', '3 Year'],
    sections: [
      {
        title: 'The Concept',
        content: 'A Vivid Vision is a 3-4 page document that describes in vivid detail what your life looks like 3 years from now. Write in present tense as if you\'re already living it.',
        prompts: [
          'It\'s December 31, three years from now. Describe your typical day.',
          'Where do you live? Describe the space in detail.',
          'What do you do for work? How does it feel?',
          'Who are the key people in your life?',
          'What have you accomplished?',
        ],
      },
      {
        title: 'Life Categories',
        content: 'Go through each life area and describe it in detail. Be specific - use numbers, names, and concrete details.',
        prompts: [
          'Career: What\'s your role? Your impact? Your income?',
          'Relationships: Who do you spend time with? How do those relationships feel?',
          'Health: How do you feel in your body? What does your fitness routine look like?',
          'Finances: What\'s your net worth? Cash flow? How do you feel about money?',
          'Fun: What adventures have you had? What brings you joy?',
          'Meaning: What contribution are you making? What\'s your legacy?',
        ],
      },
      {
        title: 'Making It Real',
        content: 'After writing your vision, read it weekly. Let it guide your decisions. Share it with trusted people.',
        prompts: [
          'What in this vision excites you most?',
          'What feels scary but possible?',
          'What would you need to start doing now?',
          'Who needs to be on this journey with you?',
        ],
      },
    ],
  },
  {
    id: 'ideal-life-costing',
    name: 'Ideal Life Costing',
    description: 'Calculate the actual cost of your dream life. Often it\'s less than you think.',
    credit: 'Tim Ferriss / FIRE Movement',
    icon: <Calculator className="h-5 w-5" />,
    tags: ['Financial', 'Planning', 'Freedom'],
    sections: [
      {
        title: 'The Premise',
        content: 'Most people have never calculated what their ideal life actually costs. When you do the math, freedom becomes tangible.',
      },
      {
        title: 'Step 1: Dream Big',
        content: 'List everything you want in your ideal life. Don\'t filter yet.',
        prompts: [
          'Where do you live? (City, type of home)',
          'What do you drive? (Or how do you get around)',
          'What experiences do you want regularly? (Travel, dining, hobbies)',
          'What does your typical week look like?',
          'What services would make your life easier?',
        ],
      },
      {
        title: 'Step 2: Research & Price',
        content: 'Go item by item and find real prices. Be specific.',
        prompts: [
          'Housing: Monthly rent/mortgage for your ideal home',
          'Transportation: Car payment, insurance, gas/charging',
          'Food: Groceries, dining out, delivery',
          'Travel: How many trips? What kind? Per trip cost?',
          'Hobbies: Equipment, memberships, classes',
          'Services: Cleaning, maintenance, subscriptions',
          'Buffer: 20% for unexpected expenses',
        ],
      },
      {
        title: 'Step 3: Calculate Your Number',
        content: 'Add it all up. This is your monthly "ideal life" number. Multiply by 12 for annual. Multiply by 25 for your "freedom number" (the invested amount that could sustain this forever at 4% withdrawal).',
      },
      {
        title: 'The Insight',
        content: 'Most people discover their ideal life costs far less than they assumed. This clarity reduces anxiety and focuses your efforts.',
      },
    ],
  },
  {
    id: 'life-map',
    name: 'Life Map Framework',
    description: 'A holistic view of life across six interconnected areas. Balance isn\'t equal time - it\'s intentional allocation.',
    credit: 'Various sources / CEO OS',
    icon: <Map className="h-5 w-5" />,
    tags: ['Balance', 'Assessment', 'Weekly'],
    sections: [
      {
        title: 'The Six Areas',
        content: 'Human flourishing requires attention across six interconnected domains. Neglecting one eventually impacts others.',
        prompts: [
          'Career/Work: Your professional contribution and growth',
          'Relationships: Partner, family, friendships, community',
          'Health: Physical body, energy, longevity',
          'Finances: Money, security, freedom, wealth',
          'Meaning/Purpose: Why you\'re here, contribution, legacy',
          'Fun/Adventure: Play, novelty, experiences, joy',
        ],
      },
      {
        title: 'The Rating System',
        content: '1-10 scale for each area. 1 = Crisis/Emergency. 5 = Adequate but not growing. 10 = Couldn\'t be better.',
      },
      {
        title: 'The Trend',
        content: 'Direction matters more than current state. Is each area improving, stable, or declining?',
      },
      {
        title: 'Key Insights',
        content: 'A successful life is not one area at 100% - it\'s all areas at sustainable levels. Below 4 in any area creates drag on everything else. Above 8 in one area often means another is being neglected.',
        prompts: [
          'Which area is dragging everything else down?',
          'Which area, if improved, would positively impact multiple others?',
          'What trade-offs are you currently making?',
          'If you could only maintain three areas at a high level, which would they be?',
        ],
      },
    ],
  },
  {
    id: 'time-blocking',
    name: 'Time Blocking Protocol',
    description: 'Protect your time like the finite resource it is. Schedule your priorities, don\'t prioritize your schedule.',
    credit: 'Cal Newport / Various',
    icon: <Clock className="h-5 w-5" />,
    tags: ['Productivity', 'Daily', 'Focus'],
    sections: [
      {
        title: 'Core Principle',
        content: 'Every block of time on your calendar should be intentional. Unscheduled time gets filled with other people\'s priorities.',
      },
      {
        title: 'Block Types',
        content: 'Different types of work require different types of protection.',
        prompts: [
          'Deep Work Blocks: 2-4 hour uninterrupted sessions for your most important work',
          'Admin Blocks: Batch email, messages, small tasks',
          'Meeting Blocks: Contain meetings to specific windows',
          'Buffer Blocks: White space between activities',
          'Recovery Blocks: Rest, exercise, meals',
        ],
      },
      {
        title: 'Implementation',
        content: 'Start by blocking your non-negotiables first. Then add work. Then add meetings.',
        prompts: [
          'What are your 3-5 weekly non-negotiables?',
          'When do you do your best deep work?',
          'When are meetings least disruptive?',
          'Where is buffer time needed?',
        ],
      },
      {
        title: 'Protection Strategies',
        content: 'Blocks are only valuable if you protect them.',
        prompts: [
          'Turn off notifications during deep work',
          'Set auto-responses for focus time',
          'Book meeting rooms for deep work',
          'Tell colleagues your focus hours',
          'Review and adjust weekly',
        ],
      },
    ],
  },
  {
    id: 'energy-management',
    name: 'Energy Management',
    description: 'Manage energy, not just time. Understand your patterns and optimize for sustainable performance.',
    credit: 'Tony Schwartz / Jim Loehr',
    icon: <Brain className="h-5 w-5" />,
    tags: ['Energy', 'Health', 'Sustainability'],
    sections: [
      {
        title: 'The Four Energy Sources',
        content: 'Energy comes from four sources. All four must be managed.',
        prompts: [
          'Physical: Sleep, nutrition, exercise, recovery',
          'Emotional: Positive emotions, relationships, purpose',
          'Mental: Focus, creativity, learning, mental stimulation',
          'Spiritual: Values alignment, meaning, contribution',
        ],
      },
      {
        title: 'Energy Audit',
        content: 'Track your energy levels for a week. Notice patterns.',
        prompts: [
          'When are you at peak energy?',
          'When do you crash?',
          'What activities drain you?',
          'What activities energize you?',
          'How\'s your sleep quality?',
          'How does food affect your energy?',
        ],
      },
      {
        title: 'Strategic Recovery',
        content: 'High performance requires deliberate recovery. Stress without recovery leads to burnout.',
        prompts: [
          'Micro-recovery: 5-minute breaks every 90 minutes',
          'Daily recovery: Sleep, exercise, disconnection',
          'Weekly recovery: Full day off, different activities',
          'Quarterly recovery: Extended break or vacation',
          'Annual recovery: Sabbatical thinking',
        ],
      },
      {
        title: 'Energy Investment',
        content: 'Invest energy in activities that generate more energy (positive rituals) rather than activities that only consume energy.',
        prompts: [
          'What rituals energize you?',
          'What boundaries protect your energy?',
          'Who energizes you vs. drains you?',
          'What activities are energy neutral?',
        ],
      },
    ],
  },
];

export default function FrameworksPage() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BookOpen className="h-8 w-8" />
          Frameworks
        </h1>
        <p className="text-muted-foreground mt-1">
          Mental models and methodologies for living with intention.
        </p>
      </div>

      {/* Intro Card */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            These frameworks are tools, not rules. Take what serves you, leave what doesn&apos;t.
            The goal is clarity and action, not perfectionism. Click any framework to explore its details.
          </p>
        </CardContent>
      </Card>

      {/* Frameworks Grid */}
      <div className="space-y-4">
        {FRAMEWORKS.map((framework) => (
          <Card key={framework.id}>
            <CardHeader
              className="cursor-pointer"
              onClick={() => toggleExpanded(framework.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    {framework.icon}
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {framework.name}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {framework.description}
                    </CardDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">
                        Credit: {framework.credit}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <div className="flex gap-1">
                        {framework.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  {expanded[framework.id] ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </CardHeader>

            {expanded[framework.id] && (
              <CardContent className="space-y-6">
                <Separator />
                {framework.sections.map((section, index) => (
                  <div key={index} className="space-y-3">
                    <h3 className="font-semibold text-lg">{section.title}</h3>
                    <p className="text-muted-foreground">{section.content}</p>
                    {section.prompts && (
                      <ul className="space-y-2 ml-4">
                        {section.prompts.map((prompt, pIndex) => (
                          <li key={pIndex} className="text-sm flex items-start gap-2">
                            <span className="text-muted-foreground">•</span>
                            <span>{prompt}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {index < framework.sections.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Footer */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2">Want to go deeper?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            These frameworks are summaries. For full implementations, consider reading the original sources
            or working through the Interview exercises which guide you through structured self-reflection.
          </p>
          <Button variant="outline" asChild>
            <a href="/interviews">
              Explore Interviews
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
