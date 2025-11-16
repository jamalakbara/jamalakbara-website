'use client'

import { useTheme as useNextTheme } from 'next-themes'

export function useTheme() {
  const theme = useNextTheme()
  return {
    ...theme,
    toggleTheme: () => theme.setTheme(theme.theme === 'dark' ? 'light' : 'dark')
  }
}