import React, { createContext, useState, useEffect, useContext } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me')
      const userData = response.data
      if (userData && !userData.id && userData._id) {
        userData.id = userData._id
      }
      setUser(userData)
    } catch (error) {
      console.error('Fetch user error:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    const { token, user: userData } = response.data
    localStorage.setItem('token', token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setToken(token)
    if (userData && !userData.id && userData._id) {
      userData.id = userData._id
    }
    setUser(userData)
    return userData
  }

  const register = async (userData) => {
    const response = await api.post('/auth/register', userData)
    const { token, user: newUser } = response.data
    localStorage.setItem('token', token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setToken(token)
    if (newUser && !newUser.id && newUser._id) {
      newUser.id = newUser._id
    }
    setUser(newUser)
    return newUser
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
