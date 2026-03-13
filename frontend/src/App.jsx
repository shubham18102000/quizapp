import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { authAPI } from './services/api'

// Pages
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import QuizPage from './pages/QuizPage'
import LeaderboardPage from './pages/LeaderboardPage'
import StudyMaterialsPage from './pages/StudyMaterialsPage'
import AdminPage from './pages/AdminPage'

// Components
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header'

function App() {
  const { token, isAuthenticated, setUser, setToken } = useAuthStore()

  // Verify token on mount
  useEffect(() => {
    if (token && !isAuthenticated) {
      authAPI.getMe()
        .then(res => {
          setUser(res.data)
        })
        .catch(() => {
          localStorage.removeItem('authToken')
          setToken(null)
        })
    }
  }, [])

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated && <Header />}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
          />
          <Route
            path="/quiz/:subject"
            element={<ProtectedRoute><QuizPage /></ProtectedRoute>}
          />
          <Route
            path="/leaderboard/:subject"
            element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>}
          />
          <Route
            path="/study-materials/:subject"
            element={<ProtectedRoute><StudyMaterialsPage /></ProtectedRoute>}
          />
          <Route
            path="/admin/*"
            element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>}
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
