// i18n.ts
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Module } from 'i18next';

import en from './en.json';
import de from './de.json';

const LANGUAGE_PREFERENCE_KEY = 'user-language';

const resources = {
  en: {translation: en},
  de: {translation: de},
};

const languageDetector = {
  type: 'languageDetector',
  async: true,
  init: () => {},
  detect: async (callback: (lang: string) => void) => {
    try {
      const savedLang = await AsyncStorage.getItem(LANGUAGE_PREFERENCE_KEY);
      if (savedLang) {
        return callback(savedLang);
      } else {
        return callback('en');
      }
    } catch (e) {
      console.warn('Language detection error', e);
      callback('en');
    }
  },
  cacheUserLanguage: async (lng: string) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_PREFERENCE_KEY, lng);
    } catch (e) {
      console.warn('Failed to save language preference', e);
    }
  },
} as Module;

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    compatibilityJSON: 'v4',
    resources,
    interpolation: {escapeValue: false},
    react: {useSuspense: false},
  });

export default i18n;
