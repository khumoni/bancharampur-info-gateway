import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserPreference {
  category: string;
  isEnabled: boolean;
  priority: number;
}

interface PersonalizationContextType {
  preferences: UserPreference[];
  updatePreference: (category: string, isEnabled: boolean, priority?: number) => void;
  getPersonalizedContent: (content: any[]) => any[];
  feedAlgorithm: number;
  setFeedAlgorithm: (value: number) => void;
}

const PersonalizationContext = createContext<PersonalizationContextType | undefined>(undefined);

export const usePersonalization = () => {
  const context = useContext(PersonalizationContext);
  if (!context) {
    throw new Error('usePersonalization must be used within a PersonalizationProvider');
  }
  return context;
};

interface PersonalizationProviderProps {
  children: React.ReactNode;
}

export const PersonalizationProvider = ({ children }: PersonalizationProviderProps) => {
  const [preferences, setPreferences] = useState<UserPreference[]>([
    { category: 'education', isEnabled: true, priority: 80 },
    { category: 'health', isEnabled: true, priority: 90 },
    { category: 'transport', isEnabled: false, priority: 60 },
    { category: 'agriculture', isEnabled: true, priority: 70 },
    { category: 'local', isEnabled: true, priority: 85 },
    { category: 'culture', isEnabled: false, priority: 50 },
    { category: 'administrative', isEnabled: true, priority: 75 }
  ]);

  const [feedAlgorithm, setFeedAlgorithm] = useState(70);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('userPreferences');
    if (saved) {
      try {
        const parsedPrefs = JSON.parse(saved);
        setPreferences(parsedPrefs);
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }

    const savedAlgorithm = localStorage.getItem('feedAlgorithm');
    if (savedAlgorithm) {
      setFeedAlgorithm(parseInt(savedAlgorithm));
    }
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    localStorage.setItem('feedAlgorithm', feedAlgorithm.toString());
  }, [feedAlgorithm]);

  const updatePreference = (category: string, isEnabled: boolean, priority = 50) => {
    setPreferences(prev => 
      prev.map(pref => 
        pref.category === category 
          ? { ...pref, isEnabled, priority }
          : pref
      )
    );
  };

  const getPersonalizedContent = (content: any[]) => {
    const enabledCategories = preferences
      .filter(pref => pref.isEnabled)
      .reduce((acc, pref) => {
        acc[pref.category] = pref.priority;
        return acc;
      }, {} as Record<string, number>);

    // Sort content based on user preferences and algorithm setting
    return content.sort((a, b) => {
      const aPriority = enabledCategories[a.category] || 0;
      const bPriority = enabledCategories[b.category] || 0;
      
      // Mix in some randomness based on algorithm setting
      const randomFactor = (100 - feedAlgorithm) / 100;
      const aScore = aPriority * (feedAlgorithm / 100) + Math.random() * 100 * randomFactor;
      const bScore = bPriority * (feedAlgorithm / 100) + Math.random() * 100 * randomFactor;
      
      return bScore - aScore;
    });
  };

  return (
    <PersonalizationContext.Provider
      value={{
        preferences,
        updatePreference,
        getPersonalizedContent,
        feedAlgorithm,
        setFeedAlgorithm
      }}
    >
      {children}
    </PersonalizationContext.Provider>
  );
};