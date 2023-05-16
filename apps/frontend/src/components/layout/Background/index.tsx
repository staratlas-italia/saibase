import styled, { css, keyframes } from 'styled-components';
import { getHueByFactionStyle } from '~/utils/getHueByFaction';

type Props = {
  show?: boolean;
  badgeMint?: string;
  image?: boolean;
};

const hueAnimation = (badgeMint: string) => keyframes`
  0% {
    filter: hue-rotate(0deg);
  }

  100% {
    filter: hue-rotate(${getHueByFactionStyle(badgeMint)}deg);
  }
`;

const LayoutBackground = styled.div.attrs({
  className:
    'fixed bg-no-repeat bg-cover bg-center min-h-screen w-screen bg-primary',
})<Props>`
  ${({ image }) =>
    image &&
    css`
      background-image: url('/images/bg.webp');
    `}/* ${({ badgeMint, show = true }) =>
    show &&
    badgeMint &&
    css`
      animation: ${hueAnimation(badgeMint)} 0.5s ease-in-out;
      animation-fill-mode: forwards;
    `} */
`;

// const ConnectedBackground = () => {
//   const badges = useBadges();

//   const showAnimation = useHueAnimation();

//   const badge = badges.find((badge) => isFactionBadge(badge.mint.address));

//   if (!badge) {
//     return <LayoutBackground />;
//   }

//   return (
//     <LayoutBackground
//       badgeMint={badge.mint.address.toString()}
//       show={showAnimation}
//     />
//   );
// };

export const Background = (props: Props) => {
  // const { connected } = useWallet();

  // if (connected) {
  //   return (
  //     <SelfRetriever loader={<LayoutBackground />}>
  //       <BadgesRetriever loader={<LayoutBackground />}>
  //         <ConnectedBackground />
  //       </BadgesRetriever>
  //     </SelfRetriever>
  //   );
  // }

  return <LayoutBackground {...props} />;
};
