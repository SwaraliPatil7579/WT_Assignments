import React from 'react';
import { 
  LayoutDashboard, 
  Globe, 
  Bell, 
  Timer, 
  Watch,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './Sidebar.css';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'world-clocks', label: 'World Clocks', icon: Globe },
  { id: 'alarms', label: 'Alarms', icon: Bell },
  { id: 'stopwatch', label: 'Stopwatch', icon: Watch },
  { id: 'timer', label: 'Timer', icon: Timer },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const Sidebar = () => {
  const { isSidebarOpen, activeTab, setActiveTab } = useApp();

  return (
    <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
                title={!isSidebarOpen ? item.label : ''}
              >
                <div className="sidebar-icon-wrapper">
                  <Icon size={22} className="sidebar-icon" />
                </div>
                {isSidebarOpen && (
                  <span className="sidebar-label">{item.label}</span>
                )}
                {isActive && <div className="active-indicator" />}
              </button>
            );
          })}
        </nav>

        {isSidebarOpen && (
          <div className="sidebar-footer">
            <div className="sidebar-divider" />
            <div className="version-info">
              <span>World Clock v1.0</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
