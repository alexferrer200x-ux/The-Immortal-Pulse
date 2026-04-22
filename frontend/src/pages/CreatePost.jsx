import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { FiX, FiUpload } from 'react-icons/fi'

const POST_CATEGORIES = [
  { value: 'regular', label: '📝 Regular Post' },
  { value: 'hero_guide', label: '⚔️ Hero Guide' },
  { value: 'new_strategy', label: '🎯 New Strategy' },
  { value: 'new_meta_heroes', label: '⭐ New Meta Heroes' },
  { value: 'meta_builds', label: '🔧 Meta Builds' }
]

const CreatePost = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('regular')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result])
      }
      reader.readAsDataURL(file)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 5242880,
    maxFiles: 5
  })

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) {
      alert('Please enter post content')
      return
    }
    
    setLoading(true)
    
    try {
      const postData = { 
        title: title.trim() || undefined, 
        content, 
        category,
        images: images
      }
      
      await api.post('/posts', postData)
      navigate('/home')
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Failed to create post: ' + (error.response?.data?.error || error.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-8"
        >
          <h1 className="text-3xl font-bold mb-8">
            <span className="bg-gradient-to-r from-blue-600 to-amber-500 bg-clip-text text-transparent">
              CREATE POST
            </span>
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              >
                {POST_CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Title (Optional)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                placeholder="Enter a catchy title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Content *</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                placeholder="Share your thoughts, strategies, or experiences..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Images</label>
              
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
                  isDragActive 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
                }`}
              >
                <input {...getInputProps()} />
                <FiUpload className="mx-auto text-3xl text-gray-400 mb-2" />
                {isDragActive ? (
                  <p className="text-blue-500">Drop your images here...</p>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    Drag & drop images here, or click to select
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Supports: JPG, PNG, GIF, WEBP (Max 5MB each)
                </p>
              </div>

              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex space-x-4">
              <button 
                type="submit" 
                disabled={loading || !content.trim()} 
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Publishing...' : 'Publish Post'}
              </button>
              <button 
                type="button" 
                onClick={() => navigate('/home')} 
                className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default CreatePost
