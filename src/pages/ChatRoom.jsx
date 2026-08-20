import React, { useState } from 'react';
import Header from '../components/Header';
import { Send, FileCheck, Phone } from 'lucide-react';

export default function ChatRoom({ chat, onBack, onSendMessage, onStartVerification }) {
  const [inputText, setInputText] = useState('');

  if (!chat) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(chat.id, inputText);
    setInputText('');
  };

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      <Header
        title={chat.withUser.name}
        onBack={onBack}
        rightAction={
          <button style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer' }}>
            <Phone size={18} />
          </button>
        }
      />

      {/* Quick Action Top Bar */}
      <div style={{
        background: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: '14px',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '14px',
        flexShrink: 0
      }}>
        <div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Membahas Laporan:</span>
          <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>{chat.itemTitle}</h4>
        </div>
        <button
          onClick={() => onStartVerification({ id: chat.itemId, title: chat.itemTitle })}
          style={{
            padding: '6px 12px',
            borderRadius: '10px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <FileCheck size={14} />
          Ajukan Verifikasi
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        paddingRight: '4px',
        marginBottom: '14px'
      }}>
        {chat.messages.map((msg) => {
          const isMe = msg.sender === 'me';
          return (
            <div
              key={msg.id}
              style={{
                alignSelf: isMe ? 'flex-end' : 'flex-start',
                maxWidth: '80%'
              }}
            >
              <div style={{
                background: isMe ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : '#ffffff',
                color: isMe ? 'white' : '#0f172a',
                padding: '10px 14px',
                borderRadius: isMe ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                fontSize: '13px',
                lineHeight: '1.4',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                border: isMe ? 'none' : '1px solid #e2e8f0'
              }}>
                {msg.text}
              </div>
              <span style={{
                fontSize: '10px',
                color: '#94a3b8',
                marginTop: '3px',
                display: 'block',
                textAlign: isMe ? 'right' : 'left'
              }}>
                {msg.time}
              </span>
            </div>
          );
        })}
      </div>

      {/* Input Message Form */}
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
        <input
          type="text"
          className="form-input"
          style={{ borderRadius: '24px', background: '#ffffff', color: '#0f172a' }}
          placeholder="Ketik pesan..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button
          type="submit"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
