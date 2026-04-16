"use client";

import React from "react";
import { CheckCircle2, Zap, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SubscriptionOverview() {
  // Datos mockeados para la vista de suscripción (DEV3 - Preparado para conectar a DB)
  const currentPlan = {
    name: "Triplo Pro",
    price: "€9.99/mes",
    status: "Activa",
    nextBillingDate: "15 Mayo, 2026",
    features: [
      "Sin límites en creación de viajes",
      "Mapas offline y descargas completas",
      "Soporte prioritario 24/7",
      "Sin anuncios"
    ]
  };

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 w-full max-w-xl mx-auto relative overflow-hidden group">
      {/* Resplandor decorativo de fondo */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-violet/20 blur-[80px] -z-10 group-hover:bg-brand-violet/30 transition-colors duration-500 rounded-full mix-blend-screen transform translate-x-1/2 -translate-y-1/2" />
      
      <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">Tu Suscripción</h2>
            <span className="bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              <Zap className="w-3 h-3 fill-current" />
              {currentPlan.status}
            </span>
          </div>
          <p className="text-text-muted text-sm border-l-2 border-white/10 pl-3">
            Siguiente cobro de {currentPlan.price} el {currentPlan.nextBillingDate}.
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-brand-pink text-3xl font-black drop-shadow-[0_0_8px_rgba(244,114,182,0.4)]">
            {currentPlan.name}
          </p>
        </div>
      </div>

      <div className="space-y-4 mb-8 relative z-10">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-4">Lo que incluye tu plan</h3>
        {currentPlan.features.map((feature, i) => (
          <div key={i} className="flex items-center gap-3 group/item">
            <CheckCircle2 className="w-5 h-5 text-brand-cyan/80 group-hover/item:text-brand-cyan group-hover/item:scale-110 transition-all" />
            <span className="text-gray-300 text-sm">{feature}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/5 relative z-10">
        <Button className="w-full sm:w-auto gap-2 bg-gradient-to-r from-brand-violet to-brand-cyan hover:opacity-90 shadow-[0_0_15px_rgba(139,92,246,0.2)] hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all text-white font-semibold border-none">
          <CreditCard className="w-4 h-4" />
          Cambiar método de pago
        </Button>
        <Button variant="ghost" className="w-full sm:w-auto text-text-muted hover:text-white transition-colors border-white/10 hover:bg-white/5">
          Cancelar suscripción
        </Button>
      </div>
    </div>
  );
}
