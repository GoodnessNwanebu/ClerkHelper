'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { HPCDisplay } from '@/components/hpc/HPCDisplay';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { HPCButton } from '@/components/ui/HPCButton';

interface HPCData {
  diagnosis: string;
  specialty: string;
  presenting_complaints: Array<{
    complaint: string;
    description: string;
    questions: Array<{
      question: string;
      rationale: string;
    }>;
  }>;
}

export default function HPCPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const diagnosis = decodeURIComponent(params.diagnosis as string);
  const specialty = searchParams.get('specialty') || 'general';
  
  const [hpcData, setHpcData] = useState<HPCData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHPCData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/generate-hpc', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            diagnosis,
            specialty,
          }),
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Failed to generate HPC content');
        }

        setHpcData(result.data);
      } catch (err) {
        console.error('Error fetching HPC data:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (diagnosis) {
      fetchHPCData();
    }
  }, [diagnosis, specialty]);

  const handleRetry = () => {
    setError(null);
    const fetchHPCData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/generate-hpc', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            diagnosis,
            specialty,
          }),
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Failed to generate HPC content');
        }

        setHpcData(result.data);
      } catch (err) {
        console.error('Error fetching HPC data:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHPCData();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-theme-bg via-theme-bg-secondary to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800/30">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/">
              <HPCButton variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to ClerkSmart
              </HPCButton>
            </Link>
          </div>

          {/* Error Display */}
          <div className="max-w-2xl mx-auto">
            <Card className="border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/20">
              <CardContent className="p-6 text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
                  Unable to Generate HPC Content
                </h2>
                <p className="text-red-700 dark:text-red-300 mb-4">
                  {error}
                </p>
                <div className="flex gap-3 justify-center">
                  <HPCButton onClick={handleRetry} variant="secondary" size="sm">
                    Try Again
                  </HPCButton>
                  <Link href="/">
                    <HPCButton variant="ghost" size="sm">
                      Go Back
                    </HPCButton>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile View - Full Screen */}
      <div className="md:hidden">
        {isLoading || !hpcData ? (
          <HPCDisplay 
            data={{
              diagnosis: diagnosis,
              specialty: specialty,
              presenting_complaints: []
            }} 
            isLoading={true} 
          />
        ) : (
          <HPCDisplay data={hpcData} />
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block min-h-screen bg-gradient-to-br from-theme-bg via-theme-bg-secondary to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800/30">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/">
              <HPCButton variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to ClerkSmart
              </HPCButton>
            </Link>
          </div>

          {/* HPC Content */}
          {isLoading || !hpcData ? (
            <HPCDisplay 
              data={{
                diagnosis: diagnosis,
                specialty: specialty,
                presenting_complaints: []
              }} 
              isLoading={true} 
            />
          ) : (
            <HPCDisplay data={hpcData} />
          )}
        </div>
      </div>
    </>
  );
} 