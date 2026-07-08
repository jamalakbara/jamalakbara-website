'use client'

import { GoogleAnalytics as GA } from '@next/third-parties/google'
import { useEffect, useState } from 'react'
import { GAConfig } from '@/lib/analytics/ga-config'
import { GAEvents } from '@/lib/analytics/events'
import { CookieConsent, CONSENT_CHANGED_EVENT } from '@/lib/analytics/consent'

interface GoogleAnalyticsProps {
  gaId?: string
}

export function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  const measurementId = gaId || GAConfig.getMeasurementId()
  const [hasConsent, setHasConsent] = useState(false)

  // Consent lives in localStorage, so it can only be read on the client —
  // sync it here and whenever the banner updates it.
  useEffect(() => {
    const syncConsent = () => setHasConsent(CookieConsent.hasAnalyticsConsent())

    syncConsent()
    window.addEventListener(CONSENT_CHANGED_EVENT, syncConsent)
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, syncConsent)
  }, [])

  useEffect(() => {
    if (!hasConsent) return
    if (!GAConfig.shouldLoadScript()) return

    // Mark as initialized
    GAConfig.markAsInitialized()

    // Track device information
    GAEvents.trackDeviceInfo()

    // Track page views on back/forward navigation
    const handlePopState = () => {
      GAEvents.trackPageView(window.location.pathname)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [hasConsent])

  // Don't render without a valid GA ID
  if (!measurementId || !measurementId.startsWith('G-')) {
    return null
  }

  // Only render if user has consented to analytics
  if (!hasConsent) {
    return null
  }

  return <GA gaId={measurementId} />
}
