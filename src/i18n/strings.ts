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
      menuOpen: 'menü',
      menuClose: 'schließen',
    },
    contact: {
      message: 'Nachricht',
      email: 'E-Mail-Adresse',
      send: 'Nachricht senden',
    },
    locations: {
      routeTo: 'Route zur Location',
    },
    contributors: {
      visitWebsite: 'Webseite besuchen',
      roles: {
        organizer: 'Organisation',
        artist: 'Künstler:in',
        scientist: 'Wissenschaft',
      },
    },
    skipToContent: 'Zum Inhalt springen',
  },
  en: {
    nav: {
      locations: 'Locations',
      about: 'About',
      team: 'Team',
      contact: 'Contact',
      menuOpen: 'menu',
      menuClose: 'close',
    },
    contact: {
      message: 'Message',
      email: 'E-mail address',
      send: 'Send message',
    },
    locations: {
      routeTo: 'Route to location',
    },
    contributors: {
      visitWebsite: 'Visit website',
      roles: {
        organizer: 'Organizer',
        artist: 'Artist',
        scientist: 'Scientist',
      },
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
