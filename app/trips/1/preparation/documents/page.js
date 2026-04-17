/**
 * Documents Page — wezgo
 * Manual §2: type-h3.
 * Manual §3: 8px radius for table items.
 * Manual §5: vosotros.
 */
export default function DocumentsPage() {
  const docs = ["Vuelos.pdf", "Reserva_Hotel.pdf", "Seguro_Viaje.pdf"]

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h3 className="type-h3 text-white">Documentación vuestra</h3>
      
      <div className="grid gap-3">
        {docs.map((doc) => (
          <div 
            key={doc} 
            className="p-4 bg-white/5 rounded-lg flex justify-between items-center border border-white/8 hover:bg-white/10 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-teal-10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="type-body-m text-white group-hover:text-brand-coral transition-colors">{doc}</span>
            </div>
            {/* Manual §2: type-label for actions */}
            <button className="type-label text-brand-teal hover:text-white uppercase px-4 h-8 rounded-lg transition-colors">
              Descargar
            </button>
          </div>
        ))}
      </div>

      {docs.length === 0 && (
        <div className="py-12 flex flex-col items-center gap-4 border border-dashed border-white/10 rounded-xl">
          <p className="type-body-m text-brand-mgray">No hay documentos aún.</p>
        </div>
      )}
    </div>
  )
}