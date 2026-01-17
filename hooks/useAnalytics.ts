'use client'

import { useCallback, useEffect, useRef } from 'react'
import { GAEvents } from '@/lib/analytics/events'
import { getStaticContent } from '@/lib/content-manager'

interface UseAnalyticsOptions {
  trackPageView?: boolean
  trackScrollDepth?: boolean
  trackDwellTime?: boolean
}

export function useAnalytics(options: UseAnalyticsOptions = {}) {
  const {
    trackPageView: shouldTrackPageView = true,
    trackScrollDepth: shouldTrackScrollDepth = true,
    trackDwellTime: shouldTrackDwellTime = true
  } = options

  const startTimeRef = useRef<number>(Date.now())
  const hasTracked = useRef<Set<string>>(new Set())
  const scrollDepthTracked = useRef<number[]>([])

  // Track page view
  const trackPageView = useCallback((page?: string, title?: string) => {
    if (shouldTrackPageView) {
      const pagePath = page || (typeof window !== 'undefined' ? window.location.pathname : '/')
      GAEvents.trackPageView(pagePath, title)
    }
  }, [shouldTrackPageView])

  // Track portfolio interactions
  const trackProjectView = useCallback((projectId: string) => {
    const projects = getStaticContent.projects()
    const project = projects.find(p => p.id === projectId)

    if (project) {
      GAEvents.trackProjectView(project.id, project.title, project.category)
    }
  }, [])

  const trackProjectClick = useCallback((projectId: string) => {
    const projects = getStaticContent.projects()
    const project = projects.find(p => p.id === projectId)

    if (project) {
      GAEvents.trackProjectClick(project.id, project.title)
    }
  }, [])

  const trackLivePreview = useCallback((projectId: string) => {
    const projects = getStaticContent.projects()
    const project = projects.find(p => p.id === projectId)

    if (project && project.livePreview) {
      GAEvents.trackLivePreview(project.title, project.livePreview)
    }
  }, [])

  // Track service interactions
  const trackServiceView = useCallback((serviceId: string) => {
    const services = getStaticContent.services()
    const service = services.find(s => s.id === serviceId)

    if (service) {
      GAEvents.trackServiceView(service.id, service.title)
    }
  }, [])

  const trackServiceClick = useCallback((serviceId: string) => {
    const services = getStaticContent.services()
    const service = services.find(s => s.id === serviceId)

    if (service) {
      GAEvents.trackServiceClick(service.id, service.title)
    }
  }, [])

  // Track contact form interactions
  const trackContactFormView = useCallback(() => {
    GAEvents.trackContactFormView()
  }, [])

  const trackContactFormSubmit = useCallback((formData?: { name?: string; email?: string }) => {
    GAEvents.trackContactFormSubmit(formData)
  }, [])

  // Track navigation
  const trackNavigationClick = useCallback((item: string, section?: string) => {
    GAEvents.trackNavigationClick(item, section)
  }, [])

  // Track theme toggle
  const trackThemeToggle = useCallback((theme: 'light' | 'dark') => {
    GAEvents.trackThemeToggle(theme)
  }, [])

  // Track scroll depth
  const trackScrollDepthAt = useCallback((depth: number) => {
    if (!scrollDepthTracked.current.includes(depth)) {
      GAEvents.trackScrollDepth(depth)
      scrollDepthTracked.current.push(depth)
    }
  }, [])

  // Track dwell time
  const trackDwellTime = useCallback((page: string) => {
    if (hasTracked.current.has(page)) return

    const dwellTime = (Date.now() - startTimeRef.current) / 1000
    GAEvents.trackPageDwellTime(page, dwellTime)
    hasTracked.current.add(page)
  }, [])

  // Setup scroll depth tracking
  useEffect(() => {
    if (!shouldTrackScrollDepth) return

    const handleScroll = () => {
      if (typeof window === 'undefined') return

      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPosition = window.scrollY
      const scrollPercentage = Math.round((scrollPosition / scrollHeight) * 100)

      // Track at specific depths
      const depths = [25, 50, 75, 90]
      depths.forEach(depth => {
        if (scrollPercentage >= depth) {
          trackScrollDepthAt(depth)
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [shouldTrackScrollDepth, trackScrollDepthAt])

  // Setup dwell time tracking
  useEffect(() => {
    if (!shouldTrackDwellTime) return

    const handlePageUnload = () => {
      if (typeof window !== 'undefined') {
        trackDwellTime(window.location.pathname)
      }
    }

    window.addEventListener('beforeunload', handlePageUnload)
    return () => window.removeEventListener('beforeunload', handlePageUnload)
  }, [shouldTrackDwellTime, trackDwellTime])

  // Track initial page view
  useEffect(() => {
    if (shouldTrackPageView && typeof window !== 'undefined') {
      trackPageView()
    }
  }, [shouldTrackPageView, trackPageView])

  return {
    // Page tracking
    trackPageView,

    // Portfolio tracking
    trackProjectView,
    trackProjectClick,
    trackLivePreview,

    // Service tracking
    trackServiceView,
    trackServiceClick,

    // Contact tracking
    trackContactFormView,
    trackContactFormSubmit,

    // Navigation tracking
    trackNavigationClick,

    // UI interaction tracking
    trackThemeToggle,

    // Engagement tracking
    trackScrollDepthAt,
    trackDwellTime
  }
}

// Hook for easy project tracking
export function useProjectAnalytics() {
  const { trackProjectView, trackProjectClick, trackLivePreview } = useAnalytics()

  return {
    onView: trackProjectView,
    onClick: trackProjectClick,
    onPreviewClick: trackLivePreview
  }
}

// Hook for easy service tracking
export function useServiceAnalytics() {
  const { trackServiceView, trackServiceClick } = useAnalytics()

  return {
    onView: trackServiceView,
    onClick: trackServiceClick
  }
}

// Hook for easy contact form tracking
export function useContactAnalytics() {
  const { trackContactFormView, trackContactFormSubmit } = useAnalytics()

  return {
    onView: trackContactFormView,
    onSubmit: trackContactFormSubmit
  }
}