'use client'

import { motion, AnimatePresence, useScroll } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { useTheme } from '@/contexts/theme-context'
import { getStaticContent } from '@/lib/content-manager'
import { useAnalytics } from '@/hooks/useAnalytics'

const navigationItems = getStaticContent.navigation()

export function Navigation() {
  const { theme, toggleTheme } = useTheme()
  const [activeSection, setActiveSection] = useState('hero')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLogoHovered, setIsLogoHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const navRef = useRef(null)

  // Analytics
  const { trackNavigationClick, trackThemeToggle } = useAnalytics()

  // Theme toggle with analytics tracking
  const handleThemeToggle = () => {
    toggleTheme()
    trackThemeToggle(theme === 'dark' ? 'light' : 'dark')
  }

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1280) // xl breakpoint for navigation
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Scroll progress for mobile animation
  const { scrollYProgress } = useScroll()
  
  // Update scroll progress for mobile animation
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setScrollProgress(latest)
    })
    
    return () => unsubscribe()
  }, [scrollYProgress])
  
  // Determine if animation should be active
  const shouldAnimate = isMobile ? scrollProgress > 0.1 && scrollProgress < 0.9 : isLogoHovered

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
      
      // Close mobile menu when scrolling
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }

      // Determine active section based on scroll position
      const sections = navigationItems.map(item => {
        const element = document.getElementById(item.id)
        if (element) {
          const rect = element.getBoundingClientRect()
          return {
            id: item.id,
            top: rect.top,
            bottom: rect.bottom
          }
        }
        return null
      }).filter(Boolean)

      const current = sections.find(section => 
        section!.top <= window.innerHeight / 2 && section!.bottom >= window.innerHeight / 2
      )

      if (current) {
        setActiveSection(current.id)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobileMenuOpen])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const nav = document.querySelector('nav')
      if (nav && !nav.contains(event.target as Node) && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobileMenuOpen])

  // Helper function to get optimal scroll offset for each section
  const getSectionScrollOffset = (sectionId: string) => {
    const navbar = document.querySelector('nav')
    const navbarHeight = navbar ? navbar.offsetHeight : 80
    
    switch (sectionId) {
      case 'hero':
        return 0 // Hero should be at very top
        
      case 'services':
        // Services has py-32 (8rem = 128px), so we want to show some padding
        return navbarHeight + 60
        
      case 'work':
        // Featured work also has py-32
        return navbarHeight + 60
        
      case 'about':
        // About has py-16 (4rem = 64px)
        return navbarHeight + 40
        
      case 'contact':
        // Contact has pt-32 pb-20
        return navbarHeight + 80
        
      default:
        return navbarHeight + 40
    }
  }

  const scrollToSection = (sectionId: string) => {
    console.log('Attempting to scroll to section:', sectionId)
    
    // Wait for any mobile menu animations to complete
    setTimeout(() => {
      const element = document.getElementById(sectionId)
      
      if (element) {
        console.log('Element found:', element)
        console.log('Element offsetTop:', element.offsetTop)
        console.log('Current scroll position:', window.pageYOffset)
        
        // Get optimal offset for this specific section
        const scrollOffset = getSectionScrollOffset(sectionId)
        console.log('Calculated scroll offset for', sectionId, ':', scrollOffset)
        
        // Calculate target position
        const targetPosition = element.offsetTop - scrollOffset
        
        console.log('Target scroll position:', targetPosition)
        
        window.scrollTo({
          top: Math.max(0, targetPosition),
          behavior: 'smooth'
        })
      } else {
        console.log('Element not found with ID:', sectionId)
        
        // Retry logic
        setTimeout(() => {
          const retryElement = document.getElementById(sectionId)
          if (retryElement) {
            console.log('Element found on retry:', retryElement)
            const scrollOffset = getSectionScrollOffset(sectionId)
            const targetPosition = retryElement.offsetTop - scrollOffset
            
            window.scrollTo({
              top: Math.max(0, targetPosition),
              behavior: 'smooth'
            })
          } else {
            console.log('Element still not found after retry')
          }
        }, 300)
      }
    }, isMobileMenuOpen ? 400 : 0)
    
    // Close mobile menu immediately
    setIsMobileMenuOpen(false)
  }

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6"
    >
      <motion.nav 
        animate={{
          width: isScrolled ? "60%" : "100%",
          borderRadius: isScrolled ? "24px" : "0px",
          marginTop: isScrolled ? "12px" : "0px"
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`mx-auto transition-all duration-500 ${
          isScrolled 
            ? 'bg-white dark:bg-gray-900 border-2 border-black dark:border-white shadow-lg' 
            : 'bg-transparent'
        }`}
        style={isScrolled ? {} : {}}
      >
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo/Brand */}
          <motion.div
            className="cursor-pointer group relative h-8 w-32 overflow-hidden flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => !isMobile && setIsLogoHovered(true)}
            onMouseLeave={() => !isMobile && setIsLogoHovered(false)}
            ref={navRef}
            onClick={() => window.location.href = '/'}
          >
            {/* Animated text transformation */}
            <div className="relative text-xl font-serif font-bold text-black dark:text-white tracking-tight">
              {/* "jamal" - disappears */}
              <motion.span
                className="inline-block"
                animate={{
                  opacity: shouldAnimate ? 0 : 1,
                  x: shouldAnimate ? -20 : 0,
                  scale: shouldAnimate ? 0.8 : 1
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                jamal
              </motion.span>
              
              {/* "akbar" - transforms */}
              <motion.span
                className="inline-block relative"
                style={{
                  background: shouldAnimate ? 'linear-gradient(45deg, #000000, #404040, #000000)' : 'transparent',
                  WebkitBackgroundClip: shouldAnimate ? 'text' : 'unset',
                  backgroundClip: shouldAnimate ? 'text' : 'unset',
                  color: shouldAnimate ? 'transparent' : 'inherit'
                }}
                animate={{
                  x: shouldAnimate ? -25 : 0,
                  scale: shouldAnimate ? 1.1 : 1
                }}
                transition={{ duration: 0.3, ease: "easeInOut", delay: 0.1 }}
              >
                akbar
              </motion.span>
              
              {/* "a" (after akbar) - disappears */}
              <motion.span
                className="inline-block"
                animate={{
                  opacity: shouldAnimate ? 0 : 1,
                  x: shouldAnimate ? 20 : 0,
                  scale: shouldAnimate ? 0.8 : 1
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                a
              </motion.span>
              
              {/* "." - stays close to akbar */}
              <motion.span
                className="inline-block"
                animate={{
                  x: shouldAnimate ? -25 : 0
                }}
                transition={{ duration: 0.3, ease: "easeInOut", delay: 0.1 }}
              >
                .
              </motion.span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-8">
            {navigationItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.1,
                  ease: "easeOut" 
                }}
                className="relative"
              >
                <motion.button
                  onClick={() => {
                    scrollToSection(item.id)
                    trackNavigationClick(item.label, item.id)
                  }}
                  className="relative px-1 py-2 text-black dark:text-white font-sans font-medium text-base transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                  
                  {/* Active indicator */}
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black dark:bg-white origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ 
                      scaleX: activeSection === item.id ? 1 : 0 
                    }}
                    transition={{ 
                      duration: 0.3, 
                      ease: "easeInOut" 
                    }}
                  />
                  
                  {/* Hover effect underline */}
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-400 dark:bg-gray-500 origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ 
                      duration: 0.2, 
                      ease: "easeOut" 
                    }}
                  />
                </motion.button>
              </motion.div>
            ))}
            
            {/* Theme Toggle */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: navigationItems.length * 0.1,
                ease: "easeOut" 
              }}
            >
              <motion.button
                onClick={handleThemeToggle}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle theme"
              >
                <motion.div
                  animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {theme === 'dark' ? (
                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </motion.div>
              </motion.button>
            </motion.div>
          </div>

          {/* Mobile Hamburger Button */}
          <motion.button
            className="xl:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle mobile menu"
          >
            <motion.span
              className="w-6 h-0.5 bg-black dark:bg-white block"
              animate={{
                rotate: isMobileMenuOpen ? 45 : 0,
                y: isMobileMenuOpen ? 4 : 0
              }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="w-6 h-0.5 bg-black dark:bg-white block"
              animate={{
                opacity: isMobileMenuOpen ? 0 : 1
              }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="w-6 h-0.5 bg-black dark:bg-white block"
              animate={{
                rotate: isMobileMenuOpen ? -45 : 0,
                y: isMobileMenuOpen ? -4 : 0
              }}
              transition={{ duration: 0.2 }}
            />
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence mode="popLayout">
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="xl:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-b-3xl overflow-hidden"
            >
              <div className="px-6 py-4 pb-6 space-y-4">
                {navigationItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={() => {
                      scrollToSection(item.id)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`block w-full text-left py-3 px-4 rounded-lg font-sans font-medium text-lg transition-colors ${
                      activeSection === item.id
                        ? 'bg-black dark:bg-white text-white dark:text-black'
                        : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.1
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.label}
                  </motion.button>
                ))}

                {/* Mobile Theme Toggle */}
                <motion.div
                  className="flex items-center justify-center pt-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: navigationItems.length * 0.1
                  }}
                >
                  <motion.button
                    onClick={handleThemeToggle}
                    className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                    whileTap={{ scale: 0.95 }}
                    aria-label="Toggle theme"
                  >
                    <motion.div
                      animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {theme === 'dark' ? (
                        <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                      )}
                    </motion.div>
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </motion.header>
  )
}