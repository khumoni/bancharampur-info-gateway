
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Location {
  district: string;
  upazila: string;
  union?: string;
  municipality?: string;
}

interface LocationContextType {
  location: Location;
  setLocation: (location: Location) => void;
}

const defaultLocation: Location = {
  district: 'Brahmanbaria',
  upazila: 'Bancharampur',
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<Location>(() => {
    try {
      const storedLocation = localStorage.getItem('userLocation');
      if (storedLocation) {
        const parsedLocation = JSON.parse(storedLocation);
        // Basic validation
        if (parsedLocation.district && parsedLocation.upazila) {
          return parsedLocation;
        }
      }
    } catch (error) {
      console.error('Failed to parse location from localStorage', error);
    }
    return defaultLocation;
  });

  useEffect(() => {
    try {
      localStorage.setItem('userLocation', JSON.stringify(location));
    } catch (error) {
      console.error('Failed to save location to localStorage', error);
    }
  }, [location]);

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
