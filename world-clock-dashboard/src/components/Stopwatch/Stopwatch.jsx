import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import './Stopwatch.css';

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      const startTime = Date.now() - time;
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, time]);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
  };

  const handleStartStop = () => setIsRunning(!isRunning);

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    setLaps(prev => [...prev, { id: Date.now(), time }]);
  };

  return (
    <div className="stopwatch">
      <div className="stopwatch-header">
        <h2 className="stopwatch-title">Stopwatch</h2>
      </div>

      <div className="stopwatch-display">
        <div className="stopwatch-time">{formatTime(time)}</div>
      </div>

      <div className="stopwatch-controls">
        <button 
          className={`control-btn ${isRunning ? 'pause' : 'start'}`}
          onClick={handleStartStop}
        >
          {isRunning ? <Pause size={20} /> : <Play size={20} />}
          <span>{isRunning ? 'Pause' : 'Start'}</span>
        </button>

        <button 
          className="control-btn lap"
          onClick={handleLap}
          disabled={!isRunning}
        >
          <Flag size={20} />
          <span>Lap</span>
        </button>

        <button 
          className="control-btn reset"
          onClick={handleReset}
        >
          <RotateCcw size={20} />
          <span>Reset</span>
        </button>
      </div>

      {laps.length > 0 && (
        <div className="laps-list">
          <div className="laps-header">
            <span>Lap</span>
            <span>Time</span>
            <span>Split</span>
          </div>
          {laps.map((lap, index) => {
            const prevTime = index > 0 ? laps[index - 1].time : 0;
            const split = lap.time - prevTime;
            return (
              <div key={lap.id} className="lap-item">
                <span className="lap-number">#{index + 1}</span>
                <span className="lap-time">{formatTime(lap.time)}</span>
                <span className="lap-split">+{formatTime(split)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Stopwatch;
