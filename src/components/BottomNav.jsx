import React from 'react';
import { Home, Plus, User, ShieldCheck } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab, currentUser }) {
  const isGuru = currentUser?.role === 'guru';

  return (
    <div className="bottom-nav" style={{ padding: '6px 12px' }}>
      {isGuru ? (
        /* GURU / ADMIN BOTTOM NAV: 3 Left Tabs + Enriched Floating Right (+) Lapor Button */
        <>
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

            <button 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={22} />
              <span>Profil</span>
            </button>
          </div>

          {/* Floating Right (+) Lapor Button for Guru / Admin */}
          <button 
            onClick={() => setActiveTab('report-form')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              borderRadius: '22px',
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              color: 'white',
              border: 'none',
              boxShadow: '0 8px 25px rgba(124, 58, 237, 0.45)',
              cursor: 'pointer',
              flexShrink: 0,
              marginLeft: '6px',
              marginRight: '4px',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}
            className="lapor-floating-btn"
            title="Buat Laporan Baru"
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Plus size={22} strokeWidth={3} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '0.4px' }}>Lapor</span>
          </button>
        </>
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
