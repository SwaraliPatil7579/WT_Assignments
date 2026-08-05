import React, { useState } from 'react';
import { Search, Plus, Check, Globe } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './TimeZoneSelector.css';

const TimeZoneSelector = () => {
  const { allZones, selectedZones, addZone } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [addedId, setAddedId] = useState(null);

  const filteredZones = allZones.filter(zone => {
    const query = searchQuery.toLowerCase();
    return (
      zone.city.toLowerCase().includes(query) ||
      zone.country.toLowerCase().includes(query) ||
      zone.label.toLowerCase().includes(query)
    );
  });

  const handleAddZone = (zoneId) => {
    if (!selectedZones.includes(zoneId)) {
      addZone(zoneId);
      setAddedId(zoneId);
      setTimeout(() => setAddedId(null), 1500);
    }
  };

  return (
    <div className="timezone-selector">
      <div className="selector-header">
        <div className="selector-title-section">
          <Globe size={24} className="selector-title-icon" />
          <h2 className="selector-title">Add City</h2>
        </div>
      </div>

      <div className="search-container">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search city or country..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="zones-list">
        {filteredZones.length === 0 ? (
          <div className="no-results">
            <Globe size={40} className="no-results-icon" />
            <p>No cities found</p>
            <span>Try a different search term</span>
          </div>
        ) : (
          filteredZones.map(zone => {
            const isSelected = selectedZones.includes(zone.id);
            const justAdded = addedId === zone.id;

            return (
              <div 
                key={zone.id} 
                className={`zone-item ${isSelected ? 'selected' : ''} ${justAdded ? 'just-added' : ''}`}
              >
                <div className="zone-info">
                  <div className="zone-flag">
                    {zone.country ? zone.country.slice(0, 2).toUpperCase() : '🌍'}
                  </div>
                  <div className="zone-details">
                    <span className="zone-city">{zone.city}</span>
                    <span className="zone-country">{zone.country}</span>
                  </div>
                </div>

                <button
                  className={`add-zone-btn ${isSelected ? 'added' : ''}`}
                  onClick={() => handleAddZone(zone.id)}
                  disabled={isSelected}
                >
                  {justAdded ? (
                    <Check size={18} />
                  ) : isSelected ? (
                    <Check size={18} />
                  ) : (
                    <Plus size={18} />
                  )}
                  <span>
                    {justAdded ? 'Added' : isSelected ? 'Added' : 'Add'}
                  </span>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TimeZoneSelector;
