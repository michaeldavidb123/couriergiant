'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import LanguageFlag from '@/components/marketing/LanguageFlag';
import {
  TRANSLATE_LANGUAGE_OPTIONS,
  applyGoogleTranslateLanguage,
  getTranslateLanguageLabel,
  readTranslateLanguageFromCookie,
  type TranslateLanguageCode,
} from '@/lib/google-translate';

type LanguageTranslatorProps = {
  variant?: 'marketing' | 'compact' | 'utility';
  className?: string;
};

export default function LanguageTranslator({
  variant = 'marketing',
  className = '',
}: LanguageTranslatorProps) {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<TranslateLanguageCode>('EN');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLanguage(readTranslateLanguageFromCookie());
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const onSelect = (code: TranslateLanguageCode) => {
    setLanguage(code);
    setOpen(false);
    applyGoogleTranslateLanguage(code);
  };

  const isCompact = variant === 'compact';
  const isUtility = variant === 'utility';
  const flagClass = isUtility
    ? 'mk-lang-flag--utility'
    : isCompact
      ? 'mk-lang-flag--trigger-compact'
      : 'mk-lang-flag--trigger';

  return (
    <div ref={ref} className={`mk-lang-translator notranslate ${className}`}>
      <button
        type="button"
        className={`mk-lang-translator__trigger ${isCompact ? 'mk-lang-translator__trigger--compact' : ''} ${isUtility ? 'mk-lang-translator__trigger--utility' : ''}`}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Select language — ${getTranslateLanguageLabel(language)}`}
      >
        <LanguageFlag code={language} className={flagClass} />
        {!isUtility && (
          <span className="mk-lang-translator__label">{getTranslateLanguageLabel(language)}</span>
        )}
        {isUtility && (
          <span className="mk-lang-translator__label mk-lang-translator__label--utility">
            {language}
          </span>
        )}
        <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="mk-lang-translator__panel" role="listbox" aria-label="Languages">
          {TRANSLATE_LANGUAGE_OPTIONS.map((item) => (
            <button
              key={item.code}
              type="button"
              role="option"
              aria-selected={language === item.code}
              className={`mk-lang-translator__option ${language === item.code ? 'is-active' : ''}`}
              onClick={() => onSelect(item.code)}
            >
              <span className="mk-lang-translator__option-main">
                <LanguageFlag code={item.code} className="mk-lang-flag--option" />
                <span>
                  <span className="mk-lang-translator__option-native">{item.nativeLabel}</span>
                  <span className="mk-lang-translator__option-label">{item.label}</span>
                </span>
              </span>
              {language === item.code && <Check className="w-3.5 h-3.5 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
