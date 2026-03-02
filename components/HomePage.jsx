"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiPlus, FiZap, FiLayers, FiTerminal,
  FiDownload, FiCode, FiGitBranch, FiSearch, FiBox,
} from "react-icons/fi";
import { LANGUAGES } from "@/lib/languages";
import { getAll, deleteById } from "@/lib/storage";
import { useAuth } from "./AuthContext";
import SnippetCard from "./SnippetCard";

export default function HomePage() {
  const router   = useRouter();
  const { user } = useAuth();
  const [snippets, setSnippets] = useState([]);
  const [q,        setQ]        = useState("");
  const [langFilter, setLangFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getAll(user.uid).then((data) => {
      setSnippets(data);
      setLoading(false);
    });
  }, [user]);

  const handleDelete = async (id) => {
    if (!user) return;
    await deleteById(user.uid, id);
    const data = await getAll(user.uid);
    setSnippets(data);
  };

  const langs = [...new Set(snippets.map((s) => s.language))];

  const filtered = snippets.filter((s) => {
    const matchQ = !q || s.title.toLowerCase().includes(q.toLowerCase()) || s.code.toLowerCase().includes(q.toLowerCase());
    const matchL = !langFilter || s.language === langFilter;
    return matchQ && matchL;
  });

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
          padding: "52px 48px", marginTop: 32, marginBottom: 40,
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
            fontSize:"clamp(28px,5vw,48px)", fontWeight:900,
            letterSpacing:"-1px", lineHeight:1.1, marginBottom:16, color:"var(--t1)",
          }}>
            Share code.<br />
            <span style={{ background:"linear-gradient(90deg,#58A6FF,#A371F7)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              Built for developers.
            </span>
          </h1>

          <p className="hero-subtitle" style={{ fontSize:16, color:"var(--t2)", maxWidth:520, lineHeight:1.7, marginBottom:32 }}>
            Paste your code, pick a language, and get a shareable link instantly.
            Real syntax highlighting, file downloads, and {LANGUAGES.length} languages supported.
          </p>

          <div className="hero-actions" style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <button className="btn btn-primary" onClick={() => router.push("/new")} style={{ fontSize:15, padding:"11px 24px" }}>
              <FiPlus size={16} /> New Snippet
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => document.getElementById("snippets-section")?.scrollIntoView({ behavior:"smooth" })}
              style={{ fontSize:15, padding:"11px 24px" }}
            >
              <FiGitBranch size={15} /> View Snippets
            </button>
          </div>

          <div
            className="stat-bar"
            style={{
              display:"flex", marginTop:40, width:"fit-content",
              background:"rgba(0,0,0,.3)", border:"1px solid var(--border2)", borderRadius:10,
            }}
          >
            {[
              { icon:<FiLayers size={14}/>,   val: LANGUAGES.length,  lbl:"Languages" },
              { icon:<FiTerminal size={14}/>,  val: snippets.length,   lbl:"Your Snippets" },
              { icon:<FiDownload size={14}/>,  val: "\u2713",         lbl:"File Download" },
              { icon:<FiCode size={14}/>,      val: "\u2713",         lbl:"Syntax Highlight" },
            ].map((s) => (
              <div key={s.lbl} className="stat-item">
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
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:12 }}>
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
            <div className="filter-bar" style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <div style={{ position:"relative", flex:"1 1 180px" }}>
                <FiSearch style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"var(--t3)", fontSize:14 }} />
                <input className="inp" placeholder="Search…" value={q} onChange={(e)=>setQ(e.target.value)} style={{ paddingLeft:32, width:"100%", fontSize:13 }} />
              </div>
              <select className="inp" value={langFilter} onChange={(e)=>setLangFilter(e.target.value)} style={{ width:160, fontSize:13, flex:"0 1 160px" }}>
                <option value="">All languages</option>
                {langs.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign:"center", padding:"60px 24px", color:"var(--t3)", fontSize:14 }}>
            <span style={{ animation:"pulse 1.5s infinite" }}>Loading snippets...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign:"center", padding:"80px 24px",
            background:"var(--bg2)", border:"1px dashed var(--border)", borderRadius:16,
          }}>
            <div style={{
              width:72,height:72,borderRadius:16, background:"var(--bg3)",
              display:"flex",alignItems:"center",justifyContent:"center",
              margin:"0 auto 20px", fontSize:28, color:"var(--t3)",
            }}>
              {snippets.length === 0 ? <FiCode /> : <FiSearch />}
            </div>
            <h3 style={{ fontWeight:700, fontSize:17, color:"var(--t1)", marginBottom:8 }}>
              {snippets.length === 0 ? "No snippets yet" : "No matching snippets"}
            </h3>
            <p style={{ color:"var(--t2)", fontSize:14, marginBottom:24, maxWidth:320, margin:"0 auto 24px" }}>
              {snippets.length === 0 ? "Create your first snippet to see it here." : "Try a different search."}
            </p>
            {snippets.length === 0 && (
              <button className="btn btn-primary" onClick={()=>router.push("/new")}>
                <FiPlus size={15} /> Create Snippet
              </button>
            )}
          </div>
        ) : (
          <div className="snip-grid">
            {filtered.map((s, i) => (
              <div key={s.id} className="card-enter" style={{ animationDelay:`${i*40}ms` }}>
                <SnippetCard
                  snippet={s}
                  onClick={() => router.push(`/snippet/${s.id}`)}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
