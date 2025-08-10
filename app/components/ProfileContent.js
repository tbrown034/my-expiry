"use client"

import { useState } from "react"

export default function ProfileContent() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <>
      {/* Navigation Tabs */}
      <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-3xl mb-8 border border-green-100">
        <div className="border-b border-green-100">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'groceries', label: 'Groceries' },
              { key: 'activity', label: 'Activity' },
              { key: 'settings', label: 'Settings' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-green-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-green-100">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Items</p>
                    <p className="text-2xl font-bold text-gray-900">24</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-orange-100">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                    <p className="text-2xl font-bold text-orange-600">3</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-red-100">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Expired</p>
                    <p className="text-2xl font-bold text-red-600">1</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-blue-100">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Categories</p>
                    <p className="text-2xl font-bold text-blue-600">6</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-green-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { action: 'Added', item: 'Organic Milk', time: '2 hours ago', type: 'add' },
                  { action: 'Consumed', item: 'Greek Yogurt', time: '1 day ago', type: 'consume' },
                  { action: 'Added', item: 'Fresh Spinach', time: '2 days ago', type: 'add' },
                  { action: 'Expired', item: 'Bananas', time: '3 days ago', type: 'expire' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full shadow-sm ${
                      activity.type === 'add' ? 'bg-gradient-to-r from-green-400 to-green-500' :
                      activity.type === 'consume' ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
                      activity.type === 'expire' ? 'bg-gradient-to-r from-red-400 to-red-500' : 'bg-gradient-to-r from-gray-400 to-gray-500'
                    }`}></div>
                    <div className="flex-1 bg-white/50 rounded-xl p-3 border border-green-100/50">
                      <p className="text-sm text-gray-900">
                        <span className="font-semibold">{activity.action}</span> {activity.item}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-green-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
              <div className="space-y-4">
                <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
                  Add New Item
                </button>
                <button className="w-full bg-white border border-green-200 text-gray-700 px-4 py-3 rounded-xl hover:bg-green-50 text-sm font-medium transition-all duration-200">
                  Scan Receipt
                </button>
                <button className="w-full bg-white border border-green-200 text-gray-700 px-4 py-3 rounded-xl hover:bg-green-50 text-sm font-medium transition-all duration-200">
                  View Expiring Soon
                </button>
                <button className="w-full bg-white border border-green-200 text-gray-700 px-4 py-3 rounded-xl hover:bg-green-50 text-sm font-medium transition-all duration-200">
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'groceries' && (
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-green-100">
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4M14 40H4v-4a6 6 0 0110.712-3.714M14 40v-4m0 0V27a10 10 0 0120 0v9"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No groceries yet</h3>
              <p className="text-gray-600 mb-8">Get started by adding your first grocery item to track freshness.</p>
              <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Your First Item
              </button>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-green-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Activity History</h3>
            <div className="space-y-6">
              {['Today', 'Yesterday', '2 days ago'].map((date, dateIndex) => (
                <div key={dateIndex}>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">{date}</h4>
                  <div className="space-y-3 ml-4">
                    {[
                      { time: '3:24 PM', action: 'Added 2x Organic Apples', category: 'Fruits' },
                      { time: '11:15 AM', action: 'Consumed Greek Yogurt', category: 'Dairy' },
                      { time: '9:30 AM', action: 'Updated expiry date for Milk', category: 'Dairy' }
                    ].slice(0, dateIndex + 1).map((activity, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="text-xs text-gray-500 w-16">{activity.time}</div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8">
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-green-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                    <p className="text-sm text-gray-500">Get notified about expiring items</p>
                  </div>
                  <button className="bg-green-600 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out">
                    <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Dark Mode</h4>
                    <p className="text-sm text-gray-500">Use dark theme</p>
                  </div>
                  <button className="bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out">
                    <span className="translate-x-0 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-red-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Danger Zone</h3>
              <div className="border-2 border-red-200 rounded-xl p-6 bg-red-50/50">
                <h4 className="text-lg font-semibold text-red-800 mb-2">Delete Account</h4>
                <p className="text-red-600 mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <button className="bg-red-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors duration-200">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}