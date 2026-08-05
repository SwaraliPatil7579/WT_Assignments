import { useState, useEffect, useCallback } from 'react';

export const useCurrentTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getTimeForZone = useCallback((timeZone) => {
    return new Date(time.toLocaleString('en-US', { timeZone }));
  }, [time]);

  return { time, getTimeForZone };
};
