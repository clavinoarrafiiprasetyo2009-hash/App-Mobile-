import React, { useState } from 'react';
import Header from '../components/Header';
import { Gavel, Tag, Clock, MessageCircle, AlertCircle, ShieldCheck, Edit3, Save, X } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function Auction({ items, currentUser, onSelectItem, onUpdateItemDetails }) {
  const [filterCategory, setFilterCategory] = useState('all');
  const [editingItem, setEditingItem] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const isGuru = currentUser?.role === 'guru';

  // Filter items in auction status or having auction price/notes
  const auctionItems = items.filter(item => 
    item.status === 'lelang' || 
    item.isAuction || 
    (item.specialNotes && item.specialNotes.includes('Harga Lelang:'))
  );

  const filteredAuctionItems = auctionItems.filter(item => {
    return filterCategory === 'all' || item.category === filterCategory;
  });

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    if (onUpdateItemDetails) {
      onUpdateItemDetails(editingItem.id, {
        title: editingItem.title,
        category: editingItem.category,
        status: editingItem.status,
        location: editingItem.location,
        description: editingItem.description,
        auctionPrice: editingItem.auctionPrice
      });
    } else {
      try {
        await supabase
          .from('items')
          .update({
            title: editingItem.title,
            category: editingItem.category,
            status: editingItem.status,
            location: editingItem.location,
            description: editingItem.description,
            special_notes: editingItem.auctionPrice ? `Harga Lelang: Rp ${Number(editingItem.auctionPrice).toLocaleString('id-ID')}` : undefined
          })
          .eq('id', editingItem.id);
      } catch (err) {
        console.warn('Edit item save error:', err);
      }
    }

    setToastMessage(`✅ Barang lelang "${editingItem.title}" berhasil diperbarui!`);
    setTimeout(() => setToastMessage(''), 3500);
    setEditingItem(null);
  };

  return (
    <div className="animate-fade" style={{ position: 'relative' }}>
      {/* Subtle Floating Gavel Background Accent */}
      <div className="animate-float" style={{
        position: 'absolute',
        top: '120px',
        right: '10px',
        opacity: 0.12,
        pointerEvents: 'none',
        zIndex: 0
      }}>
        <Gavel size={54} color="#d97706" />
      </div>
      <Header title="🔨 Lelang Barang Sekolah" />

      {toastMessage && (
        <div style={{
          background: '#fef3c7',
          border: '1px solid #fcd34d',
          color: '#92400e',
          padding: '10px 14px',
          borderRadius: '12px',
          marginBottom: '14px',
          fontSize: '12px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Gavel size={16} color="#b45309" />
          <span>{toastMessage}</span>
        </div>
      )}

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

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', gap: '6px' }}>
                      <div>
                        <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>Harga Pembuka:</span>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: '#b45309' }}>
                          {formattedPrice}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {/* Tombol Edit Barang Lelang khusus Admin Guru BK */}
                        {isGuru && (
                          <button
                            onClick={() => setEditingItem({
                              ...item,
                              auctionPrice: item.auctionPrice || 15000
                            })}
                            style={{
                              background: '#eff6ff',
                              border: '1px solid #bfdbfe',
                              color: '#2563eb',
                              padding: '6px 10px',
                              borderRadius: '10px',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Edit3 size={13} />
                            Edit
                          </button>
                        )}
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
              </div>
            );
          })}
        </div>
      )}

      {/* EDIT LELANG MODAL FOR ADMIN GURU BK */}
      {editingItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '16px'
        }}>
          <div className="animate-fade" style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '20px',
            width: '100%',
            maxWidth: '420px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Edit3 size={18} color="#2563eb" />
                Edit Barang Lelang (Guru BK)
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Nama Barang */}
              <div>
                <label className="form-label" style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>
                  Nama / Judul Barang Lelang:
                </label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="Nama barang..."
                  style={{ fontSize: '13px', marginTop: '4px' }}
                />
              </div>

              {/* Harga Lelang */}
              <div>
                <label className="form-label" style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>
                  Harga Dasar Pembuka Lelang (Rp):
                </label>
                <input
                  type="number"
                  className="form-input"
                  required
                  value={editingItem.auctionPrice || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, auctionPrice: e.target.value })}
                  placeholder="Contoh: 50000"
                  style={{ fontSize: '13px', marginTop: '4px' }}
                />
              </div>

              {/* Kategori / Jenis */}
              <div>
                <label className="form-label" style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>
                  Kategori / Jenis Barang:
                </label>
                <select
                  className="form-input"
                  value={editingItem.category || 'lainnya'}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  style={{ fontSize: '13px', marginTop: '4px', background: '#ffffff' }}
                >
                  <option value="hp">📱 HP / Gadget</option>
                  <option value="buku">📚 Buku & Alat Tulis</option>
                  <option value="botol">🥤 Botol & Tempat Makan</option>
                  <option value="dompet">💼 Dompet & Tas</option>
                  <option value="aksesori">👓 Kacamata & Jam</option>
                  <option value="kunci">🔑 Kunci Motor & Loker</option>
                  <option value="pakaian">👕 Pakaian & Sepatu</option>
                  <option value="kartu">💳 Kartu & Uang</option>
                  <option value="lainnya">📦 Lain-lain</option>
                </select>
              </div>

              {/* Status Barang */}
              <div>
                <label className="form-label" style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>
                  Status Laporan:
                </label>
                <select
                  className="form-input"
                  value={editingItem.status || 'lelang'}
                  onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                  style={{ fontSize: '13px', marginTop: '4px', background: '#ffffff' }}
                >
                  <option value="lelang">🔨 Lelang Resmi BK</option>
                  <option value="hilang">🔴 Hilang</option>
                  <option value="ditemukan">🟢 Ditemukan</option>
                  <option value="selesai">🔵 Selesai (Sudah Diambil)</option>
                </select>
              </div>

              {/* Deskripsi */}
              <div>
                <label className="form-label" style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>
                  Deskripsi Barang:
                </label>
                <textarea
                  className="form-input"
                  rows={2}
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Deskripsi..."
                  style={{ fontSize: '12px', marginTop: '4px', resize: 'vertical' }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#64748b',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Save size={15} />
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
