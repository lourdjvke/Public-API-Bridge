import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language = 'bash', className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative group font-mono text-sm", className)}>
      <div className="absolute inset-0 bg-primary/5 blur-xl transition-all duration-500 group-hover:bg-primary/10 rounded-lg pointer-events-none" />
      <div className="relative bg-black border border-white/10 rounded-md overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
          <span className="text-white/40 text-xs uppercase tracking-wider">{language}</span>
          <button
            onClick={copyToClipboard}
            className="text-white/40 hover:text-white transition-colors"
            aria-label="Copy code"
          >
            {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <div className="p-4 overflow-x-auto">
          <pre className="text-white/80">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
