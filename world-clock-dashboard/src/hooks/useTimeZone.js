import { useState, useEffect, useCallback } from 'react';
import { TIME_ZONES } from '../utils/constants';

const STORAGE_KEY = 'world-clock-selected-zones';

export const useTimeZone = () => {
  const [selectedZones, setSelectedZones] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
      return ['local', 'nyc', 'london', 'tokyo', 'sydney'];
    } catch {
      return ['local', 'nyc', 'london', 'tokyo', 'sydney'];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedZones));
  }, [selectedZones]);

  const addZone = useCallback((zoneId) => {
    setSelectedZones(prev => {
      if (prev.includes(zoneId)) return prev;
      return [...prev, zoneId];
    });
  }, []);

  const removeZone = useCallback((zoneId) => {
    setSelectedZones(prev => prev.filter(id => id !== zoneId));
  }, []);

  const reorderZones = useCallback((newOrder) => {
    setSelectedZones(newOrder);
  }, []);

  const getZoneInfo = useCallback((zoneId) => {
    return TIME_ZONES.find(z => z.id === zoneId) || TIME_ZONES[0];
  }, []);

  const getSelectedZonesInfo = useCallback(() => {
    return selectedZones.map(id => getZoneInfo(id)).filter(Boolean);
  }, [selectedZones, getZoneInfo]);

  return {
    selectedZones,
    addZone,
    removeZone,
    reorderZones,
    getZoneInfo,
    getSelectedZonesInfo,
    allZones: TIME_ZONES,
  };
};
