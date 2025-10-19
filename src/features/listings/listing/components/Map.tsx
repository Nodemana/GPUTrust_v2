'use client';

import { useState } from 'react';

interface MapProps {
  location?: string;
  className?: string;
}

export function Map({ location, className = '' }: MapProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Default location if none provided
  const defaultLocation = location || 'San Francisco Bay Area, CA';
  
  // Convert specific locations to general areas for privacy
  const getPrivacyFriendlyLocation = (loc: string) => {
    const privacyMap: { [key: string]: string } = {
      'San Francisco, CA': 'San Francisco Bay Area, CA',
      'New York, NY': 'New York Metro Area, NY',
      'Los Angeles, CA': 'Los Angeles Area, CA',
      'Seattle, WA': 'Seattle Metro Area, WA',
      'Austin, TX': 'Austin Area, TX'
    };
    
    return privacyMap[loc] || loc;
  };
  
  const displayLocation = getPrivacyFriendlyLocation(defaultLocation);
  
  // For privacy, we'll show general areas instead of exact locations
  const getLocationArea = (loc: string) => {
    const areas: { [key: string]: { bbox: string; center: { lat: number; lon: number } } } = {
      'San Francisco, CA': { 
        bbox: '-122.6,37.6,-122.2,37.9', // Broader Bay Area
        center: { lat: 37.7749, lon: -122.4194 }
      },
      'New York, NY': { 
        bbox: '-74.2,40.5,-73.8,40.9', // Broader NYC area
        center: { lat: 40.7128, lon: -74.0060 }
      },
      'Los Angeles, CA': { 
        bbox: '-118.5,33.8,-118.0,34.3', // Broader LA area
        center: { lat: 34.0522, lon: -118.2437 }
      },
      'Seattle, WA': { 
        bbox: '-122.5,47.4,-122.1,47.8', // Broader Seattle area
        center: { lat: 47.6062, lon: -122.3321 }
      },
      'Austin, TX': { 
        bbox: '-98.0,30.0,-97.5,30.5', // Broader Austin area
        center: { lat: 30.2672, lon: -97.7431 }
      }
    };
    
    return areas[loc] || areas['San Francisco, CA'];
  };
  
  const area = getLocationArea(defaultLocation);
  
  // Generate map URLs showing the general area without a specific marker
  const smallMapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${area.bbox}&layer=mapnik&marker=1`;
  const expandedMapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${area.bbox}&layer=mapnik`;
  
  // CSS filter to create dark theme effect
  const darkMapStyle = {
    filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)',
    border: 0
  };

  const handleMapClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCloseExpanded = () => {
    setIsExpanded(false);
  };

  if (isExpanded) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full h-96 relative">
          <div className="absolute bottom-2 left-2 z-10 bg-white dark:bg-secondary text-text-light dark:text-text-light px-3 py-1 rounded-full text-sm font-medium">
            {displayLocation}
          </div>
          <button
            onClick={handleCloseExpanded}
            className="absolute top-2 right-2 z-10 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            aria-label="Close map"
          >
            ×
          </button>
          <iframe
            src={expandedMapUrl}
            width="100%"
            height="100%"
            style={darkMapStyle}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Expanded location map for ${displayLocation}`}
            className="rounded-lg"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div 
        className="cursor-pointer"
        onClick={handleMapClick}
        title="Click to view larger map"
      >
        <iframe
          src={smallMapUrl}
          width="100%"
          height="120"
          style={darkMapStyle}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Location map for ${displayLocation}`}
          className="rounded-md"
        />
        <div className="absolute inset-0 bg-transparent transition-colors rounded-md flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs text-gray-600 dark:text-gray-300 opacity-0 hover:opacity-100 transition-opacity">
            Click to expand
          </div>
        </div>
        <div className="absolute bottom-1 left-1 bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs text-gray-600 dark:text-gray-300 shadow-sm">
          {displayLocation}
        </div>
      </div>
    </div>
  );
}
