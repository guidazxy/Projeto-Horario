import React, { createContext, useContext, useEffect, useState } from 'react';

const I18nContext = createContext();

import pt from '../locales/pt.json';
import en from '../locales/en.json';
import es from '../locales/es.json';

const translations = {
  pt,
  en,
  es
};

export const I18nProvider = ({ children }) => {
  const [locale, setLocaleState] = useState(() => {
    const savedLocale = localStorage.getItem('academistack_locale');
    return translations[savedLocale] ? savedLocale : 'pt';
  });

  useEffect(() => {
    document.documentElement.lang = locale === 'pt' ? 'pt-BR' : locale;
  }, [locale]);

  const setLocale = (nextLocale) => {
    if (!translations[nextLocale]) return;
    localStorage.setItem('academistack_locale', nextLocale);
    setLocaleState(nextLocale);
  };

  const translate = (key, localeArg = locale) => {
    const keys = key.split('.');
    let value = translations[localeArg] || translations.pt;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        value = undefined;
        break;
      }
    }

    if (typeof value === 'string') return value;

    value = translations.pt;
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) value = value[k];
      else return key;
    }
    return typeof value === 'string' ? value : key;
  };

  return (
    <I18nContext.Provider value={{ translate, locale, setLocale, localeName: locale }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);

export default I18nContext;