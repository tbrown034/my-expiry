'use client';

import { useState, useEffect } from 'react';

export default function ProcessingOverlay({ isVisible, logs = [], currentStep = '' }) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [dots, setDots] = useState('');

  // Timer
  useEffect(() => {
    if (!isVisible) {
      setElapsedTime(0);
      return;
    }

    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 100);
    }, 100);

    return () => clearInterval(interval);
  }, [isVisible]);

  // Animated dots
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 400);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  const formatTime = (ms) => {
    const seconds = (ms / 1000).toFixed(1);
    return `${seconds}s`;
  };

  const networkLogs = logs.filter(l => l.type === 'network');
  const latestSuccess = logs.filter(l => l.type === 'success').pop();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Sticky note style */}
      <div className="relative" style={{ transform: 'rotate(-1deg)' }}>
        {/* Red magnet - on the fridge, holding the note */}
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full z-20"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #f87171 0%, #dc2626 50%, #991b1b 100%)',
            boxShadow: '0 3px 6px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.4)',
          }}
        />

        {/* Shadow */}
        <div className="absolute inset-0 bg-black/25 rounded-sm translate-y-2 translate-x-1" />

        {/* Note */}
        <div
          className="relative w-80 rounded-sm p-6 shadow-xl overflow-hidden"
          style={{
            backgroundImage: `
              linear-gradient(to bottom, transparent 0px, transparent 28px, rgba(180, 83, 9, 0.08) 28px, rgba(180, 83, 9, 0.08) 29px),
              linear-gradient(to bottom right, #fef9c3 0%, #fefce8 50%, #fef3c7 100%)
            `,
            backgroundSize: '100% 30px, 100% 100%',
          }}
        >

          {/* Content */}
          <div className="pt-2 text-center">
            {/* Spinner */}
            <div className="w-12 h-12 mx-auto mb-4 relative">
              <div className="absolute inset-0 border-4 border-amber-200 rounded-full" />
              <div className="absolute inset-0 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              Processing{dots}
            </h3>

            {/* Current step */}
            <p className="text-amber-700 font-medium text-sm mb-3">
              {currentStep || 'Getting ready...'}
            </p>

            {/* Progress info */}
            <div className="bg-white/50 rounded-lg p-3 mb-3">
              {latestSuccess && (
                <p className="text-emerald-700 text-sm font-medium mb-1">
                  ✓ {latestSuccess.message}
                </p>
              )}
              {networkLogs.length > 0 && (
                <p className="text-slate-500 text-xs">
                  {networkLogs.length} API {networkLogs.length === 1 ? 'call' : 'calls'} made
                </p>
              )}
            </div>

            {/* Timer */}
            <div className="text-slate-400 text-xs">
              {formatTime(elapsedTime)} elapsed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
