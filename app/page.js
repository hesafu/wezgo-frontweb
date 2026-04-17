import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { LucideMap, LucideDollarSign, LucideCalendar, Sparkles } from "lucide-react";
import Link from "next/link";

/**
 * Landing Page - wezgo Brand Update
 */
export default function Home() {
  return (
    <div className="relative px-6 pb-24 overflow-hidden font-body">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto pt-20 pb-20 text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/5 backdrop-blur-xl rounded-full mb-10 shadow-2xl">
          <Sparkles className="w-4 h-4 text-brand-sun" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Beta v2.0 ya disponible</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-display font-black tracking-tight mb-8 leading-[1] text-white">
          La forma inteligente de <br />
          <span className="text-brand-coral">viajar con amigos</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-14 leading-relaxed">
          Olvidad los chats caóticos. Organizad itinerarios, gestionad gastos compartidos y descubrid destinos en una interfaz premium.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link href="/registro" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto px-12 py-10 shadow-2xl shadow-brand-coral/30">
              Empezad Gratis
            </Button>
          </Link>
          <Link href="/destinos" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto px-12 py-10">
              Explorad Destinos
            </Button>
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
        <Card className="flex flex-col gap-6 text-center p-10 hover:-translate-y-2 transition-transform duration-500">
          <div className="w-16 h-16 bg-brand-coral/10 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-brand-coral/20">
            <LucideMap className="w-8 h-8 text-brand-coral" />
          </div>
          <CardHeader 
            title="Itinerario" 
            subtitle="Planificad vuestras rutas y sincronizadlas con vuestra gente en tiempo real." 
          />
        </Card>

        <Card className="flex flex-col gap-6 text-center p-10 hover:-translate-y-2 transition-transform duration-500">
          <div className="w-16 h-16 bg-brand-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-brand-teal/20">
            <LucideDollarSign className="w-8 h-8 text-brand-teal" />
          </div>
          <CardHeader 
            title="Gastos" 
            subtitle="Llevad la cuenta de quién debe a quién de forma automática y sin errores." 
          />
        </Card>

        <Card className="flex flex-col gap-6 text-center p-10 hover:-translate-y-2 transition-transform duration-500">
          <div className="w-16 h-16 bg-brand-sun/10 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-brand-sun/20">
            <LucideCalendar className="w-8 h-8 text-brand-sun" />
          </div>
          <CardHeader 
            title="Sincronización" 
            subtitle="Acceded a vuestros planes desde cualquier dispositivo, siempre actualizados." 
          />
        </Card>
      </section>

      {/* Background orbs specific for Home page */}
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-brand-coral/5 rounded-full blur-[150px] -z-10 animate-pulse" />
      <div className="absolute bottom-[10%] left-[-10%] w-[35%] h-[35%] bg-brand-teal/5 rounded-full blur-[150px] -z-10 animate-pulse delay-700" />
    </div>
  );
}