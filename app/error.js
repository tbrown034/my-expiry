'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error with context
    console.group('🔴 Application Error');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    console.error('Digest:', error.digest); // Next.js error identifier
    console.groupEnd();

    // In production, send to error tracking service
    // Example: logErrorToService({ message: error.message, stack: error.stack, digest: error.digest });
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Error sticky note on fridge door */}
        <div className="relative" style={{ transform: 'rotate(-1deg)' }}>
          {/* Magnet */}
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full"
            style={{
              background: 'radial-gradient(circle at 30% 30%, #f87171 0%, #dc2626 50%, #991b1b 100%)',
              boxShadow: '0 3px 6px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.4)',
            }}
          />

          {/* Sticky note */}
          <div className="bg-gradient-to-br from-red-100 via-red-50 to-rose-50 rounded-sm shadow-2xl p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">🍎💥</div>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">
                Something Went Rotten!
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mb-6 leading-relaxed">
                We hit a snag while managing your fridge. Don't worry, your groceries are still safe!
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => reset()}
                  className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Try Again
                </button>

                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-100 font-semibold rounded-lg shadow-lg transition-all"
                >
                  Back to Home
                </button>
              </div>

              {/* Developer info in development mode */}
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm font-semibold text-red-600 hover:text-red-700 mb-2">
                    🔧 Developer Info
                  </summary>
                  <div className="bg-slate-800 text-slate-100 rounded p-4 text-xs overflow-auto max-h-60">
                    <div className="space-y-2">
                      <div>
                        <span className="text-red-400 font-semibold">Error:</span>
                        <pre className="mt-1 text-red-300">{error.message}</pre>
                      </div>
                      {error.digest && (
                        <div>
                          <span className="text-yellow-400 font-semibold">Digest:</span>
                          <pre className="mt-1 text-yellow-300">{error.digest}</pre>
                        </div>
                      )}
                      {error.stack && (
                        <div>
                          <span className="text-blue-400 font-semibold">Stack Trace:</span>
                          <pre className="mt-1 text-blue-200 overflow-x-auto">{error.stack}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
