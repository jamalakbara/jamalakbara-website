'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { isBahasaPath } from '@/lib/site-data'
import { CookieConsent, type CookieConsentOptions } from '@/lib/analytics/consent'

const COPY = {
  en: {
    title: 'Cookie Notice',
    body: 'We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By continuing to use this site, you agree to our use of cookies. Learn more in our',
    privacy: 'Privacy Policy',
    acceptAll: 'Accept All',
    necessaryOnly: 'Necessary Only',
    customize: 'Customize',
    preferences: 'Cookie Preferences',
    essential: 'Essential Cookies',
    essentialHint: 'Required for the site to function properly.',
    analytics: 'Analytics Cookies',
    analyticsHint: 'Help us understand how visitors interact with our website.',
    marketing: 'Marketing Cookies',
    marketingHint: 'Used to deliver personalized advertisements.',
    preferenceCookies: 'Preference Cookies',
    preferenceHint: 'Allow enhanced functionality and personalization.',
    save: 'Save Preferences',
  },
  id: {
    title: 'Pemberitahuan Cookie',
    body: 'Website ini pakai cookie buat bikin pengalaman browsing lebih enak, menganalisis trafik, dan menyesuaikan konten. Dengan lanjut pakai website ini, kalian setuju sama penggunaan cookie. Baca selengkapnya di',
    privacy: 'Kebijakan Privasi',
    acceptAll: 'Terima Semua',
    necessaryOnly: 'Yang Perlu Saja',
    customize: 'Atur',
    preferences: 'Preferensi Cookie',
    essential: 'Cookie Wajib',
    essentialHint: 'Dibutuhkan biar website berjalan dengan baik.',
    analytics: 'Cookie Analitik',
    analyticsHint: 'Bantu aku paham gimana pengunjung pakai website ini.',
    marketing: 'Cookie Pemasaran',
    marketingHint: 'Dipakai buat menampilkan iklan yang relevan.',
    preferenceCookies: 'Cookie Preferensi',
    preferenceHint: 'Mengaktifkan fitur tambahan dan personalisasi.',
    save: 'Simpan Preferensi',
  },
}

export function CookieConsentBanner() {
  const pathname = usePathname()
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

  const t = isBahasaPath(pathname) ? COPY.id : COPY.en

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
                <Link href="/privacy">
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