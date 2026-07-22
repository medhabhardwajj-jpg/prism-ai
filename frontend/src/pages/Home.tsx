import { PageTransition } from "@/components/layout/PageTransition";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Mic, Brain, Sparkles, Navigation, ArrowRight } from "lucide-react";

const MODULES = [
  {
    id: "voice",
    title: "Voice of Legends",
    description: "Converse with history's greatest minds and contemporary icons.",
    href: "/voice",
    icon: Mic,
    color: "from-purple-500 to-violet-600",
    shadow: "rgba(139,92,246,0.2)",
    accent: "text-voice",
    bgAccent: "bg-voice/10"
  },
  {
    id: "personax",
    title: "PersonaX",
    description: "Deep psychological assessment mapping your inner architecture.",
    href: "/personax",
    icon: Brain,
    color: "from-rose-500 to-pink-600",
    shadow: "rgba(244,63,94,0.2)",
    accent: "text-personax",
    bgAccent: "bg-personax/10"
  },
  {
    id: "altverse",
    title: "AltVerse",
    description: "Generate and explore infinite alternate reality scenarios.",
    href: "/altverse",
    icon: Navigation,
    color: "from-emerald-500 to-teal-600",
    shadow: "rgba(16,185,129,0.2)",
    accent: "text-altverse",
    bgAccent: "bg-altverse/10"
  },
  {
    id: "dream",
    title: "Dream Architect",
    description: "Predictive life planning and future probability modeling.",
    href: "/dream",
    icon: Sparkles,
    color: "from-amber-500 to-red-500",
    shadow: "rgba(245,158,11,0.2)",
    accent: "text-dream",
    bgAccent: "bg-dream/10"
  }
];

export default function Home() {
  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto flex flex-col gap-16 pb-20">
        
        {/* Hero Section */}
        <section className="relative flex flex-col items-center text-center pt-10 md:pt-20">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
            className="relative w-32 h-32 md:w-48 md:h-48 mb-8"
          >
            {/* Animated Orb */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-prism via-blue-500 to-purple-500 blur-2xl opacity-40 animate-pulse" />
            <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-prism to-voice shadow-[0_0_40px_rgba(0,212,255,0.6)] animate-spin-slow mix-blend-screen" style={{ animationDuration: '8s' }} />
            <div className="absolute inset-4 rounded-full bg-gradient-to-bl from-prism to-voice shadow-[0_0_40px_rgba(0,212,255,0.6)] animate-spin-slow mix-blend-screen" style={{ animationDuration: '12s', animationDirection: 'reverse' }} />
            <div className="absolute inset-8 rounded-full bg-background z-10 flex items-center justify-center border border-white/20 backdrop-blur-xl">
              <Sparkles className="w-10 h-10 text-prism" />
            </div>
          </motion.div>

          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground to-foreground/50"
          >
            One Question.<br/>Infinite Possibilities.
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl font-light"
          >
            Welcome to PRISM AI. The quantum-era operating system designed to map your mind, rewrite realities, and consult the greatest voices in history.
          </motion.p>
        </section>

        {/* Modules Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {MODULES.map((mod, i) => (
            <motion.div
              key={mod.id}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
            >
              <Link href={mod.href}>
                <div className="group relative h-full p-8 rounded-3xl glass-card overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1"
                     style={{ boxShadow: `0 10px 40px -10px ${mod.shadow}` }}>
                  
                  {/* Hover gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${mod.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      <div className={`w-14 h-14 rounded-2xl ${mod.bgAccent} ${mod.accent} flex items-center justify-center mb-6 shadow-inner`}>
                        <mod.icon className="w-7 h-7" />
                      </div>
                      <h3 className="text-2xl font-display font-bold mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-foreground group-hover:to-foreground/50 transition-all">
                        {mod.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {mod.description}
                      </p>
                    </div>
                    
                    <div className="mt-8 flex items-center text-sm font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                      Enter Module <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </section>

      </div>
    </PageTransition>
  );
}
