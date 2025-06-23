'use client';

import React, { useState, useEffect } from 'react';
import { Search, Loader2, Clock, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { sanitizeDiagnosis, storage } from '@/lib/utils';
import { toast } from 'sonner';

type Specialty = 'general' | 'pediatrics' | 'obs_gyn';

export function SearchInterface() {
  const [query, setQuery] = useState('');
  const [specialty, setSpecialty] = useState<Specialty>('general');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load recent searches from localStorage
  useEffect(() => {
    const recentSearches = storage.get<string[]>('recentSearches', []);
    setSuggestions(recentSearches.slice(0, 5));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(value.length > 0);
  };

  const handleSearch = (searchQuery?: string) => {
    const finalQuery = sanitizeDiagnosis(searchQuery || query);
    
    if (!finalQuery.trim()) {
      toast.error('Please enter a diagnosis');
      return;
    }

    setIsLoading(true);

    // Save to recent searches
    const recentSearches = storage.get<string[]>('recentSearches', []);
    const updatedSearches = [
      finalQuery,
      ...recentSearches.filter((item) => item !== finalQuery),
    ].slice(0, 10);
    storage.set('recentSearches', updatedSearches);

    // Navigate to the dedicated history page with specialty context
    const encodedDiagnosis = encodeURIComponent(finalQuery);
    const specialtyParam = specialty !== 'general' ? `?specialty=${specialty}` : '';
    window.location.href = `/history/${encodedDiagnosis}${specialtyParam}`;
    
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Only handle specific keys, let everything else pass through normally
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        handleSearch();
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
      // Let all other keys (including space) pass through normally
      default:
        break;
    }
  };

  return (
    <div className="w-full relative">
      {/* Specialty Selection */}
      <div className="mb-fluid-6">
        <div className="flex items-center justify-center px-fluid-1">
          <div className="inline-flex items-center rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 shadow-xl shadow-blue-100/25 dark:shadow-slate-900/25 p-fluid-1 w-full max-w-sm">
            <button
              onClick={() => setSpecialty('general')}
              className={`relative flex-1 text-fluid-sm font-medium rounded-xl transition-all duration-200 py-fluid-2 px-fluid-3 ${
                specialty === 'general'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              General
            </button>
            <button
              onClick={() => setSpecialty('pediatrics')}
              className={`relative flex-1 text-fluid-sm font-medium rounded-xl transition-all duration-200 py-fluid-2 px-fluid-3 ${
                specialty === 'pediatrics'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Pediatrics
            </button>
            <button
              onClick={() => setSpecialty('obs_gyn')}
              className={`relative flex-1 text-fluid-sm font-medium rounded-xl transition-all duration-200 py-fluid-2 px-fluid-2 ${
                specialty === 'obs_gyn'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span className="hidden xs:inline">Obs & Gyn</span>
              <span className="xs:hidden">O&G</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Interface */}
      <div className="w-full">
          {/* Search Input */}
          <div className="relative px-2">
            <div className="group relative">
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 opacity-0 blur transition-all duration-500 group-hover:opacity-100"></div>
              
              {/* Desktop/Tablet Layout */}
              <div className="hidden sm:block relative rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 shadow-xl shadow-blue-100/25 dark:shadow-slate-900/25 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-200/40 dark:hover:shadow-slate-900/40">
                <Search className="absolute left-4 sm:left-6 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition-colors group-focus-within:text-blue-500" />
                <Input
                  type="text"
                  placeholder={`Enter diagnosis${specialty === 'pediatrics' ? ' (pediatric)' : specialty === 'obs_gyn' ? ' (obs & gyn)' : ''}`}
                  value={query}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setShowSuggestions(query.length > 0)}
                  className="border-0 bg-transparent text-theme-fg placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 font-medium"
                  style={{
                    height: 'clamp(3rem, 8vw, 4rem)',
                    paddingLeft: 'clamp(2.5rem, 6vw, 3.5rem)',
                    paddingRight: 'clamp(8rem, 20vw, 9rem)',
                    fontSize: 'clamp(0.875rem, 3vw, 1.125rem)'
                  }}
                  disabled={isLoading}
                />
                <Button
                  onClick={() => handleSearch()}
                  disabled={!query.trim() || isLoading}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-xl font-semibold text-white shadow-lg transition-all hover:shadow-xl focus:ring-2 focus:ring-offset-2 z-10 ${
                    specialty === 'pediatrics'
                      ? 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500/50'
                      : specialty === 'obs_gyn'
                      ? 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500/50'
                      : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500/50'
                  }`}
                  style={{
                    height: 'clamp(2.5rem, 6vw, 3rem)',
                    padding: 'clamp(0.5rem, 2vw, 1.5rem)',
                    fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)'
                  }}
                  size="sm"
                >
                  {isLoading ? (
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden xs:inline">Generate</span>
                      <span className="xs:hidden">Go</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Mobile Layout - Input Only */}
              <div className="sm:hidden">
                <div className="relative rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 shadow-xl shadow-blue-100/25 dark:shadow-slate-900/25 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-200/40 dark:hover:shadow-slate-900/40">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition-colors group-focus-within:text-blue-500" />
                  <Input
                    type="text"
                    placeholder={`Enter diagnosis${specialty === 'pediatrics' ? ' (pediatric)' : specialty === 'obs_gyn' ? ' (obs & gyn)' : ''}`}
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowSuggestions(query.length > 0)}
                    className="border-0 bg-transparent pl-12 pr-4 text-theme-fg placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 font-medium"
                    style={{
                      height: 'clamp(3rem, 12vw, 4rem)',
                      fontSize: 'clamp(0.875rem, 4vw, 1.125rem)'
                    }}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Mobile Generate Button - Outside the input group */}
            <div className="sm:hidden mt-4 text-center">
              <button
                type="button"
                onClick={() => handleSearch()}
                disabled={!query.trim() || isLoading}
                className={`inline-flex items-center gap-2 font-medium transition-all duration-200 py-3 px-4 min-h-[48px] touch-manipulation rounded-xl ${
                  !query.trim() || isLoading
                    ? 'text-slate-400 dark:text-slate-500 cursor-not-allowed'
                    : specialty === 'pediatrics'
                    ? 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 active:scale-95 hover:bg-emerald-50 dark:hover:bg-emerald-950'
                    : specialty === 'obs_gyn'
                    ? 'text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 active:scale-95 hover:bg-rose-50 dark:hover:bg-rose-950'
                    : 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 active:scale-95 hover:bg-blue-50 dark:hover:bg-blue-950'
                }`}
                style={{ fontSize: 'clamp(0.875rem, 4vw, 1rem)' }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Template
                  </>
                )}
              </button>
            </div>

            {/* Suggestions Dropdown - Positioned ABOVE the input */}
            {showSuggestions && suggestions.length > 0 && (
              <Card className="absolute bottom-full z-50 mb-3 w-full border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md shadow-2xl shadow-slate-200/60 dark:shadow-slate-900/60 ring-1 ring-black/5 dark:ring-white/10">
                <CardContent className="p-2 sm:p-3">
                  <div className="mb-2 sm:mb-3 flex items-center gap-2 px-2 sm:px-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <Clock className="h-3 w-3" />
                    Recent searches
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="flex w-full items-center gap-3 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-left font-medium text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 focus:bg-slate-50 dark:focus:bg-slate-700 focus:outline-none"
                      style={{ fontSize: 'clamp(0.75rem, 3vw, 0.875rem)' }}
                    >
                      <Search className="h-3 w-3 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                      <span className="truncate">{suggestion}</span>
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
    </div>
  );
}