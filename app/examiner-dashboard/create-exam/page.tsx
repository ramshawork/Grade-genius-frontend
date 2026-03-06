'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ExaminerNav from '@/components/examiner-nav';
import { ChevronRight, ChevronLeft, Check, Plus, Trash2 } from 'lucide-react';

// We'll import these to push our newly created elements into them for the dummy session
import { dummyExams, dummySections, dummyQuestions, dummyUsers } from '@/lib/dummy-data';

function CreateExamContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const hallId = searchParams.get('hallId');
    const editExamId = searchParams.get('id');
    const { toast } = useToast();

    const [step, setStep] = useState(1);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('60');
    const [publishNow, setPublishNow] = useState(true);
    const [scheduleDate, setScheduleDate] = useState('');

    // Section builder state
    const [customSections, setCustomSections] = useState<any[]>([]);
    const [newSectionTitle, setNewSectionTitle] = useState('');
    const [selectedSections, setSelectedSections] = useState<string[]>([]);

    // Question builder state
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentSection, setCurrentSection] = useState<string | null>(null);
    const [questionType, setQuestionType] = useState('mcq');
    const [questionText, setQuestionText] = useState('');
    const [marks, setMarks] = useState('10');
    const [mcqOptions, setMcqOptions] = useState(['', '', '', '']);

    // Pre-fill data if entering Edit Mode
    useEffect(() => {
        if (editExamId) {
            const existingExam = dummyExams.find(e => e.id === editExamId);
            if (existingExam) {
                setTitle(existingExam.title);
                setDescription(existingExam.description || '');
                setDuration(existingExam.duration.toString());
                setPublishNow(existingExam.status === 'active');
                if (existingExam.scheduledDate) {
                    // Format date to local datetime string roughly for the input
                    const d = new Date(existingExam.scheduledDate);
                    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                    setScheduleDate(d.toISOString().slice(0, 16));
                }

                // Pre-fill custom sections
                const existingSections = dummySections.filter(s => existingExam.sections.includes(s.id));
                setCustomSections(existingSections);
                setSelectedSections(existingSections.map(s => s.id));

                // Pre-fill questions
                const sIds = existingSections.map(s => s.id);
                const existingQuestions = dummyQuestions.filter(q => sIds.includes(q.sectionId));
                setQuestions(existingQuestions);
            }
        }
    }, [editExamId]);

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleAddSection = () => {
        if (!newSectionTitle.trim()) return;

        const newSection = {
            id: `custom-section-${Date.now()}`,
            title: newSectionTitle,
            type: 'mixed',
            totalMarks: 0, // dynamically calculated later
            questions: [],
        };

        setCustomSections([...customSections, newSection]);
        setSelectedSections([...selectedSections, newSection.id]);
        setNewSectionTitle('');
    };

    const handleRemoveSection = (id: string) => {
        setCustomSections(customSections.filter(s => s.id !== id));
        setSelectedSections(selectedSections.filter(sId => sId !== id));
        // Remove questions associated with this section
        setQuestions(questions.filter(q => q.sectionId !== id));
        if (currentSection === id) {
            setCurrentSection(null);
        }
    };

    const toggleSection = (sectionId: string) => {
        if (selectedSections.includes(sectionId)) {
            setSelectedSections(selectedSections.filter(s => s !== sectionId));
        } else {
            setSelectedSections([...selectedSections, sectionId]);
        }
    };

    const addQuestion = () => {
        if (!currentSection || !questionText.trim()) return;

        const newQuestion = {
            id: `q-${Date.now()}`,
            sectionId: currentSection,
            text: questionText,
            type: questionType,
            marks: parseInt(marks) || 0,
            options: questionType === 'mcq' ? mcqOptions.filter(o => o.trim()) : [],
        };

        setQuestions([...questions, newQuestion]);
        setQuestionText('');
        setMarks('10');
        setMcqOptions(['', '', '', '']);
        setQuestionType('mcq');
    };

    const removeQuestion = (qId: string) => {
        setQuestions(questions.filter(q => q.id !== qId));
    };

    const handleFinish = () => {
        const examId = `exam-${Date.now()}`;

        // Process sections to update their total marks and specific questions
        const finalSections = customSections.filter(s => selectedSections.includes(s.id)).map((section, idx) => {
            const sectionQuestions = questions.filter(q => q.sectionId === section.id);
            return {
                ...section,
                examId,
                order: idx + 1,
                totalMarks: sectionQuestions.reduce((sum, q) => sum + q.marks, 0),
                questions: sectionQuestions.map(q => q.id),
            };
        });

        const isEditMode = !!editExamId;

        const exam = {
            id: isEditMode ? editExamId : examId,
            title,
            description,
            duration: parseInt(duration) || 60,
            status: publishNow ? 'active' : 'scheduled',
            scheduledDate: publishNow ? new Date() : new Date(scheduleDate),
            sections: finalSections.map(s => s.id),
            totalMarks: questions.reduce((sum, q) => sum + (q.marks || 0), 0),
            // Keep existing hall ID if editing, otherwise use provided hallId
            hallId: (isEditMode ? dummyExams.find(e => e.id === editExamId)?.hallId : hallId) || 'hall-unassigned',
            examinerId: dummyUsers.examiner1.id,
        };

        if (isEditMode) {
            // Update dummy arrays
            const examIndex = dummyExams.findIndex(e => e.id === editExamId);
            if (examIndex !== -1) dummyExams[examIndex] = exam;

            // Update sections (simple replacing strategy for dummy data)
            finalSections.forEach(s => {
                const idx = dummySections.findIndex(ds => ds.id === s.id);
                if (idx !== -1) dummySections[idx] = s;
                else dummySections.push(s);
            });

            // Update questions
            questions.forEach(q => {
                const idx = dummyQuestions.findIndex(dq => dq.id === q.id);
                if (idx !== -1) dummyQuestions[idx] = q;
                else dummyQuestions.push(q);
            });

            toast({
                title: 'Exam Updated',
                description: 'Your changes have been saved successfully.',
                variant: 'default',
            });
        } else {
            // Add to dummy data arrays to persist in session
            dummyExams.push(exam);
            finalSections.forEach(s => dummySections.push(s));
            questions.forEach(q => dummyQuestions.push(q));

            toast({
                title: 'Exam Created',
                description: 'The new exam has been created successfully.',
                variant: 'default',
            });
        }

        // Redirect back
        const targetHallId = exam.hallId;
        if (targetHallId && targetHallId.startsWith('hall-')) {
            router.push(`/examiner-dashboard/halls/${targetHallId}`);
        } else {
            router.push('/examiner-dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <ExaminerNav />
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="mb-4"
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <h1 className="text-3xl font-bold text-foreground">
                        {editExamId ? 'Edit Exam' : 'Create New Exam'}
                    </h1>
                    <p className="text-foreground/60 mt-2">Step {step} of 3</p>
                </div>

                <Card className="border-border/50 p-6 md:p-8">
                    {/* Step 1: Basic Info */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <Label className="text-base font-semibold mb-4 block">Exam Title</Label>
                                <Input
                                    placeholder="e.g., Physics Mid-Term Exam"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="text-base p-3"
                                />
                            </div>

                            <div>
                                <Label className="text-base font-semibold mb-4 block">Description (Optional)</Label>
                                <Textarea
                                    placeholder="Exam details and instructions..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <div>
                                <Label className="text-base font-semibold mb-4 block">Duration (minutes)</Label>
                                <Input
                                    type="number"
                                    min="15"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    className="text-base p-3"
                                />
                            </div>

                            <div className="space-y-4">
                                <Label className="text-base font-semibold">Publication</Label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            checked={publishNow}
                                            onChange={() => setPublishNow(true)}
                                        />
                                        <span>Publish Now</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            checked={!publishNow}
                                            onChange={() => setPublishNow(false)}
                                        />
                                        <span>Schedule for Later</span>
                                    </label>
                                </div>

                                {!publishNow && (
                                    <Input
                                        type="datetime-local"
                                        value={scheduleDate}
                                        onChange={(e) => setScheduleDate(e.target.value)}
                                        className="text-base p-3"
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Define Sections */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <p className="text-foreground/60">Define the sections for this exam:</p>

                            <div className="flex gap-2 items-center">
                                <Input
                                    placeholder="e.g., General Knowledge, Advanced Math, Reading Comprehension"
                                    value={newSectionTitle}
                                    onChange={(e) => setNewSectionTitle(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddSection();
                                        }
                                    }}
                                    className="flex-1"
                                />
                                <Button onClick={handleAddSection} type="button" disabled={!newSectionTitle.trim()}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Section
                                </Button>
                            </div>

                            <div className="space-y-3 mt-6">
                                {customSections.length > 0 ? (
                                    customSections.map(section => (
                                        <div key={section.id} className="flex items-center gap-3 p-4 border border-border/30 rounded-lg hover:bg-primary/5 transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={selectedSections.includes(section.id)}
                                                onChange={() => toggleSection(section.id)}
                                                className="cursor-pointer"
                                            />
                                            <div className="flex-1">
                                                <p className="font-semibold text-foreground">{section.title}</p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveSection(section.id)}
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 bg-muted/50 rounded-lg border border-border/30">
                                        <p className="text-foreground/60">No sections added yet. Add a section above to start.</p>
                                    </div>
                                )}
                            </div>

                            {selectedSections.length === 0 && customSections.length > 0 && (
                                <p className="text-sm text-destructive">Please select at least one section</p>
                            )}
                        </div>
                    )}

                    {/* Step 3: Add Questions */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <Label className="text-base font-semibold">Select Section to Add Questions</Label>
                                <select
                                    value={currentSection || ''}
                                    onChange={(e) => setCurrentSection(e.target.value || null)}
                                    className="w-full p-3 border border-border rounded-lg bg-background text-base"
                                >
                                    <option value="">Choose a section...</option>
                                    {selectedSections.map(sectionId => {
                                        const section = customSections.find(s => s.id === sectionId);
                                        return (
                                            <option key={sectionId} value={sectionId}>
                                                {section?.title}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            {currentSection && (
                                <div className="bg-muted/30 p-6 rounded-lg border border-border/50">
                                    <h3 className="font-semibold text-lg mb-4">New Question</h3>
                                    <div className="space-y-4">
                                        <div className="space-y-3">
                                            <Label className="text-base font-medium">Question Type</Label>
                                            <div className="flex flex-wrap gap-3">
                                                {['mcq', 'numeric', 'reasoning'].map(type => (
                                                    <button
                                                        key={type}
                                                        onClick={() => setQuestionType(type)}
                                                        className={`px-4 py-2 rounded-lg border transition-colors ${questionType === type
                                                            ? 'border-primary bg-primary/10 text-foreground font-medium'
                                                            : 'border-border hover:border-primary/50 text-foreground/80'
                                                            }`}
                                                    >
                                                        {type === 'mcq' ? 'Multiple Choice' : type === 'numeric' ? 'Numeric' : 'Reasoning/Subjective'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <Label className="text-base font-medium mb-2 block">Question Text</Label>
                                            <Textarea
                                                placeholder="Enter your question text here..."
                                                value={questionText}
                                                onChange={(e) => setQuestionText(e.target.value)}
                                                rows={3}
                                                className="text-base"
                                            />
                                        </div>

                                        <div>
                                            <Label className="text-base font-medium mb-2 block">Marks Assignment</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={marks}
                                                onChange={(e) => setMarks(e.target.value)}
                                                className="w-32 text-base"
                                            />
                                        </div>

                                        {questionType === 'mcq' && (
                                            <div className="space-y-3 pt-2">
                                                <Label className="text-base font-medium">Multiple Choice Options</Label>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {mcqOptions.map((option, idx) => (
                                                        <div key={idx} className="flex items-center gap-2">
                                                            <span className="font-medium text-foreground/60 w-6">{String.fromCharCode(65 + idx)}.</span>
                                                            <Input
                                                                placeholder={`Option ${idx + 1}`}
                                                                value={option}
                                                                onChange={(e) => {
                                                                    const newOptions = [...mcqOptions];
                                                                    newOptions[idx] = e.target.value;
                                                                    setMcqOptions(newOptions);
                                                                }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <Button
                                            onClick={addQuestion}
                                            className="w-full bg-primary hover:bg-primary/90 mt-4"
                                            disabled={!questionText.trim()}
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Question to Section
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {questions.length > 0 && (
                                <div className="space-y-6 pt-6 mt-6 border-t border-border/30">
                                    <h3 className="font-bold text-xl flex items-center justify-between">
                                        Added Questions
                                        <span className="text-sm font-normal text-muted-foreground bg-muted px-3 py-1 rounded-full">
                                            Total: {questions.length} • Marks: {questions.reduce((sum, q) => sum + q.marks, 0)}
                                        </span>
                                    </h3>

                                    {selectedSections.map(sectionId => {
                                        const sectionQuestions = questions.filter(q => q.sectionId === sectionId);
                                        if (sectionQuestions.length === 0) return null;

                                        const section = customSections.find(s => s.id === sectionId);

                                        return (
                                            <div key={sectionId} className="space-y-3">
                                                <h4 className="font-semibold text-lg text-primary">{section?.title}</h4>
                                                <div className="space-y-3 pl-4 border-l-2 border-primary/20">
                                                    {sectionQuestions.map((q, idx) => (
                                                        <div key={q.id} className="p-4 bg-muted/40 rounded-lg flex items-start justify-between border border-border/40 hover:border-border transition-colors">
                                                            <div className="flex-1 pr-4">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <span className="font-bold text-foreground/80">Q{idx + 1}.</span>
                                                                    <span className="text-xs uppercase bg-background px-2 py-0.5 rounded border border-border/50 text-foreground/70">
                                                                        {q.type === 'mcq' ? 'MCQ' : q.type === 'numeric' ? 'Numeric' : 'Reasoning'}
                                                                    </span>
                                                                    <span className="text-xs font-semibold text-primary">
                                                                        {q.marks} {q.marks === 1 ? 'mark' : 'marks'}
                                                                    </span>
                                                                </div>
                                                                <p className="text-foreground">{q.text}</p>
                                                                {q.type === 'mcq' && q.options.length > 0 && (
                                                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                                                        {q.options.map((opt: string, i: number) => (
                                                                            <p key={i} className="text-sm text-foreground/70 truncate">
                                                                                <span className="font-medium mr-1">{String.fromCharCode(65 + i)}.</span> {opt}
                                                                            </p>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeQuestion(q.id)}
                                                                className="text-destructive hover:bg-destructive/10 shrink-0"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 justify-between pt-8 mt-8 border-t border-border/30">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            disabled={step === 1}
                            className="bg-transparent"
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Previous Step
                        </Button>

                        {step < 3 ? (
                            <Button
                                onClick={handleNext}
                                disabled={
                                    (step === 1 && !title.trim()) ||
                                    (step === 2 && selectedSections.length === 0)
                                }
                                className="bg-primary hover:bg-primary/90 min-w-[120px]"
                            >
                                Next Step
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleFinish}
                                disabled={questions.length === 0}
                                className="bg-green-600 hover:bg-green-700 text-white min-w-[150px]"
                            >
                                <Check className="w-4 h-4 mr-2" />
                                {editExamId ? 'Save Changes' : 'Finish & Create Exam'}
                            </Button>
                        )}
                    </div>
                </Card>
            </main>
        </div>
    );
}

export default function CreateExamPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>}>
            <CreateExamContent />
        </Suspense>
    );
}
