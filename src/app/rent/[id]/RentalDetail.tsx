"use client";

import type { ApartmentListing } from "@/types/hotel";
import {
  ApartmentDetail,
  HotelHeader,
  SuggestionsList,
} from "@/components/listings";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layouts/PageContainer";
import { listingHref } from "@/features/listings/search/links";

export default function RentalDetail({
  apartment,
  suggestions,
  listingSearchParams,
}: {
  apartment: ApartmentListing;
  suggestions: ApartmentListing[];
  listingSearchParams: string;
}) {
  const router = useRouter();
  const currentSearch = new URLSearchParams(listingSearchParams);

  return (
    <div className="min-h-screen bg-white">
      <HotelHeader listingSearchParams={listingSearchParams} />
      <PageContainer className="flex flex-col lg:flex-row">
        <SuggestionsList
          apartments={suggestions}
          onSelect={(id) =>
            router.push(listingHref(`/rent/${id}`, currentSearch))
          }
        />
        <ApartmentDetail
          apartment={apartment}
          onBook={() =>
            router.push(
              listingHref(`/rent/${apartment.id}/escrow/create`, currentSearch),
            )
          }
        />
      </PageContainer>
    </div>
  );
}
