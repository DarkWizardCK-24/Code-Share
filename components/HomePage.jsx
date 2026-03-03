"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  FiPlus, FiZap, FiLayers, FiTerminal,
  FiDownload, FiCode, FiGitBranch, FiBox,
  FiChevronLeft, FiChevronRight, FiGrid,
} from "react-icons/fi";
import { LANGUAGES } from "@/lib/languages";
import { getAll, deleteById } from "@/lib/storage";
import { useAuth } from "./AuthContext";
import SnippetCard from "./SnippetCard";

export default function HomePage() {
  const router   = useRouter();
  const { user } = useAuth();
  const [snippets, setSnippets] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [canScrollL, setCanScrollL] = useState(false);
  const [canScrollR, setCanScrollR] = useState(false);

  const scrollRef  = useRef(null);

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

  /* ── Horizontal scroll state ── */
  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollL(el.scrollLeft > 4);
    setCanScrollR(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollButtons();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    const ro = new ResizeObserver(updateScrollButtons);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", updateScrollButtons); ro.disconnect(); };
  }, [updateScrollButtons, snippets, loading]);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <div
      className="page-enter page-container"
      style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 80px" }}
    >
      {/* ── Hero ── */}
      <div
        className="hero-section"
        style={{
          position: "relative", borderRadius: 16, overflow: "hidden",
          background: "linear-gradient(135deg,#161B22 0%,#1C2333 60%,#161B22 100%)",
          border: "1px solid var(--border)",
          padding: "48px 40px", marginTop: 32, marginBottom: 40,
        }}
      >
        <div className="hero-bg">
          <div className="hero-orb" style={{ width:400,height:400,background:"#1F6FEB",top:-120,right:-60,opacity:.12 }} />
          <div className="hero-orb" style={{ width:300,height:300,background:"#A371F7",bottom:-80,left:80,opacity:.10 }} />
          <div className="hero-orb" style={{ width:200,height:200,background:"#3FB950",top:20,left:"40%",opacity:.07 }} />
        </div>
        <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",opacity:.03 }}>
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth=".5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display:"inline-flex", alignItems:"center", gap:8,
            background:"rgba(88,166,255,.1)", border:"1px solid rgba(88,166,255,.2)",
            borderRadius:20, padding:"5px 14px", marginBottom:20,
          }}>
            <FiZap size={12} style={{ color:"var(--accent)" }} />
            <span style={{ fontSize:12,fontWeight:700,color:"var(--accent)",letterSpacing:".5px" }}>
              INSTANT CODE SHARING
            </span>
          </div>

          <h1 className="hero-title" style={{
            fontSize:"clamp(24px,5vw,48px)", fontWeight:900,
            letterSpacing:"-1px", lineHeight:1.1, marginBottom:16, color:"var(--t1)",
          }}>
            Share code.<br />
            <span style={{ background:"linear-gradient(90deg,#58A6FF,#A371F7)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              Built for developers.
            </span>
          </h1>

          <p className="hero-subtitle" style={{ fontSize:15, color:"var(--t2)", maxWidth:520, lineHeight:1.7, marginBottom:28 }}>
            Paste your code, pick a language, and get a shareable link instantly.
            Real syntax highlighting, file downloads, and {LANGUAGES.length} languages supported.
          </p>

          <div className="hero-actions" style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <button className="btn btn-primary" onClick={() => router.push("/new")} style={{ fontSize:15, padding:"11px 24px" }}>
              <FiPlus size={16} /> New Snippet
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => router.push("/snippets")}
              style={{ fontSize:15, padding:"11px 24px" }}
            >
              <FiGitBranch size={15} /> View Snippets
            </button>
          </div>

          <div
            className="stat-bar"
            style={{
              display:"flex", marginTop:36,
              background:"rgba(0,0,0,.3)", border:"1px solid var(--border2)", borderRadius:10,
              width: "100%", maxWidth: 480,
            }}
          >
            {[
              { icon:<FiLayers size={14}/>,   val: LANGUAGES.length,  lbl:"Languages" },
              { icon:<FiTerminal size={14}/>,  val: snippets.length,   lbl:"Snippets" },
              { icon:<FiDownload size={14}/>,  val: "\u2713",         lbl:"Download" },
              { icon:<FiCode size={14}/>,      val: "\u2713",         lbl:"Highlighting" },
            ].map((s) => (
              <div key={s.lbl} className="stat-item" style={{ flex: 1 }}>
                <span style={{ color:"var(--accent)", display:"flex", alignItems:"center", gap:5 }}>
                  {s.icon} <strong style={{ fontSize:16, fontWeight:800 }}>{s.val}</strong>
                </span>
                <span style={{ fontSize:10, color:"var(--t3)", fontWeight:600, textTransform:"uppercase", letterSpacing:".4px" }}>
                  {s.lbl}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Snippets section ── */}
      <div id="snippets-section">
        {/* Header row */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, gap:12, flexWrap:"wrap" }}>
          <h2 style={{ fontSize:18, fontWeight:800, color:"var(--t1)", display:"flex", alignItems:"center", gap:8 }}>
            <FiBox size={16} style={{ color:"var(--accent)" }} />
            Your Snippets
            {snippets.length > 0 && (
              <span style={{ background:"var(--bg3)", borderRadius:20, padding:"2px 9px", fontSize:12, color:"var(--t3)", fontWeight:700 }}>
                {snippets.length}
              </span>
            )}
          </h2>

          {snippets.length > 0 && (
            <button
              className="btn btn-secondary"
              onClick={() => router.push("/snippets")}
              style={{ fontSize: 12.5, padding: "6px 14px" }}
            >
              <FiGrid size={13} />
              View All
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign:"center", padding:"60px 20px", color:"var(--t3)", fontSize:14 }}>
            <span style={{ animation:"pulse 1.5s infinite" }}>Loading snippets...</span>
          </div>
        ) : snippets.length === 0 ? (
          <div style={{
            textAlign:"center", padding:"60px 20px",
            background:"var(--bg2)", border:"1px dashed var(--border)", borderRadius:16,
          }}>
            <div style={{
              width:64,height:64,borderRadius:14, background:"var(--bg3)",
              display:"flex",alignItems:"center",justifyContent:"center",
              margin:"0 auto 16px", fontSize:26, color:"var(--t3)",
            }}>
              <FiCode />
            </div>
            <h3 style={{ fontWeight:700, fontSize:16, color:"var(--t1)", marginBottom:8 }}>No snippets yet</h3>
            <p style={{ color:"var(--t2)", fontSize:13.5, maxWidth:300, margin:"0 auto 20px" }}>
              Create your first snippet to see it here.
            </p>
            <button className="btn btn-primary" onClick={()=>router.push("/new")}>
              <FiPlus size={15} /> Create Snippet
            </button>
          </div>
        ) : (
          /* ── Horizontal scroller ── */
          <div style={{ position: "relative" }}>
            {/* Left chevron */}
            {canScrollL && (
              <button
                onClick={() => scroll("left")}
                className="scroll-chevron scroll-chevron-left"
                aria-label="Scroll left"
              >
                <FiChevronLeft size={20} />
              </button>
            )}

            {/* Right chevron */}
            {canScrollR && (
              <button
                onClick={() => scroll("right")}
                className="scroll-chevron scroll-chevron-right"
                aria-label="Scroll right"
              >
                <FiChevronRight size={20} />
              </button>
            )}

            {/* Scroll track */}
            <div ref={scrollRef} className="snip-scroll-track">
              {snippets.map((s) => (
                <div key={s.id} className="snip-scroll-item">
                  <SnippetCard
                    snippet={s}
                    compact
                    onClick={() => router.push(`/snippet/${s.id}`)}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
