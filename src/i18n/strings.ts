export const LOCALES = ['de', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'de';

export const ui = {
  de: {
    nav: {
      locations: 'Orte',
      about: 'Über',
      team: 'Team',
      contact: 'Kontakt',
    },
    contact: {
      message: 'Nachricht',
      email: 'E-Mail-Adresse',
      send: 'Nachricht senden',
    },
    skipToContent: 'Zum Inhalt springen',
  },
  en: {
    nav: {
      locations: 'Locations',
      about: 'About',
      team: 'Team',
      contact: 'Contact',
    },
    contact: {
      message: 'Message',
      email: 'E-mail address',
      send: 'Send message',
    },
    skipToContent: 'Skip to content',
  },
} as const;

export function t(locale: Locale) {
  return ui[locale];
}

export function localePath(locale: Locale, path: string = ''): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return clean === '/' ? '/' : clean;
  return clean === '/' ? '/en' : `/en${clean}`;
}

export function pickLang<T>(value: { de: T; en: T } | undefined | null, locale: Locale): T | undefined {
  if (!value) return undefined;
  return value[locale] ?? value.de;
}
