import React from 'react';
import { Terminal } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-12 text-white/40 font-mono text-xs">
      <div className="container px-4 md:px-8 max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-primary" />
          <span className="text-white/80 font-bold">BREACHER</span>
          <span className="mx-2 opacity-30">|</span>
          <span>SYSTEM_ONLINE</span>
        </div>
        
        <div className="flex gap-6">
          <a href="#" className="hover:text-primary transition-colors">Documentation</a>
          <a href="#" className="hover:text-primary transition-colors">Status</a>
          <a href="#" className="hover:text-primary transition-colors">Pricing</a>
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
}
