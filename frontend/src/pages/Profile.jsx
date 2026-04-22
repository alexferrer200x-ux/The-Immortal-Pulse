import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import api from '../services/api'
import { Link } from 'react-router-dom'
import OnlineStatus from '../components/common/OnlineStatus'
import { FiCamera, FiX, FiCheck } from 'react-icons/fi'

const Profile = () => {
  const { user, setUser } = useAuth()
  const [userPosts, setUserPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    username: '',
    ign: '',
    gameId: '',
    bio: '',
    rank: '',
    profilePicture: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        ign: user.ign || '',
        gameId: user.gameId || '',
        bio: user.bio || '',
        rank: user.rank || 'Warrior',
        profilePicture: user.profilePicture || ''
      })
      fetchUserPosts()
    }
  }, [user])

  const fetchUserPosts = async () => {
    const userId = user?.id || user?._id
    if (!userId) {
      setLoading(false)
      return
    }
    try {
      const response = await api.get(`/posts/user/${userId}`)
      setUserPosts(response.data.posts || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewImage(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleConfirmUpload = async () => {
    if (!previewImage || !fileInputRef.current?.files[0]) {
      alert('Please select an image first')
      return
    }
    
    setUploading(true)
    
    try {
      const file = fileInputRef.current.files[0]
      const formData = new FormData()
      formData.append('image', file)
      
      // Upload to local server
      const uploadResponse = await api.post('/upload/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      const imageUrl = uploadResponse.data.url
      
      // Update user profile with image URL
      const response = await api.put('/auth/me', { profilePicture: imageUrl })
      
      if (response.data.success) {
        const updatedUser = { ...user, profilePicture: imageUrl }
        setUser(updatedUser)
        setFormData(prev => ({ ...prev, profilePicture: imageUrl }))
        setPreviewImage(null)
        alert('Profile picture updated successfully!')
        window.location.reload()
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload: ' + (error.response?.data?.error || 'Please try again'))
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const cancelPreview = () => {
    setPreviewImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const response = await api.put('/auth/me', formData)
      if (setUser) {
        setUser({ ...user, ...response.data.user })
      }
      alert('Profile updated successfully!')
      setEditing(false)
    } catch (error) {
      alert('Failed to update profile')
    }
  }

  const getRankClass = (rank) => {
    const rankMap = {
      'Warrior': 'rank-warrior',
      'Elite': 'rank-elite',
      'Master': 'rank-master',
      'Grandmaster': 'rank-grandmaster',
      'Epic': 'rank-epic',
      'Legend': 'rank-legend',
      'Mythic': 'rank-mythic',
      'Mythical Glory': 'rank-glory',
      'Mythical Immortal': 'rank-immortal',
    }
    return rankMap[rank] || 'rank-warrior'
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center glass-card rounded-xl p-8">
          <p className="mb-4 text-gray-600 dark:text-gray-400">Please login to view your profile</p>
          <Link to="/login" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition">Login</Link>
        </div>
      </div>
    )
  }

  const displayName = user.username || 'User'
  const displayEmail = user.email || ''
  const displayRank = user.rank || 'Warrior'
  const displayIgn = user.ign || 'Not set'
  const displayGameId = user.gameId || 'Not set'
  const displayBio = user.bio || ''
  const joinedDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'
  const postCount = user.postCount !== undefined ? user.postCount : userPosts.length
  const isOnline = user.isOnline || false
  const profilePicture = user.profilePicture || formData.profilePicture || ''

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-6"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
            <div className="relative group">
              {profilePicture ? (
                <img
                  src={`http://localhost:5001${profilePicture}`}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = ''
                    e.target.parentElement.innerHTML = `<div class="w-24 h-24 bg-gradient-to-br from-blue-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-3xl">${displayName[0]?.toUpperCase()}</div>`
                  }}
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                  {displayName[0]?.toUpperCase()}
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1.5 text-white hover:bg-blue-600 transition"
                disabled={uploading}
              >
                {uploading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FiCamera size={14} />
                )}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
              />
             
            </div>
            <div className="flex-1 text-center md:text-left">
              {!editing ? (
                <>
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{displayName}</h1>
                    <OnlineStatus isOnline={isOnline} size="md" showText={true} />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{displayEmail}</p>
                  <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                    <span className={getRankClass(displayRank)}>{displayRank}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Joined {joinedDate}
                    </span>
                  </div>
                  <button
                    onClick={() => setEditing(true)}
                    className="mt-3 text-sm text-blue-500 hover:underline"
                  >
                    Edit Profile
                  </button>
                </>
              ) : (
                <form onSubmit={handleUpdate} className="space-y-3">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white"
                    placeholder="Username"
                  />
                  <input
                    type="text"
                    name="ign"
                    value={formData.ign}
                    onChange={(e) => setFormData({ ...formData, ign: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white"
                    placeholder="MLBB IGN"
                  />
                  <input
                    type="text"
                    name="gameId"
                    value={formData.gameId}
                    onChange={(e) => setFormData({ ...formData, gameId: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white"
                    placeholder="Game ID"
                  />
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white"
                    placeholder="Bio"
                    rows={3}
                  />
                  <select
                    name="rank"
                    value={formData.rank}
                    onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white"
                  >
                    <option value="Warrior">Warrior</option>
                    <option value="Elite">Elite</option>
                    <option value="Master">Master</option>
                    <option value="Grandmaster">Grandmaster</option>
                    <option value="Epic">Epic</option>
                    <option value="Legend">Legend</option>
                    <option value="Mythic">Mythic</option>
                    <option value="Mythical Glory">Mythical Glory</option>
                    <option value="Mythical Immortal">Mythical Immortal</option>
                  </select>
                  <div className="flex gap-2">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition">Save</button>
                    <button type="button" onClick={() => setEditing(false)} className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-4 py-2 rounded-lg transition">Cancel</button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{postCount}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-500">{user.likeCount || 0}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Likes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{user.commentCount || 0}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Comments</div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">MLBB Profile</h3>
            <div className="space-y-2 text-gray-600 dark:text-gray-400">
              <p>IGN: {displayIgn}</p>
              <p>Game ID: {displayGameId}</p>
              {displayBio && <p>Bio: {displayBio}</p>}
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">My Posts</h3>
              <Link to="/create" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition">+ New Post</Link>
            </div>
            {loading ? (
              <p className="text-gray-500 dark:text-gray-400">Loading posts...</p>
            ) : userPosts.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No posts yet. Click "New Post" to make your first post!</p>
            ) : (
              <div className="space-y-4">
                {userPosts.map((post) => (
                  <div key={post._id} className="p-4 rounded-lg bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        {post.title && <h4 className="font-bold mb-2 text-gray-900 dark:text-white">{post.title}</h4>}
                        <p className="text-sm text-gray-600 dark:text-gray-400">{post.content.substring(0, 150)}...</p>
                        <p className="text-xs mt-2 text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</p>
                      </div>
                      <Link 
                        to={`/edit-post/${post._id}`} 
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition ml-2 inline-block"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {previewImage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="glass-card rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-center">Preview Profile Picture</h3>
            <div className="flex justify-center mb-6">
              <img
                src={previewImage}
                alt="Preview"
                className="w-40 h-40 rounded-full object-cover border-4 border-blue-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleConfirmUpload}
                disabled={uploading}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <FiCheck size={18} /> Confirm
                  </>
                )}
              </button>
              <button
                onClick={cancelPreview}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
              >
                <FiX size={18} /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
