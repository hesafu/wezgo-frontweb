/**
 * Preparation Home — wezgo
 * Manual §2: type-h2, type-body-m.
 * Manual §5: vosotros.
 */
export default function PreparationHomePage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h2 className="type-h2 text-white mb-2">Bienvenidos a la fase de organización</h2>
      <p className="type-body-m text-brand-mgray max-w-sm">
        Elegid una opción del menú superior para empezar a planificar vuestra aventura.
      </p>
    </div>
  )
}