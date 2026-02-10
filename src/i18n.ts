import i18n, { LanguageDetectorAsyncModule } from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';

import en from './locales/en.json';
import hi from './locales/hi.json';

const LANGUAGES = {
    en: { translation: en },
    hi: { translation: hi },
};

const LANG_CODES = Object.keys(LANGUAGES);

const LANGUAGE_DETECTOR = {
    type: 'languageDetector' as const,
    async: true,
    detect: (callback: (language: string) => void) => {
        AsyncStorage.getItem('user-language', (err, language) => {
            // if error or no language is stored, use device locale
            if (err || !language) {
                const bestLanguage = RNLocalize.findBestLanguageTag(LANG_CODES);
                callback(bestLanguage?.languageTag || 'en');
                return;
            }
            callback(language);
        });
    },
    init: () => { },
    cacheUserLanguage: (language: string) => {
        AsyncStorage.setItem('user-language', language);
    },
};

i18n
    // detect language
    .use(LANGUAGE_DETECTOR)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    .init({
        compatibilityJSON: 'v4',
        resources: LANGUAGES,
        react: {
            useSuspense: false,
        },
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
