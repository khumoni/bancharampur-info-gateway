
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AppContextType {
  language: 'bn' | 'en';
  setLanguage: (language: 'bn' | 'en') => void;
  toggleLanguage: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedLanguage = localStorage.getItem('language') as 'bn' | 'en';
    const savedTheme = localStorage.getItem('theme');
    
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleSetLanguage = (newLanguage: 'bn' | 'en') => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'bn' ? 'en' : 'bn';
    handleSetLanguage(newLanguage);
  };

  const toggleDarkMode = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <AppContext.Provider value={{ 
      language, 
      setLanguage: handleSetLanguage, 
      toggleLanguage, 
      isDarkMode, 
      toggleDarkMode 
    }}>
      {children}
    </AppContext.Provider>
  );
};
