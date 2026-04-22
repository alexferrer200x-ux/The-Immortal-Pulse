import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi'
import { useState } from 'react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const { darkMode, toggleDarkMode } = useTheme()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    logout()
    navigate('/home')
    setMobileMenuOpen(false)
  }

  const navLinks = [
    { path: '/home', label: 'Home', showWhen: 'all' },
    { path: '/create', label: 'Create', showWhen: 'auth' },
    { path: '/profile', label: 'Profile', showWhen: 'auth' },
    { path: '/about', label: 'About', showWhen: 'all' },
    { path: '/contact', label: 'Contact', showWhen: 'non-admin' },
    { path: '/admin', label: 'Admin', showWhen: 'admin' },
  ]

  const shouldShow = (link) => {
    if (link.showWhen === 'all') return true
    if (link.showWhen === 'auth' && user) return true
    if (link.showWhen === 'admin' && user?.role === 'admin') return true
    if (link.showWhen === 'non-admin' && user?.role !== 'admin') return true
    if (link.showWhen === 'non-admin' && !user) return true
    return false
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white dark:bg-[#111827] border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo with Image */}
          <Link to="/home" className="flex items-center space-x-3 group">
            <img 
              src="/images/tabLogo.png" 
              alt="Immortal Pulse Logo" 
              className="w-12 h-12 object-contain transform group-hover:scale-110 transition-transform duration-300"
            />
            <div>
              <h1 className="text-xl font-black tracking-tight">
                <span className="text-blue-600 dark:text-blue-400">IMMORTAL</span>
                <span className="text-amber-500 dark:text-amber-400"> PULSE</span>
              </h1>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 -mt-1">MLBB Community</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map(link => shouldShow(link) && (
              <Link key={link.path} to={link.path} className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition">
                {link.label}
              </Link>
            ))}
            
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {darkMode ? <FiSun className="text-yellow-500" size={18} /> : <FiMoon size={18} />}
            </button>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border border-blue-500"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-amber-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {user.username?.[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="text-sm text-gray-700 dark:text-gray-300">{user.username}</span>
                </div>
                <button onClick={handleLogout} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1.5 px-4 rounded-lg transition text-sm">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-semibold py-1.5 px-4 rounded-lg transition text-sm">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1.5 px-4 rounded-lg transition text-sm">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {navLinks.map(link => shouldShow(link) && (
              <Link
                key={link.path}
                to={link.path}
                className="block py-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 space-y-3">
              {user ? (
                <>
                  <div className="flex items-center space-x-2 py-2">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-amber-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {user.username?.[0]?.toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-gray-700 dark:text-gray-300">{user.username}</span>
                  </div>
                  <button onClick={handleLogout} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition w-full">
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link to="/login" className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-semibold py-2 px-4 rounded-lg transition text-center">
                    Login
                  </Link>
                  <Link to="/register" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition text-center">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar