import React, { useState } from 'react';
import { X, MessageCircle, ShieldCheck, UserCheck, Search, Clock, MapPin, Sparkles } from 'lucide-react';

export default function ContactSelectorModal({ isOpen, onClose, contacts, item, currentUser }) {
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'guru_bk' | 'sp2k'
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredContacts = contacts.filter(c => {
    const matchesCategory = activeCategory === 'all' || c.role === activeCategory;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.classes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getWaUrl = (contact) => {
    const cleanPhone = contact.phone.replace(/[^0-9]/g, '');
    const formattedPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    
    const studentName = currentUser?.name || 'Siswa';
    const studentClass = currentUser?.class || 'Siswa SMK';
    const itemTitle = item ? item.title : 'Barang Hilang/Temuan';
    const itemStatus = item ? (item.status === 'hilang' ? 'Laporan Hilang' : 'Barang Ditemukan') : 'Laporan';
    
    const message = `Halo ${contact.name} (${contact.title}), saya ${studentName} (${studentClass}) mau menanyakan/mengonfirmasi ${itemStatus}: "${itemTitle}". Boleh minta info / janji bertemu di Ruang BK?`;
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(6px)',
      zIndex: 999,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      padding: '0',
      animation: 'fade 0.25s ease'
    }}>
      <div style={{
        background: '#ffffff',
        width: '100%',
        maxWidth: '480px',
        maxHeight: '88vh',
        borderTopLeftRadius: '28px',
        borderTopRightRadius: '28px',
        padding: '22px 18px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.2)',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Header Modal */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ background: '#dbeafe', color: '#1d4ed8', fontSize: '10px', fontWeight: 800, padding: '3px 8px', borderRadius: '12px' }}>
                WhatsApp Resmi
              </span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>• 3 BK & 2 SP2K</span>
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
              Pilih Kontak Guru BK / SP2K 💬
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter Category Tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
          <button
            onClick={() => setActiveCategory('all')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '10px',
              border: 'none',
              background: activeCategory === 'all' ? '#2563eb' : '#f1f5f9',
              color: activeCategory === 'all' ? 'white' : '#475569',
              fontWeight: 700,
              fontSize: '11px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Semua (5)
          </button>
          <button
            onClick={() => setActiveCategory('guru_bk')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '10px',
              border: 'none',
              background: activeCategory === 'guru_bk' ? '#7c3aed' : '#f1f5f9',
              color: activeCategory === 'guru_bk' ? 'white' : '#475569',
              fontWeight: 700,
              fontSize: '11px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            🏫 3 Guru BK
          </button>
          <button
            onClick={() => setActiveCategory('sp2k')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '10px',
              border: 'none',
              background: activeCategory === 'sp2k' ? '#059669' : '#f1f5f9',
              color: activeCategory === 'sp2k' ? 'white' : '#475569',
              fontWeight: 700,
              fontSize: '11px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            🛡️ 2 Tim SP2K
          </button>
        </div>

        {/* Search Input Box */}
        <div style={{ position: 'relative', marginBottom: '14px' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Cari berdasarkan nama atau kelas yang diampu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '36px', fontSize: '12px' }}
          />
        </div>

        {/* Contacts List */}
        <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '2px' }}>
          {filteredContacts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 10px', color: '#64748b', fontSize: '13px' }}>
              Pencarian tidak ditemukan. Coba kata kunci lain.
            </div>
          ) : (
            filteredContacts.map(contact => {
              const isBk = contact.role === 'guru_bk';
              return (
                <div
                  key={contact.id}
                  style={{
                    background: isBk ? '#faf5ff' : '#ecfdf5',
                    border: `1px solid ${isBk ? '#e9d5ff' : '#a7f3d0'}`,
                    borderRadius: '16px',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: `2px solid ${isBk ? '#7c3aed' : '#059669'}`
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{contact.name}</h4>
                        {isBk ? <UserCheck size={14} color="#7c3aed" /> : <ShieldCheck size={14} color="#059669" />}
                      </div>
                      <span style={{ fontSize: '11px', color: isBk ? '#6b21a8' : '#047857', fontWeight: 700 }}>
                        {contact.title}
                      </span>
                      <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                        📍 {contact.classes}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '6px', borderTop: `1px dashed ${isBk ? '#f3e8ff' : '#d1fae5'}` }}>
                    <div style={{ fontSize: '10px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} />
                      <span>{contact.schedule}</span>
                    </div>

                    <a
                      href={getWaUrl(contact)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                      style={{
                        background: 'linear-gradient(135deg, #25d366, #128c7e)',
                        padding: '8px 14px',
                        fontSize: '11px',
                        fontWeight: 800,
                        textDecoration: 'none',
                        color: 'white',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 10px rgba(37, 211, 102, 0.25)'
                      }}
                    >
                      <MessageCircle size={14} />
                      Chat WA
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
