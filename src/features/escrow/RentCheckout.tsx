"use client";

import { useRouter } from "next/navigation";
import type { HotelListing } from "@/@types/hotel";
import { BookingEscrowCheckout } from "./BookingEscrowCheckout";

export function RentCheckout({ listing }: { listing: HotelListing }) {
  const router = useRouter();

  return (
    <BookingEscrowCheckout
      listing={listing}
      onFunded={(escrowId) =>
        router.push(`/rent/${listing.id}/escrow/${escrowId}`)
      }
    />
  );
}