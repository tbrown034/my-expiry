"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export default function AdminClient() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This will also delete all their data.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId))
      } else {
        alert('Failed to delete user')
      }
    } catch (error) {
      console.error('Failed to delete user:', error)
      alert('Failed to delete user')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="py-8 px-4 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-white/90 to-green-50/90 backdrop-blur-md rounded-3xl shadow-xl border border-green-200/50 p-8">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-green-300 border-t-green-600 rounded-full animate-spin"></div>
            <span className="ml-3 text-lg text-gray-600">Loading users...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-lg text-gray-600">Manage users and system settings</p>
      </div>

      <div className="bg-gradient-to-br from-white/90 to-green-50/90 backdrop-blur-md rounded-3xl shadow-xl border border-green-200/50">
        <div className="px-8 py-6 border-b border-green-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">User Management</h2>
          <p className="text-gray-600">View and manage all registered users</p>
        </div>

        {users.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Users Found</h3>
            <p className="text-gray-600">There are currently no registered users in the system.</p>
          </div>
        ) : (
          <div className="p-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {users.map(user => (
                <div key={user.id} className="bg-white/70 backdrop-blur-sm rounded-2xl border border-green-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.name || 'User'}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full ring-2 ring-green-200 shadow-md"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold shadow-md">
                          {(user.name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {user.name || 'Anonymous User'}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">{user.email}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 100-4 2 2 0 000 4zm0 0v3m-4-3h8m-8 0H3a2 2 0 01-2-2V7a2 2 0 012-2h3m0 0V3a4 4 0 118 0v2M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        <span>ID: {user.id}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Created: {formatDate(user.createdAt)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteUser(user.id)}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg group-hover:scale-105 transform"
                    >
                      Delete User
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-green-50/80 rounded-2xl border border-green-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Total Users: {users.length}</h3>
                  <p className="text-sm text-gray-600">Active users in the system</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}