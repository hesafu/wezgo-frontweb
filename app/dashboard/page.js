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
      const { data, error } = await supabase.from('viajes').select('*')
      console.log('datos:', data)
      console.log('error:', error)
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass rounded-2xl px-8 py-6 text-white/60 text-center">
        <div className="text-3xl mb-3 animate-pulse">✈️</div>
        <p>Cargando viajes...</p>
      </div>
    </div>
  )

  return (
    <main className="relative min-h-screen flex flex-col z-10">

      {/* Ambient orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-[-150px] left-[-150px] w-[500px] h-[500px] rounded-full z-0"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%)', filter: 'blur(80px)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-[-150px] right-[-150px] w-[450px] h-[450px] rounded-full z-0"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.20) 0%, transparent 70%)', filter: 'blur(80px)' }}
      />

      {/* ── NAVBAR ── */}
      <nav className="glass sticky top-0 z-50 flex justify-between items-center px-8 py-4">
        <span className="text-2xl font-bold gradient-text tracking-tight">Triplo ✈️</span>
        <button
          onClick={handleLogout}
          className="btn-ghost px-5 py-2 rounded-full text-sm"
        >
          Cerrar sesión
        </button>
      </nav>

      {/* ── CONTENIDO ── */}
      <section className="relative z-10 max-w-5xl mx-auto w-full py-12 px-8 flex-grow">

        <h2 className="text-3xl font-bold gradient-text mb-2">Tus viajes</h2>
        <p className="text-white/45 text-sm mb-8">🗺️ Explora y gestiona tu lista de destinos</p>

        {/* BUSCADOR */}
        <input
          type="text"
          placeholder="Buscar por destino..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="glass-input w-full rounded-xl px-4 py-3 text-sm mb-8"
        />

        {viajesFiltrados.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center text-white/40">
            <div className="text-5xl mb-4">🧳</div>
            <p className="text-lg font-semibold text-white/60">No se encontraron viajes</p>
            <p className="text-sm mt-1">Prueba con otro destino o añade un nuevo viaje</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {viajesFiltrados.map(viaje => (
              <div
                key={viaje.id}
                className="glass rounded-2xl overflow-hidden group hover:border-cyan-400/25 transition-all duration-300"
              >
                {viaje.imagen_url && (
                  <div className="overflow-hidden h-48">
                    <img
                      src={viaje.imagen_url}
                      alt={viaje.destino}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white group-hover:gradient-text transition-all">
                      {viaje.destino}
                    </h3>
                    <button
                      onClick={() => toggleFavorito(viaje)}
                      className="text-xl hover:scale-125 transition-transform duration-200 ml-2"
                      title={viaje.favorito ? 'Quitar favorito' : 'Añadir a favoritos'}
                    >
                      {viaje.favorito ? '⭐' : '🤍'}
                    </button>
                  </div>
                  <p className="text-white/50 text-sm mb-4 leading-relaxed">{viaje.descripcion}</p>
                  <span
                    className="inline-block text-sm font-semibold px-3 py-1 rounded-full"
                    style={{
                      background: 'rgba(6,182,212,0.15)',
                      border: '1px solid rgba(6,182,212,0.3)',
                      color: '#67e8f9',
                    }}
                  >
                    {viaje.precio} €
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 text-center py-6 text-white/25 text-xs border-t border-white/8">
        © 2026 Triplo — Triplo Mobile S.L.
      </footer>

    </main>
  )
}