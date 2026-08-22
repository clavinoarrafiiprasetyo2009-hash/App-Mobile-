import React, { useState } from 'react';
import Header from '../components/Header';
import { Clock, ShieldCheck, Search, Filter, CheckCircle2, AlertCircle, FileText, Users, ChevronRight, Gavel, DollarSign, ArrowRight, Edit3, Save, X, Tag } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function AdminDashboard({ items, onSelectItem, onUpdateItemStatus, onUpdateItemDetails }) {
  const [adminTab, setAdminTab] = useState('overview'); // 'overview' | 'reports' | 'pending' | 'auction-manage'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Price state for each item being set for auction
  const [auctionPrices, setAuctionPrices] = useState({});
  const [toastMessage, setToastMessage] = useState('');

  // Edit Item Modal State (Admin edit nama, harga, jenis/kategori, status, lokasi)
  const [editingItem, setEditingItem] = useState(null);

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

    setToastMessage(`✅ "${item.title}" berhasil dipindahkan ke Fitur Lelang dengan harga Rp ${Number(price).toLocaleString('id-ID')}!`);
    setTimeout(() => setToastMessage(''), 3500);
  };

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

    setToastMessage(`✅ Data barang "${editingItem.title}" berhasil diperbarui!`);
    setTimeout(() => setToastMessage(''), 3500);
    setEditingItem(null);
  };

  return (
    <div className="animate-fade">
      <Header title="Dashboard Guru & Admin BK" />

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

      {/* Admin Sub-Navigation Tabs */}
      <div style={{
        display: 'flex',
        background: '#f1f5f9',
        borderRadius: '12px',
        padding: '4px',
        marginBottom: '16px',
        border: '1px solid #e2e8f0',
        overflowX: 'auto'
      }}>
        <button
          onClick={() => setAdminTab('overview')}
          style={{
            flex: 1,
            padding: '8px 4px',
            borderRadius: '8px',
            border: 'none',
            background: adminTab === 'overview' ? '#2563eb' : 'transparent',
            color: adminTab === 'overview' ? 'white' : '#475569',
            fontWeight: 700,
            fontSize: '11px',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          📊 Ringkasan
        </button>

        <button
          onClick={() => setAdminTab('reports')}
          style={{
            flex: 1,
            padding: '8px 4px',
            borderRadius: '8px',
            border: 'none',
            background: adminTab === 'reports' ? '#2563eb' : 'transparent',
            color: adminTab === 'reports' ? 'white' : '#475569',
            fontWeight: 700,
            fontSize: '11px',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          📋 Kelola ({items.length})
        </button>

        <button
          onClick={() => setAdminTab('pending')}
          style={{
            flex: 1,
            padding: '8px 4px',
            borderRadius: '8px',
            border: 'none',
            background: adminTab === 'pending' ? '#2563eb' : 'transparent',
            color: adminTab === 'pending' ? 'white' : '#475569',
            fontWeight: 700,
            fontSize: '11px',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          ⏳ Pending ({pendingItems.length})
        </button>

        <button
          onClick={() => setAdminTab('auction-manage')}
          style={{
            flex: 1,
            padding: '8px 4px',
            borderRadius: '8px',
            border: 'none',
            background: adminTab === 'auction-manage' ? '#d97706' : 'transparent',
            color: adminTab === 'auction-manage' ? 'white' : '#475569',
            fontWeight: 700,
            fontSize: '11px',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          🔨 Lelang (&gt;30hr)
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {adminTab === 'overview' && (
        <>
          {/* Stat Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
            <div className="glass-card" style={{ padding: '10px 4px', textAlign: 'center', background: '#fef2f2', borderColor: '#fecaca' }}>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#dc2626' }}>{totalHilang}</span>
              <span style={{ fontSize: '10px', color: '#991b1b', display: 'block', marginTop: '2px', fontWeight: 700 }}>Hilang</span>
            </div>

            <div className="glass-card" style={{ padding: '10px 4px', textAlign: 'center', background: '#ecfdf5', borderColor: '#a7f3d0' }}>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#059669' }}>{totalDitemukan}</span>
              <span style={{ fontSize: '10px', color: '#065f46', display: 'block', marginTop: '2px', fontWeight: 700 }}>Ditemukan</span>
            </div>

            <div className="glass-card" style={{ padding: '10px 4px', textAlign: 'center', background: '#eff6ff', borderColor: '#bfdbfe' }}>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#2563eb' }}>{totalSelesai}</span>
              <span style={{ fontSize: '10px', color: '#1e40af', display: 'block', marginTop: '2px', fontWeight: 700 }}>Selesai</span>
            </div>

            <div className="glass-card" style={{ padding: '10px 4px', textAlign: 'center', background: '#fffbeb', borderColor: '#fde68a' }}>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#b45309' }}>{totalLelang}</span>
              <span style={{ fontSize: '10px', color: '#92400e', display: 'block', marginTop: '2px', fontWeight: 700 }}>Lelang</span>
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

      {/* AUCTION MANAGEMENT TAB (GURU BK ONLY) */}
      {adminTab === 'auction-manage' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '12px', padding: '12px', fontSize: '12px', color: '#92400e', fontWeight: 600 }}>
            🔨 <strong>Pengaturan Lelang Barang Unclaimed (&gt;30 Hari)</strong>: Sebagai Admin Guru BK, Anda dapat menetapkan harga dasar dan memindahkan barang temuan yang tidak diambil pemiliknya ke Halaman Lelang Sekolah.
          </div>

          <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
            Pilih Barang untuk Dikelola ke Lelang ({foundUnclaimedItems.length}):
          </h4>

          {foundUnclaimedItems.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '24px', color: '#64748b', fontSize: '12px' }}>
              Tidak ada barang temuan aktif yang bisa dipindahkan ke lelang saat ini.
            </div>
          ) : (
            foundUnclaimedItems.map(item => (
              <div key={item.id} className="glass-card" style={{ padding: '12px', borderColor: '#fcd34d' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
                  <img src={item.image} alt={item.title} style={{ width: '54px', height: '54px', borderRadius: '10px', objectFit: 'cover' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span className={`badge badge-${item.status}`} style={{ fontSize: '9px', padding: '2px 6px', marginBottom: '4px' }}>
                      {item.status.toUpperCase()}
                    </span>
                    <h5 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.title}
                    </h5>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>
                      Pelapor: {item.reporter.name} • {item.location}
                    </span>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Set Harga Pembuka Lelang (Rp):
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="number"
                      className="form-input"
                      style={{ flex: 1, padding: '8px 10px', fontSize: '12px', background: '#ffffff' }}
                      placeholder="Contoh: 15000"
                      value={auctionPrices[item.id] || ''}
                      onChange={(e) => setAuctionPrices({ ...auctionPrices, [item.id]: e.target.value })}
                    />
                    <button
                      onClick={() => handleSetAuction(item)}
                      style={{
                        background: 'linear-gradient(135deg, #d97706, #b45309)',
                        color: 'white',
                        border: 'none',
                        padding: '8px 14px',
                        borderRadius: '10px',
                        fontSize: '11px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Gavel size={14} />
                      Pindah ke Lelang
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* REPORTS TAB */}
      {adminTab === 'reports' && (
        <>
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

          <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', overflowX: 'auto', paddingBottom: '2px' }}>
            {['all', 'hilang', 'ditemukan', 'lelang', 'selesai'].map((st) => (
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredItems.map(item => (
              <div
                key={item.id}
                className="glass-card"
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px' }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  onClick={() => onSelectItem(item)}
                  style={{ width: '46px', height: '46px', borderRadius: '10px', objectFit: 'cover', cursor: 'pointer' }}
                />
                <div
                  onClick={() => onSelectItem(item)}
                  style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}
                >
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

                {/* Tombol Edit Barang khusus Admin BK */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingItem({
                      ...item,
                      auctionPrice: item.auctionPrice || 15000
                    });
                  }}
                  style={{
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    color: '#2563eb',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flexShrink: 0
                  }}
                >
                  <Edit3 size={13} />
                  Edit
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* EDIT ITEM MODAL FOR ADMIN BK */}
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
                Edit Data Barang (Admin BK)
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
                  Nama / Judul Barang:
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
                  value={editingItem.status || 'hilang'}
                  onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                  style={{ fontSize: '13px', marginTop: '4px', background: '#ffffff' }}
                >
                  <option value="hilang">🔴 Hilang</option>
                  <option value="ditemukan">🟢 Ditemukan</option>
                  <option value="lelang">🔨 Lelang Resmi BK</option>
                  <option value="selesai">🔵 Selesai (Sudah Diambil)</option>
                </select>
              </div>

              {/* Harga Lelang */}
              <div>
                <label className="form-label" style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>
                  Harga Dasar / Pembuka Lelang (Rp):
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={editingItem.auctionPrice || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, auctionPrice: e.target.value })}
                  placeholder="Contoh: 50000"
                  style={{ fontSize: '13px', marginTop: '4px' }}
                />
              </div>

              {/* Lokasi */}
              <div>
                <label className="form-label" style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>
                  Lokasi Ditemukan / Hilang:
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={editingItem.location || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                  placeholder="Lokasi barang..."
                  style={{ fontSize: '13px', marginTop: '4px' }}
                />
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
