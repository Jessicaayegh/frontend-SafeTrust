import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { RentCheckout } from "./RentCheckout";
import type { ApartmentListing } from "@/types/hotel";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("./BookingEscrowCheckout", () => ({
  BookingEscrowCheckout: ({
    onFunded,
  }: {
    onFunded?: (intent: {
      state: { step: "funded"; contractId: string };
    }) => void;
  }) => (
    <button
      onClick={() =>
        onFunded?.({
          state: { step: "funded", contractId: "C-123" },
        })
      }
    >
      Complete funding
    </button>
  ),
}));

jest.mock("@/providers/EscrowProviders", () => ({
  EscrowProviders: ({ children }: { children: ReactNode }) => children,
}));

const listing: ApartmentListing = {
  id: "apt-42",
  name: "Central apartment",
  address: "San José",
  coordinates: { lat: 9.93, lng: -84.08 },
  price: 1200,
  promoted: false,
  images: [],
  category: "Travelers",
  location: "San José",
  owner: { name: "Host", avatar: "" },
  description: "",
  rating: 4.5,
  bedrooms: 1,
  bathrooms: 1,
  petFriendly: false,
};

it("navigates to the rental escrow after funding", () => {
  mockPush.mockClear();
  render(<RentCheckout listing={listing} />);

  fireEvent.click(screen.getByRole("button", { name: "Complete funding" }));

  expect(mockPush).toHaveBeenCalledWith("/rent/apt-42/escrow/C-123");
});
