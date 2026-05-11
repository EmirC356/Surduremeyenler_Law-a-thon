'use client';

import { createContext, useContext } from 'react';
import { translations, type Lang, type Translations } from './i18n';

interface LangContextValue {
  lang: Lang;
  t: Translations;
  setLang: (lang: Lang) => void;
}

const LangContext = createContext<LangContextValue>({
  lang: 'en',
  t: translations.en,
  setLang: () => {},
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  return (
    <LangContext.Provider value={{ lang: 'en', t: translations.en, setLang: () => {} }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
