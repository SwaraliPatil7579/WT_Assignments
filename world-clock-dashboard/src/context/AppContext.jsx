import React, { createContext, useContext, useState } from 'react';
import { useCurrentTime } from '../hooks/useCurrentTime';
import { useAlarm } from '../hooks/useAlarm';
import { useTimeZone } from '../hooks/useTimeZone';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState('light');

  const currentTime = useCurrentTime();
  const alarm = useAlarm();
  const timeZone = useTimeZone();

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const value = {
    activeTab,
    setActiveTab,
    isSidebarOpen,
    toggleSidebar,
    theme,
    toggleTheme,
    ...currentTime,
    ...alarm,
    ...timeZone,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
