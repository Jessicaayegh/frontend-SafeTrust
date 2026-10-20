import { notFound } from "next/navigation";
import RentalDetail from "./RentalDetail";
import {
  APARTMENT_LISTINGS,
  getSuggestedApartments,
} from "@/lib/mockData/apartmentListings";

// Listings are static mock data: pre-render each one and let unknown ids 404
// at routing time. A notFound() thrown inside the loading.tsx Suspense
// boundary would otherwise be streamed with a 200 status.
export const dynamicParams = false;

export function generateStaticParams() {
  return APARTMENT_LISTINGS.map((listing) => ({ id: listing.id }));
}

export default async function RentalDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ id }, search] = await Promise.all([params, searchParams]);
  const apartment = APARTMENT_LISTINGS.find((listing) => listing.id === id);

  // Unknown ids must 404, not silently show another listing.
  if (!apartment) notFound();

  const suggestions = getSuggestedApartments(apartment.id);

  const listingSearchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(search)) {
    if (Array.isArray(value)) {
      for (const item of value) listingSearchParams.append(key, item);
    } else if (value !== undefined) {
      listingSearchParams.append(key, value);
    }
  }

  return (
    <RentalDetail
      apartment={apartment}
      suggestions={suggestions}
      listingSearchParams={listingSearchParams.toString()}
    />
  );
}
