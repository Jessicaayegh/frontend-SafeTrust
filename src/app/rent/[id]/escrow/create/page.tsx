import { notFound } from "next/navigation";
import { RentCheckout } from "@/features/escrow";
import { STUB_HOTELS } from "@/lib/mockData/hotels";

export default async function EscrowCreatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = STUB_HOTELS.find((hotel) => hotel.id === id);

  if (!listing) notFound();

  return <RentCheckout listing={listing} />;
}