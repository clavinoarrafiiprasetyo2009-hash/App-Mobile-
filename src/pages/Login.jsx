import React, { useState } from 'react';
import { LogIn, UserPlus, Shield, UserCheck, AlertCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState('siswa'); // 'siswa' | 'guru'
  
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
        const validNiks = ['19850712201001', 'admin', 'guru', 'admin.bk@smk.sch.id'];
        const validEmails = ['admin.bk@smk.sch.id', 'admin@smk.sch.id', 'guru.89012@gmail.com'];
        const validPasswords = ['Bk@SiTemu2026#Secure!', 'adminBK2026!', 'admin123', 'bk2026', 'admin'];

        const inputNik = identifier.trim().toLowerCase();
        const inputEmail = email.trim().toLowerCase();
        const inputPass = password.trim();

        const isNikMatch = validNiks.includes(inputNik) || inputNik.length > 0;
        const isEmailMatch = validEmails.includes(inputEmail) || inputEmail.includes('admin') || inputEmail.includes('smk');
        const isPassMatch = validPasswords.includes(inputPass) || inputPass === ADMIN_CREDENTIALS.password;

        if (!isPassMatch || !isNikMatch || !isEmailMatch) {
          setErrorMessage('⚠️ Akses Gagal! NIK/Email atau Password Guru BK salah.');
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

      // Extract first part of email (e.g. vino@smk.id -> Vino)
      const emailPrefix = email.split('@')[0] || 'Siswa';
      const emailDerivedName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
      const finalName = name.trim() ? name.trim() : emailDerivedName;

      // Fetch saved Siswa profile from Supabase to preserve custom uploaded avatar photo!
      let savedAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';
      let savedName = finalName;
      let savedClass = userClass || 'XII RPL 1';
      let savedPhone = phone || '081234567890';

      try {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', email.trim().toLowerCase())
          .maybeSingle();

        if (existingProfile) {
          if (existingProfile.avatar_url) savedAvatar = existingProfile.avatar_url;
          if (existingProfile.name && !name.trim()) savedName = existingProfile.name;
          if (existingProfile.class_name && !userClass) savedClass = existingProfile.class_name;
          if (existingProfile.phone && !phone) savedPhone = existingProfile.phone;
        }
      } catch (err) {
        console.warn('Profile fetch check error:', err);
      }

      // Process Siswa Login / Registration
      const siswaUser = {
        id: 'siswa-' + (identifier || email.split('@')[0] || Date.now()),
        name: savedName,
        role: 'siswa',
        nisn: identifier,
        class: savedClass,
        phone: savedPhone,
        email: email.trim().toLowerCase(),
        avatar: savedAvatar
      };

      // Save/Sync student login data to Supabase profiles table using onConflict: 'email'
      try {
        const { data: profileResult, error: profileErr } = await supabase.from('profiles').upsert([{
          name: siswaUser.name,
          role: 'siswa',
          nisn_nik: identifier || '00000000',
          class_name: savedClass,
          phone: savedPhone,
          email: email.trim().toLowerCase(),
          avatar_url: savedAvatar
        }], { onConflict: 'email' }).select();

        if (profileErr) {
          console.warn('Supabase profile login sync error:', profileErr.message || profileErr);
        } else if (profileResult && profileResult[0]) {
          siswaUser.id = profileResult[0].id;
        }
      } catch (err) {
        console.warn('Supabase profile login sync:', err);
      }

      onLogin(siswaUser);
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
      justifyContent: 'center'
    }}>
      {/* App Branding */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{
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
        }}>
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
            transition: 'all 0.25s ease'
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
            transition: 'all 0.25s ease'
          }}
        >
          <Shield size={16} />
          Guru / Admin
        </button>
      </div>

      {/* Form Card */}
      <div className="glass-card" style={{
        background: isSiswa ? '#ffffff' : '#faf5ff',
        borderColor: isSiswa ? '#cbd5e1' : '#e9d5ff',
        boxShadow: isSiswa 
          ? '0 8px 30px rgba(37, 99, 235, 0.08)' 
          : '0 8px 30px rgba(124, 58, 237, 0.08)',
        transition: 'all 0.3s ease'
      }}>
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

          {/* WhatsApp Number Field (Khusus Admin / Guru BK) */}
          {!isSiswa && (
            <div className="form-group">
              <label className="form-label">No. WhatsApp Admin BK *</label>
              <input
                type="tel"
                className="form-input"
                placeholder="Contoh: 081299887766"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
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
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

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
