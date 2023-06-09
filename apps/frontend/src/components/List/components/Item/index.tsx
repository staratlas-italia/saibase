import { ColorName, Flex, Text, iconRenderProp } from '@saibase/uikit';
import classNames from 'classnames';

export type ItemProps = {
  bordered?: boolean;
  borderColor?: ColorName;
  details?: string;
  icon?: iconRenderProp;
  title: string;
};

export const Item = ({
  bordered,
  borderColor,
  details,
  icon,
  title,
}: ItemProps) => {
  return (
    <Flex
      p={2}
      justify="between"
      direction="col"
      lgDirection="row"
      className={classNames(' border-gray-300 rounded-xl', {
        'border-2': bordered,
        [`border-${borderColor}`]: bordered && borderColor,
      })}
    >
      <Flex align="center" className="space-x-3">
        {icon && icon({ className: `h-5 w-5 text-white` })}
        <Text size="xl" weight="semibold">
          {title}
        </Text>
      </Flex>
      {details && (
        <Text weight="semibold" size="xl">
          {details}
        </Text>
      )}
    </Flex>
  );
};
