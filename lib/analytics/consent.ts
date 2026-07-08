export const CONSENT_CHANGED_EVENT = 'cookie-consent-changed'

export interface CookieConsentOptions {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

export class CookieConsentManager {
  private static instance: CookieConsentManager
  private readonly CONSENT_KEY = 'cookie-consent'
  private readonly CONSENT_VERSION = '1.0'

  private constructor() {}

  public static getInstance(): CookieConsentManager {
    if (!CookieConsentManager.instance) {
      CookieConsentManager.instance = new CookieConsentManager()
    }
    return CookieConsentManager.instance
  }

  // Check if consent is needed
  public hasConsented(): boolean {
    if (typeof window === 'undefined') return true

    try {
      const consent = this.getConsent()
      return consent !== null
    } catch {
      return false
    }
  }

  // Get current consent preferences
  public getConsent(): CookieConsentOptions | null {
    if (typeof window === 'undefined') return null

    try {
      const consentData = localStorage.getItem(this.CONSENT_KEY)
      if (!consentData) return null

      const { version, consent } = JSON.parse(consentData)

      // Check if consent version is current
      if (version !== this.CONSENT_VERSION) {
        this.clearConsent()
        return null
      }

      return consent
    } catch {
      return null
    }
  }

  // Save consent preferences
  public setConsent(consent: CookieConsentOptions): void {
    if (typeof window === 'undefined') return

    try {
      const consentData = {
        version: this.CONSENT_VERSION,
        timestamp: new Date().toISOString(),
        consent
      }

      localStorage.setItem(this.CONSENT_KEY, JSON.stringify(consentData))

      // Fire consent event for analytics
      this.fireConsentEvent(consent)

      // Notify listeners (e.g. GoogleAnalytics) so they can react without a reload
      window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT))
    } catch (error) {
      console.warn('Failed to save cookie consent:', error)
    }
  }

  // Clear consent preferences
  public clearConsent(): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.removeItem(this.CONSENT_KEY)
      window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT))
    } catch (error) {
      console.warn('Failed to clear cookie consent:', error)
    }
  }

  // Check if analytics consent is given
  public hasAnalyticsConsent(): boolean {
    const consent = this.getConsent()
    return consent?.analytics || false
  }

  // Check if any consent is given (for essential cookies)
  public hasAnyConsent(): boolean {
    const consent = this.getConsent()
    return consent !== null
  }

  // Fire consent update event for Google Analytics
  private fireConsentEvent(consent: CookieConsentOptions): void {
    if (typeof window === 'undefined' || !window.gtag) return

    try {
      // 'default' command sets default consent state
      window.gtag('consent', 'default', {
        'ad_storage': consent.marketing ? 'granted' : 'denied',
        'analytics_storage': consent.analytics ? 'granted' : 'denied',
        'personalization_storage': consent.preferences ? 'granted' : 'denied',
        'functionality_storage': consent.necessary ? 'granted' : 'denied'
      })

      // 'update' command updates existing consent state
      window.gtag('consent', 'update', {
        'ad_storage': consent.marketing ? 'granted' : 'denied',
        'analytics_storage': consent.analytics ? 'granted' : 'denied',
        'personalization_storage': consent.preferences ? 'granted' : 'denied',
        'functionality_storage': consent.necessary ? 'granted' : 'denied'
      })
    } catch (error) {
      console.warn('Failed to fire consent event:', error)
    }
  }

  // Get default consent (all denied except necessary)
  public getDefaultConsent(): CookieConsentOptions {
    return {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    }
  }

  // Get consent summary for display
  public getConsentSummary(): { hasAnyConsent: boolean; analyticsAllowed: boolean; canShowAnalytics: boolean } {
    const consent = this.getConsent()

    return {
      hasAnyConsent: consent !== null,
      analyticsAllowed: consent?.analytics || false,
      canShowAnalytics: consent?.analytics || false
    }
  }
}

// Default export for convenience
export const CookieConsent = CookieConsentManager.getInstance()