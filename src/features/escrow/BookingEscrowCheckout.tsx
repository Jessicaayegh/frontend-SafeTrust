"use client";

import { useMemo, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import { CalendarDays, Loader2, ShieldCheck, Wallet } from "lucide-react";
import type { DateRange } from "react-day-picker";
import type { HotelListing } from "@/@types/hotel";
import { MainWalletSelectionModal } from "@/components/auth/wallet/components/MainWalletSelectionModal";
import { MetaMaskWalletModal } from "@/components/auth/wallet/components/MetaMaskWalletModal";
import { WalletSelectionModal } from "@/components/auth/wallet/components/WalletSelectionModal";
import { useMultiWallet } from "@/components/auth/wallet/hooks/multi-wallet.hook";
import { CustomDateRangePicker } from "@/components/rooms/booking/CustomDateRangePicker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import {
  fundReservationEscrow,
  initializedReservationEscrow,
} from "@/services/escrow.service";

const TAX_RATE = 0.1;
const PLATFORM_FEE_RATE = 0.05;
const DAYS_IN_RENTAL_MONTH = 30;

interface BookingEscrowCheckoutProps {
  listing: HotelListing;
  onFunded: (escrowId: string) => void;
}

export function BookingEscrowCheckout({
  listing,
  onFunded,
}: BookingEscrowCheckoutProps) {
  const [dateRange, setDateRange] = useState<DateRange>();
  const [isFunding, setIsFunding] = useState(false);
  const [error, setError] = useState<string>();
  const { address } = useGlobalAuthenticationStore();
  const {
    handleConnect,
    isMainModalOpen,
    isStellarModalOpen,
    isMetaMaskModalOpen,
    closeMainModal,
    closeStellarModal,
    closeMetaMaskModal,
    handleWalletTypeSelected,
    handleStellarWalletSelected,
    handleMetaMaskSelected,
  } = useMultiWallet();

  const nights = useMemo(() => {
    if (!dateRange?.from || !dateRange.to) return 0;
    return differenceInCalendarDays(dateRange.to, dateRange.from);
  }, [dateRange]);

  const pricing = useMemo(() => {
    const billableNights = nights || 1;
    const rent = Math.round(
      ((listing.price * billableNights) / DAYS_IN_RENTAL_MONTH) * 100,
    ) / 100;
    const tax = Math.round(rent * TAX_RATE * 100) / 100;
    const platformFee = Math.round(rent * PLATFORM_FEE_RATE * 100) / 100;

    return {
      rent,
      tax,
      platformFee,
      total: Math.round((rent + tax + platformFee) * 100) / 100,
    };
  }, [listing.price, nights]);

  const handleCheckout = async () => {
    if (!address) {
      handleConnect();
      return;
    }

    if (!dateRange?.from || !dateRange.to || nights < 1) {
      setError("Select valid check-in and check-out dates to continue.");
      return;
    }

    setError(undefined);
    setIsFunding(true);

    try {
      const escrow = await initializedReservationEscrow({
        hotelName: listing.name,
        description: `Rental booking for ${nights} nights from ${dateRange.from.toLocaleDateString()} to ${dateRange.to.toLocaleDateString()}`,
        price: pricing.rent,
        tax: Math.round((pricing.tax + pricing.platformFee) * 100) / 100,
      });
      const escrowId = escrow.data?.contractId;

      if (!escrowId) {
        throw new Error("Escrow creation did not return a contract ID.");
      }

      await fundReservationEscrow({
        contractId: escrowId,
        amount: pricing.total,
      });
      onFunded(escrowId);
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Unable to fund the escrow. Please try again.",
      );
    } finally {
      setIsFunding(false);
    }
  };

  const canFund = Boolean(dateRange?.from && dateRange.to && nights > 0);
  const estimatedPeriod = nights
    ? `${nights} night${nights === 1 ? "" : "s"}`
    : "1 night";

  return (
    <>
      <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="space-y-6">
            <div>
              <p className="text-sm font-medium text-orange-600">Secure checkout</p>
              <h1 className="mt-1 text-3xl font-semibold">{listing.name}</h1>
              <p className="mt-2 text-muted-foreground">{listing.address}</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CalendarDays className="h-5 w-5" />
                  Choose your rental dates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CustomDateRangePicker
                  date={dateRange}
                  onDateChange={setDateRange}
                  placeholder="Select check-in and check-out"
                  minNights={1}
                  maxNights={365}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  Escrow-protected payment
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Your payment is funded to a Trustless Work escrow on Stellar.
                Funds remain protected until the escrow terms are met.
              </CardContent>
            </Card>
          </section>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Price breakdown</CardTitle>
              <p className="text-sm text-muted-foreground">
                {nights
                  ? `${nights} night${nights === 1 ? "" : "s"} · monthly rent prorated over 30 days`
                  : `Estimate for ${estimatedPeriod}; select dates to update`}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Rent</span>
                <span>${pricing.rent.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax ({TAX_RATE * 100}%)</span>
                <span>${pricing.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>SafeTrust fee ({PLATFORM_FEE_RATE * 100}%)</span>
                <span>${pricing.platformFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-4 font-semibold">
                <span>Total</span>
                <span>${pricing.total.toFixed(2)}</span>
              </div>

              {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}

              <Button
                className="w-full"
                size="lg"
                disabled={isFunding || (Boolean(address) && !canFund)}
                onClick={handleCheckout}
              >
                {isFunding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Funding escrow…
                  </>
                ) : !address ? (
                  <>
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect wallet
                  </>
                ) : (
                  `Fund escrow · $${pricing.total.toFixed(2)}`
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <MainWalletSelectionModal
        isOpen={isMainModalOpen}
        onClose={closeMainModal}
        onWalletTypeSelected={handleWalletTypeSelected}
      />
      <WalletSelectionModal
        isOpen={isStellarModalOpen}
        onClose={closeStellarModal}
        onWalletSelected={handleStellarWalletSelected}
      />
      <MetaMaskWalletModal
        isOpen={isMetaMaskModalOpen}
        onClose={closeMetaMaskModal}
        onWalletConnected={handleMetaMaskSelected}
      />
    </>
  );
}