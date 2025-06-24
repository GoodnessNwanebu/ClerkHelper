import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface HPCButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon' | 'action' | 'navigation';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  children?: React.ReactNode;
}

const HPCButton = React.forwardRef<HTMLButtonElement, HPCButtonProps>(
  ({ className, variant = 'secondary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base styles
          'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
          
          // Variant styles
          {
            // Primary - Main action buttons
            'bg-blue-600 hover:bg-blue-700 text-white shadow-sm focus:ring-blue-500 disabled:hover:bg-blue-600': 
              variant === 'primary',
            
            // Secondary - Supporting buttons  
            'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 shadow-sm focus:ring-slate-500': 
              variant === 'secondary',
            
            // Ghost - Subtle actions
            'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 focus:ring-slate-500': 
              variant === 'ghost',
            
            // Icon - Icon-only buttons
            'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 focus:ring-slate-500 rounded-lg': 
              variant === 'icon',
            
            // Action - Important actions with color
            'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 focus:ring-slate-500': 
              variant === 'action',
            
            // Navigation - Large touch-friendly buttons
            'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 shadow-sm focus:ring-slate-500 hover:shadow-md': 
              variant === 'navigation'
          },
          
          // Size styles
          {
            'px-3 py-1.5 text-sm rounded-md': size === 'sm',
            'px-4 py-2 text-sm rounded-lg': size === 'md', 
            'px-6 py-3 text-base rounded-lg': size === 'lg',
            'p-2 rounded-lg': size === 'icon'
          },
          
          className
        )}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

HPCButton.displayName = 'HPCButton';

export { HPCButton }; 