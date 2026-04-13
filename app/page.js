import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-4 bg-blue-600 text-white">
        <h1 className="text-2xl font-bold">Triplo ✈️</h1>
        <Link href="/login" className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold hover:bg-blue-50">
          Área privada
        </Link>
      </nav>

      {/* HERO */}
      <section className="text-center py-20 px-8 bg-blue-50">
        <h2 className="text-5xl font-bold text-blue-700 mb-4">Viaja con tus amigos sin líos</h2>
        <p className="text-xl text-gray-600 mb-8">Organiza, planifica y comparte viajes de forma colaborativa</p>
        <Link href="/login" className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700">
          Empezar ahora
        </Link>
      </section>

      {/* SECCIÓN CARACTERÍSTICAS */}
      <section className="py-16 px-8 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="text-center p-6 rounded-xl shadow">
          <div className="text-4xl mb-4">🗺️</div>
          <h3 className="text-xl font-bold mb-2">Planifica destinos</h3>
          <p className="text-gray-500">Vota y decide el destino con todos tus amigos en un solo lugar</p>
        </div>
        <div className="text-center p-6 rounded-xl shadow">
          <div className="text-4xl mb-4">💸</div>
          <h3 className="text-xl font-bold mb-2">Divide gastos</h3>
          <p className="text-gray-500">Lleva el control de quién paga qué y salda cuentas fácilmente</p>
        </div>
        <div className="text-center p-6 rounded-xl shadow">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-xl font-bold mb-2">Organiza el itinerario</h3>
          <p className="text-gray-500">Crea el plan día a día y compártelo con todo el grupo</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-8 text-gray-400 text-sm">
        © 2026 Triplo — Triplo Mobile S.L.
      </footer>

    </main>
  )
}