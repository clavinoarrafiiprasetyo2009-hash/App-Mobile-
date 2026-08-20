import React from 'react';
import Header from '../components/Header';
import { Clock } from 'lucide-react';
import { ADMIN_STATS } from '../mockData';

export default function AdminDashboard({ items, onSelectItem }) {
  return (
    <div className="animate-fade">
      <Header title="Dashboard Admin & Guru" />

      {/* Admin Stat Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '18px' }}>
        <div className="glass-card" style={{ padding: '12px', textAlign: 'center', background: '#fef2f2', borderColor: '#fecaca' }}>
          <span style={{ fontSize: '22px', fontWeight: 800, color: '#dc2626' }}>{ADMIN_STATS.totalLost}</span>
          <span style={{ fontSize: '11px', color: '#991b1b', display: 'block', marginTop: '2px', fontWeight: 700 }}>Hilang</span>
        </div>

        <div className="glass-card" style={{ padding: '12px', textAlign: 'center', background: '#ecfdf5', borderColor: '#a7f3d0' }}>
          <span style={{ fontSize: '22px', fontWeight: 800, color: '#059669' }}>{ADMIN_STATS.totalFound}</span>
          <span style={{ fontSize: '11px', color: '#065f46', display: 'block', marginTop: '2px', fontWeight: 700 }}>Ditemukan</span>
        </div>

        <div className="glass-card" style={{ padding: '12px', textAlign: 'center', background: '#eff6ff', borderColor: '#bfdbfe' }}>
          <span style={{ fontSize: '22px', fontWeight: 800, color: '#2563eb' }}>{ADMIN_STATS.totalCompleted}</span>
          <span style={{ fontSize: '11px', color: '#1e40af', display: 'block', marginTop: '2px', fontWeight: 700 }}>Selesai</span>
        </div>
      </div>

      {/* Verification Action Banner */}
      <div className="glass-card" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px', background: 'linear-gradient(135deg, #eff6ff, #e0e7ff)', borderColor: '#c7d2fe' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#4f46e5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Clock size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Verifikasi Menunggu Review</h4>
          <span style={{ fontSize: '11px', color: '#475569' }}>Ada {ADMIN_STATS.pendingVerifications} klaim barang menunggu bukti validasi Guru BK.</span>
        </div>
      </div>

      {/* Manage Reports Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>Kelola Laporan Sekolah</h4>
        <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: 700 }}>{items.length} Total Laporan</span>
      </div>

      {/* Items Management List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map(item => (
          <div
            key={item.id}
            className="glass-card"
            onClick={() => onSelectItem(item)}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px' }}
          >
            <img
              src={item.image}
              alt={item.title}
              style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover' }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className={`badge badge-${item.status}`} style={{ fontSize: '9px', padding: '2px 6px' }}>
                  {item.status.toUpperCase()}
                </span>
                <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.title}
                </h5>
              </div>
              <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '2px' }}>
                Pelapor: {item.reporter.name} • {item.location}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
