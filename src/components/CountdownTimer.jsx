import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function CountdownTimer({ dateReported, created_at, durationDays = 7, compact = false }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    let baseTime;
    if (created_at) {
      baseTime = new Date(created_at).getTime();
    } else if (dateReported) {
      baseTime = new Date(dateReported).getTime();
    }
    
    // If date is invalid or mock string like "2026-08-22", set default baseTime as 2 days ago (5 days remaining)
    if (!baseTime || isNaN(baseTime)) {
      baseTime = Date.now() - (2 * 24 * 60 * 60 * 1000); 
    }

    const targetTime = baseTime + (durationDays * 24 * 60 * 60 * 1000);

    const updateTimer = () => {
      const now = Date.now();
      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [dateReported, created_at, durationDays]);

  if (timeLeft.isExpired) {
    return (
      <span style={{
        background: '#fef2f2',
        color: '#dc2626',
        border: '1px solid #fecaca',
        padding: compact ? '2px 6px' : '3px 8px',
        borderRadius: '12px',
        fontSize: compact ? '9.5px' : '10px',
        fontWeight: 800,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        ⏳ Expired ➔ Poin
      </span>
    );
  }

  const isUrgent = timeLeft.days === 0 && timeLeft.hours < 5;

  return (
    <span style={{
      background: isUrgent ? '#fee2e2' : '#fee2e2',
      color: '#dc2626',
      border: '1px solid #fecaca',
      padding: compact ? '2px 6px' : '3px 8px',
      borderRadius: '12px',
      fontSize: compact ? '9.5px' : '10px',
      fontWeight: 800,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      fontVariantNumeric: 'tabular-nums',
      boxShadow: isUrgent ? '0 0 8px rgba(220, 38, 38, 0.3)' : 'none'
    }}>
      <Clock size={11} color="#dc2626" />
      <span>
        {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
        {String(timeLeft.hours).padStart(2, '0')}:
        {String(timeLeft.minutes).padStart(2, '0')}:
        {String(timeLeft.seconds).padStart(2, '0')}
      </span>
    </span>
  );
}
