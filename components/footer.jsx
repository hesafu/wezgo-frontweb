import React from 'react';
import { Plane, Instagram, Twitter, Github } from 'lucide-react';
import Link from 'next/link';

/**
 * Footer - Spanish UI version
 */
export const Footer = () => {
  return (
    <footer className="glass-nav mt-auto px-6 py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:col-span-1 md:grid-cols-4 gap-12">
        {/* Brand Info */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Plane className="w-6 h-6 text-brand-cyan" />
            <span className="text-2xl font-bold gradient-text">Wezgo</span>
          </div>
          <p className="text-text-muted max-w-sm leading-relaxed text-sm">
            La plataforma definitiva para organizar viajes grupales sin dramas. Planifica, divide gastos y disfruta del viaje con Wezgo.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-2">
          <h4 className="font-bold text-text-main mb-2">Producto</h4>
          <Link href="#" className="text-sm text-text-muted hover:text-brand-cyan transition-colors">Destinos</Link>
          <Link href="#" className="text-sm text-text-muted hover:text-brand-cyan transition-colors">Precios</Link>
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="font-bold text-text-main mb-2">Social</h4>
          <div className="flex gap-4">
            <Instagram className="w-5 h-5 text-text-muted hover:text-text-main cursor-pointer" />
            <Twitter className="w-5 h-5 text-text-muted hover:text-text-main cursor-pointer" />
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto border-t border-white/5 mt-16 pt-8 text-xs text-text-muted flex justify-between items-center">
        <p>© {new Date().getFullYear()} Wezgo App. Hecho con ❤️ para viajeros.</p>
        <div className="flex gap-6">
            <Link href="#" className="hover:text-text-main">Privacidad</Link>
            <Link href="#" className="hover:text-text-main">Términos</Link>
        </div>
      </div>
    </footer>
  );
};
