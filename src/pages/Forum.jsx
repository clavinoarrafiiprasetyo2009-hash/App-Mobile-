import React, { useState } from 'react';
import Header from '../components/Header';
import { MessageSquare, HeartHandshake, Send, ThumbsUp, MessageCircle, Gift, Clock, ShieldCheck, Sparkles, User, Tag } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function Forum({ items, currentUser, onSelectItem, onOpenContactModal }) {
  const [forumTab, setForumTab] = useState('donasi'); // 'donasi' | 'diskusi'
  const [comments, setComments] = useState({});
  const [newCommentText, setNewCommentText] = useState('');
  const [activeCommentItemId, setActiveCommentItemId] = useState(null);
  
  // Community Discussion Posts state
  const [posts, setPosts] = useState([
    {
      id: 'post-1',
      author: 'Ahmad Subagyo (Guru Pembina)',
      role: 'guru',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      time: '2 jam yang lalu',
      content: '📌 Himbauan untuk seluruh siswa: Jika menemukan barang berharga di lapangan olahraga, harap langsung diserahkan ke Ruang BK atau Petugas Satpam ya!',
      likes: 12,
      replies: 4
    },
    {
      id: 'post-2',
      author: 'Siti Rahma (XI AKL)',
      role: 'siswa',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      time: '5 jam yang lalu',
      content: 'Tips: Selalu kasih stiker nama atau gantungan kunci unik di botol minum & kunci motor kalian biar gampang dicari kalau ketinggalan! 💡',
      likes: 18,
      replies: 7
    }
  ]);
  const [newPostText, setNewPostText] = useState('');

  const isGuru = currentUser?.role === 'guru';

  // Expired auction items (> 7 days or status === 'forum') for donation
  const forumDonasiItems = items.filter(item => 
    item.status === 'forum' || 
    (item.specialNotes && item.specialNotes.toLowerCase().includes('donasi')) ||
    (item.isAuction && item.auctionExpired)
  );

  // If no expired items yet, show sample expired auction items for donation demonstration
  const displayDonasiItems = forumDonasiItems.length > 0 ? forumDonasiItems : [
    {
      id: 'forum-demo-1',
      title: 'Jaket Hoodie Converse Original (Donasi Sekolah)',
      category: 'pakaian',
      status: 'forum',
      location: 'Ruang BK Lt. 1',
      date: '10 Jul 2026',
      description: 'Barang lelang yang tidak ada penawar selama 7 hari. Dialihkan sebagai barang donasi/hibah resmi sekolah.',
      specialNotes: 'Sudah Melewati 7 Hari Lelang - Bebas Diajukan untuk Donasi',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=600',
      reporter: { name: 'Guru BK Sekolah', role: 'Admin BK' }
    },
    {
      id: 'forum-demo-2',
      title: 'Botol Minum Tupperware 1L (Donasi Lab/Ekskul)',
      category: 'botol',
      status: 'forum',
      location: 'Ruang BK Lt. 1',
      date: '12 Jul 2026',
      description: 'Expired Lelang 7 Hari. Bermanfaat untuk hibah kegiatan ekskul atau siswa yang membutuhkan.',
      specialNotes: 'Sudah Melewati 7 Hari Lelang - Bebas Diajukan untuk Donasi',
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=600',
      reporter: { name: 'Guru BK Sekolah', role: 'Admin BK' }
    }
  ];

  const handleAddPost = (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost = {
      id: 'post-' + Date.now(),
      author: currentUser?.name || 'Siswa SMK',
      role: currentUser?.role || 'siswa',
      avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      time: 'Baru saja',
      content: newPostText.trim(),
      likes: 0,
      replies: 0
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
  };

  const handleLikePost = (postId) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
  };

  const handleAddComment = (itemId) => {
    if (!newCommentText.trim()) return;
    const existing = comments[itemId] || [];
    const newComm = {
      id: 'comm-' + Date.now(),
      user: currentUser?.name || 'Siswa SMK',
      role: currentUser?.role || 'siswa',
      text: newCommentText.trim(),
      time: 'Baru saja'
    };
    setComments({ ...comments, [itemId]: [...existing, newComm] });
    setNewCommentText('');
  };

  return (
    <div className="animate-fade" style={{ paddingBottom: '90px' }}>
      <Header currentUser={currentUser} />

      {/* Main Forum Container */}
      <div style={{ padding: '16px' }}>
        
        {/* Banner Title */}
        <div className="glass-card" style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          color: 'white',
          padding: '18px',
          borderRadius: '20px',
          marginBottom: '16px',
          boxShadow: '0 10px 25px rgba(49, 46, 129, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.15)', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, marginBottom: '8px' }}>
              <Sparkles size={13} color="#facc15" /> Forum & Donasi Sekolah
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '2px 0 6px 0' }}>Forum Komunitas & Hibah 💬</h2>
            <p style={{ fontSize: '12px', opacity: 0.85, lineHeight: 1.4 }}>
              Wadah hibah barang lelang expired (&gt;7 Hari) untuk kegiatan sekolah &amp; ruang obrolan antar warga sekolah.
            </p>
          </div>
        </div>

        {/* Tab Switcher: Donasi vs Diskusi */}
        <div style={{
          display: 'flex',
          background: '#f1f5f9',
          borderRadius: '14px',
          padding: '4px',
          marginBottom: '16px',
          border: '1px solid #e2e8f0'
        }}>
          <button
            onClick={() => setForumTab('donasi')}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '10px',
              border: 'none',
              background: forumTab === 'donasi' ? '#4f46e5' : 'transparent',
              color: forumTab === 'donasi' ? 'white' : '#475569',
              fontWeight: 700,
              fontSize: '12.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.25s ease'
            }}
          >
            <Gift size={16} />
            Barang Donasi ({displayDonasiItems.length})
          </button>

          <button
            onClick={() => setForumTab('diskusi')}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '10px',
              border: 'none',
              background: forumTab === 'diskusi' ? '#4f46e5' : 'transparent',
              color: forumTab === 'diskusi' ? 'white' : '#475569',
              fontWeight: 700,
              fontSize: '12.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.25s ease'
            }}
          >
            <MessageSquare size={16} />
            Obrolan Komunitas ({posts.length})
          </button>
        </div>

        {/* TAB 1: BARANG HIBAH & DONASI EXPIRED LELANG (>7 HARI) */}
        {forumTab === 'donasi' && (
          <div className="animate-fade">
            <div style={{ background: '#e0e7ff', border: '1px solid #c7d2fe', padding: '10px 14px', borderRadius: '12px', marginBottom: '14px', fontSize: '11.5px', color: '#3730a3', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} flexShrink={0} />
              <span>Barang di bawah ini telah melewati batas lelang 7 hari dan siap didonasikan untuk kegiatan sekolah/siswa membutuhkan.</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {displayDonasiItems.map((item) => (
                <div key={item.id} className="glass-card" style={{ padding: '14px', borderRadius: '16px', border: '1px solid #e2e8f0', background: 'white' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      style={{ width: '85px', height: '85px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span className="badge" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', fontSize: '10px', fontWeight: 800 }}>
                          🎁 HIBAH / DONASI
                        </span>
                        <span style={{ fontSize: '10px', color: '#64748b', marginLeft: 'auto' }}>
                          Expired &gt;7 Hari
                        </span>
                      </div>
                      <h4 style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a', margin: '2px 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.title}
                      </h4>
                      <p style={{ fontSize: '11.5px', color: '#64748b', marginBottom: '6px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.description}
                      </p>
                      <div style={{ fontSize: '10.5px', color: '#4338ca', fontWeight: 700 }}>
                        📍 {item.location} • Penanggungjawab: Ruang BK
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed #e2e8f0' }}>
                    <button
                      onClick={() => onOpenContactModal && onOpenContactModal(item)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '10px',
                        background: '#4f46e5',
                        color: 'white',
                        border: 'none',
                        fontWeight: 700,
                        fontSize: '11.5px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <HeartHandshake size={15} />
                      Ajukan Permohonan Donasi
                    </button>
                    <button
                      onClick={() => setActiveCommentItemId(activeCommentItemId === item.id ? null : item.id)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '10px',
                        background: '#f1f5f9',
                        color: '#475569',
                        border: '1px solid #cbd5e1',
                        fontWeight: 700,
                        fontSize: '11.5px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <MessageCircle size={15} />
                      Diskusi ({(comments[item.id] || []).length})
                    </button>
                  </div>

                  {/* Comment Section per Item */}
                  {activeCommentItemId === item.id && (
                    <div className="animate-fade" style={{ marginTop: '10px', background: '#f8fafc', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <h5 style={{ fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Diskusi Permohonan Donasi:</h5>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px', maxHeight: '120px', overflowY: 'auto' }}>
                        {(comments[item.id] || []).length === 0 ? (
                          <div style={{ fontSize: '11px', color: '#94a3b8', fontStyle: 'italic' }}>Belum ada komentar. Tulis sesuatu di bawah.</div>
                        ) : (
                          (comments[item.id] || []).map(comm => (
                            <div key={comm.id} style={{ background: 'white', padding: '6px 10px', borderRadius: '8px', fontSize: '11px', border: '1px solid #cbd5e1' }}>
                              <span style={{ fontWeight: 800, color: '#1e1b4b' }}>{comm.user}: </span>
                              <span style={{ color: '#334155' }}>{comm.text}</span>
                            </div>
                          ))
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Tulis tanggapan / permohonan..."
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          style={{ padding: '6px 10px', fontSize: '11px' }}
                        />
                        <button
                          onClick={() => handleAddComment(item.id)}
                          style={{ background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', padding: '0 12px', cursor: 'pointer' }}
                        >
                          <Send size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: OBROLAN KOMUNITAS */}
        {forumTab === 'diskusi' && (
          <div className="animate-fade">
            {/* Input Post Form */}
            <div className="glass-card" style={{ padding: '14px', borderRadius: '16px', background: 'white', marginBottom: '16px', border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                <img 
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'} 
                  alt="avatar" 
                  style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>{currentUser?.name || 'Siswa SMK'}</div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>Buat postingan baru di Forum</div>
                </div>
              </div>

              <form onSubmit={handleAddPost}>
                <textarea
                  className="form-input"
                  rows={2}
                  placeholder="Tanyakan info barang hilang, beri saran, atau posting diskusi..."
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  style={{ fontSize: '12px', resize: 'none', marginBottom: '10px' }}
                  required
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="submit"
                    style={{
                      background: '#4f46e5',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Send size={14} /> Posting Obrolan
                  </button>
                </div>
              </form>
            </div>

            {/* Posts List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {posts.map(post => (
                <div key={post.id} className="glass-card" style={{ padding: '14px', borderRadius: '16px', background: 'white', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                    <img 
                      src={post.avatar} 
                      alt={post.author} 
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#0f172a' }}>{post.author}</span>
                        {post.role === 'guru' && (
                          <span style={{ background: '#fef3c7', color: '#d97706', fontSize: '9.5px', fontWeight: 800, padding: '2px 6px', borderRadius: '6px' }}>
                            Guru BK
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>{post.time}</div>
                    </div>
                  </div>

                  <p style={{ fontSize: '12px', color: '#334155', lineHeight: 1.5, marginBottom: '10px' }}>
                    {post.content}
                  </p>

                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                    <button
                      onClick={() => handleLikePost(post.id)}
                      style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <ThumbsUp size={14} color="#4f46e5" /> {post.likes} Suka
                    </button>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MessageCircle size={14} /> {post.replies} Balasan
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
