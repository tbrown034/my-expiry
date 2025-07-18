import { formatExpiryText, getStatusColor, getCategoryColorClass } from '../../lib/utils';
import CountdownTimer from './CountdownTimer';

export default function GroceryList({ groceries, onDelete, onEdit }) {
  if (groceries.length === 0) {
    return (
      <div className="border-4 border-gray-400 rounded-lg">
        <div className="text-center py-12 px-6">
          <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No groceries yet</h3>
          <p className="text-gray-600 text-sm max-w-md mx-auto">Start tracking your groceries to reduce food waste and stay on top of expiration dates</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {groceries.map((grocery) => (
        <div 
          key={grocery.id}
          className="border-4 border-gray-400 rounded-lg hover:bg-gray-50 transition-colors overflow-hidden"
          role="article"
          aria-labelledby={`grocery-${grocery.id}-title`}
        >
          {/* Mobile Layout */}
          <div className="block sm:hidden p-4">
            <div className="flex items-start space-x-3">
              <div className="flex items-center flex-shrink-0">
                <div className={`w-3 h-3 rounded-sm ${getCategoryColorClass(grocery.category)}`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 id={`grocery-${grocery.id}-title`} className="font-medium text-gray-900 text-base truncate mb-1">
                  {grocery.name}
                </h3>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded capitalize">
                    {grocery.category}
                  </span>
                  {grocery.addedManually && (
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      Manual
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Expires: {new Date(grocery.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <CountdownTimer expiryDate={grocery.expiryDate} className="text-sm" />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(grocery.status)}`}>
                    {grocery.status.replace('_', ' ')}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onEdit(grocery.id)}
                      className="text-gray-400 hover:text-blue-500 p-1 rounded hover:bg-blue-50 transition-colors"
                      title="Edit item"
                      aria-label={`Edit ${grocery.name}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(grocery.id)}
                      className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
                      title="Delete item"
                      aria-label={`Delete ${grocery.name}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:block p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="flex items-center flex-shrink-0">
                  <div className={`w-3 h-3 rounded-sm ${getCategoryColorClass(grocery.category)}`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 id={`grocery-${grocery.id}-title`} className="font-medium text-gray-900 text-base truncate mb-1">
                    {grocery.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded capitalize">
                      {grocery.category}
                    </span>
                    {grocery.addedManually && (
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        Manual entry
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm">
                <div className="hidden lg:block text-right text-gray-600 min-w-0">
                  <div className="text-xs text-gray-500 mb-0.5">Purchase</div>
                  <div className="font-medium">
                    {grocery.purchaseDate ? new Date(grocery.purchaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
                  </div>
                </div>
                
                <div className="text-right text-gray-600 min-w-0">
                  <div className="text-xs text-gray-500 mb-0.5">Expiry</div>
                  <div className="font-medium">
                    {new Date(grocery.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>

                <div className="text-center min-w-0">
                  <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(grocery.status)} block mb-1`}>
                    {grocery.status.replace('_', ' ')}
                  </span>
                  <CountdownTimer expiryDate={grocery.expiryDate} className="text-sm" />
                </div>

                <div className="flex items-center space-x-1 flex-shrink-0">
                  <button
                    onClick={() => onEdit(grocery.id)}
                    className="text-gray-400 hover:text-blue-500 p-1 rounded hover:bg-blue-50 transition-colors"
                    title="Edit item"
                    aria-label={`Edit ${grocery.name}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  <button
                    onClick={() => onDelete(grocery.id)}
                    className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
                    title="Delete item"
                    aria-label={`Delete ${grocery.name}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}