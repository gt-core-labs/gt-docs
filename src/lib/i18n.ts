// Locale primitives + UI strings for the atomic documentation site.
// English is the default locale (served at `/`); Spanish lives under `/es/…`.

export const LOCALES = ['en', 'es'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export function isLocale(x: string | undefined): x is Locale {
  return !!x && (LOCALES as readonly string[]).includes(x);
}

/** Prefix for a locale: '' for the default (en), '/es' otherwise. */
export function localePrefix(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '' : `/${locale}`;
}

/** Build an in-site href for a doc slug (e.g. `platform/overview`) in a locale. */
export function docHref(locale: Locale, slug: string): string {
  return `${localePrefix(locale)}/${slug}`;
}

/** Home href for a locale. */
export function homeHref(locale: Locale): string {
  return localePrefix(locale) || '/';
}

export type Category = 'platform' | 'infrastructure';

export const categoryLabel: Record<Locale, Record<Category, string>> = {
  en: { platform: 'Platform', infrastructure: 'Infrastructure' },
  es: { platform: 'Plataforma', infrastructure: 'Infraestructura' },
};

/** UI chrome strings, per locale. */
export const ui = {
  en: {
    brand: 'gt docs',
    tagline: 'How the gt platform and its cluster work today',
    login: 'Log in',
    console: 'Console',
    signedInAs: 'Signed in',
    onThisSite: 'Documentation',
    workspaceDocs: 'Workspace documents',
    browseWorkspace: 'Browse workspace documents →',
    home: 'Home',
    notFound: 'Page not found',
    langName: 'English',
    otherLangName: 'Español',
    summaryHeading: 'On this page',
    startHere: 'Start here',
    readMore: 'Read',
  },
  es: {
    brand: 'gt docs',
    tagline: 'Cómo funcionan hoy la plataforma gt y su cluster',
    login: 'Iniciar sesión',
    console: 'Consola',
    signedInAs: 'Sesión',
    onThisSite: 'Documentación',
    workspaceDocs: 'Documentos del workspace',
    browseWorkspace: 'Explorar documentos del workspace →',
    home: 'Inicio',
    notFound: 'Página no encontrada',
    langName: 'Español',
    otherLangName: 'English',
    summaryHeading: 'En esta página',
    startHere: 'Empezá acá',
    readMore: 'Leer',
  },
} satisfies Record<Locale, Record<string, string>>;

/** The other locale (for the language switcher). */
export function otherLocale(locale: Locale): Locale {
  return locale === 'en' ? 'es' : 'en';
}

/**
 * Given the current request path, produce the equivalent path in the target
 * locale. Pure string manipulation — used by the header language switcher.
 * `/platform/overview`  <->  `/es/platform/overview`; `/` <-> `/es`.
 */
export function switchLocalePath(currentPath: string, target: Locale): string {
  const stripped = currentPath.replace(/^\/es(?=\/|$)/, '') || '/';
  if (target === DEFAULT_LOCALE) return stripped;
  return stripped === '/' ? '/es' : `/es${stripped}`;
}
