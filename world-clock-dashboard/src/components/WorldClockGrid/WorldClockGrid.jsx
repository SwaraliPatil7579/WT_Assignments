import React from 'react';
import { X, MapPin } from 'lucide-react';
import AnalogClock from '../AnalogClock/AnalogClock';
import DigitalClock from '../DigitalClock/DigitalClock';
import { useApp } from '../../context/AppContext';
import { formatShortDate, getTimeZoneOffset } from '../../utils/timeUtils';
import './WorldClockGrid.css';

const WorldClockCard = ({ zoneInfo, date }) => {
  const { removeZone } = useApp();
  const zoneDate = new Date(date.toLocaleString('en-US', { timeZone: zoneInfo.zone }));

  return (
    <div className="world-clock-card">
      <button 
        className="remove-zone-btn"
        onClick={() => removeZone(zoneInfo.id)}
        title="Remove city"
      >
        <X size={14} />
      </button>

      <div className="world-clock-header">
        <div className="city-info">
          <MapPin size={14} className="city-icon" />
          <div className="city-details">
            <h3 className="city-name">{zoneInfo.city}</h3>
            <span className="country-name">{zoneInfo.country}</span>
          </div>
        </div>
        <span className="zone-offset">{getTimeZoneOffset(zoneInfo.zone)}</span>
      </div>

      <div className="world-clock-body">
        <AnalogClock 
          date={zoneDate} 
          timeZone={zoneInfo.zone} 
          size={140}
          showMarkers={true}
        />
        <DigitalClock 
          date={zoneDate} 
          timeZone={zoneInfo.zone} 
          showDate={false} 
          showOffset={false}
          compact={true}
        />
      </div>

      <div className="world-clock-footer">
        <span className="short-date">{formatShortDate(zoneDate, zoneInfo.zone)}</span>
      </div>
    </div>
  );
};

const WorldClockGrid = () => {
  const { time, getSelectedZonesInfo } = useApp();
  const zones = getSelectedZonesInfo();

  return (
    <div className="world-clock-grid">
      <div className="grid-header">
        <h2 className="grid-title">World Clocks</h2>
        <span className="grid-count">{zones.length} cities</span>
      </div>

      <div className="clocks-grid">
        {zones.map((zone) => (
          <WorldClockCard 
            key={zone.id} 
            zoneInfo={zone} 
            date={time}
          />
        ))}
      </div>
    </div>
  );
};

export default WorldClockGrid;
