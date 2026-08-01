import React from 'react';
import { Fingerprint, Network, ServerCrash, Cpu } from 'lucide-react';

const features = [
  {
    icon: <Fingerprint className="w-5 h-5" />,
    title: "Perfect TLS Fingerprinting",
    description: "Cloudflare checks JA3/JA4 fingerprints. If you use standard fetch/curl, you get blocked. Breacher mimics the exact TLS signature of a modern Chrome browser."
  },
  {
    icon: <Network className="w-5 h-5" />,
    title: "Residential Proxy Pool",
    description: "Datacenter IPs are instantly flagged. Every request routes through a continuously validated pool of residential and mobile proxies."
  },
  {
    icon: <ServerCrash className="w-5 h-5" />,
    title: "Headless Fallback",
    description: "When raw requests fail the challenge, we instantly failover to a headless environment to solve the JS challenge and extract the clearance cookie."
  },
  {
    icon: <Cpu className="w-5 h-5" />,
    title: "Zero Overhead",
    description: "Stop maintaining Playwright scripts just to scrape an API. Call our endpoint, get your JSON in milliseconds. Focus on your application."
  }
];

export function Features() {
  return (
    <section className="py-24 border-t border-white/5 bg-black">
      <div className="container px-4 md:px-8 max-w-6xl mx-auto">
        <div className="mb-16">
          <h2 className="text-3xl font-display font-bold text-white mb-4">Under the hood</h2>
          <p className="text-white/50 font-mono text-sm max-w-2xl">
            The infrastructure required to bypass WAFs is annoying to build and expensive to maintain. 
            We built it so you don't have to.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <div key={i} className="group p-6 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <div className="w-10 h-10 mb-6 rounded flex items-center justify-center bg-black border border-white/10 text-primary group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-lg font-display font-semibold text-white/90 mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-white/50 leading-relaxed font-sans">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
