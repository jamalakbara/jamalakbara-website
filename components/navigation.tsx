'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ThemeToggle } from './theme-toggle'

const navigationItems = [
  { id: 'hero', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' }
]

export function Navigation() {
  const [activeSection, setActiveSection] = useState('hero')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
  const getSectionScrollOffset = (sectionId: string, _element: HTMLElement) => {
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
        const scrollOffset = getSectionScrollOffset(sectionId, element)
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
            const scrollOffset = getSectionScrollOffset(sectionId, retryElement)
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-hover"
          >
            <h1 className="text-xl font-serif font-bold text-black dark:text-white tracking-tight">
              Portfolio
            </h1>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
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
                  onClick={() => scrollToSection(item.id)}
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
              <ThemeToggle />
            </motion.div>
          </div>

          {/* Mobile Hamburger Button */}
          <motion.button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
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
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-b-3xl overflow-hidden"
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
                  <ThemeToggle />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </motion.header>
  )
}