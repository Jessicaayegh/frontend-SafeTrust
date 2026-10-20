import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "stellar.creit.tech" },
      { protocol: "https", hostname: "api.qrserver.com" },
    ],
  },
  async redirects() {
    return [
      { source: "/dashboard/hotel", destination: "/hotels", permanent: true },
      {
        source: "/dashboard/hotel/search",
        destination: "/hotels/search",
        permanent: true,
      },
      {
        source: "/dashboard/hotel/details",
        has: [{ type: "query", key: "id", value: "(?<id>.+)" }],
        destination: "/hotels/:id",
        permanent: true,
      },
      {
        source: "/dashboard/hotel/details",
        destination: "/hotels",
        permanent: false,
      },
      {
        source: "/dashboard/hotel/payment",
        has: [{ type: "query", key: "bookingId", value: "(?<bookingId>.+)" }],
        destination: "/hotels?bookingId=:bookingId",
        permanent: false,
      },
      {
        source: "/dashboard/hotel/payment",
        destination: "/hotels",
        permanent: false,
      },
      {
        source: "/dashboard/hotel/create-escrow",
        destination: "/dashboard/guest",
        permanent: true,
      },
      {
        source: "/dashboard/hotel/booking/:bookingId/escrow",
        destination: "/dashboard/guest",
        permanent: true,
      },
      {
        source: "/bookings/:path*",
        destination: "/dashboard/guest",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
