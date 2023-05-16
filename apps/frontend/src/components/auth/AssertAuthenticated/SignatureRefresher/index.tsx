import { Button, Card, Text } from '@saibase/uikit';
import { useUpdateSignature } from '~/hooks/useUpdateSignature';
import { Translation } from '~/i18n/Translation';

export const SignatureRefresher = () => {
  const updateSignature = useUpdateSignature();

  return (
    <Card
      py={16}
      px={5}
      direction="col"
      className="mx-auto space-y-8"
      justify="center"
      align="center"
    >
      <Text size="xl" align="center" color="text-white" weight="semibold">
        <Translation id="auth.sign.description" />
      </Text>

      <Button kind="neutral" size="small" onClick={updateSignature}>
        <Translation id="auth.sign.cta" />
      </Button>
    </Card>
  );
};
