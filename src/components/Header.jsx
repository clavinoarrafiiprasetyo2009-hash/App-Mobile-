import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function Header({ title, onBack, rightAction }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 0 14px 0',
      borderBottom: '1px solid #e2e8f0',
      marginBottom: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {onBack && (
          <button 
            onClick={onBack}
            style={{
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>{title}</h2>
      </div>
      {rightAction && <div>{rightAction}</div>}
    </div>
  );
}
