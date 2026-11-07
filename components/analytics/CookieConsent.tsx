'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useSite } from '@/lib/i18n/context'
import { CookieConsent, type CookieConsentOptions } from '@/lib/analytics/consent'

export function CookieConsentBanner() {
  const { path, ui } = useSite()
  const t = ui.cookie
  const [isVisible, setIsVisible] = useState(false)
  const [preferences, setPreferences] = useState<CookieConsentOptions>(
    CookieConsent.getDefaultConsent()
  )

  useEffect(() => {
    // Check if user has already consented
    if (!CookieConsent.hasConsented()) {
      setIsVisible(true)
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted: CookieConsentOptions = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    }

    CookieConsent.setConsent(allAccepted)
    setIsVisible(false)
  }

  const handleAcceptNecessary = () => {
    const necessaryOnly: CookieConsentOptions = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    }

    CookieConsent.setConsent(necessaryOnly)
    setIsVisible(false)
  }

  const handleSavePreferences = () => {
    CookieConsent.setConsent(preferences)
    setIsVisible(false)
  }

  const handlePreferenceChange = (
    category: keyof CookieConsentOptions,
    value: boolean
  ) => {
    // Cannot disable necessary cookies
    if (category === 'necessary') return

    setPreferences(prev => ({
      ...prev,
      [category]: value
    }))
  }

  if (!isVisible) return null

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="f-cookie"
      >
        <div>
          <div className="f-cookie__row">
            {/* Cookie Notice */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3>
                {t.title}
              </h3>
              <p>
                {t.body}{' '}
                <Link href={path("/privacy")}>
                  {t.privacy}
                </Link>
                .
              </p>
            </div>

            {/* Action Buttons */}
            <div className="f-cookie__actions">
              <div className="f-cookie__actions">
                <button
                  onClick={handleAcceptAll}
                  className="f-btn f-btn--primary"
                >
                  {t.acceptAll}
                </button>
                <button
                  onClick={handleAcceptNecessary}
                  className="f-btn f-btn--secondary"
                >
                  {t.necessaryOnly}
                </button>
              </div>

              {/* Custom Preferences Toggle */}
              <details className="group relative">
                <summary className="f-btn f-btn--secondary list-none">
                  {t.customize}
                </summary>

                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="f-cookie f-cookie__panel"
                >
                  <h4 className="f-cookie__panel-h">
                    {t.preferences}
                  </h4>

                  <div>
                    {/* Necessary Cookies */}
                    <div className="f-cookie__opt">
                      <label>
                        {t.essential}
                      </label>
                      <input
                        type="checkbox"
                        checked={preferences.necessary}
                        disabled
                        
                      />
                    </div>
                    <p className="f-cookie__hint">
                      {t.essentialHint}
                    </p>

                    {/* Analytics Cookies */}
                    <div className="f-cookie__opt">
                      <label>
                        {t.analytics}
                      </label>
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) => handlePreferenceChange('analytics', e.target.checked)}
                        
                      />
                    </div>
                    <p className="f-cookie__hint">
                      {t.analyticsHint}
                    </p>

                    {/* Marketing Cookies */}
                    <div className="f-cookie__opt">
                      <label>
                        {t.marketing}
                      </label>
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) => handlePreferenceChange('marketing', e.target.checked)}
                        
                      />
                    </div>
                    <p className="f-cookie__hint">
                      {t.marketingHint}
                    </p>

                    {/* Preference Cookies */}
                    <div className="f-cookie__opt">
                      <label>
                        {t.preferenceCookies}
                      </label>
                      <input
                        type="checkbox"
                        checked={preferences.preferences}
                        onChange={(e) => handlePreferenceChange('preferences', e.target.checked)}
                        
                      />
                    </div>
                    <p className="f-cookie__hint">
                      {t.preferenceHint}
                    </p>
                  </div>

                  <button
                    onClick={handleSavePreferences}
                    className="f-btn f-btn--primary f-cookie__save"
                  >
                    {t.save}
                  </button>
                </motion.div>
              </details>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}