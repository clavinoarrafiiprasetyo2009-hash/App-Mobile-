import React, { useState } from 'react';
import Header from '../components/Header';
import { Clock, ShieldCheck, Search, Filter, CheckCircle2, AlertCircle, FileText, Users, ChevronRight, Gavel, DollarSign, ArrowRight, Edit3, Save, X, Tag, Plus, UserPlus, Phone, BookOpen, MessageCircle, BarChart3, ShieldAlert, Gift, PhoneCall, Sparkles, TrendingUp, Layers, Package, Trash2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function AdminDashboard({ 
  items, 
  contacts = [], 
  pointRedemptions = [],
  rewardsCatalog = [],
  onAddRewardItem,
  onUpdateRewardStock,
  onUpdateRewardDetails,
  onCompleteClaim,
  onDeleteItem,
  onDeleteClaim,
  onDeleteReward,
  onSelectItem, 
  onUpdateItemStatus, 
  onUpdateItemDetails, 
  onUpdateContacts,
  onApprovePublication,
  onRejectPublication 
}) {
  const [adminTab, setAdminTab] = useState('overview'); // 'overview' | 'moderation' | 'reports' | 'pending' | 'auction-manage' | 'contacts' | 'points-manage'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Edit Reward Item Modal State (Admin edit harga poin, nama, stok, dll)
  const [editingReward, setEditingReward] = useState(null);

  // Add Reward Modal State
  const [isAddRewardModalOpen, setIsAddRewardModalOpen] = useState(false);
  const [newRewTitle, setNewRewTitle] = useState('');
  const [newRewPoints, setNewRewPoints] = useState('5');
  const [newRewCategory, setNewRewCategory] = useState('Alat Tulis');
  const [newRewStock, setNewRewStock] = useState('10');
  const [newRewImage, setNewRewImage] = useState('https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400');
  const [newRewDesc, setNewRewDesc] = useState('');

  // Price state for each item being set for auction
  const [auctionPrices, setAuctionPrices] = useState({});
  const [toastMessage, setToastMessage] = useState('');
  const [deleteConfirmState, setDeleteConfirmState] = useState(null);

  // Edit Item Modal State (Admin edit nama, harga, jenis/kategori, status, lokasi)
  const [editingItem, setEditingItem] = useState(null);

  // Edit/Add Contact State (Admin edit/tambah kontak BK / SP2K)
  const [editingContact, setEditingContact] = useState(null);
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);

  const totalHilang = items.filter(i => i.status === 'hilang').length;
  const totalDitemukan = items.filter(i => i.status === 'ditemukan').length;
  const totalSelesai = items.filter(i => i.status === 'selesai').length;
  const totalLelang = items.filter(i => i.status === 'lelang' || i.isAuction).length;

  const pendingApprovalItems = items.filter(i => i.isPublished === false);

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

      {/* Admin Sub-Navigation Tabs - Glassmorphism & Smooth Touch Scroll */}
      <div 
        className="no-scrollbar"
        style={{
          display: 'flex',
          gap: '6px',
          background: 'rgba(241, 245, 249, 0.95)',
          backdropFilter: 'blur(12px)',
          borderRadius: '16px',
          padding: '6px',
          marginBottom: '18px',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)',
          width: '100%',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <button
          onClick={() => setAdminTab('overview')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '12px',
            border: 'none',
            background: adminTab === 'overview' ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : 'transparent',
            color: adminTab === 'overview' ? '#ffffff' : '#64748b',
            fontWeight: adminTab === 'overview' ? 700 : 600,
            fontSize: '12px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            boxShadow: adminTab === 'overview' ? '0 4px 12px rgba(37, 99, 235, 0.25)' : 'none',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            flexShrink: 0
          }}
        >
          <BarChart3 size={15} color={adminTab === 'overview' ? '#ffffff' : '#64748b'} />
          <span>Stats</span>
        </button>

        <button
          onClick={() => setAdminTab('moderation')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '12px',
            background: adminTab === 'moderation' ? 'linear-gradient(135deg, #dc2626, #b91c1c)' : (pendingApprovalItems.length > 0 ? '#fef2f2' : 'transparent'),
            color: adminTab === 'moderation' ? '#ffffff' : (pendingApprovalItems.length > 0 ? '#dc2626' : '#64748b'),
            fontWeight: adminTab === 'moderation' ? 700 : 600,
            fontSize: '12px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            border: pendingApprovalItems.length > 0 && adminTab !== 'moderation' ? '1px solid #fecaca' : 'none',
            boxShadow: adminTab === 'moderation' ? '0 4px 12px rgba(220, 38, 38, 0.25)' : 'none',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            flexShrink: 0
          }}
        >
          <ShieldAlert size={15} color={adminTab === 'moderation' ? '#ffffff' : (pendingApprovalItems.length > 0 ? '#dc2626' : '#64748b')} />
          <span>Moderasi</span>
          {pendingApprovalItems.length > 0 && (
            <span style={{
              background: adminTab === 'moderation' ? '#ffffff' : '#dc2626',
              color: adminTab === 'moderation' ? '#dc2626' : '#ffffff',
              fontSize: '10px',
              fontWeight: 800,
              padding: '1px 6px',
              borderRadius: '99px',
              marginLeft: '2px'
            }}>
              {pendingApprovalItems.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('reports')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '12px',
            border: 'none',
            background: adminTab === 'reports' ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : 'transparent',
            color: adminTab === 'reports' ? '#ffffff' : '#64748b',
            fontWeight: adminTab === 'reports' ? 700 : 600,
            fontSize: '12px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            boxShadow: adminTab === 'reports' ? '0 4px 12px rgba(37, 99, 235, 0.25)' : 'none',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            flexShrink: 0
          }}
        >
          <FileText size={15} color={adminTab === 'reports' ? '#ffffff' : '#64748b'} />
          <span>Kelola</span>
        </button>

        <button
          onClick={() => setAdminTab('pending')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '12px',
            border: 'none',
            background: adminTab === 'pending' ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : 'transparent',
            color: adminTab === 'pending' ? '#ffffff' : '#64748b',
            fontWeight: adminTab === 'pending' ? 700 : 600,
            fontSize: '12px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            boxShadow: adminTab === 'pending' ? '0 4px 12px rgba(37, 99, 235, 0.25)' : 'none',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            flexShrink: 0
          }}
        >
          <Clock size={15} color={adminTab === 'pending' ? '#ffffff' : '#64748b'} />
          <span>Pending</span>
        </button>

        <button
          onClick={() => setAdminTab('auction-manage')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '12px',
            border: 'none',
            background: adminTab === 'auction-manage' ? 'linear-gradient(135deg, #d97706, #b45309)' : 'transparent',
            color: adminTab === 'auction-manage' ? '#ffffff' : '#64748b',
            fontWeight: adminTab === 'auction-manage' ? 700 : 600,
            fontSize: '12px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            boxShadow: adminTab === 'auction-manage' ? '0 4px 12px rgba(217, 119, 6, 0.25)' : 'none',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            flexShrink: 0
          }}
        >
          <Gavel size={15} color={adminTab === 'auction-manage' ? '#ffffff' : '#64748b'} />
          <span>Lelang</span>
        </button>

        <button
          onClick={() => setAdminTab('contacts')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '12px',
            border: 'none',
            background: adminTab === 'contacts' ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : 'transparent',
            color: adminTab === 'contacts' ? '#ffffff' : '#64748b',
            fontWeight: adminTab === 'contacts' ? 700 : 600,
            fontSize: '12px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            boxShadow: adminTab === 'contacts' ? '0 4px 12px rgba(124, 58, 237, 0.25)' : 'none',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            flexShrink: 0
          }}
        >
          <PhoneCall size={15} color={adminTab === 'contacts' ? '#ffffff' : '#64748b'} />
          <span>Kontak</span>
        </button>

        <button
          onClick={() => setAdminTab('points-manage')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '12px',
            border: 'none',
            background: adminTab === 'points-manage' ? 'linear-gradient(135deg, #4f46e5, #4338ca)' : 'transparent',
            color: adminTab === 'points-manage' ? '#ffffff' : '#64748b',
            fontWeight: adminTab === 'points-manage' ? 700 : 600,
            fontSize: '12px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            boxShadow: adminTab === 'points-manage' ? '0 4px 12px rgba(79, 70, 229, 0.25)' : 'none',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            flexShrink: 0
          }}
        >
          <Gift size={15} color={adminTab === 'points-manage' ? '#ffffff' : '#64748b'} />
          <span>Klaim Poin</span>
        </button>
      </div>

      {/* POINTS & REWARDS MANAGEMENT TAB */}
      {adminTab === 'points-manage' && (
        <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#e0e7ff', border: '1px solid #c7d2fe', padding: '14px', borderRadius: '16px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#3730a3', marginBottom: '4px' }}>
              🎁 Kelola Penukaran Poin, Stok Hadiah & Klaim Siswa ⭐
            </h4>
            <p style={{ fontSize: '12px', color: '#4338ca', lineHeight: 1.4 }}>
              Setiap kali laporan foto siswa disetujui (ACC) oleh Admin BK, pelapor menerima <strong>+1 Poin</strong>. Admin dapat mengelola stok pcs barang hadiah dan memverifikasi alamat pengiriman klaim siswa di bawah ini.
            </p>
          </div>

          {/* 1. Pengajuan Klaim Hadiah Siswa */}
          <div className="glass-card" style={{ padding: '14px', borderRadius: '16px', background: 'white' }}>
            <h5 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
              📋 Daftar Pengajuan Klaim Hadiah Siswa ({pointRedemptions.length})
            </h5>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pointRedemptions.length === 0 ? (
                <div style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic', padding: '16px 0', textAlign: 'center' }}>
                  Belum ada pengajuan klaim hadiah dari siswa.
                </div>
              ) : (
                pointRedemptions.map((item, idx) => (
                  <div key={idx} style={{
                    padding: '12px',
                    background: item.status === 'claimed' ? '#f1f5f9' : '#fffdf5',
                    borderRadius: '12px',
                    border: item.status === 'claimed' ? '1px solid #cbd5e1' : '1px solid #fde68a',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{item.rewardTitle}</span>
                        <span style={{ fontSize: '11px', color: '#4f46e5', fontWeight: 800, marginLeft: '8px' }}>
                          ({item.pointsCost} Poin)
                        </span>
                      </div>
                      <span style={{
                        fontSize: '10px',
                        background: item.status === 'claimed' ? '#e2e8f0' : '#d1fae5',
                        color: item.status === 'claimed' ? '#64748b' : '#059669',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontWeight: 800
                      }}>
                        {item.status === 'claimed' ? '✅ Selesai' : '⏳ Pending Klaim'}
                      </span>
                    </div>

                    <div style={{ fontSize: '11px', color: '#334155' }}>
                      <strong>Siswa:</strong> {item.studentName} ({item.studentClass || 'Siswa'}) • <strong>No. Telp:</strong> {item.studentPhone || '081234567890'}
                    </div>

                    <div style={{ fontSize: '11px', color: '#4f46e5', background: '#eff6ff', padding: '6px 10px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                      📍 <strong>Alamat Pengiriman / Lokasi:</strong> {item.deliveryAddress || 'Ruang BK Sekolah'}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#1e293b' }}>
                        Kode Klaim: <span style={{ background: '#e0e7ff', padding: '2px 8px', borderRadius: '6px', letterSpacing: '1px' }}>{item.claimCode}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {item.status !== 'claimed' && onCompleteClaim && (
                          <button
                            onClick={() => {
                              onCompleteClaim(item.claimCode);
                              setToastMessage(`✅ Klaim ${item.rewardTitle} untuk ${item.studentName} ditandai selesai!`);
                              setTimeout(() => setToastMessage(''), 3500);
                            }}
                            style={{
                              background: '#059669',
                              color: 'white',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Tandai Selesai
                          </button>
                        )}

                        {onDeleteClaim && (
                          <button
                            onClick={() => {
                              setDeleteConfirmState({
                                title: `Hapus pengajuan klaim "${item.rewardTitle}" untuk ${item.studentName}?`,
                                onConfirm: () => {
                                  onDeleteClaim(item.claimCode);
                                  setToastMessage(`🗑️ Pengajuan klaim "${item.rewardTitle}" berhasil dihapus!`);
                                  setTimeout(() => setToastMessage(''), 3500);
                                }
                              });
                            }}
                            title="Hapus Pengajuan Klaim Ini"
                            style={{
                              background: '#fef2f2',
                              border: '1px solid #fecaca',
                              color: '#dc2626',
                              padding: '6px 10px',
                              borderRadius: '8px',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Trash2 size={13} />
                            Hapus
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 2. Kelola Stok Katalog Hadiah Admin */}
          <div className="glass-card" style={{ padding: '14px', borderRadius: '16px', background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h5 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                🎁 Kelola Katalog Hadiah & Stok Pcs ({rewardsCatalog.length})
              </h5>

              <button
                onClick={() => setIsAddRewardModalOpen(true)}
                style={{
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Plus size={14} /> Tambah Hadiah Baru
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {rewardsCatalog.map((rew) => (
                <div key={rew.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={rew.image} alt={rew.title} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>{rew.title}</div>
                      <div style={{ fontSize: '10px', color: '#4f46e5', fontWeight: 700 }}>
                        Biaya: {rew.pointsCost} Poin • Stok Saat Ini: <strong style={{ color: rew.stock > 0 ? '#059669' : '#dc2626' }}>{rew.stock} pcs</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* Tombol Edit Biaya Poin & Hadiah */}
                    <button
                      onClick={() => setEditingReward(rew)}
                      style={{
                        background: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        color: '#2563eb',
                        padding: '5px 10px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="Edit Biaya Poin & Stok Hadiah"
                    >
                      <Edit3 size={13} /> Edit
                    </button>

                    {onDeleteReward && (
                      <button
                        onClick={() => {
                          setDeleteConfirmState({
                            title: `Hapus item hadiah "${rew.title}" dari katalog secara permanen?`,
                            onConfirm: () => {
                              onDeleteReward(rew.id);
                              setToastMessage(`🗑️ Item hadiah "${rew.title}" berhasil dihapus dari katalog!`);
                              setTimeout(() => setToastMessage(''), 3500);
                            }
                          });
                        }}
                        title="Hapus Item Hadiah Dari Katalog"
                        style={{
                          background: '#fef2f2',
                          border: '1px solid #fecaca',
                          color: '#dc2626',
                          padding: '5px 8px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button
                        onClick={() => onUpdateRewardStock && onUpdateRewardStock(rew.id, Math.max(0, rew.stock - 1))}
                        style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', fontWeight: 800, cursor: 'pointer' }}
                        title="Kurangi Stok 1"
                      >
                        -
                      </button>
                      <span style={{ fontSize: '12px', fontWeight: 800, width: '22px', textAlign: 'center' }}>{rew.stock}</span>
                      <button
                        onClick={() => onUpdateRewardStock && onUpdateRewardStock(rew.id, rew.stock + 1)}
                        style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', fontWeight: 800, cursor: 'pointer' }}
                        title="Tambah Stok 1"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODERATION TAB (Persetujuan Postingan Laporan Siswa Baru) */}
      {adminTab === 'moderation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>Moderasi Postingan Siswa 🛡️</h4>
              <p style={{ fontSize: '11px', color: '#64748b' }}>Tinjau laporan baru sebelum ditayangkan di Beranda publik.</p>
            </div>
            <span style={{
              background: pendingApprovalItems.length > 0 ? '#fef2f2' : '#f0fdf4',
              color: pendingApprovalItems.length > 0 ? '#dc2626' : '#166534',
              fontSize: '11px',
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: '20px',
              border: `1px solid ${pendingApprovalItems.length > 0 ? '#fecaca' : '#bbf7d0'}`
            }}>
              {pendingApprovalItems.length} Menunggu Persetujuan
            </span>
          </div>

          {pendingApprovalItems.length === 0 ? (
            <div style={{
              background: '#f8fafc',
              border: '2px dashed #cbd5e1',
              borderRadius: '20px',
              padding: '32px 16px',
              textAlign: 'center'
            }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '50%',
                background: '#f0fdf4', color: '#166534',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px'
              }}>
                <CheckCircle2 size={28} />
              </div>
              <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                Semua Postingan Bersih & Ter-moderasi! 🎉
              </h4>
              <p style={{ fontSize: '11px', color: '#64748b', maxWidth: '280px', margin: '0 auto', lineHeight: '1.4' }}>
                Tidak ada laporan siswa yang tertunda. Semua postingan baru di Beranda telah disetujui Guru BK.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pendingApprovalItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #fecaca',
                    borderRadius: '16px',
                    padding: '14px',
                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                        <span style={{
                          background: item.status === 'hilang' ? '#fef2f2' : '#f0fdf4',
                          color: item.status === 'hilang' ? '#dc2626' : '#166534',
                          fontSize: '10px',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: '6px'
                        }}>
                          {item.status === 'hilang' ? '🔴 HILANG' : '🟢 DITEMUKAN'}
                        </span>
                        <span style={{ fontSize: '10px', color: '#94a3b8' }}>• {item.date}</span>
                      </div>
                      <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {item.title}
                      </h4>
                      <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                        📍 {item.location}
                      </p>
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '10px', fontSize: '11px', color: '#334155' }}>
                    <strong>Pelapor:</strong> {item.reporter.name} ({item.reporter.role})<br />
                    <strong>Deskripsi:</strong> {item.description || 'Tidak ada deskripsi.'}
                  </div>

                  {/* Moderation Actions */}
                  <div style={{ display: 'flex', gap: '8px', paddingTop: '6px', borderTop: '1px dashed #e2e8f0' }}>
                    <button
                      onClick={() => {
                        if (onApprovePublication) onApprovePublication(item.id);
                        setToastMessage(`✅ Laporan "${item.title}" disetujui, dipublikasikan & +1 Poin diberikan ke pelapor! 🎉`);
                        setTimeout(() => setToastMessage(''), 3500);
                      }}
                      style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #16a34a, #15803d)',
                        color: 'white',
                        padding: '8px',
                        borderRadius: '10px',
                        fontSize: '11px',
                        fontWeight: 800,
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      <CheckCircle2 size={14} />
                      Setujui & Publikasikan
                    </button>

                    <button
                      onClick={() => {
                        setDeleteConfirmState({
                          title: `Tolak dan hapus laporan "${item.title}"?`,
                          onConfirm: () => {
                            if (onRejectPublication) onRejectPublication(item.id);
                            setToastMessage(`❌ Laporan "${item.title}" ditolak & dihapus.`);
                            setTimeout(() => setToastMessage(''), 3500);
                          }
                        });
                      }}
                      style={{
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        color: '#dc2626',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        fontSize: '11px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <X size={14} />
                      Tolak
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* OVERVIEW TAB */}
      {adminTab === 'overview' && (
        <>
          {/* Stat Cards Grid - Executive Gradient Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '18px' }}>
            <div 
              className="glass-card" 
              style={{ 
                padding: '12px 8px', 
                textAlign: 'center', 
                background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)', 
                borderColor: '#fecaca',
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.06)'
              }}
            >
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#dc2626', lineHeight: 1 }}>{totalHilang}</div>
              <span style={{ fontSize: '11px', color: '#991b1b', display: 'block', marginTop: '4px', fontWeight: 700 }}>🔴 Hilang</span>
            </div>

            <div 
              className="glass-card" 
              style={{ 
                padding: '12px 8px', 
                textAlign: 'center', 
                background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', 
                borderColor: '#a7f3d0',
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.06)'
              }}
            >
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#059669', lineHeight: 1 }}>{totalDitemukan}</div>
              <span style={{ fontSize: '11px', color: '#065f46', display: 'block', marginTop: '4px', fontWeight: 700 }}>🟢 Ditemukan</span>
            </div>

            <div 
              className="glass-card" 
              style={{ 
                padding: '12px 8px', 
                textAlign: 'center', 
                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', 
                borderColor: '#bfdbfe',
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.06)'
              }}
            >
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#2563eb', lineHeight: 1 }}>{totalSelesai}</div>
              <span style={{ fontSize: '11px', color: '#1e40af', display: 'block', marginTop: '4px', fontWeight: 700 }}>🔵 Selesai</span>
            </div>

            <div 
              className="glass-card" 
              style={{ 
                padding: '12px 8px', 
                textAlign: 'center', 
                background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', 
                borderColor: '#fde68a',
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(217, 119, 6, 0.06)'
              }}
            >
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#b45309', lineHeight: 1 }}>{totalLelang}</div>
              <span style={{ fontSize: '11px', color: '#92400e', display: 'block', marginTop: '4px', fontWeight: 700 }}>🔨 Lelang</span>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {onDeleteItem && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmState({
                          title: `Hapus laporan "${item.title}" ini secara permanen?`,
                          onConfirm: () => {
                            onDeleteItem(item.id);
                            setToastMessage(`🗑️ Laporan "${item.title}" berhasil dihapus!`);
                            setTimeout(() => setToastMessage(''), 3500);
                          }
                        });
                      }}
                      title="Hapus Laporan Ini"
                      style={{
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        color: '#dc2626',
                        padding: '5px 8px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                  <ChevronRight size={16} color="#94a3b8" />
                </div>
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

                    {onDeleteItem && (
                      <button
                        onClick={() => {
                          setDeleteConfirmState({
                            title: `Hapus barang temuan "${item.title}" ini secara permanen?`,
                            onConfirm: () => {
                              onDeleteItem(item.id);
                              setToastMessage(`🗑️ Barang "${item.title}" berhasil dihapus!`);
                              setTimeout(() => setToastMessage(''), 3500);
                            }
                          });
                        }}
                        title="Hapus Barang Ini"
                        style={{
                          background: '#fef2f2',
                          border: '1px solid #fecaca',
                          color: '#dc2626',
                          padding: '8px 12px',
                          borderRadius: '10px',
                          fontSize: '11px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Trash2 size={14} />
                        Hapus
                      </button>
                    )}
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

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
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
                      gap: '4px'
                    }}
                  >
                    <Edit3 size={13} />
                    Edit
                  </button>

                  {/* Tombol Hapus Barang khusus Admin BK */}
                  {onDeleteItem && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmState({
                          title: `Hapus laporan "${item.title}" ini secara permanen?`,
                          onConfirm: () => {
                            onDeleteItem(item.id);
                            setToastMessage(`🗑️ Laporan "${item.title}" berhasil dihapus!`);
                            setTimeout(() => setToastMessage(''), 3500);
                          }
                        });
                      }}
                      title="Hapus Laporan Ini"
                      style={{
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        color: '#dc2626',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Trash2 size={13} />
                      Hapus
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* CONTACTS MANAGEMENT TAB (3 Guru BK & 2 SP2K) */}
      {adminTab === 'contacts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>Kelola Kontak BK & SP2K 💬</h4>
              <p style={{ fontSize: '11px', color: '#64748b' }}>Atur daftar 3 Guru BK (sesuai kelas diampu) & 2 Tim SP2K.</p>
            </div>
            <button
              onClick={() => {
                setEditingContact({
                  id: 'contact-' + Date.now(),
                  name: '',
                  role: 'guru_bk',
                  title: 'Guru BK Kelas...',
                  classes: 'Kelas...',
                  phone: '08',
                  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
                  schedule: 'Senin - Jumat (07:00 - 15:30 WIB)',
                  location: 'Ruang BK Lt. 1'
                });
                setIsAddContactModalOpen(true);
              }}
              className="btn-primary"
              style={{ padding: '8px 12px', fontSize: '11px', gap: '4px' }}
            >
              <UserPlus size={14} />
              + Tambah Kontak
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {contacts.map((c, index) => {
              const isBk = c.role === 'guru_bk';
              return (
                <div
                  key={c.id || index}
                  style={{
                    background: isBk ? '#ffffff' : '#f0fdf4',
                    border: `1.5px solid ${isBk ? '#e9d5ff' : '#a7f3d0'}`,
                    borderRadius: '16px',
                    padding: '14px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={c.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2'}
                      alt={c.name}
                      style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${isBk ? '#7c3aed' : '#059669'}` }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{c.name}</h4>
                        <span style={{
                          background: isBk ? '#f3e8ff' : '#d1fae5',
                          color: isBk ? '#7c3aed' : '#047857',
                          fontSize: '10px',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: '6px'
                        }}>
                          {isBk ? '🏫 GURU BK' : '🛡️ TIM SP2K'}
                        </span>
                      </div>
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>{c.title}</span>
                      <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 700, marginTop: '2px' }}>
                        📍 Kelas Diampu: {c.classes}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px dashed #e2e8f0' }}>
                    <div style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>
                      📞 WA: <strong>{c.phone}</strong>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <a
                        href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '').startsWith('0') ? '62' + c.phone.replace(/[^0-9]/g, '').slice(1) : c.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: 'linear-gradient(135deg, #25d366, #128c7e)',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: 800,
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <MessageCircle size={13} />
                        Chat WA
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* EDIT / ADD CONTACT MODAL */}
      {(editingContact || isAddContactModalOpen) && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: '16px'
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
                <UserPlus size={18} color="#7c3aed" />
                {isAddContactModalOpen ? 'Tambah Kontak BK/SP2K Baru' : 'Edit Kontak BK/SP2K'}
              </h3>
              <button
                onClick={() => { setEditingContact(null); setIsAddContactModalOpen(false); }}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              let updatedContacts;
              if (isAddContactModalOpen) {
                updatedContacts = [...contacts, editingContact];
              } else {
                updatedContacts = contacts.map(c => c.id === editingContact.id ? editingContact : c);
              }
              if (onUpdateContacts) onUpdateContacts(updatedContacts);
              setEditingContact(null);
              setIsAddContactModalOpen(false);
              setToastMessage('✅ Data kontak Guru BK / SP2K berhasil diperbarui!');
              setTimeout(() => setToastMessage(''), 3500);
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Nama */}
                <div>
                  <label className="form-label" style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>
                    Nama Lengkap (Gelar/Role): *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    value={editingContact?.name || ''}
                    onChange={(e) => setEditingContact({ ...editingContact, name: e.target.value })}
                    placeholder="Contoh: Ibu Rina, S.Pd"
                    style={{ fontSize: '13px', marginTop: '4px' }}
                  />
                </div>

                {/* Peran / Role */}
                <div>
                  <label className="form-label" style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>
                    Kategori / Peran: *
                  </label>
                  <select
                    className="form-input"
                    value={editingContact?.role || 'guru_bk'}
                    onChange={(e) => setEditingContact({ ...editingContact, role: e.target.value })}
                    style={{ fontSize: '13px', marginTop: '4px', background: '#ffffff' }}
                  >
                    <option value="guru_bk">🏫 Guru BK</option>
                    <option value="sp2k">🛡️ Tim SP2K (Organisasi)</option>
                  </select>
                </div>

                {/* Judul Jabatan */}
                <div>
                  <label className="form-label" style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>
                    Jabatan / Judul: *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    value={editingContact?.title || ''}
                    onChange={(e) => setEditingContact({ ...editingContact, title: e.target.value })}
                    placeholder="Contoh: Guru BK Kelas X / Piket SP2K Pagi"
                    style={{ fontSize: '13px', marginTop: '4px' }}
                  />
                </div>

                {/* Kelas Yang Diampu */}
                <div>
                  <label className="form-label" style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>
                    Daftar Kelas Yang Diampu: *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    value={editingContact?.classes || ''}
                    onChange={(e) => setEditingContact({ ...editingContact, classes: e.target.value })}
                    placeholder="Contoh: Kelas X (Semua Jurusan)"
                    style={{ fontSize: '13px', marginTop: '4px' }}
                  />
                </div>

                {/* No WhatsApp */}
                <div>
                  <label className="form-label" style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>
                    No. WhatsApp Aktif: *
                  </label>
                  <input
                    type="tel"
                    className="form-input"
                    required
                    value={editingContact?.phone || ''}
                    onChange={(e) => setEditingContact({ ...editingContact, phone: e.target.value })}
                    placeholder="Contoh: 081299887766"
                    style={{ fontSize: '13px', marginTop: '4px' }}
                  />
                </div>

                {/* Jadwal */}
                <div>
                  <label className="form-label" style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>
                    Jadwal Layanan / Piket:
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingContact?.schedule || ''}
                    onChange={(e) => setEditingContact({ ...editingContact, schedule: e.target.value })}
                    placeholder="Contoh: Senin - Jumat (07:00 - 15:30 WIB)"
                    style={{ fontSize: '13px', marginTop: '4px' }}
                  />
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => { setEditingContact(null); setIsAddContactModalOpen(false); }}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      background: '#f8fafc',
                      color: '#475569',
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
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #7c3aed, #6d28d9)'
                    }}
                  >
                    <Save size={15} />
                    Simpan Kontak
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
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
                {onDeleteItem && (
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteConfirmState({
                        title: `Hapus laporan "${editingItem.title}" ini secara permanen?`,
                        onConfirm: () => {
                          onDeleteItem(editingItem.id);
                          setEditingItem(null);
                          setToastMessage(`🗑️ Laporan "${editingItem.title}" berhasil dihapus!`);
                          setTimeout(() => setToastMessage(''), 3500);
                        }
                      });
                    }}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '12px',
                      border: '1px solid #fecaca',
                      background: '#fef2f2',
                      color: '#dc2626',
                      fontWeight: 800,
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Trash2 size={15} />
                    Hapus
                  </button>
                )}
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
                  Simpan
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
      {/* MODAL TAMBAH HADIAH BARU (ADMIN) */}
      {isAddRewardModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div className="animate-slide-up" style={{
            background: '#ffffff',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '400px',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                🎁 Tambah Hadiah Poin Baru
              </h3>
              <button
                onClick={() => setIsAddRewardModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newRewTitle.trim()) return;

              const newItem = {
                id: `rew-${Date.now()}`,
                title: newRewTitle,
                pointsCost: parseInt(newRewPoints, 10) || 5,
                category: newRewCategory,
                stock: parseInt(newRewStock, 10) || 10,
                image: newRewImage || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400',
                description: newRewDesc || 'Barang hadiah resmi SiTemu Sekolah.'
              };

              if (onAddRewardItem) onAddRewardItem(newItem);
              setIsAddRewardModalOpen(false);
              setNewRewTitle('');
              setNewRewDesc('');
              setToastMessage(`✅ Hadiah "${newItem.title}" berhasil ditambahkan ke Katalog Poin!`);
              setTimeout(() => setToastMessage(''), 3500);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Nama Hadiah / Merchandise:</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Misal: Gantungan Kunci SiTemu"
                  value={newRewTitle}
                  onChange={(e) => setNewRewTitle(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Biaya Poin:</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="form-input"
                    value={newRewPoints}
                    onChange={(e) => setNewRewPoints(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Stok Pcs:</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="form-input"
                    value={newRewStock}
                    onChange={(e) => setNewRewStock(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Kategori:</label>
                <select
                  className="form-input"
                  value={newRewCategory}
                  onChange={(e) => setNewRewCategory(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box' }}
                >
                  <option value="Alat Tulis">Alat Tulis</option>
                  <option value="Aksesoris">Aksesoris</option>
                  <option value="Merchandise">Merchandise</option>
                  <option value="Voucher">Voucher</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>URL Gambar Hadiah:</label>
                <input
                  type="url"
                  className="form-input"
                  value={newRewImage}
                  onChange={(e) => setNewRewImage(e.target.value)}
                  placeholder="https://..."
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Deskripsi:</label>
                <textarea
                  className="form-input"
                  rows={2}
                  value={newRewDesc}
                  onChange={(e) => setNewRewDesc(e.target.value)}
                  placeholder="Deskripsi singkat..."
                  style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddRewardModalOpen(false)}
                  style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#fff', color: '#64748b', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
                >
                  Simpan Hadiah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT BIAYA POIN & DETAILS HADIAH (ADMIN) */}
      {editingReward && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div className="animate-slide-up" style={{
            background: '#ffffff',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '400px',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                ✏️ Edit Harga Poin & Details Hadiah
              </h3>
              <button
                onClick={() => setEditingReward(null)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (onUpdateRewardDetails) {
                onUpdateRewardDetails(editingReward.id, {
                  title: editingReward.title,
                  pointsCost: editingReward.pointsCost,
                  stock: editingReward.stock,
                  category: editingReward.category,
                  description: editingReward.description,
                  image: editingReward.image
                });
              }
              setEditingReward(null);
              setToastMessage(`✅ Hadiah "${editingReward.title}" berhasil diperbarui! Harga Poin: ${editingReward.pointsCost} Poin`);
              setTimeout(() => setToastMessage(''), 3500);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Nama Hadiah:</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={editingReward.title || ''}
                  onChange={(e) => setEditingReward({ ...editingReward, title: e.target.value })}
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#4f46e5', display: 'block', marginBottom: '4px' }}>
                    ⭐️ Harga / Biaya Poin:
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="form-input"
                    value={editingReward.pointsCost || ''}
                    onChange={(e) => setEditingReward({ ...editingReward, pointsCost: e.target.value })}
                    style={{ width: '100%', boxSizing: 'border-box', border: '2px solid #6366f1', background: '#e0e7ff', fontWeight: 800 }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Stok Pcs:</label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="form-input"
                    value={editingReward.stock !== undefined ? editingReward.stock : ''}
                    onChange={(e) => setEditingReward({ ...editingReward, stock: e.target.value })}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Kategori:</label>
                <select
                  className="form-input"
                  value={editingReward.category || 'Alat Tulis'}
                  onChange={(e) => setEditingReward({ ...editingReward, category: e.target.value })}
                  style={{ width: '100%', boxSizing: 'border-box' }}
                >
                  <option value="Alat Tulis">Alat Tulis</option>
                  <option value="Aksesoris">Aksesoris</option>
                  <option value="Merchandise">Merchandise</option>
                  <option value="Voucher">Voucher</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>URL Gambar:</label>
                <input
                  type="url"
                  className="form-input"
                  value={editingReward.image || ''}
                  onChange={(e) => setEditingReward({ ...editingReward, image: e.target.value })}
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Deskripsi:</label>
                <textarea
                  className="form-input"
                  rows={2}
                  value={editingReward.description || ''}
                  onChange={(e) => setEditingReward({ ...editingReward, description: e.target.value })}
                  style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setEditingReward(null)}
                  style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#fff', color: '#64748b', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmState && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '28px 24px 24px',
            maxWidth: '360px',
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            textAlign: 'center',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            position: 'relative'
          }}>
            {/* Red Trash Icon Badge */}
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
              border: '1px solid #fecaca',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)'
            }}>
              <Trash2 size={28} color="#dc2626" />
            </div>

            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', marginBottom: '8px', lineHeight: 1.3 }}>
              Konfirmasi Hapus
            </h3>
            <p style={{ fontSize: '13px', color: '#475569', marginBottom: '16px', lineHeight: 1.5 }}>
              {deleteConfirmState.title}
            </p>
            
            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '22px', background: '#f8fafc', padding: '8px 12px', borderRadius: '10px', border: '1px dashed #cbd5e1' }}>
              ⚠️ Tindakan ini permanen & tidak dapat dibatalkan.
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setDeleteConfirmState(null)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '14px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#475569',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  const action = deleteConfirmState.onConfirm;
                  setDeleteConfirmState(null);
                  if (action) action();
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '14px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
                }}
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
