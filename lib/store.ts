import { create } from 'zustand'

interface GlobalState {
  isLoaded: boolean
  setIsLoaded: (status: boolean) => void
  isMenuOpen: boolean
  setIsMenuOpen: (status: boolean) => void
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
}

export const useStore = create<GlobalState>((set) => ({
  isLoaded: false,
  setIsLoaded: (status) => set({ isLoaded: status }),
  isMenuOpen: false,
  setIsMenuOpen: (status) => set({ isMenuOpen: status }),
  theme: 'dark', // Default to dark as per PRD
  setTheme: (theme) => set({ theme }),
}))
