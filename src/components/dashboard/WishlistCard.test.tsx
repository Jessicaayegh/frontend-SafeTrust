import { render, screen } from "@testing-library/react";
import { WishlistCard } from "./WishlistCard";
<<<<<<< HEAD
=======
import FavoritesPage from "@/app/(app)/dashboard/favorites/page";
import type { Apartment } from "@/types/apartment";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockApartments: Apartment[] = [
  {
    id: "apt-1",
    name: "Apartment 1",
    price: 1000,
    warranty_deposit: 2000,
    is_available: true,
    image_urls: ["/img/room1.png", "/img/room2.png"],
    address: { city: "San José" },
    location: "San José",
    offers: 1,
    status: "inhabited",
    promoted: true,
    available_from: "2026-01-01",
    created_at: "2026-01-01",
    owner_id: "owner-1",
  },
  {
    id: "apt-2",
    name: "Apartment 2",
    price: 1500,
    warranty_deposit: 3000,
    is_available: true,
    image_urls: ["/img/room3.png"],
    address: { city: "Escazú" },
    location: "Escazú",
    offers: 0,
    status: "inhabited",
    promoted: false,
    available_from: "2026-01-01",
    created_at: "2026-01-01",
    owner_id: "owner-2",
  },
];
>>>>>>> upstream/main

describe("WishlistCard", () => {
  it("links to the wishlist with its name and subtitle", () => {
    render(
      <WishlistCard
        name="Saved stays"
        subtitle="2 stays"
        images={["/img/a.webp", "/img/b.webp"]}
        href="/dashboard/favorites/saved"
      />,
    );

    expect(screen.getByRole("link", { name: /saved stays/i })).toHaveAttribute(
      "href",
      "/dashboard/favorites/saved",
    );
    expect(screen.getByText("2 stays")).toBeInTheDocument();
  });
});
