import React, { useState } from 'react';
import { LogIn, UserPlus, Shield, UserCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState('siswa'); // 'siswa' | 'guru'
  const [showPassword, setShowPassword] = useState(false);
  
  // Form fields empty by default
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState(''); // NISN / NIK
  const [phone, setPhone] = useState(''); // Required WhatsApp Number
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userClass, setUserClass] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // PRIVATE GURU / ADMIN CREDENTIALS
  const ADMIN_CREDENTIALS = {
    nik: '19850712201001',
    email: 'admin.bk@smk.sch.id',
    password: 'Bk@SiTemu2026#Secure!'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      // Check if logging in as Guru / Admin
      if (role === 'guru') {
        const inputNik = identifier.trim() || '19850712201001';
        const inputEmail = email.trim().toLowerCase() || 'admin.bk@smk.sch.id';
        const inputPass = password.trim();

        if (inputPass.length === 0) {
          setErrorMessage('⚠️ Silakan masukkan Kata Sandi (misal: admin123).');
          setIsLoading(false);
          return;
        }

        // Fetch saved Guru profile if available from Supabase
        let savedGuruAvatar = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200';
        try {
          const { data: existingGuru } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', ADMIN_CREDENTIALS.email)
            .maybeSingle();

          if (existingGuru && existingGuru.avatar_url) {
            savedGuruAvatar = existingGuru.avatar_url;
          }
        } catch (e) {}

        const adminUser = {
          id: 'admin-guru-1',
          name: name || 'Ibu Rina, S.Pd. (Guru BK)',
          role: 'guru',
          nik: ADMIN_CREDENTIALS.nik,
          email: ADMIN_CREDENTIALS.email,
          phone: phone || '081299887766',
          avatar: savedGuruAvatar
        };

        onLogin(adminUser);
        return;
      }

      // Extract email and query Supabase profiles
      const inputEmail = email.trim().toLowerCase();
      const inputNisn = identifier.trim();

      const { data: existingProfile, error: fetchErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', inputEmail)
        .maybeSingle();

      // MODE LOGIN SISWA: Akun Wajib Terdaftar Terlebih Dahulu!
      if (!isRegister) {
        if (!existingProfile) {
          setErrorMessage('⚠️ Akun Siswa ini belum terdaftar! Silakan klik "Daftar Baru" di bawah untuk membuat akun terlebih dahulu.');
          setIsLoading(false);
          return;
        }

        // Login sukses dengan data profil resmi yang sudah terdaftar
        const loggedInSiswa = {
          id: existingProfile.id || ('siswa-' + (inputNisn || Date.now())),
          name: existingProfile.name || inputEmail.split('@')[0],
          role: 'siswa',
          nisn: existingProfile.nisn_nik || inputNisn,
          class: existingProfile.class_name || 'XII RPL 1',
          phone: existingProfile.phone || '081234567890',
          email: inputEmail,
          avatar: existingProfile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
        };

        onLogin(loggedInSiswa);
        return;
      }

      // MODE DAFTAR BARU SISWA (isRegister === true)
      if (existingProfile) {
        setErrorMessage('⚠️ Email ini sudah terdaftar! Silakan pindah ke menu "Login" untuk masuk.');
        setIsLoading(false);
        return;
      }

      const emailPrefix = inputEmail.split('@')[0] || 'Siswa';
      const emailDerivedName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
      const finalName = name.trim() ? name.trim() : emailDerivedName;
      const finalClass = userClass.trim() ? userClass.trim() : 'XII RPL 1';
      const finalPhone = phone.trim() ? phone.trim() : '081234567890';
      const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';

      // Process New Siswa Registration
      const newSiswaUser = {
        id: 'siswa-' + (inputNisn || Date.now()),
        name: finalName,
        role: 'siswa',
        nisn: inputNisn,
        class: finalClass,
        phone: finalPhone,
        email: inputEmail,
        avatar: defaultAvatar
      };

      // Save/Sync student registration data to Supabase profiles table
      try {
        const { data: profileResult, error: profileErr } = await supabase.from('profiles').insert([{
          name: finalName,
          role: 'siswa',
          nisn_nik: inputNisn || '00000000',
          class_name: finalClass,
          phone: finalPhone,
          email: inputEmail,
          avatar_url: defaultAvatar
        }]).select();

        if (profileErr) {
          console.warn('Supabase profile registration sync error:', profileErr.message || profileErr);
        } else if (profileResult && profileResult[0]) {
          newSiswaUser.id = profileResult[0].id;
        }
      } catch (err) {
        console.warn('Supabase profile registration error:', err);
      }

      onLogin(newSiswaUser);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const isSiswa = role === 'siswa';

  return (
    <div className="animate-fade" style={{
      padding: '16px 0',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      position: 'relative'
    }}>
      {/* Ambient Floating 3D School Ornaments (Buku 📚, Pensil ✏️, Tas 🎒, Topi 🎓) */}
      <div className="animate-float" style={{
        position: 'absolute',
        top: '12px',
        left: '8px',
        fontSize: '28px',
        opacity: 0.9,
        filter: 'drop-shadow(0 4px 10px rgba(37, 99, 235, 0.25))',
        pointerEvents: 'none',
        zIndex: 2
      }}>
        📚
      </div>

      <div className="animate-float-reverse" style={{
        position: 'absolute',
        top: '18px',
        right: '10px',
        fontSize: '28px',
        opacity: 0.9,
        filter: 'drop-shadow(0 4px 10px rgba(124, 58, 237, 0.25))',
        pointerEvents: 'none',
        zIndex: 2
      }}>
        ✏️
      </div>

      <div className="animate-float" style={{
        position: 'absolute',
        bottom: '10px',
        left: '12px',
        fontSize: '26px',
        opacity: 0.85,
        filter: 'drop-shadow(0 4px 10px rgba(16, 185, 129, 0.25))',
        pointerEvents: 'none',
        zIndex: 2
      }}>
        🎒
      </div>

      <div className="animate-float-reverse" style={{
        position: 'absolute',
        bottom: '14px',
        right: '12px',
        fontSize: '26px',
        opacity: 0.85,
        filter: 'drop-shadow(0 4px 10px rgba(245, 158, 11, 0.25))',
        pointerEvents: 'none',
        zIndex: 2
      }}>
        🎓
      </div>
      {/* App Branding */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div 
          className="animate-float"
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: isSiswa 
              ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' 
              : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '32px',
            marginBottom: '10px',
            boxShadow: isSiswa 
              ? '0 10px 25px rgba(37, 99, 235, 0.35)' 
              : '0 10px 25px rgba(124, 58, 237, 0.35)',
            transition: 'all 0.3s ease'
          }}
        >
          🔍
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>SiTemu</h1>
        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px', fontWeight: 600 }}>
          Smart Lost & Found School App
        </p>
      </div>

      {/* Role Toggle Selector */}
      <div style={{
        display: 'flex',
        background: isSiswa ? '#e0f2fe' : '#f3e8ff',
        borderRadius: '14px',
        padding: '4px',
        marginBottom: '18px',
        border: isSiswa ? '1px solid #bae6fd' : '1px solid #e9d5ff',
        transition: 'all 0.3s ease'
      }}>
        <button
          type="button"
          onClick={() => {
            setRole('siswa');
            setErrorMessage('');
          }}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '10px',
            border: 'none',
            background: isSiswa ? '#2563eb' : 'transparent',
            color: isSiswa ? 'white' : '#475569',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
            boxShadow: isSiswa ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none',
            transform: isSiswa ? 'scale(1.02)' : 'scale(1)'
          }}
        >
          <UserCheck size={16} />
          Siswa
        </button>
        <button
          type="button"
          onClick={() => {
            setRole('guru');
            setErrorMessage('');
          }}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '10px',
            border: 'none',
            background: !isSiswa ? '#7c3aed' : 'transparent',
            color: !isSiswa ? 'white' : '#475569',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
            boxShadow: !isSiswa ? '0 4px 12px rgba(124, 58, 237, 0.3)' : 'none',
            transform: !isSiswa ? 'scale(1.02)' : 'scale(1)'
          }}
        >
          <Shield size={16} />
          Guru / Admin
        </button>
      </div>

      {/* Form Card */}
      <div 
        key={role + (isRegister ? '-reg' : '-log')}
        className="glass-card animate-slide-up" 
        style={{
          background: isSiswa ? '#ffffff' : '#faf5ff',
          borderColor: isSiswa ? '#cbd5e1' : '#e9d5ff',
          boxShadow: isSiswa 
            ? '0 8px 30px rgba(37, 99, 235, 0.08)' 
            : '0 8px 30px rgba(124, 58, 237, 0.08)',
          transition: 'all 0.3s ease'
        }}
      >
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
          {isRegister ? 'Buat Akun Siswa Baru 📝' : `Login ${isSiswa ? 'Siswa' : 'Guru / Admin BK'}`}
        </h3>
        <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
          {isRegister ? 'Lengkapi data diri kamu' : `Ketik email & data kamu untuk masuk sebagai ${isSiswa ? 'Siswa' : 'Guru BK'}.`}
        </p>

        {/* Error Alert Message */}
        {errorMessage && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '10px 12px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 600,
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} flexShrink={0} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label className="form-label">Nama Lengkap *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Masukkan nama lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">{isSiswa ? 'NISN *' : 'NIK / NIP Guru BK *'}</label>
            <input
              type="text"
              className="form-input"
              placeholder={isSiswa ? 'Ketik NISN kamu' : 'Ketik NIK khusus Admin BK'}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          {/* WhatsApp Number & Kelas Diampu Field (Khusus Admin / Guru BK) */}
          {!isSiswa && (
            <>
              <div className="form-group">
                <label className="form-label">No. WhatsApp Guru / Admin BK *</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="Contoh: 081299887766"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Kelas Yang Diampu / Peran Guru BK *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Contoh: Kelas X (Semua Jurusan) / Guru BK Utama"
                  value={userClass}
                  onChange={(e) => setUserClass(e.target.value)}
                />
              </div>
            </>
          )}

          {isRegister && isSiswa && (
            <div className="form-group">
              <label className="form-label">Kelas / Jurusan *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Contoh: XII RPL 1"
                value={userClass}
                onChange={(e) => setUserClass(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">{isSiswa ? 'Email Sekolah *' : 'Email Admin BK *'}</label>
            <input
              type="email"
              className="form-input"
              placeholder={isSiswa ? 'vino@smk.id' : 'admin.bk@smk.sch.id'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Kata Sandi *</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: '40px' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Sembunyikan Kata Sandi' : 'Lihat Kata Sandi'}
                style={{
                  position: 'absolute',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {!isSiswa && (
            <div style={{ marginTop: '12px', textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  setIdentifier('19850712201001');
                  setPhone('081299887766');
                  setUserClass('Guru BK Utama');
                  setEmail('admin.bk@smk.sch.id');
                  setPassword('admin123');
                  setErrorMessage('');
                }}
                style={{
                  background: '#faf5ff',
                  border: '1.5px dashed #c084fc',
                  color: '#7c3aed',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                ⚡ Isi Otomatis Data Admin (Fast Login)
              </button>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
            style={{
              marginTop: '14px',
              background: isSiswa 
                ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' 
                : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              boxShadow: isSiswa 
                ? '0 4px 14px rgba(37, 99, 235, 0.3)' 
                : '0 4px 14px rgba(124, 58, 237, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            {isLoading ? 'Memuat Profil...' : isRegister ? <UserPlus size={18} /> : <LogIn size={18} />}
            {isLoading ? '' : isRegister ? 'Daftar Akun' : 'Mulai Sekarang →'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '14px' }}>
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            style={{
              background: 'none',
              border: 'none',
              color: isSiswa ? '#2563eb' : '#7c3aed',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'color 0.3s ease'
            }}
          >
            {isRegister ? 'Sudah punya akun? Masuk di sini' : 'Belum punya akun? Daftar Baru'}
          </button>
        </div>
      </div>
    </div>
  );
}
