// Helper utility for managing Auction Expiration & Transfer to Points catalog

export function isAuctionExpired(item, durationDays = 7) {
  if (!item) return false;

  // Explicit status check: if marked as points or expired
  if (item.status === 'points' || item.status === 'expired_lelang' || item.isAuctionExpired === true) {
    return true;
  }

  // Check if item belongs to auction
  const isAuctionItem = item.status === 'lelang' || 
                        item.isAuction || 
                        (item.specialNotes && item.specialNotes.toLowerCase().includes('harga lelang:')) ||
                        (item.title && item.title.toLowerCase().includes('lelang'));

  if (!isAuctionItem) return false;

  let baseTime;
  if (item.auctionStartDate || item.auction_start_date) {
    const parsed = new Date(item.auctionStartDate || item.auction_start_date).getTime();
    if (!isNaN(parsed)) baseTime = parsed;
  }
  if (!baseTime && item.created_at) {
    const parsed = new Date(item.created_at).getTime();
    if (!isNaN(parsed)) baseTime = parsed;
  }
  if (!baseTime && (item.dateReported || item.date_reported || item.date)) {
    const parsed = new Date(item.dateReported || item.date_reported || item.date).getTime();
    if (!isNaN(parsed)) baseTime = parsed;
  }

  const itemId = item.id || item.title || 'default';
  const storageKey = `sitemu_auction_start_${itemId}`;
  if (!baseTime || isNaN(baseTime)) {
    try {
      const savedTime = localStorage.getItem(storageKey);
      if (savedTime) {
        baseTime = parseInt(savedTime, 10);
      }
    } catch (e) {}
  }

  if (!baseTime) return false;

  const targetTime = baseTime + (durationDays * 24 * 60 * 60 * 1000);
  return Date.now() >= targetTime;
}
