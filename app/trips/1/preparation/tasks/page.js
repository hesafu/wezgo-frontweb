/**
 * Tasks Page — wezgo
 * Manual §2: type-h3.
 * Manual §3: 8px radius for items.
 * Manual §1: Sun for status, Coral for highlight.
 * Manual §5: vosotros.
 */
export default function TasksPage() {
  const tasks = [
    { id: 1, label: "Reservar restaurante para la cena", completed: false },
    { id: 2, label: "Comprar adaptadores de corriente", completed: true },
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h3 className="type-h3 text-white">Vuestras tareas pendientes</h3>
      
      <div className="space-y-3">
        {tasks.map((task) => (
          <label 
            key={task.id} 
            className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/8 hover:bg-white/10 transition-all cursor-pointer group"
          >
            <div className={`
              w-5 h-5 rounded border flex items-center justify-center transition-colors
              ${task.completed ? 'bg-brand-teal border-brand-teal' : 'border-white/20 bg-transparent group-hover:border-brand-coral'}
            `}>
              {task.completed && (
                <svg className="w-3.5 h-3.5 text-brand-night" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            {/* Manual §2: type-body-m */}
            <span className={`type-body-m ${task.completed ? 'text-brand-mgray line-through' : 'text-white'}`}>
              {task.label}
            </span>
          </label>
        ))}

        {tasks.length === 0 && (
          <div className="py-12 flex flex-col items-center gap-4 border border-dashed border-white/10 rounded-xl">
            <p className="type-body-m text-brand-mgray">No hay tareas pendientes.</p>
          </div>
        )}
      </div>
    </div>
  )
}