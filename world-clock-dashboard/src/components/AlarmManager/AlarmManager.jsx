import React, { useState } from 'react';
import { Bell, Plus, Trash2, Volume2, VolumeX, Check, X, Repeat } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './AlarmManager.css';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const AlarmManager = () => {
  const { alarms, addAlarm, removeAlarm, toggleAlarm, activeAlarm, dismissAlarm, snoozeAlarm } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAlarm, setNewAlarm] = useState({
    time: '08:00',
    label: '',
    days: [],
    sound: true,
  });

  const handleAddAlarm = () => {
    if (newAlarm.time) {
      addAlarm(newAlarm);
      setNewAlarm({ time: '08:00', label: '', days: [], sound: true });
      setShowAddForm(false);
    }
  };

  const toggleDay = (dayIndex) => {
    setNewAlarm(prev => ({
      ...prev,
      days: prev.days.includes(dayIndex)
        ? prev.days.filter(d => d !== dayIndex)
        : [...prev.days, dayIndex].sort()
    }));
  };

  const formatAlarmTime = (time) => {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 || 12;
    return `${displayH}:${minutes} ${period}`;
  };

  return (
    <div className="alarm-manager">
      <div className="alarm-header">
        <div className="alarm-title-section">
          <Bell size={24} className="alarm-title-icon" />
          <h2 className="alarm-title">Alarms</h2>
        </div>
        <button 
          className="add-alarm-btn"
          onClick={() => setShowAddForm(true)}
        >
          <Plus size={18} />
          <span>New Alarm</span>
        </button>
      </div>

      {showAddForm && (
        <div className="alarm-form-overlay">
          <div className="alarm-form">
            <div className="form-header">
              <h3>Create New Alarm</h3>
              <button className="close-form-btn" onClick={() => setShowAddForm(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="form-group">
              <label>Time</label>
              <input
                type="time"
                value={newAlarm.time}
                onChange={(e) => setNewAlarm(prev => ({ ...prev, time: e.target.value }))}
                className="time-input"
              />
            </div>

            <div className="form-group">
              <label>Label (optional)</label>
              <input
                type="text"
                placeholder="e.g., Morning Workout"
                value={newAlarm.label}
                onChange={(e) => setNewAlarm(prev => ({ ...prev, label: e.target.value }))}
                className="label-input"
              />
            </div>

            <div className="form-group">
              <label>Repeat</label>
              <div className="days-selector">
                {DAYS_OF_WEEK.map((day, index) => (
                  <button
                    key={day}
                    className={`day-btn ${newAlarm.days.includes(index) ? 'selected' : ''}`}
                    onClick={() => toggleDay(index)}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button className="cancel-btn" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleAddAlarm}>
                <Check size={16} />
                Save Alarm
              </button>
            </div>
          </div>
        </div>
      )}

      {activeAlarm && (
        <div className="active-alarm-popup">
          <div className="active-alarm-content">
            <div className="alarm-ringing-animation">
              <Bell size={48} className="ringing-bell" />
            </div>
            <h3 className="alarm-popup-time">{formatAlarmTime(activeAlarm.time)}</h3>
            <p className="alarm-popup-label">{activeAlarm.label || 'Alarm'}</p>
            <div className="alarm-popup-actions">
              <button className="snooze-btn" onClick={snoozeAlarm}>
                Snooze (5m)
              </button>
              <button className="dismiss-btn" onClick={dismissAlarm}>
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="alarms-list">
        {alarms.length === 0 ? (
          <div className="empty-alarms">
            <Bell size={48} className="empty-icon" />
            <p>No alarms set</p>
            <span>Create your first alarm to get started</span>
          </div>
        ) : (
          alarms.map(alarm => (
            <div key={alarm.id} className={`alarm-item ${!alarm.active ? 'inactive' : ''}`}>
              <div className="alarm-info">
                <span className="alarm-time">{formatAlarmTime(alarm.time)}</span>
                {alarm.label && <span className="alarm-label-text">{alarm.label}</span>}
                <div className="alarm-days">
                  {alarm.days.length > 0 ? (
                    <>
                      <Repeat size={12} />
                      <span>{alarm.days.map(d => DAYS_OF_WEEK[d]).join(', ')}</span>
                    </>
                  ) : (
                    <span>Once</span>
                  )}
                </div>
              </div>

              <div className="alarm-actions">
                <button 
                  className="sound-toggle"
                  onClick={() => {}}
                >
                  {alarm.sound ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>

                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={alarm.active}
                    onChange={() => toggleAlarm(alarm.id)}
                  />
                  <span className="toggle-slider"></span>
                </label>

                <button 
                  className="delete-alarm-btn"
                  onClick={() => removeAlarm(alarm.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlarmManager;
