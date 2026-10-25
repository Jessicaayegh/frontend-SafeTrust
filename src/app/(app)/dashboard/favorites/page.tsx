import type { Metadata } from "next";
import { WishlistsIndex } from "@/features/listings/wishlist/WishlistsIndex";

export const metadata: Metadata = { title: "Wishlists" };

export default function FavoritesPage() {
  return <WishlistsIndex />;
}
