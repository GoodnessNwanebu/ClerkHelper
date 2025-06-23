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