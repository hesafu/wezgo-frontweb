export default function TasksPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Tareas Pendientes</h2>
      <div className="space-y-2">
        <label className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
          <input type="checkbox" className="w-4 h-4" />
          <span>Reservar restaurante para la cena</span>
        </label>
        <label className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
          <input type="checkbox" className="w-4 h-4" />
          <span>Comprar adaptadores de corriente</span>
        </label>
      </div>
    </div>
  );
}