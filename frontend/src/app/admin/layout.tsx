'use client';

import React, { useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [activeMenu, setActiveMenu] = useState('Dashboard');

  const menuItems = [
    { name: '📊 Dashboard', id: 'dashboard' },
    { name: '👨‍🎓 Students', id: 'students' },
    { name: '❓ Questions', id: 'questions' },
    { name: '📚 Subjects', id: 'subjects' },
    { name: '📍 Districts', id: 'districts' },
    { name: '📅 Years', id: 'years' },
    { name: '📰 Current Affairs', id: 'current_affairs' },
    { name: '📝 Mock Tests', id: 'mock_tests' },
    { name: '💳 Payments', id: 'payments' },
    { name: '🎟️ Coupons', id: 'coupons' },
    { name: '🏆 Leaderboard', id: 'leaderboard' },
    { name: '⚙️ Roles & Users', id: 'users' },
    { name: '🔔 Notification', id: 'notifications' },
    { name: '📜 System Logs', id: 'logs' },
    { name: '💾 Backup & Restore', id: 'backup' }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f1f5f9' }}>
      
      {/* SIDEBAR */}
      <div style={{ width: '260px', backgroundColor: '#1e293b', color: 'white', padding: '20px 10px' }}>
        <h3 style={{ textAlign: 'center', color: '#38bdf8', marginBottom: '25px', fontSize: '20px' }}>👮‍♂️ Admin Panel</h3>
        <hr style={{ border: '0.5px solid #334155', marginBottom: '20px' }} />
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveMenu(item.name);
                // पुढे जाऊन आपण इथे window.location किंवा next/navigation वापरून पेज बदलू शकतो
              }}
              style={{
                padding: '12px 15px',
                textAlign: 'left',
                backgroundColor: activeMenu === item.name ? '#0284c7' : 'transparent',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeMenu === item.name ? 'bold' : 'normal',
                transition: '0.2s'
              }}
            >
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', backgroundColor: 'white', padding: '15px 20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ margin: 0, color: '#1e293b', fontSize: '22px' }}>{activeMenu}</h2>
          <div style={{ fontSize: '14px', color: '#64748b' }}>प्रशासक: <strong>Admin भाऊ</strong> 👑</div>
        </header>

        <main style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', minHeight: '70vh' }}>
          {children}
        </main>
      </div>

    </div>
  );
}