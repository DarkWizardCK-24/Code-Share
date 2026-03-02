"use client";
import { useState, useEffect, useRef } from "react";
import { LANGUAGES, LANG_MAP } from "@/lib/languages";

export default function LangSelector({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [q,    setQ]    = useState("");
  const ref = useRef(null);
  const lang = LANG_MAP[value];

  const filtered = LANGUAGES.filter((l) =>
    l.label.toLowerCase().includes(q.toLowerCase())
  );

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          width: "100%",
          background: "var(--bg2)",
          border: `1px solid ${open ? "var(--accent)" : "var(--border)"}`,
          borderRadius: 8,
          padding: "9px 14px",
          cursor: "pointer",
          color: "var(--t1)",
          fontFamily: "var(--font-montserrat), sans-serif",
          fontSize: 13.5,
          fontWeight: 600,
          transition: "border-color .2s",
        }}
      >
        {lang && (
          <span style={{ color: lang.color, fontSize: 16, display: "flex" }}>
            <lang.icon />
          </span>
        )}
        <span style={{ flex: 1, textAlign: "left" }}>{lang?.label ?? "Select language"}</span>
        <span style={{ color: "var(--t3)", fontSize: 11 }}>▾</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            zIndex: 300,
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            overflow: "hidden",
            boxShadow: "0 16px 48px rgba(0,0,0,.5)",
            animation: "popIn .15s ease both",
          }}
        >
          <div style={{ padding: "8px 8px 4px" }}>
            <input
              className="inp"
              placeholder="Search language…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{ background: "var(--bg3)", fontSize: 13 }}
              autoFocus
            />
          </div>
          <div className="lang-grid">
            {filtered.map((l) => (
              <div
                key={l.id}
                className={`lang-option ${value === l.id ? "selected" : ""}`}
                onClick={() => {
                  onChange(l.id);
                  setOpen(false);
                  setQ("");
                }}
              >
                <span style={{ color: l.color, fontSize: 15, display: "flex", flexShrink: 0 }}>
                  <l.icon />
                </span>
                {l.label}
              </div>
            ))}
            {filtered.length === 0 && (
              <div
                style={{
                  padding: "12px",
                  color: "var(--t3)",
                  fontSize: 13,
                  gridColumn: "1 / -1",
                }}
              >
                No results
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
