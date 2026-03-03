"use client";
import { useState } from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { FiCopy, FiCheck, FiDownload } from "react-icons/fi";
import { LANG_MAP, toHljsLang } from "@/lib/languages";
import { copyText } from "@/lib/clipboard";
import CS_THEME from "@/lib/syntaxTheme";

/* ── Register languages ── */
import js       from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import ts       from "react-syntax-highlighter/dist/esm/languages/hljs/typescript";
import py       from "react-syntax-highlighter/dist/esm/languages/hljs/python";
import dart     from "react-syntax-highlighter/dist/esm/languages/hljs/dart";
import rust     from "react-syntax-highlighter/dist/esm/languages/hljs/rust";
import go       from "react-syntax-highlighter/dist/esm/languages/hljs/go";
import java     from "react-syntax-highlighter/dist/esm/languages/hljs/java";
import cpp      from "react-syntax-highlighter/dist/esm/languages/hljs/cpp";
import cs       from "react-syntax-highlighter/dist/esm/languages/hljs/csharp";
import php      from "react-syntax-highlighter/dist/esm/languages/hljs/php";
import swift    from "react-syntax-highlighter/dist/esm/languages/hljs/swift";
import kotlin   from "react-syntax-highlighter/dist/esm/languages/hljs/kotlin";
import ruby     from "react-syntax-highlighter/dist/esm/languages/hljs/ruby";
import htmlLang from "react-syntax-highlighter/dist/esm/languages/hljs/xml";
import cssLang  from "react-syntax-highlighter/dist/esm/languages/hljs/css";
import sql      from "react-syntax-highlighter/dist/esm/languages/hljs/sql";
import bash     from "react-syntax-highlighter/dist/esm/languages/hljs/bash";
import json     from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import yaml     from "react-syntax-highlighter/dist/esm/languages/hljs/yaml";
import md       from "react-syntax-highlighter/dist/esm/languages/hljs/markdown";
import ini      from "react-syntax-highlighter/dist/esm/languages/hljs/ini";

SyntaxHighlighter.registerLanguage("javascript", js);
SyntaxHighlighter.registerLanguage("typescript", ts);
SyntaxHighlighter.registerLanguage("python",     py);
SyntaxHighlighter.registerLanguage("dart",       dart);
SyntaxHighlighter.registerLanguage("rust",       rust);
SyntaxHighlighter.registerLanguage("go",         go);
SyntaxHighlighter.registerLanguage("java",       java);
SyntaxHighlighter.registerLanguage("cpp",        cpp);
SyntaxHighlighter.registerLanguage("csharp",     cs);
SyntaxHighlighter.registerLanguage("php",        php);
SyntaxHighlighter.registerLanguage("swift",      swift);
SyntaxHighlighter.registerLanguage("kotlin",     kotlin);
SyntaxHighlighter.registerLanguage("ruby",       ruby);
SyntaxHighlighter.registerLanguage("html",       htmlLang);
SyntaxHighlighter.registerLanguage("css",        cssLang);
SyntaxHighlighter.registerLanguage("sql",        sql);
SyntaxHighlighter.registerLanguage("bash",       bash);
SyntaxHighlighter.registerLanguage("json",       json);
SyntaxHighlighter.registerLanguage("yaml",       yaml);
SyntaxHighlighter.registerLanguage("markdown",   md);
SyntaxHighlighter.registerLanguage("ini",        ini);

export default function CodeDisplay({ code, language, filename, onDownload }) {
  const [copied, setCopied] = useState(false);
  const lang   = LANG_MAP[language] ?? LANG_MAP["plaintext"];
  const hlLang = toHljsLang(language);

  const copy = () => {
    copyText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-wrap">
      {/* Top bar */}
      <div className="code-topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="topbar-dots">
            <div className="dot" style={{ background: "#FF5F57" }} />
            <div className="dot" style={{ background: "#FFBD2E" }} />
            <div className="dot" style={{ background: "#28C840" }} />
          </div>
          <span className="badge-lang">
            <span style={{ color: lang.color, fontSize: 13, display: "flex" }}>
              <lang.icon />
            </span>
            {lang.label}
          </span>
          {filename && (
            <span style={{ fontSize: 12, color: "var(--t3)", fontFamily: "var(--font-jetbrains), monospace" }}>
              {filename}.{lang.ext}
            </span>
          )}
        </div>

        <div style={{ display: "flex", gap: 6 }}>
          <button className="btn btn-secondary btn-icon" onClick={copy} title="Copy code">
            {copied
              ? <FiCheck style={{ color: "var(--green)" }} />
              : <FiCopy />}
          </button>
          {onDownload && (
            <button className="btn btn-secondary btn-icon" onClick={onDownload} title="Download file">
              <FiDownload />
            </button>
          )}
        </div>
      </div>

      {/* Highlighted code */}
      <SyntaxHighlighter
        language={hlLang}
        style={CS_THEME}
        showLineNumbers
        lineNumberStyle={{
          color: "#3D444D",
          fontSize: "12px",
          paddingRight: "20px",
          minWidth: "3em",
          userSelect: "none",
          fontFamily: "var(--font-jetbrains), monospace",
        }}
        customStyle={{
          margin: 0,
          padding: "20px 20px 20px 0",
          background: "#0D1117",
          borderRadius: 0,
          fontSize: "13.5px",
          lineHeight: "1.75",
        }}
        wrapLongLines={false}
        codeTagProps={{
          style: { fontFamily: "var(--font-jetbrains), monospace" },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
