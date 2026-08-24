import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { User, LogOut, History, ChevronRight, Edit3, Check, X, Camera, Phone, Upload, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function Profile({ currentUser, items, onLogout, onSelectItem, onUpdateProfile }) {
  const [activeHistoryTab, setActiveHistoryTab] = useState('hilang'); // 'hilang' | 'ditemukan' | 'selesai'
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Edit form state initialized from currentUser
  const [name, setName] = useState('');
  const [userClass, setUserClass] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');

  // Sync state whenever currentUser or modal opens
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setUserClass(currentUser.class || 'XII RPL 1');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '081234567890');
      setAvatar(currentUser.avatar || '');
    }
  }, [currentUser, isEditModalOpen]);

  const userItems = items.filter(item => item.status === activeHistoryTab);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updatedUser = {
      ...currentUser,
      name,
      class: currentUser?.role === 'siswa' ? userClass : undefined,
      email,
      phone,
      avatar
    };
    onUpdateProfile(updatedUser);
    setIsEditModalOpen(false);
    
    // Trigger success toast
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAvatar = reader.result;
        setAvatar(newAvatar);
        // Automatically save avatar change to profile state
        const updatedUser = {
          ...currentUser,
          name: name || currentUser.name,
          class: currentUser?.role === 'siswa' ? (userClass || currentUser.class) : undefined,
          email: email || currentUser.email,
          phone: phone || currentUser.phone,
          avatar: newAvatar
        };
        onUpdateProfile(updatedUser);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="animate-fade">
      <Header title="Profil Saya" />

      {/* Instant Success Toast Notification */}
      {showSuccessToast && (
        <div style={{
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          color: '#065f46',
          padding: '12px 16px',
          borderRadius: '14px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13px',
          fontWeight: 700,
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
          animation: 'fade 0.3s ease'
        }}>
          <CheckCircle2 size={18} color="#059669" />
          <span>✅ Profil kamu berhasil diperbarui & tersimpan!</span>
        </div>
      )}

      {/* User Info Card */}
      <div className="glass-card" style={{ textAlign: 'center', padding: '20px', marginBottom: '18px' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
            alt={currentUser?.name}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3.5px solid #2563eb',
              marginBottom: '10px'
            }}
          />
          <button
            onClick={() => setIsEditModalOpen(true)}
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '0',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#2563eb',
              color: 'white',
              border: '2px solid white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.4)'
            }}
          >
            <Camera size={14} />
          </button>
        </div>

        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{currentUser?.name}</h3>
        <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', fontWeight: 600 }}>
          {currentUser?.role === 'guru' ? `Guru / Admin BK • NIK: ${currentUser?.nik || '03456789'}` : `${currentUser?.class || 'XII RPL 1'} • NISN: ${currentUser?.nisn || '005423190'}`}
        </p>

        {currentUser?.role === 'guru' && currentUser?.phone && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '11px', color: '#2563eb', marginTop: '6px', fontWeight: 700 }}>
            <Phone size={12} />
            <span>No. Telp / WA Admin: {currentUser.phone}</span>
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="btn-primary"
            style={{ flex: 1, padding: '10px 12px', fontSize: '12px' }}
          >
            <Edit3 size={15} />
            Edit Profil Saya
          </button>
          
          {/* Logout Button triggers Confirmation Modal */}
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="btn-secondary"
            style={{ flex: 1, padding: '10px 12px', fontSize: '12px', color: '#ef4444', borderColor: '#fecaca', background: '#fef2f2' }}
          >
            <LogOut size={15} color="#ef4444" />
            Keluar
          </button>
        </div>
      </div>

      {/* History Tabs Section */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
          <History size={18} color="#2563eb" />
          <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>Riwayat Laporan Saya</h4>
        </div>

        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
          <button
            onClick={() => setActiveHistoryTab('hilang')}
            style={{
              flex: 1,
              padding: '9px',
              borderRadius: '10px',
              border: 'none',
              background: activeHistoryTab === 'hilang' ? '#ef4444' : '#e2e8f0',
              color: activeHistoryTab === 'hilang' ? 'white' : '#475569',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: activeHistoryTab === 'hilang' ? '0 4px 12px rgba(239, 68, 68, 0.3)' : 'none',
              transition: 'all 0.25s ease'
            }}
          >
            🔴 Hilang
          </button>
          <button
            onClick={() => setActiveHistoryTab('ditemukan')}
            style={{
              flex: 1,
              padding: '9px',
              borderRadius: '10px',
              border: 'none',
              background: activeHistoryTab === 'ditemukan' ? '#10b981' : '#e2e8f0',
              color: activeHistoryTab === 'ditemukan' ? 'white' : '#475569',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: activeHistoryTab === 'ditemukan' ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none',
              transition: 'all 0.25s ease'
            }}
          >
            🟢 Ditemukan
          </button>
          <button
            onClick={() => setActiveHistoryTab('selesai')}
            style={{
              flex: 1,
              padding: '9px',
              borderRadius: '10px',
              border: 'none',
              background: activeHistoryTab === 'selesai' ? '#2563eb' : '#e2e8f0',
              color: activeHistoryTab === 'selesai' ? 'white' : '#475569',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: activeHistoryTab === 'selesai' ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none',
              transition: 'all 0.25s ease'
            }}
          >
            🔵 Selesai
          </button>
        </div>

        {/* History Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {userItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 10px', color: '#64748b', fontSize: '12px' }}>
              Tidak ada riwayat laporan untuk kategori ini.
            </div>
          ) : (
            userItems.map(item => (
              <div
                key={item.id}
                className="glass-card"
                onClick={() => onSelectItem(item)}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px',
                  borderColor: activeHistoryTab === 'hilang' 
                    ? '#fecaca' 
                    : activeHistoryTab === 'ditemukan' 
                      ? '#a7f3d0' 
                      : '#bfdbfe',
                  transition: 'all 0.25s ease'
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: '46px', height: '46px', borderRadius: '10px', objectFit: 'cover' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{item.title}</h5>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{item.date.split(',')[0]} • {item.location}</span>
                </div>
                <ChevronRight size={16} color="#94a3b8" />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Log Out Confirmation Modal */}
      {isLogoutModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 110
        }}>
          <div className="glass-card animate-fade" style={{
            maxWidth: '320px',
            width: '100%',
            padding: '20px 18px',
            textAlign: 'center',
            borderRadius: '20px',
            background: '#ffffff'
          }}>
            <div style={{
              width: '54px', height: '54px', borderRadius: '50%',
              background: '#fef2f2', border: '1px solid #fecaca',
              color: '#dc2626', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '12px'
            }}>
              <AlertTriangle size={28} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
              Konfirmasi Keluar
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '18px' }}>
              Apakah kamu yakin ingin keluar dari akun SiTemu ini?
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="btn-secondary"
                style={{ flex: 1, padding: '10px' }}
              >
                Tidak, Batal
              </button>
              <button
                onClick={() => {
                  setIsLogoutModalOpen(false);
                  onLogout();
                }}
                className="btn-primary"
                style={{ flex: 1, padding: '10px', background: '#ef4444', borderColor: '#dc2626' }}
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 100
        }}>
          <div className="glass-card animate-fade" style={{
            maxWidth: '350px',
            width: '100%',
            padding: '22px 18px',
            maxHeight: '85vh',
            overflowY: 'auto',
            borderRadius: '24px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
            background: '#ffffff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>Edit Profil Saya ✏️</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile}>
              {/* Custom Photo Upload Area */}
              <div className="form-group" style={{ textAlign: 'center', marginBottom: '18px' }}>
                <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Foto Profil Kamu</label>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img
                    src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                    alt="Profile Avatar"
                    style={{
                      width: '84px',
                      height: '84px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #2563eb',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                    }}
                  />
                  <label
                    htmlFor="custom-avatar-file"
                    style={{
                      position: 'absolute',
                      bottom: '2px',
                      right: '0',
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: '#2563eb',
                      color: 'white',
                      border: '2px solid white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <Upload size={14} />
                  </label>
                  <input
                    type="file"
                    id="custom-avatar-file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </div>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '6px' }}>
                  Klik ikon kamera untuk unggah foto baru dari HP/Laptop
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Nama Lengkap *</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {currentUser?.role === 'siswa' && (
                <div className="form-group">
                  <label className="form-label">Kelas / Jurusan *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={userClass}
                    onChange={(e) => setUserClass(e.target.value)}
                    required
                  />
                </div>
              )}

              {currentUser?.role === 'guru' && (
                <div className="form-group">
                  <label className="form-label">No. Telepon / WhatsApp Admin *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Contoh: 081299887766"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Email Sekolah *</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '18px' }}>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '12px' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1, padding: '12px' }}
                >
                  <Check size={16} />
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
