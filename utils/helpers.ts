import { Colors } from '@/constants/Colors';

export const getAmmoniaLevelColor = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'low':
      return Colors.safe;
    case 'medium':
      return Colors.warning;
    case 'high':
      return Colors.high;
    case 'critical':
      return Colors.critical;
    default:
      return Colors.secondary;
  }
};

export const getAmmoniaCategory = (ppm: number): string => {
  if (ppm <= 10) return 'Low';
  if (ppm <= 25) return 'Medium';
  if (ppm <= 50) return 'High';
  return 'Critical';
};

export const getBatteryLevelColor = (level: number): string => {
  if (level > 60) return Colors.safe;
  if (level > 30) return Colors.warning;
  if (level > 15) return Colors.high;
  return Colors.critical;
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTime = (date: string): string => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};