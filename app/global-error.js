'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log to console for developers
    console.error('🚨 Global Error:', error);

    // In production, you'd send this to an error tracking service like Sentry
    // Example: Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body className="bg-slate-900 text-white flex items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full">
          {/* Fridge-themed error display */}
          <div className="relative bg-gradient-to-br from-yellow-100 via-yellow-50 to-amber-50 rounded-sm shadow-2xl p-8 text-slate-800" style={{ transform: 'rotate(-1deg)' }}>
            {/* Magnet */}
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full"
              style={{
                background: 'radial-gradient(circle at 30% 30%, #f87171 0%, #dc2626 50%, #991b1b 100%)',
                boxShadow: '0 3px 6px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.4)',
              }}
            />

            <div className="text-center">
              <div className="text-6xl mb-4">😵</div>
              <h1 className="text-2xl font-bold mb-3">Oops! Something went wrong</h1>
              <p className="text-sm text-slate-600 mb-6">
                We&apos;ve run into an unexpected problem. Don&apos;t worry - your data is safe!
              </p>

              <div className="space-y-3">
                <button
                  onClick={reset}
                  className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Try Again
                </button>

                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-all"
                >
                  Back to Home
                </button>
              </div>

              {process.env.NODE_ENV === 'development' && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm font-medium text-red-600 hover:text-red-700">
                    Developer Info
                  </summary>
                  <pre className="mt-2 text-xs bg-red-50 border border-red-200 rounded p-3 overflow-auto">
                    {error.message}
                    {error.stack && '\n\n' + error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
