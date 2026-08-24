import { FollowUpInfo } from '../types';

/**
 * Format a number into Malaysian Ringgit (RM) format.
 * Example: 28500 -> "RM 28,500"
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return 'RM 0';
  }
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(Number(amount))
    .replace('MYR', 'RM');
}

/**
 * Format date string into human readable format.
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-MY', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Format date into short date: "14 Aug 2026"
 */
export function formatShortDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-MY', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Calculate relative time (e.g. "5m ago", "2h ago", "1d ago")
 */
export function getRelativeTime(dateString: string | null | undefined): string {
  if (!dateString) return '';
  try {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return formatShortDate(dateString);
  } catch {
    return '';
  }
}

/**
 * Clean and normalize Malaysian phone numbers for wa.me links.
 * Handles 012-345 6789, +6019..., 6011..., etc.
 */
export function cleanMalaysianPhone(phone: string | null | undefined): string {
  if (!phone) return '';
  let cleaned = phone.replace(/[^0-9]/g, '');

  // If starts with 0 (e.g. 0123456789) -> 60123456789
  if (cleaned.startsWith('0')) {
    cleaned = '6' + cleaned;
  }
  // If no prefix and length is 9-10 -> add 60
  else if (cleaned.length === 9 || cleaned.length === 10) {
    cleaned = '60' + cleaned;
  }

  return cleaned;
}

/**
 * Generate a direct WhatsApp Web / app launcher link with optional pre-filled text.
 */
export function getWhatsAppUrl(phone: string | null | undefined, text: string = ''): string {
  const cleanPhone = cleanMalaysianPhone(phone);
  const encodedText = encodeURIComponent(text);
  if (!cleanPhone) return '#';
  return `https://wa.me/${cleanPhone}${encodedText ? `?text=${encodedText}` : ''}`;
}

/**
 * Check follow-up status (overdue, due today, upcoming)
 */
export function getFollowUpStatus(followUpDateString: string | null | undefined): FollowUpInfo {
  if (!followUpDateString) return { status: 'none', label: '', daysDiff: null };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(followUpDateString);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      status: 'overdue',
      label: `${Math.abs(diffDays)}d Overdue`,
      daysDiff: diffDays,
    };
  }
  if (diffDays === 0) {
    return {
      status: 'today',
      label: 'Due Today',
      daysDiff: 0,
    };
  }
  if (diffDays === 1) {
    return {
      status: 'upcoming',
      label: 'Tomorrow',
      daysDiff: 1,
    };
  }
  return {
    status: 'upcoming',
    label: `In ${diffDays} days`,
    daysDiff: diffDays,
  };
}
