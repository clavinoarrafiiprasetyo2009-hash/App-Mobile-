import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

export default function StatusBar() {
  return (
    <div className="status-bar">
      <span>08:30</span>
      <div className="status-bar-icons">
        <Signal size={14} />
        <Wifi size={14} />
        <Battery size={16} />
        <span style={{ fontSize: '11px', marginLeft: '2px' }}>100%</span>
      </div>
    </div>
  );
}
