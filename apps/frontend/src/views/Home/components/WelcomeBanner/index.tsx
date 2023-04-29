import { ArrowRightIcon } from '@heroicons/react/solid';
import { Button, Card, Flex, Text } from '@saibase/uikit';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Translation } from '~/i18n/Translation';
import { ShipImage } from '~/views/Home/components/WelcomeBanner/ShipImage';

export const WelcomeBanner = () => {
  const { locale } = useRouter();

  return (
    <Flex
      align="center"
      className="md:grid md:grid-cols-2"
      direction="col-reverse"
      mdDirection="row"
      justify="center"
    >
      <Card className="space-y-5" direction="col" p={5} justify="center">
        <Text
          color="text-white"
          className="tracking-tight0"
          weight="extrabold"
          size="4xl"
          mdSize="6xl"
        >
          <Translation id="Home.WelcomeBanner.title" />
        </Text>

        <Text color="text-white" size="lg" mdSize="xl" weight="medium">
          <Translation id="Home.WelcomeBanner.description.0" />
        </Text>

        <Text color="text-white" weight="semibold" size="lg" mdSize="xl">
          <Translation id="Home.WelcomeBanner.description.1" />
        </Text>

        <Flex>
          <Link href="/dashboard" locale={locale}>
            <Button
              kind="primary"
              iconRight={(props) => <ArrowRightIcon {...props} />}
            >
              <Translation id="Home.WelcomeBanner.action.title" />
            </Button>
          </Link>
        </Flex>
      </Card>

      <Flex justify="center">
        <ShipImage />
      </Flex>
    </Flex>
  );
};
