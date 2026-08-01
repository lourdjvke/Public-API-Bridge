import React from 'react';
import { cn } from '@/lib/utils';
import { CodeBlock } from './CodeBlock';

interface TerminalWindowProps {
  command: string;
  response: string;
  className?: string;
}

export function TerminalWindow({ command, response, className }: TerminalWindowProps) {
  return (
    <div className={cn("flex flex-col w-full rounded-md border border-white/10 bg-black/80 overflow-hidden shadow-2xl shadow-primary/5", className)}>
      <div className="flex items-center px-4 py-3 bg-white/5 border-b border-white/10">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-white/20" />
          <div className="w-3 h-3 rounded-full bg-white/20" />
          <div className="w-3 h-3 rounded-full bg-white/20" />
        </div>
        <div className="mx-auto text-xs font-mono text-white/40 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          breacher-proxy-pool
        </div>
      </div>
      <div className="p-4 flex flex-col gap-4">
        <div className="font-mono text-sm text-primary/80">
          <span className="text-white/40 mr-2">$</span>
          {command}
        </div>
        <div className="font-mono text-sm text-white/60 whitespace-pre-wrap break-all leading-relaxed pl-4 border-l border-white/10">
          {response}
        </div>
      </div>
    </div>
  );
}
