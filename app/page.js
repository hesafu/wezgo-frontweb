import Link from 'next/link'

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col z-10">

      {/* Extra mid-page orb */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full z-0"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />

      {/* ── NAVBAR ── */}
      <nav className="glass sticky top-0 z-50 flex justify-between items-center px-8 py-4">
        <span className="text-2xl font-bold gradient-text tracking-tight">Triplo ✈️</span>
        <Link
          href="/login"
          className="btn-ghost px-5 py-2 rounded-full text-sm"
        >
          Área privada
        </Link>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center py-28 px-8 flex-grow">
        {/* Subtle glowing badge */}
        <div className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs text-white/60 mb-8 tracking-wide uppercase">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          Nuevo · Planificación colaborativa
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="gradient-text">Viaja con tus amigos</span>
          <br />
          <span className="text-white/90">sin líos</span>
        </h1>

        <p className="text-lg md:text-xl text-white/60 mb-10 max-w-xl">
          Organiza, planifica y comparte viajes de forma colaborativa. Todo en un solo lugar.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/login"
            className="btn-cta px-8 py-3 rounded-full text-base"
          >
            Empezar ahora →
          </Link>
          <Link
            href="/registro"
            className="btn-ghost px-8 py-3 rounded-full text-base"
          >
            Crear cuenta gratis
          </Link>
        </div>
      </section>

      {/* ── CARACTERÍSTICAS ── */}
      <section className="relative z-10 py-20 px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white/90 mb-2">
            Todo lo que necesitas
          </h2>
          <p className="text-center text-white/50 mb-12 text-sm tracking-wide uppercase">
            Funcionalidades diseñadas para grupos
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Card 1 */}
            <div className="glass rounded-2xl p-7 flex flex-col items-center text-center group hover:border-cyan-400/30 transition-all duration-300">
              <div className="text-5xl mb-5 group-hover:scale-110 transition-transform duration-300">🗺️</div>
              <h3 className="text-lg font-bold text-white mb-2">Planifica destinos</h3>
              <p className="text-white/55 text-sm leading-relaxed">
                Vota y decide el destino con todos tus amigos en un solo lugar.
              </p>
            </div>

            {/* Card 2 */}
            <div className="glass rounded-2xl p-7 flex flex-col items-center text-center group hover:border-violet-400/30 transition-all duration-300">
              <div className="text-5xl mb-5 group-hover:scale-110 transition-transform duration-300">💸</div>
              <h3 className="text-lg font-bold text-white mb-2">Divide gastos</h3>
              <p className="text-white/55 text-sm leading-relaxed">
                Lleva el control de quién paga qué y salda cuentas fácilmente.
              </p>
            </div>

            {/* Card 3 */}
            <div className="glass rounded-2xl p-7 flex flex-col items-center text-center group hover:border-blue-400/30 transition-all duration-300">
              <div className="text-5xl mb-5 group-hover:scale-110 transition-transform duration-300">📅</div>
              <h3 className="text-lg font-bold text-white mb-2">Organiza el itinerario</h3>
              <p className="text-white/55 text-sm leading-relaxed">
                Crea el plan día a día y compártelo con todo el grupo.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="relative z-10 py-20 px-8">
        <div className="max-w-3xl mx-auto glass rounded-3xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para tu próxima aventura?
          </h2>
          <p className="text-white/55 mb-8">
            Únete a Triplo y empieza a planificar experiencias inolvidables.
          </p>
          <Link href="/registro" className="btn-cta px-10 py-3 rounded-full text-base inline-block">
            Crear cuenta — Es gratis ✈️
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 text-center py-8 text-white/30 text-sm border-t border-white/8">
        © 2026 Triplo — Triplo Mobile S.L.
      </footer>

    </main>
  )
}