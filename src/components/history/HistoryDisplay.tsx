'use client';

import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, Share2, Stethoscope, Clipboard, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { copyToClipboard, formatSectionForCopy, capitalizeWords } from '@/lib/utils';
import { toast } from 'sonner';
import type { HistoryTemplate, HistorySection } from '@/types';

interface HistoryDisplayProps {
  template: HistoryTemplate;
  diagnosis: string;
  onBack?: () => void;
}

export function HistoryDisplay({ template, diagnosis, onBack }: HistoryDisplayProps) {
  const [copiedSections, setCopiedSections] = useState<Set<string>>(new Set());

  const handleCopySection = async (section: HistorySection) => {
    const formatted = formatSectionForCopy(section.title, section.questions);
    const success = await copyToClipboard(formatted);

    if (success) {
      setCopiedSections(prev => new Set(prev).add(section.id));
      toast.success(`Copied "${section.title}" section`);
      
      setTimeout(() => {
        setCopiedSections(prev => {
          const newSet = new Set(prev);
          newSet.delete(section.id);
          return newSet;
        });
      }, 2000);
    } else {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleCopyAll = async () => {
    const allSections = template.sections
      .sort((a, b) => a.order - b.order)
      .map(section => formatSectionForCopy(section.title, section.questions))
      .join('\n');

    const fullTemplate = `History Template - ${diagnosis}\nSpecialty: ${template.specialty}\n\n${allSections}`;
    
    const success = await copyToClipboard(fullTemplate);
    if (success) {
      toast.success('Copied complete history template');
    } else {
      toast.error('Failed to copy to clipboard');
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
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      const success = await copyToClipboard(window.location.href);
      if (success) {
        toast.success('Link copied to clipboard');
      }
    }
  };

  const sortedSections = template.sections.sort((a, b) => a.order - b.order);

  return React.createElement('div', { className: 'w-full space-y-8' },
    React.createElement('div', { className: 'flex items-center justify-between' },
      React.createElement(Button, {
        variant: 'ghost',
        onClick: onBack,
        className: 'group flex items-center gap-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40 px-6 py-3 font-medium text-slate-700 shadow-lg shadow-slate-100/50 transition-all hover:bg-white/80 hover:shadow-xl hover:shadow-slate-200/60'
      },
        React.createElement(ArrowLeft, { className: 'h-4 w-4 transition-transform group-hover:-translate-x-1' }),
        'Back to Search'
      ),
      React.createElement('div', { className: 'flex items-center gap-3' },
        React.createElement(Button, {
          variant: 'outline',
          size: 'sm',
          onClick: handleShare,
          className: 'rounded-xl border-slate-200/60 bg-white/60 backdrop-blur-sm px-4 py-2 font-medium text-slate-700 shadow-sm transition-all hover:bg-white/80 hover:shadow-md'
        },
          React.createElement(Share2, { className: 'mr-2 h-4 w-4' }),
          'Share'
        ),
        React.createElement(Button, {
          variant: 'default',
          size: 'sm',
          onClick: handleCopyAll,
          className: 'rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2 font-medium shadow-lg shadow-blue-200/50 transition-all hover:shadow-xl hover:shadow-blue-300/60'
        },
          React.createElement(Clipboard, { className: 'mr-2 h-4 w-4' }),
          'Copy All'
        )
      )
    ),
    
    React.createElement('div', { 
      className: 'relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-8 text-white shadow-2xl shadow-blue-200/40' 
    },
      React.createElement('div', { className: 'relative' },
        React.createElement('div', { className: 'mb-4 inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2' },
          React.createElement(Award, { className: 'h-5 w-5' }),
          React.createElement('span', { className: 'text-sm font-medium' }, 'AI-Generated Template')
        ),
        React.createElement('h1', { className: 'mb-4 text-4xl font-bold leading-tight' },
          capitalizeWords(diagnosis)
        ),
        React.createElement('div', { className: 'flex items-center gap-4 text-blue-100' },
          React.createElement('div', { className: 'flex items-center gap-2' },
            React.createElement(Stethoscope, { className: 'h-5 w-5' }),
            React.createElement('span', { className: 'font-medium' }, 'Specialty:'),
            React.createElement('span', { className: 'rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-white' },
              template.specialty
            )
          ),
          React.createElement('div', { className: 'h-1 w-1 rounded-full bg-blue-300' }),
          React.createElement('span', { className: 'text-sm' },
            `${template.sections.length} sections • ${template.sections.reduce((acc, section) => acc + section.questions.length, 0)} questions`
          )
        )
      )
    ),

    React.createElement('div', { className: 'space-y-6' },
      ...sortedSections.map((section, index) =>
        React.createElement(Card, { 
          key: section.id, 
          className: 'group overflow-hidden rounded-2xl border-0 bg-white/70 backdrop-blur-sm shadow-xl shadow-slate-100/60 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/80' 
        },
          React.createElement(CardHeader, { className: 'bg-gradient-to-r from-slate-50 to-slate-100/50 pb-4' },
            React.createElement('div', { className: 'flex items-center justify-between' },
              React.createElement('div', { className: 'flex items-center gap-4' },
                React.createElement('div', { className: 'flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-200/50' },
                  index + 1
                ),
                React.createElement(CardTitle, { className: 'text-xl font-bold text-slate-900' },
                  section.title
                )
              ),
              React.createElement(Button, {
                variant: 'ghost',
                size: 'sm',
                onClick: () => handleCopySection(section),
                className: 'rounded-xl transition-all hover:bg-white/80'
              },
                copiedSections.has(section.id) ? 
                  React.createElement(React.Fragment, null,
                    React.createElement(Check, { className: 'mr-2 h-4 w-4 text-emerald-600' }),
                    React.createElement('span', { className: 'font-medium text-emerald-600' }, 'Copied')
                  ) :
                  React.createElement(React.Fragment, null,
                    React.createElement(Copy, { className: 'mr-2 h-4 w-4 text-slate-500 transition-colors group-hover:text-slate-700' }),
                    React.createElement('span', { className: 'font-medium text-slate-500 transition-colors group-hover:text-slate-700' }, 'Copy')
                  )
              )
            )
          ),
          React.createElement(CardContent, { className: 'p-6' },
            React.createElement('div', { className: 'space-y-4' },
              ...section.questions.map((question, questionIndex) =>
                React.createElement('div', {
                  key: questionIndex,
                  className: 'group/item flex items-start gap-4 rounded-xl bg-white/50 p-4 transition-all hover:bg-white/80'
                },
                  React.createElement('div', { className: 'flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-xs font-bold text-slate-600 transition-colors group-hover/item:from-blue-100 group-hover/item:to-blue-200 group-hover/item:text-blue-700' },
                    questionIndex + 1
                  ),
                  React.createElement('span', { className: 'flex-1 font-medium text-slate-700 leading-relaxed' },
                    question
                  )
                )
              )
            )
          )
        )
      )
    ),

    React.createElement('div', { className: 'space-y-6' },
      React.createElement('div', { className: 'rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 p-6 shadow-lg shadow-amber-100/50' },
        React.createElement('div', { className: 'flex items-start gap-4' },
          React.createElement('div', { className: 'flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100' },
            React.createElement('svg', { className: 'h-5 w-5 text-amber-600', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' },
              React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z' })
            )
          ),
          React.createElement('div', null,
            React.createElement('h3', { className: 'mb-2 font-semibold text-amber-900' }, 'Important Disclaimer'),
            React.createElement('p', { className: 'text-sm leading-relaxed text-amber-800' },
              'This template is AI-generated and should be used as a guide only. Always verify clinical information independently and adapt questions based on your patient\'s specific presentation and clinical context.'
            )
          )
        )
      ),

      React.createElement(Card, { className: 'border-0 bg-slate-50/70 backdrop-blur-sm shadow-lg shadow-slate-100/50' },
        React.createElement(CardContent, { className: 'py-4' },
          React.createElement('div', { className: 'flex items-center justify-between text-sm text-slate-600' },
            React.createElement('div', { className: 'flex items-center gap-2' },
              React.createElement('div', { className: 'h-2 w-2 rounded-full bg-emerald-500' }),
              React.createElement('span', { className: 'font-medium' },
                template.cached ? 'Retrieved from cache' : 'Freshly generated'
              )
            ),
            React.createElement('span', { className: 'font-medium' },
              `Generated by ${template.llm_model || 'GPT-4'}`
            )
          )
        )
      )
    )
  );
} 