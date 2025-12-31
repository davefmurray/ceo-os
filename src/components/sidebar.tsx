'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Sun,
  CalendarDays,
  CalendarRange,
  Calendar,
  Target,
  Compass,
  BookOpen,
  Brain,
  MessageSquare,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Daily Check-in', href: '/daily', icon: Sun },
  { name: 'Weekly Review', href: '/weekly', icon: CalendarDays },
  { name: 'Quarterly Review', href: '/quarterly', icon: CalendarRange },
  { name: 'Annual Review', href: '/annual', icon: Calendar },
  { type: 'divider' },
  { name: 'Goals', href: '/goals', icon: Target },
  { name: 'North Star', href: '/north-star', icon: Compass },
  { name: 'Life Map', href: '/life-map', icon: BookOpen },
  { type: 'divider' },
  { name: 'Frameworks', href: '/frameworks', icon: BookOpen },
  { name: 'Interviews', href: '/interviews', icon: MessageSquare },
  { name: 'Memory', href: '/memory', icon: Brain },
  { type: 'divider' },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b">
        <h1 className="text-xl font-semibold tracking-tight">CEO OS</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navigation.map((item, index) => {
          if (item.type === 'divider') {
            return <div key={index} className="my-3 border-t" />;
          }

          const Icon = item.icon!;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href!}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <p className="text-xs text-muted-foreground text-center">
          Clarity over productivity
        </p>
      </div>
    </div>
  );
}
