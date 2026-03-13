import React, { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'

function AdminQuestionsPage() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    subject: 'C++',
    question: '',
    options: ['', '', '', ''],
    answer: '',
    topic: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      const response = await adminAPI.getQuestions()
      setQuestions(response.data.questions)
      setError('')
    } catch (err) {
      setError('Failed to load questions')
    } finally {
      setLoading(false)
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData({
      ...formData,
      options: newOptions
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await adminAPI.addQuestion(formData)
      setFormData({
        subject: 'C++',
        question: '',
        options: ['', '', '', ''],
        answer: '',
        topic: ''
      })
      setShowForm(false)
      await fetchQuestions()
    } catch (err) {
      setError('Failed to add question')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await adminAPI.deleteQuestion(id)
        await fetchQuestions()
      } catch (err) {
        setError('Failed to delete question')
      }
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Loading questions...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Questions</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary font-medium transition"
        >
          {showForm ? 'Cancel' : 'Add Question'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Add New Question</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="C++">C++</option>
                  <option value="Java">Java</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic
                </label>
                <input
                  type="text"
                  name="topic"
                  value={formData.topic}
                  onChange={handleFormChange}
                  placeholder="e.g., Pointers, Arrays"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question
              </label>
              <textarea
                name="question"
                value={formData.question}
                onChange={handleFormChange}
                placeholder="Enter the question"
                required
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options
              </label>
              <div className="space-y-2">
                {formData.options.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correct Answer
              </label>
              <select
                name="answer"
                value={formData.answer}
                onChange={handleFormChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select the correct answer</option>
                {formData.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option || `Option ${index + 1}`}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-secondary disabled:opacity-50 font-medium transition"
            >
              {submitting ? 'Adding...' : 'Add Question'}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {questions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">No questions added yet</p>
          </div>
        ) : (
          questions.map((question) => (
            <div key={question.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium bg-primary text-white px-2 py-1 rounded">
                      {question.subject}
                    </span>
                    {question.topic && (
                      <span className="text-sm text-gray-600">{question.topic}</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900">{question.question}</h3>
                </div>
                <button
                  onClick={() => handleDelete(question.id)}
                  className="px-3 py-1 text-sm text-danger border border-danger rounded-md hover:bg-red-50 transition"
                >
                  Delete
                </button>
              </div>

              <div className="ml-4 space-y-1">
                {question.options.map((option, index) => (
                  <div key={index} className="text-sm text-gray-700">
                    <span className="font-medium">{String.fromCharCode(65 + index)}.</span>{' '}
                    {option}
                    {option === question.answer && (
                      <span className="ml-2 text-success font-medium">✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AdminQuestionsPage
