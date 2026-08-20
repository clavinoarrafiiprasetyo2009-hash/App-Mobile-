import React from 'react';
import { Home, Plus, User, ShieldCheck } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab, currentUser }) {
  const isGuru = currentUser?.role === 'guru';

  return (
    <div className="bottom-nav" style={{ padding: '6px 12px' }}>
      {isGuru ? (
        /* GURU / ADMIN BOTTOM NAV: 4 Balanced Tabs with (+) in the Middle */
        <div style={{ display: 'flex', flex: 1, justifyContent: 'space-around', alignItems: 'center' }}>
          <button 
            className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <Home size={22} />
            <span>Beranda</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            <ShieldCheck size={22} />
            <span>Dashboard</span>
          </button>

          {/* Center (+) Button for Guru */}
          <button 
            className={`nav-item ${activeTab === 'report-form' ? 'active' : ''}`}
            onClick={() => setActiveTab('report-form')}
          >
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '16px',
              background: activeTab === 'report-form' ? '#1d4ed8' : '#2563eb',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
              transition: 'all 0.15s'
            }}>
              <Plus size={26} strokeWidth={2.8} />
            </div>
            <span style={{ marginTop: '2px', fontWeight: 700 }}>Lapor</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={22} />
            <span>Profil</span>
          </button>
        </div>
      ) : (
        /* SISWA BOTTOM NAV: 3 Balanced Centered Tabs with Large Glowing Center (+) Lapor Button */
        <div style={{ display: 'flex', flex: 1, justifyContent: 'space-around', alignItems: 'center' }}>
          {/* 1. Beranda (Left) */}
          <button 
            className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
            style={{ flex: 1 }}
          >
            <Home size={24} />
            <span>Beranda</span>
          </button>

          {/* 2. Large Enriched (+) Lapor Button (Center) */}
          <button 
            onClick={() => setActiveTab('report-form')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              flex: 1,
              marginTop: '-12px'
            }}
            title="Buat Laporan Baru"
          >
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(37, 99, 235, 0.45)',
              border: '3px solid #ffffff',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            className="lapor-floating-btn"
            >
              <Plus size={30} strokeWidth={3} />
            </div>
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              color: activeTab === 'report-form' ? '#2563eb' : '#64748b',
              marginTop: '4px',
              letterSpacing: '0.3px'
            }}>
              Lapor
            </span>
          </button>

          {/* 3. Profil (Right) */}
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
            style={{ flex: 1 }}
          >
            <User size={24} />
            <span>Profil</span>
          </button>
        </div>
      )}
    </div>
  );
}
