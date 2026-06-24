import { createI18n } from 'vue-i18n';

import en from '@/core/locales/en/translation.json';
import vi from '@/core/locales/vi/translation.json';

const getLocale = () => {
  const saved = typeof window !== 'undefined' ? localStorage.getItem('locale') : null;
  return saved === 'vi' || saved === 'vn' ? 'vi' : 'en';
};

const locale = getLocale();

if (typeof window !== 'undefined') {
  localStorage.setItem('locale', locale);
  document.documentElement.lang = locale;
}

export const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'en',
  messages: { en, vi },
});
