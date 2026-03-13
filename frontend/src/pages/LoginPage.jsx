import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { authAPI } from '../services/api'

function LoginPage() {
  const [step, setStep] = useState('email') // email, otp, name
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { setAuth, setToken } = useAuthStore()

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await authAPI.sendOTP(email)
      setStep('otp')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setError('')

    // Check if user is new (might need name)
    // For now, we'll handle this in the next step
    setStep('verify')
    setLoading(true)

    try {
      const response = await authAPI.verifyOTP(email, otp, name || email.split('@')[0])
      setToken(response.data.token)
      localStorage.setItem('authToken', response.data.token)
      setAuth(response.data.user, response.data.token)
      navigate('/dashboard')
    } catch (err) {
      if (err.response?.data?.error?.includes('Name is required')) {
        setStep('name')
      } else {
        setError(err.response?.data?.error || 'Invalid OTP')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleNameSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authAPI.verifyOTP(email, otp, name)
      setToken(response.data.token)
      localStorage.setItem('authToken', response.data.token)
      setAuth(response.data.user, response.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to verify')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">Quiz App</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        {step === 'email' && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-secondary disabled:opacity-50 font-medium transition"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>
              <p className="text-sm text-gray-600 mb-4">
                We've sent an OTP to {email}
              </p>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
                required
                maxLength="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-center text-2xl tracking-widest"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-secondary disabled:opacity-50 font-medium transition"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              type="button"
              onClick={() => setStep('email')}
              className="w-full py-2 px-4 text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition"
            >
              Back
            </button>
          </form>
        )}

        {step === 'name' && (
          <form onSubmit={handleNameSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <p className="text-sm text-gray-600 mb-4">
                We need your name to complete registration
              </p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-secondary disabled:opacity-50 font-medium transition"
            >
              {loading ? 'Completing...' : 'Complete Registration'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default LoginPage
