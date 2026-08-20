import React from 'react';
import Header from '../components/Header';
import { MapPin, Calendar, ShieldAlert, MessageCircle, FileCheck, Share2 } from 'lucide-react';

export default function ItemDetail({ item, onBack, onStartChat, onStartVerification }) {
  if (!item) return null;

  return (
    <div className="animate-fade">
      <Header
        title="Detail Laporan"
        onBack={onBack}
        rightAction={
          <button style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer' }}>
            <Share2 size={20} />
          </button>
        }
      />

      {/* Item Image Banner */}
      <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
        <img
          src={item.image}
          alt={item.title}
          style={{ width: '100%', height: '220px', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px'
        }}>
          <span className={`badge badge-${item.status}`} style={{ padding: '6px 12px', fontSize: '12px' }}>
            {item.status === 'hilang' ? '🔴 LAPORAN HILANG' : item.status === 'ditemukan' ? '🟢 BARANG DITEMUKAN' : '🔵 SUDAH SELESAI'}
          </span>
        </div>
      </div>

      {/* Main Details Card */}
      <div className="glass-card" style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
          {item.title}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b' }}>
            <MapPin size={15} color="#2563eb" />
            <span>Lokasi: <strong style={{ color: '#0f172a' }}>{item.location}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b' }}>
            <Calendar size={15} color="#2563eb" />
            <span>Waktu: <strong style={{ color: '#0f172a' }}>{item.date}</strong></span>
          </div>
        </div>

        <hr style={{ borderColor: '#e2e8f0', marginBottom: '14px' }} />

        {/* Reporter Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <img
            src={item.reporter.avatar}
            alt={item.reporter.name}
            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{item.reporter.name}</h4>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Pelapor • {item.reporter.role}</span>
          </div>
        </div>

        <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>Deskripsi Barang:</h4>
        <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5', marginBottom: '14px' }}>
          {item.description}
        </p>

        {item.specialNotes && (
          <div style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '12px',
            padding: '10px 12px',
            display: 'flex',
            gap: '8px',
            alignItems: 'flex-start'
          }}>
            <ShieldAlert size={18} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#b45309' }}>Catatan Khusus:</span>
              <p style={{ fontSize: '12px', color: '#92400e', marginTop: '2px' }}>{item.specialNotes}</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button
          className="btn-primary"
          onClick={() => onStartChat(item)}
        >
          <MessageCircle size={18} />
          Hubungi Pelapor / Chat ({item.reporter.name.split(' ')[0]})
        </button>

        {item.status === 'ditemukan' && (
          <button
            className="btn-secondary"
            onClick={() => onStartVerification(item)}
            style={{ borderColor: '#10b981', color: '#047857', background: '#ecfdf5' }}
          >
            <FileCheck size={18} color="#059669" />
            Ajukan Verifikasi Kepemilikan (Klaim)
          </button>
        )}
      </div>
    </div>
  );
}
