'use client';

import {
  getTranslateLanguageFlagSrcSet,
  getTranslateLanguageFlagUrl,
  type TranslateLanguageCode,
} from '@/lib/google-translate';

const FLAG_SIZES = {
  trigger: { w: 16, h: 11 },
  'trigger-compact': { w: 14, h: 10 },
  utility: { w: 14, h: 10 },
  option: { w: 18, h: 12 },
} as const;

type FlagSize = keyof typeof FLAG_SIZES;

function resolveSize(className: string): FlagSize {
  if (className.includes('mk-lang-flag--option')) return 'option';
  if (className.includes('mk-lang-flag--utility')) return 'utility';
  if (className.includes('mk-lang-flag--trigger-compact')) return 'trigger-compact';
  return 'trigger';
}

export default function LanguageFlag({
  code,
  className = '',
}: {
  code: TranslateLanguageCode;
  className?: string;
}) {
  const sizeKey = resolveSize(className);
  const { w, h } = FLAG_SIZES[sizeKey];

  return (
    <img
      src={getTranslateLanguageFlagUrl(code, 40)}
      srcSet={getTranslateLanguageFlagSrcSet(code)}
      width={w}
      height={h}
      alt=""
      className={`mk-lang-flag ${className}`}
      loading="lazy"
      decoding="async"
    />
  );
}
