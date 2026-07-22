"use client";

import React, { useEffect, useState } from 'react';
import { Trophy, Coins, Flame, Award, Users, Gift, ArrowLeft, CheckCircle, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function RewardsPage() {
  const [stats, setStats] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimMessage, setClaimMessage] = useState("");

  const userId = 1; // टेस्टिंगसाठी डमी User ID 1 वापरत आहोत

  // युजरचा Gamification डेटा आणि Leaderboard मिळवणे
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. User Stats fetch करणे
      const statsRes = await fetch(`http://localhost:5000/api/gamification/user-stats/${userId}`);
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats);
      }

      // 2. Leaderboard fetch करणे
      const leadRes = await fetch('http://localhost:5000/api/gamification/leaderboard');
      const leadData = await leadRes.json();
      if (leadData.success) {
        setLeaderboard(leadData.leaderboard);
      }
    } catch (err) {
      console.error("डेटा लोड करताना एरर:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Daily Reward Claim करणे
  const handleClaimDaily = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/gamification/claim-daily-reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      setClaimMessage(data.message);
      if (data.success) {
        fetchData(); // रिवॉर्ड मिळाल्यावर स्क्रीन रिफ्रेश करणे
      }
    } catch (err) {
      console.error("Daily reward error:", err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b0f19', color: '#ffffff', fontFamily: 'sans-serif', padding: '24px' }}>
      
      {/* HEADER */}
      <header style={{ maxWidth: '1000px', margin: '0 auto 32px auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(17, 24, 39, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '16px 24px', borderRadius: '16px' }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
          <ArrowLeft style={{ width: '16px', height: '16px' }} /> मुख्य पानावर जा
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontWeight: 700, backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '6px 14px', borderRadius: '9999px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <Coins style={{ width: '18px', height: '18px' }} /> {stats?.coins || 0} कॉइन्स
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontWeight: 700, backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '6px 14px', borderRadius: '9999px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <Flame style={{ width: '18px', height: '18px' }} /> {stats?.streak_days || 1} दिवस Streak
          </span>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* TOP STATS CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: 'rgba(17, 24, 39, 0.5)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Trophy style={{ width: '40px', height: '40px', color: '#3b82f6' }} />
            <div>
              <div style={{ fontSize: '13px', color: '#9ca3af' }}>सध्याची Level</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#f3f4f6' }}>Level {stats?.level || 1}</div>
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(17, 24, 39, 0.5)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Award style={{ width: '40px', height: '40px', color: '#10b981' }} />
            <div>
              <div style={{ fontSize: '13px', color: '#9ca3af' }}>एकूण XP</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#f3f4f6' }}>{stats?.xp || 0} XP</div>
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(17, 24, 39, 0.5)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Share2 style={{ width: '40px', height: '40px', color: '#8b5cf6' }} />
            <div>
              <div style={{ fontSize: '13px', color: '#9ca3af' }}>तुमचा Referral Code</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#a78bfa' }}>{stats?.referral_code || '---'}</div>
            </div>
          </div>
        </div>

        {/* DAILY REWARD SECTION */}
        <div style={{ backgroundColor: 'linear-gradient(90deg, rgba(37,99,235,0.2) 0%, rgba(147,51,234,0.2) 100%)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '24px', padding: '28px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Gift style={{ color: '#ec4899' }} /> Daily Login Reward
            </h2>
            <p style={{ color: '#9ca3af', marginTop: '6px', fontSize: '14px' }}>
              दररोज ॲप उघडून ५० फ्री कॉइन्स आणि Streak वाढवा!
            </p>
            {claimMessage && <div style={{ color: '#34d399', fontWeight: 600, marginTop: '8px', fontSize: '14px' }}>{claimMessage}</div>}
          </div>

          <button onClick={handleClaimDaily} style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '14px 28px', borderRadius: '12px', fontWeight: 700, fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}>
            🎁 Claim 50 Coins
          </button>
        </div>

        {/* LEADERBOARD SECTION */}
        <div style={{ backgroundColor: 'rgba(17, 24, 39, 0.5)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '28px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f3f4f6', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users style={{ color: '#3b82f6' }} /> Top Rankers (Leaderboard)
          </h2>

          {loading ? (
            <div style={{ color: '#9ca3af', textAlign: 'center', padding: '20px' }}>लोड होत आहे... ⏳</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {leaderboard.map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: index === 0 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255, 255, 255, 0.02)', border: index === 0 ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(255, 255, 255, 0.05)', padding: '16px 20px', borderRadius: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: index === 0 ? '#f59e0b' : index === 1 ? '#94a3b8' : index === 2 ? '#b45309' : '#6b7280', width: '24px' }}>
                      #{index + 1}
                    </span>
                    <div>
                      <div style={{ fontWeight: 600, color: '#f3f4f6' }}>User ID: {item.user_id}</div>
                      <div style={{ fontSize: '12px', color: '#9ca3af' }}>Level {item.level}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span style={{ color: '#34d399', fontWeight: 600, fontSize: '14px' }}>{item.xp} XP</span>
                    <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '14px' }}>{item.coins} Coins</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

    </div>
  );
}