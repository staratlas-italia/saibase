import { Text } from '@saibase/uikit';
import { Translation } from '../../i18n/Translation';
import {
  GetTranslationValues,
  TranslationId,
} from '../../i18n/translations/types';
import { Loader } from '../common/Loader';
import { BlurBackground } from '../layout/BlurBackground';

type Props<T> = {
  title?: T;
} & GetTranslationValues<T>;

export const LoadingView = <T extends TranslationId>({
  title,
  values,
}: Props<T>) => (
  <BlurBackground py={5} className="space-x-3" justify="center" align="center">
    <Loader color="text-white" />
    <Text size="xl" color="text-white" weight="semibold">
      <Translation id="Layout.Loader.title" />
    </Text>
  </BlurBackground>
);
