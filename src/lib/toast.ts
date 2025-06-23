import { toast as sonnerToast } from 'sonner';

/**
 * Custom Toast Utility
 * A beautifully styled toast system built on top of Sonner
 * Features: Glass morphism design, rich colors, animations, and pre-built patterns
 */

// Core toast functions with enhanced styling
export const toast = {
  /**
   * Success toast with green theming
   */
  success: (message: string, options?: { description?: string; duration?: number }) => {
    return sonnerToast.success(message, {
      description: options?.description,
      duration: options?.duration || 4000,
    });
  },

  /**
   * Error toast with red theming
   */
  error: (message: string, options?: { description?: string; duration?: number }) => {
    return sonnerToast.error(message, {
      description: options?.description,
      duration: options?.duration || 5000, // Longer for errors
    });
  },

  /**
   * Info toast with blue theming
   */
  info: (message: string, options?: { description?: string; duration?: number }) => {
    return sonnerToast.info(message, {
      description: options?.description,
      duration: options?.duration || 4000,
    });
  },

  /**
   * Warning toast with amber theming
   */
  warning: (message: string, options?: { description?: string; duration?: number }) => {
    return sonnerToast.warning(message, {
      description: options?.description,
      duration: options?.duration || 4500,
    });
  },

  /**
   * Loading toast
   */
  loading: (message: string, options?: { description?: string }) => {
    return sonnerToast.loading(message, {
      description: options?.description,
    });
  },

  /**
   * Custom toast with full control
   */
  custom: (message: string, options?: { 
    description?: string; 
    duration?: number;
    action?: { label: string; onClick: () => void };
    cancel?: { label: string; onClick: () => void };
  }) => {
    return sonnerToast(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      action: options?.action,
      cancel: options?.cancel,
    });
  }
};

// Pre-built toast patterns for common use cases
export const toastPatterns = {
  /**
   * Copy success patterns
   */
  copied: {
    text: () => toast.success('✨ Text copied to clipboard', {
      description: 'Ready to paste anywhere'
    }),
    
    link: () => toast.success('🔗 Link copied to clipboard', {
      description: 'Share this link with others'
    }),
    
    template: () => toast.success('✨ Complete template copied to clipboard', {
      description: 'Ready to paste into your notes'
    }),
    
    code: () => toast.success('💻 Code copied to clipboard', {
      description: 'Ready to paste into your editor'
    })
  },

  /**
   * Save success patterns
   */
  saved: {
    general: () => toast.success('💾 Saved successfully', {
      description: 'Your changes have been saved'
    }),
    
    offline: () => toast.success('💾 Saved for offline access', {
      description: 'Available even when you\'re not connected'
    }),
    
    draft: () => toast.success('📝 Draft saved', {
      description: 'Your work is automatically saved'
    }),
    
    settings: () => toast.success('⚙️ Settings saved', {
      description: 'Your preferences have been updated'
    })
  },

  /**
   * Share success patterns
   */
  shared: {
    general: () => toast.success('🚀 Shared successfully', {
      description: 'Thanks for spreading the word!'
    }),
    
    link: () => toast.success('🔗 Share link copied', {
      description: 'Paste this link to share'
    }),
    
    social: () => toast.success('📱 Shared to social media', {
      description: 'Your content is now live!'
    })
  },

  /**
   * Error patterns
   */
  errors: {
    network: () => toast.error('🌐 Network error', {
      description: 'Please check your connection and try again'
    }),
    
    permission: () => toast.error('🔒 Permission denied', {
      description: 'Please check your browser permissions'
    }),
    
    clipboard: () => toast.error('❌ Unable to copy to clipboard', {
      description: 'Please check your browser permissions and try again'
    }),
    
    generic: (action: string) => toast.error(`❌ Unable to ${action}`, {
      description: 'Something went wrong. Please try again'
    }),
    
    validation: (field: string) => toast.error('⚠️ Validation error', {
      description: `Please check your ${field} and try again`
    })
  },

  /**
   * Loading patterns
   */
  loading: {
    saving: () => toast.loading('💾 Saving...', {
      description: 'Please wait while we save your changes'
    }),
    
    generating: () => toast.loading('✨ Generating...', {
      description: 'This may take a few moments'
    }),
    
    uploading: () => toast.loading('📤 Uploading...', {
      description: 'Please wait while we upload your file'
    }),
    
    processing: () => toast.loading('⚙️ Processing...', {
      description: 'Working on your request'
    })
  },

  /**
   * Warning patterns
   */
  warnings: {
    unsaved: () => toast.warning('⚠️ Unsaved changes', {
      description: 'Don\'t forget to save your work'
    }),
    
    offline: () => toast.warning('📡 You\'re offline', {
      description: 'Some features may not work properly'
    }),
    
    limit: (limit: string) => toast.warning('⚠️ Limit reached', {
      description: `You've reached your ${limit} limit`
    })
  },

  /**
   * Info patterns
   */
  info: {
    welcome: (name?: string) => toast.info(`👋 Welcome${name ? ` ${name}` : ''}!`, {
      description: 'Let\'s get started with your journey'
    }),
    
    update: () => toast.info('🎉 New update available', {
      description: 'Click to refresh and get the latest features'
    }),
    
    tip: (tip: string) => toast.info('💡 Pro tip', {
      description: tip
    })
  }
};

// Utility functions
export const toastUtils = {
  /**
   * Dismiss all toasts
   */
  dismissAll: () => sonnerToast.dismiss(),

  /**
   * Chain toasts (useful for multi-step processes)
   */
  chain: async (toasts: Array<{ message: string; type: 'success' | 'error' | 'info' | 'warning'; delay?: number }>) => {
    for (let i = 0; i < toasts.length; i++) {
      const { message, type, delay = 1000 } = toasts[i];
      
      toast[type](message);
      
      if (i < toasts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  },

  /**
   * Promise toast - shows loading, then success/error based on promise result
   */
  promise: <T>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
      loadingDescription?: string;
      successDescription?: string | ((data: T) => string);
      errorDescription?: string | ((error: Error) => string);
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading: options.loading,
      success: options.success,
      error: options.error,
      description: options.loadingDescription,
    });
  }
};

// Export everything for easy importing
export { sonnerToast as originalToast };
export default toast; 