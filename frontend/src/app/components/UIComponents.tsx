"use client";

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

// १. Premium Rounded Glass Card Component
export const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`glass-panel glass-card-hover rounded-3xl p-6 relative overflow-hidden ${className}`}>
      {/* Soft Blue Background Glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
      {children}
    </div>
  );
};

// २. Floating Action Button Component
export const FloatingButton = ({ onClick, text = "सुरू करा" }: { onClick?: () => void; text?: string }) => {
  return (
    <button 
      onClick={onClick}
      className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold px-6 py-4 rounded-full shadow-floating hover:scale-105 active:scale-95 transition-all duration-300 animate-float border border-blue-400/30 backdrop-blur-md"
    >
      <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" style={{ animationDuration: '6s' }} />
      <span>{text}</span>
      <ArrowRight className="w-5 h-5" />
    </button>
  );
};

// ३. Loading Skeleton Component
export const LoadingSkeleton = () => {
  return (
    <div className="glass-panel rounded-3xl p-6 w-full space-y-4 animate-pulse">
      <div className="h-6 bg-slate-800/80 rounded-lg w-1/3"></div>
      <div className="h-4 bg-slate-800/50 rounded-lg w-3/4"></div>
      <div className="h-20 bg-slate-800/40 rounded-2xl w-full"></div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-8 bg-slate-800/60 rounded-full w-24"></div>
        <div className="h-8 bg-slate-800/60 rounded-full w-16"></div>
      </div>
    </div>
  );
};