import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY

pdf_filename = r"C:\Users\ACER\.gemini\antigravity\scratch\sitemu-app\Panduan_Pengujian_SiTemu_Sekolah.pdf"

doc = SimpleDocTemplate(
    pdf_filename,
    pagesize=letter,
    rightMargin=36,
    leftMargin=36,
    topMargin=36,
    bottomMargin=36
)

styles = getSampleStyleSheet()

# Custom Styles
title_style = ParagraphStyle(
    'DocTitle',
    parent=styles['Heading1'],
    fontName='Helvetica-Bold',
    fontSize=18,
    leading=22,
    textColor=colors.HexColor('#1e40af'),
    alignment=TA_CENTER,
    spaceAfter=4
)

subtitle_style = ParagraphStyle(
    'DocSubtitle',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=11,
    leading=15,
    textColor=colors.HexColor('#475569'),
    alignment=TA_CENTER,
    spaceAfter=12
)

section_heading = ParagraphStyle(
    'SecHeading',
    parent=styles['Heading2'],
    fontName='Helvetica-Bold',
    fontSize=12,
    leading=16,
    textColor=colors.HexColor('#0f172a'),
    spaceBefore=10,
    spaceAfter=6
)

body_style = ParagraphStyle(
    'BodyText',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=9,
    leading=13,
    textColor=colors.HexColor('#334155'),
    spaceAfter=4
)

bullet_style = ParagraphStyle(
    'BulletText',
    parent=body_style,
    leftIndent=10,
    spaceAfter=3
)

story = []

# Title & Header Banner
story.append(Paragraph("Aplikasi SiTemu Sekolah 📱", title_style))
story.append(Paragraph("Dokumentasi Fitur Lengkap & Panduan Pengujian (Testing Guide)", subtitle_style))
story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#2563eb'), spaceAfter=10))

intro_text = (
    "Dokumen ini disusun sebagai panduan lengkap pengujian (testing) seluruh fitur aplikasi web "
    "<b>SiTemu Sekolah</b> (Lost & Found Web App berbasis React, Vercel, dan Supabase Realtime). "
    "Gunakan panduan ini untuk pengujian internal kelompok dan presentasi kepada Guru & Pihak Sekolah."
)
story.append(Paragraph(intro_text, body_style))
story.append(Spacer(1, 6))

# Content Table Structure
features_data = [
    [
        Paragraph("<b>No</b>", body_style),
        Paragraph("<b>Modul Fitur</b>", body_style),
        Paragraph("<b>Deskripsi & Alur Pengujian (Testing Scenario)</b>", body_style)
    ],
    [
        Paragraph("<b>1</b>", body_style),
        Paragraph("<b>Otentikasi & Multi-Role</b>", body_style),
        Paragraph(
            "• <b>Akses Siswa:</b> Login NISN (<i>005423190</i>). Hak akses: buat laporan, klaim poin.<br/>"
            "• <b>Akses Guru BK:</b> Login NIK (<i>034567891208312</i>). Hak akses: moderasi, lelang, stok hadiah.<br/>"
            "• <b>Persistent Session:</b> Sesi tetap tersimpan otomatis saat browser HP ditutup.",
            body_style
        )
    ],
    [
        Paragraph("<b>2</b>", body_style),
        Paragraph("<b>Beranda Real-Time & Filter</b>", body_style),
        Paragraph(
            "• <b>Shimmer Skeleton Loading:</b> Animasi loading modern saat mengambil data live Supabase.<br/>"
            "• <b>Filter Kategori:</b> Filter barang berdasarkan jenis (<i>HP, Buku, Dompet, Aksesori, dll</i>).<br/>"
            "• <b>Filter Status:</b> Filter 🔴 Hilang, 🟢 Ditemukan, 🔵 Selesai.<br/>"
            "• <b>Search Bar:</b> Cari berdasarkan nama barang, lokasi, atau nama pelapor.",
            body_style
        )
    ],
    [
        Paragraph("<b>3</b>", body_style),
        Paragraph("<b>Form Laporan & Moderasi</b>", body_style),
        Paragraph(
            "• <b>Upload Foto:</b> Unggah foto barang langsung dari kamera HP atau galeri.<br/>"
            "• <b>Detail Barang:</b> Input judul, lokasi kejadian, deskripsi, dan catatan khusus.<br/>"
            "• <b>Antrean Moderasi:</b> Laporan baru tidak langsung tayang publik, tetapi masuk antrean Guru BK untuk mencegah postingan palsu/spam.",
            body_style
        )
    ],
    [
        Paragraph("<b>4</b>", body_style),
        Paragraph("<b>Dashboard Admin BK</b>", body_style),
        Paragraph(
            "• <b>Glassmorphism 7 Tab:</b> Tab <i>Stats, Moderasi, Kelola, Pending, Lelang, Kontak, Klaim Poin</i> dengan ikon vector Lucide.<br/>"
            "• <b>Tombol ACC (+1 Poin):</b> Menyetujui laporan siswa, menayangkan ke Beranda, & otomatis memberikan +1 Poin ke pelapor.<br/>"
            "• <b>Tombol Tolak:</b> Menghapus laporan yang tidak valid.",
            body_style
        )
    ],
    [
        Paragraph("<b>5</b>", body_style),
        Paragraph("<b>Sistem Poin & Katalog Hadiah</b>", body_style),
        Paragraph(
            "• <b>Perolehan Poin:</b> Siswa mendapat +1 Poin per laporan yang di-ACC Admin BK (synced to Supabase).<br/>"
            "• <b>Katalog Hadiah:</b> Penukaran Poin dengan Pin Kejujuran (3pt), Notebook (5pt), Lanyard (8pt), Voucher Kantin (10pt), Tumbler (15pt).<br/>"
            "• <b>Kode Klaim Unik:</b> Siswa mendapat kode unik (contoh: <i>ST-POIN-94821</i>) untuk pengambilan hadiah di Ruang BK.",
            body_style
        )
    ],
    [
        Paragraph("<b>6</b>", body_style),
        Paragraph("<b>Fitur Lelang Unclaimed</b>", body_style),
        Paragraph(
            "• <b>Pelelangan Resmi BK:</b> Barang temuan >30 hari yang tidak diambil dipindahkan Guru BK ke Halaman Lelang.<br/>"
            "• <b>Dana Sosial:</b> Hasil lelang dialokasikan untuk kegiatan sosial siswa.",
            body_style
        )
    ],
    [
        Paragraph("<b>7</b>", body_style),
        Paragraph("<b>Verifikasi Kepemilikan</b>", body_style),
        Paragraph(
            "• Siswa yang mengklaim barang temuan wajib mengunggah bukti kepemilikan (nota/foto/ciri khusus) untuk diverifikasi oleh Guru BK.",
            body_style
        )
    ],
    [
        Paragraph("<b>8</b>", body_style),
        Paragraph("<b>Direktori Kontak BK & SP2K</b>", body_style),
        Paragraph(
            "• Daftar kontak resmi 3 Guru BK (Kelas X, XI, XII) & 2 Tim Piket SP2K dilengkapi jam piket, lokasi Ruang BK, dan tombol Call/WhatsApp.",
            body_style
        )
    ]
]

t = Table(features_data, colWidths=[22, 115, 403])
t.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#eff6ff')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#1e40af')),
    ('ALIGN', (0, 0), (0, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
    ('PADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
]))

story.append(t)
story.append(Spacer(1, 10))

# Quick Test Steps Section
story.append(Paragraph("🧪 <b>Skenario Pengujian Cepat 4-Langkah (Quick Test Workflow):</b>", section_heading))

test_steps = [
    "<b>1. Uji Upload Laporan (Siswa):</b> Klik <i>+ Laporan</i> ➔ Buat laporan barang hilang/temuan ➔ Kirim.",
    "<b>2. Uji Moderasi (Guru BK):</b> Masuk tab <i>⚙️ Admin</i> ➔ Sub-tab <i>🛡️ Moderasi</i> ➔ Klik <i>Setujui & Publikasikan (+1 Poin)</i>.",
    "<b>3. Uji Saldo & Tukar Poin (Siswa):</b> Buka tab <i>🎁 Poin</i> ➔ Cek poin bertambah +1 ➔ Tukar hadiah Pin/Notebook ➔ Dapatkan Kode Klaim.",
    "<b>4. Uji Penyerahan Hadiah (Guru BK):</b> Buka <i>⚙️ Admin</i> ➔ Sub-tab <i>🎁 Klaim Poin</i> ➔ Klik <i>Tandai Selesai / Diserahkan</i>."
]

for step in test_steps:
    story.append(Paragraph(step, bullet_style))

story.append(Spacer(1, 10))
story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#94a3b8'), spaceAfter=6))
story.append(Paragraph("<i>SiTemu Sekolah Web App • Production Ready • Built with React, Supabase & Vercel Edge</i>", ParagraphStyle('Footer', parent=styles['Normal'], fontName='Helvetica-Oblique', fontSize=8, alignment=TA_CENTER, textColor=colors.HexColor('#64748b'))))

doc.build(story)
print(f"PDF Generated successfully at {pdf_filename}")
