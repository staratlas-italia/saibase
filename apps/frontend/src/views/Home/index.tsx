import { Card, Flex } from '@saibase/uikit';
import { Header } from '~/components/layout/Header';
import { Treasury } from '~/components/layout/Header/components/Treasury';
import { EnlistBanner } from '~/views/Home/components/EnlistBanner';
import { WelcomeBanner } from '~/views/Home/components/WelcomeBanner';

export const HomePage = () => {
  return (
    <div className="container mx-auto">
      <Header fluid />

      <div className="space-y-10 px-5 pb-5">
        <Flex>
          <Card className="w-full md:w-auto">
            <Treasury />
          </Card>
        </Flex>

        <WelcomeBanner />

        <EnlistBanner />
      </div>
    </div>
  );
};
