import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Smartphone, BookOpen, Coffee, Briefcase, Glasses, Key, MapPin, ChevronRight, Shirt, CreditCard, Package, Loader2, Bell, BellRing, CheckCircle2 } from 'lucide-react';
import { CATEGORIES } from '../mockData';
import { requestNotificationPermission, getNotificationPermissionState, sendLocalNotification } from '../utils/notificationHelper';

export default function Home({ items, currentUser, isSyncing, onSelectItem, onNavigateReport }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'hilang' | 'ditemukan'
  const [notifState, setNotifState] = useState('default');
  const [showNotifToast, setShowNotifToast] = useState(false);

  useEffect(() => {
    setNotifState(getNotificationPermissionState());
  }, []);

  const handleToggleNotification = async () => {
    const perm = await requestNotificationPermission();
    setNotifState(perm);
    if (perm === 'granted') {
      sendLocalNotification('Notifikasi PWA SiTemu Aktif! 🔔', {
        body: 'Selamat! Kamu akan menerima notifikasi real-time saat ada laporan baru / barang ditemukan.',
        tag: 'manual-test'
      });
      setShowNotifToast(true);
      setTimeout(() => setShowNotifToast(false), 4000);
    }
  };

  const filteredItems = items.filter(item => {
    // Public Home feed ONLY shows published reports approved by Admin BK!
    const isPublished = item.isPublished !== false;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesTab = activeTab === 'all' || item.status === activeTab;

    return isPublished && matchesSearch && matchesCategory && matchesTab;
  });

  const getCategoryIcon = (catId) => {
    switch (catId) {
      case 'hp': return <Smartphone size={15} />;
      case 'buku': return <BookOpen size={15} />;
      case 'botol': return <Coffee size={15} />;
      case 'dompet': return <Briefcase size={15} />;
      case 'aksesori': return <Glasses size={15} />;
      case 'kunci': return <Key size={15} />;
      case 'pakaian': return <Shirt size={15} />;
      case 'kartu': return <CreditCard size={15} />;
      case 'lainnya': return <Package size={15} />;
      default: return <Sparkles size={15} />;
    }
  };

  const getTabBg = () => {
    if (activeTab === 'hilang') return '#fff5f5';
    if (activeTab === 'ditemukan') return '#f0fdf4';
    return 'transparent';
  };

  return (
    <div className="animate-fade" style={{
      borderRadius: '16px',
      padding: '4px',
      transition: 'background 0.3s ease',
      background: getTabBg(),
      position: 'relative'
    }}>
      {/* Subtle Background Floating Accents */}
      <div className="animate-float" style={{
        position: 'absolute',
        top: '60px',
        right: '10px',
        opacity: 0.12,
        pointerEvents: 'none',
        zIndex: 0
      }}>
        <Sparkles size={42} color="#2563eb" />
      </div>
      <div className="animate-float-reverse" style={{
        position: 'absolute',
        top: '340px',
        left: '-10px',
        opacity: 0.1,
        pointerEvents: 'none',
        zIndex: 0
      }}>
        <BookOpen size={48} color="#7c3aed" />
      </div>

      {/* Top Welcome Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
        <div>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Selamat Datang ☀️</span>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
            Halo, {currentUser?.name?.split(' ')[0] || 'Siswa'}! 👋
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Interactive Bell Notification Toggle */}
          <button
            onClick={handleToggleNotification}
            title={notifState === 'granted' ? 'Notifikasi PWA Aktif (Klik untuk Tes)' : 'Aktifkan Notifikasi HP'}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              border: notifState === 'granted' ? '1.5px solid #2563eb' : '1.5px solid #cbd5e1',
              background: notifState === 'granted' ? '#eff6ff' : '#ffffff',
              color: notifState === 'granted' ? '#2563eb' : '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: notifState === 'granted' ? '0 4px 12px rgba(37, 99, 235, 0.2)' : '0 2px 6px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.25s ease'
            }}
          >
            {notifState === 'granted' ? <BellRing size={20} className="animate-pulse" /> : <Bell size={20} />}
          </button>

          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
            alt="Avatar"
            style={{ width: '44px', height: '44px', borderRadius: '50%', border: '2.5px solid #2563eb', objectFit: 'cover' }}
          />
        </div>
      </div>

      {/* Notification Toast Alert */}
      {showNotifToast && (
        <div style={{
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          color: '#1e40af',
          padding: '12px 14px',
          borderRadius: '14px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '12px',
          fontWeight: 700,
          boxShadow: '0 4px 14px rgba(37, 99, 235, 0.15)',
          animation: 'fade 0.3s ease'
        }}>
          <CheckCircle2 size={18} color="#2563eb" flexShrink={0} />
          <span>🔔 Notifikasi HP Aktif! Tes notifikasi telah dikirimkan ke perangkat kamu.</span>
        </div>
      )}

      {/* Main Banner Search Box */}
      <div style={{
        background: activeTab === 'hilang' 
          ? 'linear-gradient(135deg, #7f1d1d, #991b1b)' 
          : activeTab === 'ditemukan' 
            ? 'linear-gradient(135deg, #064e3b, #065f46)' 
            : 'linear-gradient(135deg, #1e293b, #0f172a)',
        borderRadius: '20px',
        padding: '16px',
        color: 'white',
        marginBottom: '20px',
        boxShadow: activeTab === 'hilang'
          ? '0 10px 25px -5px rgba(239, 68, 68, 0.25)'
          : activeTab === 'ditemukan'
            ? '0 10px 25px -5px rgba(16, 185, 129, 0.25)'
            : '0 10px 25px -5px rgba(15, 23, 42, 0.2)',
        transition: 'all 0.35s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 800
          }}>
            SiTemu Sekolah 🏫
          </div>
          {isSyncing && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: '#93c5fd',
              padding: '3px 10px',
              borderRadius: '20px',
              fontSize: '10px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              <Loader2 size={11} className="spin" />
              <span>Memuat Supabase...</span>
            </div>
          )}
        </div>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'white', marginBottom: '12px' }}>
          Cari barang hilang atau ditemukan...
        </h3>

        {/* Input Search */}
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '13px', color: '#94a3b8' }} />
          <input
            type="text"
            className="form-input"
            style={{
              paddingLeft: '42px',
              borderRadius: '14px',
              background: '#ffffff',
              color: '#0f172a',
              border: 'none',
              width: '100%',
              boxSizing: 'border-box'
            }}
            placeholder="Ketik nama barang, lokasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category Horizontal Scroll */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>Kategori Barang</span>
          <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: 700 }}>Geser Kanan ➔</span>
        </div>
        
        {/* Scrollable Container */}
        <div className="category-scroll-container">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 14px',
                  borderRadius: '14px',
                  border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  background: isSelected ? '#eff6ff' : '#ffffff',
                  color: isSelected ? '#2563eb' : '#475569',
                  fontSize: '12px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  flexShrink: 0,
                  boxShadow: isSelected ? '0 4px 12px rgba(37, 99, 235, 0.15)' : '0 2px 6px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s'
                }}
              >
                {getCategoryIcon(cat.id)}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feed Tabs Filter (Semua, Hilang, Ditemukan) */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          onClick={() => setActiveTab('all')}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '12px',
            border: 'none',
            background: activeTab === 'all' ? '#2563eb' : '#e2e8f0',
            color: activeTab === 'all' ? 'white' : '#475569',
            fontWeight: 700,
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.25s ease'
          }}
        >
          Semua
        </button>
        <button
          onClick={() => setActiveTab('hilang')}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '12px',
            border: 'none',
            background: activeTab === 'hilang' ? '#ef4444' : '#e2e8f0',
            color: activeTab === 'hilang' ? 'white' : '#475569',
            fontWeight: 700,
            fontSize: '12px',
            cursor: 'pointer',
            boxShadow: activeTab === 'hilang' ? '0 4px 12px rgba(239, 68, 68, 0.3)' : 'none',
            transition: 'all 0.25s ease'
          }}
        >
          🔴 Hilang
        </button>
        <button
          onClick={() => setActiveTab('ditemukan')}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '12px',
            border: 'none',
            background: activeTab === 'ditemukan' ? '#10b981' : '#e2e8f0',
            color: activeTab === 'ditemukan' ? 'white' : '#475569',
            fontWeight: 700,
            fontSize: '12px',
            cursor: 'pointer',
            boxShadow: activeTab === 'ditemukan' ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none',
            transition: 'all 0.25s ease'
          }}
        >
          🟢 Ditemukan
        </button>
      </div>

      {/* Feed Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {isSyncing && items.length === 0 ? (
          /* Shimmer Skeleton Placeholder Cards during first-time loading */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2, 3].map((n) => (
              <div key={n} className="glass-card animate-pulse" style={{ display: 'flex', gap: '12px', padding: '12px', background: '#ffffff', borderColor: '#e2e8f0' }}>
                <div style={{ width: '84px', height: '84px', borderRadius: '12px', background: '#e2e8f0' }}></div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ width: '70px', height: '14px', borderRadius: '6px', background: '#e2e8f0', marginBottom: '8px' }}></div>
                    <div style={{ width: '150px', height: '16px', borderRadius: '6px', background: '#cbd5e1' }}></div>
                  </div>
                  <div style={{ width: '110px', height: '12px', borderRadius: '6px', background: '#e2e8f0' }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
            <p style={{ fontSize: '14px', fontWeight: 600 }}>Tidak ada laporan barang 🔍</p>
            <p style={{ fontSize: '12px', marginTop: '4px' }}>Coba ubah kata kunci atau kategori pencarian.</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <div
              key={item.id}
              className="glass-card"
              onClick={() => onSelectItem(item)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                gap: '12px',
                padding: '12px',
                borderColor: item.status === 'hilang' && activeTab === 'hilang'
                  ? '#fecaca' 
                  : item.status === 'ditemukan' && activeTab === 'ditemukan'
                    ? '#a7f3d0'
                    : '#e2e8f0',
                transition: 'all 0.25s ease'
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '12px',
                  objectFit: 'cover',
                  flexShrink: 0
                }}
              />
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span className={`badge badge-${item.status}`} style={{ flexShrink: 0 }}>
                      {item.status === 'hilang' ? '🔴 HILANG' : item.status === 'ditemukan' ? '🟢 DITEMUKAN' : '🔵 SELESAI'}
                    </span>
                    <span style={{ fontSize: '11px', color: '#94a3b8', flexShrink: 0, whiteSpace: 'nowrap' }}>
                      {item.date.split(',')[0]}
                    </span>
                  </div>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#0f172a',
                    marginTop: '2px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {item.title}
                  </h4>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#64748b' }}>
                    <MapPin size={13} color="#2563eb" style={{ flexShrink: 0 }} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.location}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      Pelapor: {item.reporter.name}
                    </span>
                    <ChevronRight size={16} color="#2563eb" style={{ flexShrink: 0 }} />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
