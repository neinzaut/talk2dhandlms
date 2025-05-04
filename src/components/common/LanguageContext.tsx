import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SignLanguage = 'ASL' | 'FSL';

interface LanguageContextType {
  selectedLanguage: SignLanguage;
  setSelectedLanguage: (language: SignLanguage) => Promise<void>;
  currentModules: ModuleType[]; 
  refreshModules: () => void; 
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<SignLanguage>('ASL');
  const [modules, setModules] = useState<ModuleType[]>([]);

  const loadModules = async (language: SignLanguage) => {
    // Fetch modules based on language
    const langModules = await fetchModulesForLanguage(language);
    setModules(langModules);
  };

  const updateLanguage = async (language: SignLanguage) => {
    try {
      await AsyncStorage.setItem('selectedLanguage', language);
      setSelectedLanguage(language);
      await loadModules(language); // Reload modules when language changes
    } catch (error) {
      console.error('Failed to save language', error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
      if (savedLanguage === 'ASL' || savedLanguage === 'FSL') {
        await updateLanguage(savedLanguage);
      } else {
        await loadModules(selectedLanguage);
      }
    };
    initialize();
  }, []);

  return (
    <LanguageContext.Provider value={{ 
      selectedLanguage, 
      setSelectedLanguage: updateLanguage,
      currentModules: modules,
      refreshModules: () => loadModules(selectedLanguage)
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Add this hook export
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};