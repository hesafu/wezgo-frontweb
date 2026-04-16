export default function DocumentsPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Documentación del Viaje</h2>
      <ul className="space-y-3">
        {['Vuelos.pdf', 'Reserva_Hotel.pdf', 'Seguro_Viaje.pdf'].map((doc) => (
          <li key={doc} className="p-3 bg-white/5 rounded-lg flex justify-between items-center border border-white/5">
            <span>{doc}</span>
            <button className="text-blue-400 text-sm">Descargar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}