"use client";

import React, { useState } from 'react';
import { Trophy, BookOpen, Target, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

// ==========================================
// UI COMPONENTS (GlassCard, FloatingButton, Skeleton)
// ==========================================

export const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div style={{
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      borderRadius: '24px',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    }} className={className}>
      <div style={{
        position: 'absolute',
        top: '-48px',
        right: '-48px',
        width: '128px',
        height: '128px',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderRadius: '9999px',
        filter: 'blur(32px)',
        pointerEvents: 'none'
      }} />
      {children}
    </div>
  );
};

export const FloatingButton = ({ onClick, text = "सुरू करा" }: { onClick?: () => void; text?: string }) => {
  return (
    <button 
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: 'linear-gradient(90deg, #2563eb 0%, #06b6d4 100%)',
        color: '#ffffff',
        fontWeight: 700,
        padding: '16px 24px',
        borderRadius: '9999px',
        boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.5)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        cursor: 'pointer'
      }}
    >
      <Sparkles style={{ width: '20px', height: '20px', color: '#fde047' }} />
      <span>{text}</span>
      <ArrowRight style={{ width: '20px', height: '20px' }} />
    </button>
  );
};

export const LoadingSkeleton = () => {
  return (
    <div style={{
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '24px',
      padding: '24px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{ height: '24px', backgroundColor: 'rgba(30, 41, 59, 0.8)', borderRadius: '8px', width: '33%' }}></div>
      <div style={{ height: '16px', backgroundColor: 'rgba(30, 41, 59, 0.5)', borderRadius: '8px', width: '75%' }}></div>
      <div style={{ height: '80px', backgroundColor: 'rgba(30, 41, 59, 0.4)', borderRadius: '16px', width: '100%' }}></div>
    </div>
  );
};

// ==========================================
// MAIN DEMO PAGE
// ==========================================

export default function DesignDemoPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#080C14', color: '#f8fafc', padding: '32px', fontFamily: 'sans-serif', position: 'relative' }}>
      
      {/* HEADER */}
      <header style={{ maxWidth: '1152px', margin: '0 auto 48px auto', display: 'flex', justifyBetween: 'space-between', alignItems: 'center', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '24px', borderRadius: '24px', backdropFilter: 'blur(16px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '12px', backgroundColor: 'rgba(37, 99, 235, 0.2)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '16px', color: '#60a5fa' }}>
            <ShieldCheck style={{ width: '32px', height: '32px' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', margin: 0 }}>
              पोलीस भरती पोर्टल
            </h1>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Premium Dark Glassmorphism UI</p>
          </div>
        </div>

        <button 
          onClick={() => setLoading(!loading)}
          style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 600, borderRadius: '12px', backgroundColor: 'rgba(30, 41, 59, 0.8)', border: '1px solid #334155', color: '#ffffff', cursor: 'pointer' }}
        >
          {loading ? "लोडिंग बंद करा" : "Skeleton दाखवा"}
        </button>
      </header>

      {/* MAIN CONTAINER */}
      <main style={{ maxWidth: '1152px', margin: '0 auto' }}>
        
        {/* HERO SECTION */}
        <section style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '9999px', backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#60a5fa', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '16px' }}>
            ⚡ All-in-One Learning Portal
          </span>
          <h2 style={{ fontSize: '42px', fontWeight: 900, lineHeight: 1.2, margin: '12px 0' }}>
            तयारी करा <span style={{ color: '#3b82f6' }}>महाराष्ट्रातील</span> अव्वल भरती परीक्षांची
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '0 auto', fontSize: '15px' }}>
            उच्च दर्जाचे प्रश्न, रिअल-टाइम लीडरबोर्ड आणि स्पीड वाढवण्यासाठी आधुनिक स्टडी डॅशबोर्ड.
          </p>
        </section>

        {/* CARDS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {loading ? (
            <>
              <LoadingSkeleton />
              <LoadingSkeleton />
              <LoadingSkeleton />
            </>
          ) : (
            <>
              <GlassCard>
                <div style={{ padding: '12px', width: 'fit-content', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '16px', color: '#60a5fa', marginBottom: '16px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                  <BookOpen style={{ width: '24px', height: '24px' }} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>सराव प्रश्नपत्रिका</h3>
                <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '16px' }}>
                  मागील वर्षांच्या सर्व जिल्हा पोलीस भरती प्रश्नपत्रिका ऑनलाईन सोडवा.
                </p>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#60a5fa' }}>
                  अभ्यास सुरू करा →
                </span>
              </GlassCard>

              <GlassCard>
                <div style={{ padding: '12px', width: 'fit-content', backgroundColor: 'rgba(6, 182, 212, 0.1)', borderRadius: '16px', color: '#22d3ee', marginBottom: '16px', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                  <Target style={{ width: '24px', height: '24px' }} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>मॉक टेस्ट सीरिज</h3>
                <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '16px' }}>
                  वेळेचे नियोजन सुधारण्यासाठी रिअल-टाइम टायमरसह टेस्ट सोडवा.
                </p>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#22d3ee' }}>
                  टेस्ट सुरू करा →
                </span>
              </GlassCard>

              <GlassCard>
                <div style={{ padding: '12px', width: 'fit-content', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '16px', color: '#fbbf24', marginBottom: '16px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  <Trophy style={{ width: '24px', height: '24px' }} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>रँक आणि कॉइन्स</h3>
                <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '16px' }}>
                  कॉइन्स मिळवा, लेव्हल अप करा आणि रँकर्सच्या लीडरबोर्डवर टॉपला या.
                </p>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#fbbf24' }}>
                  लीडरबोर्ड पहा →
                </span>
              </GlassCard>
            </>
          )}
        </div>

      </main>

      {/* FLOATING BUTTON */}
      <FloatingButton text="सराव सुरु करा" onClick={() => alert("Floating Button Clicked!")} />

    </div>
  );
}