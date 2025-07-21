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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
      {/* Header */}
      <header className="relative z-10 px-4 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 
            className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-green-600 transition-colors"
            onClick={() => window.location.href = '/'}
          >
            My Expiry
          </h1>
          
          <AuthButton />
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-emerald-300 rounded-full opacity-30 animate-bounce" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-green-300 rounded-full opacity-25 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-emerald-200 rounded-full opacity-20 animate-bounce" style={{animationDelay: '0.5s'}}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              Keep Your Food
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                Fresh & Safe
              </span>
            </h1>
            
            {/* Subheadline */}
            <div className="mb-8 max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                <span className="relative inline-block">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Track groceries</span>
                  <span className="absolute bottom-2 left-0 w-full h-4 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full opacity-50 animate-pulse"></span>
                </span>
                {' '}and{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">leftovers</span>
                  <span className="absolute bottom-2 left-0 w-full h-4 bg-gradient-to-r from-orange-200 to-red-200 rounded-full opacity-50 animate-pulse" style={{animationDelay: '0.5s'}}></span>
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                AI-powered freshness insights to keep your food safe and fresh.
                <span className="block mt-3 font-semibold text-lg md:text-xl text-green-700">
                  ✨ Eliminate waste • Stay healthy • Save money • Feel empowered
                </span>
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onStartTracking()}
                className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xl font-bold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <span>Start Tracking Now</span>
                <svg className="ml-3 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <p className="text-sm text-gray-500 font-medium">No signup required • Free forever</p>
            </div>
          </div>

          {/* Quick Check Section */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-10 shadow-2xl border border-green-100 hover:shadow-3xl transition-all duration-300">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-3">Quick Freshness Check</h3>
                <p className="text-lg text-gray-600">Get instant shelf life information for any item</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <input
                  type="text"
                  value={quickItem}
                  onChange={(e) => setQuickItem(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g., leftover beef stew, bananas, milk..."
                  className="flex-1 px-6 py-4 rounded-2xl border-2 border-green-200 focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-100 text-lg placeholder-gray-400 transition-all duration-200"
                  disabled={isLoading}
                />
                <button
                  onClick={handleQuickCheck}
                  disabled={isLoading || !quickItem.trim()}
                  className="px-8 py-4 bg-green-600 text-white rounded-2xl hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold transition-all duration-200 flex items-center justify-center min-w-[120px] shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <ButtonSpinner color="white" />
                  ) : (
                    'Check'
                  )}
                </button>
              </div>

              {/* Quick Answer Display */}
              {quickAnswer && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200 shadow-lg">
                  {quickAnswer.error ? (
                    <p className="text-red-600 text-center">{quickAnswer.message}</p>
                  ) : (
                    <>
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">🥗</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-lg mb-2">{quickAnswer.name}</h4>
                          <p className="text-gray-700 leading-relaxed">{quickAnswer.answer}</p>
                          {quickAnswer.storageRecommendations && (
                            <p className="text-sm text-green-700 mt-2 italic">
                              💡 {quickAnswer.storageRecommendations}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-center">
                        <button
                          onClick={handleAddToList}
                          className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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