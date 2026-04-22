import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../../locales/en.json';
import hi from '../../locales/hi.json';

export const SUPPORTED_LANGUAGES = {
  en: { name: 'English', flag: '🇬🇧' },
  hi: { name: 'हिन्दी', flag: '🇮🇳' },
};

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

i18next.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
  },
  lng: 'en',
  fallbackLng: 'en',
  defaultNS: 'translation',
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v3',
});

export default i18next;
