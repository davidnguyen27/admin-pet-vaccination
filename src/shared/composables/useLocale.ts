import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const SUPPORTED_LOCALES = ['en', 'vi'] as const;
type Locale = typeof SUPPORTED_LOCALES[number];

export function useLocale() {
  const { locale, t } = useI18n({ useScope: 'global' });

  const currentLocale = computed(() => locale.value as Locale);

  const setLocale = (newLocale: string) => {
    if (!SUPPORTED_LOCALES.includes(newLocale as Locale)) return;

    locale.value = newLocale;
    localStorage.setItem('locale', newLocale);
    document.documentElement.lang = newLocale;
  };

  return {
    t,
    locale: currentLocale,
    setLocale,
    toggleLocale: () => setLocale(currentLocale.value === 'vi' ? 'en' : 'vi'),
    isLocale: (val: Locale) => currentLocale.value === val,
    supportedLocales: SUPPORTED_LOCALES,
  };
}
