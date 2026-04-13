'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const router = useRouter()
  const [viajes, setViajes] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function cargarViajes() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      const { data } = await supabase.from('viajes').select('*')
      setViajes(data || [])
      setLoading(false)
    }
    cargarViajes()
  }, [])

  async function toggleFavorito(viaje) {
    const nuevoValor = !viaje.favorito
    await supabase.from('viajes').update({ favorito: nuevoValor }).eq('id', viaje.id)
    setViajes(viajes.map(v => v.id === viaje.id ? { ...v, favorito: nuevoValor } : v))
    if (nuevoValor) {
      toast.success('Añadido a favoritos ⭐')
    } else {
      toast('Eliminado de favoritos', { icon: '🗑️' })
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    toast.success('Sesión cerrada correctamente')
    router.push('/')
  }

  const viajesFiltrados = viajes.filter(v =>
    v.destino.toLowerCase().includes(busqueda.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" />
          <p className="text-white/40 text-sm">Cargando viajes...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen flex flex-col">

      {/* NAVBAR */}
      <nav className="glass-nav sticky top-0 z-50 flex justify-between items-center px-8 py-4">
        <h1 className="text-2xl font-bold gradient-text-cyan tracking-tight">Triplo ✈️</h1>
        <button
          onClick={handleLogout}
          className="btn-ghost px-5 py-2 rounded-full text-sm"
        >
          Cerrar sesión
        </button>
      </nav>

      <section className="max-w-6xl mx-auto w-full py-12 px-8 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-3xl font-bold gradient-text">Tus viajes 🗺️</h2>
          <span className="glass-badge px-4 py-1.5 rounded-full text-sm font-medium">
            {viajes.length} {viajes.length === 1 ? 'viaje' : 'viajes'}
          </span>
        </div>

        {/* BUSCADOR */}
        <div className="relative mb-10">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm pointer-events-none">🔍</span>
          <input
            type="text"
            placeholder="Buscar por destino..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="glass-input w-full rounded-xl pl-10 pr-4 py-3 text-sm"
          />
        </div>

        {viajesFiltrados.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center">
            <p className="text-4xl mb-4">🌍</p>
            <p className="text-white/40 text-lg">No se encontraron viajes.</p>
            <p className="text-white/25 text-sm mt-2">Prueba con otro término de búsqueda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {viajesFiltrados.map(viaje => (
              <div key={viaje.id} className="glass-card rounded-2xl overflow-hidden group">
                {viaje.imagen_url && (
                  <div className="relative overflow-hidden">
                    <img
                      src={viaje.imagen_url}
                      alt={viaje.destino}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Image overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white/90">{viaje.destino}</h3>
                    <button
                      onClick={() => toggleFavorito(viaje)}
                      className="text-2xl hover:scale-125 transition-transform duration-200"
                    >
                      {viaje.favorito ? '⭐' : '🤍'}
                    </button>
                  </div>
                  <p className="text-white/40 text-sm mb-4 leading-relaxed">{viaje.descripcion}</p>
                  <span className="glass-badge px-3 py-1 rounded-full text-sm font-semibold">
                    {viaje.precio} €
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </main>
  )
}