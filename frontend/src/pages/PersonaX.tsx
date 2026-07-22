import { useState, useEffect } from "react";
import { PageTransition } from "@/components/layout/PageTransition";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, ArrowRight, ShieldAlert, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

const QUESTIONS = [
  { id: "q1", text: "What keeps you motivated when faced with overwhelming odds?" },
  { id: "q2", text: "What is your biggest fear?" },
  { id: "q3", text: "How do you deal with failure?" },
  { id: "q4", text: "How do you resolve conflicts?" },
  { id: "q5", text: "How do you adapt to new situations?" },
];

export default function PersonaX() {
  const [step, setStep] = useState(0); 
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentInput, setCurrentInput] = useState("");
  const [result, setResult] = useState<any>(null);
  
  // State for dynamic loading text
  const [loadingText, setLoadingText] = useState("Initializing neural mapping...");

  // Effect to cycle through analytical phrases during the loading step (step 6)
  useEffect(() => {
    if (step !== 6) return;
    
    const phrases = [
      "Initializing neural mapping...",
      "Analyzing semantic response patterns...",
      "Evaluating Big Five dimensional traits...",
      "Synthesizing psychological archetype...",
      "Mapping conflict resolution vectors...",
      "Finalizing Persona architecture..."
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % phrases.length;
      setLoadingText(phrases[i]);
    }, 2500); // Changes text every 2.5 seconds
    
    return () => clearInterval(interval);
  }, [step]);

  const handleNext = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentInput.trim()) return;
    
    const qId = QUESTIONS[step - 1].id;
    const newAnswers = { ...answers, [qId]: currentInput };
    
    setAnswers(newAnswers);
    setCurrentInput("");
    
    if (step < QUESTIONS.length) {
      setStep(step + 1);
    } else {
      submitAssessment(newAnswers);
    }
  };

  const submitAssessment = async (finalAnswers: Record<string, string>) => {
    setStep(6); // Loading state
    try {
      const BASE = import.meta.env.BASE_URL;
      
      // Match the exact Pydantic schema required by ai_engine.py
      const payload = {
        q1: finalAnswers.q1,
        q2: finalAnswers.q2,
        q3: finalAnswers.q3,
        q4: finalAnswers.q4,
        q5: finalAnswers.q5
      };

      // Await standard JSON response
      const analyzeRes = await fetch(`${BASE}api/persona/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!analyzeRes.ok) throw new Error("Failed to fetch analysis");
      
      const parsedData = await analyzeRes.json();
      setResult(parsedData);
      setStep(7);
      
    } catch (err) {
      console.error(err);
      alert("Failed to connect to backend. Check your console!");
      setStep(1); // Go back to start on error
    }
  };

  return (
    <PageTransition className="flex items-center justify-center min-h-[calc(100dvh-4rem)]">
      <div className="max-w-4xl w-full mx-auto relative">
        
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-2xl bg-personax/10 blur-[100px] rounded-full pointer-events-none z-0" />

        <div className="relative z-10">
          <AnimatePresence mode="wait">
            
            {/* INTRO STEP */}
            {step === 0 && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="text-center flex flex-col items-center p-8"
              >
                <div className="w-24 h-24 rounded-full bg-personax/20 flex items-center justify-center mb-8 border border-personax/30 shadow-[0_0_50px_rgba(244,63,94,0.3)]">
                  <Brain className="w-12 h-12 text-personax" />
                </div>
                <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-personax to-pink-400">
                  PersonaX
                </h1>
                <p className="text-xl text-muted-foreground max-w-xl mb-12">
                  A deep psychological mapping of your inner architecture. Answer instinctively. Do not overthink.
                </p>
                <button
                  onClick={() => setStep(1)}
                  className="group relative px-8 py-4 rounded-full bg-personax text-white font-bold text-lg overflow-hidden shadow-[0_0_30px_rgba(244,63,94,0.4)] transition-transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                  <span className="relative flex items-center gap-2">
                    Begin Assessment <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </motion.div>
            )}

            {/* QUESTION STEPS */}
            {step > 0 && step <= QUESTIONS.length && (
              <motion.div
                key={`q-${step}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="w-full max-w-2xl mx-auto"
              >
                {/* Progress bar */}
                <div className="flex gap-2 mb-12">
                  {QUESTIONS.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                        i < step ? 'bg-personax shadow-[0_0_10px_rgba(244,63,94,0.8)]' : 'bg-white/10'
                      }`} 
                    />
                  ))}
                </div>

                <div className="glass-card p-8 md:p-12 rounded-[2.5rem] border border-personax/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <span className="text-9xl font-display font-bold">0{step}</span>
                  </div>
                  
                  <h2 className="text-3xl font-display font-medium mb-8 relative z-10 leading-tight">
                    {QUESTIONS[step - 1].text}
                  </h2>
                  
                  {/* Typed Input Area */}
                  <form onSubmit={handleNext} className="relative z-10 flex flex-col gap-4">
                    <textarea
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full h-32 p-4 rounded-2xl bg-white/5 border border-white/10 focus:border-personax/50 focus:ring-1 focus:ring-personax/50 outline-none text-lg resize-none transition-all placeholder:text-white/20"
                      autoFocus
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!currentInput.trim()}
                        className="px-6 py-3 rounded-xl bg-personax text-white font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-personax/90 transition-colors"
                      >
                        {step === QUESTIONS.length ? "Analyze Psyche" : "Next Question"} 
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {/* LOADING STEP */}
            {step === 6 && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full opacity-70"
              >
                {/* Dynamic Loading Text Header */}
                <div className="flex flex-col items-center justify-center p-8 mb-4">
                  <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 rounded-full border-t-2 border-personax animate-spin" />
                    <div className="absolute inset-2 rounded-full border-r-2 border-pink-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Brain className="w-8 h-8 text-personax animate-pulse" />
                    </div>
                  </div>
                  <motion.h3 
                    key={loadingText}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl font-display font-bold text-personax mb-2 text-center"
                  >
                    {loadingText}
                  </motion.h3>
                </div>

                {/* Shimmering Skeleton Cards (Mimics Results Layout) */}
                <div className="w-full glass-card p-6 md:p-10 rounded-[3rem] border border-white/5 bg-white/5 animate-pulse">
                  <div className="h-4 w-48 bg-white/10 rounded mb-8"></div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Left Column Skeleton (Archetype & Lists) */}
                    <div>
                      <div className="h-12 w-3/4 bg-white/10 rounded-xl mb-4"></div>
                      <div className="h-6 w-1/2 bg-white/5 rounded-md mb-8 border-b border-white/10 pb-4"></div>
                      
                      <div className="space-y-6">
                        <div>
                          <div className="h-4 w-32 bg-white/10 rounded mb-4"></div>
                          <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                              <div key={`s-${i}`} className="flex gap-3 items-center">
                                <div className="w-5 h-5 rounded-full bg-white/10 shrink-0"></div>
                                <div className="h-4 w-full bg-white/5 rounded"></div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="h-4 w-32 bg-white/10 rounded mb-4"></div>
                          <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                              <div key={`w-${i}`} className="flex gap-3 items-center">
                                <div className="w-5 h-5 rounded-full bg-white/10 shrink-0"></div>
                                <div className="h-4 w-full bg-white/5 rounded"></div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Column Skeleton (Big Five) */}
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5 h-full flex flex-col justify-center">
                      <div className="h-6 w-3/4 bg-white/10 rounded mx-auto mb-8"></div>
                      <div className="space-y-6">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={`bf-${i}`}>
                            <div className="h-3 w-24 bg-white/10 rounded mb-2"></div>
                            <div className="h-4 w-full bg-white/5 rounded"></div>
                            <div className="h-4 w-5/6 bg-white/5 rounded mt-1"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* RESULTS STEP */}
            {step === 7 && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full glass-card p-6 md:p-10 rounded-[3rem] border border-personax/30 shadow-[0_0_50px_rgba(244,63,94,0.15)]"
              >
                <div className="flex items-center gap-2 text-personax font-mono text-sm tracking-widest uppercase mb-8">
                  <ShieldAlert className="w-4 h-4" /> Assessment Complete
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Left Column: Archetype, Strengths, Weaknesses */}
                  <div>
                    <h2 className="text-5xl font-display font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-br from-white to-personax">
                      {result.personality_archetype}
                    </h2>
                    <p className="text-xl text-muted-foreground mb-8 border-b border-white/10 pb-4">
                      Career Match: <span className="text-white">{result.suggested_career}</span>
                    </p>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-mono text-personax uppercase tracking-wider mb-3">Core Strengths</h4>
                        <div className="space-y-2">
                          {result.strengths.map((trait: string, i: number) => (
                            <div key={`s-${i}`} className="flex items-center gap-3">
                              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                              <span className="font-medium text-foreground/90">{trait}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-mono text-pink-400 uppercase tracking-wider mb-3">Growth Areas</h4>
                        <div className="space-y-2">
                          {result.weaknesses.map((trait: string, i: number) => (
                            <div key={`w-${i}`} className="flex items-center gap-3">
                              <AlertCircle className="w-5 h-5 text-pink-400 shrink-0" />
                              <span className="font-medium text-foreground/90">{trait}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column: Big Five Breakdown */}
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/10 h-full flex flex-col justify-center">
                    <h3 className="text-lg font-display font-bold mb-6 text-center border-b border-white/10 pb-4">The Big Five Architecture</h3>
                    <div className="space-y-4">
                      {Object.entries(result.big_five_breakdown).map(([trait, description]) => (
                        <div key={trait}>
                          <span className="text-xs font-mono text-personax uppercase tracking-widest">{trait}</span>
                          <p className="text-sm text-foreground/80 mt-1">{String(description)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-12 flex justify-center border-t border-white/10 pt-8">
                  <button
                    onClick={() => { setStep(0); setAnswers({}); setCurrentInput(""); }}
                    className="flex items-center gap-2 text-muted-foreground hover:text-personax transition-colors font-medium"
                  >
                    <Sparkles className="w-4 h-4" /> Restart Assessment
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}