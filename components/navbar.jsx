"use client"

import React from 'react';
import { Plane, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

/**
 * Navbar - Spanish UI version
 */
export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass-nav rounded-3xl px-6 py-3 flex items-center justify-between border border-white/10 shadow-2xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-brand-cyan rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
            <Plane className="w-6 h-6 text-brand-background fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight text-text-main">Wezgo</span>
        </Link>

        {/* Global Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/destinos" className="text-sm font-medium text-text-muted hover:text-text-main transition-colors">Explorar</Link>
          <Link href="/comunidad" className="text-sm font-medium text-text-muted hover:text-text-main transition-colors">Comunidad</Link>
          <Link href="/nosotros" className="text-sm font-medium text-text-muted hover:text-text-main transition-colors">Sobre nosotros</Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="hidden sm:flex text-sm font-bold uppercase tracking-widest text-text-muted hover:text-text-main">
              Entrar
            </Button>
          </Link>
          <Link href="/registro">
            <Button className="rounded-2xl px-6 shadow-lg shadow-brand-cyan/20">
              Empezar
            </Button>
          </Link>
          <button className="md:hidden p-2 glass rounded-xl">
            <Menu className="w-6 h-6 text-text-muted" />
          </button>
        </div>
      </div>
    </nav>
  );
};
