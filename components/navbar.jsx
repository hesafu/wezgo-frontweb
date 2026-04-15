import React from 'react';
import { Plane, Menu, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

/**
 * Shared Navbar Component
 * Floating glass navigation bar with account actions
 */
export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass-nav rounded-2xl px-6 py-3 flex items-center justify-between shadow-2xl">
        {/* Brand Identity */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 glass rounded-lg group-hover:bg-white/10 transition-colors">
            <Plane className="w-5 h-5 text-brand-cyan group-hover:rotate-12 transition-transform" />
          </div>
          <span className="text-xl font-bold tracking-tight gradient-text">Triplo</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/explore" className="text-sm font-medium text-text-muted hover:text-text-main transition-colors">Explore</Link>
          <Link href="/community" className="text-sm font-medium text-text-muted hover:text-text-main transition-colors">Community</Link>
          <Link href="/about" className="text-sm font-medium text-text-muted hover:text-text-main transition-colors">About</Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Sign In</Button>
          </Link>
          <Link href="/registro">
            <Button size="sm">Get Started</Button>
          </Link>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};
