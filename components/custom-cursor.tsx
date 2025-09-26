'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isOnDarkBackground, setIsOnDarkBackground] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    // Detect mobile device
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isSmallScreen = window.innerWidth <= 768
      
      return isMobileDevice || isTouchDevice || isSmallScreen
    }
    
    setIsMobile(checkIfMobile())
    
    // Re-check on resize
    const handleResize = () => {
      setIsMobile(checkIfMobile())
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      
      // Check if cursor is on dark background by examining computed styles
      const elementAtPoint = document.elementFromPoint(e.clientX, e.clientY)
      if (elementAtPoint) {
        let isDark = false
        
        // First check if it's explicitly marked as dark
        if (elementAtPoint.closest('#contact, .bg-black, .bg-gray-900, [data-dark-bg]')) {
          isDark = true
        } else {
          // Get the actual background color by traversing up the DOM tree
          let currentElement: Element | null = elementAtPoint
          let foundColor = false
          
          while (currentElement && currentElement !== document.body && !foundColor) {
            const computedStyle = window.getComputedStyle(currentElement)
            const bgColor = computedStyle.backgroundColor
            
            // Check if this element has a visible background color
            if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
              const rgbMatch = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
              if (rgbMatch) {
                const [, r, g, b] = rgbMatch.map(Number)
                // Use luminance formula to determine if background is dark
                const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
                isDark = luminance < 0.5
                foundColor = true
              }
            }
            currentElement = currentElement.parentElement
          }
          
          // If no background color found, check document body
          if (!foundColor) {
            const bodyStyle = window.getComputedStyle(document.body)
            const bodyBg = bodyStyle.backgroundColor
            if (bodyBg && bodyBg !== 'rgba(0, 0, 0, 0)' && bodyBg !== 'transparent') {
              const rgbMatch = bodyBg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
              if (rgbMatch) {
                const [, r, g, b] = rgbMatch.map(Number)
                const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
                isDark = luminance < 0.5
              }
            } else {
              // Default to light background (white)
              isDark = false
            }
          }
        }
        
        setIsOnDarkBackground(isDark)
      }
    }

    const handleMouseEnter = () => {
      setIsHovering(true)
    }

    const handleMouseLeave = () => {
      setIsHovering(false)
    }

    // Add event listeners for mouse movement
    window.addEventListener('mousemove', updateMousePosition)

    // Function to add listeners to elements
    const addListenersToElements = () => {
      // All elements that should trigger hover effect
      const selectors = [
        // Interactive elements (already working)
        'a', 'button', '[role="button"]', '[data-cursor-hover]', 
        '.cursor-hover', 'span[class*="cursor"]', '[onClick]',
        '[class*="hover"]', '[class*="group"]', '[whileHover]',
        '[data-framer-component]', '[data-framer-motion]',
        // Framer Motion components are rendered as regular HTML elements
        'h1[style*="transform"]', 'h2[style*="transform"]', 'h3[style*="transform"]',
        'p[style*="transform"]', 'span[style*="transform"]', 'div[style*="transform"]',
        // Add text elements that weren't covered before - but exclude magnifier area
        'h1:not(.cursor-hover):not([data-no-cursor])', 
        'h2:not(.cursor-hover):not([data-no-cursor])', 
        'h3:not(.cursor-hover):not([data-no-cursor])', 
        'h4:not([data-no-cursor])', 'h5:not([data-no-cursor])', 'h6:not([data-no-cursor])', 
        'p:not(.cursor-hover):not([data-no-cursor])', 
        'span:not([class*="cursor"]):not([data-no-cursor])', 
        'div[class*="text"]:not([data-no-cursor])', 
        'li:not([data-no-cursor])', 'td:not([data-no-cursor])', 'th:not([data-no-cursor])', 
        'label:not([data-no-cursor])',
        // Specific selectors for CTA section elements
        '#contact h1', '#contact h2', '#contact h3', '#contact p', '#contact span',
        '#contact [class*="motion"]', '#contact .text-6xl', '#contact .text-xl',
        '#contact .text-8xl', '#contact .font-serif'
      ]
      
      const allElements = document.querySelectorAll(selectors.join(', '))
      
      allElements.forEach((element) => {
        // Skip elements that are inside data-no-cursor containers
        if (!element.closest('[data-no-cursor]')) {
          element.addEventListener('mouseenter', handleMouseEnter)
          element.addEventListener('mouseleave', handleMouseLeave)
        }
      })
      
      return allElements
    }

    const interactiveElements = addListenersToElements()

    // Re-run when DOM changes (for dynamic content)
    const observer = new MutationObserver(() => {
      const newElements = addListenersToElements()
    })
    
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
      interactiveElements.forEach((element) => {
        element.removeEventListener('mouseenter', handleMouseEnter)
        element.removeEventListener('mouseleave', handleMouseLeave)
      })
      observer.disconnect()
    }
  }, [isMounted])

  if (!isMounted || isMobile) {
    return null
  }

  // Check if cursor is disabled globally
  const isCursorDisabled = document.body.getAttribute('data-disable-cursor') === 'true'

  return (
    <motion.div
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
        scale: isHovering && !isCursorDisabled ? 2 : 1,
        opacity: isCursorDisabled ? 0 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 28,
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '16px',
        height: '16px',
        backgroundColor: (isHovering && !isCursorDisabled)
          ? '#ff0000'  // Red for all hover states - mix-blend-mode will create cyan/red effect
          : (isOnDarkBackground ? '#ffffff' : '#000000'), // Normal state
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 99999,
        transform: 'translate(-50%, -50%)',
        mixBlendMode: (isHovering && !isCursorDisabled) ? 'difference' : 'normal',
        border: !(isHovering && !isCursorDisabled) ? `2px solid ${isOnDarkBackground ? '#000000' : '#ffffff'}` : 'none',
        boxShadow: !(isHovering && !isCursorDisabled) ? (isOnDarkBackground 
          ? '0 0 8px rgba(255,255,255,0.5)' 
          : '0 0 8px rgba(0,0,0,0.5)') : '0 0 4px rgba(255,0,0,0.6)',
      }}
    />
  )
}