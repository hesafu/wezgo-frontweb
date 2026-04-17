import React from 'react'
import { Instagram, Twitter } from 'lucide-react'
import Link from 'next/link'

/**
 * Footer — wezgo
 * Manual §2: type-h3 for section headings, type-body-m for text, type-caption for bottom bar.
 * Manual §3: icon 8px radius (rounded-lg).
 * Manual §4: "wezgo" always lowercase, no shadows on icon.
 * Manual §5: vosotros, no emojis.
 */
export const Footer = () => {
  return (
    <footer className="glass-nav mt-auto px-6 py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* Brand block */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
          {/* Logo — Manual §4: coral icon, white wordmark, always lowercase, no shadows */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-coral rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 48 48" className="w-5 h-5" fill="none" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9,33 16.5,15 24,27.5 31.5,15 39,33" />
              </svg>
            </div>
            {/* Manual §2: type-h2 for wordmark */}
            <span className="type-h2 text-white brand-name">wezgo</span>
          </div>
          {/* Manual §2: type-body-m. Manual §5: vosotros */}
          <p className="type-body-m text-brand-mgray max-w-sm leading-relaxed">
            La plataforma definitiva para organizar viajes grupales sin dramas.
            Planificad, dividid gastos y disfrutad del viaje con wezgo.
          </p>
        </div>

        {/* Product links */}
        <div className="flex flex-col gap-3">
          {/* Manual §2: type-label for section header */}
          <h4 className="type-label text-white uppercase mb-2">Producto</h4>
          <Link href="#" className="type-body-m text-brand-mgray hover:text-brand-coral transition-colors">destinos</Link>
          <Link href="#" className="type-body-m text-brand-mgray hover:text-brand-coral transition-colors">precios</Link>
          <Link href="#" className="type-body-m text-brand-mgray hover:text-brand-coral transition-colors">comunidad</Link>
        </div>

        {/* Social */}
        <div className="flex flex-col gap-3">
          <h4 className="type-label text-white uppercase mb-2">Social</h4>
          <div className="flex gap-4">
            <Instagram className="w-5 h-5 text-brand-mgray hover:text-brand-coral cursor-pointer transition-colors" />
            <Twitter   className="w-5 h-5 text-brand-mgray hover:text-brand-coral cursor-pointer transition-colors" />
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Manual §2: type-caption for legal copy */}
        <p className="type-caption text-brand-mgray">© {new Date().getFullYear()} wezgo app. Hecho para viajeros.</p>
        <div className="flex gap-6">
          <Link href="#" className="type-caption text-brand-mgray hover:text-white transition-colors">privacidad</Link>
          <Link href="#" className="type-caption text-brand-mgray hover:text-white transition-colors">términos</Link>
        </div>
      </div>
    </footer>
  )
}
