"use client";
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  FiEdit3, FiEye, FiShare2, FiDownload,
  FiArrowLeft, FiHash, FiCode, FiLayers,
} from "react-icons/fi";
import { LANG_MAP } from "@/lib/languages";
import { uid, persist, downloadFile } from "@/lib/storage";
import { useAuth } from "./AuthContext";
import LangSelector from "./LangSelector";
import CodeDisplay from "./CodeDisplay";
import Toast from "./Toast";

export default function NewPage() {
  const router   = useRouter();
  const { user } = useAuth();
  const [title,    setTitle]    = useState("");
  const [filename, setFilename] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [code,     setCode]     = useState("");
  const [tab,      setTab]      = useState("write");
  const [toast,    setToast]    = useState(null);
  const toastTimer = useRef(null);

  const lang = LANG_MAP[language] ?? LANG_MAP["plaintext"];

  const showToast = useCallback((msg, type = "success") => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const handleTab = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const s    = e.target.selectionStart;
      const end  = e.target.selectionEnd;
      const next = code.substring(0, s) + "  " + code.substring(end);
      setCode(next);
      setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = s + 2; }, 0);
    }
  };

  const download = () => {
    if (!code.trim()) { showToast("Nothing to download.", "error"); return; }
    const name = downloadFile(code, filename, lang.ext);
    showToast(`Downloaded as ${name}`);
  };

  const create = async () => {
    if (!code.trim()) { showToast("Please add some code first.", "error"); return; }
    if (!user) { showToast("You must be signed in.", "error"); return; }
    const s = {
      id: uid(),
      ownerId: user.uid,
      title: title.trim() || "Untitled Snippet",
      filename: filename.trim(),
      language,
      code,
      createdAt: Date.now(),
    };
    await persist(user.uid, s);
    showToast("Snippet created & ready to share!");
    router.push(`/snippet/${s.id}`);
  };

  return (
    <div className="page-enter page-inner" style={{ maxWidth:1000, margin:"0 auto", padding:"36px 24px 80px" }}>
      <div style={{ marginBottom:28 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
          <div style={{
            width:36, height:36, borderRadius:9,
            background:"linear-gradient(135deg,#1F6FEB,#A371F7)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:16, color:"#fff",
          }}>
            <FiEdit3 />
          </div>
          <h1 style={{ fontSize:22, fontWeight:800, color:"var(--t1)", letterSpacing:"-.4px" }}>
            New Snippet
          </h1>
        </div>
        <p style={{ color:"var(--t2)", fontSize:14, marginLeft:46 }}>
          Paste your code, pick a language and share with anyone.
        </p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:20 }} className="meta-row">
        <div>
          <label className="lbl"><FiHash size={10} style={{ marginRight:3 }} />Title</label>
          <input className="inp" placeholder="e.g. Auth middleware" value={title} onChange={(e)=>setTitle(e.target.value)} />
        </div>
        <div>
          <label className="lbl"><FiCode size={10} style={{ marginRight:3 }} />Filename</label>
          <input className="inp" placeholder="e.g. utils, index, main" value={filename} onChange={(e)=>setFilename(e.target.value)} />
        </div>
        <div>
          <label className="lbl"><FiLayers size={10} style={{ marginRight:3 }} />Language</label>
          <LangSelector value={language} onChange={setLanguage} />
        </div>
      </div>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <div className="tab-bar" style={{ width:"fit-content" }}>
          <button className={`tab ${tab==="write" ? "tab-active" : "tab-inactive"}`} onClick={()=>setTab("write")}>
            <FiEdit3 size={13} /> Write
          </button>
          <button
            className={`tab ${tab==="preview" ? "tab-active" : "tab-inactive"}`}
            onClick={()=>setTab("preview")}
            disabled={!code.trim()}
            style={{ opacity: !code.trim() ? .4 : 1 }}
          >
            <FiEye size={13} /> Preview
          </button>
        </div>
        {code.trim() && (
          <span style={{ fontSize:12, color:"var(--t3)" }}>
            {code.split("\n").length} lines · {code.length.toLocaleString()} chars
          </span>
        )}
      </div>

      {tab === "write" ? (
        <textarea
          className="code-editor"
          placeholder={`// Start writing ${lang.label} here…\n// Tab key inserts 2 spaces`}
          value={code}
          onChange={(e)=>setCode(e.target.value)}
          onKeyDown={handleTab}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      ) : code.trim() ? (
        <CodeDisplay code={code} language={language} filename={filename} onDownload={download} />
      ) : (
        <div style={{
          background:"#0D1117", borderRadius:10, padding:48, textAlign:"center",
          color:"var(--t3)", fontSize:14, border:"1px solid var(--border)",
        }}>
          No code to preview.
        </div>
      )}

      <div className="bottom-actions" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:20, flexWrap:"wrap", gap:12 }}>
        <button className="btn btn-ghost" onClick={()=>router.push("/")}>
          <FiArrowLeft size={14} /> Cancel
        </button>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {code.trim() && (
            <button className="btn btn-secondary" onClick={download}>
              <FiDownload size={14} /> Download .{lang.ext}
            </button>
          )}
          <button className="btn btn-primary" onClick={create} style={{ fontSize:14, padding:"9px 22px" }}>
            <FiShare2 size={14} /> Share Snippet
          </button>
        </div>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}
