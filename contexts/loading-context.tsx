'use client'

import React, { createContext, useContext, useState, useCallback, useRef } from 'react'

interface LoadingContextType {
  isLoading: boolean
  loadingMessage?: string
  setLoading: (loading: boolean, message?: string, timeout?: number) => void
  showLoadingScreen: (message?: string, timeout?: number) => Promise<void>
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider')
  }
  return context
}

interface LoadingProviderProps {
  children: React.ReactNode
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>('')
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const clearExistingTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const setLoading = useCallback((loading: boolean, message?: string, timeout?: number) => {
    clearExistingTimeout()

    if (loading) {
      setLoadingMessage(message)
      setIsLoading(true)

      if (timeout) {
        timeoutRef.current = setTimeout(() => {
          setIsLoading(false)
          setLoadingMessage(undefined)
        }, timeout)
      }
    } else {
      setIsLoading(false)
      setLoadingMessage(undefined)
    }
  }, [clearExistingTimeout])

  const showLoadingScreen = useCallback(async (message?: string, timeout = 10000) => {
    return new Promise<void>((resolve) => {
      setLoading(true, message, timeout)

      // Auto-resolve after a reasonable time or when manually cleared
      const autoTimeout = setTimeout(() => {
        setLoading(false)
        resolve()
      }, timeout)

      // Store resolve function to allow manual completion
      ;(showLoadingScreen as { resolve?: () => void }).resolve = () => {
        clearExistingTimeout()
        clearTimeout(autoTimeout)
        setLoading(false)
        resolve()
      }
    })
  }, [setLoading, clearExistingTimeout])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      clearExistingTimeout()
    }
  }, [clearExistingTimeout])

  const value: LoadingContextType = {
    isLoading,
    loadingMessage,
    setLoading,
    showLoadingScreen
  }

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  )
}