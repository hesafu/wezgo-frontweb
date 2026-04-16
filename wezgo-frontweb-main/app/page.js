import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { LucideMap, LucideDollarSign, LucideCalendar, LucidePlane } from "lucide-react";
import Link from "next/link";

/**
 * 
 */
export default function Home() {
  return (
    <div className="relative px-6 pb-24">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto pt-20 pb-20 text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 glass-badge rounded-full mb-8">
          <LucidePlane className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">v2.0 Beta ya disponible</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
          La forma inteligente de <br />
          <span className="gradient-text">Viajar con Amigos</span>
        </h1>
        
        <p className="text-xl text-text-muted max-w-2xl mx-auto mb-12 leading-relaxed">
          Olvida los chats caóticos. Organiza itinerarios, gestiona gastos compartidos y descubre destinos en una interfaz premium.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/registro">
            <Button size="lg" className="w-full sm:w-auto">Empieza Gratis</Button>
          </Link>
          <Link href="/explore">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">Explorar Destinos</Button>
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <Card className="flex flex-col gap-4 text-center">
          <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center mx-auto mb-2">
            <LucideMap className="w-6 h-6 text-brand-cyan" />
          </div>
          <CardHeader 
            title="Itinerario Inteligente" 
            subtitle="Planifica tus rutas y sincronízalas con tus amigos en tiempo real." 
          />
        </Card>

        <Card className="flex flex-col gap-4 text-center">
          <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center mx-auto mb-2">
            <LucideDollarSign className="w-6 h-6 text-brand-violet" />
          </div>
          <CardHeader 
            title="Control de Gastos" 
            subtitle="Lleva la cuenta de quién debe a quién de forma automática." 
          />
        </Card>

        <Card className="flex flex-col gap-4 text-center">
          <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center mx-auto mb-2">
            <LucideCalendar className="w-6 h-6 text-brand-pink" />
          </div>
          <CardHeader 
            title="Sincronización Total" 
            subtitle="Accede a tus planes desde cualquier dispositivo, siempre actualizados." 
          />
        </Card>
      </section>
    </div>
  );
}