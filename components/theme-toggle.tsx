'use client'

import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/theme-context'

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-14 h-8 bg-gray-200 dark:bg-gray-700 rounded-full p-1 cursor-pointer transition-colors duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      {/* Toggle Background */}
      <motion.div
        className="w-full h-full bg-white dark:bg-gray-800 rounded-full shadow-lg"
        layout
        transition={{
          type: "spring",
          stiffness: 700,
          damping: 30
        }}
      />
      
      {/* Toggle Slider */}
      <motion.div
        className="absolute top-1 left-1 w-6 h-6 bg-black dark:bg-white rounded-full shadow-lg flex items-center justify-center"
        animate={{
          x: theme === 'dark' ? 24 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
      >
        {/* Icon Container */}
        <motion.div
          className="relative w-4 h-4"
          animate={{
            rotate: theme === 'dark' ? 180 : 0,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut"
          }}
        >
          {/* Sun Icon */}
          <motion.svg
            className="absolute inset-0 w-4 h-4 text-white dark:text-black"
            fill="currentColor"
            viewBox="0 0 20 20"
            animate={{
              opacity: theme === 'light' ? 1 : 0,
              scale: theme === 'light' ? 1 : 0.5,
            }}
            transition={{
              duration: 0.2,
            }}
          >
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </motion.svg>

          {/* Moon Icon */}
          <motion.svg
            className="absolute inset-0 w-4 h-4 text-white dark:text-black"
            fill="currentColor"
            viewBox="0 0 20 20"
            animate={{
              opacity: theme === 'dark' ? 1 : 0,
              scale: theme === 'dark' ? 1 : 0.5,
            }}
            transition={{
              duration: 0.2,
            }}
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </motion.svg>
        </motion.div>
      </motion.div>

      {/* Ripple Effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-black dark:bg-white"
        initial={{ scale: 0, opacity: 0.3 }}
        animate={{ scale: 0, opacity: 0.3 }}
        whileTap={{
          scale: 1.5,
          opacity: 0,
          transition: {
            duration: 0.4,
            ease: "easeOut"
          }
        }}
      />
    </motion.button>
  )
}
