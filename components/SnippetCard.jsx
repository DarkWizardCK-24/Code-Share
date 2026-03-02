"use client";
import { FiTrash2, FiClock, FiCode } from "react-icons/fi";
import { LANG_MAP } from "@/lib/languages";
import { timeAgo } from "@/lib/storage";

export default function SnippetCard({ snippet, onClick, onDelete }) {
  const lang    = LANG_MAP[snippet.language] ?? LANG_MAP["plaintext"];
  const lines   = snippet.code.split("\n").length;
  const preview = snippet.code.split("\n").slice(0, 5).join("\n");

  return (
    <div className="snip-card">
      {/* Hover-reveal delete */}
      <button
        className="btn btn-icon delete-btn"
        onClick={(e) => { e.stopPropagation(); onDelete(snippet.id); }}
        title="Delete snippet"
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 2,
          background: "transparent",
          color: "var(--t3)",
          fontSize: 13,
          opacity: 0,
          transition: "opacity .2s",
        }}
      >
        <FiTrash2 />
      </button>

      <div onClick={onClick} style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
          <div
            style={{
              width: 36, height: 36, borderRadius: 8, flexShrink: 0,
              background: `${lang.color}18`,
              border: `1px solid ${lang.color}30`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 17, color: lang.color,
            }}
          >
            <lang.icon />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontWeight: 700, fontSize: 14, color: "var(--t1)",
                whiteSpace: "nowrap", overflow: "hidden",
                textOverflow: "ellipsis", marginBottom: 4,
              }}
            >
              {snippet.title}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span className="badge-lang" style={{ fontSize: 11 }}>
                <span style={{ color: lang.color, fontSize: 12, display: "flex" }}>
                  <lang.icon />
                </span>
                {lang.label}
              </span>
              <span style={{ fontSize: 11, color: "var(--t3)", display: "flex", alignItems: "center", gap: 3 }}>
                <FiCode size={10} /> {lines} lines
              </span>
              <span style={{ fontSize: 11, color: "var(--t3)", display: "flex", alignItems: "center", gap: 3 }}>
                <FiClock size={10} /> {timeAgo(snippet.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Code preview */}
        <div
          style={{
            background: "#0D1117", borderRadius: 7, overflow: "hidden",
            border: "1px solid var(--border2)", position: "relative",
          }}
        >
          <div
            style={{
              padding: "6px 12px", background: "#161B22",
              borderBottom: "1px solid var(--border2)",
              display: "flex", alignItems: "center", gap: 5,
            }}
          >
            {["#FF5F57", "#FFBD2E", "#28C840"].map((c) => (
              <div key={c} className="dot" style={{ background: c, width: 7, height: 7 }} />
            ))}
          </div>
          <pre
            style={{
              padding: "12px 14px", margin: 0,
              fontSize: 11.5, lineHeight: 1.65,
              color: "#8B949E", fontFamily: "var(--font-jetbrains), monospace",
              overflow: "hidden", maxHeight: 80, whiteSpace: "pre",
            }}
          >
            {preview}
          </pre>
          <div
            style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: 28,
              background: "linear-gradient(to top, #0D1117, transparent)",
            }}
          />
        </div>
      </div>

      <style>{`.snip-card:hover .delete-btn { opacity: 1 !important; }`}</style>
    </div>
  );
}
