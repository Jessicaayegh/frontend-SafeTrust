/** Read-only detection through the wallet kit's adapter; never selects a signer. */
async function adapter() {
  const { FreighterModule } =
    await import("@creit.tech/stellar-wallets-kit/modules/freighter.module");
  return new FreighterModule();
}
export async function isConnected() {
  try {
    const freighter = await adapter();
    return {
      isConnected:
        (await freighter.isAvailable()) ||
        (typeof window !== "undefined" &&
          (
            window as Window & {
              stellar?: { provider?: string; platform?: string };
            }
          ).stellar?.provider === "freighter" &&
          (window as Window & { stellar?: { platform?: string } }).stellar
            ?.platform === "mobile"),
    };
  } catch {
    return { isConnected: false };
  }
}
export async function isAllowed() {
  try {
    await (await adapter()).getAddress({ skipRequestAccess: true });
    return { isAllowed: true };
  } catch {
    return { isAllowed: false };
  }
}
export async function getNetworkDetails(): Promise<{
  network: string;
  networkPassphrase: string;
  networkUrl?: string;
  error?: unknown;
}> {
  try {
    return { ...(await (await adapter()).getNetwork()), error: undefined };
  } catch {
    return {
      network: "",
      networkPassphrase: "",
      error: "Wallet network unavailable",
    };
  }
}
