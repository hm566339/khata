import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { hi } from 'date-fns/locale';
import { CURRENCY, FORMAT } from '@constants';

/**
 * Format date string to Hindi date format
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, FORMAT.dateFormat, { locale: hi });
  } catch (error) {
    return 'Invalid date';
  }
};

/**
 * Format datetime string
 */
export const formatDateTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, FORMAT.dateTimeFormat, { locale: hi });
  } catch (error) {
    return 'Invalid date';
  }
};

/**
 * Format time from string
 */
export const formatTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, FORMAT.timeFormat);
  } catch (error) {
    return 'Invalid time';
  }
};

/**
 * Get relative time string (e.g., "2 days ago")
 */
export const getRelativeTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { locale: hi, addSuffix: true });
  } catch (error) {
    return 'Unknown time';
  }
};

/**
 * Format currency with rupee symbol
 */
export const formatCurrency = (amount: number, decimals: number = 2): string => {
  return `${CURRENCY} ${amount.toFixed(decimals)}`;
};

/**
 * Format number as percentage
 */
export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Check if date is today
 */
export const isToday = (dateString: string): boolean => {
  try {
    const date = parseISO(dateString);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  } catch (error) {
    return false;
  }
};

/**
 * Get day of week in Hindi
 */
export const getDayOfWeek = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'EEEE', { locale: hi });
  } catch (error) {
    return 'Unknown';
  }
};
