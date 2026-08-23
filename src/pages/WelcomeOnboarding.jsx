import React from 'react';
import { Search, Smartphone, BookOpen, ShieldCheck, Bell, ArrowRight, Pencil, Coffee, Sparkles } from 'lucide-react';

export default function WelcomeOnboarding({ onGetStarted }) {
  return (
    <div className="animate-fade" style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      zIndex: 100,
      background: 'linear-gradient(180deg, #c7d2fe 0%, #dbeafe 30%, #eff6ff 65%, #e0f2fe 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 20px 24px 20px',
      boxSizing: 'border-box',
      overflowY: 'auto',
      overflowX: 'hidden'
    }}>
      {/* Background Decorative Ambient Orbs */}
      <div style={{
        position: 'absolute',
        top: '-60px',
        left: '-60px',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(96, 165, 250, 0.35) 0%, rgba(255, 255, 255, 0) 70%)',
        filter: 'blur(30px)'
      }}></div>

      <div style={{
        position: 'absolute',
        top: '180px',
        right: '-50px',
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, rgba(255, 255, 255, 0) 70%)',
        filter: 'blur(25px)'
      }}></div>

      {/* Subtle Floating School Items Elements (Pen 🖊️, Book 📚, Phone 📱, Coffee 🥤) */}
      <div className="animate-float" style={{
        position: 'absolute',
        top: '32px',
        right: '28px',
        width: '44px',
        height: '44px',
        borderRadius: '14px',
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.9)',
        boxShadow: '0 10px 20px rgba(37, 99, 235, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#2563eb',
        zIndex: 5
      }}>
        <BookOpen size={22} />
      </div>

      <div className="animate-float-reverse" style={{
        position: 'absolute',
        top: '38px',
        left: '26px',
        width: '42px',
        height: '42px',
        borderRadius: '14px',
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.9)',
        boxShadow: '0 10px 20px rgba(168, 85, 247, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#7c3aed',
        zIndex: 5
      }}>
        <Pencil size={20} />
      </div>

      <div className="animate-float" style={{
        position: 'absolute',
        top: '140px',
        left: '18px',
        width: '38px',
        height: '38px',
        borderRadius: '12px',
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.9)',
        boxShadow: '0 8px 18px rgba(16, 185, 129, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#059669',
        zIndex: 5
      }}>
        <Coffee size={18} />
      </div>

      <div className="animate-float-reverse" style={{
        position: 'absolute',
        top: '135px',
        right: '20px',
        width: '38px',
        height: '38px',
        borderRadius: '12px',
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.9)',
        boxShadow: '0 8px 18px rgba(245, 158, 11, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#d97706',
        zIndex: 5
      }}>
        <Smartphone size={18} />
      </div>

      {/* Top Branding Section */}
      <div style={{ textAlign: 'center', marginTop: '20px', position: 'relative', zIndex: 10 }}>
        {/* Main Logo Card */}
        <div style={{
          width: '90px',
          height: '90px',
          margin: '0 auto 16px',
          borderRadius: '26px',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 20px 35px -10px rgba(37, 99, 235, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.8)',
          position: 'relative'
        }}>
          <Search size={44} color="#2563eb" strokeWidth={2.5} />
        </div>

        <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '4px' }}>
          SiTemu <span style={{ color: '#2563eb' }}>Sekolah</span>
        </h1>
        <p style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>
          Smart Lost & Found School App 🏫
        </p>
        <div style={{
          width: '40px',
          height: '4px',
          borderRadius: '2px',
          background: '#2563eb',
          margin: '10px auto 0'
        }}></div>
      </div>

      {/* 4 Feature Points Grid (Temukan -> Laporkan -> Aman -> Notifikasi) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '14px',
        margin: '24px 0',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Point 1: Temukan */}
        <div className="glass-card" style={{
          padding: '18px 14px',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(10px)',
          borderRadius: '22px',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.08)'
        }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: '#eff6ff', border: '1px solid #bfdbfe',
            color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 10px'
          }}>
            <Smartphone size={24} />
          </div>
          <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
            Temukan
          </h4>
          <p style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.4' }}>
            Cari barang hilang di sekolah dengan mudah
          </p>
        </div>

        {/* Point 2: Laporkan */}
        <div className="glass-card" style={{
          padding: '18px 14px',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(10px)',
          borderRadius: '22px',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.08)'
        }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: '#ecfdf5', border: '1px solid #a7f3d0',
            color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 10px'
          }}>
            <BookOpen size={24} />
          </div>
          <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
            Laporkan
          </h4>
          <p style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.4' }}>
            Laporkan barang temuan dengan cepat
          </p>
        </div>

        {/* Point 3: Aman */}
        <div className="glass-card" style={{
          padding: '18px 14px',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(10px)',
          borderRadius: '22px',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.08)'
        }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: '#fffbeb', border: '1px solid #fde68a',
            color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 10px'
          }}>
            <ShieldCheck size={24} />
          </div>
          <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
            Aman
          </h4>
          <p style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.4' }}>
            Proses verifikasi & serah terima terpercaya
          </p>
        </div>

        {/* Point 4: Notifikasi */}
        <div className="glass-card" style={{
          padding: '18px 14px',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(10px)',
          borderRadius: '22px',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          boxShadow: '0 10px 25px -5px rgba(168, 85, 247, 0.08)'
        }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: '#faf5ff', border: '1px solid #e9d5ff',
            color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 10px'
          }}>
            <Bell size={24} />
          </div>
          <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
            Notifikasi
          </h4>
          <p style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.4' }}>
            Dapatkan update status barang secara real-time
          </p>
        </div>
      </div>

      {/* Bottom Card CTA */}
      <div style={{
        background: '#ffffff',
        borderRadius: '28px',
        padding: '20px 18px',
        boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(226, 232, 240, 0.8)',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10,
        marginBottom: '10px'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
          Temukan barangmu lebih cepat & aman ✨
        </h3>
        <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '18px', lineHeight: '1.4' }}>
          Bersama SiTemu, sekolah lebih nyaman untuk semua.
        </p>

        <button
          onClick={onGetStarted}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '14px 20px',
            fontSize: '14px',
            fontWeight: 800,
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)'
          }}
        >
          <span>Mulai Sekarang</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
