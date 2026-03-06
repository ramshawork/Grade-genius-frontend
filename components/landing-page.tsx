'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, BarChart3, Lock, Users } from 'lucide-react';

interface LandingPageProps {
  onAuthClick: (role: 'examiner' | 'candidate') => void;
}

export default function LandingPage({ onAuthClick }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">G</span>
            </div>
            <span className="font-bold text-lg text-foreground">Grade Genius</span>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => onAuthClick('candidate')}
              className="border-primary/20 hover:bg-primary/10"
            >
              Candidate Login
            </Button>
            <Button 
              onClick={() => onAuthClick('examiner')}
              className="bg-primary hover:bg-primary/90"
            >
              Examiner Login
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-5xl sm:text-6xl font-bold text-balance text-foreground">
                Intelligent Exam Management for Modern Educators
              </h1>
              <p className="text-xl text-foreground/70">
                Create, manage, and grade exams with AI-powered insights. Streamline your assessment workflow and empower your candidates.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button 
                size="lg" 
                onClick={() => onAuthClick('examiner')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              >
                Get Started as Examiner <ArrowRight className="w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => onAuthClick('candidate')}
                className="border-primary/30 hover:bg-primary/10"
              >
                Access Exam Portal
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-8">
              <div>
                <p className="text-3xl font-bold text-primary">500+</p>
                <p className="text-sm text-foreground/60">Educational Institutions</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">50K+</p>
                <p className="text-sm text-foreground/60">Active Users Monthly</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-3xl" />
            <Card className="relative bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30 p-8 overflow-hidden">
              <div className="space-y-4">
                <div className="bg-background/40 rounded-lg p-4 space-y-2">
                  <div className="h-3 bg-primary/30 rounded w-2/3" />
                  <div className="h-2 bg-primary/20 rounded w-full" />
                  <div className="h-2 bg-primary/20 rounded w-4/5" />
                </div>
                <div className="bg-background/40 rounded-lg p-4 space-y-2">
                  <div className="h-3 bg-primary/30 rounded w-2/3" />
                  <div className="h-2 bg-primary/20 rounded w-full" />
                </div>
                <div className="bg-background/40 rounded-lg p-4 space-y-2">
                  <div className="h-3 bg-primary/30 rounded w-2/3" />
                  <div className="h-2 bg-primary/20 rounded w-4/5" />
                  <div className="h-2 bg-primary/20 rounded w-1/2" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Powerful Features for Educators</h2>
          <p className="text-lg text-foreground/60">Everything you need to manage exams efficiently</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-border/50 p-8 hover:shadow-lg transition-shadow">
            <BarChart3 className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Advanced Analytics</h3>
            <p className="text-foreground/60">
              Get detailed insights on candidate performance with AI-powered analytics and reports
            </p>
          </Card>

          <Card className="border-border/50 p-8 hover:shadow-lg transition-shadow">
            <Users className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Hall Management</h3>
            <p className="text-foreground/60">
              Organize exams across multiple halls with unique codes and seamless candidate management
            </p>
          </Card>

          <Card className="border-border/50 p-8 hover:shadow-lg transition-shadow">
            <Lock className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Secure Platform</h3>
            <p className="text-foreground/60">
              Enterprise-grade security with role-based access control and data encryption
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30 p-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Ready to Transform Your Exams?</h2>
          <p className="text-lg text-foreground/60 mb-8 max-w-2xl mx-auto">
            Join thousands of examiners and candidates revolutionizing exam management with Grade Genius
          </p>
          <Button 
            size="lg"
            onClick={() => onAuthClick('examiner')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          >
            Start Your Free Trial <ArrowRight className="w-5 h-5" />
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/50 backdrop-blur-sm py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">G</span>
                </div>
                <span className="font-bold text-foreground">Grade Genius</span>
              </div>
              <p className="text-sm text-foreground/60">Intelligent exam management platform</p>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><a href="#" className="hover:text-primary">Features</a></li>
                <li><a href="#" className="hover:text-primary">Pricing</a></li>
                <li><a href="#" className="hover:text-primary">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><a href="#" className="hover:text-primary">About</a></li>
                <li><a href="#" className="hover:text-primary">Blog</a></li>
                <li><a href="#" className="hover:text-primary">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><a href="#" className="hover:text-primary">Privacy</a></li>
                <li><a href="#" className="hover:text-primary">Terms</a></li>
                <li><a href="#" className="hover:text-primary">Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8 text-center text-sm text-foreground/60">
            <p>&copy; 2024 Grade Genius. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
