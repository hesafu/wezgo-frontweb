// store/useTripStore.ts
import { create } from 'zustand'

// Tipo que representa un viaje
type Trip = {
  id: string
  name: string
  destination: string
  phase: 'preparation' | 'active' | 'closed'
  start_date: string
  end_date: string
  invite_code?: string
}

// Forma del store
type TripStore = {
  activeTrip: Trip | null
  setActiveTrip: (trip: Trip | null) => void
  clearActiveTrip: () => void
}

export const useTripStore = create<TripStore>((set) => ({
  activeTrip: null,

  setActiveTrip: (trip) => set({ activeTrip: trip }),
  clearActiveTrip: () => set({ activeTrip: null }),
}))