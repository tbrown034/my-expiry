export default function GroceryAnalysisPopup({ analysisResult, onClose }) {
  if (!analysisResult) return null;

  // Handle both old analysis format and new freshness info format
  const isFreshnessInfo = analysisResult.freshnessInfo && Array.isArray(analysisResult.freshnessInfo);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {isFreshnessInfo ? 'Freshness Analysis' : 'Food Safety Report'}
              </h2>
              <p className="text-gray-500 text-sm">AI-powered insights for your groceries</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Freshness Information Display */}
          {isFreshnessInfo && (
            <div className="space-y-4">
              {analysisResult.freshnessInfo.map((item, index) => (
                <div key={index} className="group relative bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="absolute top-4 right-4 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-emerald-900 mb-3">{item.itemName}</h3>
                  <p className="text-emerald-800 leading-relaxed">{item.details}</p>
                </div>
              ))}
            </div>
          )}

          {/* Overall Assessment - for old format */}
          {!isFreshnessInfo && analysisResult.overallAssessment && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-900 mb-2">Overall Assessment</h3>
                  <p className="text-blue-800 leading-relaxed">{analysisResult.overallAssessment}</p>
                </div>
              </div>
            </div>
          )}

          {/* Unsafe Items */}
          {analysisResult.unsafeItems && analysisResult.unsafeItems.length > 0 && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-red-900">Immediate Action Required</h3>
                  <p className="text-red-700 text-sm">These items need attention right away</p>
                </div>
              </div>
              <div className="space-y-3">
                {analysisResult.unsafeItems.map((item, index) => (
                  <div key={index} className="bg-white/80 backdrop-blur-sm border border-red-200 rounded-xl p-4 shadow-sm">
                    <h4 className="font-bold text-red-900 mb-1">{item.itemName}</h4>
                    <p className="text-sm text-red-700 mb-2">{item.reason}</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {item.action}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Concerning Items */}
          {analysisResult.concerningItems && analysisResult.concerningItems.length > 0 && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-yellow-900">Items Needing Attention</h3>
                  <p className="text-yellow-700 text-sm">Keep an eye on these items</p>
                </div>
              </div>
              <div className="space-y-3">
                {analysisResult.concerningItems.map((item, index) => (
                  <div key={index} className="bg-white/80 backdrop-blur-sm border border-yellow-200 rounded-xl p-4 shadow-sm">
                    <h4 className="font-bold text-yellow-900 mb-1">{item.itemName}</h4>
                    <p className="text-sm text-yellow-700 mb-2">{item.concern}</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      {item.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Use Soon Items */}
          {analysisResult.useSoonItems && analysisResult.useSoonItems.length > 0 && (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-orange-900">Use Soon</h3>
                  <p className="text-orange-700 text-sm">Priority items for your next meals</p>
                </div>
              </div>
              <div className="space-y-3">
                {analysisResult.useSoonItems.map((item, index) => (
                  <div key={index} className="bg-white/80 backdrop-blur-sm border border-orange-200 rounded-xl p-4 shadow-sm">
                    <h4 className="font-bold text-orange-900 mb-1">{item.itemName}</h4>
                    <p className="text-sm text-orange-700 mb-2">{item.reason}</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {item.timeframe}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Overall Tips for Freshness Info */}
          {isFreshnessInfo && analysisResult.overallTips && analysisResult.overallTips.length > 0 && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-indigo-900">Pro Freshness Tips</h3>
                  <p className="text-indigo-700 text-sm">Expert insights to maximize your groceries</p>
                </div>
              </div>
              <div className="grid gap-3">
                {analysisResult.overallTips.map((tip, index) => (
                  <div key={index} className="bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-xl p-4 shadow-sm group hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <p className="text-indigo-800 leading-relaxed group-hover:text-indigo-900 transition-colors">{tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced General Tips - for old format */}
          {!isFreshnessInfo && analysisResult.generalTips && analysisResult.generalTips.length > 0 && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-emerald-900">Food Safety Expert Tips</h3>
                  <p className="text-emerald-700 text-sm">Smart strategies for safer storage</p>
                </div>
              </div>
              <div className="grid gap-3">
                {analysisResult.generalTips.map((tip, index) => (
                  <div key={index} className="bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-xl p-4 shadow-sm group hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <p className="text-emerald-800 leading-relaxed group-hover:text-emerald-900 transition-colors">{tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Raw Response Fallback */}
          {analysisResult.rawResponse && (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-500 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Analysis Details</h3>
                  <p className="text-gray-600 text-sm">Complete AI analysis report</p>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{analysisResult.rawResponse}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-3 rounded-2xl hover:from-emerald-700 hover:to-green-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
}