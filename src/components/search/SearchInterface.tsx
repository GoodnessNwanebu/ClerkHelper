'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Search, Loader2, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HistoryDisplay } from '@/components/history/HistoryDisplay';
import { useSearch } from '@/hooks/useSearch';
import { debounce, sanitizeDiagnosis, storage } from '@/lib/utils';
import { toast } from 'sonner';
import type { HistoryTemplate } from '@/types';

export function SearchInterface() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { searchState, search, clearSearch } = useSearch();

  // Load recent searches from localStorage
  useEffect(() => {
    const recentSearches = storage.get<string[]>('recentSearches', []);
    setSuggestions(recentSearches.slice(0, 5));
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      if (searchQuery.trim().length >= 2) {
        search(searchQuery);
      }
    }, 500),
    [search]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = sanitizeDiagnosis(e.target.value);
    setQuery(value);
    setShowSuggestions(value.length > 0);
    
    if (value.trim().length >= 2) {
      debouncedSearch(value);
    }
  };

  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (!finalQuery.trim()) {
      toast.error('Please enter a diagnosis');
      return;
    }

    // Save to recent searches
    const recentSearches = storage.get<string[]>('recentSearches', []);
    const updatedSearches = [
      finalQuery,
      ...recentSearches.filter((item) => item !== finalQuery),
    ].slice(0, 10);
    storage.set('recentSearches', updatedSearches);

    search(finalQuery);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleBack = () => {
    clearSearch();
    setQuery('');
  };

  // Show history template if we have results
  if (searchState.data && !searchState.loading) {
    return (
      <HistoryDisplay
        template={searchState.data}
        onBack={handleBack}
        diagnosis={searchState.query}
      />
    );
  }

  return (
    <div className="w-full">
      {/* Search Input */}
      <div className="relative">
        <div className="group relative">
          <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 opacity-0 blur transition-all duration-500 group-hover:opacity-100"></div>
          <div className="relative rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-xl shadow-blue-100/25 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-200/40">
            <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
            <Input
              type="text"
              placeholder="Enter diagnosis"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              onFocus={() => setShowSuggestions(query.length > 0)}
              className="h-16 border-0 bg-transparent pl-14 pr-32 text-lg font-medium placeholder:text-sm placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
              disabled={searchState.loading}
            />
            <Button
              onClick={() => handleSearch()}
              disabled={!query.trim() || searchState.loading}
              className="absolute right-2 top-1/2 h-12 -translate-y-1/2 rounded-xl px-6 font-semibold text-white shadow-lg transition-all hover:shadow-xl focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 z-10"
              size="sm"
              style={{ 
                backgroundColor: '#2563eb !important',
                borderColor: '#2563eb !important',
                opacity: '1 !important',
                backdropFilter: 'none',
                border: '1px solid #2563eb'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1d4ed8';
                e.currentTarget.style.borderColor = '#1d4ed8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb';
                e.currentTarget.style.borderColor = '#2563eb';
              }}
            >
              {searchState.loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <Card className="absolute top-full z-10 mt-3 w-full border-0 bg-white/90 backdrop-blur-md shadow-2xl shadow-slate-200/60">
            <CardContent className="p-3">
              <div className="mb-3 flex items-center gap-2 px-3 text-xs font-medium text-slate-500">
                <Clock className="h-3 w-3" />
                Recent searches
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 hover:text-slate-900 focus:bg-slate-50 focus:outline-none"
                >
                  <Search className="h-3 w-3 text-slate-400" />
                  {suggestion}
                </button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Loading State */}
      {searchState.loading && (
        <Card className="mt-8 border-0 bg-white/70 backdrop-blur-sm shadow-xl shadow-blue-100/30">
          <CardContent className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 blur-xl"></div>
                <Loader2 className="relative mx-auto h-12 w-12 animate-spin text-blue-600" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-slate-900">
                Generating history template
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Creating comprehensive questions for "{searchState.query}"
              </p>
              <div className="mt-4 flex items-center justify-center gap-1">
                <div className="h-1 w-1 rounded-full bg-blue-400 animate-pulse"></div>
                <div className="h-1 w-1 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="h-1 w-1 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {searchState.error && !searchState.loading && (
        <Card className="mt-8 border border-red-200/50 bg-red-50/70 backdrop-blur-sm shadow-xl shadow-red-100/30">
          <CardContent className="py-8">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-red-900">
                Something went wrong
              </h3>
              <p className="mb-4 text-sm text-red-700">
                {searchState.error}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSearch()}
                className="border-red-200 bg-white/80 text-red-700 hover:bg-red-50"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 