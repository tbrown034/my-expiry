import { formatExpiryText, getStatusColor } from '../../lib/utils';

export default function GroceryList({ groceries, onDelete }) {
  if (groceries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 5l7 7M7 5l5 5" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No groceries yet</h3>
        <p className="text-gray-500">Add your first grocery item to start tracking expiration dates</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groceries.map((grocery) => (
        <div 
          key={grocery.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-gray-900">{grocery.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(grocery.status)}`}>
                  {grocery.status.replace('_', ' ')}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 mt-2">
                <div>
                  <span className="font-medium text-gray-700">Category:</span> {grocery.category}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Purchase Date:</span> {grocery.purchaseDate ? new Date(grocery.purchaseDate).toLocaleDateString() : 'Not specified'}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Expiry Date:</span> {new Date(grocery.expiryDate).toLocaleDateString()}
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                <div>
                  <span className="font-medium text-gray-700">Shelf Life:</span> {grocery.purchaseDate ? Math.ceil((new Date(grocery.expiryDate) - new Date(grocery.purchaseDate)) / (1000 * 60 * 60 * 24)) : 'N/A'} days
                </div>
                <span>•</span>
                <span className={`font-medium ${grocery.daysUntilExpiry < 0 ? 'text-red-600' : grocery.daysUntilExpiry <= 3 ? 'text-orange-600' : 'text-green-600'}`}>
                  {formatExpiryText(grocery.daysUntilExpiry)}
                </span>
                {grocery.addedManually && (
                  <>
                    <span>•</span>
                    <span className="text-blue-600">Manual entry</span>
                  </>
                )}
              </div>
              
              <div className="text-xs text-gray-500 mt-1">
                Added: {new Date(grocery.createdAt).toLocaleDateString()}
              </div>
            </div>
            
            <button
              onClick={() => onDelete(grocery.id)}
              className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
              title="Delete item"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}