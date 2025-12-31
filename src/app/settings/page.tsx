'use client';

import { useState, useRef } from 'react';
import {
  Settings as SettingsIcon,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Database,
  FileJson,
  RefreshCw,
  Info,
  Shield,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCEOStore } from '@/lib/store';

export default function SettingsPage() {
  const [exportSuccess, setExportSuccess] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [clearAllDialogOpen, setClearAllDialogOpen] = useState(false);
  const [clearType, setClearType] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const store = useCEOStore();

  // Get stats
  const stats = {
    dailyCheckIns: store.dailyCheckIns.length,
    weeklyReviews: store.weeklyReviews.length,
    quarterlyReviews: store.quarterlyReviews.length,
    interviewResponses: store.interviewResponses.length,
  };

  // Export all data
  const exportData = () => {
    try {
      // Get main store data
      const mainData = localStorage.getItem('ceo-os-storage');
      // Get annual reviews data
      const annualData = localStorage.getItem('ceo-os-annual-reviews');

      const exportObj = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        mainStore: mainData ? JSON.parse(mainData) : null,
        annualReviews: annualData ? JSON.parse(annualData) : null,
      };

      const blob = new Blob([JSON.stringify(exportObj, null, 2)], {
        type: 'application/json',
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ceo-os-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  // Import data
  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);

        // Validate structure
        if (!data.version || !data.exportedAt) {
          throw new Error('Invalid backup file format');
        }

        // Import main store data
        if (data.mainStore) {
          localStorage.setItem('ceo-os-storage', JSON.stringify(data.mainStore));
        }

        // Import annual reviews data
        if (data.annualReviews) {
          localStorage.setItem('ceo-os-annual-reviews', JSON.stringify(data.annualReviews));
        }

        setImportSuccess(true);
        setImportError(null);
        setTimeout(() => {
          setImportSuccess(false);
          // Reload to apply changes
          window.location.reload();
        }, 2000);
      } catch (error) {
        setImportError(error instanceof Error ? error.message : 'Failed to import data');
        setTimeout(() => setImportError(null), 5000);
      }
    };
    reader.readAsText(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Clear specific data type
  const clearData = (type: string) => {
    switch (type) {
      case 'daily':
        useCEOStore.setState({ dailyCheckIns: [] });
        break;
      case 'weekly':
        useCEOStore.setState({ weeklyReviews: [] });
        break;
      case 'quarterly':
        useCEOStore.setState({ quarterlyReviews: [] });
        break;
      case 'annual':
        localStorage.removeItem('ceo-os-annual-reviews');
        break;
      case 'interviews':
        useCEOStore.setState({ interviewResponses: [] });
        break;
    }
    setClearDialogOpen(false);
  };

  // Clear all data
  const clearAllData = () => {
    localStorage.removeItem('ceo-os-storage');
    localStorage.removeItem('ceo-os-annual-reviews');
    setClearAllDialogOpen(false);
    window.location.reload();
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <SettingsIcon className="h-8 w-8" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your data and preferences.
        </p>
      </div>

      {/* Data Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Overview
          </CardTitle>
          <CardDescription>
            Your CEO OS data stored locally in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold">{stats.dailyCheckIns}</p>
              <p className="text-sm text-muted-foreground">Daily Check-ins</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold">{stats.weeklyReviews}</p>
              <p className="text-sm text-muted-foreground">Weekly Reviews</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold">{stats.quarterlyReviews}</p>
              <p className="text-sm text-muted-foreground">Quarterly Reviews</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold">{stats.interviewResponses}</p>
              <p className="text-sm text-muted-foreground">Interview Sessions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export & Import */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileJson className="h-5 w-5" />
            Export & Import
          </CardTitle>
          <CardDescription>
            Backup your data or restore from a previous backup.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Export */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Data
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Download all your data as a JSON file.
              </p>
            </div>
            <Button onClick={exportData}>
              {exportSuccess ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Exported!
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </>
              )}
            </Button>
          </div>

          {/* Import */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Import Data
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Restore from a backup file. This will replace existing data.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
                id="import-file"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                {importSuccess ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    Imported!
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Import
                  </>
                )}
              </Button>
            </div>
          </div>

          {importError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {importError}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Data Privacy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Your data stays local.</strong>{' '}
                  All your reflections, goals, and insights are stored in your browser&apos;s
                  local storage. Nothing is sent to any server.
                </p>
                <p>
                  <strong className="text-foreground">Regular backups recommended.</strong>{' '}
                  Since data is stored locally, it can be lost if you clear your browser data.
                  Export regularly to keep a backup.
                </p>
                <p>
                  <strong className="text-foreground">Portable.</strong>{' '}
                  Use the export/import feature to move your data between devices or browsers.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>
            Clear specific data types or reset everything. These actions cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Clear specific types */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { type: 'daily', label: 'Daily Check-ins', count: stats.dailyCheckIns },
              { type: 'weekly', label: 'Weekly Reviews', count: stats.weeklyReviews },
              { type: 'quarterly', label: 'Quarterly Reviews', count: stats.quarterlyReviews },
              { type: 'interviews', label: 'Interview Sessions', count: stats.interviewResponses },
            ].map((item) => (
              <Dialog
                key={item.type}
                open={clearDialogOpen && clearType === item.type}
                onOpenChange={(open) => {
                  setClearDialogOpen(open);
                  if (open) setClearType(item.type);
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-between"
                    disabled={item.count === 0}
                  >
                    <span>{item.label}</span>
                    <span className="text-muted-foreground">({item.count})</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      Clear {item.label}?
                    </DialogTitle>
                    <DialogDescription>
                      This will permanently delete all {item.count} {item.label.toLowerCase()}.
                      This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setClearDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => clearData(item.type)}
                    >
                      Clear Data
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ))}
          </div>

          <Separator />

          {/* Clear Annual Reviews */}
          <Dialog
            open={clearDialogOpen && clearType === 'annual'}
            onOpenChange={(open) => {
              setClearDialogOpen(open);
              if (open) setClearType('annual');
            }}
          >
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>Annual Reviews</span>
                <span className="text-muted-foreground">(stored separately)</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Clear Annual Reviews?
                </DialogTitle>
                <DialogDescription>
                  This will permanently delete all annual reviews.
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setClearDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => clearData('annual')}
                >
                  Clear Data
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Separator />

          {/* Reset Everything */}
          <Dialog open={clearAllDialogOpen} onOpenChange={setClearAllDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset Everything
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Reset All Data?
                </DialogTitle>
                <DialogDescription className="space-y-2">
                  <p>
                    This will permanently delete ALL your data including:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>All daily check-ins</li>
                    <li>All weekly reviews</li>
                    <li>All quarterly reviews</li>
                    <li>All annual reviews</li>
                    <li>All interview responses</li>
                    <li>Your North Star</li>
                    <li>All goals (1, 3, and 10 year)</li>
                    <li>Your Memory/self-knowledge</li>
                    <li>Life Map scores</li>
                  </ul>
                  <p className="font-semibold text-destructive">
                    This action cannot be undone!
                  </p>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setClearAllDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={clearAllData}>
                  Yes, Reset Everything
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle>About CEO OS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              CEO OS is a personal operating system for life clarity and intentional living.
              It provides structured frameworks for daily reflection, goal setting, and
              long-term vision development.
            </p>
            <p>
              Built with the belief that a well-examined life is a well-lived life.
              Take time to reflect, plan with intention, and course-correct regularly.
            </p>
            <Separator />
            <p className="text-xs">
              Your journey, your data, your life. No accounts, no cloud, no tracking.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
