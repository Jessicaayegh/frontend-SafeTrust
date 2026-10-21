"use client";

import { useCallback } from "react";
import type { ISupportedWallet } from "@creit.tech/stellar-wallets-kit";
import {
  getWalletKit,
  signXdr,
  WalletConnectionCancelledError,
} from "@/lib/stellar/wallet-kit";
import { useGlobalAuthenticationStore } from "@/core/store/data";

interface ConnectOptions {
  walletId?: string;
  authenticate?: boolean;
  modalTitle?: string;
}

export function useWallet() {
  const address = useGlobalAuthenticationStore((state) => state.address);
  const name = useGlobalAuthenticationStore((state) => state.name);
  const connect = useCallback(
    async (options: ConnectOptions = {}): Promise<string> => {
      const kit = getWalletKit();
      const select = async (wallet: ISupportedWallet) => {
        if (options.authenticate) {
          const { signInWithFreighter } = await import("@/lib/auth/wallet");
          return signInWithFreighter(wallet.id);
        }
        await kit.setWallet(wallet.id);
        const { address } = await kit.getAddress();
        await useGlobalAuthenticationStore
          .getState()
          .connectWalletStore(address, wallet.name, wallet.id);
        return address;
      };
      if (options.walletId) {
        const wallet = (await kit.getSupportedWallets()).find(
          (wallet) => wallet.id === options.walletId,
        );
        if (!wallet) throw new Error("Wallet is not supported");
        return select(wallet);
      }
      return new Promise<string>((resolve, reject) => {
        void kit
          .openModal({
            modalTitle: options.modalTitle ?? "Connect your Stellar wallet",
            onWalletSelected: (wallet) => {
              void select(wallet).then(resolve, reject);
            },
            onClosed: () => reject(new WalletConnectionCancelledError()),
          })
          .catch(reject);
      });
    },
    [],
  );
  const disconnect = useCallback(async () => {
    try {
      await getWalletKit().disconnect();
    } finally {
      useGlobalAuthenticationStore.getState().disconnectWalletStore();
    }
  }, []);
  const sign = useCallback(
    (unsignedXdr: string) =>
      signXdr(unsignedXdr, useGlobalAuthenticationStore.getState().address),
    [],
  );
  return {
    address,
    name,
    isConnected: Boolean(address),
    connect,
    disconnect,
    sign,
  };
}
