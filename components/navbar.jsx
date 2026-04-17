"use client"

import React from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

/**
 * Navbar — wezgo
 * Manual §4: logo always lowercase "wezgo", no shadows on icon.
 * Manual §3: buttons border-radius 8px, pills 100px.
 */
export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass-nav rounded-2xl px-6 py-3 flex items-center justify-between border border-white/[0.06]">

        {/* Logo — Manual §4: icon coral, wordmark white, always lowercase */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-brand-coral rounded-xl flex items-center justify-center transition-opacity duration-200 group-hover:opacity-90">
            <svg viewBox="0 0 48 48" className="w-5 h-5" fill="none" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9,33 16.5,15 24,27.5 31.5,15 39,33" />
            </svg>
          </div>
          <span className="type-h2 text-white brand-name">wezgo</span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/destinos"  className="type-body-m text-brand-mgray hover:text-white transition-colors">explorar</Link>
          <Link href="/comunidad" className="type-body-m text-brand-mgray hover:text-white transition-colors">comunidad</Link>
          <Link href="/nosotros"  className="type-body-m text-brand-mgray hover:text-white transition-colors">sobre nosotros</Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link href="/login">
            {/* Ghost: uppercase label style */}
            <Button variant="ghost" className="hidden sm:flex type-label uppercase text-brand-mgray hover:text-white hover:bg-white/5 h-10 px-4 rounded-lg">
              entrar
            </Button>
          </Link>
          <Link href="/registro">
            {/* CTA: coral, 8px radius (Manual §3) */}
            <Button className="bg-brand-coral hover:bg-brand-coral/90 text-white h-10 px-5 rounded-lg border-0 type-label uppercase shadow-none">
              empezar
            </Button>
          </Link>
          <button className="md:hidden p-2 bg-white/5 rounded-lg">
            <Menu className="w-5 h-5 text-brand-mgray" />
          </button>
        </div>

      </div>
    </nav>
  )
}
