import React, { useState } from 'react';
import Header from '../components/Header';
import { Gavel, Tag, Clock, MessageCircle, AlertCircle, ShieldCheck } from 'lucide-react';

export default function Auction({ items, currentUser, onSelectItem }) {
  const [filterCategory, setFilterCategory] = useState('all');

  // Filter items in auction status or older than 30 days
  const auctionItems = items.filter(item => item.status === 'lelang' || item.isAuction);

  const filteredAuctionItems = auctionItems.filter(item => {
    return filterCategory === 'all' || item.category === filterCategory;
  });

  return (
    <div className="animate-fade">
      <Header title="🔨 Lelang Barang Sekolah" />

      {/* Info Banner for Auction Feature */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
        borderColor: '#fcd34d',
        marginBottom: '16px',
        color: '#78350f'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <Gavel size={22} color="#b45309" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#92400e', marginBottom: '2px' }}>
              Program Lelang Barang Unclaimed (&gt; 30 Hari)
            </h4>
            <p style={{ fontSize: '11px', color: '#78350f', lineHeight: '1.4' }}>
              Barang temuan di lingkungan sekolah yang tidak diambil pemiliknya selama lebih dari 30 hari dilelang secara resmi oleh Guru BK. Hasil lelang disalurkan 100% untuk kas sosial siswa.
            </p>
          </div>
        </div>
      </div>

      {/* Auction Items Grid / List */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
          Daftar Barang Lelang Aktif ({filteredAuctionItems.length})
        </h4>
      </div>

      {filteredAuctionItems.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '36px 16px', color: '#64748b' }}>
          <Gavel size={36} color="#94a3b8" style={{ margin: '0 auto 10px' }} />
          <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Belum Ada Barang Lelang</h4>
          <p style={{ fontSize: '12px', marginTop: '4px' }}>
            Saat ini tidak ada barang temuan yang melebihi batas waktu 30 hari. Barang yang baru dilaporkan masih dalam masa tenggang pengambilan di Ruang BK.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredAuctionItems.map(item => {
            const formattedPrice = item.auctionPrice 
              ? `Rp ${Number(item.auctionPrice).toLocaleString('id-ID')}` 
              : 'Rp 15.000 (Harga Dasar)';

            const waText = encodeURIComponent(`Halo Guru BK, saya berminat tawar/beli barang lelang sekolah: "${item.title}" dengan harga ${formattedPrice}. Apakah barang masih ada di Ruang BK?`);
            const waUrl = `https://wa.me/6281299887766?text=${waText}`;

            return (
              <div key={item.id} className="glass-card" style={{ padding: '12px', borderColor: '#fcd34d', background: '#fffdf5' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: '84px', height: '84px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{
                          background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a',
                          padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 800,
                          display: 'inline-flex', alignItems: 'center', gap: '4px'
                        }}>
                          <Gavel size={11} /> LELANG RESMI
                        </span>
                        <span style={{ fontSize: '10px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '2px' }}>
                          <Clock size={11} /> &gt;30 Hari
                        </span>
                      </div>
                      <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.title}
                      </h4>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                      <div>
                        <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>Harga Pembuka:</span>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: '#b45309' }}>
                          {formattedPrice}
                        </span>
                      </div>
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: 'linear-gradient(135deg, #d97706, #b45309)',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '10px',
                          fontSize: '11px',
                          fontWeight: 800,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          boxShadow: '0 2px 8px rgba(217, 119, 6, 0.3)'
                        }}
                      >
                        <MessageCircle size={13} />
                        Beli via BK
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
