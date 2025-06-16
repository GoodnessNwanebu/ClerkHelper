'use client';

import React, { useState, useEffect } from 'react';
import { Search, Loader2, Clock, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { sanitizeDiagnosis, storage } from '@/lib/utils';
import { toast } from 'sonner';

export function SearchInterface() {
  const [query, setQuery] = useState('');
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
    console.log('🔍 handleSearch called with:', { searchQuery, currentQuery: query });
    const finalQuery = sanitizeDiagnosis(searchQuery || query);
    console.log('✅ Final query after sanitization:', finalQuery);
    
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

    // Navigate to the dedicated history page
    const encodedDiagnosis = encodeURIComponent(finalQuery);
    console.log('🚀 Navigating to:', `/history/${encodedDiagnosis}`);
    window.location.href = `/history/${encodedDiagnosis}`;
    
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
      {/* Search Interface */}
      <div className="w-full">
          {/* Search Input */}
          <div className="relative">
            <div className="group relative">
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 opacity-0 blur transition-all duration-500 group-hover:opacity-100"></div>
              
              {/* Desktop/Tablet Layout */}
              <div className="hidden sm:block relative rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 shadow-xl shadow-blue-100/25 dark:shadow-slate-900/25 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-200/40 dark:hover:shadow-slate-900/40">
                <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition-colors group-focus-within:text-blue-500" />
                <Input
                  type="text"
                  placeholder="Enter diagnosis"
                  value={query}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setShowSuggestions(query.length > 0)}
                  className="h-16 border-0 bg-transparent pl-14 pr-36 text-lg font-medium text-theme-fg placeholder:text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                  disabled={isLoading}
                />
                <Button
                  onClick={() => handleSearch()}
                  disabled={!query.trim() || isLoading}
                  className="absolute right-2 top-1/2 h-12 -translate-y-1/2 rounded-xl px-6 font-semibold text-white shadow-lg transition-all hover:shadow-xl focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 z-10 bg-blue-600 hover:bg-blue-700"
                  size="sm"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate
                    </>
                  )}
                </Button>
              </div>

              {/* Mobile Layout */}
              <div className="sm:hidden space-y-4">
                <div className="relative rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 shadow-xl shadow-blue-100/25 dark:shadow-slate-900/25 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-200/40 dark:hover:shadow-slate-900/40">
                  <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition-colors group-focus-within:text-blue-500" />
                  <Input
                    type="text"
                    placeholder="Enter diagnosis"
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowSuggestions(query.length > 0)}
                    className="h-16 border-0 bg-transparent pl-14 pr-6 text-lg font-medium text-theme-fg placeholder:text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                    disabled={isLoading}
                  />
                </div>
                
                {/* Mobile Generate Link */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      console.log('📱 Mobile button clicked! Current query:', query);
                      handleSearch();
                    }}
                    disabled={!query.trim() || isLoading}
                    className={`inline-flex items-center gap-2 text-base font-medium transition-all duration-200 ${
                      !query.trim() || isLoading
                        ? 'text-slate-400 dark:text-slate-500 cursor-not-allowed'
                        : 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 active:scale-95'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Suggestions Dropdown - Positioned ABOVE the input */}
            {showSuggestions && suggestions.length > 0 && (
              <Card className="absolute bottom-full z-50 mb-3 w-full border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md shadow-2xl shadow-slate-200/60 dark:shadow-slate-900/60 ring-1 ring-black/5 dark:ring-white/10">
                <CardContent className="p-3">
                  <div className="mb-3 flex items-center gap-2 px-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <Clock className="h-3 w-3" />
                    Recent searches
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 focus:bg-slate-50 dark:focus:bg-slate-700 focus:outline-none"
                    >
                      <Search className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                      {suggestion}
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