import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageCode, SUPPORTED_LANGUAGES } from './config';

interface LanguageContextType {
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => Promise<void>;
  languages: typeof SUPPORTED_LANGUAGES;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [isLoading, setIsLoading] = useState(true);

  // Load saved language preference on mount
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage && savedLanguage in SUPPORTED_LANGUAGES) {
          const lang = savedLanguage as LanguageCode;
          setCurrentLanguage(lang);
          await i18n.changeLanguage(lang);
        }
      } catch (error) {
        console.log('[v0] Error loading language preference:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLanguage();
  }, [i18n]);

  const handleSetLanguage = async (lang: LanguageCode) => {
    try {
      setCurrentLanguage(lang);
      await i18n.changeLanguage(lang);
      await AsyncStorage.setItem('selectedLanguage', lang);
    } catch (error) {
      console.log('[v0] Error setting language:', error);
    }
  };

  const value: LanguageContextType = {
    currentLanguage,
    setLanguage: handleSetLanguage,
    languages: SUPPORTED_LANGUAGES,
  };

  if (isLoading) {
    return null;
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
