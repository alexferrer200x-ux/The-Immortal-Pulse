import React, { createContext, useState, useEffect, useContext } from 'react'

const ThemeContext = createContext()

export const useTheme = () => useContext(ThemeContext)

// CHANGE THESE FILENAMES TO MATCH YOUR ACTUAL IMAGES
// Place your images in: public/images/
const LIGHT_BG = "url('/images/bg-light.jpg')"
const DARK_BG = "url('/images/bg-dark.jpg')"

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved !== null ? JSON.parse(saved) : true
  })

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    
    // Apply dark mode class to html
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    // Apply background image to body - this affects ALL pages
    document.body.style.backgroundImage = darkMode ? DARK_BG : LIGHT_BG
    document.body.style.backgroundSize = 'cover'
    document.body.style.backgroundPosition = 'center'
    document.body.style.backgroundAttachment = 'fixed'
    document.body.style.backgroundRepeat = 'no-repeat'
    document.body.style.backgroundColor = darkMode ? '#0B1020' : '#f3f4f6'
    
    // Also apply to html element for full coverage
    document.documentElement.style.backgroundImage = darkMode ? DARK_BG : LIGHT_BG
    document.documentElement.style.backgroundSize = 'cover'
    document.documentElement.style.backgroundPosition = 'center'
    document.documentElement.style.backgroundAttachment = 'fixed'
    document.documentElement.style.backgroundRepeat = 'no-repeat'
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(!darkMode)

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}
