import { render, screen } from "@testing-library/react";
import EscrowCreatePage from "./page";

jest.mock("@/features/escrow", () => ({
  RentCheckout: ({
    initialCheckIn,
    initialCheckOut,
  }: {
    initialCheckIn?: string;
    initialCheckOut?: string;
  }) => (
    <div data-testid="checkout-dates">
      {initialCheckIn ?? "no check-in"}|{initialCheckOut ?? "no check-out"}
    </div>
  ),
}));

const params = Promise.resolve({ id: "1" });

describe("EscrowCreatePage query dates", () => {
  it("passes single date values to the checkout", async () => {
    const page = await EscrowCreatePage({
      params,
      searchParams: Promise.resolve({
        checkIn: "2030-01-10",
        checkOut: "2030-01-12",
      }),
    });

    render(page);
    expect(screen.getByTestId("checkout-dates")).toHaveTextContent(
      "2030-01-10|2030-01-12",
    );
  });

  it("ignores repeated date parameters instead of passing arrays to the picker", async () => {
    const page = await EscrowCreatePage({
      params,
      searchParams: Promise.resolve({
        checkIn: ["2030-01-10", "2030-01-11"],
        checkOut: ["2030-01-12", "2030-01-13"],
      }),
    });

    render(page);
    expect(screen.getByTestId("checkout-dates")).toHaveTextContent(
      "no check-in|no check-out",
    );
  });
});
