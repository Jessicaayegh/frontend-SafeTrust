import { Suspense } from "react";
import type { Metadata } from "next";
import Register from "@/components/auth/Register";

export const metadata: Metadata = { title: "Create account" };

export default function Page() {
  return (
    <Suspense>
      <Register />
    </Suspense>
  );
}
