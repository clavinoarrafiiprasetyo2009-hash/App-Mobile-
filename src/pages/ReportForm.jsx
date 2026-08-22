import React, { useState, useRef } from 'react';
import Header from '../components/Header';
import { Camera, CheckCircle2, UploadCloud, Image, RefreshCw } from 'lucide-react';
import { CATEGORIES } from '../mockData';

export default function ReportForm({ currentUser, onBack, onSubmitReport, onGoHome }) {
  const [reportType, setReportType] = useState('hilang'); // 'hilang' | 'ditemukan'
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('hp');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const isHilang = reportType === 'hilang';

  const handleImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setPhotoUrl(compressedDataUrl);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalPhoto = photoUrl || (isHilang 
      ? 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600'
      : 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&q=80&w=600');

    const newReport = {
      id: 'item-' + Date.now(),
      title,
      category,
      status: reportType,
      location,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      description,
      specialNotes,
      reporter: {
        name: currentUser?.name || 'Vino S. Prasetya',
        role: currentUser?.role === 'guru' ? 'Guru BK' : `Siswa (${currentUser?.class || 'XII RPL 1'})`,
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
      },
      image: finalPhoto
    };

    onSubmitReport(newReport);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="animate-fade" style={{
      borderRadius: '16px',
      padding: '4px',
      background: isHilang ? '#fff5f5' : '#f0fdf4',
      transition: 'background 0.35s ease'
    }}>
      <Header title="Buat Laporan Baru" onBack={onBack} />

      {/* Toggle Laporan Type */}
      <div style={{
        display: 'flex',
        background: isHilang ? '#fee2e2' : '#dcfce7',
        borderRadius: '14px',
        padding: '4px',
        marginBottom: '16px',
        border: isHilang ? '1px solid #fecaca' : '1px solid #bbf7d0',
        transition: 'all 0.35s ease'
      }}>
        <button
          type="button"
          onClick={() => setReportType('hilang')}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '10px',
            border: 'none',
            background: isHilang ? '#ef4444' : 'transparent',
            color: isHilang ? 'white' : '#475569',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            boxShadow: isHilang ? '0 4px 12px rgba(239, 68, 68, 0.3)' : 'none',
            transition: 'all 0.25s ease'
          }}
        >
          🔴 Saya Kehilangan
        </button>
        <button
          type="button"
          onClick={() => setReportType('ditemukan')}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '10px',
            border: 'none',
            background: !isHilang ? '#10b981' : 'transparent',
            color: !isHilang ? 'white' : '#475569',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            boxShadow: !isHilang ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none',
            transition: 'all 0.25s ease'
          }}
        >
          🟢 Saya Menemukan
        </button>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="glass-card" style={{
        borderColor: isHilang ? '#fecaca' : '#a7f3d0',
        boxShadow: isHilang 
          ? '0 8px 25px rgba(239, 68, 68, 0.08)' 
          : '0 8px 25px rgba(16, 185, 129, 0.08)',
        transition: 'all 0.35s ease'
      }}>
        <div className="form-group">
          <label className="form-label">Nama Barang *</label>
          <input
            type="text"
            className="form-input"
            placeholder="Contoh: Kacamata Frame Hitam"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Kategori Barang *</label>
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.filter(c => c.id !== 'all').map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Lokasi ({isHilang ? 'Hilang' : 'Ditemukan'}) *</label>
          <input
            type="text"
            className="form-input"
            placeholder={isHilang ? "Contoh: Di Kantin Sekolah / Lab Komputer 2" : "Contoh: Ditemukan di Meja Perpustakaan"}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Deskripsi Lengkap *</label>
          <textarea
            rows={3}
            className="form-textarea"
            placeholder="Jelaskan ciri-ciri barang, warna, kondisi, kronologi singkat..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Ciri Khusus / Catatan Rahasia (Optional)</label>
          <input
            type="text"
            className="form-input"
            placeholder="Contoh: Ada stiker nama di bagian bawah"
            value={specialNotes}
            onChange={(e) => setSpecialNotes(e.target.value)}
          />
        </div>

        {/* Camera & Photo Access for Mobile */}
        <div className="form-group">
          <label className="form-label">Foto Bukti Barang *</label>

          {/* Hidden HTML5 File Inputs */}
          <input
            type="file"
            ref={cameraInputRef}
            accept="image/*"
            capture="environment"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
          <input
            type="file"
            ref={galleryInputRef}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />

          <div style={{
            border: isHilang ? '2px dashed #fca5a5' : '2px dashed #6ee7b7',
            borderRadius: '14px',
            padding: '14px',
            textAlign: 'center',
            background: isHilang ? '#fff5f5' : '#f0fdf4',
            transition: 'all 0.35s ease'
          }}>
            {photoUrl ? (
              <div>
                <img
                  src={photoUrl}
                  alt="Preview"
                  style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '10px', marginBottom: '8px' }}
                />
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#0f172a',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <RefreshCw size={12} /> Ambil Ulang Kamera
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('')}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1px solid #fecaca',
                      background: '#fef2f2',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#dc2626',
                      cursor: 'pointer'
                    }}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '12px', color: '#475569', fontWeight: 700, marginBottom: '10px' }}>
                  Ambil foto barang langsung via Kamera HP atau dari Galeri:
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    style={{
                      flex: 1,
                      padding: '10px 8px',
                      borderRadius: '10px',
                      border: 'none',
                      background: isHilang ? '#ef4444' : '#10b981',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                    }}
                  >
                    <Camera size={16} /> Kamera HP
                  </button>

                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    style={{
                      flex: 1,
                      padding: '10px 8px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#0f172a',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Image size={16} /> Pilih Galeri
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary"
          style={{
            marginTop: '8px',
            background: isHilang 
              ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
              : 'linear-gradient(135deg, #10b981, #059669)',
            boxShadow: isHilang 
              ? '0 4px 14px rgba(239, 68, 68, 0.35)' 
              : '0 4px 14px rgba(16, 185, 129, 0.35)',
            transition: 'all 0.35s ease'
          }}
        >
          <UploadCloud size={18} />
          Posting Laporan ({isHilang ? 'Kehilangan' : 'Penemuan'})
        </button>
      </form>

      {/* Report Success Modal */}
      {isSuccessModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 100
        }}>
          <div className="glass-card animate-fade" style={{ textAlign: 'center', padding: '24px 18px', maxWidth: '340px', width: '100%', background: '#ffffff' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: isHilang ? '#fef2f2' : '#ecfdf5',
              color: isHilang ? '#ef4444' : '#10b981',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px'
            }}>
              <CheckCircle2 size={36} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
              Laporan Berhasil Diposting! 🎉
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4', marginBottom: '18px' }}>
              Laporanmu sudah masuk ke dalam sistem <strong>SiTemu Sekolah</strong> dan dapat dilihat oleh seluruh siswa & guru.
            </p>
            <button
              className="btn-primary"
              onClick={onGoHome}
              style={{
                background: isHilang 
                  ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
                  : 'linear-gradient(135deg, #10b981, #059669)'
              }}
            >
              Kembali ke Beranda 🏠
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
