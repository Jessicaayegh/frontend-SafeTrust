import { test, expect, expectPathname, waitForHydration } from "./fixtures";
import { MOCK_USERS, mockFirebaseAuth } from "./support/mock-auth";

const walletElements = [
  "stellar-wallets-modal",
  "stellar-wallets-button",
  "stellar-accounts-selector",
];

test("wallet elements load only when the wallet picker is requested", async ({
  page,
}) => {
  await page.goto("/login");
  await waitForHydration(page.locator("form"));
  const registered = () =>
    page.evaluate(
      (names) => names.filter((name) => Boolean(customElements.get(name))),
      walletElements,
    );
  expect(await registered()).toEqual([]);
  await page.getByRole("button", { name: "Other Stellar wallets" }).click();
  await expect.poll(registered).toEqual(walletElements);
  await expect(
    page.getByText("Choose a Stellar wallet", { exact: true }),
  ).toBeVisible();
});

for (const wallet of [
  { name: "xBull", walletId: "xbull" },
  { name: "LOBSTR", walletId: "lobstr" },
]) {
  test(`${wallet.name} metadata survives login and a dashboard refresh without granting authentication`, async ({
    page,
    isMobile,
  }) => {
    const address = "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF";
    await mockFirebaseAuth(page);
    await page.addInitScript(
      ({ address, wallet }) => {
        if (!localStorage.getItem("safetrust-wallet")) {
          localStorage.setItem(
            "safetrust-wallet",
            JSON.stringify({
              state: { address, ...wallet },
              version: 0,
            }),
          );
        }
      },
      { address, wallet },
    );
    await page.goto("/login?redirect=/dashboard/escrow-dashboard");
    await waitForHydration(page.locator("form"));
    // Stored wallet hints cannot replace a verified Firebase session.
    await expect(page).toHaveURL(/\/login\?redirect=/);
    await page.getByLabel("Email").fill(MOCK_USERS.guest.email);
    await page.getByLabel("Password").fill(MOCK_USERS.guest.password);
    await page.getByRole("button", { name: "Login", exact: true }).click();
    // Wait for the real redirect: `/login?redirect=/dashboard/escrow-dashboard`
    // also ends with the target path, and reloading the login page mid-sign-in
    // aborts the login.
    await expectPathname(page, "/dashboard/escrow-dashboard");
    await expect(
      page.getByRole("heading", { name: "Escrow Dashboard", exact: true }),
    ).toBeVisible();
    await page.reload();
    await expectPathname(page, "/dashboard/escrow-dashboard");
    await expect
      .poll(() =>
        page.evaluate(
          () => JSON.parse(localStorage.getItem("safetrust-wallet")!).state,
        ),
      )
      .toEqual({ address, ...wallet });
    if (!isMobile) {
      await expect(page.getByTestId("header-wallet-address")).toHaveAttribute(
        "title",
        address,
      );
      await expect(page.getByTestId("header-wallet-address")).toBeVisible();
    }
  });
}
