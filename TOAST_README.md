# 🎉 Custom Toast Utility System

A beautifully styled, reusable toast notification system built on top of [Sonner](https://sonner.emilkowal.ski/) with glass morphism design, rich colors, animations, and pre-built patterns.

## ✨ Features

- **🎨 Beautiful Design**: Glass morphism with backdrop blur, rounded corners, and rich colors
- **🚀 Pre-built Patterns**: Ready-to-use toast patterns for common use cases
- **📱 Mobile Optimized**: Responsive design with proper touch targets
- **🌈 Theme Support**: Light and dark mode with consistent styling
- **🎭 Rich Animations**: Smooth hover effects, scaling, and transitions
- **⚡ TypeScript**: Full type safety and IntelliSense support

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install sonner
```

### 2. Add the Sonner Component (sonner.tsx)

```tsx
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="top-center"
      expand={false}
      richColors={true}
      closeButton={true}
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-white/95 dark:group-[.toaster]:bg-slate-800/95 group-[.toaster]:backdrop-blur-sm group-[.toaster]:text-slate-900 dark:group-[.toaster]:text-slate-100 group-[.toaster]:border group-[.toaster]:border-slate-200/50 dark:group-[.toaster]:border-slate-700/50 group-[.toaster]:shadow-xl group-[.toaster]:shadow-slate-900/10 dark:group-[.toaster]:shadow-slate-900/40 group-[.toaster]:rounded-2xl group-[.toaster]:p-4 group-[.toaster]:min-h-[60px]',
          description: 'group-[.toast]:text-slate-600 dark:group-[.toast]:text-slate-400 group-[.toast]:text-sm group-[.toast]:leading-relaxed',
          actionButton:
            'group-[.toast]:bg-blue-600 group-[.toast]:text-white group-[.toast]:hover:bg-blue-700 group-[.toast]:rounded-xl group-[.toast]:px-4 group-[.toast]:py-2 group-[.toast]:font-medium group-[.toast]:transition-colors',
          cancelButton:
            'group-[.toast]:bg-slate-100 dark:group-[.toast]:bg-slate-700 group-[.toast]:text-slate-600 dark:group-[.toast]:text-slate-300 group-[.toast]:hover:bg-slate-200 dark:group-[.toast]:hover:bg-slate-600 group-[.toast]:rounded-xl group-[.toast]:px-4 group-[.toast]:py-2 group-[.toast]:font-medium group-[.toast]:transition-colors',
          closeButton:
            'group-[.toast]:bg-slate-100 dark:group-[.toast]:bg-slate-700 group-[.toast]:text-slate-500 dark:group-[.toast]:text-slate-400 group-[.toast]:hover:bg-slate-200 dark:group-[.toast]:hover:bg-slate-600 group-[.toast]:hover:text-slate-700 dark:group-[.toast]:hover:text-slate-200 group-[.toast]:rounded-lg group-[.toast]:w-8 group-[.toast]:h-8 group-[.toast]:transition-colors',
          success:
            'group-[.toaster]:border-emerald-200/50 dark:group-[.toaster]:border-emerald-700/50 group-[.toaster]:bg-emerald-50/80 dark:group-[.toaster]:bg-emerald-950/80 group-[.toaster]:text-emerald-900 dark:group-[.toaster]:text-emerald-100 group-[.toaster]:shadow-emerald-500/20',
          error:
            'group-[.toaster]:border-red-200/50 dark:group-[.toaster]:border-red-700/50 group-[.toaster]:bg-red-50/80 dark:group-[.toaster]:bg-red-950/80 group-[.toaster]:text-red-900 dark:group-[.toaster]:text-red-100 group-[.toaster]:shadow-red-500/20',
          warning:
            'group-[.toaster]:border-amber-200/50 dark:group-[.toaster]:border-amber-700/50 group-[.toaster]:bg-amber-50/80 dark:group-[.toaster]:bg-amber-950/80 group-[.toaster]:text-amber-900 dark:group-[.toaster]:text-amber-100 group-[.toaster]:shadow-amber-500/20',
          info:
            'group-[.toaster]:border-blue-200/50 dark:group-[.toaster]:border-blue-700/50 group-[.toaster]:bg-blue-50/80 dark:group-[.toaster]:bg-blue-950/80 group-[.toaster]:text-blue-900 dark:group-[.toaster]:text-blue-100 group-[.toaster]:shadow-blue-500/20',
        },
        duration: 4000,
        style: {
          fontSize: '15px',
          fontWeight: '500',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
```

### 3. Add the Toast Utility (toast.ts)

Copy the `toast.ts` file from this project to your `lib/` directory.

### 4. Add Toaster to Your Layout

```tsx
import { Toaster } from '@/components/ui/sonner';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

## 🚀 Basic Usage

### Import the Utility

```tsx
import { toast, toastPatterns } from '@/lib/toast';
```

### Basic Toast Functions

```tsx
// Success toast (green theme)
toast.success('Operation completed!', {
  description: 'Your changes have been saved successfully'
});

// Error toast (red theme)
toast.error('Something went wrong', {
  description: 'Please try again later'
});

// Info toast (blue theme)
toast.info('New feature available', {
  description: 'Check out the latest updates'
});

// Warning toast (amber theme)
toast.warning('Storage almost full', {
  description: 'Consider clearing some space'
});

// Loading toast
const loadingToast = toast.loading('Processing...', {
  description: 'Please wait while we save your data'
});
```

## 🎯 Pre-built Patterns

Instead of writing custom messages every time, use our pre-built patterns:

### Copy Patterns

```tsx
// Instead of writing custom messages
toast.success('✨ Text copied to clipboard', { 
  description: 'Ready to paste anywhere' 
});

// Use pre-built patterns
toastPatterns.copied.text();        // Text copied
toastPatterns.copied.link();        // Link copied
toastPatterns.copied.template();    // Template copied
toastPatterns.copied.code();        // Code copied
```

### Save Patterns

```tsx
toastPatterns.saved.general();      // General save success
toastPatterns.saved.offline();      // Offline save
toastPatterns.saved.draft();        // Draft saved
toastPatterns.saved.settings();     // Settings saved
```

### Share Patterns

```tsx
toastPatterns.shared.general();     // General share success
toastPatterns.shared.link();        // Share link copied
toastPatterns.shared.social();      // Social media share
```

### Error Patterns

```tsx
toastPatterns.errors.network();     // Network error
toastPatterns.errors.permission();  // Permission denied
toastPatterns.errors.clipboard();   // Clipboard error
toastPatterns.errors.generic('save'); // Generic error with action
toastPatterns.errors.validation('email'); // Validation error
```

### Loading Patterns

```tsx
const loadingId = toastPatterns.loading.saving();     // Saving...
const loadingId = toastPatterns.loading.generating(); // Generating...
const loadingId = toastPatterns.loading.uploading();  // Uploading...
const loadingId = toastPatterns.loading.processing(); // Processing...
```

### Warning Patterns

```tsx
toastPatterns.warnings.unsaved();        // Unsaved changes
toastPatterns.warnings.offline();        // Offline warning
toastPatterns.warnings.limit('storage'); // Limit reached
```

### Info Patterns

```tsx
toastPatterns.info.welcome('John');      // Welcome message
toastPatterns.info.update();             // Update available
toastPatterns.info.tip('Use Ctrl+C to copy quickly'); // Pro tip
```

## 🔧 Advanced Usage

### Promise Toasts

Handle async operations with automatic loading/success/error states:

```tsx
import { toastUtils } from '@/lib/toast';

const saveData = async () => {
  return toastUtils.promise(
    fetch('/api/save', { method: 'POST', body: data }),
    {
      loading: 'Saving your data...',
      success: 'Data saved successfully!',
      error: 'Failed to save data',
      loadingDescription: 'Please wait while we process your request',
      successDescription: 'Your changes are now live',
      errorDescription: 'Please try again or contact support'
    }
  );
};
```

### Chained Toasts

Show multiple toasts in sequence:

```tsx
import { toastUtils } from '@/lib/toast';

const multiStepProcess = async () => {
  await toastUtils.chain([
    { message: 'Step 1: Validating data...', type: 'info', delay: 1000 },
    { message: 'Step 2: Processing...', type: 'info', delay: 1500 },
    { message: 'All done!', type: 'success' }
  ]);
};
```

### Custom Toasts with Actions

```tsx
toast.custom('Unsaved changes detected', {
  description: 'Do you want to save your work?',
  action: {
    label: 'Save',
    onClick: () => saveData()
  },
  cancel: {
    label: 'Discard',
    onClick: () => discardChanges()
  }
});
```

## 🎨 Real-world Examples

### File Upload

```tsx
const handleFileUpload = async (file: File) => {
  const loadingId = toastPatterns.loading.uploading();
  
  try {
    await uploadFile(file);
    toast.dismiss(loadingId);
    toast.success('📄 File uploaded successfully', {
      description: `${file.name} is now available`
    });
  } catch (error) {
    toast.dismiss(loadingId);
    toastPatterns.errors.generic('upload file');
  }
};
```

### Copy to Clipboard

```tsx
const handleCopyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toastPatterns.copied.text();
  } catch (error) {
    toastPatterns.errors.clipboard();
  }
};
```

### Form Validation

```tsx
const handleSubmit = (formData: FormData) => {
  if (!formData.email) {
    toastPatterns.errors.validation('email address');
    return;
  }
  
  if (!formData.password) {
    toastPatterns.errors.validation('password');
    return;
  }
  
  // Proceed with submission
  toastPatterns.saved.general();
};
```

## 🛠️ Utilities

### Dismiss All Toasts

```tsx
import { toastUtils } from '@/lib/toast';

toastUtils.dismissAll();
```

### Access Original Sonner

If you need the original Sonner functionality:

```tsx
import { originalToast } from '@/lib/toast';

originalToast('Custom toast with full Sonner API');
```

## 🎭 Customization

### Modify Pre-built Patterns

You can easily modify or add new patterns by editing the `toastPatterns` object in `toast.ts`:

```tsx
export const toastPatterns = {
  // Add your custom patterns
  myApp: {
    loginSuccess: () => toast.success('🎉 Welcome back!', {
      description: 'You\'re now logged in'
    }),
    
    logoutSuccess: () => toast.info('👋 See you later!', {
      description: 'You\'ve been logged out'
    })
  }
};
```

### Custom Styling

Modify the Toaster component's `classNames` to match your design system:

```tsx
// Change success color to your brand color
success: 'group-[.toaster]:border-purple-200/50 group-[.toaster]:bg-purple-50/80 ...'
```

## 📦 Project Structure

```
src/
├── components/ui/
│   └── sonner.tsx          # Styled Toaster component
├── lib/
│   └── toast.ts            # Main toast utility
└── app/
    └── layout.tsx          # Include <Toaster />
```

## 🚀 Benefits

- **Consistency**: All toasts follow the same design language
- **DRY Principle**: Reuse common patterns instead of writing them repeatedly
- **Type Safety**: Full TypeScript support with IntelliSense
- **Performance**: Lightweight wrapper around Sonner
- **Maintainability**: Easy to update styles or messages in one place
- **User Experience**: Beautiful animations and feedback

## 🤝 Contributing

To add new patterns or improve existing ones:

1. Add new patterns to `toastPatterns` in `toast.ts`
2. Update this README with examples
3. Test across different themes and screen sizes

---

**Made with ❤️ for better user experience** 