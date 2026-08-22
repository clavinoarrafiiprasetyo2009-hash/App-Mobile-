import React from 'react';
import { Home, User, ShieldCheck, Gavel, Camera, ArrowLeft } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab, currentUser }) {
  const isGuru = currentUser?.role === 'guru';
  const isReportPage = activeTab === 'report-form';

  const handleLaporClick = () => {
    if (isReportPage) {
      // Jika sedang di halaman laporan, berfungsi sebagai tombol Kembali (Back) ke Beranda
      setActiveTab('home');
    } else {
      // Jika di halaman lain, buka form Laporan Baru
      setActiveTab('report-form');
    }
  };

  return (
    <>
      {/* Floating Circular Lapor Action Button (Toggle: Camera <-> Back Arrow) */}
      <button
        onClick={handleLaporClick}
        className="floating-fab lapor-floating-btn"
        title={isReportPage ? 'Kembali ke Beranda' : 'Buat Laporan Baru'}
        style={{
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          background: isReportPage 
            ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
            : 'linear-gradient(135deg, #a855f7, #7c3aed)',
          color: 'white',
          border: 'none',
          boxShadow: isReportPage
            ? '0 8px 24px rgba(239, 68, 68, 0.45), 0 0 0 3px #ffffff'
            : '0 8px 24px rgba(168, 85, 247, 0.45), 0 0 0 3px #ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.25s ease'
        }}
      >
        {isReportPage ? <ArrowLeft size={26} strokeWidth={2.5} /> : <Camera size={26} />}
      </button>

      {/* Bottom Navigation Bar */}
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

          {/* 2. Dashboard BK (Hanya untuk Guru / Admin) */}
          {isGuru && (
            <button 
              className={`nav-item ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
              style={{ flex: 1 }}
            >
              <ShieldCheck size={20} />
              <span>Dashboard</span>
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
