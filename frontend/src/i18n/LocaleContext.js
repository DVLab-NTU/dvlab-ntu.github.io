// Minimal locale context: no i18n library, route-driven locale.
// English is the default; Traditional Chinese lives under the `/zh` prefix.
import React, { createContext, useContext, useMemo } from 'react'
import translations from './translations'

const LocaleContext = createContext({ locale: 'en', t: (k) => k, localize: (p) => p })

export const LOCALE_PREFIX = '/zh'

// Resolve a dotted key like 'nav.about' against the current locale dictionary.
const resolve = (dict, key) =>
  key.split('.').reduce((acc, part) => (acc == null ? acc : acc[part]), dict)

export const LocaleProvider = ({ locale, children }) => {
  const value = useMemo(() => {
    const dict = translations[locale] || translations.en
    const t = (key) => resolve(dict, key) ?? resolve(translations.en, key) ?? key
    const localize = (path) =>
      locale === 'zh' ? `${LOCALE_PREFIX}${path}` : path
    return { locale, t, localize }
  }, [locale])
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export const useLocale = () => useContext(LocaleContext)

// Strip a `/zh` prefix from a pathname (used for route matching).
export const stripLocalePrefix = (pathname) =>
  pathname.startsWith(LOCALE_PREFIX)
    ? pathname.slice(LOCALE_PREFIX.length) || '/'
    : pathname
