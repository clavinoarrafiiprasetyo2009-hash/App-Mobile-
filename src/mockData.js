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

export const INITIAL_ITEMS = [];

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

export const INITIAL_REWARDS = [
  {
    id: 'rew-1',
    title: 'Pin Badge "Pahlawan Kejujuran"',
    pointsCost: 3,
    category: 'Aksesoris',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
    description: 'Pin enamel eksklusif SiTemu yang bisa dipasang di dasi atau tas sekolah sebagai apresiasi kejujuran.'
  },
  {
    id: 'rew-2',
    title: 'Notebook & Pulpen Eksklusif SiTemu',
    pointsCost: 5,
    category: 'Alat Tulis',
    stock: 18,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400',
    description: 'Buku catatan hardcover A5 dan pulpen gel dengan logo resmi SiTemu Sekolah.'
  },
  {
    id: 'rew-3',
    title: 'Lanyard & ID Card Holder SiTemu',
    pointsCost: 8,
    category: 'Aksesoris',
    stock: 12,
    image: 'https://images.unsplash.com/photo-1589384267710-7a2559663722?auto=format&fit=crop&q=80&w=400',
    description: 'Tali gantungan kartu pelajar bahan premium anti-air lengkap dengan pouch transparannya.'
  },
  {
    id: 'rew-4',
    title: 'Voucher Kantin Sekolah Rp 10.000',
    pointsCost: 10,
    category: 'Voucher',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400',
    description: 'Voucher makan/minum Rp 10.000 berlaku di seluruh stan kantin sekolah.'
  },
  {
    id: 'rew-5',
    title: 'Tumbler Stainless SiTemu 500ml',
    pointsCost: 15,
    category: 'Merchandise',
    stock: 8,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=400',
    description: 'Botol minum stainless tahan panas dan dingin 12 jam dengan desain edisi terbatas.'
  }
];
