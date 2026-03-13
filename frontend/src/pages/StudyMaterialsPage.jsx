import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { studyMaterialAPI } from '../services/api'

function StudyMaterialsPage() {
  const { subject } = useParams()
  const [materials, setMaterials] = useState([])
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await studyMaterialAPI.getMaterials(subject)
        setMaterials(response.data.materials)
      } catch (err) {
        setError('Failed to load study materials')
      } finally {
        setLoading(false)
      }
    }

    fetchMaterials()
  }, [subject])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading materials...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">{subject} Study Materials</h1>
        <Link to="/dashboard" className="text-primary hover:text-secondary">
          ← Back to Dashboard
        </Link>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
            <div className="bg-primary text-white px-6 py-4">
              <h3 className="font-semibold">Materials</h3>
            </div>
            {materials.length === 0 ? (
              <div className="p-4 text-center text-gray-600">
                <p>No materials available</p>
              </div>
            ) : (
              <div className="divide-y max-h-96 overflow-y-auto">
                {materials.map((material) => (
                  <button
                    key={material.id}
                    onClick={() => setSelectedMaterial(material)}
                    className={`w-full text-left px-6 py-4 hover:bg-gray-50 transition ${
                      selectedMaterial?.id === material.id ? 'bg-primary bg-opacity-10' : ''
                    }`}
                  >
                    <h4 className="font-medium text-sm text-gray-900 line-clamp-2">
                      {material.title}
                    </h4>
                    {material.topic && (
                      <p className="text-xs text-gray-500 mt-1">{material.topic}</p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedMaterial ? (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                {selectedMaterial.title}
              </h2>
              {selectedMaterial.topic && (
                <p className="text-sm text-gray-600 mb-6">
                  Topic: <span className="font-medium">{selectedMaterial.topic}</span>
                </p>
              )}
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                {selectedMaterial.content}
              </div>
              <p className="text-xs text-gray-500 mt-8">
                Created: {new Date(selectedMaterial.createdAt).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600">
                {materials.length === 0
                  ? 'No materials available'
                  : 'Select a material to view'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudyMaterialsPage
