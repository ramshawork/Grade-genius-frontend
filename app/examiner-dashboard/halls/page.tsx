'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import ExaminerNav from '@/components/examiner-nav';
import { dummyHalls } from '@/lib/dummy-data';
import { Plus, Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HallsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newHallName, setNewHallName] = useState('');

  const filteredHalls = dummyHalls.filter(hall =>
    hall.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hall.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <ExaminerNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Exam Halls</h1>
          <p className="text-foreground/60 mt-2">Create and manage examination halls</p>
        </div>

        {/* Search and Create Button */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <Input
              placeholder="Search halls by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-border/50"
            />
          </div>
          <Button className="bg-primary hover:bg-primary/90 gap-2" onClick={() => setShowCreateForm(!showCreateForm)}>
            <Plus className="w-4 h-4" />
            Create Hall
          </Button>
        </div>

        {/* Create Hall Form */}
        {showCreateForm && (
          <Card className="border-primary/30 bg-primary/5 p-6 mb-8">
            <h3 className="text-lg font-bold text-foreground mb-4">Create New Hall</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Hall Name</label>
                <Input
                  placeholder="e.g., Main Hall A"
                  value={newHallName}
                  onChange={(e) => setNewHallName(e.target.value)}
                  className="bg-background border-border/50"
                />
              </div>
              <div className="flex gap-3">
                <Button className="bg-primary hover:bg-primary/90">Create Hall</Button>
                <Button variant="outline" className="border-border/50 bg-transparent" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Halls Grid */}
        {filteredHalls.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHalls.map(hall => {
              const occupancy = Math.round((hall.candidates.length / hall.capacity) * 100);
              const occupancyColor = occupancy < 50 ? 'text-secondary' : occupancy < 80 ? 'text-primary' : 'text-destructive';
              
              return (
                <Link key={hall.id} href={`/examiner-dashboard/halls/${hall.id}`}>
                  <Card className="border-border/50 p-6 hover:shadow-lg transition-all cursor-pointer h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground">{hall.name}</h3>
                        <p className="text-sm text-primary font-mono font-bold mt-2">{hall.code}</p>
                      </div>
                    </div>

                    <div className="space-y-4 flex-1">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-foreground/60 uppercase tracking-wider">Occupancy</span>
                          <span className={`text-sm font-bold ${occupancyColor}`}>{occupancy}%</span>
                        </div>
                        <div className="w-full bg-border rounded-full h-2">
                          <div
                            className="bg-primary rounded-full h-2 transition-all"
                            style={{ width: `${occupancy}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-foreground/60 text-xs uppercase tracking-wider">Candidates</p>
                          <p className="text-xl font-bold text-foreground">{hall.candidates.length}</p>
                        </div>
                        <div>
                          <p className="text-foreground/60 text-xs uppercase tracking-wider">Capacity</p>
                          <p className="text-xl font-bold text-foreground">{hall.capacity}</p>
                        </div>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full border-border/50 bg-transparent gap-2 mt-4">
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <Card className="border-border/50 p-12 text-center">
            <p className="text-foreground/60 mb-4">No halls found matching your search</p>
            <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Hall
            </Button>
          </Card>
        )}
      </main>
    </div>
  );
}
