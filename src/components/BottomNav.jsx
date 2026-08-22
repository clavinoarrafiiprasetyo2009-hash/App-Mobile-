import React from 'react';
import { Home, Folder, LayoutGrid, User, ShieldCheck, Gavel, Camera } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab, currentUser }) {
  const isGuru = currentUser?.role === 'guru';

  return (
    <>
      {/* Floating Circular Lapor Camera Action Button (Bottom Right Corner ala Canva) */}
      <button
        onClick={() => setActiveTab('report-form')}
        className="floating-fab lapor-floating-btn"
        title="Buat Laporan Baru"
        style={{
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
          color: 'white',
          border: 'none',
          boxShadow: '0 8px 24px rgba(168, 85, 247, 0.5), 0 0 0 3px #ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
      >
        <Camera size={26} />
      </button>

      {/* Canva Style 4-Tab Bottom Navigation Bar */}
      <div className="bottom-nav" style={{ padding: '4px 8px' }}>
        <div style={{ display: 'flex', flex: 1, justifyContent: 'space-around', alignItems: 'center' }}>
          {/* 1. Beranda */}
          <button 
            className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
            style={{ flex: 1 }}
          >
            <Home size={20} />
            <span>Beranda</span>
          </button>

          {/* 2. Dashboard (Guru) atau Laporan Saya (Siswa) */}
          {isGuru ? (
            <button 
              className={`nav-item ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
              style={{ flex: 1 }}
            >
              <ShieldCheck size={20} />
              <span>Dashboard</span>
            </button>
          ) : (
            <button 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
              style={{ flex: 1 }}
            >
              <Folder size={20} />
              <span>Laporan Anda</span>
            </button>
          )}

          {/* 3. Lelang */}
          <button 
            className={`nav-item ${activeTab === 'auction' ? 'active' : ''}`}
            onClick={() => setActiveTab('auction')}
            style={{ flex: 1 }}
          >
            <Gavel size={20} />
            <span>Lelang</span>
          </button>

          {/* 4. Profil */}
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
            style={{ flex: 1 }}
          >
            <User size={20} />
            <span>Profil</span>
          </button>
        </div>
      </div>
    </>
  );
}
