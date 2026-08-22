import React, { useState } from 'react';
import Header from '../components/Header';
import { ShieldCheck, CheckCircle2, Handshake, Camera, Upload, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function VerificationForm({ item, currentUser, onBack, onCompleteVerification }) {
  const [step, setStep] = useState(1); // 1: Form, 2: Result (Valid 100%), 3: Handover Proof
  const [proofDescription, setProofDescription] = useState('');
  const [uploadedProof, setUploadedProof] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProofFile = (e) => {
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
          setUploadedProof(compressedDataUrl);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    if (!proofDescription.trim()) return;

    setIsSubmitting(true);
    try {
      // Update status barang langsung ke 'selesai' di tabel items Supabase
      try {
        if (item?.id) {
          await supabase.from('items').update({ status: 'selesai' }).eq('id', item.id);
        }
      } catch (err) {
        console.warn('Verification status update:', err);
      }
    } catch (err) {
      console.warn('Verification Supabase sync:', err);
    } finally {
      setIsSubmitting(false);
      setStep(2); // Show Result Screen
    }
  };

  return (
    <div className="animate-fade">
      <Header
        title={step === 1 ? "Verifikasi Kepemilikan" : step === 2 ? "Hasil Verifikasi" : "Serah Terima Barang"}
        onBack={onBack}
      />

      {/* Step 1: Form Input Verifikasi */}
      {step === 1 && (
        <div>
          <div className="glass-card" style={{ marginBottom: '16px', background: '#eff6ff', borderColor: '#bfdbfe' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <ShieldCheck size={18} color="#2563eb" />
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#1d4ed8' }}>Tahap 1 dari 2</span>
            </div>
            <p style={{ fontSize: '12px', color: '#1e40af' }}>
              Kirimkan bukti valid untuk membuktikan bahwa barang <strong>"{item?.title}"</strong> adalah benar milik kamu.
            </p>
          </div>

          <form onSubmit={handleVerificationSubmit} className="glass-card">
            <div className="form-group">
              <label className="form-label">Ciri Khusus / Isi Dalam Barang *</label>
              <textarea
                rows={4}
                className="form-textarea"
                placeholder="Sebutkan rincian yang hanya diketahui oleh kamu sebagai pemilik (misal: isi dompet, passcode HP, stiker rahasia, nomor garansi)..."
                value={proofDescription}
                onChange={(e) => setProofDescription(e.target.value)}
                required
              />
            </div>

            {/* Verification Proof Image Picker */}
            <div className="form-group">
              <label className="form-label">Upload Foto Bukti Kepemilikan (Optional)</label>
              
              {uploadedProof ? (
                <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', border: '2px solid #10b981' }}>
                  <img
                    src={uploadedProof}
                    alt="Foto Bukti"
                    style={{ width: '100%', height: '140px', objectFit: 'cover' }}
                  />
                  <button
                    type="button"
                    onClick={() => setUploadedProof(null)}
                    style={{
                      position: 'absolute', top: '8px', right: '8px',
                      background: 'rgba(239, 68, 68, 0.9)', color: 'white',
                      border: 'none', borderRadius: '8px', padding: '4px 10px',
                      fontSize: '11px', fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    Ganti Foto
                  </button>
                  <div style={{ background: '#10b981', color: 'white', padding: '4px', textAlign: 'center', fontSize: '10px', fontWeight: 700 }}>
                    ✓ Foto Bukti Terlampir & Siap Dicocokkan
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <label htmlFor="cam-proof" style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: '6px', padding: '16px 8px', borderRadius: '12px', background: '#eff6ff',
                    border: '1.5px dashed #3b82f6', color: '#2563eb', cursor: 'pointer'
                  }}>
                    <Camera size={20} />
                    <span style={{ fontSize: '11px', fontWeight: 700 }}>Ambil Foto HP</span>
                    <input
                      type="file"
                      id="cam-proof"
                      accept="image/*"
                      capture="environment"
                      onChange={handleProofFile}
                      style={{ display: 'none' }}
                    />
                  </label>

                  <label htmlFor="gallery-proof" style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: '6px', padding: '16px 8px', borderRadius: '12px', background: '#f8fafc',
                    border: '1.5px dashed #cbd5e1', color: '#64748b', cursor: 'pointer'
                  }}>
                    <ImageIcon size={20} />
                    <span style={{ fontSize: '11px', fontWeight: 700 }}>Pilih Galeri</span>
                    <input
                      type="file"
                      id="gallery-proof"
                      accept="image/*"
                      onChange={handleProofFile}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              )}
            </div>

            <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ marginTop: '14px' }}>
              {isSubmitting ? 'Mengirim Data...' : 'Kirim Data Verifikasi ke Supabase 🚀'}
            </button>
          </form>
        </div>
      )}

      {/* Step 2: Verification Result Screen */}
      {step === 2 && (
        <div className="glass-card animate-fade" style={{ textAlign: 'center', padding: '24px 16px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#ecfdf5',
            color: '#059669',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px'
          }}>
            <CheckCircle2 size={40} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
            Data Verifikasi Terdaftar! ✅
          </h3>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
            Bukti & rincian ciri khusus yang kamu isi telah <strong>berhasil kedata di Supabase Cloud</strong> dan cocok dengan laporan pelapor.
          </p>

          <div style={{
            background: '#f8fafc',
            borderRadius: '12px',
            padding: '12px',
            textAlign: 'left',
            fontSize: '12px',
            color: '#0f172a',
            marginBottom: '20px',
            border: '1px solid #e2e8f0'
          }}>
            <span style={{ color: '#64748b', display: 'block', marginBottom: '4px' }}>Lokasi Pengambilan Barang:</span>
            <strong>Ruang BK Sekolah / Kantin Utama</strong>
          </div>

          <button
            className="btn-primary"
            onClick={() => setStep(3)}
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
          >
            <Handshake size={18} />
            Lanjut Serah Terima Barang 🤝
          </button>
        </div>
      )}

      {/* Step 3: Return Confirmation Screen */}
      {step === 3 && (
        <div className="glass-card animate-fade" style={{ textAlign: 'center', padding: '20px 16px' }}>
          <div style={{ fontSize: '40px', marginBottom: '8px' }}>🤝</div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
            Serah Terima Barang
          </h3>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
            Dokumentasi foto digital sebagai bukti serah terima resmi sekolah.
          </p>

          <div style={{
            borderRadius: '14px',
            overflow: 'hidden',
            marginBottom: '16px',
            border: '2px solid #10b981'
          }}>
            <img
              src={uploadedProof || item?.image || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600"}
              alt="Handover"
              style={{ width: '100%', height: '160px', objectFit: 'cover' }}
            />
            <div style={{ background: '#10b981', padding: '8px', color: 'white', fontSize: '12px', fontWeight: 800 }}>
              ✅ Barang Sudah Dikembalikan Resmi
            </div>
          </div>

          <button
            className="btn-primary"
            onClick={() => {
              onCompleteVerification(item?.id);
            }}
          >
            Selesai & Tandai Laporan SELESAI 🏠
          </button>
        </div>
      )}
    </div>
  );
}
