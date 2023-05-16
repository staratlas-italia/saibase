import { Button, ButtonProps } from '@saibase/uikit';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, PropsWithChildren, useMemo } from 'react';
import { DISCORD_OAUTH_URL } from '~/common/constants';
import { useSelf } from '~/hooks/useNullableSelf';

export const DiscordLink = ({ children }: PropsWithChildren<unknown>) => {
  const router = useRouter();

  return (
    <Link href={`${DISCORD_OAUTH_URL}&state=${router.asPath}`}>{children}</Link>
  );
};

type Props = {
  kind?: ButtonProps['kind'];
};

export const LinkDiscordButton = ({ kind = 'primary' }: Props) => {
  const self = useSelf();

  const Wrapper = useMemo(
    () => (self.discordId ? Fragment : DiscordLink),
    [self.discordId]
  );

  return (
    <Wrapper>
      <Button
        kind={kind}
        disabled={!!self.discordId}
        as="div"
        className="rounded-xl"
        iconLeft={() => (
          <Image
            width={24}
            height={24}
            alt="Discord Link"
            src="/images/social/discord_logo.svg"
          />
        )}
      >
        {self.discordId ? 'Linked' : 'Link'}
      </Button>
    </Wrapper>
  );
};

const Loader = () => (
  <Button kind="primary" as="div" loading className="rounded-xl" />
);

LinkDiscordButton.Loader = Loader;
