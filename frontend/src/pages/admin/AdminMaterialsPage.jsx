import React, { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'

function AdminMaterialsPage() {
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    subject: 'C++',
    title: '',
    content: '',
    topic: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchMaterials()
  }, [])

  const fetchMaterials = async () => {
    try {
      // Fetch from both subjects to display all
      const cpp = await adminAPI.getStudyMaterials?.('C++') || []
      const java = await adminAPI.getStudyMaterials?.('Java') || []
      setMaterials([...cpp, ...java])
      setError('')
    } catch (err) {
      // If method not available, just load empty
      setMaterials([])
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await adminAPI.addStudyMaterial(formData)
      setFormData({
        subject: 'C++',
        title: '',
        content: '',
        topic: ''
      })
      setShowForm(false)
      await fetchMaterials()
    } catch (err) {
      setError('Failed to add study material')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        await adminAPI.deleteStudyMaterial(id)
        await fetchMaterials()
      } catch (err) {
        setError('Failed to delete material')
      }
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Loading materials...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Study Materials</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary font-medium transition"
        >
          {showForm ? 'Cancel' : 'Add Material'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Add New Material</h3>
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
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                placeholder="Material title"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleFormChange}
                placeholder="Enter the study material content"
                required
                rows="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-secondary disabled:opacity-50 font-medium transition"
            >
              {submitting ? 'Adding...' : 'Add Material'}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {materials.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">No materials added yet</p>
          </div>
        ) : (
          materials.map((material) => (
            <div key={material.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium bg-primary text-white px-2 py-1 rounded">
                      {material.subject}
                    </span>
                    {material.topic && (
                      <span className="text-sm text-gray-600">{material.topic}</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900">{material.title}</h3>
                </div>
                <button
                  onClick={() => handleDelete(material.id)}
                  className="px-3 py-1 text-sm text-danger border border-danger rounded-md hover:bg-red-50 transition"
                >
                  Delete
                </button>
              </div>

              <p className="text-sm text-gray-700 line-clamp-2">{material.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AdminMaterialsPage
