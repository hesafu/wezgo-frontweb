import Link from 'next/link'

/**
 * Trip Preparation Layout — wezgo
 * Manual §1: Night base, Teal/Sun accents.
 * Manual §2: type-h3 for prep stage, type-label for nav.
 * Manual §3: cards/surfaces 12px r (rounded-xl).
 */
export default function PreparationLayout({ children }) {
  const navItems = [
    { label: 'Chat',       href: '/trips/1/preparation/chat' },
    { label: 'Documentos', href: '/trips/1/preparation/documents' },
    { label: 'Tareas',     href: '/trips/1/preparation/tasks' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header — Manual §2: type-h1, type-label */}
      <header className="mb-10 space-y-1">
        <p className="type-label text-brand-sun uppercase tracking-[0.12em]">
          Fase de preparación
        </p>
        <h1 className="type-h1 text-white">
          Viaje <span className="text-brand-coral">#1</span>
        </h1>
      </header>

      {/* Internal Navigation — Manual §3: 12px surface */}
      <nav className="flex gap-2 mb-8 bg-white/5 p-1 rounded-xl w-fit border border-white/8 backdrop-blur-md">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            /* Manual §2: type-label. Manual §3: tabs rounded-lg (8px) */
            className="px-6 py-2 rounded-lg hover:bg-white/10 transition-all text-brand-mgray hover:text-white type-label uppercase"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Content Area — Manual §3: 12px radius, Glass surface */}
      <main className="glass-card rounded-xl p-8 min-h-[500px] border border-white/8">
        {children}
      </main>
    </div>
  )
}