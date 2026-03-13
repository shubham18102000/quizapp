import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { quizAPI } from '../services/api'
import { useQuizStore } from '../store/quizStore'

function QuizPage() {
  const { subject } = useParams()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [results, setResults] = useState(null)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await quizAPI.getQuestions(subject)
        setQuestions(response.data.questions)
      } catch (err) {
        setError('Failed to load questions')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [subject])

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer,
    })
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      setError('Please answer all questions before submitting')
      return
    }

    setSubmitting(true)
    try {
      const response = await quizAPI.submitQuiz(subject, answers)
      setResults(response.data)
      setQuizCompleted(true)
    } catch (err) {
      setError('Failed to submit quiz')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    )
  }

  if (quizCompleted && results) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Quiz Completed!</h2>
          <div className="mb-8">
            <p className="text-6xl font-bold text-primary mb-2">{results.percentage.toFixed(1)}%</p>
            <p className="text-xl text-gray-600">
              You got {results.score} out of {results.totalQuestions} questions correct
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-3 px-4 bg-primary text-white rounded-md hover:bg-secondary font-medium transition"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => navigate(`/leaderboard/${subject}`)}
              className="w-full py-3 px-4 border border-primary text-primary rounded-md hover:bg-primary hover:text-white font-medium transition"
            >
              View Leaderboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const isAnswered = answers[question?._id] !== undefined

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-md p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-900">
              Question {currentQuestion + 1} of {questions.length}
            </h2>
            <span className="text-sm text-gray-600">
              Answered: {Object.keys(answers).length}/{questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {question && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-6 text-gray-900">{question.question}</h3>

            <div className="space-y-3">
              {question.options.map((option, index) => (
                <label
                  key={index}
                  className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name={`question-${question._id}`}
                    value={option}
                    checked={answers[question._id] === option}
                    onChange={() => handleAnswerSelect(question._id, option)}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="ml-3 text-gray-900">{option}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between gap-4">
          <button
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className="py-2 px-6 border border-primary text-primary rounded-md hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
          >
            Previous
          </button>

          {currentQuestion < questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="py-2 px-6 bg-primary text-white rounded-md hover:bg-secondary font-medium transition"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting || Object.keys(answers).length !== questions.length}
              className="py-2 px-6 bg-success text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuizPage
