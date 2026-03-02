"use client";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }) {
  const { user, loading, configured } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && configured) {
      router.push("/login");
    }
  }, [user, loading, configured, router]);

  // If Firebase is not configured, let the app work without auth
  if (!configured) return children;

  if (loading) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: 300, color: "var(--t3)", fontSize: 14,
      }}>
        <span style={{ animation: "pulse 1.5s infinite" }}>Loading...</span>
      </div>
    );
  }

  if (!user) return null;

  return children;
}
