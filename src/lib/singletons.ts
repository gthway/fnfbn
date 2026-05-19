import fs from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';

const BASE = 'src/content/_singletons';

export interface Bilingual {
  de: string;
  en: string;
}

export interface HeroData {
  formingLine: Bilingual;
  formedLine: Bilingual;
  subtitle: Bilingual;
  badge: Bilingual;
}

export interface SectionTextData {
  heading: Bilingual;
  body: Bilingual;
}

export interface HeadingOnly {
  heading: Bilingual;
}

export interface ContactData {
  heading: Bilingual;
  intro: Bilingual;
  recipientEmail?: string;
}

export interface FooterData {
  formingLine: Bilingual;
  formedLine: Bilingual;
  subtitle: Bilingual;
}

export interface LegalPageData {
  title: string;
  body: string;
  lastUpdated?: string;
}

async function read<T>(name: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.resolve(BASE, `${name}.yaml`), 'utf-8');
    return parseYaml(raw) as T;
  } catch {
    return fallback;
  }
}

const emptyBi: Bilingual = { de: '', en: '' };

export const getHero = () =>
  read<HeroData>('hero', {
    formingLine: emptyBi,
    formedLine: emptyBi,
    subtitle: emptyBi,
    badge: emptyBi,
  });

export const getAbout = () => read<SectionTextData>('about', { heading: emptyBi, body: emptyBi });
export const getTeamIntro = () => read<SectionTextData>('team-intro', { heading: emptyBi, body: emptyBi });
export const getContributorsSection = () => read<HeadingOnly>('contributors-section', { heading: emptyBi });
export const getLocationsSection = () => read<HeadingOnly>('locations-section', { heading: emptyBi });
export const getContact = () =>
  read<ContactData>('contact', { heading: emptyBi, intro: emptyBi });
export const getFooter = () =>
  read<FooterData>('footer', { formingLine: emptyBi, formedLine: emptyBi, subtitle: emptyBi });
export const getImprint = () =>
  read<LegalPageData>('imprint', { title: 'Impressum', body: '' });
export const getPrivacy = () =>
  read<LegalPageData>('privacy', { title: 'Datenschutz', body: '' });
