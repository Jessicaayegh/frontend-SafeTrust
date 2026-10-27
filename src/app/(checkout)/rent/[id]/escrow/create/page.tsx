import { notFound } from "next/navigation";
import { RentCheckout } from "@/features/escrow";
import { APARTMENT_LISTINGS } from "@/lib/mockData/apartmentListings";

export default async function EscrowCreatePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    checkIn?: string | string[];
    checkOut?: string | string[];
  }>;
}) {
  const { id } = await params;
  const { checkIn, checkOut } = await searchParams;
  const listing = APARTMENT_LISTINGS.find((apartment) => apartment.id === id);

  if (!listing) notFound();

  return (
    <RentCheckout
      listing={listing}
      initialCheckIn={typeof checkIn === "string" ? checkIn : undefined}
      initialCheckOut={typeof checkOut === "string" ? checkOut : undefined}
    />
  );
}
