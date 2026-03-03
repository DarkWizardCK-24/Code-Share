"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  FiPlus, FiSearch, FiBox, FiCode,
  FiChevronDown, FiX, FiArrowLeft,
} from "react-icons/fi";
import { LANG_MAP } from "@/lib/languages";
import { getAll, deleteById } from "@/lib/storage";
import { useAuth } from "./AuthContext";
import SnippetCard from "./SnippetCard";

export default function AllSnippetsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [snippets, setSnippets] = useState([]);
  const [q, setQ] = useState("");
  const [langFilter, setLangFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getAll(user.uid)
      .then(setSnippets)
      .catch((err) => console.error("Failed to load snippets:", err))
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async (id) => {
    if (!user) return;
    try {
      await deleteById(user.uid, id);
      setSnippets(await getAll(user.uid));
    } catch (err) {
      console.error("Failed to delete snippet:", err);
    }
  };

  const handleEdit = (id) => router.push(`/snippet/${id}/edit`);

  const langs = [...new Set(snippets.map((s) => s.language))];
  const filtered = snippets.filter((s) => {
    const matchQ = !q || s.title.toLowerCase().includes(q.toLowerCase()) || s.code.toLowerCase().includes(q.toLowerCase());
    const matchL = !langFilter || s.language === langFilter;
    return matchQ && matchL;
  });

  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="page-enter page-container" style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 24px 80px" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <button className="btn btn-ghost" onClick={() => router.push("/")} style={{ marginBottom: 16 }}>
          <FiArrowLeft size={14} /> Back to Home
        </button>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--t1)", display: "flex", alignItems: "center", gap: 10 }}>
            <FiBox size={18} style={{ color: "var(--accent)" }} />
            All Snippets
            {snippets.length > 0 && (
              <span style={{ background: "var(--bg3)", borderRadius: 20, padding: "2px 10px", fontSize: 13, color: "var(--t3)", fontWeight: 700 }}>
                {snippets.length}
              </span>
            )}
          </h1>
          <button className="btn btn-primary" onClick={() => router.push("/new")} style={{ fontSize: 13 }}>
            <FiPlus size={15} /> New Snippet
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--t3)", fontSize: 14 }}>
          <span style={{ animation: "pulse 1.5s infinite" }}>Loading snippets...</span>
        </div>
      ) : snippets.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px 20px",
          background: "var(--bg2)", border: "1px dashed var(--border)", borderRadius: 16,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 14, background: "var(--bg3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", fontSize: 26, color: "var(--t3)",
          }}>
            <FiCode />
          </div>
          <h3 style={{ fontWeight: 700, fontSize: 16, color: "var(--t1)", marginBottom: 8 }}>No snippets yet</h3>
          <p style={{ color: "var(--t2)", fontSize: 13.5, maxWidth: 300, margin: "0 auto 20px" }}>
            Create your first snippet to see it here.
          </p>
          <button className="btn btn-primary" onClick={() => router.push("/new")}>
            <FiPlus size={15} /> Create Snippet
          </button>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="filter-bar" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            <div style={{ position: "relative", flex: "1 1 180px", minWidth: 0 }}>
              <FiSearch style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--t3)", fontSize: 14 }} />
              <input className="inp" placeholder="Search snippets..." value={q} onChange={(e) => setQ(e.target.value)} style={{ paddingLeft: 32, width: "100%", fontSize: 13 }} />
            </div>
            <div ref={langRef} style={{ position: "relative", flex: "0 1 180px", minWidth: 0 }}>
              <button
                type="button"
                onClick={() => setLangOpen(!langOpen)}
                className="inp"
                style={{
                  display: "flex", alignItems: "center", gap: 8, width: "100%",
                  fontSize: 13, cursor: "pointer", textAlign: "left", padding: "8px 12px",
                }}
              >
                {langFilter && LANG_MAP[langFilter] ? (
                  <>
                    <span style={{ color: LANG_MAP[langFilter].color, fontSize: 14, display: "flex", flexShrink: 0 }}>
                      {(() => { const Icon = LANG_MAP[langFilter].icon; return <Icon />; })()}
                    </span>
                    <span style={{ flex: 1, color: "var(--t1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{LANG_MAP[langFilter].label}</span>
                    <span
                      onClick={(e) => { e.stopPropagation(); setLangFilter(""); setLangOpen(false); }}
                      style={{ color: "var(--t3)", display: "flex", cursor: "pointer", flexShrink: 0 }}
                    >
                      <FiX size={13} />
                    </span>
                  </>
                ) : (
                  <>
                    <span style={{ flex: 1, color: "var(--t3)" }}>All languages</span>
                    <FiChevronDown size={13} style={{ color: "var(--t3)", flexShrink: 0 }} />
                  </>
                )}
              </button>
              {langOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
                  zIndex: 300, background: "var(--bg2)", border: "1px solid var(--border)",
                  borderRadius: 10, overflow: "hidden",
                  boxShadow: "0 16px 48px rgba(0,0,0,.5)",
                  animation: "popIn .15s ease both",
                }}>
                  <div style={{ maxHeight: 220, overflowY: "auto", padding: 6 }}>
                    <div
                      className={`lang-option ${!langFilter ? "selected" : ""}`}
                      onClick={() => { setLangFilter(""); setLangOpen(false); }}
                    >
                      All languages
                    </div>
                    {langs.map((l) => {
                      const info = LANG_MAP[l];
                      if (!info) return null;
                      return (
                        <div
                          key={l}
                          className={`lang-option ${langFilter === l ? "selected" : ""}`}
                          onClick={() => { setLangFilter(l); setLangOpen(false); }}
                        >
                          <span style={{ color: info.color, fontSize: 14, display: "flex", flexShrink: 0 }}>
                            <info.icon />
                          </span>
                          {info.label}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "48px 20px",
              background: "var(--bg2)", border: "1px dashed var(--border)", borderRadius: 16,
            }}>
              <FiSearch size={24} style={{ color: "var(--t3)", marginBottom: 12 }} />
              <h3 style={{ fontWeight: 700, fontSize: 15, color: "var(--t1)", marginBottom: 6 }}>No matching snippets</h3>
              <p style={{ color: "var(--t2)", fontSize: 13 }}>Try a different search or filter.</p>
            </div>
          ) : (
            <div className="snip-grid">
              {filtered.map((s, i) => (
                <div key={s.id} className="card-enter" style={{ animationDelay: `${i * 40}ms` }}>
                  <SnippetCard
                    snippet={s}
                    onClick={() => router.push(`/snippet/${s.id}`)}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
