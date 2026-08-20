import React from 'react';
import Header from '../components/Header';
import { MessageSquare, ChevronRight } from 'lucide-react';

export default function ChatList({ chats, onSelectChat }) {
  return (
    <div className="animate-fade">
      <Header title="Pesan & Percakapan" />

      {chats.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
          <MessageSquare size={36} color="#94a3b8" style={{ marginBottom: '10px' }} />
          <p style={{ fontSize: '14px', fontWeight: 600 }}>Belum ada obrolan aktif</p>
          <p style={{ fontSize: '12px', marginTop: '4px' }}>Mulai percakapan dengan pelapor barang dari detail barang.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {chats.map(chat => {
            const lastMsg = chat.messages[chat.messages.length - 1];
            return (
              <div
                key={chat.id}
                className="glass-card"
                onClick={() => onSelectChat(chat)}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}
              >
                <div style={{ position: 'relative' }}>
                  <img
                    src={chat.withUser.avatar}
                    alt={chat.withUser.name}
                    style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  {chat.withUser.online && (
                    <span style={{
                      position: 'absolute',
                      bottom: '2px',
                      right: '2px',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: '#10b981',
                      border: '2px solid #ffffff'
                    }} />
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{chat.withUser.name}</h4>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>{lastMsg?.time || ''}</span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: 700, display: 'block', marginBottom: '2px' }}>
                    📌 {chat.itemTitle}
                  </span>
                  <p style={{
                    fontSize: '12px',
                    color: '#64748b',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {lastMsg?.text || 'Mulai pesan...'}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {chat.unread > 0 && (
                    <span style={{
                      background: '#ef4444',
                      color: 'white',
                      fontSize: '10px',
                      fontWeight: 800,
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {chat.unread}
                    </span>
                  )}
                  <ChevronRight size={16} color="#94a3b8" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
