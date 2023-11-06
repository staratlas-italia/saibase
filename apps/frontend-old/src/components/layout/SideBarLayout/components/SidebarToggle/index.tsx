import { Dialog, Transition } from '@headlessui/react';
import { MenuIcon } from '@heroicons/react/solid';
import { Flex } from '@saibase/uikit';
import { useNavStore } from '../../../../../stores/useNavStore';
import { BlurBackground } from '../../../BlurBackground';
import { SideBarContent } from '../SideBarContent';

export const SidebarToggle = () => {
  const { isSidebarOpen, sidebarToggle } = useNavStore();

  return (
    <Flex className="lg:hidden cursor-pointer" onClick={sidebarToggle}>
      <BlurBackground
        className="w-16 h-16 rounded-full"
        align="center"
        justify="center"
      >
        <MenuIcon className="w-8 h-8 text-white w" />
      </BlurBackground>

      <Transition.Root show={isSidebarOpen}>
        <Dialog
          open={isSidebarOpen}
          onClose={sidebarToggle}
          className="relative z-50"
        >
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900" aria-hidden="true" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel>
                <SideBarContent />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </Flex>
  );
};
