"use client";
import AuthGuard from "@/components/AuthGuard";
import NewPage from "@/components/NewPage";

export default function NewSnippet() {
  return (
    <AuthGuard>
      <NewPage />
    </AuthGuard>
  );
}
