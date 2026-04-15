import React from 'react';
import { Plane, Instagram, Twitter, Github } from 'lucide-react';
import Link from 'next/link';

/**
 * Shared Footer Component
 * Elegant glass footer with social links and product information
 */
export const Footer = () => {
  return (
    <footer className="glass-nav mt-auto px-6 py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Info */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Plane className="w-6 h-6 text-brand-cyan" />
            <span className="text-2xl font-bold gradient-text">Triplo</span>
          </div>
          <p className="text-text-muted max-w-sm leading-relaxed">
            Revolutionizing the way you plan trips with friends. Organize, explore, and share your adventures in a premium, high-speed interface.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="p-2 glass rounded-xl hover:bg-white/10 transition-colors">
              <Instagram className="w-5 h-5 text-text-muted hover:text-text-main transition-colors" />
            </Link>
            <Link href="#" className="p-2 glass rounded-xl hover:bg-white/10 transition-colors">
              <Twitter className="w-5 h-5 text-text-muted hover:text-text-main transition-colors" />
            </Link>
            <Link href="#" className="p-2 glass rounded-xl hover:bg-white/10 transition-colors">
              <Github className="w-5 h-5 text-text-muted hover:text-text-main transition-colors" />
            </Link>
          </div>
        </div>

        {/* Product Links */}
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-text-main">Product</h4>
          <Link href="#" className="text-sm text-text-muted hover:text-text-main transition-colors">Destinations</Link>
          <Link href="#" className="text-sm text-text-muted hover:text-text-main transition-colors">Planner</Link>
          <Link href="#" className="text-sm text-text-muted hover:text-text-main transition-colors">Mobile App</Link>
        </div>

        {/* Company Links */}
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-text-main">Support</h4>
          <Link href="#" className="text-sm text-text-muted hover:text-text-main transition-colors">Help Center</Link>
          <Link href="#" className="text-sm text-text-muted hover:text-text-main transition-colors">Privacy Policy</Link>
          <Link href="#" className="text-sm text-text-muted hover:text-text-main transition-colors">Contact Us</Link>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto border-t border-white/5 mt-16 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-text-muted">
          © {new Date().getFullYear()} Triplo App Inc. All rights reserved.
        </p>
        <p className="text-xs text-text-muted flex items-center gap-1">
          Handcrafted with ❤️ for world travelers.
        </p>
      </div>
    </footer>
  );
};
