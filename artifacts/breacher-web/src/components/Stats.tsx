import React from 'react';
import { useStats } from '@/hooks/use-stats';
import { Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Stats() {
  const { data: stats, isLoading, isError } = useStats();

  if (isError) {
    return (
      <div className="p-6 border border-destructive/20 bg-destructive/5 text-destructive font-mono text-sm">
        [ERR] Connection to proxy pool severed.
      </div>
    );
  }

  const items = [
    { label: 'POOL SIZE', value: stats?.poolSize, format: (n: number) => n.toLocaleString() },
    { label: 'VALIDATED', value: stats?.validated, format: (n: number) => n.toLocaleString(), color: 'text-primary' },
    { label: 'UNVALIDATED', value: stats?.unvalidated, format: (n: number) => n.toLocaleString(), color: 'text-white/40' },
    { label: 'HARVESTING', value: stats?.harvesting, format: (n: number) => n.toLocaleString(), isBlinking: true },
    { label: 'TOTAL HARVESTED', value: stats?.totalHarvested, format: (n: number) => (n / 1000000).toFixed(1) + 'M' },
  ];

  return (
    <div className="w-full border border-white/10 bg-black/50 p-6 md:p-8 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
        <Activity className="w-5 h-5 text-primary" />
      </div>
      
      <div className="flex items-center gap-3 mb-8">
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        <h3 className="font-mono text-sm font-bold tracking-widest text-white/80 uppercase">
          Live Pool Status
        </h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col gap-2">
            <span className="font-mono text-[10px] text-white/40 tracking-wider">
              {item.label}
            </span>
            <span className={cn(
              "font-display text-2xl md:text-3xl font-semibold tracking-tighter",
              item.color || "text-white",
              isLoading && "animate-pulse text-white/20",
              item.isBlinking && !isLoading && "animate-pulse"
            )}>
              {isLoading ? '0000' : item.format(item.value || 0)}
            </span>
          </div>
        ))}
      </div>
      
      {/* Decorative scanline for the stats card */}
      <div className="absolute inset-0 pointer-events-none border-t border-primary/20 scale-y-0 origin-top group-hover:scale-y-100 transition-transform duration-1000 ease-in-out" />
    </div>
  );
}
