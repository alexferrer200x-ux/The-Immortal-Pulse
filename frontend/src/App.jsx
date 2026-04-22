import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/common/Navbar'
import Home from './pages/Home'
import Splash from './pages/Splash'
import Login from './pages/Login'
import Register from './pages/Register'
import About from './pages/About'
import Contact from './pages/Contact'
import CreatePost from './pages/CreatePost'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import PrivateRoute from './components/common/PrivateRoute'
import AdminRoute from './components/common/AdminRoute'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/create" element={
            <PrivateRoute>
              <CreatePost />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/admin" element={
            <PrivateRoute>
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            </PrivateRoute>
          } />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
