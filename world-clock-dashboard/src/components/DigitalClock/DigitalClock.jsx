import React, { useMemo } from 'react';
import { formatTime, formatDate, getTimeZoneOffset, getDayNightStatus } from '../../utils/timeUtils';
import { Sun, Moon } from 'lucide-react';
import './DigitalClock.css';

const DigitalClock = ({ date, timeZone, showDate = true, showOffset = true, compact = false }) => {
  const timeString = useMemo(() => formatTime(date, timeZone), [date, timeZone]);
  const dateString = useMemo(() => formatDate(date, timeZone), [date, timeZone]);
  const offset = useMemo(() => getTimeZoneOffset(timeZone), [timeZone]);
  const isDay = useMemo(() => getDayNightStatus(date, timeZone) === 'day', [date, timeZone]);

  const [timePart, periodPart] = timeString.split(' ');
  const [hours, minutes, seconds] = timePart.split(':');

  if (compact) {
    return (
      <div className="digital-clock-compact">
        <div className="digital-time-compact">
          <span className="digit-compact">{hours}</span>
          <span className="separator-compact">:</span>
          <span className="digit-compact">{minutes}</span>
          <span className="period-compact">{periodPart}</span>
        </div>
        {showOffset && <span className="offset-compact">{offset}</span>}
      </div>
    );
  }

  return (
    <div className="digital-clock">
      <div className="digital-time-display">
        <div className="time-container">
          <span className="digit">{hours}</span>
          <span className="separator">:</span>
          <span className="digit">{minutes}</span>
          <span className="separator">:</span>
          <span className="digit seconds">{seconds}</span>
          <span className="period">{periodPart}</span>
        </div>
        <div className="day-night-indicator">
          {isDay ? (
            <Sun size={18} className="day-icon" />
          ) : (
            <Moon size={18} className="night-icon" />
          )}
        </div>
      </div>

      {showDate && (
        <div className="digital-date">
          {dateString}
        </div>
      )}

      {showOffset && (
        <div className="digital-offset">
          <span className="offset-label">Timezone Offset</span>
          <span className="offset-value">{offset}</span>
        </div>
      )}
    </div>
  );
};

export default DigitalClock;
