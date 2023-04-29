import { MenuIcon } from '@heroicons/react/solid';
import { Card, Flex } from '@saibase/uikit';
import { useNavigation } from '../Provider';
import { SideBarContent } from '../SideBarContent';

export const SidebarToggle = () => {
  const { toggle, isOpen } = useNavigation();

  return (
    <Flex className="lg:hidden cursor-pointer" onClick={toggle}>
      <Card className="w-16 h-16 rounded-full" align="center" justify="center">
        <MenuIcon className="w-8 h-8 text-white w" />
      </Card>

      {isOpen && (
        <Flex className="absolute z-20 ">
          <Card>
            <Flex className="absolute top-4 left-4">
              <MenuIcon className="w-8 h-8 text-white" />
            </Flex>

            <Flex pl={12} p={5}>
              <SideBarContent />
            </Flex>
          </Card>
        </Flex>
      )}
    </Flex>
  );
};
