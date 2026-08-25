export const INITIAL_USERS = [
  {
    id: 'user-1',
    name: 'Vino S. Prasetya',
    role: 'siswa',
    nisn: '005423190',
    class: 'XII RPL 1',
    phone: '081234567890',
    email: '005423190@smk.sch.id',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'user-2',
    name: 'Bu Rina (Guru BK)',
    role: 'guru',
    nik: '034567891208312',
    phone: '089876543210',
    email: 'guru.89012@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'user-3',
    name: 'Siti Rahma',
    role: 'siswa',
    nisn: '005423191',
    class: 'XI AKL',
    phone: '085712345678',
    email: 'siti.rahma@smk.sch.id',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'
  }
];

export const CATEGORIES = [
  { id: 'all', name: 'Semua', icon: 'Sparkles', count: 42 },
  { id: 'hp', name: 'HP / Gadget', icon: 'Smartphone', count: 24 },
  { id: 'buku', name: 'Buku & Alat Tulis', icon: 'BookOpen', count: 18 },
  { id: 'botol', name: 'Botol & Tempat Makan', icon: 'Coffee', count: 12 },
  { id: 'dompet', name: 'Dompet & Tas', icon: 'Briefcase', count: 15 },
  { id: 'aksesori', name: 'Kacamata & Jam', icon: 'Glasses', count: 15 },
  { id: 'kunci', name: 'Kunci Motor & Loker', icon: 'Key', count: 8 },
  { id: 'pakaian', name: 'Pakaian & Sepatu', icon: 'Shirt', count: 10 },
  { id: 'kartu', name: 'Kartu & Uang', icon: 'CreditCard', count: 7 },
  { id: 'lainnya', name: 'Lain-lain', icon: 'Package', count: 5 }
];

export const INITIAL_ITEMS = [
  {
    id: 'item-1',
    title: 'iPhone 13 Starlight 128GB',
    category: 'hp',
    status: 'hilang',
    location: 'Perpustakaan Lt. 2',
    date: '18 Agu 2026, 14:20 WIB',
    description: 'Terakhir ditaruh di meja baca no 4 dekat jendela. Pakai casing transparan dengan stiker logo SMK.',
    reporter: {
      name: 'Vino S. Prasetya',
      role: 'Siswa (XII RPL 1)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
    },
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&q=80&w=600',
    specialNotes: 'Walpaper lockscreen foto kucing hitam, passcode 6 digit.'
  },
  {
    id: 'item-2',
    title: 'Dompet Kulit Cokelat Vintage',
    category: 'dompet',
    status: 'ditemukan',
    location: 'Kantin Sekolah (Meja No 12)',
    date: '19 Agu 2026, 09:15 WIB',
    description: 'Ditemukan terselip di bawah kursi kantin. Isi dalam ada kartu siswa dan uang tunai secukupnya.',
    reporter: {
      name: 'Bu Rina (Guru BK)',
      role: 'Guru BK / Pengawas',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
    },
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=600',
    specialNotes: 'Di simpan aman di Ruang BK. Pemilik wajib membawa bukti kepemilikan/KTP/Kartu Siswa.'
  },
  {
    id: 'item-3',
    title: 'Kacamata Frame Hitam Titanium',
    category: 'aksesori',
    status: 'hilang',
    location: 'Lab Komputer 2',
    date: '17 Agu 2026, 11:00 WIB',
    description: 'Kotak kacamata warna biru navy merk Owndays. Ketinggalan di samping PC 15.',
    reporter: {
      name: 'Siti Rahma',
      role: 'Siswa (XI AKL)',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'
    },
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600',
    specialNotes: 'Minus 2.5 silinder 0.5.'
  },
  {
    id: 'item-4',
    title: 'Buku Cetak Matematika Wajib K13',
    category: 'buku',
    status: 'ditemukan',
    location: 'Ruang Kelas XII RPL 1',
    date: '18 Agu 2026, 16:00 WIB',
    description: 'Ada nama tertulis di sampul belakang tapi agak samar. Buku sampul plastik bening.',
    reporter: {
      name: 'Pak Andi',
      role: 'Guru Matematika',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
    },
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    specialNotes: 'Dapat diambil di loker guru.'
  },
  {
    id: 'item-5',
    title: 'Botol Minum Tupperware Neon 1 Liter',
    category: 'botol',
    status: 'ditemukan',
    location: 'Lapangan Basket Outdoor',
    date: '19 Agu 2026, 08:00 WIB',
    description: 'Botol warna hijau neon terang dengan gantungan tali warna hitam.',
    reporter: {
      name: 'Ahmad Supri',
      role: 'Siswa (X TKR 2)',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
    },
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=600',
    specialNotes: 'Ditemukan setelah kegiatan senam pagi.'
  },
  {
    id: 'item-6',
    title: 'Kunci Motor Honda Vario (Gantungan Batman)',
    category: 'kunci',
    status: 'selesai',
    location: 'Parkiran Depan Pos Satpam',
    date: '16 Agu 2026, 07:30 WIB',
    description: 'Kunci motor dengan remote alarm dan gantungan kunci gusi karet Batman.',
    reporter: {
      name: 'Pak Budi (Satpam)',
      role: 'Petugas Keamanan',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'
    },
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&q=80&w=600',
    specialNotes: 'Sudah diserahterimakan kepada pemiliknya (Vino S.) pada 16 Agu 2026.'
  }
];

export const INITIAL_CHATS = [
  {
    id: 'chat-1',
    itemId: 'item-2',
    itemTitle: 'Dompet Kulit Cokelat Vintage',
    withUser: {
      name: 'Bu Rina (Guru BK)',
      role: 'Guru BK',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      online: true
    },
    unread: 2,
    messages: [
      { id: 'm1', sender: 'them', text: 'Halo Vino! Saya menemukan dompet kulit cokelat di kantin sekolah. Apakah ini milikmu?', time: '08:45' },
      { id: 'm2', sender: 'me', text: 'Halo Bu Rina! Betul bu, dompet saya hilang tadi waktu istirahat pertama!', time: '08:48' },
      { id: 'm3', sender: 'them', text: 'Baik Vino, silakan klik tombol "Ajukan Verifikasi Kepemilikan" di atas ya untuk mengunggah bukti/ciri khusus.', time: '08:50' }
    ]
  },
  {
    id: 'chat-2',
    itemId: 'item-3',
    itemTitle: 'Kacamata Frame Hitam',
    withUser: {
      name: 'Siti Rahma (XI AKL)',
      role: 'Siswa',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      online: false
    },
    unread: 0,
    messages: [
      { id: 'm10', sender: 'me', text: 'Permisi Siti, kacamata kamu belum ketemu ya?', time: 'Kemarin' },
      { id: 'm11', sender: 'them', text: 'Belum Vino, kalau ada info kabar-kabari ya 🙏', time: 'Kemarin' }
    ]
  }
];

export const ADMIN_STATS = {
  totalLost: 14,
  totalFound: 28,
  totalCompleted: 42,
  pendingVerifications: 5
};

export const INITIAL_CONTACTS = [
  {
    id: 'contact-bk-1',
    name: 'Ibu Rina, S.Pd',
    role: 'guru_bk',
    title: 'Guru BK Kelas X',
    classes: 'Kelas X (Semua Jurusan)',
    phone: '081299887766',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    schedule: 'Senin - Jumat (07:00 - 15:30 WIB)',
    location: 'Ruang BK Lt. 1'
  },
  {
    id: 'contact-bk-2',
    name: 'Pak Bambang, M.Pd',
    role: 'guru_bk',
    title: 'Guru BK Kelas XI',
    classes: 'Kelas XI (Semua Jurusan)',
    phone: '081388776655',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200',
    schedule: 'Senin - Jumat (07:00 - 15:30 WIB)',
    location: 'Ruang BK Lt. 1'
  },
  {
    id: 'contact-bk-3',
    name: 'Ibu Maya, S.Pd',
    role: 'guru_bk',
    title: 'Guru BK Kelas XII',
    classes: 'Kelas XII (Semua Jurusan)',
    phone: '081577665544',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    schedule: 'Senin - Jumat (07:00 - 15:30 WIB)',
    location: 'Ruang BK Lt. 1'
  },
  {
    id: 'contact-sp2k-1',
    name: 'Aditya Pratama (SP2K)',
    role: 'sp2k',
    title: 'Tim SP2K Piket Pagi',
    classes: 'Pengurus SP2K (Siswa Hilang & Ditemukan)',
    phone: '081211223344',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    schedule: 'Istirahat Pagi (09:45 - 10:15 WIB)',
    location: 'Pos SP2K / Ruang BK'
  },
  {
    id: 'contact-sp2k-2',
    name: 'Nabila Putri (SP2K)',
    role: 'sp2k',
    title: 'Tim SP2K Piket Siang',
    classes: 'Pengurus SP2K (Siswa Hilang & Ditemukan)',
    phone: '081322334455',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    schedule: 'Istirahat Siang (12:00 - 13:00 WIB)',
    location: 'Pos SP2K / Ruang BK'
  }
];
