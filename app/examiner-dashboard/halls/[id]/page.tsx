'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import ExaminerNav from '@/components/examiner-nav';
import { dummyHalls, dummyUsers, dummyAttempts, dummyExams, dummySections } from '@/lib/dummy-data';
import { ArrowLeft, Users, Trophy, TrendingUp, BarChart3, Plus, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface HallDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

const COLORS = ['#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95'];

export default function HallDetailsPage({ params }: HallDetailsPageProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const [hallId, setHallId] = useState<string | null>(null);
  const [exams, setExams] = useState(dummyExams);
  const [examToDelete, setExamToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    params.then(({ id }) => setHallId(id));
  }, [params]);

  if (!hallId) return <div>Loading...</div>;

  const hall = dummyHalls.find(h => h.id === hallId);

  if (!hall) {
    return (
      <div className="min-h-screen bg-background">
        <ExaminerNav />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-foreground/60">Hall not found</p>
          <Link href="/examiner-dashboard">
            <Button variant="outline" className="mt-4 bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  // Get hall candidates
  const hallCandidates = Object.values(dummyUsers)
    .filter(u => u.role === 'candidate' && hall.candidates.includes(u.id));

  // Get hall exams
  const hallExams = dummyExams.filter(e => e.hallId === hall.id);

  // Get hall attempts for analytics
  const hallAttempts = dummyAttempts.filter(a => a.hallId === hall.id);

  // Grade distribution data
  const gradeDistribution = [
    { range: '90-100', count: 2 },
    { range: '80-89', count: 3 },
    { range: '70-79', count: 5 },
    { range: '60-69', count: 4 },
    { range: '50-59', count: 1 },
  ];

  // Leaderboard - top 5 performers
  const leaderboard = hallAttempts
    .sort((a, b) => b.totalMarks - a.totalMarks)
    .slice(0, 5)
    .map((attempt, index) => ({
      rank: index + 1,
      candidateName: attempt.candidateName,
      marks: attempt.totalMarks,
      exam: hallExams.find(e => e.id === attempt.examId)?.title || 'Unknown',
    }));

  const handleCopyCode = () => {
    navigator.clipboard.writeText(hall.hallCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeleteExam = () => {
    if (!examToDelete) return;

    const updatedExams = exams.filter(e => e.id !== examToDelete);
    setExams(updatedExams);

    toast({
      title: 'Exam Deleted',
      description: 'The exam has been successfully removed from this hall.',
      variant: 'default',
    });

    setExamToDelete(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <ExaminerNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/examiner-dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{hall.name}</h1>
              <p className="text-foreground/60 mt-2">Hall Management & Analytics</p>
            </div>
            <Badge variant={hall.status === 'active' ? 'default' : 'secondary'}>
              {hall.status}
            </Badge>
          </div>
        </div>

        {/* Hall Code Banner */}
        <Card className="border-primary/30 bg-primary/5 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60 mb-1">Hall Code - Share with Candidates</p>
              <code className="font-mono font-bold text-2xl text-primary">{hall.hallCode}</code>
            </div>
            <Button
              onClick={handleCopyCode}
              variant="outline"
              className={copied ? 'border-green-500' : ''}
            >
              {copied ? '✓ Copied' : 'Copy Code'}
            </Button>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-border/50 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-foreground/60 text-sm font-medium">Capacity</p>
                <p className="text-3xl font-bold text-foreground mt-2">{hall.capacity}</p>
              </div>
              <Users className="w-8 h-8 text-primary/30" />
            </div>
          </Card>

          <Card className="border-border/50 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-foreground/60 text-sm font-medium">Occupied</p>
                <p className="text-3xl font-bold text-foreground mt-2">{hall.occupied}</p>
              </div>
              <Users className="w-8 h-8 text-secondary/30" />
            </div>
          </Card>

          <Card className="border-border/50 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-foreground/60 text-sm font-medium">Exams</p>
                <p className="text-3xl font-bold text-foreground mt-2">{hallExams.length}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-accent/30" />
            </div>
          </Card>

          <Card className="border-border/50 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-foreground/60 text-sm font-medium">Submissions</p>
                <p className="text-3xl font-bold text-foreground mt-2">{hallAttempts.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary/30" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="exams">Exams</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="border-border/50 p-6">
              <h3 className="text-lg font-bold text-foreground mb-6">Hall Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-foreground/60 mb-2">Hall Name</p>
                  <p className="font-medium text-foreground">{hall.name}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground/60 mb-2">Hall Code</p>
                  <code className="font-mono bg-muted px-3 py-1 rounded text-primary font-bold">{hall.hallCode}</code>
                </div>
                <div>
                  <p className="text-sm text-foreground/60 mb-2">Total Capacity</p>
                  <p className="font-medium text-foreground">{hall.capacity} candidates</p>
                </div>
                <div>
                  <p className="text-sm text-foreground/60 mb-2">Created Date</p>
                  <p className="font-medium text-foreground">{hall.createdAt.toLocaleDateString()}</p>
                </div>
              </div>
            </Card>

            <Card className="border-border/50 p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Recent Exams</h3>
              {hallExams.length > 0 ? (
                <div className="space-y-3">
                  {hallExams.map(exam => (
                    <div key={exam.id} className="flex items-center justify-between p-4 border border-border/30 rounded-lg hover:bg-primary/5 transition-colors">
                      <div>
                        <h4 className="font-medium text-foreground">{exam.title}</h4>
                        <p className="text-sm text-foreground/60">{exam.duration} min • {exam.totalMarks} marks</p>
                      </div>
                      <Badge variant={exam.status === 'active' ? 'default' : 'secondary'}>
                        {exam.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-foreground/60">No exams assigned yet</p>
              )}
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Grade Distribution */}
            <Card className="border-border/50 p-6">
              <h3 className="text-lg font-bold text-foreground mb-6">Grade Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={gradeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="range" stroke="var(--foreground)" />
                  <YAxis stroke="var(--foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      color: 'var(--foreground)'
                    }}
                  />
                  <Bar dataKey="count" fill="var(--primary)" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Performance Stats */}
            <Card className="border-border/50 p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Performance Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-foreground/60 mb-1">Average Score</p>
                  <p className="text-2xl font-bold text-primary">
                    {hallAttempts.length > 0
                      ? Math.round(hallAttempts.reduce((sum, a) => sum + a.totalMarks, 0) / hallAttempts.length)
                      : 0}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-foreground/60 mb-1">Highest Score</p>
                  <p className="text-2xl font-bold text-secondary">
                    {hallAttempts.length > 0
                      ? Math.max(...hallAttempts.map(a => a.totalMarks))
                      : 0}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-foreground/60 mb-1">Lowest Score</p>
                  <p className="text-2xl font-bold text-accent">
                    {hallAttempts.length > 0
                      ? Math.min(...hallAttempts.map(a => a.totalMarks))
                      : 0}
                  </p>
                </div>
              </div>
            </Card>

            {/* Leaderboard */}
            <Card className="border-border/50 p-6">
              <h3 className="text-lg font-bold text-foreground mb-6">Top Performers</h3>
              {leaderboard.length > 0 ? (
                <div className="space-y-2">
                  {leaderboard.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border/30 rounded-lg hover:bg-primary/5 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          {index === 0 && <Trophy className="w-5 h-5 text-primary" />}
                          {index > 0 && <span className="font-bold text-primary">#{entry.rank}</span>}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{entry.candidateName}</p>
                          <p className="text-xs text-foreground/60">{entry.exam}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-primary">{entry.marks}</p>
                        <p className="text-xs text-foreground/60">marks</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-foreground/60">No submissions yet</p>
              )}
            </Card>
          </TabsContent>

          {/* Exams Tab */}
          <TabsContent value="exams" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-foreground">Exams in {hall.name}</h3>
              <Button
                onClick={() => router.push(`/examiner-dashboard/create-exam?hallId=${hall.id}`)}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Exam
              </Button>
            </div>

            <Card className="border-border/50 p-6">
              {exams.filter(e => e.hallId === hall.id).length > 0 ? (
                <div className="space-y-4">
                  {exams.filter(e => e.hallId === hall.id).map(exam => (
                    <div key={exam.id} className="p-4 border border-border/30 rounded-lg hover:bg-primary/5 transition-colors">
                      <div className="flex items-start justify-between">
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => window.location.href = `/examiner-dashboard/exams/${exam.id}`}
                        >
                          <h4 className="font-bold text-foreground hover:underline">{exam.title}</h4>
                          <p className="text-sm text-foreground/60 mt-2">{exam.description}</p>
                          <div className="flex gap-4 mt-3 text-sm text-foreground/60">
                            <span>{exam.duration} minutes</span>
                            <span>{exam.totalMarks} marks</span>
                            <span>{exam.sections.length} sections</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={exam.status === 'active' ? 'default' : 'secondary'}>
                            {exam.status}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground/60">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/examiner-dashboard/create-exam?id=${exam.id}`)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Exam
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => setExamToDelete(exam.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Exam
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-foreground/60">No exams assigned to this hall yet</p>
              )}
            </Card>
          </TabsContent>

          {/* Candidates Tab */}
          <TabsContent value="candidates">
            <Card className="border-border/50 p-6">
              {hallCandidates.length > 0 ? (
                <div className="space-y-4">
                  {hallCandidates.map(candidate => (
                    <div key={candidate.id} className="p-4 border border-border/30 rounded-lg hover:bg-primary/5 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-foreground">{candidate.name}</h4>
                          <p className="text-sm text-foreground/60">{candidate.email}</p>
                          <p className="text-sm text-foreground/60 mt-1">Guardian: {(candidate as any).guardianName}</p>
                        </div>
                        <Badge variant="outline">Enrolled</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-foreground/60">No candidates enrolled yet</p>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Delete Exam Dialog */}
      <AlertDialog open={!!examToDelete} onOpenChange={(open) => !open && setExamToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this exam and remove it from your records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteExam} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Exam
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
