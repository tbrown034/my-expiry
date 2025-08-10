"use client"

import { useState } from "react"

export default function ProfileContent() {
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [showViewMenu, setShowViewMenu] = useState(false)

  return (
    <>
      {/* Main Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Add Food Button */}
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          <div className="relative bg-white/90 backdrop-blur-md shadow-xl rounded-3xl border border-green-100">
            <button
              onClick={() => {
                setShowAddMenu(!showAddMenu)
                setShowViewMenu(false)
              }}
              className="w-full p-8 flex flex-col items-center gap-4 hover:bg-green-50/50 transition-all duration-300 rounded-3xl group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 group-hover:rotate-3 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Add Food</h3>
                <p className="text-gray-600">Add items to track freshness</p>
              </div>
            </button>
            
            {showAddMenu && (
              <div className="p-6 border-t border-green-100 space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-green-50 rounded-xl transition-colors">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  </svg>
                  <span className="font-medium text-gray-900">Upload Photo</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-green-50 rounded-xl transition-colors">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="font-medium text-gray-900">Single Add</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-green-50 rounded-xl transition-colors">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span className="font-medium text-gray-900">Multiple Add</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* View Food Button */}
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          <div className="relative bg-white/90 backdrop-blur-md shadow-xl rounded-3xl border border-blue-100">
            <button
              onClick={() => {
                setShowViewMenu(!showViewMenu)
                setShowAddMenu(false)
              }}
              className="w-full p-8 flex flex-col items-center gap-4 hover:bg-blue-50/50 transition-all duration-300 rounded-3xl group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 group-hover:rotate-3 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">View Food</h3>
                <p className="text-gray-600">See your active and past items</p>
              </div>
            </button>
            
            {showViewMenu && (
              <div className="p-6 border-t border-blue-100 space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-blue-50 rounded-xl transition-colors">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span className="font-medium text-gray-900">Active Lists</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-blue-50 rounded-xl transition-colors">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-gray-900">Past Lists</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="group relative mb-8">
        <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
        <div className="relative bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Quick Overview</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <div className="text-2xl font-bold text-green-600">24</div>
              <div className="text-xs text-gray-600 mt-1">Active Items</div>
            </div>
            
            <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl border border-blue-100">
              <div className="text-2xl font-bold text-blue-600">18</div>
              <div className="text-xs text-gray-600 mt-1">Fresh</div>
            </div>
            
            <div className="text-center p-3 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-100">
              <div className="text-2xl font-bold text-amber-600">3</div>
              <div className="text-xs text-gray-600 mt-1">Expiring Soon</div>
            </div>
            
            <div className="text-center p-3 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl border border-red-100">
              <div className="text-2xl font-bold text-red-600">2</div>
              <div className="text-xs text-gray-600 mt-1">Expired</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="group relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
        <div className="relative bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Recent Activity</h3>
          </div>
          <div className="space-y-3">
            {[
              { action: 'Added', item: 'Organic Milk', time: '2 hours ago', type: 'add' },
              { action: 'Ate', item: 'Greek Yogurt', time: '1 day ago', type: 'ate' },
              { action: 'Added', item: 'Fresh Spinach', time: '2 days ago', type: 'add' },
              { action: 'Trashed', item: 'Expired Bananas', time: '3 days ago', type: 'trash' },
              { action: 'Added', item: 'Leftover Pizza', time: '4 days ago', type: 'add' },
              { action: 'Ate', item: 'Apple Slices', time: '5 days ago', type: 'ate' },
              { action: 'Trashed', item: 'Moldy Bread', time: '6 days ago', type: 'trash' },
              { action: 'Added', item: 'Chicken Breast', time: '1 week ago', type: 'add' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-white/80 to-emerald-50/30 rounded-2xl border border-emerald-100/50 hover:shadow-md transition-all duration-200">
                <div className={`w-4 h-4 rounded-full shadow-sm flex-shrink-0 ${
                  activity.type === 'add' ? 'bg-gradient-to-r from-green-400 to-green-500' :
                  activity.type === 'ate' ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
                  activity.type === 'trash' ? 'bg-gradient-to-r from-red-400 to-red-500' : 
                  'bg-gradient-to-r from-gray-400 to-gray-500'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    <span className={`${
                      activity.type === 'add' ? 'text-green-700' :
                      activity.type === 'ate' ? 'text-blue-700' :
                      activity.type === 'trash' ? 'text-red-700' : 'text-gray-700'
                    }`}>
                      {activity.action}
                    </span> {activity.item}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{activity.time}</p>
                </div>
                <div className="flex-shrink-0">
                  {activity.type === 'add' && (
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                  )}
                  {activity.type === 'ate' && (
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}
                  {activity.type === 'trash' && (
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="space-y-6 mt-12">
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-gray-500 to-slate-600 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
          <div className="relative bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-slate-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Settings</h3>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-white/80 to-gray-50/30 rounded-2xl border border-gray-100/50">
                <div>
                  <h4 className="text-base font-semibold text-gray-900">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Get notified about expiring items</p>
                  <p className="text-xs text-gray-400 mt-1">coming soon</p>
                </div>
                <button disabled className="bg-gray-300 relative inline-flex h-6 w-11 flex-shrink-0 cursor-not-allowed rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out opacity-50">
                  <span className="translate-x-0 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-white/80 to-gray-50/30 rounded-2xl border border-gray-100/50">
                <div>
                  <h4 className="text-base font-semibold text-gray-900">Dark Mode</h4>
                  <p className="text-sm text-gray-600">Use dark theme</p>
                  <p className="text-xs text-gray-400 mt-1">coming soon</p>
                </div>
                <button disabled className="bg-gray-300 relative inline-flex h-6 w-11 flex-shrink-0 cursor-not-allowed rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out opacity-50">
                  <span className="translate-x-0 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-white/80 to-gray-50/30 rounded-2xl border border-gray-100/50">
                <div>
                  <h4 className="text-base font-semibold text-gray-900">Auto-Archive</h4>
                  <p className="text-sm text-gray-600">Automatically move consumed items to past</p>
                  <p className="text-xs text-gray-400 mt-1">coming soon</p>
                </div>
                <button disabled className="bg-gray-300 relative inline-flex h-6 w-11 flex-shrink-0 cursor-not-allowed rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out opacity-50">
                  <span className="translate-x-0 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-rose-600 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
          <div className="relative bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-red-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Danger Zone</h3>
            </div>
            <div className="p-6 bg-gradient-to-r from-red-50/80 to-rose-50/30 rounded-2xl border-2 border-red-200">
              <h4 className="text-lg font-bold text-red-800 mb-2">Delete Account</h4>
              <p className="text-red-700 mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <button className="bg-red-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors duration-200 shadow-md hover:shadow-lg">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    
    </>
  )
}