import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const Splash = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home')
    }, 4000)
    return () => clearTimeout(timer)
  }, [navigate])

  const handleEnter = () => navigate('/home')

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: "url('/images/background2.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/60"></div>
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => {
          const leftPos = Math.random() * 100
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{ backgroundColor: i % 2 === 0 ? '#3b82f6' : '#fbbf24', left: `${leftPos}%` }}
              initial={{ y: -100 }}
              animate={{ y: window.innerHeight + 100 }}
              transition={{ duration: Math.random() * 5 + 3, repeat: Infinity, delay: Math.random() * 5 }}
            />
          )
        })}
      </div>

      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring', delay: 0.2 }}
        className="text-center z-10"
      >
        {/* Splash Logo - Center Focus */}
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: 'spring', delay: 0.1 }}
          className="mb-8 flex justify-center"
        >
          <img
            src="/images/splashLogo.png"
            alt="Immortal Pulse Logo"
            className="w-80 h-80 md:w-100 md:h-100 lg:w-96 lg:h-96 object-contain drop-shadow-2xl"
          />
        </motion.div>

        

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1, delay: 0.8 }}
          className="h-0.5 bg-gradient-to-r from-transparent via-primary-blue to-transparent mx-auto my-6 w-48"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="text-gray-300 text-lg md:text-xl tracking-wider mb-12"
        >
          MLBB BLOG & COMMUNITY
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEnter}
            className="btn-primary"
          >
            ENTER THE REALM
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
        className="absolute bottom-8 text-center z-10"
      >
        <p className="text-gray-500 text-sm">Mobile Legends: Bang Bang Community</p>
      </motion.div>
    </div>
  )
}

export default Splash