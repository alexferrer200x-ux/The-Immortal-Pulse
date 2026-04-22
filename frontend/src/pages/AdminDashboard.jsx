import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import OnlineStatus from '../components/common/OnlineStatus'

// Post Categories for MLBB
const POST_CATEGORIES = [
  { value: 'regular', label: '📝 Regular Post', color: 'bg-gray-500' },
  { value: 'patch_update', label: '🔄 New Patch Update', color: 'bg-blue-500' },
  { value: 'hero_guide', label: '⚔️ Hero Guide', color: 'bg-green-500' },
  { value: 'new_strategy', label: '🎯 New Strategy', color: 'bg-purple-500' },
  { value: 'website_bugs', label: '🐛 Website Bugs', color: 'bg-red-500' },
  { value: 'game_bugs', label: '🎮 In-Game Bugs', color: 'bg-orange-500' },
  { value: 'new_meta_heroes', label: '⭐ New Meta Heroes', color: 'bg-yellow-500' },
  { value: 'meta_builds', label: '🔧 Meta Builds', color: 'bg-indigo-500' }
]

const AdminDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalComments: 0,
    bannedUsers: 0,
    unreadMessages: 0
  })
  const [users, setUsers] = useState([])
  const [messages, setMessages] = useState([])
  const [allPosts, setAllPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'regular' })
  const [selectedPost, setSelectedPost] = useState(null)
  const [showPostDetail, setShowPostDetail] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, usersRes, messagesRes, postsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/messages'),
        api.get('/admin/posts')
      ])
      setStats(statsRes.data)
      setUsers(usersRes.data.users)
      setMessages(messagesRes.data.messages)
      setAllPosts(postsRes.data.posts || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBanUser = async (userId, isBanned) => {
    try {
      if (isBanned) {
        await api.put(`/admin/users/${userId}/unban`)
      } else {
        await api.put(`/admin/users/${userId}/ban`, { reason: 'Violation of community guidelines' })
      }
      fetchDashboardData()
    } catch (error) {
      alert('Failed to update user status')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (confirm('Delete this user? This cannot be undone.')) {
      try {
        await api.delete(`/admin/users/${userId}`)
        fetchDashboardData()
      } catch (error) {
        alert('Failed to delete user')
      }
    }
  }

  const handlePromoteDemote = async (userId, currentRole, username) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    const action = newRole === 'admin' ? 'promote' : 'demote'
    
    if (confirm(`Are you sure you want to ${action} ${username} to ${newRole === 'admin' ? 'Admin' : 'regular user'}?`)) {
      try {
        await api.put(`/admin/users/${userId}/role`, { role: newRole })
        fetchDashboardData()
        alert(`${username} is now ${newRole === 'admin' ? 'an Admin!' : 'a regular user'}`)
      } catch (error) {
        alert('Failed to change user role')
      }
    }
  }

  const handleDeletePost = async (postId) => {
    if (confirm('Delete this post?')) {
      try {
        await api.delete(`/admin/posts/${postId}`)
        fetchDashboardData()
        setShowPostDetail(false)
      } catch (error) {
        alert('Failed to delete post')
      }
    }
  }

  const handleMarkMessageRead = async (messageId) => {
    try {
      await api.put(`/admin/messages/${messageId}/read`)
      fetchDashboardData()
    } catch (error) {
      console.error('Error marking message:', error)
    }
  }

  const handleCreatePost = async () => {
    if (!newPost.content) {
      alert('Please enter post content')
      return
    }
    try {
      await api.post('/posts', newPost)
      setShowCreatePost(false)
      setNewPost({ title: '', content: '', category: 'regular' })
      fetchDashboardData()
      alert('Post created!')
    } catch (error) {
      alert('Failed to create post')
    }
  }

  const getCategoryInfo = (category) => {
    return POST_CATEGORIES.find(c => c.value === category) || POST_CATEGORIES[0]
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 glass-card rounded-xl p-6">
          <h1 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-blue-600 to-amber-500 bg-clip-text text-transparent">Admin Dashboard</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back, {user?.username}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="glass-card rounded-xl p-4">
            <div className="text-2xl mb-1">👥</div>
            <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
            <div className="text-sm text-gray-500">Users</div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="text-2xl mb-1">📝</div>
            <div className="text-2xl font-bold text-green-600">{stats.totalPosts}</div>
            <div className="text-sm text-gray-500">Posts</div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="text-2xl mb-1">💬</div>
            <div className="text-2xl font-bold text-purple-600">{stats.totalComments}</div>
            <div className="text-sm text-gray-500">Comments</div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="text-2xl mb-1">🚫</div>
            <div className="text-2xl font-bold text-red-600">{stats.bannedUsers}</div>
            <div className="text-sm text-gray-500">Banned</div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="text-2xl mb-1">📬</div>
            <div className="text-2xl font-bold text-amber-500">{stats.unreadMessages}</div>
            <div className="text-sm text-gray-500">Unread</div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <button onClick={() => setShowCreatePost(true)} className="bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-lg transition font-medium text-sm">
            ✍️ New Post
          </button>
          <button onClick={() => setActiveTab('posts')} className="bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg transition font-medium text-sm">
            📋 All Posts
          </button>
          <button onClick={() => setActiveTab('users')} className="bg-purple-500 hover:bg-purple-600 text-white py-2.5 rounded-lg transition font-medium text-sm">
            👥 Manage Users
          </button>
          <button onClick={() => setActiveTab('messages')} className="bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-lg transition font-medium text-sm">
            📬 Messages
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Platform Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-3xl mb-1">📈</div>
                <div className="font-bold text-xl text-blue-600">{stats.totalPosts}</div>
                <div className="text-sm text-gray-500">Total Posts</div>
              </div>
              <div className="text-center p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-3xl mb-1">👥</div>
                <div className="font-bold text-xl text-green-600">{stats.totalUsers}</div>
                <div className="text-sm text-gray-500">Active Users</div>
              </div>
              <div className="text-center p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-3xl mb-1">💬</div>
                <div className="font-bold text-xl text-purple-600">{stats.totalComments}</div>
                <div className="text-sm text-gray-500">Comments</div>
              </div>
            </div>
          </div>
        )}

        {/* Posts Tab with Centered Images */}
        {activeTab === 'posts' && (
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
              <h3 className="font-semibold text-gray-900 dark:text-white">All Posts ({allPosts.length})</h3>
            </div>
            {allPosts.length === 0 ? (
              <p className="text-center text-gray-500 py-12">No posts yet</p>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[600px] overflow-y-auto">
                {allPosts.map((post) => {
                  const categoryInfo = getCategoryInfo(post.category)
                  return (
                    <div key={post._id} className="p-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 cursor-pointer transition" onClick={() => { setSelectedPost(post); setShowPostDetail(true) }}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-medium text-blue-600 text-sm">{post.author?.username}</span>
                            <span className={`${categoryInfo.color} text-white px-2 py-0.5 rounded-full text-xs`}>
                              {categoryInfo.label}
                            </span>
                            <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                          {post.title && <div className="font-medium text-gray-900 dark:text-white mb-1">{post.title}</div>}
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{post.content}</p>
                          
                          {/* Image Preview in Admin List - Centered Thumbnails */}
                          {post.images && post.images.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {post.images.slice(0, 3).map((img, idx) => (
                                <img
                                  key={idx}
                                  src={img}
                                  alt={`Thumbnail ${idx + 1}`}
                                  className="w-16 h-16 object-cover rounded border border-gray-300 dark:border-gray-600"
                                />
                              ))}
                              {post.images.length > 3 && (
                                <span className="text-xs text-gray-400 flex items-center">+{post.images.length - 3}</span>
                              )}
                            </div>
                          )}
                          
                          <div className="flex gap-3 mt-2 text-xs text-gray-400">
                            <span>❤️ {post.likeCount || 0}</span>
                            <span>💬 {post.commentCount || 0}</span>
                            <span>🖼️ {post.images?.length || 0} images</span>
                          </div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); handleDeletePost(post._id) }} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm ml-4">
                          Delete
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
              <h3 className="font-semibold text-gray-900 dark:text-white">User Management</h3>
              <p className="text-xs text-blue-500 mt-1">⭐ Promote to Admin | 👑 Demote from Admin | 🟢 Online Status</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">User</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Posts</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Online</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {u.username?.[0]?.toUpperCase()}
                          </div>
                          <span className="font-medium">{u.username}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${u.role === 'admin' ? 'bg-purple-500' : 'bg-gray-500'} text-white`}>
                          {u.role === 'admin' ? '👑 Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${u.isBanned ? 'bg-red-500' : 'bg-green-500'} text-white`}>
                          {u.isBanned ? 'Banned' : 'Active'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm">{u.postCount || 0}</td>
                      <td className="px-4 py-3">
                        <OnlineStatus isOnline={u.isOnline} size="sm" showText={true} />
                      </td>
                      <td className="px-4 py-3 space-x-2">
                        {u._id !== user?.id && u._id !== user?._id && (
                          <button
                            onClick={() => handlePromoteDemote(u._id, u.role, u.username)}
                            className={`px-3 py-1 rounded text-xs transition font-medium ${
                              u.role === 'admin' 
                                ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                                : 'bg-purple-500 hover:bg-purple-600 text-white'
                            }`}
                            title={u.role === 'admin' ? 'Demote to regular user' : 'Promote to Admin'}
                          >
                            {u.role === 'admin' ? '👑 Demote' : '⭐ Promote'}
                          </button>
                        )}
                        {u.role !== 'admin' && (
                          <>
                            <button
                              onClick={() => handleBanUser(u._id, u.isBanned)}
                              className={`px-3 py-1 rounded text-xs ${u.isBanned ? 'bg-green-500' : 'bg-red-500'} text-white transition`}
                            >
                              {u.isBanned ? 'Unban' : 'Ban'}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="px-3 py-1 rounded text-xs bg-gray-500 text-white transition"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="glass-card rounded-xl p-8 text-center">
                <p className="text-gray-500">No messages</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg._id} className={`glass-card rounded-xl p-4 border ${msg.isRead ? 'border-gray-200 dark:border-gray-700' : 'border-blue-500'}`}>
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">{msg.name}</span>
                        <span className="text-xs text-gray-400">{msg.email}</span>
                        <span className="text-xs bg-gray-100/50 dark:bg-gray-700/50 px-2 py-0.5 rounded">{msg.category}</span>
                      </div>
                      <p className="text-sm mt-1 font-medium">{msg.subject}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{msg.message}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleDateString()}</p>
                      {!msg.isRead && (
                        <button onClick={() => handleMarkMessageRead(msg._id)} className="mt-2 px-3 py-1 rounded text-xs bg-blue-500 text-white">
                          Mark Read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Create Post Modal */}
        {showCreatePost && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="glass-card rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">New Post</h3>
              <div className="space-y-4">
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white"
                >
                  {POST_CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Title (optional)"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white"
                />
                <textarea
                  placeholder="Content *"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleCreatePost} className="flex-1 bg-blue-500 text-white py-2 rounded-lg">Publish</button>
                <button onClick={() => setShowCreatePost(false)} className="flex-1 bg-gray-500 text-white py-2 rounded-lg">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Post Detail Modal with Centered Image Gallery */}
        {showPostDetail && selectedPost && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="glass-card rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-blue-600">{selectedPost.author?.username}</span>
                      <span className="text-xs text-gray-400">{new Date(selectedPost.createdAt).toLocaleString()}</span>
                    </div>
                    {selectedPost.category && (
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs text-white ${getCategoryInfo(selectedPost.category).color}`}>
                        {getCategoryInfo(selectedPost.category).label}
                      </span>
                    )}
                  </div>
                  <button onClick={() => setShowPostDetail(false)} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>
                
                {selectedPost.title && <h2 className="text-2xl font-bold mb-4">{selectedPost.title}</h2>}
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-6">{selectedPost.content}</p>
                
                {/* Centered Full Image Gallery in Modal */}
                {selectedPost.images && selectedPost.images.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">Images ({selectedPost.images.length})</h3>
                    <div className={`grid gap-4 mx-auto ${
                      selectedPost.images.length === 1 ? 'grid-cols-1 max-w-md' : 
                      selectedPost.images.length === 2 ? 'grid-cols-2 max-w-2xl' : 
                      'grid-cols-2 md:grid-cols-3'
                    }`}>
                      {selectedPost.images.map((img, idx) => (
                        <div key={idx} className="flex justify-center">
                          <img
                            src={img}
                            alt={`Post image ${idx + 1}`}
                            className="w-full max-h-64 object-contain rounded-lg cursor-pointer hover:opacity-90 transition bg-gray-100 dark:bg-gray-800"
                            onClick={() => setSelectedImage(img)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button onClick={() => handleDeletePost(selectedPost._id)} className="bg-red-500 text-white px-4 py-2 rounded-lg">Delete Post</button>
                  <button onClick={() => setShowPostDetail(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-[90vw] max-h-[90vh] flex items-center justify-center">
            <img 
              src={selectedImage} 
              alt="Full size" 
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <button 
            className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300"
            onClick={() => setSelectedImage(null)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
