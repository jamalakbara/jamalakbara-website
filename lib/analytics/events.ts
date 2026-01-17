import type { AnalyticsEvent } from './ga-config'
import { GoogleAnalyticsConfig } from './ga-config'

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, unknown>) => void
  }
}

export class GoogleAnalyticsEvents {
  private static instance: GoogleAnalyticsEvents
  private config: GoogleAnalyticsConfig

  private constructor() {
    this.config = GoogleAnalyticsConfig.getInstance()
  }

  public static getInstance(): GoogleAnalyticsEvents {
    if (!GoogleAnalyticsEvents.instance) {
      GoogleAnalyticsEvents.instance = new GoogleAnalyticsEvents()
    }
    return GoogleAnalyticsEvents.instance
  }

  private isValidEnvironment(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof window.gtag === 'function' &&
      this.config.isEnabled()
    )
  }

  // Track custom events
  public trackEvent(event: AnalyticsEvent): void {
    if (!this.isValidEnvironment()) return

    try {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        non_interaction: event.nonInteraction || false
      })
    } catch (error) {
      console.warn('Google Analytics event tracking failed:', error)
    }
  }

  // Portfolio specific events
  public trackProjectView(projectId: string, projectTitle: string, category: string): void {
    this.trackEvent({
      action: GoogleAnalyticsConfig.EVENTS.PROJECT_VIEW.action,
      category: GoogleAnalyticsConfig.EVENTS.PROJECT_VIEW.category,
      label: `${projectTitle} | ${projectId}`,
      nonInteraction: true
    })

    // Set custom dimensions for project context
    this.setCustomDimension(GoogleAnalyticsConfig.CUSTOM_DIMENSIONS.PROJECT_CATEGORY, category)
  }

  public trackProjectClick(projectId: string, projectTitle: string): void {
    this.trackEvent({
      action: GoogleAnalyticsConfig.EVENTS.PROJECT_CLICK.action,
      category: GoogleAnalyticsConfig.EVENTS.PROJECT_CLICK.category,
      label: `${projectTitle} | ${projectId}`
    })
  }

  public trackLivePreview(projectTitle: string, previewUrl: string): void {
    this.trackEvent({
      action: GoogleAnalyticsConfig.EVENTS.PROJECT_LIVE_PREVIEW.action,
      category: GoogleAnalyticsConfig.EVENTS.PROJECT_LIVE_PREVIEW.category,
      label: `${projectTitle} | ${previewUrl}`
    })
  }

  // Service related events
  public trackServiceView(serviceId: string, serviceTitle: string): void {
    this.trackEvent({
      action: GoogleAnalyticsConfig.EVENTS.SERVICE_VIEW.action,
      category: GoogleAnalyticsConfig.EVENTS.SERVICE_VIEW.category,
      label: `${serviceTitle} | ${serviceId}`,
      nonInteraction: true
    })
  }

  public trackServiceClick(serviceId: string, serviceTitle: string): void {
    this.trackEvent({
      action: GoogleAnalyticsConfig.EVENTS.SERVICE_CLICK.action,
      category: GoogleAnalyticsConfig.EVENTS.SERVICE_CLICK.category,
      label: `${serviceTitle} | ${serviceId}`
    })
  }

  // Contact and conversion events
  public trackContactFormView(): void {
    this.trackEvent({
      action: GoogleAnalyticsConfig.EVENTS.CONTACT_FORM_VIEW.action,
      category: GoogleAnalyticsConfig.EVENTS.CONTACT_FORM_VIEW.category,
      nonInteraction: true
    })
  }

  public trackContactFormSubmit(formData?: { name?: string; email?: string }): void {
    this.trackEvent({
      action: GoogleAnalyticsConfig.EVENTS.CONTACT_FORM_SUBMIT.action,
      category: GoogleAnalyticsConfig.EVENTS.CONTACT_FORM_SUBMIT.category,
      label: formData?.email || 'contact_form_submission'
    })
  }

  // Navigation events
  public trackNavigationClick(navigationItem: string, section?: string): void {
    this.trackEvent({
      action: GoogleAnalyticsConfig.EVENTS.NAVIGATION_CLICK.action,
      category: GoogleAnalyticsConfig.EVENTS.NAVIGATION_CLICK.category,
      label: `${navigationItem}${section ? ` | ${section}` : ''}`
    })
  }

  // UI interaction events
  public trackThemeToggle(theme: 'light' | 'dark'): void {
    this.trackEvent({
      action: GoogleAnalyticsConfig.EVENTS.THEME_TOGGLE.action,
      category: GoogleAnalyticsConfig.EVENTS.THEME_TOGGLE.category,
      label: `theme_${theme}`
    })

    // Set custom dimension for theme preference
    this.setCustomDimension(GoogleAnalyticsConfig.CUSTOM_DIMENSIONS.USER_THEME_PREFERENCE, theme)
  }

  // Engagement events
  public trackScrollDepth(depth: number): void {
    this.trackEvent({
      action: GoogleAnalyticsConfig.EVENTS.SCROLL_DEPTH.action,
      category: GoogleAnalyticsConfig.EVENTS.SCROLL_DEPTH.category,
      label: `scroll_${depth}%`,
      nonInteraction: true,
      value: depth
    })
  }

  public trackPageDwellTime(page: string, dwellTimeSeconds: number): void {
    this.trackEvent({
      action: GoogleAnalyticsConfig.EVENTS.PAGE_DWELL_TIME.action,
      category: GoogleAnalyticsConfig.EVENTS.PAGE_DWELL_TIME.category,
      label: page,
      value: Math.round(dwellTimeSeconds),
      nonInteraction: true
    })
  }

  // Custom dimensions
  private setCustomDimension(dimension: string, value: string): void {
    if (!this.isValidEnvironment()) return

    try {
      window.gtag('config', this.config.getMeasurementId(), {
        [dimension]: value
      })
    } catch (error) {
      console.warn('Failed to set custom dimension:', error)
    }
  }

  // Page view tracking
  public trackPageView(page: string, title?: string): void {
    if (!this.isValidEnvironment()) return

    try {
      window.gtag('config', this.config.getMeasurementId(), {
        page_title: title || page,
        page_location: window.location.href,
        page_path: page
      })
    } catch (error) {
      console.warn('Page view tracking failed:', error)
    }
  }

  // User device and browser information
  public trackDeviceInfo(): void {
    if (!this.isValidEnvironment()) return

    const deviceType = this.getDeviceType()
    this.setCustomDimension(GoogleAnalyticsConfig.CUSTOM_DIMENSIONS.USER_DEVICE_TYPE, deviceType)
  }

  private getDeviceType(): string {
    const userAgent = navigator.userAgent.toLowerCase()

    if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
      return 'mobile'
    } else if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      return 'tablet'
    } else {
      return 'desktop'
    }
  }
}

// Default export for convenience
export const GAEvents = GoogleAnalyticsEvents.getInstance()