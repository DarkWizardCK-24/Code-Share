"use client";
import AuthGuard from "@/components/AuthGuard";
import ComparePage from "@/components/ComparePage";

export default function CompareRoute() {
  return (
    <AuthGuard>
      <ComparePage />
    </AuthGuard>
  );
}
