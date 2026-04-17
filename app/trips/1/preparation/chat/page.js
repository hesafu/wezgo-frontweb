/**
 * Chat Page — wezgo
 * Manual §2: type-h3.
 * Manual §5: no emojis in functional UI.
 */
export default function ChatPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h3 className="type-h3 text-white">Chat del vuestro viaje</h3>
      <div className="bg-white/5 rounded-xl h-96 flex flex-col items-center justify-center border border-dashed border-white/10 text-center px-6">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-brand-mgray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <p className="type-body-m text-brand-mgray max-w-xs">
          Aquí aparecerán pronto vuestros mensajes. Coordinad vuestra próxima aventura en tiempo real.
        </p>
      </div>
    </div>
  )
}