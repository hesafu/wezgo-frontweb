"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/utils/supabase"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { LogOut, Plus, MapPin, Calendar, Star, Search } from "lucide-react"
import { toast } from "react-hot-toast"
import { Input } from "@/components/ui/input"

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const router = useRouter()
  
  // Example trip data
  const trips = [
    { id: 1, title: "Grand Japan Tour", date: "May 2026", location: "Tokyo, Japan", color: "from-brand-cyan/20 to-blue-500/20" },
    { id: 2, title: "Summer in Amalfi", date: "July 2026", location: "Italy", color: "from-brand-violet/20 to-purple-500/20" },
    { id: 3, title: "Swiss Alps Hike", date: "Sept 2026", location: "Switzerland", color: "from-brand-pink/20 to-rose-500/20" },
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
    toast.success("Signed out successfully")
    router.push("/")
  }

  if (!user) return <div className="p-20 text-center text-text-muted">Loading your adventures...</div>

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Welcome back, <span className="gradient-text">{user.user_metadata?.full_name || "Traveler"}</span>!
          </h1>
          <p className="text-text-muted mt-2">You have {trips.length} upcoming adventures planned.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
          <Button className="gap-2 shadow-lg shadow-brand-cyan/20">
            <Plus className="w-4 h-4" />
            New Trip
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <Input placeholder="Search your trips..." className="pl-12" />
        </div>
        <Button variant="glass">Filter by Status</Button>
      </div>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {trips.map((trip) => (
          <Card key={trip.id} className="relative group overflow-hidden border-white/5 hover:border-brand-cyan/30">
            <div className={`absolute inset-0 bg-gradient-to-br ${trip.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 glass rounded-2xl">
                  <MapPin className="w-6 h-6 text-brand-cyan" />
                </div>
                <Button variant="ghost" size="icon" className="text-text-muted hover:text-brand-pink">
                  <Star className="w-5 h-5" />
                </Button>
              </div>

              <h3 className="text-xl font-bold mb-2 group-hover:text-brand-cyan transition-colors">{trip.title}</h3>
              
              <div className="flex flex-col gap-2 mt-4">
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <Calendar className="w-4 h-4" />
                  <span>{trip.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <MapPin className="w-4 h-4" />
                  <span>{trip.location}</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-text-muted">3 Destinations</span>
                <Button variant="ghost" size="sm" className="text-brand-cyan px-0 hover:bg-transparent hover:underline">
                  View Details →
                </Button>
              </div>
            </div>
          </Card>
        ))}
        
        {/* Create placeholder */}
        <button className="flex flex-col items-center justify-center p-12 glass border-dashed border-2 border-white/10 rounded-[2rem] hover:border-brand-cyan/40 hover:bg-white/5 transition-all group">
          <div className="w-12 h-12 glass rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6 text-text-muted group-hover:text-brand-cyan" />
          </div>
          <span className="font-bold text-text-muted group-hover:text-text-main">Add New Journey</span>
        </button>
      </div>
    </div>
  )
}