import React, { useState } from 'react';
import Header from '../components/Header';
import { Camera, CheckCircle2, UploadCloud, AlertTriangle, FilePlus } from 'lucide-react';
import { CATEGORIES } from '../mockData';

export default function ReportForm({ currentUser, onBack, onSubmitReport, onGoHome }) {
  const [reportType, setReportType] = useState('hilang'); // 'hilang' | 'ditemukan'
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('hp');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const isHilang = reportType === 'hilang';

  const handleSubmit = (e) => {
    e.preventDefault();
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
      image: photoUrl
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

      {/* Toggle Laporan Type with Dynamic Glow Tint */}
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

      {/* Form Container with Ambient Border & Glow Tint */}
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

        {/* Photo Upload Simulation */}
        <div className="form-group">
          <label className="form-label">Foto Barang *</label>
          <div style={{
            border: isHilang ? '2px dashed #fca5a5' : '2px dashed #6ee7b7',
            borderRadius: '14px',
            padding: '14px',
            textAlign: 'center',
            background: isHilang ? '#fff5f5' : '#f0fdf4',
            cursor: 'pointer',
            transition: 'all 0.35s ease'
          }}>
            {photoUrl ? (
              <div>
                <img
                  src={photoUrl}
                  alt="Preview"
                  style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '10px' }}
                />
                <span style={{ fontSize: '11px', color: isHilang ? '#dc2626' : '#059669', display: 'block', marginTop: '6px', fontWeight: 700 }}>
                  ✓ Foto Terpilih (Simulasi Upload)
                </span>
              </div>
            ) : (
              <div>
                <Camera size={30} color={isHilang ? '#ef4444' : '#10b981'} style={{ marginBottom: '6px' }} />
                <p style={{ fontSize: '12px', color: '#64748b' }}>Klik untuk mengambil/unggah foto barang</p>
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
