import React, { useState, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import Login from './pages/Login';
import Home from './pages/Home';
import ItemDetail from './pages/ItemDetail';
import ReportForm from './pages/ReportForm';
import VerificationForm from './pages/VerificationForm';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Auction from './pages/Auction';
import WelcomeOnboarding from './pages/WelcomeOnboarding';
import { supabase } from './supabaseClient';
import { INITIAL_ITEMS } from './mockData';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function App() {
  // First-time Onboarding state
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(() => {
    try {
      return localStorage.getItem('sitemu_onboarding') === 'true';
    } catch (e) {
      return false;
    }
  });

  // Session Persistence: restore logged-in user from localStorage if not logged out
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sitemu_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState(() => {
    try {
      const saved = localStorage.getItem('sitemu_user');
      if (saved) {
        const u = JSON.parse(saved);
        return u.role === 'guru' ? 'admin' : 'home';
      }
    } catch (e) {}
    return 'home';
  });

  // Initialize items from localStorage cache first; return [] if empty (never fallback to dummy INITIAL_ITEMS to avoid mock data flash)
  const [items, setItems] = useState(() => {
    try {
      const cached = localStorage.getItem('sitemu_items_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          const clean = parsed.filter(i => !['item-1', 'item-2', 'item-3', 'item-4'].includes(i.id));
          if (clean.length > 0) return clean;
        }
      }
    } catch (e) {}
    return [];
  });

  const [selectedItem, setSelectedItem] = useState(null);
  const [isSyncing, setIsSyncing] = useState(true);

  // Load items real-time from Supabase on mount + keep-alive heartbeat
  useEffect(() => {
    loadItemsFromSupabase();

    // Heartbeat ping tiap 4 menit agar database Supabase selalu bangkit & tidak pernah tidur (No Cold Start!)
    const heartbeat = setInterval(() => {
      supabase.from('items').select('id').limit(1).then(() => {}).catch(() => {});
    }, 240000);

    return () => clearInterval(heartbeat);
  }, []);

  const loadItemsFromSupabase = async () => {
    try {
      setIsSyncing(true);

      const [{ data, error }, { data: profilesData }] = await Promise.all([
        supabase.from('items').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*')
      ]);

      if (error) {
        console.warn('Supabase fetch status:', error.message || error);
      } else if (data && data.length > 0) {
        const mappedItems = data.map(dbItem => {
          let price = null;
          if (dbItem.special_notes && dbItem.special_notes.includes('Harga Lelang:')) {
            const rawPrice = dbItem.special_notes.replace(/[^0-9]/g, '');
            if (rawPrice) price = parseInt(rawPrice, 10);
          }

          // Smart match reporter real phone from profiles table if missing
          let matchedPhone = dbItem.reporter_phone;
          if (!matchedPhone && profilesData && dbItem.reporter_name) {
            const cleanName = dbItem.reporter_name.split(' (')[0].trim().toLowerCase();
            const matchedProfile = profilesData.find(p => p.name && (p.name.trim().toLowerCase() === cleanName || cleanName.includes(p.name.trim().toLowerCase())));
            if (matchedProfile && matchedProfile.phone) {
              matchedPhone = matchedProfile.phone;
            }
          }

          return {
            id: dbItem.id,
            title: dbItem.title,
            category: dbItem.category,
            status: dbItem.status,
            location: dbItem.location,
            date: dbItem.date_reported || 'Baru saja',
            description: dbItem.description,
            specialNotes: dbItem.special_notes || '',
            auctionPrice: price || 15000,
            isAuction: dbItem.status === 'lelang' || (dbItem.special_notes && dbItem.special_notes.includes('Harga Lelang:')),
            reporter: {
              name: dbItem.reporter_name || 'Siswa SMK',
              role: dbItem.reporter_role || 'Siswa',
              phone: matchedPhone || '081234567890',
              avatar: dbItem.reporter_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
            },
            image: dbItem.image_url || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&q=80&w=600'
          };
        });

        setItems(mappedItems);
        // Cache data Supabase real terbaru ke localStorage
        try {
          localStorage.setItem('sitemu_items_cache', JSON.stringify(mappedItems));
        } catch (e) {}
      }
    } catch (err) {
      console.warn('Supabase integration offline fallback:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Handlers with LocalStorage Persistence
  const handleLogin = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('sitemu_user', JSON.stringify(user));
    } catch (e) {}
    setActiveTab(user.role === 'guru' ? 'admin' : 'home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedItem(null);
    try {
      localStorage.removeItem('sitemu_user');
    } catch (e) {}
    setActiveTab('home');
  };

  const handleUpdateProfile = async (updatedUser) => {
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('sitemu_user', JSON.stringify(updatedUser));
    } catch (e) {}

    try {
      const { data: updatedProfile, error: profileErr } = await supabase.from('profiles').upsert([{
        name: updatedUser.name,
        role: updatedUser.role,
        nisn_nik: updatedUser.nisn || updatedUser.nik || '',
        class_name: updatedUser.class || '',
        phone: updatedUser.phone || '081234567890',
        email: updatedUser.email || '',
        avatar_url: updatedUser.avatar || ''
      }], { onConflict: 'email' }).select();

      if (profileErr) {
        console.warn('Profile sync error:', profileErr.message || profileErr);
      } else if (updatedProfile && updatedProfile[0]) {
        setCurrentUser(prev => prev ? { ...prev, id: updatedProfile[0].id } : prev);
      }
    } catch (err) {
      console.warn('Profile sync error:', err);
    }
  };

  const handleUpdateItemStatus = async (itemId, newStatus, price) => {
    setItems(prevItems => {
      const nextItems = prevItems.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            status: newStatus,
            auctionPrice: price || item.auctionPrice || 15000,
            isAuction: newStatus === 'lelang'
          };
        }
        return item;
      });
      try {
        localStorage.setItem('sitemu_items_cache', JSON.stringify(nextItems));
      } catch (e) {}
      return nextItems;
    });

    try {
      await supabase
        .from('items')
        .update({
          status: newStatus,
          special_notes: price ? `Harga Lelang: Rp ${Number(price).toLocaleString('id-ID')}` : undefined
        })
        .eq('id', itemId);
    } catch (err) {
      console.warn('Update item status error:', err);
    }
  };

  const handleUpdateItemDetails = async (itemId, updatedData) => {
    setItems(prevItems => {
      const nextItems = prevItems.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            ...updatedData,
            auctionPrice: updatedData.auctionPrice || item.auctionPrice || 15000,
            isAuction: updatedData.status === 'lelang' || Boolean(updatedData.auctionPrice)
          };
        }
        return item;
      });
      try {
        localStorage.setItem('sitemu_items_cache', JSON.stringify(nextItems));
      } catch (e) {}
      return nextItems;
    });

    try {
      const updatePayload = {
        title: updatedData.title,
        category: updatedData.category,
        status: updatedData.status,
        location: updatedData.location,
        description: updatedData.description
      };
      if (updatedData.auctionPrice) {
        updatePayload.special_notes = `Harga Lelang: Rp ${Number(updatedData.auctionPrice).toLocaleString('id-ID')}`;
      }
      await supabase
        .from('items')
        .update(updatePayload)
        .eq('id', itemId);
    } catch (err) {
      console.warn('Update item details error:', err);
    }
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setActiveTab('item-detail');
  };

  const handleStartVerification = (item) => {
    setSelectedItem(item);
    setActiveTab('verification-form');
  };

  const handleCompleteVerification = async (itemId) => {
    if (itemId) {
      handleUpdateItemStatus(itemId, 'selesai');
    }
    setSelectedItem(null);
    setActiveTab('home');
  };

  const handleSubmitReport = async (newReport) => {
    // Ensure image string isn't bloated beyond limits before saving to state/cache/Supabase
    let imageToSave = newReport.image;
    if (imageToSave && imageToSave.length > 250000) {
      imageToSave = newReport.status === 'hilang'
        ? 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600'
        : 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&q=80&w=600';
    }

    const reportWithPhone = {
      ...newReport,
      image: imageToSave,
      reporter: {
        ...newReport.reporter,
        phone: currentUser?.phone || '081234567890'
      }
    };

    // Update local state and localStorage cache immediately so it stays on Beranda
    setItems(prev => {
      const nextItems = [reportWithPhone, ...prev];
      try {
        localStorage.setItem('sitemu_items_cache', JSON.stringify(nextItems));
      } catch (e) {}
      return nextItems;
    });

    try {
      const { data, error } = await supabase.from('items').insert([{
        title: newReport.title,
        category: newReport.category,
        status: newReport.status,
        location: newReport.location,
        date_reported: newReport.date,
        description: newReport.description,
        special_notes: newReport.specialNotes || '',
        reporter_name: newReport.reporter.name,
        reporter_role: newReport.reporter.role,
        reporter_phone: reportWithPhone.reporter.phone || currentUser?.phone || '081234567890',
        reporter_avatar: newReport.reporter.avatar,
        image_url: imageToSave
      }]).select();

      if (error) {
        console.warn('Supabase insert report error:', error.message || error);
      } else if (data && data[0]) {
        console.log('Inserted to Supabase with ID:', data[0].id);
        // Sync generated UUID to local state & cache
        setItems(prev => {
          const nextItems = prev.map(item => item.id === newReport.id ? { ...item, id: data[0].id } : item);
          try {
            localStorage.setItem('sitemu_items_cache', JSON.stringify(nextItems));
          } catch (e) {}
          return nextItems;
        });
      }
    } catch (err) {
      console.warn('Report submit sync error:', err);
    }
  };

  const isGuru = currentUser?.role === 'guru';

  return (
    <div className="app-container">
      {/* Main App Content View */}
      <div className="main-content">
        {!hasSeenOnboarding ? (
          <WelcomeOnboarding onGetStarted={() => {
            setHasSeenOnboarding(true);
            try {
              localStorage.setItem('sitemu_onboarding', 'true');
            } catch (e) {}
          }} />
        ) : !currentUser ? (
          <Login onLogin={handleLogin} />
        ) : (
          <>
            {activeTab === 'home' && (
              <Home
                items={items}
                currentUser={currentUser}
                isSyncing={isSyncing}
                onSelectItem={handleSelectItem}
                onNavigateReport={() => setActiveTab('report-form')}
              />
            )}

            {activeTab === 'auction' && (
              <Auction
                items={items}
                currentUser={currentUser}
                onSelectItem={handleSelectItem}
                onUpdateItemDetails={handleUpdateItemDetails}
              />
            )}

            {activeTab === 'item-detail' && selectedItem && (
              <ItemDetail
                item={selectedItem}
                onBack={() => setActiveTab('home')}
                onStartVerification={handleStartVerification}
              />
            )}

            {activeTab === 'report-form' && (
              <ReportForm
                currentUser={currentUser}
                onBack={() => setActiveTab('home')}
                onSubmitReport={handleSubmitReport}
                onGoHome={() => setActiveTab('home')}
              />
            )}

            {activeTab === 'verification-form' && selectedItem && (
              <VerificationForm
                item={selectedItem}
                currentUser={currentUser}
                onBack={() => setActiveTab('item-detail')}
                onCompleteVerification={handleCompleteVerification}
              />
            )}

            {activeTab === 'profile' && (
              <Profile
                currentUser={currentUser}
                items={items.filter(i => i.reporter.name.includes(currentUser.name.split(' ')[0]))}
                onLogout={handleLogout}
                onSelectItem={handleSelectItem}
                onUpdateProfile={handleUpdateProfile}
              />
            )}

            {/* Admin Dashboard Protected View */}
            {activeTab === 'admin' && (
              isGuru ? (
                <AdminDashboard
                  items={items}
                  onSelectItem={handleSelectItem}
                  onUpdateItemStatus={handleUpdateItemStatus}
                  onUpdateItemDetails={handleUpdateItemDetails}
                />
              ) : (
                <div className="animate-fade" style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    background: '#fef2f2', border: '1px solid #fecaca',
                    color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}>
                    <ShieldAlert size={32} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                    Akses Khusus Guru & Admin BK 🔒
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '20px', lineHeight: '1.5' }}>
                    Halaman ini dikunci khusus untuk Guru BK Sekolah. Akun Siswa tidak memiliki otoritas untuk mengelola verifikasi admin.
                  </p>
                  <button
                    onClick={() => setActiveTab('home')}
                    className="btn-primary"
                    style={{ padding: '12px 24px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    <ArrowLeft size={16} />
                    Kembali ke Beranda
                  </button>
                </div>
              )
            )}
          </>
        )}
      </div>

      {/* Bottom Navigation Bar */}
      {hasSeenOnboarding && currentUser && (
        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}
