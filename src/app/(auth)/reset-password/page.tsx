import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordShell } from "@/features/auth/components/ResetPasswordShell";

export const metadata: Metadata = { title: "Reset password" };

export default function Page() {
  return (
    <Suspense>
      <ResetPasswordShell />
    </Suspense>
  );
}
