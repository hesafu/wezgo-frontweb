// store/useAppStore.ts
import { create } from 'zustand'

// Tipo que representa al usuario autenticado
type User = {
  id: string
  email: string
  display_name: string
  avatar_url?: string
  locale: string
}

// Forma del store
type AppStore = {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setLoading: (value: boolean) => void
  clearSession: () => void
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  isLoading: true,

  setUser: (user) => set({ user }),
  setLoading: (value) => set({ isLoading: value }),
  clearSession: () => set({ user: null, isLoading: false }),
}))