"use client";
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft, FiRefreshCw, FiDownload, FiSave,
  FiChevronRight, FiChevronLeft, FiChevronDown, FiChevronUp,
  FiInfo, FiX, FiPlus, FiMinus, FiCode, FiCopy, FiCheck,
  FiPackage, FiHash, FiGitBranch, FiAlertTriangle,
  FiMessageSquare, FiLayers, FiZap,
} from "react-icons/fi";
import { computeDiff, diffStats } from "@/lib/diff";
import { generateInsights } from "@/lib/insights";
import { copyText } from "@/lib/clipboard";
import { uid, persist, downloadFile } from "@/lib/storage";
import { useAuth } from "./AuthContext";
import LangSelector from "./LangSelector";
import Toast from "./Toast";

export default function ComparePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [leftCode, setLeftCode]       = useState("");
  const [rightCode, setRightCode]     = useState("");
  const [language, setLanguage]       = useState("javascript");
  const [diff, setDiff]               = useState(null);
  const [insights, setInsights]       = useState(null);
  const [showGuide, setShowGuide]     = useState(true);
  const [showInsights, setShowInsights] = useState(true);
  const [toast, setToast]             = useState(null);
  const [copied, setCopied]           = useState(null);
  const toastTimer = useRef(null);

  const showToastMsg = useCallback((msg, type = "success") => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  /* ── Actions ── */
  const runCompare = () => {
    if (!leftCode.trim() && !rightCode.trim()) {
      showToastMsg("Paste code in both panels first.", "error");
      return;
    }
    const diffResult = computeDiff(leftCode, rightCode);
    setDiff(diffResult);
    setInsights(generateInsights(diffResult, leftCode, rightCode, language));
    setShowInsights(true);
  };

  const swapPanels = () => {
    setLeftCode(rightCode);
    setRightCode(leftCode);
    setDiff(null);
    setInsights(null);
    showToastMsg("Panels swapped!");
  };

  const clearAll = () => {
    setLeftCode("");
    setRightCode("");
    setDiff(null);
    setInsights(null);
  };

  const addToLeft = (line, rightNum) => {
    const lines = leftCode.split("\n");
    const insertAt = findInsertPosition(lines, rightNum, leftCode);
    lines.splice(insertAt, 0, line);
    setLeftCode(lines.join("\n"));
    setDiff(null);
    setInsights(null);
    showToastMsg("Line added to Original panel.");
  };

  const addToRight = (line, leftNum) => {
    const lines = rightCode.split("\n");
    const insertAt = findInsertPosition(lines, leftNum, rightCode);
    lines.splice(insertAt, 0, line);
    setRightCode(lines.join("\n"));
    setDiff(null);
    setInsights(null);
    showToastMsg("Line added to Modified panel.");
  };

  const saveAsSnippet = async (code, label) => {
    if (!code.trim()) { showToastMsg("Nothing to save.", "error"); return; }
    if (!user) { showToastMsg("You must be signed in.", "error"); return; }
    const s = {
      id: uid(),
      ownerId: user.uid,
      title: `Compare — ${label}`,
      filename: "",
      language,
      code,
      createdAt: Date.now(),
    };
    await persist(user.uid, s);
    showToastMsg(`Saved "${s.title}" as snippet!`);
  };

  const handleDownload = (code, label) => {
    if (!code.trim()) { showToastMsg("Nothing to download.", "error"); return; }
    const ext = language === "plaintext" ? "txt" : language;
    const name = downloadFile(code, `compare-${label}`, ext);
    showToastMsg(`Downloaded as ${name}`);
  };

  const handleCopy = (code, key) => {
    copyText(code);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
    showToastMsg("Copied to clipboard!");
  };

  const stats = diff ? diffStats(diff) : null;

  return (
    <div className="page-enter page-inner" style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 24px 80px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <button className="btn btn-ghost" onClick={() => router.push("/")} style={{ marginRight: 4 }}>
          <FiArrowLeft size={14} />
        </button>
        <div style={{
          width: 36, height: 36, borderRadius: 9,
          background: "linear-gradient(135deg,#FFA657,#FF7B72)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, color: "#fff",
        }}>
          <FiCode />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--t1)", letterSpacing: "-.4px" }}>
          Code Compare
        </h1>
      </div>
      <p style={{ color: "var(--t2)", fontSize: 14, marginLeft: 46 + 38, marginBottom: 24 }}>
        Compare two code blocks side by side, spot differences, and merge lines.
      </p>

      {/* ── Guide ── */}
      {showGuide && (
        <div className="compare-guide" style={{
          background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12,
          padding: "20px 24px", marginBottom: 24, position: "relative",
        }}>
          <button className="btn btn-icon btn-ghost" onClick={() => setShowGuide(false)}
            style={{ position: "absolute", top: 12, right: 12 }}>
            <FiX size={14} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <FiInfo size={16} style={{ color: "var(--accent)" }} />
            <span style={{ fontWeight: 700, fontSize: 14, color: "var(--t1)" }}>How to use Code Compare</span>
          </div>
          <div className="guide-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px" }}>
            <GuideStep num="1" title="Paste your code" desc="Paste the original code on the left and the modified version on the right." />
            <GuideStep num="2" title="Hit Compare" desc='Click the "Compare" button to run a line-by-line diff analysis.' />
            <GuideStep num="3" title="Read the insights" desc="Smart Insights will tell you what changed, why it matters, and whether to merge." />
            <GuideStep num="4" title="Merge lines" desc='Click the arrow buttons to add missing lines from one panel to the other.' />
            <GuideStep num="5" title="Swap panels" desc="Use the swap button to quickly flip Original and Modified." />
            <GuideStep num="6" title="Save or Download" desc="Save either panel as a new snippet, or download it as a file." />
          </div>
        </div>
      )}

      {/* ── Language + Actions ── */}
      <div className="compare-toolbar" style={{
        display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap",
      }}>
        <div style={{ width: 200 }}>
          <LangSelector value={language} onChange={setLanguage} />
        </div>
        <button className="btn btn-primary" onClick={runCompare} style={{ fontSize: 14, padding: "9px 20px" }}>
          <FiCode size={14} /> Compare
        </button>
        <button className="btn btn-secondary" onClick={swapPanels}>
          <FiRefreshCw size={13} /> Swap
        </button>
        <button className="btn btn-ghost" onClick={clearAll}>
          <FiX size={13} /> Clear
        </button>
        {!showGuide && (
          <button className="btn btn-ghost" onClick={() => setShowGuide(true)} style={{ marginLeft: "auto" }}>
            <FiInfo size={13} /> Guide
          </button>
        )}
      </div>

      {/* ── Editor Panels ── */}
      {!diff && (
        <div className="compare-panels" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <EditorPanel label="Original" color="var(--red)" code={leftCode} onChange={setLeftCode} />
          <EditorPanel label="Modified" color="var(--green)" code={rightCode} onChange={setRightCode} />
        </div>
      )}

      {/* ── Diff Result ── */}
      {diff && (
        <>
          {/* Stats bar */}
          <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
            <StatBadge icon={<FiMinus size={11} />} val={stats.removed} label="removed" color="var(--red)" />
            <StatBadge icon={<FiPlus size={11} />} val={stats.added} label="added" color="var(--green)" />
            <span style={{ fontSize: 12, color: "var(--t3)" }}>
              {stats.unchanged} unchanged · {stats.total} total lines
            </span>
            <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
              <button className="btn btn-ghost" onClick={() => { setDiff(null); setInsights(null); }} style={{ fontSize: 13 }}>
                Back to Edit
              </button>
              <button className="btn btn-secondary" onClick={runCompare} style={{ fontSize: 13 }}>
                <FiRefreshCw size={12} /> Re-compare
              </button>
            </div>
          </div>

          {/* ── Insights Panel ── */}
          {insights && insights.length > 0 && (
            <div className="insights-panel">
              <div className="insights-header" onClick={() => setShowInsights(!showInsights)}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <FiZap size={15} style={{ color: "var(--orange)" }} />
                  <span style={{ fontWeight: 700, fontSize: 14, color: "var(--t1)" }}>
                    Smart Insights
                  </span>
                  <span style={{
                    background: "var(--bg4)", borderRadius: 20, padding: "1px 8px",
                    fontSize: 11, fontWeight: 700, color: "var(--t3)",
                  }}>
                    {insights.length}
                  </span>
                </div>
                {showInsights ? <FiChevronUp size={16} style={{ color: "var(--t3)" }} /> : <FiChevronDown size={16} style={{ color: "var(--t3)" }} />}
              </div>
              {showInsights && (
                <div>
                  {insights.map((ins) => (
                    <InsightCard key={ins.id} insight={ins} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Diff view */}
          <div className="diff-container" style={{
            border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden",
          }}>
            <div className="diff-header-row" style={{
              display: "grid", gridTemplateColumns: "1fr 1fr",
              background: "#161B22", borderBottom: "1px solid var(--border2)",
            }}>
              <DiffPanelHeader label="Original" color="var(--red)"
                onCopy={() => handleCopy(leftCode, "left")}
                onSave={() => saveAsSnippet(leftCode, "Original")}
                onDownload={() => handleDownload(leftCode, "original")}
                copied={copied === "left"} />
              <DiffPanelHeader label="Modified" color="var(--green)"
                onCopy={() => handleCopy(rightCode, "right")}
                onSave={() => saveAsSnippet(rightCode, "Modified")}
                onDownload={() => handleDownload(rightCode, "modified")}
                copied={copied === "right"} />
            </div>
            <div style={{ maxHeight: 600, overflowY: "auto" }}>
              {diff.map((d, i) => (
                <DiffLine key={i} item={d}
                  onAddToLeft={d.type === "added" ? () => addToLeft(d.line, d.rightNum) : null}
                  onAddToRight={d.type === "removed" ? () => addToRight(d.line, d.leftNum) : null} />
              ))}
              {diff.length === 0 && (
                <div style={{ padding: 40, textAlign: "center", color: "var(--t3)", fontSize: 14 }}>
                  Both panels are empty.
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}

/* ── Sub-components ── */

const INSIGHT_ICONS = {
  import:         FiPackage,
  function:       FiCode,
  variable:       FiHash,
  "control-flow": FiGitBranch,
  "error-handling": FiAlertTriangle,
  comment:        FiMessageSquare,
  structural:     FiLayers,
  general:        FiInfo,
};

const SEVERITY_COLORS = {
  warning:    { bg: "rgba(255,166,87,.12)", border: "rgba(255,166,87,.25)", icon: "var(--orange)" },
  suggestion: { bg: "rgba(63,185,80,.12)", border: "rgba(63,185,80,.25)", icon: "var(--green)" },
  info:       { bg: "rgba(88,166,255,.12)", border: "rgba(88,166,255,.25)", icon: "var(--accent)" },
};

const REC_BADGES = {
  "safe-to-merge":    { cls: "badge-merge",    label: "Safe to Merge" },
  "review-carefully": { cls: "badge-review",   label: "Review Carefully" },
  "keep-original":    { cls: "badge-keep-orig", label: "Keep Original" },
  "keep-modified":    { cls: "badge-keep-mod",  label: "Keep Modified" },
};

function InsightCard({ insight }) {
  const Icon = INSIGHT_ICONS[insight.type] || FiInfo;
  const sev = SEVERITY_COLORS[insight.severity] || SEVERITY_COLORS.info;
  const rec = REC_BADGES[insight.recommendation] || REC_BADGES["review-carefully"];

  return (
    <div className="insight-card">
      <div className="insight-icon" style={{ background: sev.bg, border: `1px solid ${sev.border}` }}>
        <Icon size={14} style={{ color: sev.icon }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: "var(--t1)" }}>{insight.title}</span>
          <span className={`insight-badge ${rec.cls}`}>{rec.label}</span>
        </div>
        <p style={{ fontSize: 12, color: "var(--t2)", lineHeight: 1.6, margin: 0 }}>
          {insight.description}
        </p>
      </div>
    </div>
  );
}

function GuideStep({ num, title, desc }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
      <div style={{
        width: 24, height: 24, borderRadius: 6, flexShrink: 0,
        background: "var(--bg4)", display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 800, color: "var(--accent)",
      }}>
        {num}
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 13, color: "var(--t1)", marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 12, color: "var(--t2)", lineHeight: 1.5 }}>{desc}</div>
      </div>
    </div>
  );
}

function EditorPanel({ label, color, code, onChange }) {
  const handleTab = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const s = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const next = code.substring(0, s) + "  " + code.substring(end);
      onChange(next);
      setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = s + 2; }, 0);
    }
  };
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--t2)", textTransform: "uppercase", letterSpacing: ".4px" }}>{label}</span>
        {code && <span style={{ fontSize: 11, color: "var(--t3)", marginLeft: "auto" }}>{code.split("\n").length} lines</span>}
      </div>
      <textarea className="code-editor" placeholder={`// Paste ${label.toLowerCase()} code here…`}
        value={code} onChange={(e) => onChange(e.target.value)} onKeyDown={handleTab}
        spellCheck={false} autoComplete="off" autoCorrect="off" autoCapitalize="off"
        style={{ minHeight: 300 }} />
    </div>
  );
}

function DiffPanelHeader({ label, color, onCopy, onSave, onDownload, copied }) {
  return (
    <div style={{
      padding: "10px 16px", display: "flex", alignItems: "center", gap: 10,
      borderRight: label === "Original" ? "1px solid var(--border2)" : "none",
    }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
      <span style={{ fontWeight: 700, fontSize: 12, color: "var(--t2)", flex: 1 }}>{label}</span>
      <div style={{ display: "flex", gap: 4 }}>
        <button className="btn btn-icon btn-ghost" onClick={onCopy} title="Copy">
          {copied ? <FiCheck size={12} style={{ color: "var(--green)" }} /> : <FiCopy size={12} />}
        </button>
        <button className="btn btn-icon btn-ghost" onClick={onSave} title="Save as snippet"><FiSave size={12} /></button>
        <button className="btn btn-icon btn-ghost" onClick={onDownload} title="Download"><FiDownload size={12} /></button>
      </div>
    </div>
  );
}

function StatBadge({ icon, val, label, color }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: `${color}18`, border: `1px solid ${color}30`,
      borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700, color,
    }}>
      {icon} {val} {label}
    </span>
  );
}

const DIFF_COLORS = {
  added:   { bg: "rgba(63,185,80,0.08)", border: "rgba(63,185,80,0.2)", gutter: "#0F3D18", text: "#3FB950" },
  removed: { bg: "rgba(255,123,114,0.08)", border: "rgba(255,123,114,0.2)", gutter: "#3B0D0C", text: "#FF7B72" },
  equal:   { bg: "transparent", border: "transparent", gutter: "transparent", text: "var(--t3)" },
};

function DiffLine({ item, onAddToLeft, onAddToRight }) {
  const c = DIFF_COLORS[item.type];
  const prefix = item.type === "added" ? "+" : item.type === "removed" ? "-" : " ";
  return (
    <div className="diff-line" style={{
      display: "grid", gridTemplateColumns: "40px 28px 1fr 36px", alignItems: "stretch",
      background: c.bg, borderBottom: `1px solid ${c.border}`,
      fontSize: 13, fontFamily: "var(--font-jetbrains), monospace", lineHeight: "1.7",
    }}>
      <div style={{ padding: "2px 8px", textAlign: "right", color: c.text, fontSize: 11, userSelect: "none", opacity: 0.7, background: c.gutter }}>
        {item.leftNum || item.rightNum || ""}
      </div>
      <div style={{ padding: "2px 4px", textAlign: "center", color: c.text, fontWeight: 700, userSelect: "none" }}>{prefix}</div>
      <div style={{ padding: "2px 12px", color: item.type === "equal" ? "var(--t2)" : "var(--t1)", whiteSpace: "pre", overflow: "hidden", textOverflow: "ellipsis" }}>
        {item.line}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        {onAddToLeft && (
          <button className="diff-action-btn" onClick={onAddToLeft} title="Add this line to Original"
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--accent)", fontSize: 13, padding: 2, display: "flex", opacity: 0.5, transition: "opacity .15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)} onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.5)}>
            <FiChevronLeft />
          </button>
        )}
        {onAddToRight && (
          <button className="diff-action-btn" onClick={onAddToRight} title="Add this line to Modified"
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--accent)", fontSize: 13, padding: 2, display: "flex", opacity: 0.5, transition: "opacity .15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)} onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.5)}>
            <FiChevronRight />
          </button>
        )}
      </div>
    </div>
  );
}

function findInsertPosition(targetLines, sourceNum, targetCode) {
  const ratio = sourceNum / Math.max(1, targetCode.split("\n").length);
  return Math.min(Math.round(ratio * targetLines.length), targetLines.length);
}
