'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import ExaminerNav from '@/components/examiner-nav';
import { dummyHalls, dummyExams, dummyUsers, dummySections } from '@/lib/dummy-data';
import { Plus, Search, Copy, Eye, BarChart3, Users, ArrowLeft, TrendingUp, Trophy, CheckCircle2, MoreVertical, Trash2, Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ExaminerDashboard() {
  const router = useRouter();
  const [searchHall, setSearchHall] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [halls, setHalls] = useState(dummyHalls);
  const [showCreateHall, setShowCreateHall] = useState(false);
  const [newHallName, setNewHallName] = useState('');
  const [newHallCapacity, setNewHallCapacity] = useState('50');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedHall, setSelectedHall] = useState<string | null>(null);
  const [activeHallTab, setActiveHallTab] = useState('exams');
  const [hallToDelete, setHallToDelete] = useState<string | null>(null);
  const [examToDelete, setExamToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const [exams, setExams] = useState(dummyExams); // Declare the setExams variable

  const examiner = dummyUsers.examiner1;

  useEffect(() => {
    const email = sessionStorage.getItem('userEmail');
    const role = sessionStorage.getItem('userRole');
    if (role !== 'examiner') {
      window.location.href = '/';
    }
    setUserEmail(email || dummyUsers.examiner1.email);
  }, []);

  // Hall creation handler
  const handleCreateHall = () => {
    if (!newHallName.trim()) return;

    const hallCode = newHallName.substring(0, 4).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
    const newHall = {
      id: `hall-${Date.now()}`,
      name: newHallName,
      code: hallCode,
      hallCode: hallCode,
      capacity: parseInt(newHallCapacity),
      occupied: 0,
      examinerId: examiner.id,
      candidates: [],
      createdAt: new Date(),
      status: 'active',
    };

    setHalls([...halls, newHall]);
    setNewHallName('');
    setNewHallCapacity('50');
    setShowCreateHall(false);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDeleteHall = () => {
    if (!hallToDelete) return;

    // Remove hall
    const updatedHalls = halls.filter(h => h.id !== hallToDelete);
    setHalls(updatedHalls);

    // Remove associated exams
    const updatedExams = exams.filter(e => e.hallId !== hallToDelete);
    setExams(updatedExams);

    // If the currently selected hall was deleted, deselect it
    if (selectedHall === hallToDelete) {
      setSelectedHall(null);
    }

    toast({
      title: 'Hall Deleted',
      description: 'The examination hall and all associated exams have been removed.',
      variant: 'destructive',
    });

    setHallToDelete(null);
  };

  const handleDeleteExam = () => {
    if (!examToDelete) return;

    const updatedExams = exams.filter(e => e.id !== examToDelete);
    setExams(updatedExams);

    toast({
      title: 'Exam Deleted',
      description: 'The exam has been successfully removed.',
      variant: 'default',
    });

    setExamToDelete(null);
  };

  const activeExams = exams.filter(e => e.status === 'active').length;
  const totalCandidates = halls.reduce((sum, h) => sum + h.candidates.length, 0);
  const totalHalls = halls.length;

  const filteredHalls = halls.filter(hall =>
    hall.name.toLowerCase().includes(searchHall.toLowerCase()) ||
    hall.hallCode.toLowerCase().includes(searchHall.toLowerCase())
  );

  const hallExams = selectedHall
    ? exams.filter(e => e.hallId === selectedHall)
    : [];

  const currentHallData = selectedHall ? halls.find(h => h.id === selectedHall) : null;

  // If a hall is selected, show hall details view
  if (selectedHall && currentHallData) {
    return (
      <div className="min-h-screen bg-background">
        <ExaminerNav />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header with back button */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedHall(null);
                  setActiveHallTab('exams');
                }}
                className="bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Halls
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{currentHallData.name}</h1>
                <p className="text-foreground/60 mt-2">Code: <code className="font-mono font-bold text-primary">{currentHallData.hallCode}</code></p>
              </div>
            </div>
          </div>

          {/* Tabs for Hall Details */}
          <Tabs value={activeHallTab} onValueChange={setActiveHallTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="exams">Exams</TabsTrigger>
              <TabsTrigger value="candidates">Candidates</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Exams Tab */}
            <TabsContent value="exams" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-foreground">Exams</h3>
                <Button
                  onClick={() => router.push(`/examiner-dashboard/create-exam?hallId=${selectedHall}`)}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Exam
                </Button>
              </div>

              <div className="space-y-3">
                {hallExams.length > 0 ? (
                  hallExams.map(exam => (
                    <Card key={exam.id} className="border-border/50 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-foreground">{exam.title}</h4>
                          <p className="text-sm text-foreground/60 mt-1">{exam.description}</p>
                          <div className="flex gap-4 mt-2 text-xs text-foreground/60">
                            <span>{exam.duration} min</span>
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
                    </Card>
                  ))
                ) : (
                  <p className="text-foreground/60 text-center py-8">No exams created yet</p>
                )}
              </div>
            </TabsContent>

            {/* Candidates Tab */}
            <TabsContent value="candidates">
              <Card className="border-border/50 p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Enrolled Candidates</h3>
                <div className="space-y-2">
                  {currentHallData.candidates.length > 0 ? (
                    currentHallData.candidates.map(candidateId => {
                      const candidate = Object.values(dummyUsers).find(u => u.id === candidateId);
                      return candidate ? (
                        <div key={candidateId} className="p-3 border border-border/30 rounded-lg">
                          <p className="font-medium text-foreground">{candidate.name}</p>
                          <p className="text-sm text-foreground/60">{candidate.email}</p>
                        </div>
                      ) : null;
                    })
                  ) : (
                    <p className="text-foreground/60">No candidates joined yet</p>
                  )}
                </div>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="border-border/50 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-foreground/60 text-sm">Enrolled</p>
                      <p className="text-3xl font-bold text-foreground mt-2">{currentHallData.occupied}</p>
                    </div>
                    <Users className="w-8 h-8 text-primary/30" />
                  </div>
                </Card>

                <Card className="border-border/50 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-foreground/60 text-sm">Total Exams</p>
                      <p className="text-3xl font-bold text-foreground mt-2">{hallExams.length}</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-secondary/30" />
                  </div>
                </Card>

                <Card className="border-border/50 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-foreground/60 text-sm">Capacity</p>
                      <p className="text-3xl font-bold text-foreground mt-2">{currentHallData.capacity}</p>
                    </div>
                    <Trophy className="w-8 h-8 text-accent/30" />
                  </div>
                </Card>
              </div>

              <Card className="border-border/50 p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Grade Distribution</h3>
                <p className="text-foreground/60">Analytics will show when candidates complete exams</p>
              </Card>
            </TabsContent>
          </Tabs>
        </main>

        {/* Hall Details View Delete Exam Dialog */}
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

  return (
    <div className="min-h-screen bg-background">
      <ExaminerNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Examiner Dashboard</h1>
            <p className="text-foreground/60 mt-2">Manage your examination halls and exams</p>
          </div>
          <Dialog open={showCreateHall} onOpenChange={setShowCreateHall}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Create Hall
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Examination Hall</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="hall-name">Hall Name</Label>
                  <Input
                    id="hall-name"
                    placeholder="e.g., Main Auditorium, Lab A"
                    value={newHallName}
                    onChange={(e) => setNewHallName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="hall-capacity">Capacity</Label>
                  <Input
                    id="hall-capacity"
                    type="number"
                    min="1"
                    max="500"
                    value={newHallCapacity}
                    onChange={(e) => setNewHallCapacity(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleCreateHall}
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={!newHallName.trim()}
                >
                  Create Hall
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-border/50 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-foreground/60 text-sm font-medium">Total Halls</p>
                <p className="text-3xl font-bold text-foreground mt-2">{totalHalls}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-primary/30" />
            </div>
          </Card>

          <Card className="border-border/50 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-foreground/60 text-sm font-medium">Active Exams</p>
                <p className="text-3xl font-bold text-foreground mt-2">{activeExams}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-secondary/30" />
            </div>
          </Card>

          <Card className="border-border/50 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-foreground/60 text-sm font-medium">Total Candidates</p>
                <p className="text-3xl font-bold text-foreground mt-2">{totalCandidates}</p>
              </div>
              <Users className="w-8 h-8 text-accent/30" />
            </div>
          </Card>
        </div>

        {/* Halls Section */}
        <Card className="border-border/50 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Examination Halls</h2>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-foreground/40" />
              <Input
                placeholder="Search halls by name or code..."
                value={searchHall}
                onChange={(e) => setSearchHall(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHalls.map((hall) => (
              <Card key={hall.id} className="border-border/50 hover:border-primary/50 transition-colors">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-foreground">{hall.name}</h3>
                      <p className="text-sm text-foreground/60 mt-1">
                        {hall.occupied} of {hall.capacity} candidates
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={hall.status === 'active' ? 'default' : 'secondary'}>
                        {hall.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-foreground/60">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedHall(hall.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Manage Hall
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setHallToDelete(hall.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Hall
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Hall Code Display */}
                  <div className="bg-muted rounded-lg p-4 mb-4">
                    <p className="text-xs text-foreground/60 mb-1">Hall Code</p>
                    <div className="flex items-center justify-between">
                      <code className="font-mono font-bold text-primary text-lg">{hall.hallCode}</code>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyCode(hall.hallCode);
                        }}
                        className="p-2 hover:bg-primary/10 rounded transition-colors"
                        title="Copy hall code"
                      >
                        <Copy className={`w-4 h-4 ${copiedCode === hall.hallCode ? 'text-green-500' : 'text-foreground/60'}`} />
                      </button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-xs text-foreground/60 mb-4">
                    <p>Created: {hall.createdAt.toLocaleDateString()}</p>
                    <p>{hallExams.length} exam{hallExams.length !== 1 ? 's' : ''} assigned</p>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => setSelectedHall(hall.id)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Manage
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {filteredHalls.length === 0 && (
            <div className="text-center py-12">
              <p className="text-foreground/60">No halls found. Create one to get started!</p>
            </div>
          )}
        </Card>
      </main>

      {/* Delete Hall Dialog */}
      <AlertDialog open={!!hallToDelete} onOpenChange={(open) => !open && setHallToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Deleting this hall will permanently remove it and <strong>all exams associated with it</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteHall} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Hall
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
