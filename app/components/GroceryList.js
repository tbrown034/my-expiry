import { formatExpiryText, getStatusColor, getCategoryColorClass, formatGroceryName, formatCategoryName } from '../../lib/utils';
import CountdownTimer from './CountdownTimer';

export default function GroceryList({ groceries, onDelete, onEdit, onShowDetail }) {
  if (groceries.length === 0) {
    return (
      <div className="bg-white border border-gray-200/60 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in-up">
        <div className="text-center py-16 px-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-inner">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">No groceries yet</h3>
          <p className="text-gray-600 max-w-md mx-auto leading-relaxed">Start tracking your groceries to reduce food waste and stay on top of expiration dates</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
      {groceries.map((grocery, index) => (
        <div 
          key={grocery.id}
          className="bg-white border border-gray-200/60 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden animate-scale-in group"
          style={{animationDelay: `${0.05 * index}s`}}
          role="article"
          aria-labelledby={`grocery-${grocery.id}-title`}
        >
          {/* Mobile Layout */}
          <div className="block sm:hidden p-5">
            <div className="flex items-start space-x-4">
              <div className="flex items-center flex-shrink-0 mt-1">
                <div className={`w-4 h-4 rounded-full ${getCategoryColorClass(grocery.category)} shadow-sm`}></div>
              </div>
              <div 
                className="flex-1 min-w-0 cursor-pointer"
                onClick={() => onShowDetail(grocery.id)}
              >
                <h3 id={`grocery-${grocery.id}-title`} className="font-semibold text-gray-900 text-lg truncate mb-2">
                  {formatGroceryName(grocery.name)}
                </h3>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                    {formatCategoryName(grocery.category)}
                  </span>
                  {grocery.addedManually && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      Manual
                    </span>
                  )}
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Expires: {new Date(grocery.expiryDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: new Date(grocery.expiryDate).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                      })}
                    </span>
                    <CountdownTimer expiryDate={grocery.expiryDate} className="text-sm font-medium" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Purchased: {new Date(grocery.purchaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      grocery.status === 'expired' 
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : grocery.status === 'expiring_soon'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-green-50 text-green-700 border border-green-200'
                    }`}>
                      {grocery.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-1 flex-shrink-0">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(grocery.id);
                  }}
                  className="p-2.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200"
                  aria-label={`Edit ${grocery.name}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(grocery.id);
                  }}
                  className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  aria-label={`Delete ${grocery.name}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:block p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="flex items-center flex-shrink-0">
                  <div className={`w-4 h-4 rounded-full ${getCategoryColorClass(grocery.category)} shadow-sm`}></div>
                </div>
                <div 
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => onShowDetail(grocery.id)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 id={`grocery-${grocery.id}-title`} className="font-semibold text-gray-900 text-lg truncate">
                      {formatGroceryName(grocery.name)}
                    </h3>
                    <div className="flex items-center space-x-3">
                      <CountdownTimer expiryDate={grocery.expiryDate} className="text-sm font-medium" />
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        grocery.status === 'expired' 
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : grocery.status === 'expiring_soon'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-green-50 text-green-700 border border-green-200'
                      }`}>
                        {grocery.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                        {formatCategoryName(grocery.category)}
                      </span>
                      {grocery.addedManually && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          Manual
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-xs">
                      <span>
                        Purchased: {new Date(grocery.purchaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span>
                        Expires: {new Date(grocery.expiryDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: new Date(grocery.expiryDate).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 flex-shrink-0 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(grocery.id);
                  }}
                  className="p-2.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200"
                  aria-label={`Edit ${grocery.name}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(grocery.id);
                  }}
                  className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
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
      ))}
    </div>
  );
}