import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency to Malaysian Ringgit (RM)
 * Example: 28500 -> RM 28,500
 */
export function formatCurrency(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return 'RM 0';
  const formatted = new Intl.NumberFormat('en-MY', {
    maximumFractionDigits: 0,
  }).format(amount);
  return `RM ${formatted}`;
}

/**
 * Cleans and standardizes Malaysian phone numbers for wa.me links
 * e.g. "012-345 6789" -> "60123456789"
 * e.g. "+6019-8882341" -> "60198882341"
 * e.g. "60123456789" -> "60123456789"
 */
export function cleanMalaysianPhone(phone) {
  if (!phone) return '';
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '6' + cleaned;
  }
  return cleaned;
}

/**
 * Builds a direct wa.me link with encoded message
 */
export function getWhatsAppUrl(phone, message = '') {
  const cleanPhone = cleanMalaysianPhone(phone);
  if (!cleanPhone) return '#';
  if (!message) return `https://wa.me/${cleanPhone}`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  
  return new Intl.DateTimeFormat('en-MY', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatShortDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  
  return new Intl.DateTimeFormat('en-MY', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function getRelativeTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatShortDate(dateString);
}

export function getFollowUpStatus(dateString) {
  if (!dateString) return { status: 'none', label: 'No follow-up set' };
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const target = new Date(dateString);
  target.setHours(0, 0, 0, 0);
  
  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return { status: 'overdue', label: `${Math.abs(diffDays)}d overdue`, days: diffDays };
  } else if (diffDays === 0) {
    return { status: 'today', label: 'Due today', days: 0 };
  } else if (diffDays === 1) {
    return { status: 'tomorrow', label: 'Due tomorrow', days: 1 };
  } else {
    return { status: 'upcoming', label: `In ${diffDays} days`, days: diffDays };
  }
}
