import React, { useState, useEffect } from 'react';
import StatusBar from './components/StatusBar';
import BottomNav from './components/BottomNav';
import Login from './pages/Login';
import Home from './pages/Home';
import ItemDetail from './pages/ItemDetail';
import ReportForm from './pages/ReportForm';
import VerificationForm from './pages/VerificationForm';
import ChatList from './pages/ChatList';
import ChatRoom from './pages/ChatRoom';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import { INITIAL_USERS, INITIAL_ITEMS, INITIAL_CHATS } from './mockData';
import { supabase } from './supabaseClient';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [chats, setChats] = useState(INITIAL_CHATS);
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load items real-time from Supabase on mount
  useEffect(() => {
    loadItemsFromSupabase();
  }, []);

  const loadItemsFromSupabase = async () => {
    try {
      setIsSyncing(true);
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch error, using local state:', error.message);
      } else if (data && data.length > 0) {
        // Map database fields to application item schema
        const mappedItems = data.map(dbItem => ({
          id: dbItem.id,
          title: dbItem.title,
          category: dbItem.category,
          status: dbItem.status,
          location: dbItem.location,
          date: dbItem.date_reported || 'Baru saja',
          description: dbItem.description,
          specialNotes: dbItem.special_notes || '',
          reporter: {
            name: dbItem.reporter_name || 'Siswa SMK',
            role: dbItem.reporter_role || 'Siswa',
            avatar: dbItem.reporter_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
          },
          image: dbItem.image_url || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&q=80&w=600'
        }));
        setItems(mappedItems);
      }
    } catch (err) {
      console.warn('Supabase integration offline fallback:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Handlers
  const handleLogin = (user) => {
    setCurrentUser(user);
    setActiveTab(user.role === 'guru' ? 'admin' : 'home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedItem(null);
    setSelectedChat(null);
    setActiveTab('home');
  };

  const handleUpdateProfile = async (updatedUser) => {
    setCurrentUser(updatedUser);
    try {
      // Sync profile to Supabase
      await supabase.from('profiles').upsert([{
        id: updatedUser.id,
        name: updatedUser.name,
        role: updatedUser.role,
        nisn_nik: updatedUser.nisn || updatedUser.nik || '',
        class_name: updatedUser.class || '',
        phone: updatedUser.phone || '',
        email: updatedUser.email || '',
        avatar_url: updatedUser.avatar || ''
      }]);
    } catch (err) {
      console.warn('Profile sync error:', err);
    }
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setActiveTab('item-detail');
  };

  const handleStartChat = (item) => {
    let existingChat = chats.find(c => c.itemId === item.id);
    if (!existingChat) {
      existingChat = {
        id: 'chat-' + Date.now(),
        itemId: item.id,
        itemTitle: item.title,
        withUser: {
          name: item.reporter.name,
          role: item.reporter.role,
          avatar: item.reporter.avatar,
          online: true
        },
        unread: 0,
        messages: [
          {
            id: 'm-init',
            sender: 'them',
            text: `Halo! Saya ingin bertanya terkait laporan "${item.title}". Apakah masih ada?`,
            time: 'Baru saja'
          }
        ]
      };
      setChats([existingChat, ...chats]);
    }
    setSelectedChat(existingChat);
    setActiveTab('chat-room');
  };

  const handleSendMessage = async (chatId, text) => {
    const newMsg = {
      id: 'm-' + Date.now(),
      sender: 'me',
      text,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setChats(prevChats => prevChats.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMsg]
        };
      }
      return chat;
    }));

    try {
      // Sync chat message to Supabase
      await supabase.from('messages').insert([{
        chat_id: chatId,
        sender_id: currentUser?.name || 'Siswa',
        text: text
      }]);
    } catch (err) {
      console.warn('Message sync error:', err);
    }
  };

  const handleStartVerification = (item) => {
    setSelectedItem(item);
    setActiveTab('verification-form');
  };

  const handleCompleteVerification = async (itemId) => {
    if (itemId) {
      setItems(prevItems => prevItems.map(item => {
        if (item.id === itemId) {
          return { ...item, status: 'selesai' };
        }
        return item;
      }));

      try {
        // Sync item status update to Supabase
        await supabase
          .from('items')
          .update({ status: 'selesai' })
          .eq('id', itemId);
      } catch (err) {
        console.warn('Verification sync error:', err);
      }
    }

    setSelectedItem(null);
    setActiveTab('home');
  };

  const handleSubmitReport = async (newReport) => {
    setItems([newReport, ...items]);

    try {
      // Insert new item report directly into Supabase items table
      const { error } = await supabase.from('items').insert([{
        title: newReport.title,
        category: newReport.category,
        status: newReport.status,
        location: newReport.location,
        date_reported: newReport.date,
        description: newReport.description,
        special_notes: newReport.specialNotes,
        reporter_name: newReport.reporter.name,
        reporter_role: newReport.reporter.role,
        reporter_avatar: newReport.reporter.avatar,
        image_url: newReport.image
      }]);

      if (error) {
        console.warn('Supabase insert report error:', error.message);
      } else {
        // Reload items from Supabase to refresh real-time IDs
        loadItemsFromSupabase();
      }
    } catch (err) {
      console.warn('Report submit sync error:', err);
    }
  };

  const unreadCount = chats.reduce((acc, c) => acc + (c.unread || 0), 0);

  return (
    <div className="app-container">
      {/* Device Status Bar */}
      <StatusBar />

      {/* Main App Content View */}
      <div className="main-content">
        {!currentUser ? (
          <Login onLogin={handleLogin} />
        ) : (
          <>
            {activeTab === 'home' && (
              <Home
                items={items}
                currentUser={currentUser}
                onSelectItem={handleSelectItem}
                onNavigateReport={() => setActiveTab('report-form')}
              />
            )}

            {activeTab === 'item-detail' && selectedItem && (
              <ItemDetail
                item={selectedItem}
                onBack={() => setActiveTab('home')}
                onStartChat={handleStartChat}
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

            {activeTab === 'chat' && (
              <ChatList
                chats={chats}
                onSelectChat={(chat) => {
                  setSelectedChat(chat);
                  setActiveTab('chat-room');
                }}
              />
            )}

            {activeTab === 'chat-room' && selectedChat && (
              <ChatRoom
                chat={selectedChat}
                onBack={() => setActiveTab('chat')}
                onSendMessage={handleSendMessage}
                onStartVerification={handleStartVerification}
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

            {activeTab === 'admin' && (
              <AdminDashboard
                items={items}
                onSelectItem={handleSelectItem}
              />
            )}
          </>
        )}
      </div>

      {/* Bottom Navigation Bar */}
      {currentUser && (
        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentUser={currentUser}
          unreadCount={unreadCount}
        />
      )}
    </div>
  );
}
