/** Vendored API adapter: all signing uses SafeTrust's canonical wallet layer. */
import { signXdr } from "@/lib/stellar/wallet-kit";
export { kit, loadWalletKit as getKit } from "@/lib/stellar/wallet-kit";
export const signTransaction = ({
  unsignedTransaction,
  address,
}: {
  unsignedTransaction: string;
  address: string;
}) => signXdr(unsignedTransaction, address);
