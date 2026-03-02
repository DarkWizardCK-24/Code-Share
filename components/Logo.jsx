"use client";
import { useRouter } from "next/navigation";

export default function Logo({ onClick }) {
  const router = useRouter();
  const handleClick = onClick ?? (() => router.push("/"));

  return (
    <div className="logo" onClick={handleClick} role="button" aria-label="Go to home">
      <div className="logo-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M8 6L3 12L8 18"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 6L21 12L16 18"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13 4L11 20"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span className="logo-text">
        Code<span>Share</span>
      </span>
    </div>
  );
}
