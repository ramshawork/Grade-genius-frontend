'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import LandingPage from '@/components/landing-page';
import AuthPortal from '@/components/auth-portal';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'auth'>('landing');
  const [userRole, setUserRole] = useState<'examiner' | 'candidate' | null>(null);

  const handleAuthClick = (role: 'examiner' | 'candidate') => {
    setUserRole(role);
    setCurrentPage('auth');
  };

  const handleBackClick = () => {
    setCurrentPage('landing');
    setUserRole(null);
  };

  if (currentPage === 'auth') {
    return (
      <AuthPortal
        role={userRole!}
        onBack={handleBackClick}
        onSuccess={() => {
          // This would normally redirect to dashboard
          // For demo, we'll just navigate within the page
        }}
      />
    );
  }

  return <LandingPage onAuthClick={handleAuthClick} />;
}
