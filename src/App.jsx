import React, { useState, useEffect, useRef } from 'react';
import BottomNav from './components/BottomNav';
import Login from './pages/Login';
import Home from './pages/Home';
import ItemDetail from './pages/ItemDetail';
import ReportForm from './pages/ReportForm';
import VerificationForm from './pages/VerificationForm';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Auction from './pages/Auction';
import Points from './pages/Points';
import WelcomeOnboarding from './pages/WelcomeOnboarding';
import ContactSelectorModal from './components/ContactSelectorModal';
import { supabase } from './supabaseClient';
import { INITIAL_ITEMS, INITIAL_CONTACTS, INITIAL_REWARDS } from './mockData';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { notifyNewReport, notifyStatusChange } from './utils/notificationHelper';

export default function App() {
  const mainContentRef = useRef(null);

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

  // Version-based Cache Purge: Wipe legacy dummy cache & unregister old SW on mobile
  useEffect(() => {
    const CURRENT_APP_VERSION = 'v4.0_live_clean';
    try {
      const savedVer = localStorage.getItem('sitemu_cache_ver');
      if (savedVer !== CURRENT_APP_VERSION) {
        localStorage.removeItem('sitemu_items_cache');
        localStorage.removeItem('sitemu_point_redemptions');
        localStorage.setItem('sitemu_cache_ver', CURRENT_APP_VERSION);
      }
    } catch (e) {}

    // Unregister any active ServiceWorker on mobile to prevent SW asset caching
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        for (let registration of registrations) {
          registration.unregister();
        }
      }).catch(() => {});
      if (window.caches) {
        caches.keys().then(names => {
          for (let name of names) {
            caches.delete(name);
          }
        }).catch(() => {});
      }
    }
  }, []);

  // Auto-scroll main content container to top whenever activeTab changes
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  // Initialize items from localStorage cache first; default to INITIAL_ITEMS if empty so feeds are never blank
  const [items, setItems] = useState(() => {
    try {
      const cached = localStorage.getItem('sitemu_items_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_ITEMS;
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

  // User Points & Rewards Redemption State
  const [userPoints, setUserPoints] = useState(() => {
    try {
      const saved = localStorage.getItem('sitemu_user_points');
      return saved ? parseInt(saved, 10) || 0 : 3; // Default 3 points for starter bonus
    } catch (e) {
      return 3;
    }
  });

  const [pointHistory, setPointHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('sitemu_point_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { id: 'pt-init', type: 'earn', amount: 3, description: 'Bonus Selamat Datang Pahlawan SiTemu 🎉', date: 'Hari Ini' }
    ];
  });

  const [pointRedemptions, setPointRedemptions] = useState(() => {
    try {
      const saved = localStorage.getItem('sitemu_point_redemptions');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Rewards Catalog State (Shared between Points page and Admin Dashboard)
  const [rewardsCatalog, setRewardsCatalog] = useState(() => {
    try {
      const saved = localStorage.getItem('sitemu_rewards_catalog');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_REWARDS;
  });

  const handleAddRewardItem = (newReward) => {
    setRewardsCatalog(prev => {
      const nextCatalog = [newReward, ...prev];
      try {
        localStorage.setItem('sitemu_rewards_catalog', JSON.stringify(nextCatalog));
      } catch (e) {}
      return nextCatalog;
    });
  };

  const handleUpdateRewardStock = (rewardId, newStock) => {
    setRewardsCatalog(prev => {
      const nextCatalog = prev.map(r => r.id === rewardId ? { ...r, stock: Math.max(0, parseInt(newStock, 10) || 0) } : r);
      try {
        localStorage.setItem('sitemu_rewards_catalog', JSON.stringify(nextCatalog));
      } catch (e) {}
      return nextCatalog;
    });
  };

  const handleUpdateRewardDetails = (rewardId, updatedData) => {
    setRewardsCatalog(prev => {
      const nextCatalog = prev.map(r => {
        if (r.id === rewardId) {
          return {
            ...r,
            ...updatedData,
            pointsCost: parseInt(updatedData.pointsCost, 10) || r.pointsCost,
            stock: updatedData.stock !== undefined ? parseInt(updatedData.stock, 10) : r.stock
          };
        }
        return r;
      });
      try {
        localStorage.setItem('sitemu_rewards_catalog', JSON.stringify(nextCatalog));
      } catch (e) {}
      return nextCatalog;
    });
  };

  const handleCompleteClaim = async (claimCode) => {
    setPointRedemptions(prev => {
      const nextRedemptions = prev.map(item => item.claimCode === claimCode ? { ...item, status: 'claimed' } : item);
      try {
        localStorage.setItem('sitemu_point_redemptions', JSON.stringify(nextRedemptions));
      } catch (e) {}
      return nextRedemptions;
    });

    try {
      await supabase.from('point_redemptions').update({ status: 'claimed' }).eq('claim_code', claimCode);
    } catch (e) {}
  };

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

  // Sync logged in user points from Supabase profiles table
  useEffect(() => {
    if (currentUser?.email) {
      supabase
        .from('profiles')
        .select('points')
        .eq('email', currentUser.email)
        .maybeSingle()
        .then(({ data }) => {
          if (data && data.points !== undefined && data.points !== null) {
            setUserPoints(data.points);
            setCurrentUser(prev => prev ? { ...prev, points: data.points } : prev);
            try {
              localStorage.setItem('sitemu_user_points', data.points.toString());
            } catch (e) {}
          }
        })
        .catch(() => {});
    }
  }, [currentUser?.email]);

  // Load items & redemptions real-time from Supabase on mount + keep-alive heartbeat
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

      // Mobile network safety timeout: Force isSyncing = false after max 3.5s so loading badge never hangs
      const syncTimeout = setTimeout(() => {
        setIsSyncing(false);
      }, 3500);

      // Fetch all tables concurrently in a single parallel roundtrip
      const [itemsRes, profRes, redRes] = await Promise.allSettled([
        supabase.from('items').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*'),
        supabase.from('point_redemptions').select('*').order('created_at', { ascending: false })
      ]);

      clearTimeout(syncTimeout);

      let data = null;
      let profilesData = [];
      let redemptionsData = [];

      if (itemsRes.status === 'fulfilled' && itemsRes.value?.data) {
        data = itemsRes.value.data;
      }
      if (profRes.status === 'fulfilled' && profRes.value?.data) {
        profilesData = profRes.value.data;
      }
      if (redRes.status === 'fulfilled' && redRes.value?.data && Array.isArray(redRes.value.data)) {
        redemptionsData = redRes.value.data;
      }

      if (redemptionsData.length > 0) {
        const mappedRedemptions = redemptionsData.map(r => ({
          id: r.claim_code || r.id,
          studentName: r.student_name,
          studentClass: r.student_class || '-',
          studentPhone: r.student_phone || '-',
          deliveryAddress: r.delivery_address || 'Ruang BK Sekolah',
          rewardTitle: r.reward_title,
          pointsCost: r.points_cost,
          claimCode: r.claim_code,
          date: r.created_at ? new Date(r.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Baru saja',
          status: r.status || 'pending'
        }));
        setPointRedemptions(mappedRedemptions);
        try {
          localStorage.setItem('sitemu_point_redemptions', JSON.stringify(mappedRedemptions));
        } catch (e) {}
      }

      if (data && Array.isArray(data) && data.length > 0) {
        const mappedItems = data.map(dbItem => {
          let price = null;
          const isLelangNotes = dbItem.special_notes && dbItem.special_notes.toLowerCase().includes('harga lelang:');
          if (isLelangNotes) {
            const rawPrice = dbItem.special_notes.replace(/[^0-9]/g, '');
            if (rawPrice) price = parseInt(rawPrice, 10);
          }

          // Smart match reporter real phone from profiles table if missing
          let matchedPhone = dbItem.reporter_phone;
          if (!matchedPhone && profilesData.length > 0 && dbItem.reporter_name) {
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
      } else {
        // Fallback: If Supabase DB table has 0 items, populate default items so feeds are never empty!
        setItems(prev => (prev && prev.length > 0) ? prev : INITIAL_ITEMS);
      }
    } catch (err) {
      console.warn('Supabase integration error:', err);
      setItems(prev => (prev && prev.length > 0) ? prev : INITIAL_ITEMS);
    } finally {
      setIsSyncing(false);
    }
  };

  // Handlers with LocalStorage Persistence
  const handleLogin = (user) => {
    setCurrentUser(user);
    const pts = user.points !== undefined && user.points !== null ? user.points : userPoints;
    setUserPoints(pts);
    try {
      localStorage.setItem('sitemu_user', JSON.stringify({ ...user, points: pts }));
      localStorage.setItem('sitemu_user_points', pts.toString());
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
        avatar_url: avatarToSave,
        points: cleanUser.points !== undefined ? cleanUser.points : userPoints
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

    const nowIso = new Date().toISOString();
    try {
      localStorage.setItem(`sitemu_auction_start_${itemId}`, Date.now().toString());
    } catch (e) {}

    setItems(prevItems => {
      const nextItems = prevItems.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            status: newStatus,
            auctionPrice: price || item.auctionPrice || 15000,
            auctionStartDate: item.auctionStartDate || nowIso,
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
    let approvedTitle = '';
    let reporterName = '';

    setItems(prevItems => {
      const nextItems = prevItems.map(item => {
        if (item.id === itemId) {
          approvedTitle = item.title;
          reporterName = item.reporter?.name || '';
          return { ...item, isPublished: true };
        }
        return item;
      });
      try {
        localStorage.setItem('sitemu_items_cache', JSON.stringify(nextItems));
      } catch (e) {}
      return nextItems;
    });

    // Add +1 Point to user point balance & record in history log
    const dateNow = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const pointEntry = {
      id: `pt-${Date.now()}`,
      type: 'earn',
      amount: 1,
      description: `Laporan Disetujui (ACC): "${approvedTitle || 'Barang'}"`,
      date: dateNow
    };

    setUserPoints(prevPts => {
      const newPts = prevPts + 1;
      try {
        localStorage.setItem('sitemu_user_points', newPts.toString());
      } catch (e) {}
      return newPts;
    });

    setPointHistory(prevHist => {
      const newHist = [pointEntry, ...prevHist];
      try {
        localStorage.setItem('sitemu_point_history', JSON.stringify(newHist));
      } catch (e) {}
      return newHist;
    });

    setCurrentUser(prev => prev ? { ...prev, points: (prev.points || 0) + 1 } : prev);

    try {
      await supabase
        .from('items')
        .update({ is_published: true })
        .eq('id', itemId);

      // Find reporter in profiles table and increment points (+1) in Supabase DB
      const cleanReporterName = reporterName.split(' (')[0].trim().toLowerCase();
      const { data: allProfiles } = await supabase.from('profiles').select('*');
      
      if (allProfiles && cleanReporterName) {
        const matchedProfile = allProfiles.find(p => p.name && (p.name.trim().toLowerCase() === cleanReporterName || cleanReporterName.includes(p.name.trim().toLowerCase())));
        if (matchedProfile) {
          const updatedPts = (matchedProfile.points || 0) + 1;
          await supabase.from('profiles').update({ points: updatedPts }).eq('id', matchedProfile.id);
        } else if (currentUser?.email) {
          const { data: myProfile } = await supabase.from('profiles').select('points').eq('email', currentUser.email).maybeSingle();
          const curPts = (myProfile?.points !== undefined && myProfile?.points !== null ? myProfile.points : userPoints) + 1;
          await supabase.from('profiles').update({ points: curPts }).eq('email', currentUser.email);
        }
      } else if (currentUser?.email) {
        const { data: myProfile } = await supabase.from('profiles').select('points').eq('email', currentUser.email).maybeSingle();
        const curPts = (myProfile?.points !== undefined && myProfile?.points !== null ? myProfile.points : userPoints) + 1;
        await supabase.from('profiles').update({ points: curPts }).eq('email', currentUser.email);
      }
    } catch (err) {
      console.warn('Approve publication sync error:', err);
    }
  };

  const handleRedeemReward = async (reward, claimCode, deliveryAddress) => {
    const cost = reward.pointsCost;
    const dateNow = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    // 1. Deduct points from user balance
    const newPts = Math.max(0, userPoints - cost);
    setUserPoints(newPts);
    setCurrentUser(prev => prev ? { ...prev, points: newPts } : prev);
    try {
      localStorage.setItem('sitemu_user_points', newPts.toString());
    } catch (e) {}

    // 2. Reduce stock pcs in rewardsCatalog
    setRewardsCatalog(prevList => {
      const nextList = prevList.map(item => {
        if (item.id === reward.id) {
          return { ...item, stock: Math.max(0, item.stock - 1) };
        }
        return item;
      });
      try {
        localStorage.setItem('sitemu_rewards_catalog', JSON.stringify(nextList));
      } catch (e) {}
      return nextList;
    });

    const redeemEntry = {
      id: `pt-red-${Date.now()}`,
      type: 'spend',
      amount: cost,
      description: `Tukar Hadiah: "${reward.title}" (Kode: ${claimCode})`,
      date: dateNow
    };

    setPointHistory(prevHist => {
      const newHist = [redeemEntry, ...prevHist];
      try {
        localStorage.setItem('sitemu_point_history', JSON.stringify(newHist));
      } catch (e) {}
      return newHist;
    });

    // 3. Store redemption record with delivery address for Admin
    const newRedemptionItem = {
      id: claimCode,
      studentName: currentUser?.name || 'Siswa',
      studentClass: currentUser?.class || 'XII RPL 1',
      studentPhone: currentUser?.phone || '-',
      deliveryAddress: deliveryAddress || 'Ruang BK Sekolah',
      rewardTitle: reward.title,
      pointsCost: cost,
      claimCode: claimCode,
      date: dateNow,
      status: 'pending'
    };

    setPointRedemptions(prev => {
      const newRedemptions = [newRedemptionItem, ...prev];
      try {
        localStorage.setItem('sitemu_point_redemptions', JSON.stringify(newRedemptions));
      } catch (e) {}
      return newRedemptions;
    });

    // 4. Sync deducted points to Supabase profiles table
    if (currentUser?.email) {
      try {
        await supabase
          .from('profiles')
          .update({ points: newPts })
          .eq('email', currentUser.email);
      } catch (err) {
        console.warn('Sync points to Supabase profiles error:', err);
      }
    }

    // 5. Save redemption record to Supabase point_redemptions table
    try {
      await supabase.from('point_redemptions').insert([{
        claim_code: claimCode,
        student_name: currentUser?.name || 'Siswa',
        student_class: currentUser?.class || 'XII RPL 1',
        reward_title: reward.title,
        points_cost: cost,
        status: 'pending'
      }]);
    } catch (err) {
      console.warn('Sync point redemption to Supabase error:', err);
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
      {/* Permanent Fixed Top Header Bar for Home View */}
      {currentUser && activeTab === 'home' && (
        <div style={{
          padding: 'max(14px, calc(10px + env(safe-area-inset-top, 0px))) 16px 12px 16px',
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 30,
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
          flexShrink: 0
        }}>
          <div>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Selamat Datang ☀️</span>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
              Halo, {currentUser?.name?.split(' ')[0] || 'Siswa'}! 👋
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
              alt="Avatar"
              style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2.5px solid #2563eb', objectFit: 'cover' }}
            />
          </div>
        </div>
      )}

      {/* Main App Content View */}
      <div className="main-content" ref={mainContentRef}>
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
                userPoints={userPoints}
                items={items.filter(i => i.reporter.name.includes(currentUser.name.split(' ')[0]))}
                onLogout={handleLogout}
                onSelectItem={handleSelectItem}
                onUpdateProfile={handleUpdateProfile}
                onNavigateAdmin={() => setActiveTab('admin')}
                onNavigatePoints={() => setActiveTab('points')}
              />
            )}

            {/* Points & Rewards Page View */}
            {activeTab === 'points' && (
              <Points
                currentUser={currentUser}
                userPoints={userPoints}
                pointHistory={pointHistory}
                items={items}
                rewardsCatalog={rewardsCatalog}
                onRedeemReward={handleRedeemReward}
              />
            )}

            {/* Admin Dashboard Protected View */}
            {activeTab === 'admin' && (
              isGuru ? (
                <AdminDashboard
                  items={items}
                  contacts={contacts}
                  pointRedemptions={pointRedemptions}
                  rewardsCatalog={rewardsCatalog}
                  isSyncing={isSyncing}
                  onAddRewardItem={handleAddRewardItem}
                  onUpdateRewardStock={handleUpdateRewardStock}
                  onUpdateRewardDetails={handleUpdateRewardDetails}
                  onCompleteClaim={handleCompleteClaim}
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
