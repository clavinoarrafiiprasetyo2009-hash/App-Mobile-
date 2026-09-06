import React, { useState } from 'react';
import Header from '../components/Header';
import { Gift, Award, Sparkles, CheckCircle2, Clock, ShieldCheck, ArrowRight, Tag, HelpCircle, Coins, ChevronRight, ShoppingBag } from 'lucide-react';

const INITIAL_REWARDS = [
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

export default function Points({ currentUser, userPoints = 0, pointHistory = [], onRedeemReward }) {
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'history'
  const [selectedReward, setSelectedReward] = useState(null);
  const [claimSuccess, setClaimSuccess] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleConfirmRedeem = () => {
    if (!selectedReward) return;

    if (userPoints < selectedReward.pointsCost) {
      showToast('❌ Poin kamu belum mencukupi untuk menukar hadiah ini.');
      return;
    }

    const claimCode = `ST-POIN-${Math.floor(100000 + Math.random() * 900000)}`;

    if (onRedeemReward) {
      onRedeemReward(selectedReward, claimCode);
    }

    setClaimSuccess({
      reward: selectedReward,
      code: claimCode,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    });

    setSelectedReward(null);
    showToast(`🎉 Berhasil menukar "${selectedReward.title}"! Kode: ${claimCode}`);
  };

  // User badge level determination
  const getBadgeLevel = (pts) => {
    if (pts >= 20) return { name: 'Pahlawan Kejujuran Utama 🏆', color: '#8b5cf6', bg: '#f3e8ff' };
    if (pts >= 10) return { name: 'Pelapor Teladan ⭐', color: '#2563eb', bg: '#dbeafe' };
    if (pts >= 5) return { name: 'Siswa Peduli 🌟', color: '#059669', bg: '#d1fae5' };
    return { name: 'Pelapor Pemula 🌱', color: '#d97706', bg: '#fef3c7' };
  };

  const levelInfo = getBadgeLevel(userPoints);

  return (
    <div className="animate-fade" style={{ paddingBottom: '90px' }}>
      <Header currentUser={currentUser} title="Poin & Hadiah" />

      {/* Notification Toast */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#1e293b',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '24px',
          fontSize: '13px',
          fontWeight: 600,
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          maxWidth: '90%'
        }}>
          <span>{toastMsg}</span>
        </div>
      )}

      <div style={{ padding: '16px' }}>

        {/* Total Points Header Card */}
        <div style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)',
          borderRadius: '20px',
          padding: '22px 20px',
          color: 'white',
          boxShadow: '0 12px 28px rgba(124, 58, 237, 0.35)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '16px'
        }}>
          {/* Background Decorative Circles */}
          <div style={{
            position: 'absolute',
            right: '-20px',
            top: '-20px',
            width: '130px',
            height: '130px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            pointerEvents: 'none'
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, opacity: 0.9 }}>
                <Coins size={16} color="#facc15" />
                <span>Saldo Poin Kejujuran Saya</span>
              </div>
              <div style={{ fontSize: '38px', fontWeight: 900, letterSpacing: '-1px', margin: '4px 0 6px 0', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span>{userPoints}</span>
                <span style={{ fontSize: '16px', fontWeight: 700, opacity: 0.85 }}>Poin</span>
              </div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(8px)',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 700
              }}>
                <Sparkles size={12} color="#facc15" />
                <span>Level: {levelInfo.name}</span>
              </div>
            </div>

            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.25)'
            }}>
              <Award size={32} color="#facc15" />
            </div>
          </div>

          {/* Point Earning Info Box */}
          <div style={{
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.18)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '11px',
            opacity: 0.95
          }}>
            <ShieldCheck size={14} color="#4ade80" />
            <span>Setiap 1 laporan foto yang disetujui (ACC) Admin BK = <strong>+1 Poin</strong></span>
          </div>
        </div>

        {/* Tab Selector: Katalog Hadiah vs Riwayat Poin */}
        <div style={{
          display: 'flex',
          background: '#f1f5f9',
          padding: '4px',
          borderRadius: '14px',
          marginBottom: '18px'
        }}>
          <button
            onClick={() => setActiveTab('catalog')}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: '10px',
              border: 'none',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: activeTab === 'catalog' ? '#ffffff' : 'transparent',
              color: activeTab === 'catalog' ? '#4f46e5' : '#64748b',
              boxShadow: activeTab === 'catalog' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Gift size={15} />
            <span>Tukar Hadiah ({INITIAL_REWARDS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: '10px',
              border: 'none',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: activeTab === 'history' ? '#ffffff' : 'transparent',
              color: activeTab === 'history' ? '#4f46e5' : '#64748b',
              boxShadow: activeTab === 'history' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Clock size={15} />
            <span>Riwayat Poin ({pointHistory.length})</span>
          </button>
        </div>

        {/* TAB 1: KATALOG HADIAH */}
        {activeTab === 'catalog' && (
          <div className="animate-fade">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🎁 Pilihan Hadiah & Merchandise</span>
              </h3>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Tukar dengan poin kamu</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
              {INITIAL_REWARDS.map((rew) => {
                const isEnoughPoints = userPoints >= rew.pointsCost;
                return (
                  <div
                    key={rew.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: '16px',
                      padding: '14px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                      display: 'flex',
                      gap: '14px',
                      alignItems: 'center',
                      transition: 'transform 0.2s ease, boxShadow 0.2s ease'
                    }}
                  >
                    <img
                      src={rew.image}
                      alt={rew.title}
                      style={{
                        width: '84px',
                        height: '84px',
                        borderRadius: '12px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                        <span style={{
                          background: '#f1f5f9',
                          color: '#475569',
                          fontSize: '9px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          textTransform: 'uppercase'
                        }}>
                          {rew.category}
                        </span>
                        <span style={{ fontSize: '10px', color: '#059669', fontWeight: 600 }}>
                          Stok: {rew.stock} pcs
                        </span>
                      </div>

                      <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', margin: '2px 0 4px 0', lineHeight: '1.3' }}>
                        {rew.title}
                      </h4>

                      <p style={{ fontSize: '10px', color: '#64748b', margin: '0 0 10px 0', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {rew.description}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#4f46e5', fontWeight: 800, fontSize: '14px' }}>
                          <Coins size={16} color="#f59e0b" />
                          <span>{rew.pointsCost} Poin</span>
                        </div>

                        <button
                          onClick={() => setSelectedReward(rew)}
                          style={{
                            background: isEnoughPoints ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : '#e2e8f0',
                            color: isEnoughPoints ? '#ffffff' : '#94a3b8',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '6px 14px',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: isEnoughPoints ? 'pointer' : 'not-allowed',
                            boxShadow: isEnoughPoints ? '0 4px 12px rgba(79, 70, 229, 0.25)' : 'none',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {isEnoughPoints ? 'Tukar Now ➔' : 'Poin Kurang'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: RIWAYAT POIN */}
        {activeTab === 'history' && (
          <div className="animate-fade">
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#1e293b', marginBottom: '12px' }}>
              📜 Catatan Poin Kamu
            </h3>

            {pointHistory.length === 0 ? (
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '30px 20px',
                textAlign: 'center',
                border: '1px solid #e2e8f0'
              }}>
                <Coins size={40} color="#cbd5e1" style={{ marginBottom: '10px' }} />
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#334155', margin: '0 0 4px 0' }}>
                  Belum Ada Riwayat Poin
                </h4>
                <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
                  Laporkan barang hilang/ditemukan dengan foto. Saat laporanmu di-ACC oleh Admin BK, kamu akan menerima +1 Poin!
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {pointHistory.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#ffffff',
                      borderRadius: '14px',
                      padding: '12px 14px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: item.type === 'earn' ? '#d1fae5' : '#fee2e2',
                        color: item.type === 'earn' ? '#059669' : '#dc2626',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '14px'
                      }}>
                        {item.type === 'earn' ? '+' : '-'}
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                          {item.description}
                        </div>
                        <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>
                          {item.date}
                        </div>
                      </div>
                    </div>

                    <div style={{
                      fontSize: '14px',
                      fontWeight: 800,
                      color: item.type === 'earn' ? '#059669' : '#dc2626'
                    }}>
                      {item.type === 'earn' ? `+${item.amount}` : `-${item.amount}`} Poin
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* CONFIRM REDEEM MODAL */}
      {selectedReward && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div className="animate-slide-up" style={{
            background: '#ffffff',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '380px',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#e0e7ff',
              color: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px'
            }}>
              <Gift size={32} />
            </div>

            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
              Konfirmasi Tukar Hadiah
            </h3>

            <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 16px 0', lineHeight: '1.4' }}>
              Kamu akan menukar <strong>{selectedReward.pointsCost} Poin</strong> dengan:
            </p>

            <div style={{
              background: '#f8fafc',
              borderRadius: '14px',
              padding: '12px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textAlign: 'left',
              marginBottom: '20px'
            }}>
              <img
                src={selectedReward.image}
                alt={selectedReward.title}
                style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>{selectedReward.title}</div>
                <div style={{ fontSize: '11px', color: '#4f46e5', fontWeight: 800, marginTop: '2px' }}>
                  Biaya: {selectedReward.pointsCost} Poin (Saldo Saya: {userPoints} Poin)
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setSelectedReward(null)}
                style={{
                  flex: 1,
                  padding: '12px 0',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#475569',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Batal
              </button>

              <button
                onClick={handleConfirmRedeem}
                style={{
                  flex: 1,
                  padding: '12px 0',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)'
                }}
              >
                Tukar Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLAIM SUCCESS POPUP MODAL */}
      {claimSuccess && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div className="animate-slide-up" style={{
            background: '#ffffff',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '380px',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#d1fae5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
              Penukaran Berhasil! 🎉
            </h3>

            <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 16px 0' }}>
              Tunjukkan Kode Klaim berikut ke petugas Admin BK sekolah untuk mengambil barangmu.
            </p>

            <div style={{
              background: '#f1f5f9',
              border: '2px dashed #4f46e5',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '1px' }}>
                KODE KLAIM HADIAH
              </div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#4f46e5', letterSpacing: '2px', margin: '6px 0' }}>
                {claimSuccess.code}
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#1e293b' }}>
                {claimSuccess.reward.title}
              </div>
            </div>

            <button
              onClick={() => setClaimSuccess(null)}
              style={{
                width: '100%',
                padding: '12px 0',
                borderRadius: '12px',
                border: 'none',
                background: '#0f172a',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Tutup & Simpan Kode
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
