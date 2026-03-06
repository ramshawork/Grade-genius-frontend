'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import CandidateNav from '@/components/candidate-nav';
import { dummyExams, dummyHalls, dummyUsers } from '@/lib/dummy-data';
import { FileText, LogOut, Plus, MoreVertical, FolderOpen, Users, AlertCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

export default function CandidatePortal() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [joinedHalls, setJoinedHalls] = useState<string[]>([]);
  const [hallCodeInput, setHallCodeInput] = useState('');
  const [joinError, setJoinError] = useState('');
  const [showJoinDialog, setShowJoinDialog] = useState(false);

  useEffect(() => {
    const email = sessionStorage.getItem('userEmail');
    const role = sessionStorage.getItem('userRole');
    // Changed to localStorage for persistence
    const storedHalls = localStorage.getItem('joinedHalls');

    // Only redirect if explicitly not a candidate (allow direct access for dev/demo if role missing or handling logic elsewhere)
    if (role && role !== 'candidate') {
      window.location.href = '/';
    }

    setUserEmail(email || dummyUsers.candidate1.email);

    if (storedHalls) {
      try {
        const halls = JSON.parse(storedHalls);
        setJoinedHalls(halls);
      } catch (e) {
        console.error("Failed to parse joined halls", e);
      }
    }

    // Exam Auto-Resume Logic
    const activeExam = localStorage.getItem('activeExam');
    if (activeExam) {
      try {
        const examState = JSON.parse(activeExam);
        if (examState.status === 'in_progress' && examState.hallId) {
          router.push(`/candidate-portal/halls/${examState.hallId}?exam=${examState.examId}`);
        }
      } catch (e) {
        console.error("Failed to parse active exam", e);
      }
    }
  }, [router]);

  const candidate = dummyUsers.candidate1; // In a real app, find user by ID/Email

  const handleJoinHall = () => {
    setJoinError('');

    const hallCode = hallCodeInput.trim().toUpperCase();
    const hall = dummyHalls.find(h => h.hallCode === hallCode);

    if (!hall) {
      setJoinError('Invalid hall code. Please check and try again.');
      return;
    }

    // Add candidate to hall if not already there (mock logic)
    if (!hall.candidates.includes(candidate.id)) {
      hall.candidates.push(candidate.id);
      hall.occupied = hall.candidates.length;
    }

    // Add hall to joined halls list if not already there
    if (!joinedHalls.includes(hall.id)) {
      const updatedHalls = [...joinedHalls, hall.id];
      setJoinedHalls(updatedHalls);
      // Save to localStorage
      localStorage.setItem('joinedHalls', JSON.stringify(updatedHalls));
    }

    setShowJoinDialog(false);
    setHallCodeInput('');
    // Stay on dashboard to see the new card
  };

  const handleLeaveHall = (hallId: string) => {
    // In a real app, API call here
    // Remove from joined halls local state
    const updatedHalls = joinedHalls.filter(id => id !== hallId);
    setJoinedHalls(updatedHalls);
    localStorage.setItem('joinedHalls', JSON.stringify(updatedHalls));
  };

  // Gradients for cards to make them look "Premium" and distinctive
  const gradients = [
    'from-blue-600 to-blue-400',
    'from-emerald-600 to-emerald-400',
    'from-violet-600 to-violet-400',
    'from-amber-600 to-amber-400',
    'from-rose-600 to-rose-400',
    'from-cyan-600 to-cyan-400',
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <CandidateNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              {joinedHalls.length > 0
                ? `You are enrolled in ${joinedHalls.length} active classroom${joinedHalls.length === 1 ? '' : 's'}.`
                : "You haven't joined any classrooms yet."}
            </p>
          </div>
          <Button
            onClick={() => setShowJoinDialog(true)}
            size="lg"
            className="shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            Join Class
          </Button>
        </div>

        {joinedHalls.length === 0 ? (
          // EMPTY STATE
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed rounded-xl bg-white/50">
            <div className="bg-primary/10 p-6 rounded-full mb-6">
              <FolderOpen className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No classrooms found</h3>
            <p className="text-muted-foreground max-w-md mb-8">
              It looks like you haven't joined any exam halls yet. Enter a code from your instructor to get started.
            </p>
            <Button onClick={() => setShowJoinDialog(true)} variant="outline" className="border-primary/20 hover:bg-primary/5 text-primary">
              Enter Hall Code
            </Button>
          </div>
        ) : (
          // BENTO GRID / GOOGLE CLASSROOM STYLE
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {joinedHalls.map((hallId, index) => {
              const hall = dummyHalls.find(h => h.id === hallId);
              if (!hall) return null; // Should clean up invalid IDs from storage if this happens

              const gradient = gradients[index % gradients.length];
              const hallExamCount = dummyExams.filter(e => e.hallId === hallId).length;

              return (
                <Card
                  key={hallId}
                  className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl border-border/40 flex flex-col h-[280px] bg-white"
                >
                  {/* Colored Header */}
                  <div
                    className={`h-28 bg-gradient-to-r ${gradient} p-6 text-white relative cursor-pointer`}
                    onClick={() => router.push(`/candidate-portal/halls/${hallId}`)}
                  >
                    <div className="relative z-10 flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-bold hover:underline mb-1 line-clamp-1">
                          {hall.name}
                        </h2>
                        <p className="text-white/90 text-sm font-medium">
                          {hall.hallCode}
                        </p>
                      </div>
                      {/* Options Menu */}
                      <div onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 -mr-2 -mt-2 h-8 w-8 rounded-full">
                              <MoreVertical className="w-5 h-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleLeaveHall(hallId)}
                            >
                              <LogOut className="w-4 h-4 mr-2" />
                              Unenroll
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Decorative Pattern overlay */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                  </div>

                  {/* Avatar Overlap */}
                  <div className="px-6 relative h-0">
                    <Avatar className="h-16 w-16 absolute -top-8 right-6 border-4 border-white shadow-sm bg-muted">
                      <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                        {hall.name.substring(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 pt-10 flex-1 flex flex-col justify-between cursor-pointer"
                    onClick={() => router.push(`/candidate-portal/halls/${hallId}`)}>

                    <div className="space-y-4">
                      <p className="text-sm text-foreground/60 line-clamp-2">
                        {hall.description || "No description provided for this classroom."}
                      </p>
                    </div>

                    <div className="pt-4 mt-auto border-t flex items-center justify-end text-sm text-muted-foreground gap-4">
                      <div className="flex items-center gap-1.5 tooltip" title="Active Exams">
                        <FileText className="w-4 h-4" />
                        <span>{hallExamCount}</span>
                      </div>
                      <div className="flex items-center gap-1.5 tooltip" title="Members">
                        <Users className="w-4 h-4" />
                        <span>{hall.occupied}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Join class</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Ask your teacher for the class code, then enter it here.
              </p>
            </DialogHeader>

            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Input
                  id="hall-code-input"
                  placeholder="Class code (e.g., MAIN24)"
                  value={hallCodeInput}
                  onChange={(e) => {
                    setHallCodeInput(e.target.value.toUpperCase());
                    setJoinError('');
                  }}
                  className="text-lg py-6 font-mono tracking-widest uppercase placeholder:normal-case placeholder:tracking-normal"
                  onKeyDown={(e) => e.key === 'Enter' && handleJoinHall()}
                />
                {joinError && (
                  <p className="text-sm text-destructive flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {joinError}
                  </p>
                )}
              </div>

              <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
                <p className="font-medium mb-1">To sign in with a class code:</p>
                <ul className="list-disc list-inside space-y-1 ml-1 text-xs">
                  <li>Use an authorized account</li>
                  <li>Use a class code with 5-7 letters or numbers</li>
                  <li>No spaces or special symbols</li>
                </ul>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="ghost" onClick={() => setShowJoinDialog(false)}>Cancel</Button>
              <Button onClick={handleJoinHall} disabled={!hallCodeInput.trim()}>
                Join
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </main>
    </div>
  );
}
