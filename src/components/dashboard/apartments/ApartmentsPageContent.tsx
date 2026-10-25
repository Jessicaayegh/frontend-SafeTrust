"use client";

import dynamic from "next/dynamic";

const MyApartmentsTable = dynamic(
  () =>
    import("@/components/dashboard/apartments/MyApartmentsTable").then(
      (mod) => mod.MyApartmentsTable,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        role="status"
        aria-label="Loading apartments"
        className="h-64 rounded-lg bg-muted motion-safe:animate-pulse"
      />
    ),
  },
);

export function ApartmentsPageContent() {
  return (
    <div className="space-y-6">
      <MyApartmentsTable />
    </div>
  );
}
