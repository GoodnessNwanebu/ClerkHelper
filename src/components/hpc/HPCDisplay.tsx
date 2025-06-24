'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { HPCButton } from '@/components/ui/HPCButton';
import { ChevronDown, ChevronUp, Lightbulb, BookOpen, Share2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { HPCDisplayMobile } from './HPCDisplayMobile';

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

interface HPCDisplayProps {
  data: HPCData;
  isLoading?: boolean;
}

export function HPCDisplay({ data, isLoading = false }: HPCDisplayProps) {
  const [expandedComplaints, setExpandedComplaints] = useState<Set<number>>(new Set([0])); // First complaint expanded by default
  const [showRationales, setShowRationales] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const toggleComplaint = (index: number) => {
    const newExpanded = new Set(expandedComplaints);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedComplaints(newExpanded);
  };

  const handleShare = async () => {
    const shareText = `ClerkSmart HPC Guide - ${data.diagnosis}\n\n${data.presenting_complaints
      .map(
        (pc, i) =>
          `${i + 1}. ${pc.complaint}\n${pc.questions
            .map((q, qi) => `   ${qi + 1}. ${q.question}`)
            .join('\n')}`
      )
      .join('\n\n')}`;

    try {
      await navigator.share({
        title: `ClerkSmart HPC Guide - ${data.diagnosis}`,
        text: shareText,
      });
      toast.success('Shared successfully!');
    } catch (error) {
      // Fallback to clipboard if sharing isn't supported
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
          `${i + 1}. ${pc.complaint}\n   ${pc.description}\n\n   Questions to ask:\n${pc.questions
            .map((q, qi) => `   ${qi + 1}. ${q.question}\n      → ${q.rationale}`)
            .join('\n')}`
      )
      .join('\n\n')}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clerksmart-hpc-${data.diagnosis.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Saved for offline use!');
  };

  // Use mobile component on mobile devices
  if (isMobile) {
    return <HPCDisplayMobile data={data} isLoading={isLoading} />;
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
              {data.diagnosis}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 capitalize mt-1">
              {data.specialty} • History of Presenting Complaint
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <HPCButton
              onClick={() => setShowRationales(!showRationales)}
              variant="secondary"
              size="sm"
              className={`gap-2 ${showRationales 
                ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700' 
                : ''
              }`}
            >
              <Lightbulb className="h-4 w-4" />
              {showRationales ? 'Hide' : 'Show'} Insights
            </HPCButton>
            <HPCButton
              onClick={handleShare}
              variant="secondary"
              size="sm"
              className="gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </HPCButton>
            <HPCButton
              onClick={handleSaveOffline}
              variant="secondary"
              size="sm"
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </HPCButton>
          </div>
        </div>

        {/* Introduction */}
        <Card className="bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Focus on Key Presenting Complaints
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  These are the most common symptoms patients present with for {data.diagnosis}. 
                  Use the targeted questions below to explore each complaint thoroughly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Presenting Complaints */}
      <div className="space-y-4">
        {data.presenting_complaints.map((complaint, index) => (
          <Card 
            key={index} 
            className="overflow-hidden border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-0">
              {/* Complaint Header */}
              <button
                onClick={() => toggleComplaint(index)}
                className="w-full p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {complaint.complaint}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {complaint.description}
                    </p>
                  </div>
                  {expandedComplaints.has(index) ? (
                    <ChevronUp className="h-5 w-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Questions */}
              {expandedComplaints.has(index) && (
                <div className="px-4 pb-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="pt-4 space-y-3">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm uppercase tracking-wide">
                      Questions to Ask:
                    </h4>
                    
                    {complaint.questions.map((q, qIndex) => (
                      <div 
                        key={qIndex} 
                        className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3"
                      >
                        <p className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                          {qIndex + 1}. "{q.question}"
                        </p>
                        
                        {showRationales && (
                          <div className="ml-4 pl-3 border-l-2 border-amber-200 dark:border-amber-700">
                            <div className="flex items-start gap-2">
                              <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {q.rationale}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <Card className="bg-amber-50/50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <CardContent className="p-4">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <span className="font-semibold">Remember:</span> Always adapt your questions based on the patient's responses 
              and clinical context. This guide provides a framework, but clinical judgment is essential.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 