'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-100/50 to-orange-100/50 rounded-xl blur-md transition-all duration-300"></div>
        <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-white/80 backdrop-blur-sm border border-white/60 shadow-lg transition-all duration-300">
          <Sun className="w-5 h-5 text-amber-600 transition-colors duration-300" />
        </div>
      </div>
    );
  }

  return (
    <button 
      onClick={toggleTheme}
      className="group relative"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-amber-100/50 to-orange-100/50 dark:from-blue-100/20 dark:to-purple-100/20 rounded-xl blur-md group-hover:blur-lg transition-all duration-300"></div>
      <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/60 dark:border-slate-700/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        {theme === 'light' ? (
          <Sun className="w-5 h-5 text-amber-600 group-hover:text-orange-500 transition-colors duration-300" />
        ) : (
          <Moon className="w-5 h-5 text-blue-400 group-hover:text-purple-400 transition-colors duration-300" />
        )}
      </div>
    </button>
  );
} 