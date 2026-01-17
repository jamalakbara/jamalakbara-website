'use client'

import { GoogleAnalytics as GA } from '@next/third-parties/google'
import { useEffect } from 'react'
import { GAConfig } from '@/lib/analytics/ga-config'
import { GAEvents } from '@/lib/analytics/events'
import { CookieConsent } from '@/lib/analytics/consent'

interface GoogleAnalyticsProps {
  gaId?: string
}

export function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  const measurementId = gaId || GAConfig.getMeasurementId()

  useEffect(() => {
    // Only initialize in production and with valid GA ID
    if (!GAConfig.shouldLoadScript()) return

    // Check if user has consented to analytics
    if (!CookieConsent.hasAnalyticsConsent()) return

    // Mark as initialized
    GAConfig.markAsInitialized()

    // Track device information
    GAEvents.trackDeviceInfo()

    // Set up page view tracking
    const handleRouteChange = (url: string) => {
      GAEvents.trackPageView(url)
    }

    // Listen for route changes
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', () => {
        handleRouteChange(window.location.pathname)
      })
    }

    // Cleanup
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('popstate', () => {
          handleRouteChange(window.location.pathname)
        })
      }
    }
  }, [measurementId])

  // Don't render if no GA ID or not in production
  if (!measurementId || !measurementId.startsWith('G-')) {
    return null
  }

  // Only render if user has consented to analytics
  if (!CookieConsent.hasAnalyticsConsent()) {
    return null
  }

  return <GA gaId={measurementId} />
}