import { Card, CardHeader } from "@/components/ui/card";
import { LucideMapPin, LucideCalendar, LucideUsers, LucideInfo } from "lucide-react";

export default function TripOverviewPage() {
  const trip = {
    title: "Tour Japón",
    destination: "Tokio, Japón",
    dates: "Mayo 2026",
    members: 4,
    description: "Preparación para el viaje grupal. Revisión de itinerario y reservas de hotel."
  };

  return (
    <div className="flex flex-col gap-6 p-6 animate-in fade-in duration-500">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Resumen</h1>
      </div>

      <Card className="bg-white/10 backdrop-blur-md border-white/20 p-8 shadow-2xl">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 text-brand-cyan">
            <LucideInfo className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Estado: Preparación</span>
          </div>

          <h2 className="text-4xl font-black text-white">{trip.title}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              <LucideMapPin className="text-brand-cyan w-6 h-6" />
              <div>
                <p className="text-[10px] text-text-muted uppercase font-black">Ubicación</p>
                <p className="text-white font-medium">{trip.destination}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              <LucideCalendar className="text-brand-pink w-6 h-6" />
              <div>
                <p className="text-[10px] text-text-muted uppercase font-black">Fecha</p>
                <p className="text-white font-medium">{trip.dates}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              <LucideUsers className="text-brand-violet w-6 h-6" />
              <div>
                <p className="text-[10px] text-text-muted uppercase font-black">Grupo</p>
                <p className="text-white font-medium">{trip.members} Viajeros</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-white/5 border-white/10 p-6">
         <CardHeader 
            title="Notas de preparación" 
            subtitle={trip.description}
         />
      </Card>
    </div>
  );
}