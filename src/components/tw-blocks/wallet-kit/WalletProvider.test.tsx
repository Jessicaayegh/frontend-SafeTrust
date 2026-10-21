import { act, render, screen } from "@testing-library/react";
import { WalletProvider, useWalletContext } from "./WalletProvider";
import { useGlobalAuthenticationStore as store } from "@/core/store/data";

function Consumer() {
  const { walletAddress, walletName } = useWalletContext();
  return (
    <output>
      {walletAddress ?? "Disconnected"} / {walletName}
    </output>
  );
}
it("shows the canonical connection immediately and follows connection changes", async () => {
  store.getState().clearAuth();
  await store.getState().connectWalletStore("GX", "xBull", "xbull");
  render(
    <WalletProvider>
      <Consumer />
    </WalletProvider>,
  );
  expect(screen.getByText("GX / xBull")).toBeInTheDocument();
  await act(async () => {
    await store.getState().connectWalletStore("GL", "LOBSTR", "lobstr");
  });
  expect(screen.getByText("GL / LOBSTR")).toBeInTheDocument();
  act(() => store.getState().disconnectWalletStore());
  expect(screen.getByText("Disconnected /")).toBeInTheDocument();
});
