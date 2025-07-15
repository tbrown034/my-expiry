import { formatExpiryText, getStatusColor } from '../../lib/utils';

export default function GroceryList({ groceries, onDelete }) {
  if (groceries.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">No groceries yet</h3>
        <p className="text-gray-600 text-lg">Start tracking your groceries to reduce food waste</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {groceries.map((grocery) => (
        <div 
          key={grocery.id}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <span className="text-2xl">🛒</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{grocery.name}</h3>
                <p className="text-sm text-gray-500 capitalize">{grocery.category}</p>
              </div>
            </div>
            
            <button
              onClick={() => onDelete(grocery.id)}
              className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all duration-150"
              title="Delete item"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Purchase Date</span>
              <span className="font-medium text-gray-900">
                {grocery.purchaseDate ? new Date(grocery.purchaseDate).toLocaleDateString() : 'Not specified'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Expiry Date</span>
              <span className="font-medium text-gray-900">
                {new Date(grocery.expiryDate).toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Shelf Life</span>
              <span className="font-medium text-gray-900">
                {grocery.purchaseDate ? Math.ceil((new Date(grocery.expiryDate) - new Date(grocery.purchaseDate)) / (1000 * 60 * 60 * 24)) : 'N/A'} days
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(grocery.status)}`}>
              {grocery.status.replace('_', ' ')}
            </span>
            
            <div className="text-right">
              <div className={`font-bold text-lg ${grocery.daysUntilExpiry < 0 ? 'text-red-600' : grocery.daysUntilExpiry <= 3 ? 'text-orange-600' : 'text-green-600'}`}>
                {formatExpiryText(grocery.daysUntilExpiry)}
              </div>
              {grocery.addedManually && (
                <span className="text-xs text-blue-600 font-medium">Manual entry</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}