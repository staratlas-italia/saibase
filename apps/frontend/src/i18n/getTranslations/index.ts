export const getTranslations = (locale?: string) => {
  switch (locale) {
    case 'en':
      return import('../translations/en.json');
    default:
      return import('../translations/it.json');
  }
};
