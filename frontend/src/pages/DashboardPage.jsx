import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { quizAPI } from '../services/api'

function DashboardPage() {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await quizAPI.getSubjects()
        setSubjects(response.data.subjects)
      } catch (err) {
        setError('Failed to load subjects')
      } finally {
        setLoading(false)
      }
    }

    fetchSubjects()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-4 text-gray-900">Welcome to Quiz App</h1>
      <p className="text-xl text-gray-600 mb-12">Select a subject to get started</p>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {subjects.map((subject) => (
          <div
            key={subject}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{subject}</h2>
              <p className="text-gray-600 mb-6">
                Test your knowledge in {subject} with our comprehensive quiz
              </p>

              <div className="space-y-3">
                <Link
                  to={`/quiz/${subject}`}
                  className="block w-full py-3 px-4 bg-primary text-white rounded-md hover:bg-secondary text-center font-medium transition"
                >
                  Take Quiz
                </Link>
                <Link
                  to={`/study-materials/${subject}`}
                  className="block w-full py-3 px-4 border border-primary text-primary rounded-md hover:bg-primary hover:text-white text-center font-medium transition"
                >
                  Study Materials
                </Link>
                <Link
                  to={`/leaderboard/${subject}`}
                  className="block w-full py-3 px-4 border border-accent text-accent rounded-md hover:bg-accent hover:text-white text-center font-medium transition"
                >
                  Leaderboard
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DashboardPage
