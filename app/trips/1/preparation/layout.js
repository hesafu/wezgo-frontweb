import Link from 'next/link';

export default function PreparationLayout({ children }) {
  // Definimos las rutas fijas hacia la carpeta "1"
  const navItems = [
    { label: 'Chat', href: '/trips/1/preparation/chat' },
    { label: 'Documentos', href: '/trips/1/preparation/documents' },
    { label: 'Tareas', href: '/trips/1/preparation/tasks' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-blue-400">Fase de Preparación</h1>
        <p className="text-slate-400 text-sm">Viaje #1</p>
      </header>

      <nav className="flex gap-2 mb-6 bg-white/5 p-1 rounded-lg w-fit border border-white/10">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="px-6 py-2 rounded-md hover:bg-white/10 transition-all text-sm font-medium"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <main className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 min-h-[400px]">
        {children}
      </main>
    </div>
  );
}