import { useState, useEffect } from "react";
import { PageTransition } from "@/components/layout/PageTransition";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation, Film, Gamepad2, Sparkles, Globe2, Infinity, Rocket, Swords, Loader2, GitBranch, Zap, AlertTriangle } from "lucide-react";

// Updated to match your exact requested preset types
// Updated categories with "Butterfly Effect" removed
const CATEGORIES = [
  { id: 'anime-manga', icon: Swords, label: '⛩️ Anime & Manga' },
  { id: 'movies-tv', icon: Film, label: '🎬 Movies & TV' },
  { id: 'gaming', icon: Gamepad2, label: '🎮 Video Games' },
  { id: 'comedy-absurd', icon: Sparkles, label: '🤡 Stupid & Absurd' },
  { id: 'geopolitical', icon: Globe2, label: '🏛️ World History' },
  { id: 'tech-scifi', icon: Rocket, label: '⚡ Sci-Fi & Tech' }
];

export default function AltVerse() {
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null); // Storing the full JSON response
  
  // State for dynamic loading text
  const [loadingText, setLoadingText] = useState("Initializing quantum simulation...");

  // Effect to cycle through thematic phrases while loading
  useEffect(() => {
    if (!isGenerating) return;
    
    const phrases = [
      "Initializing quantum simulation...",
      "Calculating butterfly effect...",
      "Reticulating temporal splines...",
      "Simulating cascade events...",
      "Mapping alternate timelines...",
      "Finalizing reality divergence..."
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % phrases.length;
      setLoadingText(phrases[i]);
    }, 2500); // Changes text every 2.5 seconds
    
    return () => clearInterval(interval);
  }, [isGenerating]);
  
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !selectedCat || isGenerating) return;
    
    setIsGenerating(true);
    setResult(null);
    
    try {
      const BASE = import.meta.env.BASE_URL;
      const categoryObj = CATEGORIES.find(c => c.id === selectedCat);
      
      // Match the exact Pydantic schema: AltVerseRequest
      const payload = {
        scenario_type: categoryObj?.label || "General",
        prompt: prompt
      };

      // Standard JSON fetch to match your backend definition
      const res = await fetch(`${BASE}api/altverse/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error("Failed to generate timeline");
      
      const data = await res.json();
      setResult(data);
      
    } catch (err) {
      console.error(err);
      alert("Timeline simulation failed. Check your backend console!");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <PageTransition className="flex flex-col h-full overflow-y-auto pb-10">
      <div className="flex items-center gap-3 mb-8 shrink-0">
        <div className="w-12 h-12 rounded-2xl bg-altverse/10 text-altverse flex items-center justify-center">
          <Navigation className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-altverse to-teal-400">
            AltVerse
          </h1>
          <p className="text-muted-foreground">Rewrite reality. Change one variable, simulate the cascade.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Generator Form */}
        <div className="xl:col-span-5 space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-altverse/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-altverse/10 blur-3xl rounded-full pointer-events-none" />
            
            <h3 className="font-display font-bold text-xl mb-4 relative z-10">Select Reality Vector</h3>
            
            <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
              {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCat(cat.id)}
                    className={`p-3 rounded-2xl flex items-center gap-3 transition-all border ${
                      selectedCat === cat.id 
                        ? "bg-altverse/20 border-altverse shadow-[0_0_15px_rgba(16,185,129,0.3)] text-foreground" 
                        : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                    }`}
                  >
                    <span className="text-sm font-medium leading-tight text-left">{cat.label}</span>
                  </button>
                );
              })}
            </div>
            
            <form onSubmit={handleGenerate} className="relative z-10">
              <label className="block text-sm font-medium text-muted-foreground mb-2">The Divergence Point</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. What if Neo took the blue pill instead?"
                className="w-full h-32 bg-black/20 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-altverse/50 focus:ring-1 focus:ring-altverse/50 transition-all resize-none text-foreground mb-4"
              />
              <button
                type="submit"
                disabled={!prompt.trim() || !selectedCat || isGenerating}
                className="w-full py-4 rounded-xl bg-altverse text-white font-bold flex items-center justify-center gap-2 hover:bg-altverse/90 transition-colors disabled:opacity-50 disabled:hover:bg-altverse shadow-lg shadow-altverse/20"
              >
                {isGenerating ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Simulating Reality...</>
                ) : (
                  <><Sparkles className="w-5 h-5" /> Generate Timeline</>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: JSON Timeline Visualization */}
        <div className="xl:col-span-7">
          <div className="glass-card min-h-[600px] rounded-3xl border border-white/10 p-6 md:p-8 relative overflow-hidden">
            
            {!result && !isGenerating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground opacity-50">
                <GitBranch className="w-20 h-20 mb-4 text-altverse" />
                <p className="font-display text-2xl font-bold">Timeline Empty</p>
                <p>Initiate a divergence to see the cascade effect.</p>
              </div>
            )}
            
            {isGenerating && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="space-y-8 w-full opacity-70 relative z-10"
              >
                {/* Dynamic Loading Text Header */}
                <div className="flex flex-col items-center justify-center p-8 mb-4">
                  <div className="w-16 h-16 relative mb-6">
                    <div className="absolute inset-0 border-t-2 border-altverse rounded-full animate-spin" />
                    <div className="absolute inset-2 border-r-2 border-teal-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                  </div>
                  <motion.h3 
                    key={loadingText}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl font-display font-bold text-altverse mb-2 text-center"
                  >
                    {loadingText}
                  </motion.h3>
                </div>

                {/* Shimmering Skeleton Cards */}
                <div className="animate-pulse space-y-8">
                  {/* Summary Skeleton */}
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-6 h-48">
                    <div className="h-6 w-48 bg-white/10 rounded-md mb-6"></div>
                    <div className="h-4 w-full bg-white/5 rounded-md mb-2"></div>
                    <div className="h-4 w-3/4 bg-white/5 rounded-md mb-8"></div>
                    <div className="h-16 w-full bg-black/20 rounded-xl"></div>
                  </div>

                  {/* Timeline Skeleton */}
                  <div className="pl-4 border-l-2 border-white/10 ml-4 py-2 space-y-8">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className="relative">
                        <div className="absolute -left-[27px] top-4 w-4 h-4 rounded-full bg-white/10" />
                        <div className="glass p-5 rounded-2xl border border-white/5 ml-6 h-32 bg-white/5"></div>
                      </div>
                    ))}
                  </div>

                  {/* Footer Skeleton */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className="bg-white/5 border border-white/5 rounded-xl h-24"></div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {result && !isGenerating && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 space-y-8"
              >
                {/* Header: Summary & Butterfly Effect */}
                <div className="bg-altverse/10 border border-altverse/30 rounded-2xl p-6">
                  <h2 className="text-2xl font-display font-bold text-white mb-2">Scenario Summary</h2>
                  <p className="text-foreground/80 mb-6">{result.scenario_summary}</p>
                  
                  <div className="flex items-start gap-3 bg-black/30 p-4 rounded-xl border border-white/5">
                    <Zap className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-mono text-yellow-400 uppercase tracking-wider font-bold mb-1">Butterfly Effect Trigger</h4>
                      <p className="text-sm text-foreground/90">{result.butterfly_effect_trigger}</p>
                    </div>
                  </div>
                </div>

                {/* Timeline Nodes */}
                <div className="pl-4 border-l-2 border-altverse/30 ml-4 py-2 space-y-8">
                  {result.detailed_history.map((event: any, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="relative"
                    >
                      <div className="absolute -left-[27px] top-4 w-4 h-4 rounded-full bg-background border-2 border-altverse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                      
                      <div className="glass p-5 rounded-2xl border border-white/10 ml-6 hover:border-altverse/50 transition-colors">
                        <div className="text-xs font-mono text-altverse mb-1 font-bold uppercase tracking-wider">
                          {event.year_or_era}
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">{event.event_title}</h4>
                        <p className="text-foreground/80 text-sm leading-relaxed">
                          {event.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Footer: World Status Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  {Object.entries(result.world_status_comparison).map(([key, value]) => (
                    <div key={key} className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <h4 className="text-xs font-mono text-altverse uppercase tracking-wider font-bold mb-2 flex items-center gap-2">
                        {key === 'Primary Consequence' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                        {key}
                      </h4>
                      <p className="text-sm text-foreground/70">{String(value)}</p>
                    </div>
                  ))}
                </div>

              </motion.div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}