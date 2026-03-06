'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import ExaminerNav from '@/components/examiner-nav';
import { dummyExams, dummySections, dummyQuestions } from '@/lib/dummy-data';
import { Plus, Trash2, Edit2, ChevronDown, ChevronUp } from 'lucide-react';

export default function ExamBuilderPage({ params }: { params: { id: string } }) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [showAddQuestion, setShowAddQuestion] = useState<string | null>(null);
  const [questionForm, setQuestionForm] = useState({
    text: '',
    type: 'mcq',
    marks: '',
    options: ['', '', '', ''],
    correctAnswer: '',
  });

  const exam = dummyExams.find(e => e.id === params.id);
  const sections = dummySections.filter(s => exam?.sections.includes(s.id));
  const examQuestions = dummyQuestions;

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleAddQuestion = (sectionId: string) => {
    // In real app, would save to database
    setShowAddQuestion(null);
    setQuestionForm({
      text: '',
      type: 'mcq',
      marks: '',
      options: ['', '', '', ''],
      correctAnswer: '',
    });
  };

  if (!exam) {
    return (
      <div className="min-h-screen bg-background">
        <ExaminerNav />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-foreground/60">Exam not found</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ExaminerNav />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" className="mb-4 border-border/50 bg-transparent">
            ← Back to Exams
          </Button>
          <h1 className="text-3xl font-bold text-foreground">{exam.title}</h1>
          <p className="text-foreground/60 mt-2">Total Marks: {exam.totalMarks} • Duration: {exam.duration} mins</p>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map(section => {
            const sectionQuestions = examQuestions.filter(q => section.questions.includes(q.id));
            const isExpanded = expandedSections.has(section.id);

            return (
              <Card key={section.id} className="border-border/50 overflow-hidden">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-6 hover:bg-primary/5 transition-colors"
                >
                  <div className="flex-1 text-left">
                    <h2 className="text-lg font-bold text-foreground">{section.title}</h2>
                    <p className="text-sm text-foreground/60 mt-1">
                      {sectionQuestions.length} questions • {section.totalMarks} marks
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-primary">{sectionQuestions.length}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-foreground/60" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-foreground/60" />
                    )}
                  </div>
                </button>

                {/* Section Content */}
                {isExpanded && (
                  <div className="border-t border-border/30 p-6 space-y-4">
                    {/* Questions */}
                    {sectionQuestions.map((question, idx) => (
                      <div key={question.id} className="bg-background rounded-lg p-4 border border-border/30">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-bold text-primary">Q{idx + 1}.</span>
                              <span className="text-xs px-2 py-1 bg-muted text-foreground/60 rounded">
                                {question.type.toUpperCase()}
                              </span>
                              <span className="text-xs font-bold text-foreground/60 ml-auto">
                                {question.marks} marks
                              </span>
                            </div>
                            <p className="text-foreground text-sm">{question.text}</p>

                            {question.type === 'mcq' && (
                              <div className="mt-3 space-y-2">
                                {question.options.map((optId, i) => (
                                  <p key={i} className="text-xs text-foreground/60 ml-4">
                                    {String.fromCharCode(65 + i)}. Option text
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="border-border/50 bg-transparent">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-border/50 text-destructive bg-transparent">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add Question Form */}
                    {showAddQuestion === section.id ? (
                      <div className="bg-primary/5 rounded-lg p-4 border border-primary/20 space-y-4">
                        <h3 className="font-bold text-foreground">Add New Question</h3>

                        <div className="space-y-3">
                          <div>
                            <Label className="text-foreground text-sm font-medium">Question Text</Label>
                            <Textarea
                              value={questionForm.text}
                              onChange={(e) => setQuestionForm(prev => ({ ...prev, text: e.target.value }))}
                              placeholder="Enter question text"
                              className="bg-background border-border/50 mt-1 text-sm"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-foreground text-sm font-medium">Question Type</Label>
                              <select
                                value={questionForm.type}
                                onChange={(e) => setQuestionForm(prev => ({ ...prev, type: e.target.value }))}
                                className="w-full px-3 py-2 border border-border/50 rounded-md bg-background text-foreground text-sm mt-1"
                              >
                                <option value="mcq">Multiple Choice</option>
                                <option value="numerical">Numerical</option>
                                <option value="short-answer">Short Answer</option>
                              </select>
                            </div>

                            <div>
                              <Label className="text-foreground text-sm font-medium">Marks</Label>
                              <Input
                                type="number"
                                value={questionForm.marks}
                                onChange={(e) => setQuestionForm(prev => ({ ...prev, marks: e.target.value }))}
                                placeholder="10"
                                className="bg-background border-border/50 text-sm"
                              />
                            </div>
                          </div>

                          {questionForm.type === 'mcq' && (
                            <div>
                              <Label className="text-foreground text-sm font-medium">Options</Label>
                              <div className="space-y-2 mt-2">
                                {questionForm.options.map((option, i) => (
                                  <Input
                                    key={i}
                                    value={option}
                                    onChange={(e) => {
                                      const newOptions = [...questionForm.options];
                                      newOptions[i] = e.target.value;
                                      setQuestionForm(prev => ({ ...prev, options: newOptions }));
                                    }}
                                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                                    className="bg-background border-border/50 text-sm"
                                  />
                                ))}
                              </div>

                              <Label className="text-foreground text-sm font-medium block mt-3">Correct Answer</Label>
                              <select
                                value={questionForm.correctAnswer}
                                onChange={(e) => setQuestionForm(prev => ({ ...prev, correctAnswer: e.target.value }))}
                                className="w-full px-3 py-2 border border-border/50 rounded-md bg-background text-foreground text-sm mt-1"
                              >
                                <option value="">Select correct option</option>
                                {questionForm.options.map((_, i) => (
                                  <option key={i} value={String(i)}>
                                    Option {String.fromCharCode(65 + i)}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowAddQuestion(null)}
                            className="border-border/50"
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAddQuestion(section.id)}
                            className="bg-primary hover:bg-primary/90"
                          >
                            Add Question
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setShowAddQuestion(section.id)}
                        variant="outline"
                        className="w-full border-border/50 gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Question
                      </Button>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex gap-4 mt-8">
          <Button variant="outline" className="border-border/50 bg-transparent">
            Save Draft
          </Button>
          <Button className="bg-primary hover:bg-primary/90 ml-auto">
            Publish Exam
          </Button>
        </div>
      </main>
    </div>
  );
}
