import { useIntl } from 'react-intl';
import { GetTranslationValues, TranslationId } from '../translations/types';

export const useTranslation = (
  id: TranslationId,
  values?: GetTranslationValues<TranslationId>
): string => {
  const intl = useIntl();
  return intl.formatMessage(
    { id, defaultMessage: id },
    values as Record<string, string>
  ) as string;
};
