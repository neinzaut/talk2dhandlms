import { useContext } from 'react';
import { LanguageContext } from '../../src/components/common/LanguageContext';
import type { SignLanguage } from '../types/lessonTypes'; // Import the language type

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  // Language utilities
  const utils = {
    /**
     * Gets language-specific content from objects with ASL/FSL properties
     * @example getContent({ ASL: 'Hello', FSL: 'Kamusta' }) → 'Kamusta' (if FSL)
     */
    getContent: <T extends Record<SignLanguage, any>>(content: T): T[SignLanguage] => {
      return content[context.selectedLanguage];
    },

    /**
     * Returns translation with fallback
     * @param translations Object with ASL/FSL translations
     * @param fallback Fallback if no translation exists
     */
    t: (translations: Partial<Record<SignLanguage, string>>, fallback = ''): string => {
      return translations[context.selectedLanguage] || fallback;
    },

    /**
     * Checks if current language matches
     */
    is: (lang: SignLanguage): boolean => {
      return context.selectedLanguage === lang;
    },

    /**
     * Gets localized asset path
     * @param assets Object with ASL/FSL asset paths
     */
    getAsset: (assets: Record<SignLanguage, string>): string => {
      return assets[context.selectedLanguage];
    }
  };

  return {
    ...context, // Existing context (selectedLanguage, setSelectedLanguage)
    ...utils    // New utility functions
  };
};