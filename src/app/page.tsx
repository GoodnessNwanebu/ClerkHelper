import { SearchInterface } from '@/components/search/SearchInterface';
import { BookOpen } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-theme-bg via-theme-bg-secondary to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800/30 relative transition-colors duration-300">
      {/* Top Navigation Icons */}
      <div className="absolute top-6 left-0 right-0 z-10">
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Offline Files Icon - Top Left */}
          <button className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-slate-100/50 dark:from-blue-900/30 dark:to-slate-800/30 rounded-xl blur-md group-hover:blur-lg transition-all duration-300"></div>
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/60 dark:border-slate-700/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <BookOpen className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
            </div>
          </button>

          {/* Light/Dark Mode Toggle - Top Right */}
          <ThemeToggle />
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 flex flex-col min-h-screen">
        <div className="flex-1 flex flex-col justify-center">
          <div className="mx-auto max-w-3xl">
            {/* Logo Section */}
            <div className="mb-12 text-center">
                          <h1 className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-700 dark:from-slate-100 dark:via-blue-300 dark:to-slate-200 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl">
              ClerkSmart
            </h1>
              <div className="mt-3 h-1 w-20 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full"></div>
            </div>

            {/* Instruction Text */}
            <div className="mb-10 text-center">
                          <p className="text-xl text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              Generate comprehensive history templates for any diagnosis
            </p>
            </div>

            {/* Search Interface */}
            <div className="mb-12">
              <SearchInterface />
            </div>

            {/* Disclaimer */}
            <div className="text-center">
              <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-r from-amber-100/50 via-orange-50/50 to-amber-100/50 dark:from-amber-900/30 dark:via-orange-900/30 dark:to-amber-900/30 rounded-xl blur-lg"></div>
              <div className="relative inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-amber-50/90 to-orange-50/90 dark:from-amber-900/80 dark:to-orange-900/80 backdrop-blur-sm border border-amber-200/60 dark:border-amber-700/60 px-6 py-3 shadow-lg shadow-amber-100/20 dark:shadow-amber-900/20">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 shadow-md">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-amber-900 dark:text-amber-100 mb-0.5">
                      Medical Disclaimer
                    </p>
                    <p className="text-xs text-amber-800/90 dark:text-amber-200/90 leading-relaxed">
                      Always verify clinical information independently
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* True Footer */}
        <div className="text-center pb-4">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Made with <span className="text-red-500 animate-pulse">❤️</span> for medical students
          </p>
        </div>
      </div>
    </div>
  );
} 