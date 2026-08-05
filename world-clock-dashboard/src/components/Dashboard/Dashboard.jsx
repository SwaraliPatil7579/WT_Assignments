import React from 'react';
import { Globe, Bell, Watch, Timer } from 'lucide-react';
import AnalogClock from '../AnalogClock/AnalogClock';
import DigitalClock from '../DigitalClock/DigitalClock';
import { useApp } from '../../context/AppContext';
import './Dashboard.css';

const QuickStat = ({ icon: Icon, label, value, color }) => (
  <div className="quick-stat">
    <div className={`stat-icon ${color}`}>
      <Icon size={20} />
    </div>
    <div className="stat-info">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  </div>
);

const Dashboard = () => {
  const { time, selectedZones, alarms, setActiveTab, getSelectedZonesInfo } = useApp();
  const zones = getSelectedZonesInfo();
  const activeAlarms = alarms.filter(a => a.active).length;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Real-time world clock overview</p>
      </div>

      <div className="hero-section">
        <div className="hero-clock">
          <AnalogClock date={time} timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone} size={280} />
          <DigitalClock 
            date={time} 
            timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}
            showDate={true}
            showOffset={false}
          />
        </div>
      </div>

      <div className="quick-stats">
        <QuickStat 
          icon={Globe} 
          label="Cities Tracked" 
          value={selectedZones.length} 
          color="blue"
        />
        <QuickStat 
          icon={Bell} 
          label="Active Alarms" 
          value={activeAlarms} 
          color="orange"
        />
        <QuickStat 
          icon={Watch} 
          label="Stopwatch" 
          value="Ready" 
          color="green"
        />
        <QuickStat 
          icon={Timer} 
          label="Timer" 
          value="Ready" 
          color="purple"
        />
      </div>

      <div className="preview-section">
        <div className="preview-header">
          <h3>Quick View</h3>
          <button className="view-all-btn" onClick={() => setActiveTab('world-clocks')}>
            View All
          </button>
        </div>

        <div className="preview-grid">
          {zones.slice(0, 4).map(zone => {
            const zoneDate = new Date(time.toLocaleString('en-US', { timeZone: zone.zone }));
            return (
              <div key={zone.id} className="preview-card" onClick={() => setActiveTab('world-clocks')}>
                <div className="preview-city">
                  <span className="preview-name">{zone.city}</span>
                  <span className="preview-country">{zone.country}</span>
                </div>
                <DigitalClock 
                  date={zoneDate} 
                  timeZone={zone.zone} 
                  showDate={false} 
                  showOffset={false}
                  compact={true}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
