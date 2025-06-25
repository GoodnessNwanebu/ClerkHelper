'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { HPCDisplay } from '@/components/hpc/HPCDisplay';
import { useSearch } from '@/hooks/useSearch';
import { Loader2 } from 'lucide-react';

export default function HPCPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const diagnosis = decodeURIComponent(params.diagnosis as string);
  const specialty = searchParams.get('specialty') || 'general';
  const patientAge = searchParams.get('age') || undefined;
  const { search, searchState } = useSearch();

  useEffect(() => {
    if (diagnosis && !searchState.hasSearched && !searchState.loading) {
      // Pass age parameter for pediatric cases
      const searchOptions = {
        diagnosis,
        specialty,
        ...(specialty === 'pediatrics' && patientAge && { patient_age: patientAge })
      };
      
      search(searchOptions.diagnosis, searchOptions.specialty, searchOptions.patient_age);
    }
  }, [diagnosis, specialty, patientAge, search, searchState.hasSearched, searchState.loading]);

  const handleBack = () => {
    router.push('/');
  };

  // Show loading state while generating
  if (searchState.loading) {
    return (
      <div className="min-h-screen bg-theme-bg dark:bg-slate-950 transition-colors duration-300 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 blur-xl"></div>
            <Loader2 className="relative mx-auto h-12 w-12 animate-spin text-blue-600" />
          </div>
          <h3 className="mt-6 text-lg font-semibold text-theme-fg">
            Generating history template
          </h3>
          <p className="mt-2 text-sm text-theme-fg-secondary">
            Creating comprehensive questions for &quot;{diagnosis}&quot;
            {specialty !== 'general' && (
              <span className="block mt-1 text-xs">
                Specialty: {specialty === 'pediatrics' ? `Pediatrics${patientAge ? ` (${patientAge} years)` : ''}` : specialty === 'obs_gyn' ? 'Obstetrics & Gynecology' : specialty}
              </span>
            )}
          </p>
        </div>
      </div>
    );
  }

  // Show error state if there was an error
  if (searchState.error) {
    return (
      <div className="min-h-screen bg-theme-bg dark:bg-slate-950 transition-colors duration-300 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
            <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-red-900 dark:text-red-100">
            Something went wrong
          </h3>
          <p className="mb-4 text-sm text-red-700 dark:text-red-200">
            {searchState.error}
          </p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  // Show template if we have data
  if (searchState.data) {
    // Transform the data to match the HPCDisplay component structure
    const templateData = searchState.data;
    const hpcData = {
      diagnosis: templateData.diagnosis_name,
      specialty: templateData.specialty,
      presenting_complaints: templateData.sections.map(section => ({
        complaint: section.title,
        description: `Common presentation in ${templateData.specialty.toLowerCase()}`,
        questions: section.questions.map(q => {
          if (typeof q === 'string') {
            return { question: q, rationale: 'Clinical assessment question' };
          }
          return {
            question: q.question,
            rationale: q.clinical_rationale || q.hint || 'Clinical assessment question'
          };
        })
      }))
    };

    return (
      <HPCDisplay
        data={hpcData}
        isLoading={false}
      />
    );
  }

  // Initial state - should trigger the search effect
  return (
    <div className="min-h-screen bg-theme-bg dark:bg-slate-950 transition-colors duration-300 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 blur-xl"></div>
          <Loader2 className="relative mx-auto h-12 w-12 animate-spin text-blue-600" />
        </div>
        <h3 className="mt-6 text-lg font-semibold text-theme-fg">
          Preparing to generate template
        </h3>
        <p className="mt-2 text-sm text-theme-fg-secondary">
          Initializing for &quot;{diagnosis}&quot;
        </p>
      </div>
    </div>
  );
} 