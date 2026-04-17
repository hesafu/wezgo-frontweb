"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { tripService } from "@/services/tripService"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LogOut, Plus, MapPin, Calendar, Star, Search, Filter } from "lucide-react"
import { toast } from "react-hot-toast"
import { Input } from "@/components/ui/input"

/**
 * Dashboard Page - Wezgo Brand Redesign
 * TASK FRT-TK-010: Trip Dashboard UI: Grid of trips with status badges
 * TASK FRT-TK-011: Fetching Trips: Supabase integration for list of trips
 */
export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
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

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success("Sesión cerrada correctamente")
    router.push("/")
  }

  const getStatusBadge = (status) => {
    const normalizedStatus = status?.toLowerCase()
    switch (normalizedStatus) {
      case "active":
      case "en curso":
        return <span className="bg-brand-teal/20 text-brand-teal text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-brand-teal/30">En curso</span>
      case "upcoming":
      case "próximo":
        return <span className="bg-brand-sun/20 text-brand-sun text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-brand-sun/30">Próximamente</span>
      case "past":
      case "finalizado":
        return <span className="bg-white/10 text-slate-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/10">Finalizado</span>
      default:
        return <span className="bg-white/10 text-slate-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/10">{status || 'Planeado'}</span>
    }
  }

  const formatDateRange = (start, end) => {
    if (!start) return "Fecha por definir"
    const startObj = new Date(start)
    const options = { day: 'numeric', month: 'short' }
    if (!end) return startObj.toLocaleDateString('es-ES', options)
    
    const endObj = new Date(end)
    return `${startObj.toLocaleDateString('es-ES', options)} - ${endObj.toLocaleDateString('es-ES', options)}`
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
          <p className="text-slate-400 mt-3 text-lg font-body">
            {trips.length > 0 
              ? `Tienes ${trips.length} planes organizados.` 
              : "Aún no tienes viajes planeados. ¡Empieza uno nuevo!"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleLogout} className="gap-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl px-6 h-12">
            <LogOut className="w-4 h-4" />
            Salir
          </Button>
          <Button className="gap-2 bg-brand-coral hover:bg-brand-coral/90 text-white rounded-2xl px-8 h-12 shadow-xl shadow-brand-coral/20 border-0">
            <Plus className="w-5 h-5" />
            Nueva aventura
          </Button>
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
        <Button variant="outline" className="h-14 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 gap-2 font-body">
          <Filter className="w-4 h-4" />
          Filtrar
        </Button>
      </div>

      {/* Trips Grid */}
      {trips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip) => (
            <Card key={trip.id} className="glass-card group flex flex-col border-white/5 p-0 overflow-hidden">
              {/* Trip Image Header */}
              <div className="relative h-48 overflow-hidden bg-brand-night">
                <img 
                  src={trip.image_url || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1935&auto=format&fit=crop"} 
                  alt={trip.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80" 
                />
                <div className="absolute top-4 left-4 z-10">
                  {getStatusBadge(trip.status)}
                </div>
                <div className="absolute top-4 right-4 z-10">
                  <Button variant="glass" size="icon" className="w-10 h-10 rounded-xl hover:text-brand-coral border-white/10">
                    <Star className="w-5 h-5" />
                  </Button>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-brand-night via-transparent to-transparent opacity-60" />
              </div>

              {/* Trip Content */}
              <div className="p-6 space-y-4">
                <h3 className="text-2xl font-display font-bold text-white group-hover:text-brand-coral transition-colors">
                  {trip.name}
                </h3>
                
                <div className="space-y-2 font-body">
                  <div className="flex items-center gap-3 text-slate-400 text-sm">
                    <div className="p-2 rounded-lg bg-white/5"><Calendar className="w-4 h-4 text-brand-sun" /></div>
                    <span>{formatDateRange(trip.start_date, trip.end_date)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 text-sm">
                    <div className="p-2 rounded-lg bg-white/5"><MapPin className="w-4 h-4 text-brand-teal" /></div>
                    <span>{trip.destination || "Destino por definir"}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full h-12 mt-4 rounded-xl border-white/10 bg-white/5 text-white hover:bg-brand-coral hover:border-brand-coral transition-all group/btn font-body">
                  Ver Detalles
                  <Plus className="ml-2 w-4 h-4 group-hover/btn:rotate-90 transition-transform" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center glass-card border-dashed border-white/10">
          <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-display text-white mb-2">No se encontraron viajes</h3>
          <p className="text-slate-400 max-w-xs mx-auto font-body">
            Empieza por crear tu primer viaje grupal y organiza tu próxima aventura.
          </p>
          <Button className="mt-8 bg-brand-coral hover:bg-brand-coral/90 text-white rounded-2xl px-8 h-12 border-0">
            Crear mi primer viaje
          </Button>
        </div>
      )}
    </div>
  )
}