"use client";
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useGlobalAuthenticationStore } from "@/core/store/data";

type WalletContextType = {
  walletAddress: string | null;
  walletName: string | null;
  setWalletInfo: (address: string, name: string) => void;
  clearWalletInfo: () => void;
};
const WalletContext = createContext<WalletContextType | undefined>(undefined);

/** API-compatible adapter; the Zustand store owns all wallet state. */
export function WalletProvider({ children }: { children: ReactNode }) {
  const address = useGlobalAuthenticationStore((state) => state.address);
  const name = useGlobalAuthenticationStore((state) => state.name);
  const connect = useGlobalAuthenticationStore(
    (state) => state.connectWalletStore,
  );
  const disconnect = useGlobalAuthenticationStore(
    (state) => state.disconnectWalletStore,
  );
  const value = useMemo<WalletContextType>(
    () => ({
      walletAddress: address || null,
      walletName: name || null,
      setWalletInfo: (address, name) => {
        void connect(address, name);
      },
      clearWalletInfo: disconnect,
    }),
    [address, name, connect, disconnect],
  );
  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}
export function useWalletContext() {
  const context = useContext(WalletContext);
  if (!context)
    throw new Error("useWalletContext must be used within WalletProvider");
  return context;
}
