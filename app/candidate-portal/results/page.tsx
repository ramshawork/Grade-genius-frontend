'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import CandidateNav from '@/components/candidate-nav';
import { dummyAttempts, dummyExams, dummyUsers } from '@/lib/dummy-data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Share2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ResultsPage() {
  const [selectedResult, setSelectedResult] = useState<string | null>(null);

  const candidate = dummyUsers.candidate1;
  const attempts = dummyAttempts.filter(a => a.candidateId === candidate.id);
  const currentResult = selectedResult ? attempts.find(a => a.id === selectedResult) : null;

  const overallPercentage = attempts.length > 0
    ? (attempts.reduce((sum, a) => sum + a.totalMarks, 0) / (attempts.length * 100)) * 100
    : 0;

  const chartData = attempts.map(attempt => ({
    name: dummyExams.find(e => e.id === attempt.examId)?.title.slice(0, 10) || 'Exam',
    score: attempt.totalMarks,
    max: 100,
  }));

  const pieData = attempts.map(attempt => ({
    name: 'Correct',
    value: attempt.correctAnswers,
  }));

  if (currentResult) {
    const exam = dummyExams.find(e => e.id === currentResult.examId);
    const percentage = (currentResult.totalMarks / (exam?.totalMarks || 1)) * 100;

    return (
      <div className="min-h-screen bg-background">
        <CandidateNav />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => setSelectedResult(null)}
            className="text-primary hover:text-primary/80 font-medium text-sm mb-6"
          >
            ← Back to All Results
          </button>

          <Card className="border-border/50 p-8 mb-8">
            {/* Result Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">{exam?.title}</h1>
              <p className="text-foreground/60">{currentResult.startedAt?.toLocaleDateString()}</p>
            </div>

            {/* Score Circle */}
            <div className="flex justify-center mb-8">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-border"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={`${(percentage / 100) * (2 * Math.PI * 90)} ${2 * Math.PI * 90}`}
                    className="text-primary transition-all"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-5xl font-bold text-primary">{percentage.toFixed(0)}%</p>
                  <p className="text-sm text-foreground/60 mt-2">{currentResult.totalMarks} / {exam?.totalMarks}</p>
                </div>
              </div>
            </div>

            {/* Verdict */}
            <div className="text-center mb-8">
              {percentage >= 75 && (
                <div className="inline-block">
                  <div className="flex items-center justify-center gap-2 text-primary mb-2">
                    <CheckCircle2 className="w-6 h-6" />
                    <span className="text-xl font-bold">Excellent!</span>
                  </div>
                  <p className="text-foreground/60">Outstanding performance!</p>
                </div>
              )}
              {percentage >= 60 && percentage < 75 && (
                <div className="inline-block">
                  <div className="flex items-center justify-center gap-2 text-secondary mb-2">
                    <CheckCircle2 className="w-6 h-6" />
                    <span className="text-xl font-bold">Great!</span>
                  </div>
                  <p className="text-foreground/60">Good performance with room for improvement.</p>
                </div>
              )}
              {percentage < 60 && (
                <div className="inline-block">
                  <div className="flex items-center justify-center gap-2 text-accent mb-2">
                    <AlertCircle className="w-6 h-6" />
                    <span className="text-xl font-bold">Good Effort!</span>
                  </div>
                  <p className="text-foreground/60">Keep practicing to improve further.</p>
                </div>
              )}
            </div>

            {/* Statistics */}
            <div className="grid md:grid-cols-3 gap-6 mb-8 pt-8 border-t border-border/30">
              <div className="text-center">
                <p className="text-foreground/60 text-sm mb-2">Correct Answers</p>
                <p className="text-3xl font-bold text-primary">{currentResult.correctAnswers}</p>
              </div>
              <div className="text-center">
                <p className="text-foreground/60 text-sm mb-2">Incorrect Answers</p>
                <p className="text-3xl font-bold text-secondary">{currentResult.answers.length - currentResult.correctAnswers}</p>
              </div>
              <div className="text-center">
                <p className="text-foreground/60 text-sm mb-2">Time Taken</p>
                <p className="text-3xl font-bold text-accent">
                  {currentResult.finishedAt && currentResult.startedAt
                    ? Math.round((currentResult.finishedAt.getTime() - currentResult.startedAt.getTime()) / 60000)
                    : 0}
                  {' '}min
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button variant="outline" className="border-border/50 gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                Download Report
              </Button>
              <Button variant="outline" className="border-border/50 gap-2 bg-transparent">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CandidateNav />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Results</h1>
          <p className="text-foreground/60 mt-2">View your exam scores and feedback</p>
        </div>

        {/* Overall Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-border/50 p-6">
            <p className="text-foreground/60 text-sm font-medium">Total Exams</p>
            <p className="text-3xl font-bold text-foreground mt-2">{attempts.length}</p>
          </Card>

          <Card className="border-border/50 p-6">
            <p className="text-foreground/60 text-sm font-medium">Average Score</p>
            <p className="text-3xl font-bold text-primary mt-2">
              {attempts.length > 0 ? (attempts.reduce((sum, a) => sum + a.totalMarks, 0) / attempts.length).toFixed(0) : 0}
            </p>
          </Card>

          <Card className="border-border/50 p-6">
            <p className="text-foreground/60 text-sm font-medium">Best Score</p>
            <p className="text-3xl font-bold text-primary mt-2">
              {attempts.length > 0 ? Math.max(...attempts.map(a => a.totalMarks)) : 0}
            </p>
          </Card>

          <Card className="border-border/50 p-6">
            <p className="text-foreground/60 text-sm font-medium">Overall Average</p>
            <p className="text-3xl font-bold text-primary mt-2">{overallPercentage.toFixed(0)}%</p>
          </Card>
        </div>

        {/* Charts */}
        {attempts.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="border-border/50 p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Score Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="name" stroke="var(--color-foreground-60)" />
                  <YAxis stroke="var(--color-foreground-60)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-background)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '6px',
                    }}
                    labelStyle={{ color: 'var(--color-foreground)' }}
                  />
                  <Bar dataKey="score" fill="var(--color-primary)" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="border-border/50 p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Accuracy</h3>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: 'Correct',
                          value: attempts.reduce((sum, a) => sum + a.correctAnswers, 0),
                        },
                        {
                          name: 'Incorrect',
                          value: attempts.reduce((sum, a) => sum + (a.answers.length - a.correctAnswers), 0),
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      <Cell fill="var(--color-primary)" />
                      <Cell fill="var(--color-secondary)" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )}

        {/* Results List */}
        <Card className="border-border/50">
          <div className="p-6 border-b border-border/30">
            <h2 className="text-lg font-bold text-foreground">Exam Results</h2>
          </div>

          <div className="divide-y divide-border/30">
            {attempts.map(attempt => {
              const exam = dummyExams.find(e => e.id === attempt.examId);
              const percentage = (attempt.totalMarks / (exam?.totalMarks || 1)) * 100;

              return (
                <button
                  key={attempt.id}
                  onClick={() => setSelectedResult(attempt.id)}
                  className="w-full text-left p-6 hover:bg-primary/5 transition-colors flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-bold text-foreground">{exam?.title}</h3>
                    <p className="text-sm text-foreground/60 mt-1">
                      Attempted on {attempt.startedAt?.toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{percentage.toFixed(0)}%</p>
                      <p className="text-xs text-foreground/60">{attempt.totalMarks} / {exam?.totalMarks}</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-border/50 bg-transparent">
                      View Details
                    </Button>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      </main>
    </div>
  );
}
