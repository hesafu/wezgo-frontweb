"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { tripService } from "@/services/tripService"
import { TripCard } from "@/components/trip-card"
import { Button } from "@/components/ui/button"
import { LogOut, Plus, MapPin, Search, Filter } from "lucide-react"
import { toast } from "react-hot-toast"
import { Input } from "@/components/ui/input"
import { CreateTripModal } from "@/components/create-trip-modal"

/**
 * Dashboard Page - wezgo Brand Redesign
 * TASK FRT-TK-010: Trip Dashboard UI: Grid of trips with status badges
 * TASK FRT-TK-011: Fetching Trips: Supabase integration for list of trips
 */
export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  
  useEffect(() => {
    const initializeDashboard = async () => {
      // 1. Check Auth User
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        router.push("/login")
        return
      }
      setUser(authUser)

      // 2. Fetch Real Trips
      try {
        const data = await tripService.getTrips()
        setTrips(data || [])
      } catch (error) {
        console.error("Dashboard init error:", error)
        toast.error("Error al cargar tus viajes")
      } finally {
        setLoading(false)
      }
    }

    initializeDashboard()
  }, [router, supabase])

  const fetchTrips = async () => {
    try {
      const data = await tripService.getTrips()
      setTrips(data || [])
    } catch (error) {
      toast.error("Error al refrescar viajes")
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success("Sesión cerrada correctamente")
    router.push("/")
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-2 border-brand-coral border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-400 italic animate-pulse font-body">Cargando tus aventuras...</p>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
        <div>
          <h1 className="text-5xl font-display font-extrabold tracking-tight text-white leading-tight">
            ¡Hola, <span className="text-brand-coral">{user?.user_metadata?.display_name || user?.user_metadata?.full_name || "Viajero"}</span>!
          </h1>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-display font-black text-white tracking-tight">
                Vuestros <span className="text-brand-coral">viajes</span>
              </h1>
              <p className="text-lg text-slate-400 font-body">
                Explorad y planificad vuestras próximas aventuras con la gente que queréis.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => setIsModalOpen(true)}
                size="lg" 
                className="bg-brand-coral hover:bg-brand-coral/90 text-white rounded-2xl shadow-xl shadow-brand-coral/20 px-8 py-8 text-lg font-bold"
              >
                <Plus className="w-6 h-6 mr-2" /> Cread un viaje
              </Button>
            </div>
          </div>
      </div>

      {/* Filter & Search Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
        <div className="md:col-span-3 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand-coral transition-colors" />
          <Input 
            placeholder="Buscar por destino o nombre del viaje..." 
            className="bg-white/5 border-white/10 h-14 pl-14 rounded-2xl text-white focus:ring-brand-coral/50 transition-all font-body"
          />
        </div>
        <Button variant="outline" className="h-14 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 gap-2 font-body transition-all">
          <Filter className="w-4 h-4" />
          Filtrar
        </Button>
      </div>

      {/* Trips Grid using TripCard Component (FRT-TK-013) */}
      {trips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center glass border-dashed border-white/10 rounded-3xl">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-10 h-10 text-slate-600" />
          </div>
          <h3 className="text-2xl font-display text-white mb-2">No se encontraron viajes</h3>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">
                Parece que todavía no habéis organizado ningún viaje. ¡Invitad a vuestros amigos y empezad hoy mismo!
              </p>
              <Button 
                onClick={() => setIsModalOpen(true)}
                size="lg" 
                className="bg-brand-coral hover:bg-brand-coral/90 text-white rounded-2xl px-10 py-8 font-black text-xl"
              >
                Cread vuestro primer viaje
              </Button>
        </div>
      )}

      {/* Create Trip Modal Integration */}
      <CreateTripModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchTrips}
      />
    </div>
  )
}