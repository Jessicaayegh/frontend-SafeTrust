export interface AuthenticationGlobalStore {
  address: string;
  name: string;
  token: string;
  walletId: string;

  connectWalletStore: (
    address: string,
    name: string,
    walletId?: string,
  ) => void;
  setToken: (token: string) => void;
  disconnectWalletStore: () => void;
  clearAuth: () => void;
}
