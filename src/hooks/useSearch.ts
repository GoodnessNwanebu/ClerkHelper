'use client';

import { useState, useCallback } from 'react';
import type { SearchState, GenerateTemplateRequest, GenerateTemplateResponse } from '@/types';
import { toast } from 'sonner';

export function useSearch() {
  const [searchState, setSearchState] = useState<SearchState>({
    data: null,
    loading: false,
    error: null,
    query: '',
    hasSearched: false,
  });

  const search = useCallback(async (
    query: string, 
    specialty?: string,
    patientAge?: string
  ) => {
    if (!query.trim()) {
      toast.error('Please enter a diagnosis');
      return;
    }

    setSearchState(prev => ({
      ...prev,
      loading: true,
      error: null,
      query: query.trim(),
      hasSearched: true,
    }));

    try {
      const requestBody: GenerateTemplateRequest = {
        diagnosis: query.trim(),
        specialty,
        ...(patientAge && { patient_age: patientAge })
      };

      console.log('Sending request:', requestBody);

      const response = await fetch('/api/generate-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result: GenerateTemplateResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate template');
      }

      setSearchState(prev => ({
        ...prev,
        data: result.data || null,
        loading: false,
        error: null,
      }));

      // Show success message with generation info
      const ageContext = patientAge ? ` for ${patientAge} year olds` : '';
      const specialtyContext = specialty && specialty !== 'general' 
        ? ` (${specialty === 'pediatrics' ? 'Pediatrics' : specialty === 'obs_gyn' ? 'Obs & Gyn' : specialty})` 
        : '';
      
      toast.success(
        `Generated PC/HPC questions for "${query}"${specialtyContext}${ageContext}`,
        {
          description: result.from_cache 
            ? 'Retrieved from cache' 
            : `Generated in ${result.generation_time ? Math.round(result.generation_time / 1000) : '~3'}s`,
        }
      );

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Search error:', error);
      
      setSearchState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        data: null,
      }));

      toast.error('Failed to generate template', {
        description: errorMessage,
      });
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchState({
      data: null,
      loading: false,
      error: null,
      query: '',
      hasSearched: false,
    });
  }, []);

  return {
    searchState,
    search,
    clearSearch,
  };
}