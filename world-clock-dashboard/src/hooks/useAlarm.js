import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'world-clock-alarms';

export const useAlarm = () => {
  const [alarms, setAlarms] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [activeAlarm, setActiveAlarm] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
  }, [alarms]);

  useEffect(() => {
    const checkAlarms = setInterval(() => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const currentDay = now.getDay();

      alarms.forEach(alarm => {
        if (alarm.active && alarm.time === currentTime && !alarm.triggeredToday) {
          const daysMatch = alarm.days.length === 0 || alarm.days.includes(currentDay);
          if (daysMatch) {
            triggerAlarm(alarm);
            setAlarms(prev => prev.map(a => 
              a.id === alarm.id ? { ...a, triggeredToday: true } : a
            ));
          }
        }
      });

      // Reset triggered status at midnight
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        setAlarms(prev => prev.map(a => ({ ...a, triggeredToday: false })));
      }
    }, 1000);

    return () => clearInterval(checkAlarms);
  }, [alarms]);

  const triggerAlarm = useCallback((alarm) => {
    setActiveAlarm(alarm);
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, []);

  const addAlarm = useCallback((alarm) => {
    const newAlarm = {
      id: Date.now().toString(),
      ...alarm,
      active: true,
      triggeredToday: false,
      createdAt: new Date().toISOString(),
    };
    setAlarms(prev => [...prev, newAlarm]);
    return newAlarm.id;
  }, []);

  const removeAlarm = useCallback((id) => {
    setAlarms(prev => prev.filter(a => a.id !== id));
  }, []);

  const toggleAlarm = useCallback((id) => {
    setAlarms(prev => prev.map(a => 
      a.id === id ? { ...a, active: !a.active, triggeredToday: false } : a
    ));
  }, []);

  const dismissAlarm = useCallback(() => {
    setActiveAlarm(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const snoozeAlarm = useCallback(() => {
    if (activeAlarm) {
      const now = new Date();
      const snoozeTime = new Date(now.getTime() + 5 * 60 * 1000);
      const newTime = `${String(snoozeTime.getHours()).padStart(2, '0')}:${String(snoozeTime.getMinutes()).padStart(2, '0')}`;

      setAlarms(prev => prev.map(a => 
        a.id === activeAlarm.id ? { ...a, time: newTime, triggeredToday: false } : a
      ));
      dismissAlarm();
    }
  }, [activeAlarm, dismissAlarm]);

  return {
    alarms,
    activeAlarm,
    addAlarm,
    removeAlarm,
    toggleAlarm,
    dismissAlarm,
    snoozeAlarm,
    audioRef,
  };
};
