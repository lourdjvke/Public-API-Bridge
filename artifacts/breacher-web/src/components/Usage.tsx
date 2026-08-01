import React from 'react';
import { CodeBlock } from './CodeBlock';

export function Usage() {
  return (
    <section id="usage" className="py-24 border-t border-white/5 bg-[#050505]">
      <div className="container px-4 md:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              Dead simple integration.
            </h2>
            <div className="space-y-6 text-white/60 font-sans leading-relaxed">
              <p>
                No SDKs. No complicated authentication flows. If you know how to make an HTTP request, you know how to use Breacher.
              </p>
              <p>
                Simply take the URL of the protected API you want to hit, URL-encode it, and append it as the <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-sm">target</code> parameter.
              </p>
              
              <div className="pt-4 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 text-white/80">1</div>
                  <div>
                    <h4 className="font-bold text-white/90 mb-1">Find the endpoint</h4>
                    <p className="text-sm">Open DevTools, find the API request that the browser makes successfully.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 text-white/80">2</div>
                  <div>
                    <h4 className="font-bold text-white/90 mb-1">Prepend Breacher</h4>
                    <p className="text-sm">Change your fetch call to hit our gateway instead.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 text-primary">3</div>
                  <div>
                    <h4 className="font-bold text-primary mb-1">Parse the JSON</h4>
                    <p className="text-sm">We return exactly what the target server returns. No wrappers.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-sm font-mono text-white/40 mb-2">JavaScript (Node.js/Edge)</div>
            <CodeBlock 
              language="typescript"
              code={`const TARGET_URL = "https://www.sofascore.com/api/v1/event/16115794/odds/1/all";

async function fetchProtectedData() {
  const response = await fetch(
    \`https://breacher.dev/api?target=\${encodeURIComponent(TARGET_URL)}\`,
    {
      headers: {
        "Accept": "application/json"
      }
    }
  );
  
  if (!response.ok) {
    throw new Error(\`Bypass failed: \${response.status}\`);
  }
  
  const data = await response.json();
  return data;
}`}
            />
            
            <div className="text-sm font-mono text-white/40 mt-8 mb-2">Python</div>
            <CodeBlock 
              language="python"
              code={`import urllib.parse
import requests

target_url = "https://www.sofascore.com/api/v1/event/16115794/odds/1/all"
breacher_url = f"https://breacher.dev/api?target={urllib.parse.quote(target_url)}"

response = requests.get(breacher_url)
data = response.json()

print(data)`}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
