'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CookieConsent, type CookieConsentOptions } from '@/lib/analytics/consent'

export function CookieConsentBanner() {
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

    // Reload page to apply consent changes
    setTimeout(() => {
      window.location.reload()
    }, 500)
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

    // Reload page to apply consent changes
    setTimeout(() => {
      window.location.reload()
    }, 500)
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
        className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Cookie Notice */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Cookie Notice
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                We use cookies to enhance your browsing experience, analyze site traffic,
                and personalize content. By continuing to use this site, you agree to our
                use of cookies. Learn more in our{' '}
                <a
                  href="/privacy"
                  className="underline hover:no-underline text-blue-600 dark:text-blue-400"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
              <div className="flex gap-2">
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-medium  hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  Accept All
                </button>
                <button
                  onClick={handleAcceptNecessary}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium  hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Necessary Only
                </button>
              </div>

              {/* Custom Preferences Toggle */}
              <details className="group relative">
                <summary className="cursor-pointer px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium  hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors list-none">
                  Customize
                </summary>

                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="absolute bottom-full right-0 mb-2 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg p-4"
                >
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Cookie Preferences
                  </h4>

                  <div className="space-y-3">
                    {/* Necessary Cookies */}
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-gray-700 dark:text-gray-300">
                        Essential Cookies
                      </label>
                      <input
                        type="checkbox"
                        checked={preferences.necessary}
                        disabled
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Required for the site to function properly.
                    </p>

                    {/* Analytics Cookies */}
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-gray-700 dark:text-gray-300">
                        Analytics Cookies
                      </label>
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) => handlePreferenceChange('analytics', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Help us understand how visitors interact with our website.
                    </p>

                    {/* Marketing Cookies */}
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-gray-700 dark:text-gray-300">
                        Marketing Cookies
                      </label>
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) => handlePreferenceChange('marketing', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Used to deliver personalized advertisements.
                    </p>

                    {/* Preference Cookies */}
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-gray-700 dark:text-gray-300">
                        Preference Cookies
                      </label>
                      <input
                        type="checkbox"
                        checked={preferences.preferences}
                        onChange={(e) => handlePreferenceChange('preferences', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Allow enhanced functionality and personalization.
                    </p>
                  </div>

                  <button
                    onClick={handleSavePreferences}
                    className="w-full mt-4 px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-medium  hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                  >
                    Save Preferences
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