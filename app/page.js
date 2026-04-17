import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { LucideMap, LucideDollarSign, LucideCalendar, Sparkles } from "lucide-react"
import Link from "next/link"

/**
 * Landing Page — wezgo
 * Manual §2: type-hero for h1, type-body-l for lead paragraph.
 * Manual §3: buttons 8px radius (rounded-lg), cards 12px (rounded-xl).
 * Manual §4: "wezgo" always lowercase.
 * Manual §5: vosotros, CTAs ≤3 words, no emojis in functional UI.
 */
export default function Home() {
  return (
    <div className="relative px-6 pb-24 overflow-hidden">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto pt-20 pb-20 text-center">
        {/* Announcement pill — badge-pill style (Manual §3) */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/8 backdrop-blur-xl rounded-full mb-10">
          <Sparkles className="w-3.5 h-3.5 text-brand-sun" />
          {/* Manual §2: type-label */}
          <span className="type-label text-brand-mgray">Beta v2.0 ya disponible</span>
        </div>

        {/* Manual §2: type-hero for main headline */}
        <h1 className="type-hero text-white mb-8">
          La forma inteligente de <br />
          <span className="text-brand-coral">viajar con amigos</span>
        </h1>

        {/* Manual §2: type-body-l for lead text. Manual §5: vosotros */}
        <p className="type-body-l text-brand-mgray max-w-2xl mx-auto mb-14 leading-relaxed">
          Olvidad los chats caóticos. Organizad itinerarios, gestionad gastos compartidos
          y descubrid destinos en una interfaz premium.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/registro" className="w-full sm:w-auto">
            {/* Manual §3: 8px radius, Manual §1: coral/white CTA */}
            <Button className="w-full sm:w-auto px-10 h-12 rounded-lg bg-brand-coral hover:bg-brand-coral/90 text-white border-0 type-label uppercase shadow-none">
              Empezad gratis
            </Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto px-10 h-12 rounded-lg border-white/10 bg-white/5 text-white hover:bg-white/10 type-label uppercase">
              Iniciar sesión
            </Button>
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        {/* Card — Manual §3: 12px radius (rounded-xl), Manual §1: coral accent */}
        <Card className="flex flex-col gap-4 text-center p-8 rounded-xl hover:-translate-y-1 transition-transform duration-300">
          <div className="w-12 h-12 bg-brand-coral-10 rounded-xl flex items-center justify-center mx-auto border border-brand-coral/20">
            <LucideMap className="w-6 h-6 text-brand-coral" />
          </div>
          <CardHeader
            title="Itinerario"
            subtitle="Planificad vuestras rutas y sincronizadlas con vuestra gente en tiempo real."
          />
        </Card>

        <Card className="flex flex-col gap-4 text-center p-8 rounded-xl hover:-translate-y-1 transition-transform duration-300">
          <div className="w-12 h-12 bg-brand-teal-10 rounded-xl flex items-center justify-center mx-auto border border-brand-teal/20">
            <LucideDollarSign className="w-6 h-6 text-brand-teal" />
          </div>
          <CardHeader
            title="Gastos"
            subtitle="Llevad la cuenta de quién debe a quién de forma automática y sin errores."
          />
        </Card>

        <Card className="flex flex-col gap-4 text-center p-8 rounded-xl hover:-translate-y-1 transition-transform duration-300">
          <div className="w-12 h-12 bg-brand-sun-10 rounded-xl flex items-center justify-center mx-auto border border-brand-sun/20">
            <LucideCalendar className="w-6 h-6 text-brand-sun" />
          </div>
          <CardHeader
            title="Sincronización"
            subtitle="Acceded a vuestros planes desde cualquier dispositivo, siempre actualizados."
          />
        </Card>
      </section>

      {/* Background ambient orbs */}
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-brand-coral/5 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-[10%] left-[-10%] w-[35%] h-[35%] bg-brand-teal/5 rounded-full blur-[150px] -z-10" />
    </div>
  )
}