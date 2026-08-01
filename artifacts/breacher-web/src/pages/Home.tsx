import React from 'react';
import { Hero } from '@/components/Hero';
import { Stats } from '@/components/Stats';
import { Features } from '@/components/Features';
import { Usage } from '@/components/Usage';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <div className="noise-overlay" />
      <div className="scanlines" />
      
      {/* Navbar minimal */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-md">
        <div className="container px-4 md:px-8 max-w-6xl mx-auto h-16 flex items-center justify-between">
          <div className="font-mono font-bold tracking-widest text-white">
            BREACHER<span className="text-primary animate-pulse">_</span>
          </div>
          <div className="flex items-center gap-6 font-mono text-xs">
            <a href="#usage" className="text-white/60 hover:text-white transition-colors hidden sm:block">USAGE</a>
            <a href="#stats" className="text-white/60 hover:text-white transition-colors hidden sm:block">STATUS</a>
            <div className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded">
              v1.0.4-stable
            </div>
          </div>
        </div>
      </nav>

      <main>
        <Hero />
        
        <section id="stats" className="py-12 border-t border-white/5 bg-black/40 relative">
          <div className="absolute inset-0 bg-grid-white opacity-20 pointer-events-none" />
          <div className="container px-4 md:px-8 max-w-6xl mx-auto relative z-10">
            <Stats />
          </div>
        </section>

        <Features />
        <Usage />
        
        {/* CTA Section */}
        <section className="py-32 border-t border-white/10 bg-primary/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
          <div className="container px-4 md:px-8 max-w-2xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Stop fighting WAFs.
            </h2>
            <p className="text-white/60 font-sans text-lg mb-10">
              Start extracting the data you actually care about. No SDK to install, no account to create right now.
            </p>
            <div className="font-mono text-sm bg-black border border-primary/30 p-4 inline-block text-primary/80">
              $ curl "https://breacher.dev/api?target=YOUR_URL"
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
