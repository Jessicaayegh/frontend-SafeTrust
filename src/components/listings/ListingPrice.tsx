<<<<<<< HEAD
import { cn } from "@/lib/utils";
import { formatListingPrice } from "./formatListingPrice";

/** Demo listing prices are USD per night (see SD-00). */
export const LISTING_PRICE_UNIT = "night" as const;
=======
import { formatListingPrice } from "./formatListingPrice";
import { cn } from "@/lib/utils";

interface ListingPriceProps {
  amount: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}
>>>>>>> upstream/main

export function ListingPrice({
  amount,
  size = "md",
  className,
<<<<<<< HEAD
}: {
  amount: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-baseline gap-1", className)}>
      <span
        className={cn(
          "font-semibold text-foreground",
          size === "sm" && "text-sm",
          size === "md" && "text-2xl",
          size === "lg" && "text-3xl",
        )}
      >
        {formatListingPrice(amount)}
      </span>
      <span className="text-xs text-muted-foreground">
        / {LISTING_PRICE_UNIT}
      </span>
    </span>
  );
}
=======
}: ListingPriceProps) {
  const sizeClasses = {
    sm: "text-base font-semibold",
    md: "text-xl font-semibold",
    lg: "text-2xl font-bold",
  };

  const suffixClasses = {
    sm: "text-xs font-normal text-muted-foreground",
    md: "text-sm font-normal text-muted-foreground",
    lg: "text-base font-normal text-muted-foreground",
  };

  return (
    <div
      className={cn(
        "inline-flex items-baseline gap-1 text-foreground",
        className,
      )}
    >
      <span className={sizeClasses[size]}>{formatListingPrice(amount)}</span>
      <span className={suffixClasses[size]}>/ night</span>
    </div>
  );
}

export default ListingPrice;
>>>>>>> upstream/main
