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
import ContactSelectorModal from './components/ContactSelectorModal';
import { supabase } from './supabaseClient';
import { INITIAL_ITEMS, INITIAL_CONTACTS } from './mockData';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { notifyNewReport, notifyStatusChange } from './utils/notificationHelper';

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

  // Initialize items from localStorage cache first; return [] if empty so real Supabase data is never overwritten by mock dummy data
  const [items, setItems] = useState(() => {
    try {
      const cached = localStorage.getItem('sitemu_items_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [];
  });

  const [selectedItem, setSelectedItem] = useState(null);
  const [isSyncing, setIsSyncing] = useState(true);

  // Contacts state for 3 Guru BK & 2 SP2K
  const [contacts, setContacts] = useState(() => {
    try {
      const saved = localStorage.getItem('sitemu_contacts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_CONTACTS;
  });

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedContactItem, setSelectedContactItem] = useState(null);

  const handleOpenContactModal = (item) => {
    setSelectedContactItem(item || null);
    setIsContactModalOpen(true);
  };

  const handleUpdateContacts = (newContacts) => {
    setContacts(newContacts);
    try {
      localStorage.setItem('sitemu_contacts', JSON.stringify(newContacts));
    } catch (e) {}
  };

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
      } else if (data) {
        const mappedItems = data.map(dbItem => {
          let price = null;
          const isLelangNotes = dbItem.special_notes && dbItem.special_notes.toLowerCase().includes('harga lelang:');
          if (isLelangNotes) {
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

          const isAuctionItem = dbItem.status === 'lelang' || isLelangNotes;
          // Items in auction or without explicit is_published=false are published!
          const isPublished = isAuctionItem || dbItem.is_published !== false;

          return {
            id: dbItem.id,
            title: dbItem.title,
            category: dbItem.category,
            status: isAuctionItem ? 'lelang' : dbItem.status,
            location: dbItem.location,
            date: dbItem.date_reported || 'Baru saja',
            description: dbItem.description,
            specialNotes: dbItem.special_notes || '',
            auctionPrice: price || 15000,
            isAuction: isAuctionItem,
            isPublished: isPublished,
            reporter: {
              name: dbItem.reporter_name || 'Siswa SMK',
              role: dbItem.reporter_role || 'Siswa',
              phone: matchedPhone || '081234567890',
              avatar: dbItem.reporter_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
            },
            image: dbItem.image_url || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&q=80&w=600'
          };
        });

        // Always prioritize real mapped items from Supabase database
        setItems(mappedItems);
        try {
          localStorage.setItem('sitemu_items_cache', JSON.stringify(mappedItems));
        } catch (e) {}
      }
    } catch (err) {
      console.warn('Supabase integration error:', err);
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
    // Ensure avatar base64 string isn't bloated beyond limits before saving
    let avatarToSave = updatedUser.avatar;
    if (avatarToSave && avatarToSave.length > 250000) {
      avatarToSave = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';
    }

    const cleanUser = { ...updatedUser, avatar: avatarToSave };
    setCurrentUser(cleanUser);
    try {
      localStorage.setItem('sitemu_user', JSON.stringify(cleanUser));
    } catch (e) {}

    try {
      const { data: updatedProfile, error: profileErr } = await supabase.from('profiles').upsert([{
        name: cleanUser.name,
        role: cleanUser.role,
        nisn_nik: cleanUser.nisn || cleanUser.nik || '',
        class_name: cleanUser.class || '',
        phone: cleanUser.phone || null,
        email: cleanUser.email || '',
        avatar_url: avatarToSave
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
    const targetItem = items.find(i => i.id === itemId);
    if (targetItem) {
      notifyStatusChange(targetItem.title, newStatus);
    }

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
      const formattedPrice = price ? Number(price).toLocaleString('id-ID') : '15.000';
      const notes = newStatus === 'lelang' 
        ? `Harga Lelang: Rp ${formattedPrice}`
        : (targetItem?.specialNotes || '');

      // First try updating status & special_notes directly
      const { error } = await supabase
        .from('items')
        .update({
          status: newStatus,
          special_notes: notes
        })
        .eq('id', itemId);

      if (error) {
        console.warn('Status update warning, attempting fallback update:', error.message || error);
        // Fallback: If DB constraint rejects status='lelang', update special_notes so item remains in Lelang on refresh
        await supabase
          .from('items')
          .update({ special_notes: notes })
          .eq('id', itemId);
      }
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

    // Reports submitted by Guru BK are auto-approved; Reports submitted by Siswa require BK approval moderation
    const isAutoPublished = currentUser?.role === 'guru';

    const reportWithPhone = {
      ...newReport,
      image: imageToSave,
      isPublished: isAutoPublished,
      reporter: {
        ...newReport.reporter,
        phone: currentUser?.phone || '081234567890'
      }
    };

    // Trigger PWA Web Push Notification
    notifyNewReport(newReport.title, newReport.status);

    // Update local state and localStorage cache immediately
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
        reporter_avatar: newReport.reporter.avatar,
        image_url: imageToSave,
        is_published: isAutoPublished
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

  const handleApprovePublication = async (itemId) => {
    setItems(prevItems => {
      const nextItems = prevItems.map(item => item.id === itemId ? { ...item, isPublished: true } : item);
      try {
        localStorage.setItem('sitemu_items_cache', JSON.stringify(nextItems));
      } catch (e) {}
      return nextItems;
    });

    try {
      await supabase
        .from('items')
        .update({ is_published: true })
        .eq('id', itemId);
    } catch (err) {
      console.warn('Approve publication sync error:', err);
    }
  };

  const handleRejectPublication = async (itemId) => {
    setItems(prevItems => {
      const nextItems = prevItems.filter(item => item.id !== itemId);
      try {
        localStorage.setItem('sitemu_items_cache', JSON.stringify(nextItems));
      } catch (e) {}
      return nextItems;
    });

    try {
      await supabase
        .from('items')
        .delete()
        .eq('id', itemId);
    } catch (err) {
      console.warn('Reject publication sync error:', err);
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
                onOpenContactModal={handleOpenContactModal}
              />
            )}

            {activeTab === 'item-detail' && selectedItem && (
              <ItemDetail
                item={selectedItem}
                onBack={() => setActiveTab('home')}
                onStartVerification={handleStartVerification}
                onOpenContactModal={handleOpenContactModal}
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
                onNavigateAdmin={() => setActiveTab('admin')}
              />
            )}

            {/* Admin Dashboard Protected View */}
            {activeTab === 'admin' && (
              isGuru ? (
                <AdminDashboard
                  items={items}
                  contacts={contacts}
                  onSelectItem={handleSelectItem}
                  onUpdateItemStatus={handleUpdateItemStatus}
                  onUpdateItemDetails={handleUpdateItemDetails}
                  onUpdateContacts={handleUpdateContacts}
                  onApprovePublication={handleApprovePublication}
                  onRejectPublication={handleRejectPublication}
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

      {/* Multi-Contact BK & SP2K Selector Modal */}
      <ContactSelectorModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        contacts={contacts}
        item={selectedContactItem}
        currentUser={currentUser}
      />
    </div>
  );
}
