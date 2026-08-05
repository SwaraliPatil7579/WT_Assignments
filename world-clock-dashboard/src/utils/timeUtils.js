import { DAYS, MONTHS } from './constants';

export const formatTime = (date, timeZone, options = {}) => {
  const defaultOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone,
    ...options,
  };
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
};

export const formatDate = (date, timeZone) => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone,
  }).format(date);
};

export const formatShortDate = (date, timeZone) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone,
  }).format(date);
};

export const getTimeZoneOffset = (timeZone) => {
  const now = new Date();
  const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
  const tzDate = new Date(now.toLocaleString('en-US', { timeZone }));
  const offset = (tzDate - utcDate) / (1000 * 60 * 60);
  const sign = offset >= 0 ? '+' : '';
  return `UTC${sign}${offset}`;
};

export const getDayNightStatus = (date, timeZone) => {
  const hour = parseInt(new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    hour12: false,
    timeZone,
  }).format(date));
  return hour >= 6 && hour < 18 ? 'day' : 'night';
};

export const getClockAngles = (date, timeZone) => {
  const timeString = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    timeZone,
  }).format(date);

  const [hours, minutes, seconds] = timeString.split(':').map(Number);

  const secondAngle = (seconds / 60) * 360;
  const minuteAngle = ((minutes + seconds / 60) / 60) * 360;
  const hourAngle = (((hours % 12) + minutes / 60) / 12) * 360;

  return { hourAngle, minuteAngle, secondAngle };
};

export const getTimeDifference = (zone1, zone2) => {
  const now = new Date();
  const d1 = new Date(now.toLocaleString('en-US', { timeZone: zone1 }));
  const d2 = new Date(now.toLocaleString('en-US', { timeZone: zone2 }));
  const diff = (d2 - d1) / (1000 * 60 * 60);
  const hours = Math.floor(Math.abs(diff));
  const minutes = Math.floor((Math.abs(diff) - hours) * 60);
  const sign = diff >= 0 ? '+' : '-';
  return `${sign}${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
};

export const formatCountdown = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};
