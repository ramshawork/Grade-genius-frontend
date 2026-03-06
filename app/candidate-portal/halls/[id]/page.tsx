'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import CandidateNav from '@/components/candidate-nav';
import ExamInterface from '@/components/exam-interface';
import { dummyExams, dummyHalls, dummyUsers } from '@/lib/dummy-data';
import { Clock, FileText, CheckCircle, AlertCircle, ChevronLeft, MoreVertical } from 'lucide-react';

export default function CandidateHallDetails() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { id } = useParams();

    const [activeTab, setActiveTab] = useState<'exams' | 'progress' | 'evaluated' | 'members'>('exams');
    const [selectedExamId, setSelectedExamId] = useState<string | null>(searchParams.get('exam'));
    const [isExamRendered, setIsExamRendered] = useState(false);

    // Sync state with URL manually (e.g. if back button hit)
    useEffect(() => {
        const examParam = searchParams.get('exam');
        if (examParam !== selectedExamId) {
            setSelectedExamId(examParam);
        }
    }, [searchParams, selectedExamId]);

    const hallId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : null;
    const detailHall = hallId ? dummyHalls.find((h) => h.id === hallId) : null;
    const candidate = dummyUsers.candidate1;

    if (!detailHall) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <h2 className="text-xl font-bold mb-4">Classroom not found</h2>
                <Button onClick={() => router.push('/candidate-portal')}>Return to Dashboard</Button>
            </div>
        );
    }

    // Hall-based access
    const hallExams = dummyExams.filter((e) => e.hallId === detailHall.id);
    const availableExams = hallExams.filter((e) => e.status === 'scheduled');
    const ongoingExams = hallExams.filter((e) => e.status === 'active');
    const completedExams = hallExams.filter((e) => e.status === 'completed');
    const hallMembers = detailHall.candidates || [];

    const handleStartExam = (examId: string) => {
        // Save state in LocalStorage so a refresh survives
        localStorage.setItem('activeExam', JSON.stringify({
            examId,
            hallId: detailHall.id,
            status: 'in_progress',
        }));

        // Push the UI state
        router.push(`/candidate-portal/halls/${detailHall.id}?exam=${examId}`);
    };

    const handleExitExam = () => {
        localStorage.removeItem('activeExam');
        router.push(`/candidate-portal/halls/${detailHall.id}`);
    };

    // If exam is strictly selected in URL, render the exam interface immediately
    if (selectedExamId) {
        const examObj = hallExams.find(e => e.id === selectedExamId);
        if (examObj) {
            return (
                <ExamInterface
                    exam={examObj}
                    candidate={candidate}
                    onExit={handleExitExam}
                />
            );
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <CandidateNav />

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="min-h-screen flex flex-col">
                <div className="border-b bg-card">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push('/candidate-portal')}
                                className="-ml-2 text-muted-foreground hover:text-foreground"
                            >
                                <ChevronLeft className="w-5 h-5 mr-1" />
                                Halls
                            </Button>
                            <div className="h-6 w-px bg-border/50 mx-2"></div>
                            <h2 className="font-semibold text-lg">{detailHall.name}</h2>
                        </div>

                        <div className="h-full hidden md:block">
                            <TabsList className="h-full bg-transparent border-0 rounded-none p-0 gap-6">
                                <TabsTrigger
                                    value="exams"
                                    className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2"
                                >
                                    Stream
                                </TabsTrigger>
                                <TabsTrigger
                                    value="progress"
                                    className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2"
                                >
                                    Classwork
                                </TabsTrigger>
                                <TabsTrigger
                                    value="members"
                                    className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2"
                                >
                                    People
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="w-20 flex justify-end">
                            <Button variant="ghost" size="icon" title="Hall Info">
                                <AlertCircle className="w-5 h-5 text-muted-foreground" />
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Tabs List */}
                    <div className="md:hidden w-full h-12 overflow-x-auto border-t">
                        <TabsList className="h-full w-full justify-start bg-transparent border-0 rounded-none p-0 px-2 gap-4">
                            <TabsTrigger
                                value="exams"
                                className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 text-sm"
                            >
                                Stream
                            </TabsTrigger>
                            <TabsTrigger
                                value="progress"
                                className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 text-sm"
                            >
                                Classwork
                            </TabsTrigger>
                            <TabsTrigger
                                value="members"
                                className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 text-sm"
                            >
                                People
                            </TabsTrigger>
                        </TabsList>
                    </div>
                </div>

                <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                    {/* Banner Area */}
                    <div className="relative rounded-xl overflow-hidden bg-primary h-48 mb-8 text-white p-8 flex flex-col justify-end shadow-md">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 opacity-90"></div>
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                        <div className="relative z-10">
                            <h1 className="text-3xl font-bold">{detailHall.name}</h1>
                            <p className="text-white/80 mt-2 font-medium flex items-center gap-2">
                                <span className="uppercase tracking-wider text-xs border border-white/30 px-2 py-0.5 rounded">Code</span>
                                {detailHall.hallCode}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                        {/* LEFT SIDEBAR (Upcoming / Info) */}
                        <div className="lg:col-span-1 space-y-4">
                            <Card className="p-4 border-border/60">
                                <h3 className="font-semibold text-sm mb-4">Upcoming</h3>
                                <div className="text-sm text-muted-foreground">
                                    <p>Woohoo, no work due soon!</p>
                                </div>
                                <Button variant="link" className="px-0 mt-2 text-xs text-right w-full">View all</Button>
                            </Card>

                            <Card className="p-4 border-border/60">
                                <h3 className="font-semibold text-sm mb-2">My Performance</h3>
                                <div className="flex items-center justify-between text-sm py-1">
                                    <span className="text-muted-foreground">Completed</span>
                                    <span className="font-medium">{completedExams.length}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm py-1">
                                    <span className="text-muted-foreground">Avg. Score</span>
                                    <span className="font-medium text-emerald-600">--</span>
                                </div>
                            </Card>
                        </div>

                        {/* RIGHT CONTENT */}
                        <div className="lg:col-span-3">

                            {/* EXAMS TAB (Mapped to STREAM style) */}
                            <TabsContent value="exams" className="space-y-4 mt-0">
                                {availableExams.length > 0 ? (
                                    availableExams.map(exam => (
                                        <Card key={exam.id}
                                            className="p-0 overflow-hidden hover:shadow-md transition-all cursor-pointer border-border/60"
                                            onClick={() => handleStartExam(exam.id)}
                                        >
                                            <div className="p-4 flex gap-4 items-start">
                                                <div className="bg-primary/10 p-3 rounded-full">
                                                    <FileText className="w-6 h-6 text-primary" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="font-medium text-foreground hover:text-primary transition-colors">
                                                            New Exam Posted: {exam.title}
                                                        </h3>
                                                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {new Date().toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="bg-muted/30 px-4 py-3 border-t text-sm flex gap-6 text-muted-foreground">
                                                <span className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4" /> {exam.duration} mins
                                                </span>
                                                <span className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4" /> {exam.totalMarks} marks
                                                </span>
                                            </div>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="text-center py-12 bg-white rounded-xl border border-dashed">
                                        <p className="text-muted-foreground">No new exams posted yet.</p>
                                    </div>
                                )}
                            </TabsContent>

                            {/* PROGRESS TAB (Mapped to CLASSWORK style) */}
                            <TabsContent value="progress" className="space-y-4 mt-0">
                                {ongoingExams.length > 0 || completedExams.length > 0 ? (
                                    <div className="space-y-6">
                                        {ongoingExams.length > 0 && (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 pb-2 border-b border-primary/20">
                                                    <Clock className="w-5 h-5 text-primary" />
                                                    <h3 className="font-bold text-primary">In Progress</h3>
                                                </div>
                                                {ongoingExams.map(exam => (
                                                    <Card key={exam.id} className="p-4 flex justify-between items-center border-l-4 border-l-primary hover:bg-muted/20">
                                                        <div>
                                                            <h4 className="font-semibold">{exam.title}</h4>
                                                            <p className="text-sm text-muted-foreground">Started: Today</p>
                                                        </div>
                                                        <Button size="sm" onClick={() => handleStartExam(exam.id)}>Resume</Button>
                                                    </Card>
                                                ))}
                                            </div>
                                        )}

                                        {completedExams.length > 0 && (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 pb-2 border-b border-green-500/20">
                                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                                    <h3 className="font-bold text-green-600">Evaluated</h3>
                                                </div>
                                                {completedExams.map(exam => (
                                                    <Card key={exam.id} className="p-4 flex justify-between items-center border-l-4 border-l-green-500 hover:bg-muted/20">
                                                        <div>
                                                            <h4 className="font-semibold">{exam.title}</h4>
                                                            <p className="text-sm text-muted-foreground">Score: 85/100 (Demo)</p>
                                                        </div>
                                                        <Button variant="outline" size="sm">View Result</Button>
                                                    </Card>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-muted-foreground">No classwork history available.</p>
                                    </div>
                                )}
                            </TabsContent>

                            {/* MEMBERS TAB (People) */}
                            <TabsContent value="members" className="space-y-6 mt-0">

                                {/* Teachers Section */}
                                <div>
                                    <h3 className="text-2xl text-primary border-b border-primary/20 pb-4 mb-4">Teachers</h3>
                                    <div className="flex items-center gap-4 py-2 px-4 hover:bg-muted/50 rounded-lg">
                                        <Avatar>
                                            <AvatarFallback>EX</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">Class Examiner</span>
                                    </div>
                                </div>

                                {/* Classmates Section */}
                                <div>
                                    <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
                                        <h3 className="text-2xl text-foreground">Classmates</h3>
                                        <span className="text-muted-foreground text-sm">{hallMembers.length} students</span>
                                    </div>

                                    <div className="space-y-1">
                                        {hallMembers.map(memberId => {
                                            const member = Object.values(dummyUsers).find(u => u.id === memberId && u.role === 'candidate');
                                            if (!member) return null;
                                            return (
                                                <div key={memberId} className="flex items-center gap-4 py-3 px-4 hover:bg-muted/50 rounded-lg">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">{member.name}</span>
                                                    {member.id === candidate.id && <span className="text-xs text-muted-foreground">(You)</span>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </TabsContent>
                        </div>

                    </div>

                </main>
            </Tabs>
        </div>
    );
}
