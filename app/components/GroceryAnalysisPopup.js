export default function GroceryAnalysisPopup({ analysisResult, onClose }) {
  if (!analysisResult) return null;

  // Handle both old analysis format and new freshness info format
  const isFreshnessInfo = analysisResult.freshnessInfo && Array.isArray(analysisResult.freshnessInfo);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isFreshnessInfo ? 'Freshness Information' : 'Food Safety Analysis'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Freshness Information Display */}
          {isFreshnessInfo && (
            <div className="space-y-4">
              {analysisResult.freshnessInfo.map((item, index) => (
                <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-green-900 mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {item.itemName}
                  </h3>
                  <p className="text-green-800 text-sm leading-relaxed">{item.details}</p>
                </div>
              ))}
            </div>
          )}

          {/* Overall Assessment - for old format */}
          {!isFreshnessInfo && analysisResult.overallAssessment && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Overall Assessment</h3>
              <p className="text-blue-800">{analysisResult.overallAssessment}</p>
            </div>
          )}

          {/* Unsafe Items */}
          {analysisResult.unsafeItems && analysisResult.unsafeItems.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Unsafe Items - Immediate Action Required
              </h3>
              <div className="space-y-3">
                {analysisResult.unsafeItems.map((item, index) => (
                  <div key={index} className="bg-white border border-red-300 rounded-lg p-3">
                    <h4 className="font-semibold text-red-900">{item.itemName}</h4>
                    <p className="text-sm text-red-700 mt-1">{item.reason}</p>
                    <p className="text-sm font-medium text-red-800 mt-2">Action: {item.action}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Concerning Items */}
          {analysisResult.concerningItems && analysisResult.concerningItems.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Items Needing Attention
              </h3>
              <div className="space-y-3">
                {analysisResult.concerningItems.map((item, index) => (
                  <div key={index} className="bg-white border border-yellow-300 rounded-lg p-3">
                    <h4 className="font-semibold text-yellow-900">{item.itemName}</h4>
                    <p className="text-sm text-yellow-700 mt-1">{item.concern}</p>
                    <p className="text-sm font-medium text-yellow-800 mt-2">Recommendation: {item.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Use Soon Items */}
          {analysisResult.useSoonItems && analysisResult.useSoonItems.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-orange-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Use Soon
              </h3>
              <div className="space-y-3">
                {analysisResult.useSoonItems.map((item, index) => (
                  <div key={index} className="bg-white border border-orange-300 rounded-lg p-3">
                    <h4 className="font-semibold text-orange-900">{item.itemName}</h4>
                    <p className="text-sm text-orange-700 mt-1">{item.reason}</p>
                    <p className="text-sm font-medium text-orange-800 mt-2">Timeframe: {item.timeframe}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Overall Tips for Freshness Info */}
          {isFreshnessInfo && analysisResult.overallTips && analysisResult.overallTips.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                General Freshness Tips
              </h3>
              <ul className="space-y-2">
                {analysisResult.overallTips.map((tip, index) => (
                  <li key={index} className="text-sm text-blue-800 flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* General Tips - for old format */}
          {!isFreshnessInfo && analysisResult.generalTips && analysisResult.generalTips.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Food Safety Tips
              </h3>
              <ul className="space-y-2">
                {analysisResult.generalTips.map((tip, index) => (
                  <li key={index} className="text-sm text-green-800 flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Raw Response Fallback */}
          {analysisResult.rawResponse && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Analysis Details</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{analysisResult.rawResponse}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}