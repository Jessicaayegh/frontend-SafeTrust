import { act, renderHook } from "@testing-library/react";
import type { ISupportedWallet } from "@creit.tech/stellar-wallets-kit";
import { useWallet } from "./useWallet";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import {
  getWalletKit,
  signXdr,
  WalletConnectionCancelledError,
} from "@/lib/stellar/wallet-kit";

jest.mock("@/lib/stellar/wallet-kit", () => ({
  getWalletKit: jest.fn(),
  signXdr: jest.fn(),
  WalletConnectionCancelledError: class WalletConnectionCancelledError extends Error {},
}));
const wallet = {
  id: "xbull",
  name: "xBull",
  isAvailable: true,
} as ISupportedWallet;
let selected: (wallet: ISupportedWallet) => void;
let closed: () => void;
const fakeKit = {
  setWallet: jest.fn(),
  getAddress: jest.fn().mockResolvedValue({ address: "GCONNECTED" }),
  getSupportedWallets: jest.fn().mockResolvedValue([wallet]),
  disconnect: jest.fn(),
  openModal: jest.fn(({ onWalletSelected, onClosed }) => {
    selected = onWalletSelected;
    closed = onClosed;
    return Promise.resolve();
  }),
};
beforeEach(() => {
  jest.clearAllMocks();
  useGlobalAuthenticationStore.getState().clearAuth();
  jest
    .mocked(getWalletKit)
    .mockReturnValue(fakeKit as unknown as ReturnType<typeof getWalletKit>);
  jest.mocked(signXdr).mockResolvedValue("SIGNED");
});

it("connects the selected adapter, persists it, and signs using the latest store address", async () => {
  const { result } = renderHook(() => useWallet());
  await act(async () => {
    const pending = result.current.connect();
    selected(wallet);
    await expect(pending).resolves.toBe("GCONNECTED");
    // Signing need not wait for React to rerender the hook.
    await result.current.sign("XDR");
  });
  expect(fakeKit.setWallet).toHaveBeenCalledWith("xbull");
  expect(result.current.address).toBe("GCONNECTED");
  expect(result.current.isConnected).toBe(true);
  expect(useGlobalAuthenticationStore.getState().walletId).toBe("xbull");
  expect(signXdr).toHaveBeenCalledWith("XDR", "GCONNECTED");
});

it("settles a dismissed picker without changing the connection", async () => {
  const { result } = renderHook(() => useWallet());
  await act(async () => {
    const pending = result.current.connect();
    closed();
    await expect(pending).rejects.toBeInstanceOf(
      WalletConnectionCancelledError,
    );
  });
  expect(result.current.isConnected).toBe(false);
});

it("clears wallet metadata even if an adapter disconnect fails, while retaining the Firebase token", async () => {
  useGlobalAuthenticationStore
    .getState()
    .connectWalletStore("GCONNECTED", "xBull", "xbull");
  useGlobalAuthenticationStore.getState().setToken("MEMORY_ONLY");
  fakeKit.disconnect.mockRejectedValueOnce(new Error("Adapter unavailable"));
  const { result } = renderHook(() => useWallet());
  await act(async () => {
    await expect(result.current.disconnect()).rejects.toThrow(
      "Adapter unavailable",
    );
  });
  expect(result.current.address).toBe("");
  expect(useGlobalAuthenticationStore.getState().walletId).toBe("");
  expect(useGlobalAuthenticationStore.getState().token).toBe("MEMORY_ONLY");
});
