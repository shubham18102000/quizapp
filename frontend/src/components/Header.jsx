import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

function Header() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    localStorage.removeItem('authToken')
    navigate('/login')
  }

  return (
    <header className="bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/dashboard" className="text-2xl font-bold text-primary">
          Quiz App
        </Link>

        <div className="flex items-center space-x-8">
          <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
            Dashboard
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-gray-600 hover:text-gray-900">
              Admin
            </Link>
          )}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-danger rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
