import { SearchInterface } from '@/components/search/SearchInterface';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="container mx-auto px-6 py-16">
        <div className="mx-auto max-w-3xl">
          {/* Logo Section */}
          <div className="mb-20 text-center">
            <h1 className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-700 bg-clip-text text-6xl font-bold tracking-tight text-transparent sm:text-7xl">
              ClerkSmart
            </h1>
            <div className="mt-4 h-1 w-24 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full"></div>
          </div>

          {/* Instruction Text */}
          <div className="mb-16 text-center">
            <p className="text-2xl text-slate-700 font-medium leading-relaxed">
              Generate comprehensive history templates for any diagnosis
            </p>
          </div>

          {/* Search Interface */}
          <div className="mb-20">
            <SearchInterface />
          </div>

          {/* Footer */}
          <div className="text-center space-y-8">
            {/* Enhanced Disclaimer */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-100/50 via-orange-50/50 to-amber-100/50 rounded-2xl blur-xl"></div>
              <div className="relative inline-flex items-center gap-4 rounded-2xl bg-gradient-to-r from-amber-50/90 to-orange-50/90 backdrop-blur-sm border border-amber-200/60 px-8 py-4 shadow-xl shadow-amber-100/30">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-amber-900 mb-1">
                    Important Medical Disclaimer
                  </p>
                  <p className="text-sm text-amber-800/90 leading-relaxed">
                    Always verify clinical information independently with current medical literature
                  </p>
                </div>
              </div>
            </div>
            
            {/* Made with love */}
            <p className="text-base text-slate-500 font-medium">
              Made with <span className="text-red-500 animate-pulse">❤️</span> for medical students and junior doctors
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 