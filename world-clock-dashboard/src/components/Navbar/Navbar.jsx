import React from 'react';
import { Menu, Clock, Bell, Sun, Moon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../utils/constants';
import './Navbar.css';

const Navbar = () => {
  const { isSidebarOpen, toggleSidebar, theme, toggleTheme, activeAlarm } = useApp();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button 
          className="menu-btn" 
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={22} />
        </button>
        <div className="logo">
          <Clock size={26} className="logo-icon" />
          <span className="logo-text">World Clock</span>
        </div>
      </div>

      <div className="navbar-center">
        <div className="live-indicator">
          <span className="live-dot"></span>
          <span className="live-text">LIVE</span>
        </div>
      </div>

      <div className="navbar-right">
        <button 
          className="theme-btn" 
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <button 
          className="notification-btn"
          aria-label="Notifications"
        >
          <Bell size={20} />
          {activeAlarm && <span className="notification-badge"></span>}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
