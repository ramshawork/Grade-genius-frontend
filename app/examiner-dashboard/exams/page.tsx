'use client';

import React from "react"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import ExaminerNav from '@/components/examiner-nav';
import { dummyExams, dummyHalls } from '@/lib/dummy-data';
import { Plus, Edit2, Trash2, Eye, Copy, Calendar } from 'lucide-react';

export default function ExamsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    hallId: '',
    totalMarks: '',
    duration: '',
    description: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, would save to database
    console.log('Creating exam:', formData);
    setShowCreateForm(false);
    setFormData({ title: '', hallId: '', totalMarks: '', duration: '', description: '' });
  };

  const exams = dummyExams;

  return (
    <div className="min-h-screen bg-background">
      <ExaminerNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Exams</h1>
            <p className="text-foreground/60 mt-2">Create and manage your exams</p>
          </div>
          <Button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-primary hover:bg-primary/90 gap-2"
          >
            <Plus className="w-4 h-4" />
            New Exam
          </Button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <Card className="border-border/50 p-6 mb-8">
            <h2 className="text-xl font-bold text-foreground mb-6">Create New Exam</h2>
            <form onSubmit={handleCreateExam} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-foreground font-medium">Exam Title</Label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Physics Mid-Term Exam"
                    className="bg-background border-border/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground font-medium">Exam Hall</Label>
                  <select
                    name="hallId"
                    value={formData.hallId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border/50 rounded-md bg-background text-foreground"
                    required
                  >
                    <option value="">Select a hall</option>
                    {dummyHalls.map(hall => (
                      <option key={hall.id} value={hall.id}>
                        {hall.name} ({hall.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground font-medium">Total Marks</Label>
                  <Input
                    type="number"
                    name="totalMarks"
                    value={formData.totalMarks}
                    onChange={handleInputChange}
                    placeholder="100"
                    className="bg-background border-border/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground font-medium">Duration (minutes)</Label>
                  <Input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="120"
                    className="bg-background border-border/50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground font-medium">Description</Label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Add exam description, instructions, etc."
                  className="bg-background border-border/50 min-h-24"
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 border-border/50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Create Exam
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Exams List */}
        <div className="space-y-4">
          {exams.map(exam => {
            const hall = dummyHalls.find(h => h.id === exam.hallId);
            return (
              <Card key={exam.id} className="border-border/50 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground">{exam.title}</h3>
                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-foreground/60 uppercase tracking-wider mb-1">Hall</p>
                        <p className="font-medium text-foreground">{hall?.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-foreground/60 uppercase tracking-wider mb-1">Details</p>
                        <p className="font-medium text-foreground">{exam.duration} min • {exam.totalMarks} marks</p>
                      </div>
                      <div>
                        <p className="text-xs text-foreground/60 uppercase tracking-wider mb-1">Sections</p>
                        <p className="font-medium text-foreground">{exam.sections.length} sections</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      exam.status === 'active' 
                        ? 'bg-primary/20 text-primary'
                        : exam.status === 'scheduled'
                        ? 'bg-secondary/20 text-secondary'
                        : 'bg-muted text-foreground/60'
                    }`}>
                      {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mt-6 pt-6 border-t border-border/30">
                  <Button size="sm" variant="outline" className="border-border/50 gap-2 bg-transparent">
                    <Eye className="w-4 h-4" />
                    Preview
                  </Button>
                  <Button size="sm" variant="outline" className="border-border/50 gap-2 bg-transparent">
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="border-border/50 gap-2 bg-transparent">
                    <Copy className="w-4 h-4" />
                    Duplicate
                  </Button>
                  <Button size="sm" variant="outline" className="border-border/50 gap-2 ml-auto text-destructive hover:text-destructive bg-transparent">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
