import React from 'react';
import { TerminalWindow } from './TerminalWindow';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center pt-24 pb-16">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container px-4 md:px-8 max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        <div className="flex flex-col gap-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/30 bg-primary/5 text-primary text-xs font-mono font-medium tracking-wide w-fit rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            API PROTECTION BYPASS
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold leading-[1.1] tracking-tighter text-white">
            Browser gets <span className="text-primary">200.</span><br />
            Code gets <span className="text-destructive/90">403.</span><br />
            <span className="text-white/40">Not anymore.</span>
          </h1>
          
          <p className="text-lg text-white/60 font-sans max-w-md leading-relaxed">
            Stop messing with headless browsers and proxy rotators. Just prepend our endpoint to your target URL and get the JSON you want. We handle the TLS fingerprinting and residential IPs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <a href="#usage" className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-primary text-primary-foreground font-mono font-bold text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors">
              Read the Docs <ArrowRight className="w-4 h-4" />
            </a>
            <div className="inline-flex items-center h-12 px-4 border border-white/10 font-mono text-xs text-white/40 bg-white/5">
              No auth. No signup.
            </div>
          </div>
        </div>

        <div className="relative w-full max-w-xl mx-auto lg:mx-0">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent blur-lg opacity-50" />
          <TerminalWindow 
            command='curl "https://breacher.dev/api?target=https://api.example.com/protected-odds"'
            response={`{
  "status": 200,
  "breacher_stats": {
    "ip": "104.28.192.14",
    "asn": "AS7922",
    "tls_fingerprint": "ja3_matched"
  },
  "data": {
    "match_id": "16115794",
    "home_odds": 2.15,
    "away_odds": 3.40,
    "draw": 3.10
  }
}`}
          />
        </div>

      </div>
    </section>
  );
}
