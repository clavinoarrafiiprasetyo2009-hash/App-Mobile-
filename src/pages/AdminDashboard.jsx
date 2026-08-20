import React, { useState } from 'react';
import Header from '../components/Header';
import { Clock, ShieldCheck, Search, Filter, CheckCircle2, AlertCircle, FileText, Users, ChevronRight } from 'lucide-react';
import { ADMIN_STATS } from '../mockData';

export default function AdminDashboard({ items, onSelectItem }) {
  const [adminTab, setAdminTab] = useState('overview'); // 'overview' | 'reports' | 'pending'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const totalHilang = items.filter(i => i.status === 'hilang').length;
  const totalDitemukan = items.filter(i => i.status === 'ditemukan').length;
  const totalSelesai = items.filter(i => i.status === 'selesai').length;

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.reporter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const pendingItems = items.filter(i => i.status !== 'selesai');

  return (
    <div className="animate-fade">
      <Header title="Dashboard Guru & Admin BK" />

      {/* Admin Sub-Navigation Tabs */}
      <div style={{
        display: 'flex',
        background: '#f1f5f9',
        borderRadius: '12px',
        padding: '4px',
        marginBottom: '16px',
        border: '1px solid #e2e8f0'
      }}>
        <button
          onClick={() => setAdminTab('overview')}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '8px',
            border: 'none',
            background: adminTab === 'overview' ? '#2563eb' : 'transparent',
            color: adminTab === 'overview' ? 'white' : '#475569',
            fontWeight: 700,
            fontSize: '11px',
            cursor: 'pointer',
            transition: 'all 0.15s'
          }}
        >
          📊 Ringkasan
        </button>

        <button
          onClick={() => setAdminTab('reports')}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '8px',
            border: 'none',
            background: adminTab === 'reports' ? '#2563eb' : 'transparent',
            color: adminTab === 'reports' ? 'white' : '#475569',
            fontWeight: 700,
            fontSize: '11px',
            cursor: 'pointer',
            transition: 'all 0.15s'
          }}
        >
          📋 Kelola ({items.length})
        </button>

        <button
          onClick={() => setAdminTab('pending')}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '8px',
            border: 'none',
            background: adminTab === 'pending' ? '#2563eb' : 'transparent',
            color: adminTab === 'pending' ? 'white' : '#475569',
            fontWeight: 700,
            fontSize: '11px',
            cursor: 'pointer',
            transition: 'all 0.15s'
          }}
        >
          ⏳ Pending ({pendingItems.length})
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {adminTab === 'overview' && (
        <>
          {/* Stat Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
            <div className="glass-card" style={{ padding: '12px 8px', textAlign: 'center', background: '#fef2f2', borderColor: '#fecaca' }}>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#dc2626' }}>{totalHilang}</span>
              <span style={{ fontSize: '11px', color: '#991b1b', display: 'block', marginTop: '2px', fontWeight: 700 }}>Barang Hilang</span>
            </div>

            <div className="glass-card" style={{ padding: '12px 8px', textAlign: 'center', background: '#ecfdf5', borderColor: '#a7f3d0' }}>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#059669' }}>{totalDitemukan}</span>
              <span style={{ fontSize: '11px', color: '#065f46', display: 'block', marginTop: '2px', fontWeight: 700 }}>Ditemukan</span>
            </div>

            <div className="glass-card" style={{ padding: '12px 8px', textAlign: 'center', background: '#eff6ff', borderColor: '#bfdbfe' }}>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#2563eb' }}>{totalSelesai}</span>
              <span style={{ fontSize: '11px', color: '#1e40af', display: 'block', marginTop: '2px', fontWeight: 700 }}>Selesai</span>
            </div>
          </div>

          {/* Verification Review Banner */}
          <div className="glass-card" style={{
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'linear-gradient(135deg, #eff6ff, #e0e7ff)',
            borderColor: '#c7d2fe'
          }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#4f46e5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Clock size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Klaim Membutuhkan Verifikasi Guru BK</h4>
              <span style={{ fontSize: '11px', color: '#475569' }}>Terdapat {pendingItems.length} laporan barang aktif yang butuh pencocokan bukti.</span>
            </div>
          </div>

          {/* Quick List Preview */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>Laporan Terbaru Sekolah</h4>
            <span onClick={() => setAdminTab('reports')} style={{ fontSize: '11px', color: '#2563eb', fontWeight: 700, cursor: 'pointer' }}>Lihat Semua ➔</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {items.slice(0, 4).map(item => (
              <div
                key={item.id}
                className="glass-card"
                onClick={() => onSelectItem(item)}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px' }}
              >
                <img src={item.image} alt={item.title} style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'cover' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className={`badge badge-${item.status}`} style={{ fontSize: '9px', padding: '2px 6px' }}>
                      {item.status.toUpperCase()}
                    </span>
                    <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.title}
                    </h5>
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Pelapor: {item.reporter.name} • {item.location}
                  </span>
                </div>
                <ChevronRight size={16} color="#94a3b8" />
              </div>
            ))}
          </div>
        </>
      )}

      {/* REPORTS TAB */}
      {adminTab === 'reports' && (
        <>
          {/* Admin Search Bar */}
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '38px', borderRadius: '12px', background: '#ffffff' }}
              placeholder="Cari laporan, pelapor, lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', overflowX: 'auto', paddingBottom: '2px' }}>
            {['all', 'hilang', 'ditemukan', 'selesai'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: statusFilter === st ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  background: statusFilter === st ? '#eff6ff' : '#ffffff',
                  color: statusFilter === st ? '#2563eb' : '#64748b',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'capitalize',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                {st === 'all' ? 'Semua' : st}
              </button>
            ))}
          </div>

          {/* List of Managed Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredItems.map(item => (
              <div
                key={item.id}
                className="glass-card"
                onClick={() => onSelectItem(item)}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px' }}
              >
                <img src={item.image} alt={item.title} style={{ width: '46px', height: '46px', borderRadius: '10px', objectFit: 'cover' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className={`badge badge-${item.status}`} style={{ fontSize: '9px', padding: '2px 6px' }}>
                      {item.status.toUpperCase()}
                    </span>
                    <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.title}
                    </h5>
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Pelapor: {item.reporter.name} ({item.reporter.role})
                  </span>
                </div>
                <ChevronRight size={16} color="#94a3b8" />
              </div>
            ))}
          </div>
        </>
      )}

      {/* PENDING VERIFICATION TAB */}
      {adminTab === 'pending' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '12px', padding: '10px 14px', fontSize: '12px', color: '#92400e', fontWeight: 600 }}>
            📌 Guru BK bertugas memverifikasi kecocokan bukti & nomor WhatsApp pelapor sebelum serah terima barang.
          </div>

          {pendingItems.map(item => (
            <div
              key={item.id}
              className="glass-card"
              onClick={() => onSelectItem(item)}
              style={{ cursor: 'pointer', padding: '12px' }}
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <img src={item.image} alt={item.title} style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span className={`badge badge-${item.status}`} style={{ fontSize: '9px', padding: '2px 6px', marginBottom: '4px' }}>
                    {item.status.toUpperCase()}
                  </span>
                  <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.title}
                  </h5>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    Lokasi: {item.location}
                  </span>
                </div>
              </div>
              <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Pelapor: <strong>{item.reporter.name}</strong></span>
                <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: 700 }}>Review Laporan ➔</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
