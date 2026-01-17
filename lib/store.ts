import { create } from 'zustand'

interface GlobalState {
  isLoaded: boolean
  setIsLoaded: (status: boolean) => void
  isMenuOpen: boolean
  setIsMenuOpen: (status: boolean) => void
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  // Section navigation
  targetSection: number | null
  goToSection: (index: number) => void
  clearTargetSection: () => void
}

export const useStore = create<GlobalState>((set) => ({
  isLoaded: false,
  setIsLoaded: (status) => set({ isLoaded: status }),
  isMenuOpen: false,
  setIsMenuOpen: (status) => set({ isMenuOpen: status }),
  theme: 'dark',
  setTheme: (theme) => set({ theme }),
  targetSection: null,
  goToSection: (index) => set({ targetSection: index, isMenuOpen: false }),
  clearTargetSection: () => set({ targetSection: null }),
}))
