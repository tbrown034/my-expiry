"use client"

import { useState, useMemo } from 'react';
import { formatExpiryText, getStatusColor, getCategoryColorClass, formatGroceryName, formatCategoryName } from '../../lib/utils';
import CountdownTimer from './CountdownTimer';

const CATEGORIES = [
  { key: 'all', label: 'All Items', icon: '📦' },
  { key: 'vegetables', label: 'Vegetables', icon: '🥬' },
  { key: 'fruits', label: 'Fruits', icon: '🍎' },
  { key: 'meat', label: 'Meat', icon: '🥩' },
  { key: 'dairy', label: 'Dairy', icon: '🥛' },
  { key: 'pantry', label: 'Pantry', icon: '🥫' },
  { key: 'beverages', label: 'Beverages', icon: '🧃' },
  { key: 'leftovers', label: 'Leftovers', icon: '🍽️' },
  { key: 'other', label: 'Other', icon: '📦' }
];

const SORT_OPTIONS = [
  { value: 'expiry', label: 'Expiry Date' },
  { value: 'daysRemain', label: 'Days Remaining' },
  { value: 'purchase-date', label: 'Purchase Date' },
  { value: 'name', label: 'Alphabetical' },
  { value: 'category', label: 'Category' },
  { value: 'recent', label: 'Recently Added' }
];

function sortItems(items, sortBy) {
  const sorted = [...items];
  
  switch (sortBy) {
    case 'expiry':
      return sorted.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
    case 'daysRemain':
      return sorted.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
    case 'purchase-date':
      return sorted.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
    case 'name':
      return sorted.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    case 'category':
      return sorted.sort((a, b) => a.category.localeCompare(b.category));
    case 'recent':
      return sorted.sort((a, b) => new Date(b.dateAdded || b.purchaseDate) - new Date(a.dateAdded || a.purchaseDate));
    default:
      return sorted;
  }
}

function FoodInventoryItem({ grocery, onDelete, onEdit, onShowDetail, index }) {
  return (
    <div 
      key={grocery.id}
      className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden animate-scale-in group"
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
  );
}

export default function FoodInventory({ groceries, onDelete, onEdit, onShowDetail, onGetFreshnessInfo, isAnalyzing, onClearAll, showFunAlert }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('expiry');

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts = { all: groceries.length };
    CATEGORIES.forEach(cat => {
      if (cat.key !== 'all') {
        counts[cat.key] = groceries.filter(item => item.category === cat.key).length;
      }
    });
    return counts;
  }, [groceries]);

  // Filter and sort groceries
  const filteredAndSortedGroceries = useMemo(() => {
    let filtered = groceries;
    if (activeCategory !== 'all') {
      filtered = groceries.filter(item => item.category === activeCategory);
    }
    return sortItems(filtered, sortBy);
  }, [groceries, activeCategory, sortBy]);

  if (groceries.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in-up">
        <div className="text-center py-16 px-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-inner">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">No food items yet</h3>
          <p className="text-gray-600 max-w-md mx-auto leading-relaxed">Start tracking your food inventory to reduce waste and stay on top of expiration dates</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1">Food Inventory</h2>
            <p className="text-sm text-gray-600">Manage and track your current food items</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-200 hover:border-emerald-300 text-gray-700 font-medium text-sm px-4 py-2.5 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 shadow-sm"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>Sort by {option.label}</option>
              ))}
            </select>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={onGetFreshnessInfo}
                disabled={isAnalyzing}
                className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-medium px-4 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-sm flex items-center gap-2 disabled:opacity-50 transform hover:scale-105"
              >
                {isAnalyzing ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ) : (
                  <span>🔍</span>
                )}
                {isAnalyzing ? 'Analyzing...' : 'Freshness Info'}
              </button>
              
              <button
                onClick={() => showFunAlert('construction')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium px-4 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-sm transform hover:scale-105"
              >
                🎨 Style Mode
              </button>
              
              <button
                onClick={onClearAll}
                className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-medium px-4 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-sm transform hover:scale-105"
              >
                🗑️ Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {CATEGORIES.map((category) => {
              const count = categoryCounts[category.key] || 0;
              const isActive = activeCategory === category.key;
              
              return (
                <button
                  key={category.key}
                  onClick={() => setActiveCategory(category.key)}
                  disabled={count === 0 && category.key !== 'all'}
                  className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg'
                      : count > 0 || category.key === 'all'
                      ? 'bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 border border-gray-200 hover:border-emerald-300'
                      : 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200'
                  }`}
                >
                  <span className="text-base">{category.icon}</span>
                  <span>{category.label}</span>
                  <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {count}
                  </span>
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
          
          {/* Current filter info */}
          <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-2">
            <span>
              Showing <span className="font-semibold text-gray-900">{filteredAndSortedGroceries.length}</span> items 
              {activeCategory !== 'all' && (
                <> in <span className="font-semibold text-emerald-600">
                  {CATEGORIES.find(c => c.key === activeCategory)?.label}
                </span></>
              )}
            </span>
            <span className="text-xs">
              Sorted by {SORT_OPTIONS.find(s => s.value === sortBy)?.label}
            </span>
          </div>
        </div>

        {/* Items List */}
        {filteredAndSortedGroceries.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
              <span className="text-2xl opacity-60">
                {CATEGORIES.find(c => c.key === activeCategory)?.icon || '📦'}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No items in {CATEGORIES.find(c => c.key === activeCategory)?.label}
            </h3>
            <p className="text-gray-500 text-sm">Try selecting a different category or add some items</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAndSortedGroceries.map((grocery, index) => (
              <FoodInventoryItem
                key={grocery.id}
                grocery={grocery}
                onDelete={onDelete}
                onEdit={onEdit}
                onShowDetail={onShowDetail}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}