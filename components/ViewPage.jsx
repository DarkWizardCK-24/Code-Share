"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  FiCopy, FiCheck, FiDownload, FiShare2,
  FiClock, FiCode, FiHash, FiLink, FiPlus, FiArrowLeft, FiFileText,
} from "react-icons/fi";
import { LANG_MAP } from "@/lib/languages";
import { byId, timeAgo, downloadFile } from "@/lib/storage";
import { copyText } from "@/lib/clipboard";
import CodeDisplay from "./CodeDisplay";
import Toast from "./Toast";

export default function ViewPage({ id }) {
  const router  = useRouter();
  const [snippet,    setSnippet]    = useState(null);
  const [notFound,   setNotFound]   = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [toast,      setToast]      = useState(null);
  const toastTimer = useRef(null);

  const showToast = useCallback((msg, type = "success") => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    byId(id).then((s) => {
      if (s) setSnippet(s);
      else   setNotFound(true);
    });
  }, [id]);

  if (notFound) return (
    <div className="page-enter" style={{ maxWidth:600, margin:"80px auto", padding:"0 24px", textAlign:"center" }}>
      <div style={{ fontSize:56, marginBottom:16 }}>🔍</div>
      <h2 style={{ fontSize:22, fontWeight:800, marginBottom:10 }}>Snippet not found</h2>
      <p style={{ color:"var(--t2)", marginBottom:24 }}>This snippet doesn&apos;t exist or was deleted.</p>
      <button className="btn btn-primary" onClick={()=>router.push("/")}>Back to Home</button>
    </div>
  );

  if (!snippet) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:300, color:"var(--t3)", fontSize:14 }}>
      <span style={{ animation:"pulse 1.5s infinite" }}>Loading…</span>
    </div>
  );

  const lang      = LANG_MAP[snippet.language] ?? LANG_MAP["plaintext"];
  const lines     = snippet.code.split("\n").length;
  const shareUrl  = `${typeof window !== "undefined" ? window.location.origin : ""}/snippet/${snippet.id}`;

  const copyLink = () => {
    copyText(shareUrl);
    setLinkCopied(true);
    showToast("Share link copied to clipboard!");
    setTimeout(() => setLinkCopied(false), 2500);
  };

  const copyCode = () => {
    copyText(snippet.code);
    setCodeCopied(true);
    showToast("Code copied!");
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const download = () => {
    const name = downloadFile(snippet.code, snippet.filename, lang.ext);
    showToast(`Downloaded as ${name}`);
  };

  return (
    <div className="page-enter page-inner" style={{ maxWidth:1000, margin:"0 auto", padding:"36px 24px 80px" }}>
      <button className="btn btn-ghost" onClick={()=>router.push("/")} style={{ marginBottom:20 }}>
        <FiArrowLeft size={14} /> All Snippets
      </button>

      <div className="snippet-header" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24, flexWrap:"wrap", gap:16 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, color:"var(--t1)", letterSpacing:"-.4px", marginBottom:10 }}>
            {snippet.title}
          </h1>
          <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
            <span className="badge-lang">
              <span style={{ color:lang.color, fontSize:14, display:"flex" }}><lang.icon /></span>
              {lang.label}
            </span>
            {snippet.filename && (
              <span style={{ fontSize:12, color:"var(--t3)", fontFamily:"var(--font-jetbrains),monospace" }}>
                {snippet.filename}.{lang.ext}
              </span>
            )}
            <span style={{ fontSize:12, color:"var(--t3)", display:"flex", alignItems:"center", gap:4 }}>
              <FiCode size={11} /> {lines} lines
            </span>
            <span style={{ fontSize:12, color:"var(--t3)", display:"flex", alignItems:"center", gap:4 }}>
              <FiClock size={11} /> {timeAgo(snippet.createdAt)}
            </span>
          </div>
        </div>

        <div className="snippet-actions" style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <button className="btn btn-secondary" onClick={copyCode}>
            {codeCopied ? <FiCheck size={14} style={{ color:"var(--green)" }} /> : <FiCopy size={14} />}
            {codeCopied ? "Copied!" : "Copy Code"}
          </button>
          <button className="btn btn-secondary" onClick={download}>
            <FiDownload size={14} /> .{lang.ext}
          </button>
          <button className="btn btn-primary" onClick={copyLink}>
            {linkCopied ? <FiCheck size={14} /> : <FiShare2 size={14} />}
            {linkCopied ? "Copied!" : "Share Link"}
          </button>
        </div>
      </div>

      <div className="share-bar" style={{
        background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:10,
        padding:"12px 16px", marginBottom:24,
        display:"flex", alignItems:"center", gap:12, flexWrap:"wrap",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, color:"var(--t3)", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:".4px", flexShrink:0 }}>
          <FiLink size={12} /> Snippet URL
        </div>
        <div className="url-box" style={{ flex:1, minWidth:0 }}>
          <span style={{ fontFamily:"var(--font-jetbrains),monospace", fontSize:12, color:"var(--t2)" }}>
            /snippet/<span style={{ color:"var(--accent)" }}>{snippet.id}</span>
          </span>
        </div>
        <button className="btn btn-secondary" onClick={copyLink} style={{ flexShrink:0 }}>
          {linkCopied
            ? <><FiCheck size={13} style={{ color:"var(--green)" }} /> Copied</>
            : <><FiCopy size={13} /> Copy</>}
        </button>
      </div>

      {snippet.notes && (
        <div style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: "16px 20px",
          marginBottom: 20,
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 7,
            marginBottom: 10, color: "var(--t3)",
            fontSize: 11, fontWeight: 700,
            textTransform: "uppercase", letterSpacing: ".4px",
          }}>
            <FiFileText size={12} /> Notes &amp; Instructions
          </div>
          <p style={{
            margin: 0, whiteSpace: "pre-wrap", fontSize: 13.5,
            color: "var(--t2)", lineHeight: 1.7,
          }}>
            {snippet.notes}
          </p>
        </div>
      )}

      <CodeDisplay
        code={snippet.code}
        language={snippet.language}
        filename={snippet.filename}
        onDownload={download}
      />

      <div className="bottom-actions" style={{ marginTop:20, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
        <span style={{ fontSize:12, color:"var(--t3)", display:"flex", alignItems:"center", gap:5 }}>
          <FiHash size={11} /> ID:{" "}
          <code style={{ fontFamily:"var(--font-jetbrains),monospace", color:"var(--t2)", fontSize:12 }}>
            {snippet.id}
          </code>
          &nbsp;·&nbsp; {snippet.code.length.toLocaleString()} characters
        </span>
        <button className="btn btn-secondary" onClick={()=>router.push("/new")} style={{ fontSize:13 }}>
          <FiPlus size={13} /> New Snippet
        </button>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}
