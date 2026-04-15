"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/utils/supabase"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LogOut, Plus, MapPin, Calendar, Star, Search } from "lucide-react"
import { toast } from "react-hot-toast"
import { Input } from "@/components/ui/input"

/**
 * Dashboard Page - Fixed with Spanish UI
 */
export default function Dashboard() {
  const [user, setUser] = useState(null)
  const router = useRouter()
  
  const trips = [
    { id: 1, title: "Tour Japón", date: "Mayo 2026", location: "Tokio", color: "from-brand-cyan/20 to-blue-500/20" },
    { id: 2, title: "Costa Amalfitana", date: "Julio 2026", location: "Italia", color: "from-brand-violet/20 to-purple-500/20" },
  ]

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
      } else {
        setUser(user)
      }
    }
    checkUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success("Sesión cerrada")
    router.push("/")
  }

  if (!user) return <div className="p-20 text-center text-text-muted italic">Cargando tus aventuras...</div>

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            ¡Hola, <span className="gradient-text">{user.user_metadata?.full_name || "Viajero"}</span>!
          </h1>
          <p className="text-text-muted mt-2">Tienes {trips.length} planes en marcha.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Salir
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nueva aventura
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <Input placeholder="Buscar viajes..." className="pl-12" />
        </div>
        <Button variant="glass">Filtrar</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {trips.map((trip) => (
          <Card key={trip.id} className="relative group overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${trip.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 glass rounded-xl"><MapPin className="text-brand-cyan" /></div>
                <Button variant="ghost" size="icon" className="hover:text-brand-pink"><Star /></Button>
              </div>
              <h3 className="text-xl font-bold">{trip.title}</h3>
              <div className="mt-4 text-sm text-text-muted flex flex-col gap-1">
                <span className="flex items-center gap-2"><Calendar className="w-4" /> {trip.date}</span>
                <span className="flex items-center gap-2"><MapPin className="w-4" /> {trip.location}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}