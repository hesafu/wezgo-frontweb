import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">

      {/* NAVBAR */}
      <nav className="glass-nav sticky top-0 z-50 flex justify-between items-center px-8 py-4">
        <h1 className="text-2xl font-bold gradient-text-cyan tracking-tight">Triplo ✈️</h1>
        <Link
          href="/login"
          className="btn-ghost px-5 py-2 rounded-full text-sm"
        >
          Área privada
        </Link>
      </nav>

      {/* HERO */}
      <section className="flex-1 flex flex-col items-center justify-center text-center py-28 px-8 relative overflow-hidden">
        {/* Decorative floating elements */}
        <div className="absolute top-20 left-[15%] w-2 h-2 rounded-full bg-cyan-400/40 animate-float" aria-hidden="true" />
        <div className="absolute top-40 right-[20%] w-3 h-3 rounded-full bg-violet-400/30 animate-float" style={{ animationDelay: '2s' }} aria-hidden="true" />
        <div className="absolute bottom-32 left-[25%] w-2 h-2 rounded-full bg-blue-400/30 animate-float" style={{ animationDelay: '4s' }} aria-hidden="true" />

        <div className="animate-fade-in-up">
          <span className="glass-badge inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-8">
            ✨ Organiza viajes sin complicaciones
          </span>
        </div>

        <h2 className="text-5xl md:text-7xl font-bold gradient-text mb-6 animate-fade-in-up delay-100 leading-tight max-w-4xl">
          Viaja con tus amigos sin&nbsp;líos
        </h2>

        <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl animate-fade-in-up delay-200 leading-relaxed">
          Planifica destinos, divide gastos y comparte itinerarios.
          <br className="hidden md:block" />
          Todo en un solo lugar, de forma colaborativa.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
          <Link
            href="/login"
            className="btn-cta px-10 py-4 rounded-full text-lg tracking-wide"
          >
            Empezar ahora →
          </Link>
          <Link
            href="#features"
            className="btn-ghost px-10 py-4 rounded-full text-lg"
          >
            Ver más
          </Link>
        </div>

        {/* Hero glow accent */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-violet-500/10 blur-[80px] rounded-full pointer-events-none" aria-hidden="true" />
      </section>

      {/* CARACTERÍSTICAS */}
      <section id="features" className="py-24 px-8">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-center text-3xl md:text-4xl font-bold gradient-text mb-4 animate-fade-in-up">
            Todo lo que necesitas
          </h3>
          <p className="text-center text-white/50 mb-16 text-lg animate-fade-in-up delay-100">
            Herramientas diseñadas para planificar viajes en grupo
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card text-center p-8 rounded-2xl animate-fade-in-up delay-200">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center text-3xl"
                   style={{ background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                🗺️
              </div>
              <h4 className="text-xl font-bold mb-3 text-white/95">Planifica destinos</h4>
              <p className="text-white/50 leading-relaxed">Vota y decide el destino con todos tus amigos en un solo lugar</p>
            </div>

            <div className="glass-card text-center p-8 rounded-2xl animate-fade-in-up delay-300">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center text-3xl"
                   style={{ background: 'rgba(139, 92, 246, 0.12)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                💸
              </div>
              <h4 className="text-xl font-bold mb-3 text-white/95">Divide gastos</h4>
              <p className="text-white/50 leading-relaxed">Lleva el control de quién paga qué y salda cuentas fácilmente</p>
            </div>

            <div className="glass-card text-center p-8 rounded-2xl animate-fade-in-up delay-400">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center text-3xl"
                   style={{ background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                📅
              </div>
              <h4 className="text-xl font-bold mb-3 text-white/95">Organiza el itinerario</h4>
              <p className="text-white/50 leading-relaxed">Crea el plan día a día y compártelo con todo el grupo</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="glass-nav text-center py-8 text-white/30 text-sm mt-auto">
        <p>© 2026 Triplo — Triplo Mobile S.L.</p>
      </footer>

    </main>
  )
}