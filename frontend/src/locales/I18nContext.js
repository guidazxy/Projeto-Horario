import React, { createContext, useContext, useState } from 'react';

const I18nContext = createContext();

const translations = {
  pt: require('../locales/pt.json'),
  en: require('../locales/en.json'),
  es: require('../locales/es.json')
};

export const I18nProvider = ({ children }) => {
  const [locale, setLocale] = useState('pt');

  const translate = (key, localeArg = locale) => {
    const keys = key.split('.');
    let dict = translations[localeArg] || translations.pt;
    let value = dict;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        value = key;
      }
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