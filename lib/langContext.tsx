'use client';

import { createContext, useContext, useState } from 'react';
import { translations, type Lang, type Translations } from './i18n';

interface LangContextValue {
  lang: Lang;
  t: Translations;
  setLang: (lang: Lang) => void;
}

const COOKIE_KEY = 'NEXT_LOCALE';

function readCookie(): Lang {
  if (typeof document === 'undefined') return 'en';
  const m = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_KEY}=(en|tr)`));
  return (m?.[1] as Lang) ?? 'en';
}

function writeCookie(lang: Lang) {
  if (typeof document === 'undefined') return;
  document.cookie = `${COOKIE_KEY}=${lang}; path=/; max-age=31536000; samesite=lax`;
}

const LangContext = createContext<LangContextValue>({
  lang: 'en',
  t: translations.en,
  setLang: () => {},
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  // Lazy init: server renders 'en', client hydrates from cookie. Minor hydration drift in text is acceptable.
  const [lang, setLangState] = useState<Lang>(() => readCookie());

  const setLang = (next: Lang) => {
    writeCookie(next);
    setLangState(next);
  };

  return (
    <LangContext.Provider value={{ lang, t: translations[lang], setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
