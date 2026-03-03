"use client";
import { useState } from "react";
import { FiTrash2, FiEdit3, FiClock, FiCode, FiAlertTriangle } from "react-icons/fi";
import { LANG_MAP } from "@/lib/languages";
import { timeAgo } from "@/lib/storage";

export default function SnippetCard({ snippet, onClick, onDelete, onEdit, compact }) {
  const lang  = LANG_MAP[snippet.language] ?? LANG_MAP["plaintext"];
  const lines = snippet.code.split("\n").length;
  const [confirmId, setConfirmId] = useState(null);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setConfirmId(snippet.id);
  };

  const handleConfirm = (e) => {
    e.stopPropagation();
    setConfirmId(null);
    onDelete(snippet.id);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setConfirmId(null);
  };

  const confirmOverlay = confirmId && (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute", inset: 0, zIndex: 10,
        background: "rgba(13,17,23,.92)", borderRadius: "inherit",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 12, padding: 16,
      }}
    >
      <FiAlertTriangle size={22} style={{ color: "#FF7B72" }} />
      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--t1)", textAlign: "center" }}>
        Delete this snippet?
      </span>
      <span style={{ fontSize: 11.5, color: "var(--t3)", textAlign: "center" }}>
        This action cannot be undone.
      </span>
      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <button className="btn btn-ghost" onClick={handleCancel} style={{ fontSize: 12, padding: "5px 14px" }}>
          Cancel
        </button>
        <button
          className="btn"
          onClick={handleConfirm}
          style={{
            fontSize: 12, padding: "5px 14px",
            background: "#DA3633", color: "#fff", border: "1px solid #FF7B72",
          }}
        >
          <FiTrash2 size={12} /> Delete
        </button>
      </div>
    </div>
  );

  /* ── Compact card for horizontal scroller ── */
  if (compact) {
    return (
      <div className="snip-card snip-card-compact" onClick={onClick} style={{ position: "relative" }}>
        {confirmOverlay}
        <div className="action-btns" style={{
          position: "absolute", top: 8, right: 8, zIndex: 2,
          display: "flex", gap: 4,
        }}>
          {onEdit && (
            <button
              className="btn btn-icon"
              onClick={(e) => { e.stopPropagation(); onEdit(snippet.id); }}
              title="Edit"
              style={{ background: "transparent", color: "var(--t3)", fontSize: 12 }}
            >
              <FiEdit3 size={12} />
            </button>
          )}
          <button
            className="btn btn-icon"
            onClick={handleDeleteClick}
            title="Delete"
            style={{ background: "transparent", color: "#FF7B72", fontSize: 12 }}
          >
            <FiTrash2 size={12} />
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, position: "relative", zIndex: 1 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: `${lang.color}18`, border: `1px solid ${lang.color}30`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 15, color: lang.color,
          }}>
            <lang.icon />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontWeight: 700, fontSize: 13, color: "var(--t1)",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {snippet.title}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", position: "relative", zIndex: 1 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "2px 8px", borderRadius: 5, fontSize: 10.5, fontWeight: 600,
            background: `${lang.color}12`, color: lang.color, border: `1px solid ${lang.color}25`,
          }}>
            <lang.icon style={{ fontSize: 10 }} />
            {lang.label}
          </span>
          <span style={{ fontSize: 10.5, color: "var(--t3)", display: "flex", alignItems: "center", gap: 3 }}>
            <FiCode size={9} /> {lines}
          </span>
          <span style={{ fontSize: 10.5, color: "var(--t3)", display: "flex", alignItems: "center", gap: 3 }}>
            <FiClock size={9} /> {timeAgo(snippet.createdAt)}
          </span>
        </div>
      </div>
    );
  }

  /* ── Full card for grid view ── */
  const preview = snippet.code.split("\n").slice(0, 5).join("\n");

  return (
    <div className="snip-card" style={{ position: "relative" }}>
      {confirmOverlay}
      <div className="action-btns" style={{
        position: "absolute", top: 10, right: 10, zIndex: 2,
        display: "flex", gap: 4,
      }}>
        {onEdit && (
          <button
            className="btn btn-icon"
            onClick={(e) => { e.stopPropagation(); onEdit(snippet.id); }}
            title="Edit snippet"
            style={{ background: "transparent", color: "var(--t3)", fontSize: 13 }}
          >
            <FiEdit3 />
          </button>
        )}
        <button
          className="btn btn-icon"
          onClick={handleDeleteClick}
          title="Delete snippet"
          style={{ background: "transparent", color: "#FF7B72", fontSize: 13 }}
        >
          <FiTrash2 />
        </button>
      </div>

      <div onClick={onClick} style={{ position: "relative", zIndex: 1, overflow: "hidden", minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, flexShrink: 0,
            background: `${lang.color}18`, border: `1px solid ${lang.color}30`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 17, color: lang.color,
          }}>
            <lang.icon />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontWeight: 700, fontSize: 14, color: "var(--t1)",
              whiteSpace: "nowrap", overflow: "hidden",
              textOverflow: "ellipsis", marginBottom: 4,
            }}>
              {snippet.title}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span className="badge-lang" style={{ fontSize: 11 }}>
                <span style={{ color: lang.color, fontSize: 12, display: "flex" }}><lang.icon /></span>
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

        <div style={{
          background: "#0D1117", borderRadius: 7, overflow: "hidden",
          border: "1px solid var(--border2)", position: "relative",
        }}>
          <div style={{
            padding: "6px 12px", background: "#161B22",
            borderBottom: "1px solid var(--border2)",
            display: "flex", alignItems: "center", gap: 5,
          }}>
            {["#FF5F57", "#FFBD2E", "#28C840"].map((c) => (
              <div key={c} className="dot" style={{ background: c, width: 7, height: 7 }} />
            ))}
          </div>
          <pre style={{
            padding: "12px 14px", margin: 0,
            fontSize: 11.5, lineHeight: 1.65,
            color: "#8B949E", fontFamily: "var(--font-jetbrains), monospace",
            overflow: "hidden", maxHeight: 80, whiteSpace: "pre-wrap",
            wordBreak: "break-all", textOverflow: "ellipsis",
          }}>
            {preview}
          </pre>
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 28,
            background: "linear-gradient(to top, #0D1117, transparent)",
          }} />
        </div>
      </div>
    </div>
  );
}
