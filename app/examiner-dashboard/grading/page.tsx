'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExaminerNav from '@/components/examiner-nav';
import { dummyAttempts, dummyQuestions, dummyExams, dummyUsers } from '@/lib/dummy-data';
import { ArrowLeft, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import Link from 'next/link';

export default function GradingPage() {
  const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>(dummyAttempts[0]?.id || null);
  const [currentAnswerIndex, setCurrentAnswerIndex] = useState(0);
  const [gradingScores, setGradingScores] = useState<Record<string, number>>({});
  const [feedbacks, setFeedbacks] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const selectedAttempt = selectedAttemptId 
    ? dummyAttempts.find(a => a.id === selectedAttemptId)
    : null;

  const currentAnswer = selectedAttempt?.answers[currentAnswerIndex];
  const currentQuestion = currentAnswer 
    ? dummyQuestions.find(q => q.id === currentAnswer.questionId)
    : null;

  const handleScoreChange = (answerId: string, score: number, maxScore: number) => {
    if (score <= maxScore) {
      setGradingScores(prev => ({
        ...prev,
        [answerId]: score
      }));
    }
  };

  const handleFeedbackChange = (answerId: string, feedback: string) => {
    setFeedbacks(prev => ({
      ...prev,
      [answerId]: feedback
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const navigateAnswer = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next' 
      ? currentAnswerIndex + 1 
      : currentAnswerIndex - 1;
    
    if (newIndex >= 0 && newIndex < (selectedAttempt?.answers.length || 0)) {
      setCurrentAnswerIndex(newIndex);
    }
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
          <h1 className="text-3xl font-bold text-foreground">Manual Grading</h1>
          <p className="text-foreground/60 mt-2">Review and grade candidate submissions with split-screen interface</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Panel: Attempt List */}
          <Card className="border-border/50 p-6 h-fit">
            <h2 className="text-lg font-bold text-foreground mb-4">Submissions</h2>
            <div className="space-y-3">
              {dummyAttempts.map(attempt => (
                <button
                  key={attempt.id}
                  onClick={() => {
                    setSelectedAttemptId(attempt.id);
                    setCurrentAnswerIndex(0);
                  }}
                  className={`w-full p-4 rounded-lg border transition-all text-left ${
                    selectedAttemptId === attempt.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border/30 hover:border-primary/50'
                  }`}
                >
                  <p className="font-medium text-foreground">{attempt.candidateName}</p>
                  <p className="text-xs text-foreground/60 mt-1">Exam: {dummyExams.find(e => e.id === attempt.examId)?.title}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={attempt.status === 'submitted' ? 'default' : 'secondary'} className="text-xs">
                      {attempt.status}
                    </Badge>
                    <span className="text-xs text-foreground/60">{attempt.totalMarks} marks</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Right Panel: Grading Interface */}
          <div className="lg:col-span-2 space-y-6">
            {selectedAttempt && currentQuestion ? (
              <>
                {/* Attempt Header */}
                <Card className="border-border/50 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-foreground">{selectedAttempt.candidateName}</h2>
                      <p className="text-sm text-foreground/60 mt-1">{dummyExams.find(e => e.id === selectedAttempt.examId)?.title}</p>
                    </div>
                    <Badge variant={selectedAttempt.status === 'submitted' ? 'default' : 'secondary'}>
                      {selectedAttempt.status}
                    </Badge>
                  </div>
                </Card>

                {/* Split Screen: Answer Review & Grading */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left: Student's Answer */}
                  <Card className="border-border/50 p-6">
                    <h3 className="text-lg font-bold text-foreground mb-4">Candidate's Answer</h3>
                    
                    <div className="space-y-4 mb-6">
                      <div>
                        <p className="text-sm text-foreground/60 mb-2">Question</p>
                        <p className="font-medium text-foreground">{currentQuestion.text}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">{currentQuestion.type}</Badge>
                          <Badge variant="secondary" className="text-xs">{currentQuestion.marks} marks</Badge>
                        </div>
                      </div>

                      {/* Display answer based on type */}
                      <div className="bg-muted p-4 rounded-lg min-h-32 max-h-64 overflow-auto border border-border/30">
                        {currentQuestion.type === 'mcq' ? (
                          <div className="text-foreground space-y-2">
                            <p className="text-sm text-foreground/60">Selected Answer:</p>
                            <p className="font-bold p-3 bg-primary/10 rounded border-l-4 border-primary">
                              {dummyQuestions.find(q => q.id === currentAnswer.questionId)?.options?.includes(currentAnswer.answer) 
                                ? currentAnswer.answer 
                                : 'Not answered'}
                            </p>
                          </div>
                        ) : currentQuestion.type === 'subjective' && currentAnswer.answer.includes('data:image') ? (
                          <div className="space-y-3">
                            <p className="text-sm text-foreground/60 font-medium">Handwritten/Image Answer:</p>
                            <img 
                              src={currentAnswer.answer || "/placeholder.svg"} 
                              alt="Candidate handwriting"
                              className="max-w-full max-h-48 rounded border-2 border-primary/30"
                            />
                          </div>
                        ) : (
                          <div className="text-foreground space-y-2">
                            <p className="text-sm text-foreground/60 font-medium mb-2">Candidate Response:</p>
                            <p className="font-medium break-words whitespace-pre-wrap">{currentAnswer.answer}</p>
                          </div>
                        )}
                      </div>

                      {/* Correct Answer */}
                      {currentQuestion.type !== 'subjective' && (
                        <div>
                          <p className="text-sm text-foreground/60 mb-2">Correct Answer</p>
                          <p className="font-medium text-foreground bg-green-500/10 p-3 rounded border border-green-500/30">
                            {currentQuestion.correctAnswer}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Navigation */}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigateAnswer('prev')}
                        disabled={currentAnswerIndex === 0}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <div className="flex-1 text-center text-sm text-foreground/60 flex items-center justify-center">
                        Answer {currentAnswerIndex + 1} of {selectedAttempt.answers.length}
                      </div>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => navigateAnswer('next')}
                        disabled={currentAnswerIndex === selectedAttempt.answers.length - 1}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>

                  {/* Right: AI Score & Manual Override */}
                  <Card className="border-border/50 p-6">
                    <h3 className="text-lg font-bold text-foreground mb-4">Grading</h3>
                    
                    <div className="space-y-6">
                      {/* AI Score Display */}
                      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                        <p className="text-sm text-foreground/60 mb-2">AI Suggested Score</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-primary">{currentAnswer.marks}</span>
                          <span className="text-foreground/60">/ {currentQuestion.marks}</span>
                        </div>
                        <p className="text-xs text-foreground/60 mt-2">Automatically calculated by AI</p>
                      </div>

                      {/* Manual Override Score */}
                      <div>
                        <Label htmlFor="manual-score" className="mb-2 block">
                          Manual Score Override
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="manual-score"
                            type="number"
                            min="0"
                            max={currentQuestion.marks}
                            value={gradingScores[currentAnswer.questionId] ?? currentAnswer.marks}
                            onChange={(e) => handleScoreChange(
                              currentAnswer.questionId,
                              parseFloat(e.target.value) || 0,
                              currentQuestion.marks
                            )}
                            className="flex-1"
                          />
                          <span className="flex items-center text-foreground/60">/ {currentQuestion.marks}</span>
                        </div>
                        <p className="text-xs text-foreground/60 mt-1">Leave as is to accept AI score</p>
                      </div>

                      {/* Feedback */}
                      <div>
                        <Label htmlFor="feedback" className="mb-2 block">
                          Feedback to Candidate
                        </Label>
                        <Textarea
                          id="feedback"
                          placeholder="Provide constructive feedback..."
                          value={feedbacks[currentAnswer.questionId] ?? ''}
                          onChange={(e) => handleFeedbackChange(currentAnswer.questionId, e.target.value)}
                          rows={6}
                          className="resize-none"
                        />
                      </div>

                      {/* Save Button */}
                      <Button 
                        onClick={handleSave}
                        className="w-full bg-primary hover:bg-primary/90"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {saved ? 'Saved!' : 'Save Score & Feedback'}
                      </Button>

                      {/* Grading Status */}
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-foreground/60 mb-2">Grading Progress</p>
                        <div className="w-full bg-border rounded-full h-2">
                          <div 
                            className="bg-primary rounded-full h-2 transition-all"
                            style={{ width: `${((currentAnswerIndex + 1) / selectedAttempt.answers.length) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-foreground/60 mt-2">
                          {currentAnswerIndex + 1} of {selectedAttempt.answers.length} answers graded
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </>
            ) : (
              <Card className="border-border/50 p-12 text-center">
                <p className="text-foreground/60">Select a submission to start grading</p>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
