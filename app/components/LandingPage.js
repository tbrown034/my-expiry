"use client";

import { useState } from "react";
import { ButtonSpinner } from "./LoadingSpinner";
import AuthButtonClient from "./AuthButtonClient";

export default function LandingPage({ onStartTracking, onSignIn, onSignUp, session }) {
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
              
              {session ? (
                <a
                  href="/profile"
                  className="inline-flex items-center gap-3 px-8 py-5 bg-white/90 backdrop-blur-sm border-2 border-emerald-300 rounded-2xl hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl group"
                >
                  {session.user?.image && (
                    <img 
                      src={session.user.image} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full border-2 border-emerald-400"
                    />
                  )}
                  <span className="text-lg font-bold text-gray-800 group-hover:text-emerald-700">
                    My Profile
                  </span>
                  <svg 
                    className="w-5 h-5 text-gray-500 group-hover:text-emerald-600 transition-colors" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              ) : (
                <a
                  href="/auth/signin"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-white/90 backdrop-blur-sm border-2 border-emerald-300 rounded-2xl hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl font-bold text-lg"
                >
                  <svg 
                    className="w-6 h-6 text-emerald-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span className="text-gray-800">Sign In</span>
                </a>
              )}
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
            className="max-w-4xl mx-auto animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="card p-12 bg-white/90 backdrop-blur-md border-0 shadow-2xl hover:shadow-3xl">
              <div className="text-center mb-10">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Quick Freshness Check
                </h3>
                <p className="text-xl text-gray-600">
                  Get instant shelf life information for any item
                </p>
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
                  className="bg-emerald-500 hover:bg-emerald-600 text-white  px-10 py-5 text-lg font-semibold rounded-2xl transition-colors duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px] transform hover:scale-105"
                >
                  {isLoading ? (
                    <ButtonSpinner color="white" />
                  ) : (
                    "Check Freshness"
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
                      <p className="text-red-700 font-medium">
                        {quickAnswer.message}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start gap-6 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <span className="text-3xl">🥗</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-xl mb-3">
                            {quickAnswer.name}
                          </h4>
                          <div className="bg-white/60 rounded-xl p-4 mb-4 border border-green-100">
                            <p className="text-gray-800 leading-relaxed">
                              {quickAnswer.answer}
                            </p>
                          </div>
                          {quickAnswer.storageRecommendations && (
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200/50">
                              <p className="text-green-800 text-sm font-medium flex items-start gap-2">
                                <span className="text-lg">💡</span>
                                <span>
                                  {quickAnswer.storageRecommendations}
                                </span>
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
                          <svg
                            className="w-5 h-5 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
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

        </div>
      </main>
    </div>
  );
}
