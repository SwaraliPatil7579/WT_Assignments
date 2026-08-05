import React, { useMemo } from 'react';
import { getClockAngles, getDayNightStatus } from '../../utils/timeUtils';
import './AnalogClock.css';

const AnalogClock = ({ date, timeZone, size = 200, showMarkers = true, label }) => {
  const { hourAngle, minuteAngle, secondAngle } = useMemo(
    () => getClockAngles(date, timeZone),
    [date, timeZone]
  );

  const isDay = useMemo(
    () => getDayNightStatus(date, timeZone) === 'day',
    [date, timeZone]
  );

  const markers = useMemo(() => {
    const items = [];
    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * 360;
      const isHour = i % 5 === 0;
      const length = isHour ? 12 : 6;
      const width = isHour ? 2.5 : 1;
      const radius = size / 2 - 15;

      items.push(
        <div
          key={i}
          className={`clock-marker ${isHour ? 'hour-marker' : ''}`}
          style={{
            transform: `rotate(${angle}deg)`,
            height: `${length}px`,
            width: `${width}px`,
            top: `${(size - length) / 2}px`,
            left: `calc(50% - ${width / 2}px)`,
          }}
        />
      );
    }
    return items;
  }, [size]);

  const hourNumbers = useMemo(() => {
    const numbers = [];
    for (let i = 1; i <= 12; i++) {
      const angle = ((i - 3) / 12) * 360;
      const radius = size / 2 - 28;
      const x = Math.cos((angle * Math.PI) / 180) * radius;
      const y = Math.sin((angle * Math.PI) / 180) * radius;

      numbers.push(
        <span
          key={i}
          className="clock-number"
          style={{
            transform: `translate(${x}px, ${y}px)`,
            fontSize: `${size * 0.075}px`,
          }}
        >
          {i}
        </span>
      );
    }
    return numbers;
  }, [size]);

  return (
    <div className="analog-clock-wrapper">
      <div 
        className={`analog-clock ${isDay ? 'day' : 'night'}`}
        style={{ width: size, height: size }}
      >
        <div className="clock-face">
          {showMarkers && markers}
          {hourNumbers}

          <div className="clock-center">
            <div className="center-dot" />
          </div>

          <div 
            className="hand hour-hand"
            style={{ transform: `rotate(${hourAngle}deg)` }}
          />
          <div 
            className="hand minute-hand"
            style={{ transform: `rotate(${minuteAngle}deg)` }}
          />
          <div 
            className="hand second-hand"
            style={{ transform: `rotate(${secondAngle}deg)` }}
          />

          <div className="clock-glass-overlay" />
        </div>
      </div>
      {label && <div className="clock-label">{label}</div>}
    </div>
  );
};

export default AnalogClock;
