"use client";

import React, { useEffect, useState } from 'react';
import { BookOpen, Target, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function RevisionPage() {
  const [plan, setPlan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // बॅकएंडवरून रिव्हिजन प्लॅन लोड करणे
  const fetchRevisionPlan = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/generate-revision-plan');
      const data = await res.json();
      if (data.success) {
        setPlan(data.revisionPlan);
      }
    } catch (err) {
      console.error("रिव्हिजन प्लॅन लोड करताना त्रुटी:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevisionPlan();
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b0f19', color: '#ffffff', fontFamily: 'sans-serif', padding: '24px' }}>
      
      {/* HEADER */}
      <header style={{ maxWidth: '900px', margin: '0 auto 32px auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(17, 24, 39, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '16px 24px', borderRadius: '16px' }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
          <ArrowLeft style={{ width: '16px', height: '16px' }} /> मुख्य पानावर जा
        </Link>
        <button onClick={fetchRevisionPlan} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#60a5fa', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
          <RefreshCw style={{ width: '16px', height: '16px' }} /> प्लॅन रिफ्रेश करा
        </button>
      </header>

      {/* MAIN CONTAINER */}
      <main style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Target style={{ color: '#3b82f6', width: '32px', height: '32px' }} /> स्मार्ट रिव्हिजन AI (Revision Plan)
          </h1>
          <p style={{ color: '#9ca3af', marginTop: '8px', fontSize: '15px' }}>
            तुमच्या आधीच्या चाचण्यांमधील चुकांचे विश्लेषण करून AI ने हा विशेष अभ्यासाचा प्लॅन तयार केला आहे.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#9ca3af' }}>
            तुमचा पर्सनलाइज्ड प्लॅन लोड होत आहे... ⏳
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {plan.map((item, index) => (
              <div 
                key={index} 
                style={{ 
                  backgroundColor: 'rgba(17, 24, 39, 0.5)', 
                  border: '1px solid rgba(255, 255, 255, 0.08)', 
                  borderRadius: '16px', 
                  padding: '24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ backgroundColor: '#2563eb', color: '#ffffff', fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '9999px' }}>
                      {item.day}
                    </span>
                    <span style={{ color: '#60a5fa', fontWeight: 600, fontSize: '14px' }}>
                      {item.subject}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#f3f4f6', marginBottom: '6px' }}>
                    {item.topic}
                  </h3>
                  <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                    {item.action}
                  </p>
                </div>

                <div style={{ textAlign: 'right', minWidth: '130px' }}>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#34d399' }}>
                    {item.targetQuestions || 10} प्रश्न
                  </div>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>सरावाचे उद्दिष्ट</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

    </div>
  );
}