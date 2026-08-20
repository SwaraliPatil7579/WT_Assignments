import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Bell } from 'lucide-react';
import './Timer.css';

const Timer = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsComplete(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (!isRunning && timeLeft === 0) {
      const total = hours * 3600 + minutes * 60 + seconds;
      setTimeLeft(total);
    }
    setIsRunning(!isRunning);
    setIsComplete(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsComplete(false);
    const total = hours * 3600 + minutes * 60 + seconds;
    setTimeLeft(total);
  };

  const handleSetTime = () => {
    setIsRunning(false);
    setIsComplete(false);
    const total = hours * 3600 + minutes * 60 + seconds;
    setTimeLeft(total);
  };

  const progress = timeLeft > 0 
    ? (timeLeft / (hours * 3600 + minutes * 60 + seconds || 1)) * 100 
    : 0;

  return (
    <div className="timer">
      <div className="timer-header">
        <h2 className="timer-title">Timer</h2>
      </div>

      {isComplete && (
        <div className="timer-complete">
          <Bell size={32} className="complete-bell" />
          <span>Time's up!</span>
        </div>
      )}

      <div className="timer-display">
        <div className="timer-circle">
          <svg viewBox="0 0 200 200" className="timer-svg">
            <defs>
              <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1e3a5f" />
                <stop offset="100%" stopColor="#3182ce" />
              </linearGradient>
            </defs>
            <circle 
              cx="100" 
              cy="100" 
              r="90" 
              className="timer-track"
            />
            <circle 
              cx="100" 
              cy="100" 
              r="90" 
              className="timer-progress"
              style={{
                strokeDasharray: `${2 * Math.PI * 90}`,
                strokeDashoffset: `${2 * Math.PI * 90 * (1 - progress / 100)}`
              }}
            />
          </svg>
          <div className="timer-time">{formatTime(timeLeft)}</div>
        </div>
      </div>

      <div className="timer-inputs">
        <div className="time-input-group">
          <label>Hours</label>
          <input
            type="number"
            min="0"
            max="23"
            value={hours}
            onChange={(e) => setHours(Math.max(0, Math.min(23, parseInt(e.target.value) || 0)))}
          />
        </div>
        <div className="time-input-group">
          <label>Minutes</label>
          <input
            type="number"
            min="0"
            max="59"
            value={minutes}
            onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
          />
        </div>
        <div className="time-input-group">
          <label>Seconds</label>
          <input
            type="number"
            min="0"
            max="59"
            value={seconds}
            onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
          />
        </div>
      </div>

      <div className="timer-controls">
        <button className="timer-btn set" onClick={handleSetTime}>
          Set
        </button>
        <button 
          className={`timer-btn ${isRunning ? 'pause' : 'start'}`}
          onClick={handleStart}
        >
          {isRunning ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Start</>}
        </button>
        <button className="timer-btn reset" onClick={handleReset}>
          <RotateCcw size={18} /> Reset
        </button>
      </div>
    </div>
  );
};

export default Timer;
