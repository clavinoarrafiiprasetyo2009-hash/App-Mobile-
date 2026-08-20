import React from 'react';
import { Home, MessageSquare, Plus, User, ShieldCheck } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab, currentUser, unreadCount }) {
  const isGuru = currentUser?.role === 'guru';

  return (
    <div className="bottom-nav">
      {isGuru ? (
        /* GURU / ADMIN BOTTOM NAV: 5 Centered Balanced Tabs with (+) in the Middle */
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
              width: '40px',
              height: '40px',
              borderRadius: '14px',
              background: activeTab === 'report-form' ? '#1d4ed8' : '#2563eb',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
              transition: 'all 0.15s'
            }}>
              <Plus size={24} strokeWidth={2.5} />
            </div>
            <span style={{ marginTop: '2px' }}>Lapor</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
            style={{ position: 'relative' }}
          >
            <MessageSquare size={22} />
            <span>Pesan</span>
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '12px',
                background: '#ef4444',
                color: 'white',
                fontSize: '10px',
                fontWeight: 800,
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {unreadCount}
              </span>
            )}
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
        /* SISWA BOTTOM NAV: 3 Left Tabs + Extra Large Floating Right (+) Lapor Button */
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
              className={`nav-item ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
              style={{ position: 'relative' }}
            >
              <MessageSquare size={22} />
              <span>Pesan</span>
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '2px',
                  right: '12px',
                  background: '#ef4444',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 800,
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

            <button 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={22} />
              <span>Profil</span>
            </button>
          </div>

          {/* Floating Right (+) Lapor Button for Siswa */}
          <button 
            onClick={() => setActiveTab('report-form')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              borderRadius: '22px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: 'white',
              border: 'none',
              boxShadow: '0 8px 25px rgba(37, 99, 235, 0.5)',
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
      )}
    </div>
  );
}
