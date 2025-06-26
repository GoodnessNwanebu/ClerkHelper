'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { HPCButton } from '@/components/ui/HPCButton';
import { 
  ChevronDown, 
  Lightbulb, 
  BookOpen, 
  Share2, 
  Download, 
  ArrowLeft,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface HPCQuestion {
  question: string;
  rationale: string;
}

interface PresentingComplaint {
  complaint: string;
  description: string;
  questions: HPCQuestion[];
}

interface HPCData {
  diagnosis: string;
  specialty: string;
  presenting_complaints: PresentingComplaint[];
}

interface HPCDisplayMobileProps {
  data: HPCData;
  isLoading?: boolean;
}

export function HPCDisplayMobile({ data, isLoading = false }: HPCDisplayMobileProps) {
  const [currentComplaintIndex, setCurrentComplaintIndex] = useState(0);
  const [showRationales, setShowRationales] = useState(false);
  const [showComplaintsList, setShowComplaintsList] = useState(false);
  const [isPWA, setIsPWA] = useState(false);

  // Detect PWA mode
  useEffect(() => {
    const checkPWAMode = () => {
      // Check if running in standalone mode (PWA)
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      // Also check for iOS PWA
      const isIOSPWA = (window.navigator as any).standalone === true;
      // Check for Android PWA indicator
      const isAndroidPWA = document.referrer.includes('android-app://');
      
      setIsPWA(isStandalone || isIOSPWA || isAndroidPWA);
    };

    checkPWAMode();
    
    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', checkPWAMode);
    
    return () => mediaQuery.removeEventListener('change', checkPWAMode);
  }, []);

  const currentComplaint = data.presenting_complaints[currentComplaintIndex];
  const totalComplaints = data.presenting_complaints.length;

  const handleNext = () => {
    if (currentComplaintIndex < totalComplaints - 1) {
      setCurrentComplaintIndex(currentComplaintIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentComplaintIndex > 0) {
      setCurrentComplaintIndex(currentComplaintIndex - 1);
    }
  };

  const handleShare = async () => {
    const shareText = `ClerkSmart HPC - ${data.diagnosis}\n\n${currentComplaint.complaint}\n\n${currentComplaint.questions
      .map((q, i) => `${i + 1}. ${q.question}`)
      .join('\n')}`;

    try {
      await navigator.share({
        title: `${currentComplaint.complaint} - ${data.diagnosis}`,
        text: shareText,
      });
      toast.success('Shared successfully!');
    } catch (error) {
      try {
        await navigator.clipboard.writeText(shareText);
        toast.success('Copied to clipboard!');
      } catch (clipboardError) {
        toast.error('Unable to share or copy');
      }
    }
  };

  const handleSaveOffline = () => {
    const content = `ClerkSmart HPC Guide - ${data.diagnosis}\n\n${data.presenting_complaints
      .map(
        (pc, i) =>
          `${i + 1}. ${pc.complaint}\n   ${pc.description}\n\n   Questions:\n${pc.questions
            .map((q, qi) => `   ${qi + 1}. ${q.question}\n      → ${q.rationale}`)
            .join('\n')}`
      )
      .join('\n\n')}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hpc-${data.diagnosis.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Saved for offline use!');
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-white dark:bg-slate-900 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-slate-600 dark:text-slate-400">Generating HPC guide...</p>
          </div>
        </div>
      </div>
    );
  }

  // Complaints List Modal
  if (showComplaintsList) {
    return (
      <div className="h-screen bg-white dark:bg-slate-900 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 sticky top-0 z-10">
          <HPCButton
            onClick={() => setShowComplaintsList(false)}
            variant="icon"
            size="icon"
          >
            <X className="h-5 w-5" />
          </HPCButton>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">
            All Complaints
          </h2>
          <div className="w-9"></div>
        </div>

        {/* Complaints List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {data.presenting_complaints.map((complaint, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentComplaintIndex(index);
                setShowComplaintsList(false);
              }}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                index === currentComplaintIndex
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div>
                <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                  {complaint.complaint}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                  {complaint.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white dark:bg-slate-900 flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        {/* Header */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <HPCButton
                onClick={() => window.history.back()}
                variant="icon"
                size="icon"
              >
                <ArrowLeft className="h-4 w-4" />
              </HPCButton>
              <HPCButton
                onClick={() => setShowComplaintsList(true)}
                variant="ghost"
                size="sm"
                className="gap-2"
              >
                <BookOpen className="h-4 w-4" />
                {currentComplaintIndex + 1} of {totalComplaints}
              </HPCButton>
            </div>
            
            <div className="flex items-center gap-2">
              <HPCButton
                onClick={() => setShowRationales(!showRationales)}
                variant="icon"
                size="icon"
                className={showRationales 
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-800/40' 
                  : ''
                }
              >
                <Lightbulb className="h-4 w-4" />
              </HPCButton>
              
              <HPCButton
                onClick={handleSaveOffline}
                variant="icon"
                size="icon"
              >
                <Download className="h-4 w-4" />
              </HPCButton>
              
              <HPCButton
                onClick={handleShare}
                variant="icon"
                size="icon"
              >
                <Share2 className="h-4 w-4" />
              </HPCButton>
            </div>
          </div>
          
          <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
            {data.diagnosis}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 capitalize">
            {data.specialty}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-1">
            {Array.from({ length: totalComplaints }, (_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i === currentComplaintIndex
                    ? 'bg-blue-500'
                    : i < currentComplaintIndex
                    ? 'bg-blue-300 dark:bg-blue-700'
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Current Complaint */}
      <div className={`flex-1 overflow-y-auto p-4 ${isPWA ? 'pb-24' : ''}`}>
        <div className="max-w-lg mx-auto space-y-6">
          {/* Complaint Header */}
          <div className="text-center space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {currentComplaint.complaint}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {currentComplaint.description}
            </p>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 text-center">
              Questions to Ask
            </h3>
            
            {currentComplaint.questions.map((question, index) => (
              <Card 
                key={index} 
                className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <p className="font-medium text-slate-900 dark:text-slate-100 mb-3 leading-relaxed">
                    &ldquo;{question.question}&rdquo;
                  </p>
                  
                  {showRationales && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {question.rationale}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation - PWA Optimized */}
      <div className={`bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 ${
        isPWA 
          ? 'fixed bottom-0 left-0 right-0 z-50 safe-area-inset-bottom shadow-lg border-t-2 border-t-blue-100 dark:border-t-blue-900' 
          : ''
      }`}>
        <div className={`p-4 ${isPWA ? 'pb-safe' : ''}`}>
          <div className="flex gap-3 max-w-lg mx-auto">
            <HPCButton
              onClick={handlePrevious}
              disabled={currentComplaintIndex === 0}
              variant="navigation"
              size="lg"
              className={`flex-1 ${isPWA 
                ? 'h-14 text-base font-semibold shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200' 
                : 'h-12'
              }`}
            >
              <ArrowLeft className={`${isPWA ? 'h-5 w-5' : 'h-4 w-4'} mr-2`} />
              Previous
            </HPCButton>
            
            <HPCButton
              onClick={handleNext}
              disabled={currentComplaintIndex === totalComplaints - 1}
              variant="primary"
              size="lg"
              className={`flex-1 ${isPWA 
                ? 'h-14 text-base font-semibold shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200' 
                : 'h-12'
              }`}
            >
              Next
              <ChevronDown className={`${isPWA ? 'h-5 w-5' : 'h-4 w-4'} ml-2 rotate-[-90deg]`} />
            </HPCButton>
          </div>
        </div>
      </div>
    </div>
  );
} 