// Notification Helper Utility untuk SiTemu Sekolah

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.warn('Browser ini tidak mendukung notifikasi push.');
    return 'unsupported';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      sendLocalNotification('Notifikasi SiTemu Aktif! 🔔', {
        body: 'Kamu akan menerima info real-time saat ada barang hilang, temuan, atau lelang baru di sekolah.',
        tag: 'welcome-notification'
      });
    }
    return permission;
  } catch (err) {
    console.warn('Gagal meminta izin notifikasi:', err);
    return 'denied';
  }
};

export const getNotificationPermissionState = () => {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission;
};

export const sendLocalNotification = (title, options = {}) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  const defaultOptions = {
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    vibrate: [100, 50, 100],
    timestamp: Date.now(),
    ...options
  };

  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.ready.then(registration => {
      registration.showNotification(title, defaultOptions);
    }).catch(() => {
      new Notification(title, defaultOptions);
    });
  } else {
    try {
      new Notification(title, defaultOptions);
    } catch (e) {
      console.warn('Fallback notification trigger error:', e);
    }
  }
};

export const notifyNewReport = (itemTitle, status = 'hilang') => {
  const isHilang = status === 'hilang';
  sendLocalNotification(`📢 Laporan ${isHilang ? 'Barang Hilang' : 'Barang Ditemukan'} Baru!`, {
    body: `"${itemTitle}" baru saja dilaporkan di sekolah. Cek aplikasi SiTemu sekarang!`,
    tag: `report-${Date.now()}`
  });
};

export const notifyStatusChange = (itemTitle, newStatus) => {
  let text = `Status barang "${itemTitle}" telah diperbarui menjadi ${newStatus}.`;
  if (newStatus === 'selesai') {
    text = `🎉 Barang "${itemTitle}" berhasil diverifikasi & dikembalikan! Terima kasih.`;
  } else if (newStatus === 'ditemukan') {
    text = `🟢 Barang "${itemTitle}" telah ditemukan! Silakan cek info pengambilan di Ruang BK.`;
  }

  sendLocalNotification('🔔 Pembaruan Status Barang', {
    body: text,
    tag: `status-${Date.now()}`
  });
};
