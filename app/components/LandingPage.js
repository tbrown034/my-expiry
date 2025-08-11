"use client";

import { useState } from "react";
import { ButtonSpinner } from "./LoadingSpinner";
import AuthButtonClient from "./AuthButtonClient";
export default function LandingPage({ onStartTracking, onSignIn, onSignUp }) {
  const [quickItem, setQuickItem] = useState("");
  const [quickAnswer, setQuickAnswer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickCheck = async () => {
    if (!quickItem.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/quick-shelf-life", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemName: quickItem.trim() }),
      });

      if (!response.ok) throw new Error("Failed to get shelf life");

      const result = await response.json();
      setQuickAnswer(result);
    } catch (error) {
      console.error("Error getting quick answer:", error);
      setQuickAnswer({
        error: true,
        message: "Unable to get shelf life information. Please try again.",
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

  const handleTryAnother = () => {
    setQuickAnswer(null);
    setQuickItem("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
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
          <div
            className="absolute top-40 right-20 w-24 h-24 bg-emerald-200 rounded-full opacity-30 animate-bounce"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-20 left-1/4 w-20 h-20 bg-emerald-300 rounded-full opacity-25 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/3 right-1/3 w-16 h-16 bg-emerald-100 rounded-full opacity-30 animate-bounce"
            style={{ animationDelay: "0.5s" }}
          ></div>
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
            <div
              className="mb-12 max-w-4xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-8 leading-tight">
                <span className="relative inline-block">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-600">
                    Track groceries
                  </span>
                  <span className="absolute bottom-2 left-0 w-full h-3 bg-gradient-to-r from-emerald-200/60 to-green-200/60 rounded-full animate-pulse"></span>
                </span>{" "}
                and{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                    leftovers
                  </span>
                  <span
                    className="absolute bottom-2 left-0 w-full h-3 bg-gradient-to-r from-amber-200/60 to-orange-200/60 rounded-full animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  ></span>
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-8">
                AI-powered freshness insights to keep your food safe and fresh.
              </p>
            </div>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              <button
                onClick={() => onStartTracking()}
                className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xl font-bold rounded-2xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1"
              >
                <span>Start Tracking</span>
                <svg
                  className="ml-3 w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
              
              <div className="inline-flex items-center gap-3 px-10 py-5 bg-gray-50 border-2 border-gray-200 rounded-2xl cursor-not-allowed opacity-60 font-bold text-lg">
                <svg 
                  className="w-6 h-6 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-gray-500">User Accounts - Coming Soon!</span>
              </div>
            </div>


            {/* Benefits Section */}
            <div className="mt-20 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 group-hover:rotate-3 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-gentle-pulse"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Stay Fresh & Safe
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-base">
                    Advanced AI analyzes storage conditions and provides real-time freshness alerts to keep your food safe
                  </p>
                  <div className="mt-6 flex items-center text-sm text-green-600 font-medium">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Real-time monitoring
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 group-hover:rotate-3 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                      </svg>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full animate-gentle-pulse"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Zero Food Waste
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-base">
                    Smart reminders and meal suggestions help you use ingredients before they expire
                  </p>
                  <div className="mt-6 flex items-center text-sm text-emerald-600 font-medium">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                    Sustainability focused
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 group-hover:rotate-3 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full animate-gentle-pulse"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Save Money
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-base">
                    Track savings from prevented waste and optimize your grocery shopping habits
                  </p>
                  <div className="mt-6 flex items-center text-sm text-amber-600 font-medium">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                    Budget optimization
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Check Section */}
          <div
            className="max-w-5xl mx-auto animate-fade-in-up mt-20"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
              <div className="relative bg-white rounded-3xl p-10 shadow-2xl border border-gray-100">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-lg mb-6 transform -rotate-3">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-4xl font-bold text-gray-900 mb-4">
                    Quick Freshness Check
                  </h3>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Instantly discover how long any food item stays fresh with AI-powered insights
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <div className="relative flex-1">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={quickItem}
                      onChange={(e) => setQuickItem(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Try 'leftover pizza', 'fresh strawberries', or 'opened yogurt'..."
                      className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-gray-200 hover:border-gray-300 focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100 text-lg placeholder-gray-400 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg bg-white"
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    onClick={handleQuickCheck}
                    disabled={isLoading || !quickItem.trim()}
                    className="group relative px-10 py-5 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-lg font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 min-w-[200px] transform hover:scale-105 hover:from-emerald-600 hover:to-green-700"
                  >
                    {isLoading ? (
                      <ButtonSpinner color="white" />
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Check Now
                      </>
                    )}
                  </button>
                </div>

              {/* Quick Answer Display */}
              {quickAnswer && (
                <div className="relative mt-8">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-green-400 rounded-2xl blur opacity-20"></div>
                  <div className="relative bg-gradient-to-br from-white to-emerald-50/30 rounded-2xl p-8 border border-emerald-200/50 shadow-xl">
                    {/* Close Button */}
                    <button
                      onClick={handleTryAnother}
                      className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                      aria-label="Close result"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    
                    {quickAnswer.error ? (
                      <div className="text-center py-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-red-700 font-semibold text-lg mb-4">
                          {quickAnswer.message}
                        </p>
                        <button
                          onClick={handleTryAnother}
                          className="inline-flex items-center px-6 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl hover:bg-red-100 hover:border-red-300 font-semibold transition-all duration-300 gap-2"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          Try Again
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start gap-6 mb-6">
                          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg transform -rotate-3">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-2xl mb-4">
                              {quickAnswer.name}
                            </h4>
                            <div className="bg-white/80 rounded-xl p-5 mb-4 border border-emerald-100 shadow-sm">
                              <p className="text-gray-700 leading-relaxed text-lg">
                                {quickAnswer.answer}
                              </p>
                            </div>
                            {quickAnswer.storageRecommendations && (
                              <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-5 border border-emerald-200/50">
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-gray-700 mb-1">Storage Tip</p>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                      {quickAnswer.storageRecommendations}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
                          <button
                            onClick={handleAddToList}
                            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl hover:from-emerald-700 hover:to-green-700 font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg gap-3"
                          >
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                            Add to My List
                          </button>
                          
                          <button
                            onClick={handleTryAnother}
                            className="inline-flex items-center px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-300 font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 text-lg gap-3"
                          >
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                            Try Another
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
