export const i18nConfig = {
  defaultLocale: 'ko',
  locales: ['ko', 'en', /* 'jp', 'zh', 'th', 'vi', 'id' ...언어 추가*/],
  defaultNS: 'common',
} as const;

export type Locale = (typeof i18nConfig)['locales'][number];
