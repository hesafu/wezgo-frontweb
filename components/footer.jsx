import React from 'react';
import { Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';

/**
 * Footer - wezgo Brand Update (Strict Adherence)
 */
export const Footer = () => {
  return (
    <footer className="glass-nav mt-auto px-6 py-16 font-body">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Info */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-coral rounded-lg flex items-center justify-center shadow-lg shadow-brand-coral/20">
              <svg viewBox="0 0 48 48" className="w-5 h-5 text-white stroke-current fill-none stroke-[4.5] [stroke-linecap:round] [stroke-linejoin:round]">
                <polyline points="9,33 16.5,15 24,27.5 31.5,15 39,33" />
              </svg>
            </div>
            <span className="text-2xl font-display font-black text-white tracking-tight brand-name">wezgo</span>
          </div>
          <p className="text-slate-400 max-w-sm leading-relaxed text-sm">
            La plataforma definitiva para organizar viajes grupales sin dramas. Planificad, dividid gastos y disfrutad del viaje con wezgo.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-white mb-2 uppercase tracking-widest text-xs">Producto</h4>
          <Link href="#" className="text-sm text-slate-400 hover:text-brand-coral transition-colors">destinos</Link>
          <Link href="#" className="text-sm text-slate-400 hover:text-brand-coral transition-colors">precios</Link>
          <Link href="#" className="text-sm text-slate-400 hover:text-brand-coral transition-colors">comunidad</Link>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-white mb-2 uppercase tracking-widest text-xs">Social</h4>
          <div className="flex gap-4">
            <Instagram className="w-5 h-5 text-slate-400 hover:text-brand-coral cursor-pointer transition-colors" />
            <Twitter className="w-5 h-5 text-slate-400 hover:text-brand-coral cursor-pointer transition-colors" />
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto border-t border-white/5 mt-16 pt-8 text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© {new Date().getFullYear()} wezgo app. Hecho con ❤️ para viajeros.</p>
        <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">privacidad</Link>
            <Link href="#" className="hover:text-white transition-colors">términos</Link>
        </div>
      </div>
    </footer>
  );
};
