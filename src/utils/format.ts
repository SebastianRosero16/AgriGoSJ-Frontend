/**
 * Format utilities
 * Used for: Data formatting, display transformation
 */

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency: string = 'COP'): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date
 */
export function formatDate(date: Date | string, format: 'short' | 'long' | 'full' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  const formats: Record<string, Intl.DateTimeFormatOptions> = {
    short: { year: 'numeric', month: '2-digit', day: '2-digit' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
  };

  return new Intl.DateTimeFormat('es-CO', formats[format]).format(d);
}

/**
 * Safely format a date string (YYYY-MM-DD or ISO) without timezone shifts.
 * If input is 'YYYY-MM-DD' it constructs a local Date using year, month, day
 * to avoid UTC offset causing previous-day display.
 */
export function formatDateSafe(dateStr?: string | null): string {
  if (!dateStr) return '';

  // If ISO with time, use existing formatter (will consider timezone)
  if (dateStr.includes('T')) {
    try {
      return formatDate(new Date(dateStr), 'short');
    } catch {
      return dateStr.split('T')[0];
    }
  }

  // If plain YYYY-MM-DD, parse parts and create local Date
  const parts = dateStr.split('-');
  if (parts.length >= 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month, day);
    try {
      return formatDate(d, 'short');
    } catch {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  }

  return dateStr;
}

/**
 * Format date time
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/**
 * Format relative time (e.g., "hace 2 horas")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Hace unos segundos';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `Hace ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `Hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `Hace ${diffInDays} ${diffInDays === 1 ? 'día' : 'días'}`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `Hace ${diffInMonths} ${diffInMonths === 1 ? 'mes' : 'meses'}`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `Hace ${diffInYears} ${diffInYears === 1 ? 'año' : 'años'}`;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format number with separators
 */
export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format currency as integer (no decimales)
 */
export function formatCurrencyInteger(amount: number, currency: string = 'COP'): string {
  const value = Number.isFinite(amount) ? Math.round(amount) : 0;
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Translate input/store type enum or string to a Spanish label.
 * Handles common backend enum values (FERTILIZER, PESTICIDE, SEED, etc.).
 */
export function translateInputType(type?: string | null): string {
  if (!type) return '-';
  const t = String(type).trim().toUpperCase();
  const map: Record<string, string> = {
    'FERTILIZER': 'Fertilizante',
    'FERTILIZANTE': 'Fertilizante',
    'PESTICIDE': 'Pesticida',
    'PESTICIDA': 'Pesticida',
    'SEED': 'Semilla',
    'SEMILLA': 'Semilla',
    'HERBICIDE': 'Herbicida',
    'HERBICIDA': 'Herbicida',
    'FUNGICIDE': 'Fungicida',
    'FUNGICIDA': 'Fungicida',
    'TOOL': 'Herramienta',
    'HERRAMIENTA': 'Herramienta',
    'OTHER': 'Otro',
    'OTRO': 'Otro',
  };

  return map[t] || // if mapping not found, try a friendly capitalization
    (type.charAt(0).toUpperCase() + type.slice(1).toLowerCase());
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
  }
  
  return phone;
}

/**
 * Convert to slug
 */
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Parse currency string to number
 */
export function parseCurrency(value: string): number {
  return parseFloat(value.replace(/[^\d.-]/g, ''));
}

/**
 * Format distance (km)
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}
