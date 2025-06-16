'use client';

import { useState, useCallback } from 'react';
import type { SearchState, HistoryTemplate, GenerateTemplateResponse } from '@/types';

export function useSearch() {
  const [searchState, setSearchState] = useState<SearchState>({
    data: null,
    loading: false,
    error: null,
    query: '',
    hasSearched: false,
  });

  const search = useCallback(async (query: string) => {
    setSearchState(prev => ({
      ...prev,
      loading: true,
      error: null,
      query: query.trim(),
      hasSearched: true,
    }));

    try {
      const response = await fetch('/api/generate-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          diagnosis: query.trim(),
          use_cache: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: GenerateTemplateResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate template');
      }

      if (!result.data) {
        throw new Error('No template data received');
      }

      setSearchState(prev => ({
        ...prev,
        data: result.data,
        loading: false,
        error: null,
      }));
    } catch (error) {
      console.error('Search error:', error);
      
      let errorMessage = 'Something went wrong. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('HTTP error')) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = error.message;
        }
      }

      setSearchState(prev => ({
        ...prev,
        data: null,
        loading: false,
        error: errorMessage,
      }));
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