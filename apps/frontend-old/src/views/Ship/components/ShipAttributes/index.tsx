import { StarAtlasNftSlot } from '@saibase/star-atlas';
import { Flex, FlexProps, Text } from '@saibase/uikit';
import { InfoRow } from '../../../../components/common/Info';

type Props = FlexProps & { title: string; attrs?: StarAtlasNftSlot[] };

export const ShipAttributes = ({ attrs = [], title, ...props }: Props) => (
  <Flex direction="col" {...props}>
    <Text
      color="text-white"
      className="col-span-3"
      size="3xl"
      mdSize="5xl"
      weight="extrabold"
    >
      {title}
    </Text>
    <Flex pt={5} className="grid grid-cols-2 xl:grid-cols-4 gap-5">
      {attrs.map((attr, index) => (
        <InfoRow key={`${title}-${index}`} title={`${attr.size} slot`}>
          {attr.quantity} {attr.type}
        </InfoRow>
      ))}
    </Flex>
  </Flex>
);
