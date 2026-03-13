import React, { useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import AdminQuestionsPage from './admin/AdminQuestionsPage'
import AdminMaterialsPage from './admin/AdminMaterialsPage'
import AdminUsersPage from './admin/AdminUsersPage'

function AdminPage() {
  const location = useLocation()

  const isActive = (path) => location.pathname.includes(path)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
            <nav className="space-y-2 p-4">
              <Link
                to="/admin/questions"
                className={`block px-4 py-3 rounded-md font-medium transition ${
                  isActive('questions')
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Questions
              </Link>
              <Link
                to="/admin/materials"
                className={`block px-4 py-3 rounded-md font-medium transition ${
                  isActive('materials')
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Study Materials
              </Link>
              <Link
                to="/admin/users"
                className={`block px-4 py-3 rounded-md font-medium transition ${
                  isActive('users')
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Users
              </Link>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <Routes>
            <Route path="questions" element={<AdminQuestionsPage />} />
            <Route path="materials" element={<AdminMaterialsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="/" element={<AdminQuestionsPage />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
