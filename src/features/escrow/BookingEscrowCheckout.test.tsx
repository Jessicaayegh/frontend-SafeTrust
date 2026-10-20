import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import type { HotelListing } from "@/@types/hotel";
import { BookingEscrowCheckout } from "./BookingEscrowCheckout";

jest.mock("@/components/auth/wallet/hooks/multi-wallet.hook", () => ({
  useMultiWallet: () => ({
    handleConnect: jest.fn(),
    isMainModalOpen: false,
    isStellarModalOpen: false,
    isMetaMaskModalOpen: false,
    closeMainModal: jest.fn(),
    closeStellarModal: jest.fn(),
    closeMetaMaskModal: jest.fn(),
    handleWalletTypeSelected: jest.fn(),
    handleStellarWalletSelected: jest.fn(),
    handleMetaMaskSelected: jest.fn(),
  }),
}));

jest.mock("@/components/auth/wallet/components/MainWalletSelectionModal", () => ({
  MainWalletSelectionModal: () => null,
}));

jest.mock("@/components/auth/wallet/components/WalletSelectionModal", () => ({
  WalletSelectionModal: () => null,
}));

jest.mock("@/components/auth/wallet/components/MetaMaskWalletModal", () => ({
  MetaMaskWalletModal: () => null,
}));

jest.mock("@/core/store/data", () => ({
  useGlobalAuthenticationStore: () => ({ address: null }),
}));

jest.mock("@/services/escrow.service", () => ({
  initializedReservationEscrow: jest.fn(),
  fundReservationEscrow: jest.fn(),
}));

const listing: HotelListing = {
  id: "listing-1",
  name: "Test apartment",
  address: "San Jose",
  price: 1200,
  bedrooms: 1,
  bathrooms: 1,
  petFriendly: false,
  promoted: false,
  images: ["/test.jpg"],
  category: "Family",
  location: "San José",
  owner: { name: "Host", avatar: "/host.jpg" },
  description: "A test listing",
};

describe("BookingEscrowCheckout", () => {
  it("shows a price estimate and wallet connection CTA without creating an escrow", () => {
    render(
      <BookingEscrowCheckout listing={listing} onFunded={jest.fn()} />,
    );

    expect(screen.getByText("Price breakdown")).toBeInTheDocument();
    expect(screen.getByText("Rent")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Connect wallet" }),
    ).toBeInTheDocument();
  });
});