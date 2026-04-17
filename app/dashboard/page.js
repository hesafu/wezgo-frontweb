"use client"

import React from 'react'
import Link from 'next/link'

/**
 * Dashboard — wezgo
 * Manual §1: Night base, Mist for card surfaces, Coral for CTAs.
 * Manual §2: type-hero for main heading, type-h2/h3 for subheadings.
 * Manual §3: cards 12-16px radius, buttons 8px, pills 100px.
 * Manual §4: "wezgo" always lowercase.
 * Manual §5: vosotros form, CTAs ≤3 words, no emojis in functional UI.
 */

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { tripService } from "@/services/tripService"
import { TripCard } from "@/components/trip-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CreateTripModal } from "@/components/create-trip-modal"
import { toast } from "react-hot-toast"
import { Plus, Search, MapPin, LogOut } from "lucide-react"

export default function Dashboard() {
  const [user, setUser]         = useState(null)
  const [trips, setTrips]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [isModalOpen, setModal] = useState(false)
  const router  = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) { router.push("/login"); return }
      setUser(authUser)
      try {
        const data = await tripService.getTrips()
        setTrips(data || [])
      } catch {
        toast.error("Algo salió mal. Intentadlo de nuevo.")
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [router, supabase])

  const refreshTrips = async () => {
    try {
      const data = await tripService.getTrips()
      setTrips(data || [])
    } catch {
      toast.error("Error al refrescar los viajes.")
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success("Sesión cerrada.")
    router.push("/")
  }

  /* Loading state */
  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-10 h-10 border-2 border-brand-coral border-t-transparent rounded-full animate-spin" />
      <p className="type-body-m text-brand-mgray">Cargando vuestros viajes...</p>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">

      {/* ── Header ── */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div className="space-y-1">
          {/* Manual §5: vosotros, ≤5-word title */}
          <p className="type-label uppercase text-brand-coral tracking-[0.12em]">
            Vuestro panel
          </p>
          <h1 className="type-hero text-white">
            Vuestros <span className="text-brand-coral">viajes</span>
          </h1>
          <p className="type-body-m text-brand-mgray mt-2">
            Planificad y compartid vuestras próximas aventuras.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* CTA — Manual §3: 8px radius, coral/white, ≤3 words */}
          <Button
            onClick={() => setModal(true)}
            className="bg-brand-coral hover:bg-brand-coral/90 text-white h-11 px-6 rounded-lg border-0 type-label uppercase shadow-none"
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear viaje
          </Button>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="text-brand-mgray hover:text-white hover:bg-white/5 h-11 px-4 rounded-lg type-label uppercase"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Salir
          </Button>
        </div>
      </header>

      {/* ── Search bar ── */}
      <div className="relative mb-10 max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-mgray" />
        <Input
          placeholder="Buscar viaje o destino..."
          className="h-11 pl-11 rounded-lg bg-white/5 border-white/10 text-white placeholder:text-brand-mgray type-body-m focus:border-brand-coral/50 focus:ring-0"
        />
      </div>

      {/* ── Trips grid ── */}
      {trips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      ) : (
        /* Empty-state — Manual §5: no emojis, concise copy */
        <div className="py-24 flex flex-col items-center gap-6 border border-dashed border-white/10 rounded-2xl">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
            <MapPin className="w-8 h-8 text-brand-mgray" />
          </div>
          <div className="text-center max-w-xs">
            <h3 className="type-h2 text-white mb-2">Todavía no hay viajes</h3>
            <p className="type-body-m text-brand-mgray">
              Cread el primero — elegid destino, añadid a vuestra gente y empezad a planificar.
            </p>
          </div>
          <Button
            onClick={() => setModal(true)}
            className="bg-brand-coral hover:bg-brand-coral/90 text-white h-11 px-8 rounded-lg border-0 type-label uppercase"
          >
            Crear viaje
          </Button>
        </div>
      )}

      {/* ── Modal ── */}
      <CreateTripModal
        isOpen={isModalOpen}
        onClose={() => setModal(false)}
        onSuccess={refreshTrips}
      />
    </div>
  )
}