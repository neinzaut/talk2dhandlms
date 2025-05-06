/**
 * LanguageContext
 * 
 * A React Context that manages the selected sign language throughout the application.
 * It provides language selection functionality and ensures consistent language
 * preferences across all components.
 * 
 * Features:
 * - Language state management
 * - Language selection interface
 * - Persistent language preferences
 * - Language-specific content filtering
 * 
 * Used in:
 * - Dashboard for language selection
 * - All components requiring language context
 * - Navigation and content filtering
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SignLanguage = 'ASL' | 'FSL';

interface LanguageContextType {
  selectedLanguage: SignLanguage;
  setSelectedLanguage: (language: SignLanguage) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<SignLanguage>('ASL');

  const updateLanguage = async (language: SignLanguage) => {
    try {
      await AsyncStorage.setItem('selectedLanguage', language);
      setSelectedLanguage(language);
    } catch (error) {
      console.error('Failed to save language', error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage === 'ASL' || savedLanguage === 'FSL') {
          setSelectedLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Failed to load saved language', error);
      }
    };
    initialize();
  }, []);

  return (
    <LanguageContext.Provider value={{ 
      selectedLanguage, 
      setSelectedLanguage: updateLanguage
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
