import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SignLanguage = 'ASL' | 'FSL';

interface LanguageContextType {
  selectedLanguage: SignLanguage;
  setSelectedLanguage: (language: SignLanguage) => void;
}

export const LanguageContext = createContext<LanguageContextType>({
  selectedLanguage: 'ASL',
  setSelectedLanguage: () => {},
});

export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<SignLanguage>('ASL');

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage === 'ASL' || savedLanguage === 'FSL') {
          setSelectedLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Failed to load language', error);
      }
    };
    loadLanguage();
  }, []);

  const updateLanguage = async (language: SignLanguage) => {
    try {
      await AsyncStorage.setItem('selectedLanguage', language);
      setSelectedLanguage(language);
    } catch (error) {
      console.error('Failed to save language', error);
    }
  };

  return (
    <LanguageContext.Provider value={{ selectedLanguage, setSelectedLanguage: updateLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};