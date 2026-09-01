export type TranslateLanguageCode =
  | 'EN'
  | 'ES'
  | 'FR'
  | 'DE'
  | 'IT'
  | 'PT'
  | 'RU'
  | 'ZH'
  | 'JA'
  | 'KO'
  | 'AR'
  | 'HI'
  | 'TR'
  | 'NL'
  | 'PL'
  | 'VI'
  | 'ID'
  | 'TH';

export const TRANSLATE_LANGUAGE_OPTIONS: {
  code: TranslateLanguageCode;
  label: string;
  nativeLabel: string;
  flagCountry: string;
}[] = [
  { code: 'EN', label: 'English', nativeLabel: 'English', flagCountry: 'us' },
  { code: 'ES', label: 'Spanish', nativeLabel: 'Español', flagCountry: 'es' },
  { code: 'FR', label: 'French', nativeLabel: 'Français', flagCountry: 'fr' },
  { code: 'DE', label: 'German', nativeLabel: 'Deutsch', flagCountry: 'de' },
  { code: 'IT', label: 'Italian', nativeLabel: 'Italiano', flagCountry: 'it' },
  { code: 'PT', label: 'Portuguese', nativeLabel: 'Português', flagCountry: 'pt' },
  { code: 'RU', label: 'Russian', nativeLabel: 'Русский', flagCountry: 'ru' },
  { code: 'ZH', label: 'Chinese', nativeLabel: '中文', flagCountry: 'cn' },
  { code: 'JA', label: 'Japanese', nativeLabel: '日本語', flagCountry: 'jp' },
  { code: 'KO', label: 'Korean', nativeLabel: '한국어', flagCountry: 'kr' },
  { code: 'AR', label: 'Arabic', nativeLabel: 'العربية', flagCountry: 'sa' },
  { code: 'HI', label: 'Hindi', nativeLabel: 'हिन्दी', flagCountry: 'in' },
  { code: 'TR', label: 'Turkish', nativeLabel: 'Türkçe', flagCountry: 'tr' },
  { code: 'NL', label: 'Dutch', nativeLabel: 'Nederlands', flagCountry: 'nl' },
  { code: 'PL', label: 'Polish', nativeLabel: 'Polski', flagCountry: 'pl' },
  { code: 'VI', label: 'Vietnamese', nativeLabel: 'Tiếng Việt', flagCountry: 'vn' },
  { code: 'ID', label: 'Indonesian', nativeLabel: 'Bahasa Indonesia', flagCountry: 'id' },
  { code: 'TH', label: 'Thai', nativeLabel: 'ไทย', flagCountry: 'th' },
];

const CODE_MAP: Record<TranslateLanguageCode, string> = {
  EN: 'en',
  ES: 'es',
  FR: 'fr',
  DE: 'de',
  IT: 'it',
  PT: 'pt',
  RU: 'ru',
  ZH: 'zh-CN',
  JA: 'ja',
  KO: 'ko',
  AR: 'ar',
  HI: 'hi',
  TR: 'tr',
  NL: 'nl',
  PL: 'pl',
  VI: 'vi',
  ID: 'id',
  TH: 'th',
};

const REVERSE_MAP = Object.fromEntries(
  Object.entries(CODE_MAP).map(([key, value]) => [value, key]),
) as Record<string, TranslateLanguageCode>;

export function readTranslateLanguageFromCookie(): TranslateLanguageCode {
  if (typeof document === 'undefined') return 'EN';
  try {
    const cookie = document.cookie
      .split(';')
      .find((part) => part.trim().startsWith('googtrans='));
    if (!cookie) return 'EN';
    const value = decodeURIComponent(cookie.split('=').slice(1).join('=')).trim();
    if (!value || value === '/en/en') return 'EN';
    const segment = value.split('/').filter(Boolean).pop() || 'en';
    return REVERSE_MAP[segment] || 'EN';
  } catch {
    return 'EN';
  }
}

export function hasGoogleTranslateCookie(): boolean {
  return readTranslateLanguageFromCookie() !== 'EN';
}

export function applyGoogleTranslateLanguage(langCode: TranslateLanguageCode) {
  if (typeof window === 'undefined') return;

  const targetLang = CODE_MAP[langCode] || 'en';
  const domain = window.location.hostname;

  if (langCode === 'EN') {
    document.cookie = `googtrans=; path=/; domain=${domain}; max-age=0`;
    document.cookie = 'googtrans=; path=/; max-age=0';
  } else {
    const cookieValue = `/en/${targetLang}`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${domain}`;
    document.cookie = `googtrans=${cookieValue}; path=/`;
  }

  window.location.reload();
}

export function getTranslateLanguageLabel(code: TranslateLanguageCode): string {
  return TRANSLATE_LANGUAGE_OPTIONS.find((item) => item.code === code)?.nativeLabel ?? 'English';
}

export function getTranslateLanguageFlagCountry(code: TranslateLanguageCode): string {
  return TRANSLATE_LANGUAGE_OPTIONS.find((item) => item.code === code)?.flagCountry ?? 'us';
}

export function getTranslateLanguageFlagUrl(code: TranslateLanguageCode, width = 40): string {
  const country = getTranslateLanguageFlagCountry(code);
  return `https://flagcdn.com/w${width}/${country}.png`;
}

export function getTranslateLanguageFlagSrcSet(code: TranslateLanguageCode): string {
  const country = getTranslateLanguageFlagCountry(code);
  return `https://flagcdn.com/w20/${country}.png 1x, https://flagcdn.com/w40/${country}.png 2x`;
}
