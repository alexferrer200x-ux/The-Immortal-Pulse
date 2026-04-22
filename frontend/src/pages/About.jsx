import { motion } from 'framer-motion'
import { FiAward, FiTrendingUp, FiZap, FiUsers, FiHeart, FiStar, FiTarget, FiActivity } from 'react-icons/fi'

const About = () => {
  const achievements = [
    { id: 1, title: '', icon: FiStar, desc: 'Mythical Immortal', image: '/images/achievement1.jpeg' },
    { id: 2, title: '', icon: FiAward, desc: 'Global Leaderboard', image: '/images/achievement2.jpeg' },
    { id: 3, title: '', icon: FiTrendingUp, desc: 'Seasonal Mastery', image: '/images/achievement3.jpeg' },
    { id: 4, title: '', icon: FiZap, desc: 'Flawless Performance', image: '/images/achievement4.jpeg' },
    { id: 5, title: '', icon: FiHeart, desc: 'Player Favorite', image: '/images/achievement5.jpeg' },
    { id: 6, title: '', icon: FiTarget, desc: 'Strategy Pioneer', image: '/images/achievement6.jpeg' }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 glass-card p-12 rounded-3xl"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-amber-500 bg-clip-text text-transparent mb-6">
            ABOUT THE PULSE
          </h1>
          <div className="max-w-4xl mx-auto space-y-6">
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              <strong>Immortal Pulse</strong> is more than just a blog — it's a competitive hub built for dedicated{' '}
              <strong>Mobile Legends: Bang Bang</strong> players who strive to rise beyond limits.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              Founded by <strong className="text-blue-600 dark:text-blue-400">Adu</strong>, a Mythical Immortal player with over{' '}
              <strong className="text-amber-500">150 stars</strong>, Immortal Pulse was created with one goal in mind: to unite 
              players under a single platform where skill, knowledge, and passion for the game converge. This is a space where 
              experience meets ambition — whether you're climbing ranks, mastering heroes, or refining your strategy.
            </p>
          </div>
        </motion.section>

        {/* Achievements Showcase - Adu's Championship Images */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            Adu's Championship Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-2xl glass-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Achievement Image */}
                <div className="relative h-56 rounded-t-2xl overflow-hidden">
                  <img
                    src={achievement.image}
                    alt={`${achievement.title} - Adu's Achievement`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/400x300?text=${achievement.title}`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-4 right-4 bg-black/50 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <achievement.icon className="text-3xl text-amber-500" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {achievement.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {achievement.desc}
                  </p>
                  <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-semibold">
                    <FiAward className="mr-2" /> 
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* What We Do */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-12 rounded-3xl mb-20"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              What We Do
            </h2>
            
            <p className="text-xl mb-8 text-gray-700 dark:text-gray-300 leading-relaxed text-center">
              Immortal Pulse empowers players to:
            </p>
            
            <ul className="grid md:grid-cols-2 gap-6 text-lg mb-12">
              <li className="flex items-start gap-4 p-4 bg-white/20 dark:bg-gray-800/20 rounded-xl hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all">
                <FiAward className="text-2xl text-amber-500 mt-1 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Showcase their <strong>achievements, ranks, and gameplay progress</strong></span>
              </li>
              <li className="flex items-start gap-4 p-4 bg-white/20 dark:bg-gray-800/20 rounded-xl hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all">
                <FiTrendingUp className="text-2xl text-green-500 mt-1 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Share <strong>custom builds, strategies, and hero insights</strong></span>
              </li>
              <li className="flex items-start gap-4 p-4 bg-white/20 dark:bg-gray-800/20 rounded-xl hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all">
                <FiZap className="text-2xl text-blue-500 mt-1 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Discover <strong>meta heroes, counter picks, and patch analyses</strong></span>
              </li>
              <li className="flex items-start gap-4 p-4 bg-white/20 dark:bg-gray-800/20 rounded-xl hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all">
                <FiUsers className="text-2xl text-purple-500 mt-1 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Connect with others to <strong>team up, compete, and grow together</strong></span>
              </li>
              <li className="flex items-start gap-4 p-4 bg-white/20 dark:bg-gray-800/20 rounded-xl hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all">
                <FiHeart className="text-2xl text-red-500 mt-1 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Report bugs and <strong>contribute to improving the platform experience</strong></span>
              </li>
            </ul>

            <div className="text-center p-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl border border-blue-200/50 dark:border-blue-800/50">
              <p className="text-xl mb-4 text-gray-700 dark:text-gray-300">
                This platform is designed not just for content consumption, but for <strong>active participation</strong>.
              </p>
              <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Every user becomes part of a growing ecosystem where knowledge is shared and improvement is constant.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Our Vision */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center glass-card p-12 rounded-3xl mb-20"
        >
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
            Our Vision
          </h2>
          <p className="text-xl max-w-3xl mx-auto mb-12 text-gray-700 dark:text-gray-300 leading-relaxed">
            We aim to build a <strong>high-level competitive community</strong> where players of all ranks can:
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
              <FiUsers className="text-4xl text-blue-500 mx-auto mb-4" />
              <p className="text-gray-700 dark:text-gray-300">Learn from experienced players</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-200/50 dark:border-purple-800/50">
              <FiTrendingUp className="text-4xl text-purple-500 mx-auto mb-4" />
              <p className="text-gray-700 dark:text-gray-300">Stay updated with the evolving meta</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/50">
              <FiZap className="text-4xl text-emerald-500 mx-auto mb-4" />
              <p className="text-gray-700 dark:text-gray-300">Develop smarter gameplay decisions</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl border border-amber-200/50 dark:border-amber-800/50">
              <FiTarget className="text-4xl text-amber-500 mx-auto mb-4" />
              <p className="text-gray-700 dark:text-gray-300">Push limits toward Mythical Immortal</p>
            </div>
          </div>
        </motion.section>

        {/* The Pulse Philosophy */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-12 rounded-3xl text-center"
        >
          <FiActivity className="text-6xl text-blue-500 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            The Pulse Philosophy
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              At its core, Immortal Pulse represents the <strong className="text-blue-600 dark:text-blue-400">heartbeat of the MLBB community</strong> — 
              fast, evolving, and relentless. We believe that every player has the potential to improve, and with the right tools, 
              insights, and community, greatness becomes achievable.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed pt-4 border-t border-gray-200 dark:border-gray-700">
              Whether you're here to dominate ranked games, explore new strategies, or connect with like-minded players —<br/>
              <strong className="text-2xl bg-gradient-to-r from-blue-600 to-amber-500 bg-clip-text text-transparent">you are part of the Pulse.</strong>
            </p>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default About