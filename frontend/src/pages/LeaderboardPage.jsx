import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { leaderboardAPI } from '../services/api'

function LeaderboardPage() {
  const { subject } = useParams()
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await leaderboardAPI.getLeaderboard(subject)
        setLeaderboard(response.data.leaderboard)
      } catch (err) {
        setError('Failed to load leaderboard')
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [subject])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">{subject} Leaderboard</h1>
        <Link to="/dashboard" className="text-primary hover:text-secondary">
          ← Back to Dashboard
        </Link>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      {leaderboard.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">No quiz attempts yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Rank</th>
                <th className="px-6 py-3 text-left font-semibold">Name</th>
                <th className="px-6 py-3 text-center font-semibold">Average Score</th>
                <th className="px-6 py-3 text-center font-semibold">Best Score</th>
                <th className="px-6 py-3 text-center font-semibold">Attempts</th>
                <th className="px-6 py-3 text-right font-semibold">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr
                  key={entry.userId}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center">
                      {index === 0 && <span className="text-2xl">🥇</span>}
                      {index === 1 && <span className="text-2xl">🥈</span>}
                      {index === 2 && <span className="text-2xl">🥉</span>}
                      {index > 2 && (
                        <span className="font-semibold text-gray-700">#{index + 1}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{entry.userName}</td>
                  <td className="px-6 py-4 text-center text-gray-700">
                    {entry.avgScore}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-700">
                    {entry.bestScore}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-700">
                    {entry.totalAttempts}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary text-white">
                      {entry.totalPercentage}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default LeaderboardPage
