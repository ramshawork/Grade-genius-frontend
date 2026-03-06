'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { dummyUsers } from '@/lib/dummy-data';
import { LogOut, Settings, HelpCircle } from 'lucide-react';

export default function ExaminerNav() {
  const examiner = dummyUsers.examiner1;

  const handleLogout = () => {
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userEmail');
    window.location.href = '/';
  };

  return (
    <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">G</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-foreground">Grade Genius</span>
            <span className="text-xs text-foreground/50">Teacher Portal</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-8">
          <a href="/examiner-dashboard" className="text-foreground/70 hover:text-foreground font-medium text-sm transition-colors">
            Dashboard
          </a>
          <a href="#" className="text-foreground/70 hover:text-foreground font-medium text-sm transition-colors">
            Exams
          </a>
          <a href="#" className="text-foreground/70 hover:text-foreground font-medium text-sm transition-colors">
            Halls
          </a>
          <a href="#" className="text-foreground/70 hover:text-foreground font-medium text-sm transition-colors">
            Analytics
          </a>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <Avatar className="w-8 h-8 bg-primary">
                  <AvatarFallback className="text-primary-foreground font-bold text-sm">
                    {examiner.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col items-start">
                  <p className="text-sm font-medium text-foreground">{examiner.name}</p>
                  <p className="text-xs text-foreground/60">Teacher</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium text-foreground">{examiner.name}</p>
                <p className="text-xs text-foreground/60">{examiner.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <HelpCircle className="w-4 h-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 cursor-pointer text-destructive" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
