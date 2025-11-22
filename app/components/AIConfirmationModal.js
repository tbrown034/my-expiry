import { useState } from 'react'

export default function AIConfirmationModal({ 
  isOpen, 
  pendingAIResult, 
  additionalDetails,
  setAdditionalDetails,
  aiConfirmLeftover,
  setAiConfirmLeftover,
  isLoadingShelfLife,
  onUpdateWithDetails,
  onShowInfo,
  onAccept,
  onEdit,
  onReject
}) {
  if (!isOpen || !pendingAIResult) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Confirm Our Suggestion</h2>
        
        <div className="mb-4">
          <div className="bg-gray-50 p-4 rounded-xl mb-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Your input:</span>
                  </p>
                  <p className="text-base font-medium text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                    &ldquo;{pendingAIResult.originalInput}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              {pendingAIResult.isEnhanced && (
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              )}
              <h3 className="text-lg font-semibold text-gray-900">
                {pendingAIResult.isEnhanced ? 'Enhanced Suggestion' : 'Our Suggestion'}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 p-5 rounded-xl mb-6 shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-600">Item Name</span>
              <div>
                <div>
                  <p className="text-gray-900 font-semibold text-lg">{pendingAIResult.name}</p>
                  {pendingAIResult.modifier && (
                    <p className="text-sm text-gray-600 mt-0.5 font-medium">
                      {pendingAIResult.modifier}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-600">Category</span>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-medium bg-blue-100 text-blue-800">
                  {pendingAIResult.category.charAt(0).toUpperCase() + pendingAIResult.category.slice(1)}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-600">Estimated Shelf Life</span>
              <div>
                <p className="text-gray-900 font-semibold flex items-center gap-2 mb-2">
                  <span className="text-xl font-semibold text-emerald-600">{pendingAIResult.shelfLifeDays}</span>
                  <span className="text-gray-600 text-sm">days</span>
                </p>
                {pendingAIResult.shelfLifeDays && (
                  <button 
                    onClick={() => onShowInfo(pendingAIResult)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all hover:shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Why {pendingAIResult.shelfLifeDays} days?
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-600">Expires On</span>
              <p className="text-gray-900 font-semibold">
                {new Date(pendingAIResult.expiryDate).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add more details (optional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g., frozen, pulled, pot pie, organic..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && additionalDetails.trim()) {
                    onUpdateWithDetails()
                  }
                }}
              />
              <button
                onClick={onUpdateWithDetails}
                disabled={!additionalDetails.trim() || isLoadingShelfLife}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoadingShelfLife ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Update
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Add descriptors like &ldquo;frozen&rdquo;, &ldquo;organic&rdquo;, or &ldquo;idaho&rdquo; and click Update for a more specific suggestion
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Leftovers</label>
            <button
              type="button"
              onClick={() => setAiConfirmLeftover(!aiConfirmLeftover)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                aiConfirmLeftover ? 'bg-yellow-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ${
                  aiConfirmLeftover ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onReject}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Reject
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 text-blue-600 hover:text-blue-800 border border-blue-300 rounded-lg hover:bg-blue-50"
          >
            Edit
          </button>
          <button
            onClick={onAccept}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
          >
            Accept & Add
          </button>
        </div>
      </div>
    </div>
  )
}