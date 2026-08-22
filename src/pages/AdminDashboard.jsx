import React, { useState } from 'react';
import { 
  Search, MoreVertical, ChevronRight, Lock, Sparkles, 
  Clock, ShieldCheck, AlertCircle, FileText, Users, 
  Gavel, Plus, Camera, BarChart3, CheckCircle2, Filter, 
  Layers, Package, ArrowRight, X 
} from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function AdminDashboard({ items, onSelectItem, onUpdateItemStatus }) {
  const [adminTab, setAdminTab] = useState('overview'); // 'overview' | 'reports' | 'pending' | 'auction-manage'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeModalItem, setActiveModalItem] = useState(null);

  // Price state for each item being set for auction
  const [auctionPrices, setAuctionPrices] = useState({});
  const [toastMessage, setToastMessage] = useState('');

  const totalHilang = items.filter(i => i.status === 'hilang').length;
  const totalDitemukan = items.filter(i => i.status === 'ditemukan').length;
  const totalSelesai = items.filter(i => i.status === 'selesai').length;
  const totalLelang = items.filter(i => i.status === 'lelang' || i.isAuction).length;

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.reporter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const pendingItems = items.filter(i => i.status !== 'selesai' && i.status !== 'lelang');
  const foundUnclaimedItems = items.filter(i => i.status === 'ditemukan' || i.status === 'hilang');

  const handleSetAuction = async (item) => {
    const price = auctionPrices[item.id] || 15000;
    
    if (onUpdateItemStatus) {
      onUpdateItemStatus(item.id, 'lelang', price);
    } else {
      try {
        await supabase
          .from('items')
          .update({ status: 'lelang', special_notes: `Harga Lelang: Rp ${Number(price).toLocaleString('id-ID')}` })
          .eq('id', item.id);
      } catch (e) {
        console.warn('Auction status update error:', e);
      }
    }

    setToastMessage(`✅ "${item.title}" dipindahkan ke Lelang (Rp ${Number(price).toLocaleString('id-ID')})`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  return (
    <div className="animate-fade" style={{
      background: '#0d0e17',
      color: '#f8fafc',
      borderRadius: '24px',
      padding: '16px 14px 28px',
      minHeight: '100%',
      margin: '-18px -16px -90px',
      paddingBottom: '100px',
      boxSizing: 'border-box'
    }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          background: 'rgba(217, 119, 6, 0.2)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          color: '#fef08a',
          padding: '10px 14px',
          borderRadius: '14px',
          marginBottom: '14px',
          fontSize: '12px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backdropFilter: 'blur(10px)'
        }}>
          <Gavel size={16} color="#fbbf24" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Canva Style Glowing Gradient Title */}
      <div style={{ marginBottom: '18px', paddingTop: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 800,
            color: '#a855f7',
            background: 'rgba(168, 85, 247, 0.15)',
            padding: '3px 10px',
            borderRadius: '20px',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <ShieldCheck size={13} color="#c084fc" /> Admin BK Panel
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Sistem Aktif ●</span>
          </div>
        </div>

        <h2 style={{
          fontSize: '24px',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #38bdf8 0%, #a855f7 50%, #ec4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px',
          lineHeight: '1.2'
        }}>
          Mau kelola apa hari ini?
        </h2>
      </div>

      {/* Dark Canva Search Input Box with Purple Glow */}
      <div style={{ position: 'relative', marginBottom: '22px' }}>
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          background: '#161726',
          borderRadius: '16px',
          border: '1px solid #2a2b40',
          boxShadow: '0 0 20px rgba(168, 85, 247, 0.15)',
          overflow: 'hidden'
        }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', color: '#94a3b8' }} />
          <input
            type="text"
            style={{
              width: '100%',
              padding: '14px 14px 14px 44px',
              background: 'transparent',
              border: 'none',
              color: '#f8fafc',
              fontSize: '13px',
              outline: 'none'
            }}
            placeholder="Apa yang ingin Anda kelola?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* SECTION 1: Lanjutkan mendesain (Cards Deck Horizontal Scroll) */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.2px' }}>
            Lanjutkan verifikasi
          </h3>
          <span
            onClick={() => setAdminTab('pending')}
            style={{ fontSize: '12px', color: '#a855f7', fontWeight: 700, cursor: 'pointer' }}
          >
            Lihat semua ➔
          </span>
        </div>

        {/* Horizontal Card Scroll Container */}
        <div style={{ position: 'relative' }}>
          <div style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            paddingBottom: '8px',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none'
          }}>
            {pendingItems.length === 0 ? (
              <div style={{
                background: '#18192a',
                borderRadius: '16px',
                padding: '20px',
                width: '100%',
                textAlign: 'center',
                color: '#94a3b8',
                fontSize: '12px',
                border: '1px dashed #2d2f48'
              }}>
                Semua laporan sudah terverifikasi ✨
              </div>
            ) : (
              pendingItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  style={{
                    flexShrink: 0,
                    width: '130px',
                    background: '#18192a',
                    borderRadius: '16px',
                    border: '1px solid #2a2b40',
                    padding: '8px',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
                  }}
                >
                  {/* Thumbnail Image Container */}
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '95px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginBottom: '8px'
                  }}>
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    
                    {/* Status Badge Overlay */}
                    <div style={{
                      position: 'absolute',
                      top: '6px',
                      left: '6px',
                      background: 'rgba(15, 23, 42, 0.75)',
                      backdropFilter: 'blur(6px)',
                      padding: '2px 6px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '9px',
                      color: 'white',
                      fontWeight: 700
                    }}>
                      <Lock size={9} color="#cbd5e1" />
                      <span>{item.status === 'hilang' ? 'Hilang' : 'Ditemukan'}</span>
                    </div>

                    {/* 3-dots Menu Button Overlay */}
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveModalItem(item);
                      }}
                      style={{
                        position: 'absolute',
                        top: '6px',
                        right: '6px',
                        background: 'rgba(15, 23, 42, 0.75)',
                        backdropFilter: 'blur(6px)',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}
                    >
                      <MoreVertical size={13} />
                    </div>
                  </div>

                  {/* Card Title */}
                  <h4 style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#f1f5f9',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginBottom: '2px'
                  }}>
                    {item.title}
                  </h4>
                  <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.reporter?.name || 'Pelapor'}
                  </span>
                </div>
              ))
            )}

            {/* End Chevron Indicator */}
            {pendingItems.length > 2 && (
              <div style={{
                flexShrink: 0,
                width: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b'
              }}>
                <ChevronRight size={20} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: Pilih cara memulai (Vibrant Circular Action Icons) */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc', marginBottom: '14px', letterSpacing: '-0.2px' }}>
          Pilih cara memulai
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '14px 10px',
          textAlign: 'center'
        }}>
          {/* 1. Pending (Pink Circle + "Baru" Badge) */}
          <div
            onClick={() => setAdminTab('pending')}
            style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div style={{ position: 'relative', marginBottom: '8px' }}>
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-6px',
                background: '#a855f7',
                color: 'white',
                fontSize: '9px',
                fontWeight: 800,
                padding: '1px 6px',
                borderRadius: '10px',
                boxShadow: '0 2px 6px rgba(168, 85, 247, 0.4)',
                zIndex: 2
              }}>
                Baru
              </span>
              <div style={{
                width: '58px',
                height: '58px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ec4899, #db2777)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 8px 18px rgba(236, 72, 153, 0.35)'
              }}>
                <Clock size={24} />
              </div>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#e2e8f0', lineHeight: '1.2' }}>
              Pending<br />Verifikasi
            </span>
          </div>

          {/* 2. Lelang (Orange Circle) */}
          <div
            onClick={() => setAdminTab('auction-manage')}
            style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div style={{
              width: '58px',
              height: '58px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              marginBottom: '8px',
              boxShadow: '0 8px 18px rgba(249, 115, 22, 0.35)'
            }}>
              <Gavel size={24} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#e2e8f0', lineHeight: '1.2' }}>
              Kelola<br />Lelang
            </span>
          </div>

          {/* 3. Barang Hilang (Red Circle) */}
          <div
            onClick={() => { setAdminTab('reports'); setStatusFilter('hilang'); }}
            style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div style={{
              width: '58px',
              height: '58px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              marginBottom: '8px',
              boxShadow: '0 8px 18px rgba(239, 68, 68, 0.35)'
            }}>
              <AlertCircle size={24} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#e2e8f0', lineHeight: '1.2' }}>
              Barang<br />Hilang
            </span>
          </div>

          {/* 4. Barang Temuan (Green Circle) */}
          <div
            onClick={() => { setAdminTab('reports'); setStatusFilter('ditemukan'); }}
            style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div style={{
              width: '58px',
              height: '58px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              marginBottom: '8px',
              boxShadow: '0 8px 18px rgba(16, 185, 129, 0.35)'
            }}>
              <CheckCircle2 size={24} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#e2e8f0', lineHeight: '1.2' }}>
              Barang<br />Temuan
            </span>
          </div>

          {/* 5. Statistik / Doc (Cyan Circle) */}
          <div
            onClick={() => setAdminTab('overview')}
            style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div style={{
              width: '58px',
              height: '58px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              marginBottom: '8px',
              boxShadow: '0 8px 18px rgba(6, 182, 212, 0.35)'
            }}>
              <BarChart3 size={24} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#e2e8f0', lineHeight: '1.2' }}>
              Statistik<br />BK
            </span>
          </div>

          {/* 6. Semua Laporan (Purple Circle) */}
          <div
            onClick={() => { setAdminTab('reports'); setStatusFilter('all'); }}
            style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div style={{
              width: '58px',
              height: '58px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              marginBottom: '8px',
              boxShadow: '0 8px 18px rgba(139, 92, 246, 0.35)'
            }}>
              <FileText size={24} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#e2e8f0', lineHeight: '1.2' }}>
              Semua<br />Laporan
            </span>
          </div>

          {/* 7. Selesai (Emerald Circle) */}
          <div
            onClick={() => { setAdminTab('reports'); setStatusFilter('selesai'); }}
            style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div style={{
              width: '58px',
              height: '58px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              marginBottom: '8px',
              boxShadow: '0 8px 18px rgba(20, 184, 166, 0.35)'
            }}>
              <ShieldCheck size={24} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#e2e8f0', lineHeight: '1.2' }}>
              Verifikasi<br />Selesai
            </span>
          </div>

          {/* 8. Kelola Siswa (Blue Circle) */}
          <div
            onClick={() => setAdminTab('reports')}
            style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div style={{
              width: '58px',
              height: '58px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              marginBottom: '8px',
              boxShadow: '0 8px 18px rgba(59, 130, 246, 0.35)'
            }}>
              <Users size={24} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#e2e8f0', lineHeight: '1.2' }}>
              Data<br />Pelapor
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 3: Main Dynamic Content Views */}
      <div style={{ background: '#161726', borderRadius: '20px', padding: '16px', border: '1px solid #2a2b40' }}>
        {/* Header Title inside section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc' }}>
            {adminTab === 'overview' && '📊 Ringkasan Statistik Sekolah'}
            {adminTab === 'reports' && `📋 Daftar Laporan (${filteredItems.length})`}
            {adminTab === 'pending' && `⏳ Perlu Verifikasi BK (${pendingItems.length})`}
            {adminTab === 'auction-manage' && '🔨 Pengaturan Lelang Barang'}
          </h4>

          <div style={{ display: 'flex', gap: '6px' }}>
            {['overview', 'reports', 'pending', 'auction-manage'].map((t) => (
              <button
                key={t}
                onClick={() => setAdminTab(t)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '8px',
                  border: 'none',
                  background: adminTab === t ? '#a855f7' : '#222438',
                  color: adminTab === t ? 'white' : '#94a3b8',
                  fontSize: '10px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {t === 'overview' ? 'Stats' : t === 'reports' ? 'List' : t === 'pending' ? 'Pending' : 'Lelang'}
              </button>
            ))}
          </div>
        </div>

        {/* OVERVIEW CONTENT */}
        {adminTab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '16px' }}>
              <div style={{ background: '#211824', padding: '12px', borderRadius: '14px', border: '1px solid #4a1d35' }}>
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#f43f5e' }}>{totalHilang}</span>
                <span style={{ fontSize: '11px', color: '#fda4af', display: 'block', fontWeight: 700 }}>Barang Hilang</span>
              </div>
              <div style={{ background: '#122621', padding: '12px', borderRadius: '14px', border: '1px solid #14532d' }}>
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#10b981' }}>{totalDitemukan}</span>
                <span style={{ fontSize: '11px', color: '#6ee7b7', display: 'block', fontWeight: 700 }}>Barang Temuan</span>
              </div>
              <div style={{ background: '#16233b', padding: '12px', borderRadius: '14px', border: '1px solid #1e3a8a' }}>
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#3b82f6' }}>{totalSelesai}</span>
                <span style={{ fontSize: '11px', color: '#93c5fd', display: 'block', fontWeight: 700 }}>Selesai Klaim</span>
              </div>
              <div style={{ background: '#2a1f18', padding: '12px', borderRadius: '14px', border: '1px solid #7c2d12' }}>
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#f97316' }}>{totalLelang}</span>
                <span style={{ fontSize: '11px', color: '#fdba74', display: 'block', fontWeight: 700 }}>Siap Lelang</span>
              </div>
            </div>

            <h5 style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>Ringkasan Aktivitas Terkini:</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {items.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: '#1d1f30',
                    padding: '8px 10px',
                    borderRadius: '12px',
                    cursor: 'pointer'
                  }}
                >
                  <img src={item.image} alt={item.title} style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h5 style={{ fontSize: '12px', fontWeight: 700, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.title}
                    </h5>
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>{item.location} • {item.reporter?.name}</span>
                  </div>
                  <ChevronRight size={14} color="#64748b" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REPORTS CONTENT */}
        {adminTab === 'reports' && (
          <div>
            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', overflowX: 'auto' }}>
              {['all', 'hilang', 'ditemukan', 'lelang', 'selesai'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '12px',
                    border: 'none',
                    background: statusFilter === st ? '#a855f7' : '#222438',
                    color: statusFilter === st ? 'white' : '#94a3b8',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {st}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: '#1d1f30',
                    padding: '10px',
                    borderRadius: '12px',
                    cursor: 'pointer'
                  }}
                >
                  <img src={item.image} alt={item.title} style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        fontSize: '9px',
                        fontWeight: 800,
                        padding: '1px 6px',
                        borderRadius: '6px',
                        background: item.status === 'hilang' ? '#3f1d24' : item.status === 'ditemukan' ? '#14382c' : '#1e293b',
                        color: item.status === 'hilang' ? '#f43f5e' : item.status === 'ditemukan' ? '#34d399' : '#38bdf8'
                      }}>
                        {item.status.toUpperCase()}
                      </span>
                      <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.title}
                      </h5>
                    </div>
                    <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginTop: '2px' }}>
                      Pelapor: {item.reporter?.name} • {item.location}
                    </span>
                  </div>
                  <ChevronRight size={16} color="#64748b" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PENDING CONTENT */}
        {adminTab === 'pending' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {pendingItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                style={{
                  background: '#1d1f30',
                  padding: '12px',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  border: '1px solid #2a2b40'
                }}
              >
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <img src={item.image} alt={item.title} style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.title}
                    </h5>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                      Lokasi: {item.location}
                    </span>
                  </div>
                </div>
                <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #28293d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Pelapor: <strong style={{ color: '#e2e8f0' }}>{item.reporter?.name}</strong></span>
                  <span style={{ fontSize: '11px', color: '#c084fc', fontWeight: 700 }}>Review BK ➔</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AUCTION MANAGEMENT CONTENT */}
        {adminTab === 'auction-manage' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ background: '#2a1f18', padding: '10px', borderRadius: '12px', border: '1px solid #7c2d12', fontSize: '11px', color: '#fdba74' }}>
              🔨 Tetapkan harga awal lelang untuk barang temuan yang belum diklaim lebih dari 30 hari.
            </div>

            {foundUnclaimedItems.map((item) => (
              <div key={item.id} style={{ background: '#1d1f30', padding: '12px', borderRadius: '14px', border: '1px solid #332d20' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <img src={item.image} alt={item.title} style={{ width: '46px', height: '46px', borderRadius: '10px', objectFit: 'cover' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9' }}>{item.title}</h5>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>{item.location}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="number"
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      borderRadius: '10px',
                      background: '#121320',
                      border: '1px solid #2a2b40',
                      color: 'white',
                      fontSize: '12px'
                    }}
                    placeholder="Rp (contoh: 15000)"
                    value={auctionPrices[item.id] || ''}
                    onChange={(e) => setAuctionPrices({ ...auctionPrices, [item.id]: e.target.value })}
                  />
                  <button
                    onClick={() => handleSetAuction(item)}
                    style={{
                      background: 'linear-gradient(135deg, #f97316, #ea580c)',
                      color: 'white',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      fontSize: '11px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    Pindah Lelang
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button (FAB Canva Style) */}
      <button
        onClick={() => onSelectItem(pendingItems[0] || items[0])}
        style={{
          position: 'fixed',
          bottom: '84px',
          right: 'calc(50% - 175px)',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
          color: 'white',
          border: 'none',
          boxShadow: '0 10px 25px rgba(168, 85, 247, 0.5), 0 0 0 4px rgba(15, 14, 23, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 45
        }}
        title="Quick Action"
      >
        <Camera size={24} />
      </button>

      {/* Modal Quick Actions popup if 3-dots clicked */}
      {activeModalItem && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center'
        }}>
          <div style={{
            background: '#161726',
            width: '390px',
            maxWidth: '100%',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            padding: '20px',
            borderTop: '1px solid #2a2b40',
            color: 'white'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 800 }}>{activeModalItem.title}</h4>
              <button
                onClick={() => setActiveModalItem(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => {
                  onSelectItem(activeModalItem);
                  setActiveModalItem(null);
                }}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                🔍 Lihat Detail Laporan
              </button>
              <button
                onClick={() => {
                  handleSetAuction(activeModalItem);
                  setActiveModalItem(null);
                }}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: '#f97316',
                  color: 'white',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                🔨 Pindahkan ke Fitur Lelang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
