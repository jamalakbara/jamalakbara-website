'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

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
  const getSectionScrollOffset = (sectionId: string, element: HTMLElement) => {
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
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-sm border-b border-gray-200' : 'bg-transparent'
      }`}
      style={{ zIndex: 1000 }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="font-serif font-bold text-xl text-black cursor-pointer"
            onClick={() => scrollToSection('hero')}
          >
            Studio
          </motion.div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative font-sans text-sm transition-colors ${
                  activeSection === item.id ? 'text-black' : 'text-gray-600 hover:text-black'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-black"
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-6 h-6 flex flex-col justify-center space-y-1 relative z-10"
            >
              <motion.span 
                animate={{
                  rotate: isMobileMenuOpen ? 45 : 0,
                  y: isMobileMenuOpen ? 2 : 0
                }}
                className="w-full h-px bg-black origin-center"
              />
              <motion.span 
                animate={{
                  rotate: isMobileMenuOpen ? -45 : 0,
                  y: isMobileMenuOpen ? -2 : 0
                }}
                className="w-full h-px bg-black origin-center"
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200"
            >
              <div className="px-6 py-4 space-y-4">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      console.log('Mobile menu button clicked for:', item.id)
                      scrollToSection(item.id)
                    }}
                    className={`relative block w-full text-left font-sans text-base transition-colors py-3 px-2 ${
                      activeSection === item.id ? 'text-black font-medium' : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    {item.label}
                    {activeSection === item.id && (
                      <motion.div
                        layoutId="activeSectionMobile"
                        className="absolute -bottom-1 left-2 right-2 h-px bg-black"
                        initial={false}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}