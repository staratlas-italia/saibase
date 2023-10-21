import { Flex } from '@saibase/uikit';
import Image from 'next/image';
import styled from 'styled-components';

export const Container = styled(Flex)`
  position: relative;
`;

const ImageWrapper = styled.div`
  overflow: hidden;
  max-width: 450px;
`;

export const HumanImage = () => {
  return (
    <Container px={10} mdPx={0} py={10} align="center" justify="center">
      <ImageWrapper className="rounded-full overflow-hidden">
        <Image
          src="/images/human.webp"
          alt="humanoid character"
          width={400}
          height={400}
        />
      </ImageWrapper>
    </Container>
  );
};
