import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, X, Home, Mic, Brain, Sparkles, Navigation } from "lucide-react";

export function TopNav({ onMenuToggle }: { onMenuToggle: () => void }) {
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-border/40">
      <div className="flex h-16 items-center px-4 md:px-6 gap-4">
        <button
          onClick={onMenuToggle}
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors text-foreground"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex-1 flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 mr-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-prism to-voice flex items-center justify-center shadow-[0_0_15px_rgba(0,212,255,0.4)]">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-prism to-voice">
              PRISM
            </span>
          </div>
          {/* Search bar removed from here */}
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile search toggle removed from here */}
          
          <ThemeToggle />
          
          {/* OP Button removed from here */}
        </div>
      </div>
    </header>
  );
}

const NAV_ITEMS = [
  { href: "/", label: "Prism Core", icon: Home, color: "var(--color-prism)", shadow: "rgba(0,212,255,0.5)" },
  { href: "/voice", label: "Voice of Legends", icon: Mic, color: "var(--color-voice)", shadow: "rgba(139,92,246,0.5)" },
  { href: "/personax", label: "PersonaX", icon: Brain, color: "var(--color-personax)", shadow: "rgba(244,63,94,0.5)" },
  { href: "/altverse", label: "AltVerse", icon: Navigation, color: "var(--color-altverse)", shadow: "rgba(16,185,129,0.5)" },
  { href: "/dream", label: "Dream Architect", icon: Sparkles, color: "var(--color-dream)", shadow: "rgba(245,158,11,0.5)" },
];

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [location] = useLocation();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      <motion.aside
        className={`fixed md:sticky top-0 left-0 z-50 h-dvh w-72 glass-card border-r border-white/10 flex flex-col pt-16 md:pt-0 transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:hidden flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex-1 overflow-y-auto py-8 px-4 flex flex-col gap-2">
          <div className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-4 px-4">
            Modules
          </div>

          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href;
            
            return (
              <Link key={item.href} href={item.href}>
                <div
                  onClick={() => {
                    if (window.innerWidth < 768) onClose();
                  }}
                  className={`group relative flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300 ${
                    isActive ? "bg-white/10" : "hover:bg-white/5"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-indicator"
                      className="absolute left-0 w-1 h-8 rounded-r-full"
                      style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.shadow}` }}
                    />
                  )}
                  
                  <div
                    className={`p-2 rounded-xl transition-all duration-300 ${
                      isActive ? "bg-white/10" : "bg-transparent group-hover:bg-white/5"
                    }`}
                    style={isActive ? { color: item.color, boxShadow: `inset 0 0 20px ${item.shadow}` } : { color: 'var(--color-muted-foreground)' }}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  
                  <span className={`font-medium transition-colors ${isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
        
        <div className="p-6 border-t border-white/10">
          <div className="glass p-4 rounded-2xl flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-mono">SYSTEM</span>
              <span className="text-sm font-bold text-prism">ONLINE</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-prism shadow-[0_0_10px_rgba(0,212,255,1)] animate-pulse" />
          </div>
        </div>
      </motion.aside>
    </>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] flex bg-background text-foreground overflow-hidden selection:bg-prism/30">
      {/* Background ambient elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-prism/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-voice/10 blur-[120px]" />
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0 z-10 relative">
        <TopNav onMenuToggle={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}