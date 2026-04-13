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

  if (loading) return <p className="text-center mt-20 text-gray-400">Cargando viajes...</p>

  return (
    <main className="min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-4 bg-blue-600 text-white">
        <h1 className="text-2xl font-bold">Triplo ✈️</h1>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold hover:bg-blue-50"
        >
          Cerrar sesión
        </button>
      </nav>

      <section className="max-w-5xl mx-auto py-12 px-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">Tus viajes 🗺️</h2>

        {/* BUSCADOR */}
        <input
          type="text"
          placeholder="Buscar por destino..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-8 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {viajesFiltrados.length === 0 ? (
          <p className="text-gray-400">No se encontraron viajes.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {viajesFiltrados.map(viaje => (
              <div key={viaje.id} className="bg-white rounded-2xl shadow overflow-hidden">
                {viaje.imagen_url && (
                  <img src={viaje.imagen_url} alt={viaje.destino} className="w-full h-48 object-cover" />
                )}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xl font-bold text-blue-700">{viaje.destino}</h3>
                    <button
                      onClick={() => toggleFavorito(viaje)}
                      className="text-2xl hover:scale-110 transition-transform"
                    >
                      {viaje.favorito ? '⭐' : '🤍'}
                    </button>
                  </div>
                  <p className="text-gray-500 text-sm mb-3">{viaje.descripcion}</p>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
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