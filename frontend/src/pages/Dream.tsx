import { PageTransition } from "@/components/layout/PageTransition";
import { motion } from "framer-motion";
import { Sparkles, Target, Clock, Compass, BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";

export default function Dream() {
  const [targetDream, setTargetDream] = useState("");
  const [currentStudy, setCurrentStudy] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  // State for our dynamic loading text
  const [loadingText, setLoadingText] = useState("Initializing PRISM engine...");

  // Effect to cycle through technical phrases while loading
  useEffect(() => {
    if (!isGenerating) return;
    
    const phrases = [
      "Initializing PRISM engine...",
      "Calculating probability vectors...",
      "Mapping temporal divergence...",
      "Synthesizing career trajectory...",
      "Allocating skill dependencies...",
      "Finalizing timeline architecture..."
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
    if (!targetDream || isGenerating) return;
    
    setIsGenerating(true);
    setResult(null);
    
    try {
      // Hardcoded absolute URL to hit the FastAPI backend directly on port 8000
      const res = await fetch(`http://localhost:8000/dream-architect/generate`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          current_study: currentStudy, 
          target_dream: targetDream 
        })
      });
      
      if (!res.ok) throw new Error("Failed to generate plan");
      
      const data = await res.json();
      setResult(data);
      
    } catch (err) {
      console.error(err);
      alert("Failed to compute path. Check your backend console!");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <PageTransition className="flex flex-col h-full overflow-y-auto pb-10">
      <div className="flex items-center gap-3 mb-8 shrink-0">
        <div className="w-12 h-12 rounded-2xl bg-dream/10 text-dream flex items-center justify-center">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-dream to-amber-300">
            Dream Architect
          </h1>
          <p className="text-muted-foreground">Predictive life planning and probability modeling.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form */}
        <div className="glass-card p-6 md:p-8 rounded-3xl border border-dream/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-dream/10 blur-3xl rounded-full pointer-events-none" />
          
          <h3 className="font-display font-bold text-xl mb-6 flex items-center gap-2 relative z-10">
            <Target className="text-dream w-5 h-5" /> Initialize Model
          </h3>
          
          <form onSubmit={handleGenerate} className="space-y-5 relative z-10">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Target Dream</label>
              <input
                type="text"
                value={targetDream}
                onChange={e => setTargetDream(e.target.value)}
                placeholder="e.g. AI Research Scientist"
                className="w-full h-12 bg-black/20 border border-white/10 rounded-xl px-4 focus:outline-none focus:border-dream/50 focus:ring-1 focus:ring-dream/50 transition-all text-foreground"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Current Study / Background</label>
              <textarea
                value={currentStudy}
                onChange={e => setCurrentStudy(e.target.value)}
                placeholder="e.g. Computer Science"
                className="w-full h-24 bg-black/20 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-dream/50 focus:ring-1 focus:ring-dream/50 transition-all resize-none text-foreground"
              />
            </div>
            
            <button
              type="submit"
              disabled={!targetDream || isGenerating}
              className="w-full py-4 mt-4 rounded-xl bg-gradient-to-r from-dream to-amber-500 text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
            >
              {isGenerating ? "Computing Path..." : "Architect Future"}
            </button>
          </form>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-2">
          {result && !isGenerating ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Top Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6 rounded-3xl border border-dream/30 bg-dream/5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-mono text-dream uppercase tracking-widest mb-1">Total Duration</p>
                    <h4 className="text-2xl font-display font-bold">{result.estimated_total_duration}</h4>
                  </div>
                  <BarChart3 className="w-12 h-12 text-dream opacity-50" />
                </div>
                
                <div className="glass-card p-6 rounded-3xl border border-white/10 flex flex-col justify-center">
                  <p className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-1">Target Trajectory</p>
                  <h4 className="text-lg font-display font-bold leading-tight">{result.target_dream}</h4>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="glass-card p-6 rounded-3xl border border-white/10 bg-white/5">
                <h4 className="text-xs font-mono text-dream uppercase tracking-wider mb-2 font-bold">Executive Summary</h4>
                <p className="text-foreground/90 text-sm leading-relaxed">{result.executive_summary}</p>
              </div>
              
              {/* Detailed Roadmap Steps */}
              <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/10">
                <h3 className="font-display font-bold text-2xl mb-8 flex items-center gap-3">
                  <Compass className="text-dream" /> Detailed Roadmap
                </h3>
                
                <div className="space-y-6">
                  {(result.detailed_roadmap || []).map((m: any, i: number) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-4 group"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-dream/20 text-dream flex items-center justify-center font-bold font-mono text-sm border border-dream/30 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                          {m.phase}
                        </div>
                        {i !== result.detailed_roadmap.length - 1 && (
                          <div className="w-0.5 h-full bg-white/10 my-2" />
                        )}
                      </div>
                      
                      <div className="glass p-5 rounded-2xl border border-white/5 flex-1 mb-4 group-hover:bg-white/5 hover:border-dream/30 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-dream">{m.focus_area}</span>
                          <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {m.estimated_time}
                          </span>
                        </div>
                        <h4 className="text-xl font-display font-bold mb-3 text-foreground/90">{m.title}</h4>
                        
                        <div className="mb-3">
                          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider block mb-1">Skills to Master:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {m.skills_to_master?.map((skill: string, idx: number) => (
                              <span key={idx} className="text-xs bg-dream/10 text-dream px-2.5 py-1 rounded-lg border border-dream/20 font-medium">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {m.recommended_resources?.length > 0 && (
                          <div>
                            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider block mb-1">Resources:</span>
                            <div className="flex flex-wrap gap-2">
                              {m.recommended_resources.map((res: any, idx: number) => (
                                <span key={idx} className="text-xs bg-white/5 text-foreground/80 px-2 py-1 rounded-md border border-white/10">
                                  📖 {res.name} <span className="opacity-50 text-[10px]">({res.resource_type})</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : isGenerating ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="space-y-6 w-full opacity-70"
            >
              {/* Dynamic Loading Text Header */}
              <div className="flex flex-col items-center justify-center p-8 mb-4">
                  <div className="w-16 h-16 relative mb-6">
                    <div className="absolute inset-0 border-t-2 border-dream rounded-full animate-spin" />
                    <div className="absolute inset-2 border-r-2 border-amber-300 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                  </div>
                  <motion.h3 
                    key={loadingText}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl font-display font-bold text-dream mb-2 text-center"
                  >
                    {loadingText}
                  </motion.h3>
              </div>

              {/* Shimmering Skeleton Cards */}
              <div className="animate-pulse space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-card rounded-3xl h-24 bg-white/5 border border-white/5"></div>
                  <div className="glass-card rounded-3xl h-24 bg-white/5 border border-white/5"></div>
                </div>
                
                <div className="glass-card rounded-3xl h-32 bg-white/5 border border-white/5"></div>
                
                <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 bg-white/5">
                  <div className="h-8 w-48 bg-white/10 rounded-xl mb-8"></div>
                  
                  <div className="space-y-6">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/10 shrink-0"></div>
                        <div className="glass p-5 rounded-2xl flex-1 h-32 bg-white/5 border border-white/5"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full min-h-[400px] glass-card rounded-3xl border border-white/5 flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <Compass className="w-16 h-16 mb-4 opacity-20" />
              <h3 className="text-2xl font-display font-bold text-foreground/50 mb-2">Awaiting Parameters</h3>
              <p className="max-w-md">Input your current background and target dream to generate your custom AI roadmap.</p>
              
              <div className="mt-12 flex gap-8 opacity-50 justify-center">
                <div className="text-center">
                  <div className="text-3xl font-display font-bold">1,024</div>
                  <div className="text-xs uppercase tracking-widest mt-1">Simulations Run</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}