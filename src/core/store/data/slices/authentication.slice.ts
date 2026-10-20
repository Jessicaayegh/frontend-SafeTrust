import { StateCreator } from "zustand";
import type { AuthenticationGlobalStore } from "@/types/authentication";

const AUTHENTICATION_ACTIONS = {
  CONNECT_WALLET: "authentication/connect",
  SET_TOKEN: "authentication/set-token",
  DISCONNECT_WALLET: "authentication/disconnect",
} as const;

export const useGlobalAuthenticationSlice: StateCreator<
  AuthenticationGlobalStore,
  [["zustand/devtools", never], ["zustand/persist", unknown]],
  [],
  AuthenticationGlobalStore
> = (set) => {
  return {
    // Stores
    address: "",
    name: "",
    token: "",
    walletId: "",

    // Modifiers
    connectWalletStore: async (
      address: string,
      name: string,
      walletId = "",
    ) => {
      set(
        { address, name, walletId },
        false,
        AUTHENTICATION_ACTIONS.CONNECT_WALLET,
      );
    },

    setToken: (token: string) => {
      set({ token }, false, AUTHENTICATION_ACTIONS.SET_TOKEN);
    },

    disconnectWalletStore: () =>
      set(
        { address: "", name: "", walletId: "" },
        false,
        AUTHENTICATION_ACTIONS.DISCONNECT_WALLET,
      ),

    clearAuth: () =>
      set(
        { address: "", name: "", walletId: "", token: "" },
        false,
        AUTHENTICATION_ACTIONS.DISCONNECT_WALLET,
      ),
  };
};
