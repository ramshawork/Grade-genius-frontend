'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { dummyQuestions, dummyOptions, dummySections } from '@/lib/dummy-data';
import { Clock, AlertCircle, CheckCircle2, X, Camera, Trash2, Loader } from 'lucide-react';

interface ExamInterfaceProps {
  exam: any;
  candidate: any;
  onExit: () => void;
}

export default function ExamInterface({ exam, candidate, onExit }: ExamInterfaceProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(exam.duration * 60);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showInstructions, setShowInstructions] = useState(true);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraPhotos, setCameraPhotos] = useState<string[]>([]);
  const [processingOCR, setProcessingOCR] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let currentQuestion: any;

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const sections = dummySections.filter(s => exam.sections.includes(s.id));
  const currentSection = sections[currentSectionIndex];
  currentQuestion = dummyQuestions.find(q => q.id === currentSection?.questions[currentQuestionIndex]);
  const totalQuestions = sections.reduce((sum, s) => sum + s.questions.length, 0);
  const answeredQuestions = Object.keys(answers).length;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (value: string) => {
    if (currentQuestion) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: value
      }));
    }
  };

  const navigateQuestion = (direction: 'prev' | 'next' | 'nextSection') => {
    if (direction === 'next' && currentQuestionIndex < currentSection.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (direction === 'prev' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (direction === 'nextSection' && currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentQuestionIndex(0);
    }
  };

  // Camera Functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL('image/jpeg');
        setCameraPhotos([...cameraPhotos, imageData]);
      }
    }
  };

  const deletePhoto = (index: number) => {
    setCameraPhotos(cameraPhotos.filter((_, i) => i !== index));
  };

  const submitHandwritten = async () => {
    setProcessingOCR(true);
    // Simulate OCR processing
    setTimeout(() => {
      const ocredText = `[Handwritten answer processed from ${cameraPhotos.length} image(s)]`;
      handleAnswerChange(ocredText);
      setCameraPhotos([]);
      setShowCameraModal(false);
      setProcessingOCR(false);
      // Stop camera
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }, 2000);
  };

  if (showInstructions) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="border-border/50 max-w-2xl w-full p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">{exam.title}</h1>
            <p className="text-foreground/60 mt-2">{exam.description}</p>
          </div>

          <div className="space-y-6 mb-8">
            <Alert className="border-primary/20 bg-primary/5">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertDescription>
                Once you start the exam, you will have {exam.duration} minutes to complete it. Make sure you are in a quiet environment and have a stable internet connection.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-foreground/60 mb-1">Duration</p>
                <p className="text-2xl font-bold text-foreground">{exam.duration} min</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-foreground/60 mb-1">Total Marks</p>
                <p className="text-2xl font-bold text-foreground">{exam.totalMarks}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-foreground/60 mb-1">Sections</p>
                <p className="text-2xl font-bold text-foreground">{sections.length}</p>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-foreground mb-3">Exam Structure:</h3>
              <div className="space-y-2">
                {sections.map((section, idx) => (
                  <div key={section.id} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <Badge variant="outline">{idx + 1}</Badge>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{section.title}</p>
                      <p className="text-sm text-foreground/60">{section.questions.length} questions • {section.totalMarks} marks</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Alert className="border-accent/20 bg-accent/5">
              <AlertCircle className="h-4 w-4 text-accent" />
              <AlertDescription>
                For subjective questions, you can either type your answer or upload handwritten responses using the camera button.
              </AlertDescription>
            </Alert>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={onExit} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={() => setShowInstructions(false)} className="flex-1 bg-primary hover:bg-primary/90">
              Start Exam
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card sticky top-0 z-40 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-bold text-foreground">{exam.title}</h1>
            <p className="text-sm text-foreground/60">
              Section {currentSectionIndex + 1} of {sections.length}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-foreground/60">Time Left</p>
              <p className={`text-2xl font-bold ${timeLeft < 300 ? 'text-destructive' : 'text-primary'}`}>
                {formatTime(timeLeft)}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onExit} className="text-destructive hover:bg-destructive/10">
              <X className="w-4 h-4 mr-2" />
              Exit
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar: Question Navigator */}
          <div className="lg:col-span-1 space-y-6">
            {/* Progress */}
            <Card className="border-border/50 p-4">
              <h3 className="font-bold text-foreground mb-4">Progress</h3>
              <div className="w-full bg-border rounded-full h-3 mb-2">
                <div 
                  className="bg-primary rounded-full h-3 transition-all"
                  style={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
                />
              </div>
              <p className="text-sm text-foreground/60 text-center">
                {answeredQuestions} / {totalQuestions} answered
              </p>
            </Card>

            {/* Section Navigation */}
            <Card className="border-border/50 p-4">
              <h3 className="font-bold text-foreground mb-3">Sections</h3>
              <div className="space-y-2">
                {sections.map((section, idx) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setCurrentSectionIndex(idx);
                      setCurrentQuestionIndex(0);
                    }}
                    className={`w-full text-left p-2 rounded text-sm transition-colors ${
                      currentSectionIndex === idx
                        ? 'bg-primary text-primary-foreground font-medium'
                        : 'hover:bg-muted text-foreground/60'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </div>
            </Card>

            {/* Question List */}
            <Card className="border-border/50 p-4">
              <h3 className="font-bold text-foreground mb-3">Questions</h3>
              <div className="grid grid-cols-4 gap-2">
                {currentSection?.questions.map((qId, idx) => (
                  <button
                    key={qId}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`p-2 rounded text-xs font-medium transition-colors flex items-center justify-center ${
                      currentQuestionIndex === idx
                        ? 'bg-primary text-primary-foreground'
                        : answers[qId]
                        ? 'bg-green-500/20 text-green-700'
                        : 'bg-muted text-foreground/60 hover:bg-border'
                    }`}
                    title={`Question ${idx + 1}${answers[qId] ? ' (Answered)' : ''}`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content: Question & Answer */}
          <div className="lg:col-span-3">
            {currentQuestion ? (
              <Card className="border-border/50 p-8">
                {/* Question Header */}
                <div className="mb-8">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-2xl font-bold text-foreground flex-1 pr-4">{currentQuestion.text}</h2>
                    <div className="text-right">
                      <Badge variant={currentQuestion.type === 'subjective' ? 'secondary' : 'outline'}>
                        {currentQuestion.type === 'subjective' ? 'Subjective' : currentQuestion.type === 'numerical' ? 'Numerical' : 'MCQ'}
                      </Badge>
                      <p className="text-sm text-foreground/60 mt-2">{currentQuestion.marks} marks</p>
                    </div>
                  </div>
                </div>

                {/* Answer Section */}
                <div className="mb-8">
                  {currentQuestion.type === 'mcq' ? (
                    // MCQ
                    <RadioGroup value={answers[currentQuestion.id] || ''} onValueChange={handleAnswerChange}>
                      <div className="space-y-3">
                        {currentQuestion.options.map((optionId: string) => {
                          const option = dummyOptions[optionId as keyof typeof dummyOptions];
                          return (
                            <div key={optionId} className="flex items-center space-x-3 p-4 border border-border/30 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer">
                              <RadioGroupItem value={optionId} id={optionId} />
                              <Label htmlFor={optionId} className="flex-1 cursor-pointer font-medium">
                                {option?.text}
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                    </RadioGroup>
                  ) : currentQuestion.type === 'numerical' ? (
                    // Numerical
                    <Input
                      type="text"
                      placeholder="Enter your answer"
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                      className="text-lg p-4"
                    />
                  ) : (
                    // Subjective or Reasoning
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Type your answer here..."
                        value={answers[currentQuestion.id] || ''}
                        onChange={(e) => handleAnswerChange(e.target.value)}
                        rows={8}
                        className="resize-none text-base p-4"
                      />
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowCameraModal(true);
                          startCamera();
                        }}
                        className="w-full border-primary/50 hover:bg-primary/10 bg-primary/5"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Upload Handwritten Answer
                      </Button>
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-4 border-t border-border/50 pt-6">
                  <Button
                    variant="outline"
                    onClick={() => navigateQuestion('prev')}
                    disabled={currentSectionIndex === 0 && currentQuestionIndex === 0}
                  >
                    Previous
                  </Button>
                  <div className="flex-1" />
                  {currentQuestionIndex === currentSection.questions.length - 1 && currentSectionIndex === sections.length - 1 ? (
                    <Button
                      onClick={() => setShowSubmitConfirm(true)}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Submit Exam
                    </Button>
                  ) : currentQuestionIndex === currentSection.questions.length - 1 ? (
                    <Button
                      onClick={() => navigateQuestion('nextSection')}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Next Section
                    </Button>
                  ) : (
                    <Button
                      onClick={() => navigateQuestion('next')}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Next Question
                    </Button>
                  )}
                </div>
              </Card>
            ) : (
              <Card className="border-border/50 p-8 text-center">
                <p className="text-foreground/60">Loading question...</p>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Full-Screen Camera Modal */}
      <Dialog open={showCameraModal} onOpenChange={setShowCameraModal}>
        <DialogContent className="w-screen h-screen max-w-none p-0 border-0 rounded-0" onOpenAutoFocus={() => startCamera()}>
          <div className="w-full h-full flex flex-col">
            {/* Header */}
            <div className="border-b border-border/50 bg-card p-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">Upload Handwritten Answer</h2>
                <p className="text-sm text-foreground/60">Take photos and AI will process them</p>
              </div>
              <button
                onClick={() => setShowCameraModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col p-4 gap-4 overflow-auto">
              {/* Camera Preview - Full Width */}
              <div className="relative bg-black rounded-lg overflow-hidden flex-1 flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
                {!videoRef.current?.srcObject && (
                  <p className="text-white text-center">Camera initializing...</p>
                )}
              </div>

              {/* Capture Button */}
              <Button
                onClick={capturePhoto}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90"
              >
                <Camera className="w-5 h-5 mr-2" />
                Capture Photo
              </Button>

              {/* Photo Gallery Tray */}
              {cameraPhotos.length > 0 && (
                <div className="border-t border-border/50 pt-4">
                  <p className="text-sm font-medium text-foreground mb-3">Captured Photos ({cameraPhotos.length})</p>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {cameraPhotos.map((photo, idx) => (
                      <div key={idx} className="relative flex-shrink-0 group">
                        <img
                          src={photo || "/placeholder.svg"}
                          alt={`Captured ${idx + 1}`}
                          className="h-20 w-20 object-cover rounded border-2 border-primary/30 group-hover:border-primary transition-colors"
                        />
                        <button
                          onClick={() => deletePhoto(idx)}
                          className="absolute -top-3 -right-3 bg-destructive rounded-full p-1.5 text-white hover:bg-destructive/90 transition-colors shadow-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="border-t border-border/50 pt-4 flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCameraModal(false)}
                  size="lg"
                  className="flex-1"
                  disabled={processingOCR}
                >
                  Close
                </Button>
                <Button
                  onClick={submitHandwritten}
                  size="lg"
                  disabled={cameraPhotos.length === 0 || processingOCR}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  {processingOCR ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      AI OCR Scanning...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Done ({cameraPhotos.length} photo{cameraPhotos.length !== 1 ? 's' : ''})
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Submit Confirmation */}
      <Dialog open={showSubmitConfirm} onOpenChange={setShowSubmitConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Exam?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-foreground/60">
              You have answered {answeredQuestions} out of {totalQuestions} questions. Once submitted, you cannot make changes.
            </p>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-foreground/60 mb-1">Summary</p>
              <div className="text-sm font-medium text-foreground space-y-1">
                <p>Total Questions: {totalQuestions}</p>
                <p>Answered: {answeredQuestions}</p>
                <p>Unanswered: {totalQuestions - answeredQuestions}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setShowSubmitConfirm(false)} className="flex-1">
                Continue
              </Button>
              <Button
                onClick={() => {
                  setShowSubmitConfirm(false);
                  onExit();
                }}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
