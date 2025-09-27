'use client'

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
          const offset = getSectionScrollOffset(item.id, element)
          return {
            id: item.id,
            top: rect.top + window.pageYOffset,
            element,
            offset
          }
        }
        return null
      }).filter(Boolean) as Array<{
        id: string
        top: number
        element: HTMLElement
        offset: number
      }>

      const scrollPosition = window.pageYOffset + 150

      const currentSection = sections.find((section, index) => {
        const nextSection = sections[index + 1]
        return scrollPosition >= section.top - section.offset && 
               (!nextSection || scrollPosition < nextSection.top - nextSection.offset)
      })

      if (currentSection) {
        setActiveSection(currentSection.id)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobileMenuOpen])

  // Helper function to get optimal scroll offset for each section
  const getSectionScrollOffset = (sectionId: string, _element: HTMLElement) => {
    const navbar = document.querySelector('nav')
    const navbarHeight = navbar ? navbar.offsetHeight : 80
    
    switch (sectionId) {
      case 'hero':
        return 0 // Hero should be at very top
      case 'services':
        return navbarHeight + 60
      case 'work':
        return navbarHeight + 60
      case 'about':
        return navbarHeight + 40
      case 'contact':
        return navbarHeight + 80
      default:
        return navbarHeight + 40
    }
  }

  const scrollToSection = (sectionId: string) => {
    // Wait for any mobile menu animations to complete
    setTimeout(() => {
      const element = document.getElementById(sectionId)
      
      if (element) {
        // Get optimal offset for this specific section
        const scrollOffset = getSectionScrollOffset(sectionId, element)
        
        // Calculate target position
        const targetPosition = element.offsetTop - scrollOffset
        
        window.scrollTo({
          top: Math.max(0, targetPosition),
          behavior: 'smooth'
        })
      } else {
        // Retry logic
        setTimeout(() => {
          const retryElement = document.getElementById(sectionId)
          if (retryElement) {
            const scrollOffset = getSectionScrollOffset(sectionId, retryElement)
            const targetPosition = retryElement.offsetTop - scrollOffset
            
            window.scrollTo({
              top: Math.max(0, targetPosition),
              behavior: 'smooth'
            })
          }
        }, 300)
      }
    }, isMobileMenuOpen ? 400 : 0)
    
    // Close mobile menu immediately
    setIsMobileMenuOpen(false)
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95' 
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          
          {/* Logo/Brand - Crescente Style */}
          <div className="cursor-hover">
            <h1 className="text-lg font-sans font-normal text-black tracking-normal">
              Portfolio
            </h1>
          </div>

          {/* Desktop Navigation - True Crescente Style */}
          <div className="hidden md:flex items-center space-x-12">
            {navigationItems.map((item) => (
              <div key={item.id} className="relative">
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-sans font-normal tracking-wide transition-colors duration-200 cursor-hover ${
                    activeSection === item.id 
                      ? 'text-black' 
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {item.label}
                </button>
              </div>
            ))}
          </div>

          {/* Mobile Menu Button - Simple */}
          <button
            className="md:hidden flex items-center justify-center cursor-hover"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="flex flex-col space-y-1">
              <span
                className={`block w-5 h-px bg-black transition-transform duration-200 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''
                }`}
              />
              <span
                className={`block w-5 h-px bg-black transition-opacity duration-200 ${
                  isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`block w-5 h-px bg-black transition-transform duration-200 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu - Crescente Style */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-6 border-t border-gray-200 pt-6">
            <div className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-left py-2 text-base font-sans font-normal transition-colors duration-200 cursor-hover ${
                    activeSection === item.id
                      ? 'text-black'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}