import React, { useState } from 'react';
import Header from '../components/Header';
import { ShieldCheck, CheckCircle2, Handshake } from 'lucide-react';

export default function VerificationForm({ item, currentUser, onBack, onCompleteVerification }) {
  const [step, setStep] = useState(1); // 1: Form, 2: Result (Valid 100%), 3: Handover Proof
  const [proofDescription, setProofDescription] = useState('Di bagian dalam dompet ada foto kecil, kartu siswa NISN 005423190, dan uang lembaran 50 ribu 2 lembar.');
  const [uploadedProof, setUploadedProof] = useState('https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600');

  const handleVerificationSubmit = (e) => {
    e.preventDefault();
    setStep(2); // Show Result Screen
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
                rows={3}
                className="form-textarea"
                placeholder="Sebutkan rincian yang hanya diketahui oleh pemilik (misal: isi dompet, passcode hp, stiker tersembunyi)..."
                value={proofDescription}
                onChange={(e) => setProofDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Upload Foto Bukti Sebelum Hilang (Optional)</label>
              <div style={{
                border: '2px dashed #cbd5e1',
                borderRadius: '14px',
                padding: '16px',
                textAlign: 'center',
                background: '#f8fafc',
                cursor: 'pointer'
              }}>
                <img
                  src={uploadedProof}
                  alt="Bukti Foto"
                  style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '10px', marginBottom: '8px' }}
                />
                <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>✓ Foto Bukti Terlampir</span>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '12px' }}>
              Kirim Data Verifikasi 🚀
            </button>
          </form>
        </div>
      )}

      {/* Step 2: Verification Result Screen (Figma Screen 12) */}
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
            Verifikasi Berhasil Valid! ✅
          </h3>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
            Bukti & rincian ciri khusus yang kamu kirimkan cocok <strong>100%</strong> dengan catatan pelapor.
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
            <strong>Ruang BK (Bu Rina) / Kantin Sekolah</strong>
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

      {/* Step 3: Return Confirmation Screen (Figma Screen 13) */}
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
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600"
              alt="Handover"
              style={{ width: '100%', height: '160px', objectFit: 'cover' }}
            />
            <div style={{ background: '#10b981', padding: '8px', color: 'white', fontSize: '12px', fontWeight: 800 }}>
              ✅ Barang Sudah Dikembalikan Resmi
            </div>
          </div>

          {/* FIX: ONLY call onCompleteVerification, do NOT call onBack() */}
          <button
            className="btn-primary"
            onClick={() => {
              onCompleteVerification(item?.id);
            }}
          >
            Selesai & Simpan ke Riwayat 🏠
          </button>
        </div>
      )}
    </div>
  );
}
