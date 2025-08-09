'use client';

import { useState } from 'react';
import { ButtonSpinner } from './LoadingSpinner';
import AuthButton from './AuthButton';

export default function LandingPage({ onStartTracking, onSignIn, onSignUp }) {
  const [quickItem, setQuickItem] = useState('');
  const [quickAnswer, setQuickAnswer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickCheck = async () => {
    if (!quickItem.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/quick-shelf-life', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemName: quickItem.trim() })
      });

      if (!response.ok) throw new Error('Failed to get shelf life');
      
      const result = await response.json();
      setQuickAnswer(result);
    } catch (error) {
      console.error('Error getting quick answer:', error);
      setQuickAnswer({
        error: true,
        message: 'Unable to get shelf life information. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToList = () => {
    if (quickAnswer && !quickAnswer.error) {
      onStartTracking(quickAnswer);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleQuickCheck();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Remove header since it's now in layout */}

      {/* Hero Section */}
      <main className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-100 rounded-full opacity-40 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-emerald-200 rounded-full opacity-30 animate-bounce" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-emerald-300 rounded-full opacity-25 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-emerald-100 rounded-full opacity-30 animate-bounce" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full opacity-20"></div>
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-gradient-to-tr from-green-100 to-emerald-100 rounded-full opacity-15"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-20 animate-fade-in-up">
            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-12 leading-tight">
              Keep Your Food
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-600 animate-pulse">
                Fresh & Safe
              </span>
            </h1>
            
            {/* Subheadline */}
            <div className="mb-12 max-w-4xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-8 leading-tight">
                <span className="relative inline-block">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-600">Track groceries</span>
                  <span className="absolute bottom-2 left-0 w-full h-3 bg-gradient-to-r from-emerald-200/60 to-green-200/60 rounded-full animate-pulse"></span>
                </span>
                {' '}and{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">leftovers</span>
                  <span className="absolute bottom-2 left-0 w-full h-3 bg-gradient-to-r from-amber-200/60 to-orange-200/60 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></span>
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-8">
                AI-powered freshness insights to keep your food safe and fresh.
              </p>
              <div className="flex flex-wrap justify-center items-center gap-6 text-lg font-medium text-gray-700">
                <span className="flex items-center gap-2">
                  <span className="text-emerald-500">✨</span> Eliminate waste
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-blue-500">💚</span> Stay healthy
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-green-500">💰</span> Save money
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-purple-500">⚡</span> Feel empowered
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <button
                onClick={() => onStartTracking()}
                className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xl font-bold rounded-2xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1"
              >
                <span>Start Tracking</span>
                <svg className="ml-3 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Quick Check Section */}
          <div className="max-w-4xl mx-auto animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <div className="card p-12 bg-white/90 backdrop-blur-md border-0 shadow-2xl hover:shadow-3xl">
              <div className="text-center mb-10">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Quick Freshness Check</h3>
                <p className="text-xl text-gray-600">Get instant shelf life information for any item</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 mb-10">
                <input
                  type="text"
                  value={quickItem}
                  onChange={(e) => setQuickItem(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g., leftover beef stew, bananas, milk..."
                  className="flex-1 px-6 py-5 rounded-2xl border-2 border-gray-200 focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100 text-lg placeholder-gray-400 transition-all duration-300 shadow-sm focus:shadow-md"
                  disabled={isLoading}
                />
                <button
                  onClick={handleQuickCheck}
                  disabled={isLoading || !quickItem.trim()}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-10 py-5 text-lg font-semibold rounded-2xl transition-colors duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px] transform hover:scale-105"
                >
                  {isLoading ? (
                    <ButtonSpinner color="white" />
                  ) : (
                    'Check Freshness'
                  )}
                </button>
              </div>

              {/* Quick Answer Display */}
              {quickAnswer && (
                <div className="bg-gradient-to-br from-white/70 to-green-50/70 backdrop-blur-sm rounded-3xl p-8 border-2 border-green-200/50 shadow-xl">
                  {quickAnswer.error ? (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">❌</span>
                      </div>
                      <p className="text-red-700 font-medium">{quickAnswer.message}</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start gap-6 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <span className="text-3xl">🥗</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-xl mb-3">{quickAnswer.name}</h4>
                          <div className="bg-white/60 rounded-xl p-4 mb-4 border border-green-100">
                            <p className="text-gray-800 leading-relaxed">{quickAnswer.answer}</p>
                          </div>
                          {quickAnswer.storageRecommendations && (
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200/50">
                              <p className="text-green-800 text-sm font-medium flex items-start gap-2">
                                <span className="text-lg">💡</span>
                                <span>{quickAnswer.storageRecommendations}</span>
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-center">
                        <button
                          onClick={handleAddToList}
                          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl hover:from-green-700 hover:to-emerald-700 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add to My List
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-20 grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌱</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Stay Fresh</h3>
              <p className="text-gray-600">AI-powered insights keep your food at peak freshness and safety</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💚</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Reduce Waste</h3>
              <p className="text-gray-600">Smart tracking helps you use everything before it expires</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Save Money</h3>
              <p className="text-gray-600">Never throw away good food again with precise expiry tracking</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}