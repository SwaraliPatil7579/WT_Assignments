import React from 'react';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import WorldClockGrid from './components/WorldClockGrid/WorldClockGrid';
import AlarmManager from './components/AlarmManager/AlarmManager';
import TimeZoneSelector from './components/TimeZoneSelector/TimeZoneSelector';
import Stopwatch from './components/Stopwatch/Stopwatch';
import Timer from './components/Timer/Timer';
import { useApp } from './context/AppContext';
import './App.css';

const Content = () => {
  const { activeTab } = useApp();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'world-clocks':
        return <WorldClockGrid />;
      case 'alarms':
        return <AlarmManager />;
      case 'stopwatch':
        return <Stopwatch />;
      case 'timer':
        return <Timer />;
      case 'settings':
        return <TimeZoneSelector />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <main className="main-content">
      {renderContent()}
    </main>
  );
};

const App = () => {
  return (
    <AppProvider>
      <div className="app">
        <Navbar />
        <Sidebar />
        <div className="content-wrapper">
          <Content />
        </div>
      </div>
    </AppProvider>
  );
};

export default App;
