-- ===================================================
-- SKRIP SQL DATABASE SUPABASE UNTUK APLIKASI SITEMU
-- ===================================================

-- 1. TABEL PROFILES (Pengguna Siswa & Guru)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('siswa', 'guru')),
  nisn_nik TEXT,
  class_name TEXT,
  phone TEXT,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABEL ITEMS (Data Laporan Barang Hilang & Ditemukan)
CREATE TABLE IF NOT EXISTS public.items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('hilang', 'ditemukan', 'selesai')),
  location TEXT NOT NULL,
  date_reported TEXT NOT NULL,
  description TEXT NOT NULL,
  special_notes TEXT,
  reporter_name TEXT NOT NULL,
  reporter_role TEXT NOT NULL,
  reporter_avatar TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL VERIFICATIONS (Data Klaim Verifikasi Kepemilikan)
CREATE TABLE IF NOT EXISTS public.verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES public.items(id) ON DELETE CASCADE,
  proof_description TEXT NOT NULL,
  proof_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'valid', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL CHATS & MESSAGES (Sistem Pesan Obrolan)
CREATE TABLE IF NOT EXISTS public.chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES public.items(id) ON DELETE CASCADE,
  item_title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- HILANGKAN RLS UNTUK DEMO AWAL (Supaya API Langsung Bisa Dibaca/Ditulis Tanpa Hambatan)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;

-- SAMPLE DUMMY DATA UNTUK DICOBA LANGSUNG
INSERT INTO public.items (title, category, status, location, date_reported, description, reporter_name, reporter_role, image_url)
VALUES 
('iPhone 13 Starlight 128GB', 'hp', 'hilang', 'Perpustakaan Lt. 2', '18 Agu 2026, 14:20 WIB', 'Terakhir ditaruh di meja baca no 4 dekat jendela.', 'Vino S. Prasetya', 'Siswa (XII RPL 1)', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&q=80&w=600'),
('Dompet Kulit Cokelat Vintage', 'dompet', 'ditemukan', 'Kantin Sekolah', '19 Agu 2026, 09:15 WIB', 'Ditemukan terselip di bawah kursi kantin.', 'Bu Rina (Guru BK)', 'Guru BK', 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=600');
