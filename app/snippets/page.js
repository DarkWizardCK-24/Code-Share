"use client";
import AuthGuard from "@/components/AuthGuard";
import AllSnippetsPage from "@/components/AllSnippetsPage";

export default function SnippetsRoute() {
  return (
    <AuthGuard>
      <AllSnippetsPage />
    </AuthGuard>
  );
}
