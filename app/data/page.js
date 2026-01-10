'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { SHELF_LIFE_DATABASE, CATEGORIES, DATA_METADATA } from '../../lib/shelfLifeDatabase';

export default function DataPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Convert database object to array for display
  const dataArray = useMemo(() => {
    return Object.entries(SHELF_LIFE_DATABASE).map(([key, data]) => ({
      id: key,
      name: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      ...data
    }));
  }, []);

  // Filter data based on search and category
  const filteredData = useMemo(() => {
    return dataArray.filter(item => {
      const matchesSearch = search === '' ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.keywords.some(k => k.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [dataArray, search, selectedCategory]);

  // Group by category for display
  const groupedData = useMemo(() => {
    const groups = {};
    for (const item of filteredData) {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    }
    return groups;
  }, [filteredData]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Link>
            <h1 className="text-lg font-semibold text-slate-800">Food Safety Data</h1>
            <div className="w-16" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Data Source Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-800 mb-2">Official Food Safety Data</h2>
              <p className="text-slate-600 mb-4">
                Our shelf life estimates are based on official U.S. government food safety guidelines.
                This data represents <strong>conservative storage times</strong> to ensure food safety.
              </p>

              {/* Official Sources */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Data Sources</h3>
                <div className="space-y-2">
                  {DATA_METADATA.sources.map((source, i) => (
                    <a
                      key={i}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-slate-800 group-hover:text-emerald-700">{source.name}</div>
                        <div className="text-xs text-slate-500">{source.description}</div>
                      </div>
                      <svg className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-slate-500 mb-1">Data Version</div>
                  <div className="font-medium text-slate-800">v{DATA_METADATA.version}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-slate-500 mb-1">Last Verified</div>
                  <div className="font-medium text-slate-800">{new Date(DATA_METADATA.lastUpdated).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-slate-500 mb-1">Items in Database</div>
                  <div className="font-medium text-slate-800">{dataArray.length} foods</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-slate-500 mb-1">Storage Format</div>
                  <div className="font-medium text-slate-800">Static JSON</div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-800">
                  <strong>Disclaimer:</strong> {DATA_METADATA.disclaimer}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search foods (e.g., chicken, milk, apples)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="mt-3 text-sm text-slate-500">
            Showing {filteredData.length} of {dataArray.length} items
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {Object.entries(groupedData).map(([category, items]) => (
            <div key={category}>
              {/* Category Header */}
              <div className="bg-slate-100 px-4 py-2 border-b border-slate-200">
                <h3 className="font-semibold text-slate-700">{category}</h3>
              </div>

              {/* Items */}
              <div className="divide-y divide-slate-100">
                {items.map(item => (
                  <div key={item.id} className="px-4 py-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-slate-800">{item.name}</div>
                        <div className="text-sm text-slate-500 mt-0.5">
                          Keywords: {item.keywords.slice(0, 5).join(', ')}
                          {item.keywords.length > 5 && ` +${item.keywords.length - 5} more`}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-emerald-600">{item.days} days</div>
                        <div className="text-xs text-slate-500">{item.source}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {filteredData.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              <p>No items match your search</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-slate-500">
          <p>
            Data sourced from{' '}
            <a
              href="https://www.foodsafety.gov/keep-food-safe/foodkeeper-app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline"
            >
              USDA FoodKeeper
            </a>
            {' '}and{' '}
            <a
              href="https://www.fda.gov/food/buy-store-serve-safe-food/safe-food-handling"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline"
            >
              FDA Food Safety
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
