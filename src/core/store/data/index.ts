// frontend-SafeTrust/src/core/store/data/index.ts

import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import type { AuthenticationGlobalStore } from "@/types/authentication";
import { useGlobalAuthenticationSlice } from "./slices/authentication.slice";

export const useGlobalAuthenticationStore = create<AuthenticationGlobalStore>()(
  devtools(
    persist(useGlobalAuthenticationSlice, {
      name: "safetrust-wallet",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ address, name, walletId }) => ({
        address,
        name,
        walletId,
      }),
      merge: (saved, current) => {
        const wallet = saved as Partial<AuthenticationGlobalStore> | undefined;
        // Never hydrate tokens, actions, or identity claims from browser storage.
        return {
          ...current,
          address: typeof wallet?.address === "string" ? wallet.address : "",
          name: typeof wallet?.name === "string" ? wallet.name : "",
          walletId: typeof wallet?.walletId === "string" ? wallet.walletId : "",
        };
      },
    }),
    { name: "AuthenticationStore" },
  ),
);
