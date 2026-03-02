"use client";
import { SiJavascript, SiPython, SiRust, SiFlutter, SiGo } from "react-icons/si";
import { LANGUAGES } from "@/lib/languages";
import Logo from "./Logo";

const FEATURED = [
  { label: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
  { label: "Python",     icon: SiPython,     color: "#3572A5" },
  { label: "Rust",       icon: SiRust,       color: "#DEA584" },
  { label: "Flutter",    icon: SiFlutter,    color: "#54C5F8" },
  { label: "Go",         icon: SiGo,         color: "#00ADD8" },
];

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border2)",
        background: "var(--bg2)",
        padding: "24px 0",
        marginTop: "auto",
      }}
    >
      <div
        className="footer-inner"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <Logo />
        <div className="footer-langs" style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
          {FEATURED.map(({ label, icon: Icon, color }) => (
            <span
              key={label}
              style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--t3)" }}
            >
              <Icon style={{ color }} />
              {label}
            </span>
          ))}
          <span style={{ fontSize: 11, color: "var(--t3)" }}>
            +{LANGUAGES.length - FEATURED.length} more
          </span>
        </div>
      </div>
    </footer>
  );
}
