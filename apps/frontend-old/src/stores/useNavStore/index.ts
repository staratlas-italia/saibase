import { create } from 'zustand';

type NavStore = {
  isSidebarOpen: boolean;
  sidebarToggle: () => void;
};

export const useNavStore = create<NavStore>((set, get) => ({
  isSidebarOpen: false,
  sidebarToggle: () =>
    set({
      isSidebarOpen: !get().isSidebarOpen,
    }),
}));
