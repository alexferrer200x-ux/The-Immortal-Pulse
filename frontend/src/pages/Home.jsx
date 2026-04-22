import { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import OnlineStatus from '../components/common/OnlineStatus'

const Home = () => {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [likedPosts, setLikedPosts] = useState({})
  const [commentingPost, setCommentingPost] = useState(null)
  const [comments, setComments] = useState({})
  const [newComment, setNewComment] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    if (user && posts.length > 0) {
      fetchUserLikes()
    }
  }, [user, posts])

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts')
      setPosts(response.data.posts || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserLikes = async () => {
    try {
      const response = await api.get('/likes/me')
      const likedMap = {}
      response.data.forEach(postId => {
        likedMap[postId] = true
      })
      setLikedPosts(likedMap)
    } catch (error) {
      console.error('Error fetching likes:', error)
    }
  }

  const handleLike = async (postId) => {
    if (!user) {
      alert('Please login to like posts')
      return
    }

    try {
      const response = await api.post(`/likes/post/${postId}`)
      setLikedPosts(prev => ({
        ...prev,
        [postId]: response.data.liked
      }))
      setPosts(prev => prev.map(post => 
        post._id === postId 
          ? { ...post, likeCount: response.data.likeCount }
          : post
      ))
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const fetchComments = async (postId) => {
    if (comments[postId]) return
    
    try {
      const response = await api.get(`/comments/post/${postId}`)
      setComments(prev => ({
        ...prev,
        [postId]: response.data.comments || []
      }))
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const handleAddComment = async (postId) => {
    if (!user) {
      alert('Please login to comment')
      return
    }
    if (!newComment.trim()) return

    try {
      const response = await api.post('/comments', {
        postId: postId,
        content: newComment
      })
      
      setComments(prev => ({
        ...prev,
        [postId]: [response.data, ...(prev[postId] || [])]
      }))
      setNewComment('')
      setCommentingPost(null)
      
      setPosts(prev => prev.map(post => 
        post._id === postId 
          ? { ...post, commentCount: (post.commentCount || 0) + 1 }
          : post
      ))
    } catch (error) {
      console.error('Error adding comment:', error)
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-amber-500 bg-clip-text text-transparent">THE BATTLEFIELD</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Latest posts from the Immortal Pulse community</p>
          <div className="w-24 h-0.5 bg-gradient-to-r from-blue-500 to-amber-500 mx-auto mt-4"></div>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-xl p-8">
            <p className="text-gray-500 dark:text-gray-400">No posts yet. Be the first to share!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post._id} className="glass-card rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      {post.author?.profilePicture ? (
                        <img
                          src={post.author.profilePicture}
                          alt={post.author.username}
                          className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {post.author?.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-lg text-gray-900 dark:text-white">{post.author?.username}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={getRankClass(post.rank)}>{post.rank}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-blue-500 text-2xl">⚔️</div>
                </div>

                {post.title && (
                  <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{post.title}</h2>
                )}
                <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{post.content}</p>

                {post.images && post.images.length > 0 && (
                  <div className="mb-4">
                    <div className={`grid gap-3 mx-auto ${post.images.length === 1 ? 'grid-cols-1 max-w-md' : post.images.length === 2 ? 'grid-cols-2 max-w-2xl' : 'grid-cols-2 md:grid-cols-3'}`}>
                      {post.images.map((img, idx) => (
                        <div key={idx} className="flex justify-center">
                          <img
                            src={img}
                            alt={`Post image ${idx + 1}`}
                            className="rounded-lg w-full max-h-64 object-contain cursor-pointer hover:opacity-90 transition duration-200 bg-gray-100 dark:bg-gray-800"
                            onClick={() => setSelectedImage(img)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => handleLike(post._id)}
                    className={`flex items-center space-x-2 transition group ${likedPosts[post._id] ? 'text-red-500' : 'text-gray-500 dark:text-gray-400 hover:text-red-500'}`}
                  >
                    <span className="text-xl group-hover:scale-110 transition">{likedPosts[post._id] ? '❤️' : '🤍'}</span>
                    <span>{post.likeCount || 0}</span>
                  </button>
                  <button
                    onClick={() => {
                      if (commentingPost === post._id) {
                        setCommentingPost(null)
                      } else {
                        fetchComments(post._id)
                        setCommentingPost(post._id)
                      }
                    }}
                    className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 transition group"
                  >
                    <span className="text-xl group-hover:scale-110 transition">💬</span>
                    <span>{post.commentCount || 0}</span>
                  </button>
                </div>

                {commentingPost === post._id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {user ? (
                      <div className="mb-4 flex space-x-2">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Write a comment..."
                          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                        />
                        <button
                          onClick={() => handleAddComment(post._id)}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                        >
                          Post
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <a href="/login" className="text-blue-500 hover:underline">Login</a> to comment
                      </p>
                    )}

                    {!comments[post._id] ? (
                      <p className="text-center text-gray-500 dark:text-gray-400">Loading comments...</p>
                    ) : comments[post._id].length === 0 ? (
                      <p className="text-center text-gray-500 dark:text-gray-400">No comments yet. Be the first!</p>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {comments[post._id].map((comment) => (
                          <div key={comment._id} className="bg-gray-50/50 dark:bg-gray-800/50 rounded-lg p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-sm text-gray-900 dark:text-white">
                                    {comment.author?.username}
                                  </p>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{comment.content}</p>
                              </div>
                              <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

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

export default Home
