"use client"

import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

/**
 * Navbar - Wezgo Brand Update
 */
export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass-nav rounded-3xl px-6 py-3 flex items-center justify-between border border-white/5 shadow-2xl">
        {/* Logo Wezgo Official */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-brand-coral rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-brand-coral/20">
            <svg viewBox="0 0 60 60" className="w-6 h-6 text-white stroke-current fill-none stroke-[5.5] [stroke-linecap:round] [stroke-linejoin:round]">
              <polyline points="9,46 20.5,14 30,32 39.5,14 51,46" />
            </svg>
          </div>
          <span className="text-xl font-display font-extrabold tracking-tight text-white">wezgo</span>
        </Link>

        {/* Global Links */}
        <div className="hidden md:flex items-center gap-8 font-body">
          <Link href="/destinos" className="text-sm font-medium text-slate-400 hover:text-brand-coral transition-colors">Explorar</Link>
          <Link href="/comunidad" className="text-sm font-medium text-slate-400 hover:text-brand-coral transition-colors">Comunidad</Link>
          <Link href="/nosotros" className="text-sm font-medium text-slate-400 hover:text-brand-coral transition-colors">Sobre nosotros</Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="hidden sm:flex text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5">
              Entrar
            </Button>
          </Link>
          <Link href="/registro">
            <Button className="rounded-2xl px-6 bg-brand-coral hover:bg-brand-coral/90 text-white shadow-lg shadow-brand-coral/20 border-0">
              Empezar
            </Button>
          </Link>
          <button className="md:hidden p-2 glass rounded-xl">
            <Menu className="w-6 h-6 text-slate-400" />
          </button>
        </div>
      </div>
    </nav>
  );
};
