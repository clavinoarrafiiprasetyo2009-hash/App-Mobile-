-- ===================================================
-- SKRIP SQL BARU UNTUK SUPABASE (SITEMU SEKOLAH)
-- ===================================================

-- 1. HAPUS TABEL LAMA YANG TIDAK DIGUNAKAN (verifications, chats, messages)
DROP TABLE IF EXISTS public.verifications CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.chats CASCADE;

-- 2. TABEL PROFILES (Pengguna Siswa & Guru)
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

-- 3. TABEL ITEMS (Data Laporan Barang Hilang & Ditemukan)
CREATE TABLE IF NOT EXISTS public.items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('hilang', 'ditemukan', 'lelang', 'forum', 'selesai')),
  location TEXT NOT NULL,
  date_reported TEXT NOT NULL,
  description TEXT NOT NULL,
  special_notes TEXT,
  reporter_name TEXT NOT NULL,
  reporter_role TEXT NOT NULL,
  reporter_phone TEXT,
  reporter_avatar TEXT,
  image_url TEXT NOT NULL,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Perintah SQL untuk Menambahkan Kolom is_published jika tabel sudah ada di Supabase
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;

-- 4. TABEL AUCTIONS (Khusus Fitur Lelang Barang Unclaimed > 30 Hari)
CREATE TABLE IF NOT EXISTS public.auctions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  starting_price BIGINT NOT NULL DEFAULT 15000,
  current_bid BIGINT NOT NULL DEFAULT 15000,
  highest_bidder TEXT,
  image_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'aktif' CHECK (status IN ('aktif', 'selesai', 'dibatalkan')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MATIKAN RLS AGAR API LANGSUNG LANCAR BISA DIBACA/DITULIS
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.auctions DISABLE ROW LEVEL SECURITY;

-- SAMPLE DUMMY DATA LELANG (TERMASUK 2 BARANG RAYA)
INSERT INTO public.auctions (title, category, description, starting_price, current_bid, highest_bidder, image_url, status)
VALUES 
('raya (Kacamata Frame Hitam)', 'aksesori', 'Barang milik raya yang sudah melebihi 30 hari di ruang BK, dilelang secara resmi.', 50000, 50000, 'Belum ada', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600', 'aktif'),
('raya (Sepatu Sneaker & Tas)', 'pakaian', 'Barang milik raya yang sudah melebihi 30 hari di ruang BK, dilelang secara resmi.', 45000, 45000, 'Belum ada', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600', 'aktif');
