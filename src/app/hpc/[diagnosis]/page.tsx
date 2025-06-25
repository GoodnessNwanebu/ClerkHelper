'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HPCDisplay } from '@/components/hpc/HPCDisplay';
import { useSearch } from '@/hooks/useSearch';
import { offlineStorage, type OfflineConversation, type HPCResponse } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export default function HPCPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const diagnosis = decodeURIComponent(params.diagnosis as string);
  const specialty = searchParams.get('specialty') || 'general';
  const patientAge = searchParams.get('age') || undefined;
  const isOfflineView = searchParams.get('offline') === 'true';
  const conversationId = searchParams.get('id');
  
  const { search, searchState } = useSearch();
  const [offlineData, setOfflineData] = useState<OfflineConversation | null>(null);

  // Load offline conversation if viewing offline
  useEffect(() => {
    if (isOfflineView && conversationId) {
      const conversation = offlineStorage.getConversationById(conversationId);
      if (conversation) {
        setOfflineData(conversation);
      } else {
        // Conversation not found, redirect to offline page
        router.push('/offline');
      }
    }
  }, [isOfflineView, conversationId, router]);

  // Normal search effect for online mode
  useEffect(() => {
    if (!isOfflineView && diagnosis && !searchState.hasSearched && !searchState.loading) {
      // Pass age parameter for pediatric cases
      const searchOptions = {
        diagnosis,
        specialty,
        ...(specialty === 'pediatrics' && patientAge && { patient_age: patientAge })
      };
      
      search(searchOptions.diagnosis, searchOptions.specialty, searchOptions.patient_age);
    }
  }, [isOfflineView, diagnosis, specialty, patientAge, search, searchState.hasSearched, searchState.loading]);

  // Auto-save conversation when search completes successfully
  useEffect(() => {
    if (!isOfflineView && searchState.data && !searchState.loading && !searchState.error) {
      try {
        const templateData = searchState.data;
        
        // Convert specialty to storage format
        const convertSpecialtyForStorage = (spec: string): HPCResponse['specialty'] => {
          const specialtyMap: Record<string, HPCResponse['specialty']> = {
            'cardiology': 'cardiology',
            'respiratory': 'respiratory', 
            'gastroenterology': 'gastroenterology',
            'neurology': 'neurology',
            'endocrinology': 'endocrinology',
            'nephrology': 'nephrology',
            'rheumatology': 'rheumatology',
            'hematology': 'hematology',
            'infectious_diseases': 'infectious diseases',
            'emergency_medicine': 'emergency medicine',
            'pediatrics': 'pediatrics',
            'obstetrics_gynecology': 'obs & gynae'
          };
          return specialtyMap[spec] || 'emergency medicine';
        };
        
        // Convert to HPCResponse format for storage
        const hpcResponse: HPCResponse = {
          diagnosis: templateData.diagnosis_name,
          specialty: convertSpecialtyForStorage(templateData.specialty),
          patient_age: parseInt(patientAge || '30'),
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

        // Save to offline storage
        offlineStorage.saveConversation(hpcResponse);
      } catch (error) {
        console.error('Failed to save conversation:', error);
      }
    }
  }, [isOfflineView, searchState.data, searchState.loading, searchState.error, patientAge]);

  const handleBack = () => {
    if (isOfflineView) {
      router.push('/offline');
    } else {
      router.push('/');
    }
  };

  // Show loading state while generating
  if (!isOfflineView && searchState.loading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors duration-300 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 blur-xl"></div>
            <Loader2 className="relative mx-auto h-12 w-12 animate-spin text-blue-600" />
          </div>
          <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Generate HPC
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
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
  if (!isOfflineView && searchState.error) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors duration-300 flex items-center justify-center">
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

  // Show offline data if in offline mode
  if (isOfflineView && offlineData) {
    const hpcData = {
      diagnosis: offlineData.hpc.diagnosis,
      specialty: offlineData.hpc.specialty,
      presenting_complaints: offlineData.hpc.presenting_complaints
    };

    return <HPCDisplay data={hpcData} isLoading={false} />;
  }

  // Show template if we have data
  if (!isOfflineView && searchState.data) {
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