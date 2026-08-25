-- ===================================================
-- SKRIP TABEL ADMIN & KONTAK BK/SP2K SUPABASE
-- ===================================================

CREATE TABLE IF NOT EXISTS public.admin_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('guru_bk', 'sp2k')),
  title TEXT NOT NULL,
  classes TEXT NOT NULL,
  phone TEXT NOT NULL,
  schedule TEXT,
  location TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Masukkan 3 Kontak Resmi Guru BK & 2 SP2K Awal
INSERT INTO public.admin_contacts (name, role, title, classes, phone, schedule, location, avatar_url) VALUES
  ('Ibu Rina, S.Pd', 'guru_bk', 'Guru BK Kelas X', 'Kelas X (Semua Jurusan)', '081299887766', 'Senin - Jumat (07:00 - 15:30 WIB)', 'Ruang BK Lt. 1', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'),
  ('Pak Bambang, M.Pd', 'guru_bk', 'Guru BK Kelas XI', 'Kelas XI (Semua Jurusan)', '081388776655', 'Senin - Jumat (07:00 - 15:30 WIB)', 'Ruang BK Lt. 1', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200'),
  ('Ibu Maya, S.Pd', 'guru_bk', 'Guru BK Kelas XII', 'Kelas XII (Semua Jurusan)', '081577665544', 'Senin - Jumat (07:00 - 15:30 WIB)', 'Ruang BK Lt. 1', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200'),
  ('Aditya Pratama (SP2K)', 'sp2k', 'Tim SP2K Piket Pagi', 'Pengurus SP2K (Siswa Hilang & Ditemukan)', '081211223344', 'Istirahat Pagi (09:45 - 10:15 WIB)', 'Pos SP2K / Ruang BK', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200'),
  ('Nabila Putri (SP2K)', 'sp2k', 'Tim SP2K Piket Siang', 'Pengurus SP2K (Siswa Hilang & Ditemukan)', '081322334455', 'Istirahat Siang (12:00 - 13:00 WIB)', 'Pos SP2K / Ruang BK', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200');
