export const getTranslations = (locale?: string) => {
  switch (locale) {
    case 'en':
      return import('apps/frontend/src/i18n/translations/en.json');
    default:
      return import('apps/frontend/src/i18n/translations/it.json');
  }
};
