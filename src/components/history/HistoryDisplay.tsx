'use client';

import React from 'react';
import { ArrowLeft, Share2, Download, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { copyToClipboard, formatSectionForCopy, capitalizeWords } from '@/lib/utils';
import { toastPatterns } from '@/lib/toast';
import type { HistoryTemplate } from '@/types';

interface HistoryDisplayProps {
  template: HistoryTemplate;
  diagnosis: string;
  onBack?: () => void;
}

export function HistoryDisplay({ template, diagnosis, onBack }: HistoryDisplayProps) {
  const handleCopyAll = async () => {
    const allSections = template.sections
      .sort((a, b) => a.order - b.order)
      .map(section => formatSectionForCopy(section.title, section.questions))
      .join('\n');

    const fullTemplate = `History Template - ${diagnosis}\nSpecialty: ${template.specialty}\n\n${allSections}`;
    
    const success = await copyToClipboard(fullTemplate);
    if (success) {
      toastPatterns.copied.template();
    } else {
      toastPatterns.errors.clipboard();
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `ClerkSmart - ${diagnosis}`,
          text: `History template for ${diagnosis}`,
          url: window.location.href,
        });
        toastPatterns.shared.general();
      } catch (error) {
        // User cancelled sharing - don't show error
      }
    } else {
      const success = await copyToClipboard(window.location.href);
      if (success) {
        toastPatterns.shared.link();
      } else {
        toastPatterns.errors.clipboard();
      }
    }
  };

  const handleSaveOffline = () => {
    // TODO: Implement offline save functionality
    toastPatterns.saved.offline();
  };

  const sortedSections = template.sections.sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-theme-bg dark:bg-slate-950 transition-colors duration-300">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">
        {/* Back Button */}
        <div className="mb-6 sm:mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 text-theme-fg-secondary hover:text-theme-fg hover:bg-theme-accent/10 active:bg-theme-accent/20 focus:bg-theme-accent/10 transition-colors -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Button>
        </div>

        {/* Title Section */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-theme-fg mb-4 sm:mb-6 leading-tight">
            {capitalizeWords(diagnosis)}
          </h1>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6 text-sm sm:text-base text-theme-fg-secondary mb-6 sm:mb-8">
            <span className="font-medium">Specialty: {template.specialty}</span>
            <span className="hidden sm:inline text-theme-fg-secondary/50">•</span>
            <span>{template.sections.length} sections</span>
            <span className="hidden sm:inline text-theme-fg-secondary/50">•</span>
            <span>{template.sections.reduce((acc, section) => acc + section.questions.length, 0)} questions</span>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="group relative flex items-center justify-center gap-3 h-12 sm:h-11 px-6 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg shadow-blue-100/25 dark:shadow-slate-900/25 hover:shadow-xl hover:shadow-blue-200/40 dark:hover:shadow-slate-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300/50 dark:hover:border-blue-600/50"
            >
              <Share2 className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span className="font-medium">Share Template</span>
            </Button>
            
            <Button
              variant="outline" 
              size="sm"
              onClick={handleSaveOffline}
              className="group relative flex items-center justify-center gap-3 h-12 sm:h-11 px-6 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg shadow-emerald-100/25 dark:shadow-slate-900/25 hover:shadow-xl hover:shadow-emerald-200/40 dark:hover:shadow-slate-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-300/50 dark:hover:border-emerald-600/50"
            >
              <Download className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span className="font-medium">Save Offline</span>
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={handleCopyAll}
              className="group relative flex items-center justify-center gap-3 h-12 sm:h-11 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border-0"
            >
              <Copy className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span className="font-medium">Copy All</span>
            </Button>
          </div>
        </div>

        {/* Questions Content */}
        <div className="space-y-8 sm:space-y-12">
          {sortedSections.map((section) => (
            <div key={section.id} className="space-y-5 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-theme-fg border-b border-theme-border/50 pb-3 sm:pb-4">
                {section.title}
              </h2>
              
              <div className="space-y-5 sm:space-y-6">
                {section.questions.map((question, questionIndex) => {
                  const questionText = typeof question === 'string' ? question : question.question;
                  const hint = typeof question === 'object' ? question.hint : undefined;
                  
                  return (
                    <div key={questionIndex} className="space-y-3 sm:space-y-4">
                      <div className="flex items-start gap-4 sm:gap-5">
                        <span className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-theme-accent text-white text-sm sm:text-base font-medium flex items-center justify-center mt-1">
                          {questionIndex + 1}
                        </span>
                        <p className="text-theme-fg leading-relaxed text-base sm:text-lg pt-1">
                          {questionText}
                        </p>
                      </div>
                      
                      {hint && (
                        <div className="ml-11 sm:ml-13 p-4 sm:p-5 bg-blue-50/50 dark:bg-blue-950/30 border-l-4 border-blue-400/60 dark:border-blue-500/50">
                          <p className="text-sm sm:text-base text-blue-800 dark:text-blue-200 leading-relaxed">
                            💡 {hint}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Disclaimer */}
        <div className="mt-12 sm:mt-16 p-4 sm:p-6 bg-amber-50/30 dark:bg-amber-950/20 border-l-4 border-amber-400/60 dark:border-amber-500/50">
          <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
            <strong>Disclaimer:</strong> This template is AI-generated and should be used as a guide only. 
            Always verify clinical information independently and adapt questions based on your patient&apos;s specific presentation.
          </p>
        </div>
      </div>
    </div>
  );
} 