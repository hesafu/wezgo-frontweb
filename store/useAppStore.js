import { create } from 'zustand'

/**
 * App State Store
 * Manages user session, loading states, and global application data.
 */
export const useAppStore = create((set) => ({
  user: null,
  loading: true,

  /**
   * Updates the current authenticated user.
   */
  setUser: (user) => set({ user }),

  /**
   * sets the loading state for auth/data fetching.
   */
  setLoading: (loading) => set({ loading }),

  /**
   * Clears the current session (logout or expired).
   */
  clearSession: () => set({ user: null, loading: false }),
}))
