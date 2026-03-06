'use client';

import React from "react"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { dummyUsers } from '@/lib/dummy-data';

interface AuthPortalProps {
  role: 'examiner' | 'candidate';
  onBack: () => void;
  onSuccess: () => void;
}

export default function AuthPortal({ role, onBack, onSuccess }: AuthPortalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Registration State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [instituteName, setInstituteName] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const dummyEmail = role === 'examiner'
    ? dummyUsers.examiner1.email
    : dummyUsers.candidate1.email;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate login - in real app would call API
    setTimeout(() => {
      if (email === dummyEmail && password === 'password') {
        const userName = role === 'examiner' ? dummyUsers.examiner1.name.split(' ')[0] : dummyUsers.candidate1.name.split(' ')[0];
        // Store session and redirect to dashboard
        sessionStorage.setItem('userRole', role);
        sessionStorage.setItem('userEmail', email);
        sessionStorage.setItem('userName', userName);

        if (role === 'examiner') {
          window.location.href = '/examiner-dashboard';
        } else {
          window.location.href = '/candidate-portal';
        }
      } else {
        setError('Invalid email or password');
      }
      setIsLoading(false);
    }, 600);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!firstName || !lastName || !email || !password) {
      setError('Please fill in all standard fields.');
      return;
    }
    if (role === 'candidate' && (!guardianName || !guardianPhone)) {
      setError('Please fill in guardian details for candidate registration.');
      return;
    }
    if (role === 'examiner' && !instituteName) {
      setError('Please provide your institute name.');
      return;
    }

    setIsLoading(true);

    // Simulate persistent registration via localStorage
    setTimeout(() => {
      const newUser = {
        role,
        firstName,
        lastName,
        email,
        password, // Never do this in production
        ...(role === 'candidate' ? { guardianName, guardianPhone } : {}),
        ...(role === 'examiner' ? { instituteName } : {}),
      };

      // Save to local storage to act as our backend
      const existingUsersStr = localStorage.getItem('gradeGeniusUsers');
      const existingUsers = existingUsersStr ? JSON.parse(existingUsersStr) : [];
      localStorage.setItem('gradeGeniusUsers', JSON.stringify([...existingUsers, newUser]));

      // Set active session
      sessionStorage.setItem('userRole', role);
      sessionStorage.setItem('userEmail', email);
      sessionStorage.setItem('userName', firstName);

      toast({
        title: 'Registration Successful',
        description: `Welcome aboard, ${firstName}!`,
      });

      if (role === 'examiner') {
        window.location.href = '/examiner-dashboard';
      } else {
        window.location.href = '/candidate-portal';
      }
      setIsLoading(false);
    }, 800);
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
  };

  const roleTitle = role === 'examiner' ? 'Examiner' : 'Candidate';
  const demoText = `Demo: Use email: ${dummyEmail}\nPassword: password`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        {/* Auth Card */}
        <Card className="border-border/50 p-8 space-y-6">
          {/* Header */}
          <div className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-2xl">G</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
            </h1>
            <p className="text-foreground/60">
              {mode === 'login' ? `Sign in as a ${roleTitle}` : `Register as a ${roleTitle}`}
            </p>
          </div>

          {/* Demo Credentials (Login Only) */}
          {mode === 'login' && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-sm text-foreground/70">
              <p className="font-semibold text-primary mb-1">Demo Credentials:</p>
              <p className="whitespace-pre-wrap text-xs">{demoText}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">

            {/* Registration specific fields */}
            {mode === 'register' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">First Name</label>
                    <Input
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={isLoading}
                      className="bg-background border-border/50 focus-visible:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Last Name</label>
                    <Input
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={isLoading}
                      className="bg-background border-border/50 focus-visible:ring-primary"
                    />
                  </div>
                </div>

                {role === 'examiner' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Institute Name</label>
                    <Input
                      placeholder="e.g., University of Oxford"
                      value={instituteName}
                      onChange={(e) => setInstituteName(e.target.value)}
                      disabled={isLoading}
                      className="bg-background border-border/50 focus-visible:ring-primary"
                    />
                  </div>
                )}

                {role === 'candidate' && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Guardian Name</label>
                      <Input
                        placeholder="Guardian Name"
                        value={guardianName}
                        onChange={(e) => setGuardianName(e.target.value)}
                        disabled={isLoading}
                        className="bg-background border-border/50 focus-visible:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Guardian Phone</label>
                      <Input
                        placeholder="Phone Number"
                        value={guardianPhone}
                        onChange={(e) => setGuardianPhone(e.target.value)}
                        disabled={isLoading}
                        className="bg-background border-border/50 focus-visible:ring-primary"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                type="email"
                placeholder="your.email@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="bg-background border-border/50 focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={mode === 'register' ? 'Choose a strong password' : 'Enter your password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="bg-background border-border/50 focus-visible:ring-primary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-4"
            >
              {isLoading
                ? (mode === 'login' ? 'Signing in...' : 'Registering...')
                : (mode === 'login' ? 'Sign In' : 'Register')
              }
            </Button>
          </form>

          {/* Demo Buttons (Login Only) */}
          {mode === 'login' && (
            <div className="space-y-3 border-t border-border/50 pt-6">
              <p className="text-xs text-center text-foreground/60">Or use demo account directly:</p>
              <Button
                variant="outline"
                className="w-full border-primary/20 hover:bg-primary/10 bg-transparent"
                onClick={() => {
                  const userName = role === 'examiner' ? dummyUsers.examiner1.name.split(' ')[0] : dummyUsers.candidate1.name.split(' ')[0];
                  sessionStorage.setItem('userRole', role);
                  sessionStorage.setItem('userEmail', dummyEmail);
                  sessionStorage.setItem('userName', userName);
                  if (role === 'examiner') {
                    window.location.href = '/examiner-dashboard';
                  } else {
                    window.location.href = '/candidate-portal';
                  }
                }}
              >
                Enter as Demo {roleTitle}
              </Button>
            </div>
          )}
        </Card>

        {/* Footer Toggle */}
        <div className="mt-8 text-center text-sm font-medium bg-background p-4 rounded-lg shadow-sm sm:bg-transparent sm:shadow-none sm:p-0">
          <p className="text-foreground/80">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={toggleMode}
              className="text-primary hover:text-primary/80 font-bold underline decoration-primary/30 underline-offset-2 ml-1"
            >
              {mode === 'login' ? 'Sign up here' : 'Sign in here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
