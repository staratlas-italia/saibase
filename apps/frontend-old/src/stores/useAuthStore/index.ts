import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthStore = {
  signature: string | null;
  updatedAt: number | null;
  updateSignature: (signature: string) => void;
  clear: () => void;
};

export const useAuthStore = create(
  persist<AuthStore>(
    (set) => ({
      signature: null,
      updatedAt: null,
      updateSignature: (signature: string) =>
        set({ signature, updatedAt: Date.now() }),
      clear: () => set({ signature: null, updatedAt: null }),
    }),
    {
      name: 'auth-storage-v2',
    }
  )
);
