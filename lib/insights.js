import { diffStats } from "./diff";

/**
 * Generate smart insights from a diff result.
 * @param {Array} diff - Output of computeDiff()
 * @param {string} leftText - Original code
 * @param {string} rightText - Modified code
 * @param {string} language - Language ID (e.g. "javascript")
 * @returns {Array} Array of insight objects
 */
export function generateInsights(diff, leftText, rightText, language) {
  const leftLines = leftText.split("\n");
  const rightLines = rightText.split("\n");
  const family = langFamily(language);
  const stats = diffStats(diff);

  const insights = [
    ...detectImportChanges(diff, family),
    ...detectFunctionChanges(diff, family),
    ...detectVariableChanges(diff, family),
    ...detectControlFlowChanges(diff, family),
    ...detectErrorHandling(diff, family),
    ...detectCommentChanges(diff, family),
    ...detectStructuralChanges(diff, leftLines, rightLines),
    ...detectOverallSummary(diff, stats),
  ];

  // Assign IDs
  insights.forEach((ins, i) => { ins.id = `insight-${i}`; });

  // Sort: warning first, then suggestion, then info
  const order = { warning: 0, suggestion: 1, info: 2 };
  insights.sort((a, b) => (order[a.severity] ?? 2) - (order[b.severity] ?? 2));

  // Cap at 15
  if (insights.length > 15) {
    const kept = insights.slice(0, 14);
    const rest = insights.length - 14;
    kept.push({
      id: "insight-overflow",
      type: "general",
      severity: "info",
      title: `+${rest} more minor changes`,
      description: `There are ${rest} additional small changes not shown. Review the diff for full details.`,
      recommendation: "review-carefully",
      relatedLines: [],
    });
    return kept;
  }

  return insights;
}

/* ── Language family mapper ── */
function langFamily(language) {
  const families = {
    js:     ["javascript", "typescript", "jsx", "tsx"],
    python: ["python"],
    go:     ["go"],
    rust:   ["rust"],
    java:   ["java", "kotlin"],
    csharp: ["csharp"],
    php:    ["php"],
    ruby:   ["ruby"],
    shell:  ["bash"],
    markup: ["html", "css"],
    data:   ["json", "yaml", "sql"],
    docs:   ["markdown", "plaintext"],
    dart:   ["dart", "flutter"],
    swift:  ["swift"],
    cpp:    ["cpp"],
  };
  for (const [fam, langs] of Object.entries(families)) {
    if (langs.includes(language)) return fam;
  }
  return "generic";
}

/* ── Regex sets by family ── */
function importPattern(family) {
  const patterns = {
    js:     /^\s*(import\s|const\s.*=\s*require|export\s.*from)/,
    python: /^\s*(import\s|from\s.*import)/,
    go:     /^\s*import\s/,
    rust:   /^\s*(use\s|extern\s+crate)/,
    java:   /^\s*import\s/,
    csharp: /^\s*using\s/,
    php:    /^\s*(use\s|require|include)/,
    ruby:   /^\s*(require|require_relative|include)\b/,
    dart:   /^\s*import\s/,
    swift:  /^\s*import\s/,
    cpp:    /^\s*#\s*include/,
  };
  return patterns[family] || /^\s*(import|require|include|use)\b/;
}

function functionPattern(family) {
  const patterns = {
    js:     /^\s*(function\s+\w+|const\s+\w+\s*=\s*(\(|async\s*\()|(\w+)\s*\(.*\)\s*\{|class\s+\w+)/,
    python: /^\s*(def\s+\w+|class\s+\w+|async\s+def)/,
    go:     /^\s*func\s+/,
    rust:   /^\s*(fn\s+|impl\s+|pub\s+(fn|async\s+fn))/,
    java:   /^\s*(public|private|protected|static|void|int|String|fun|override)\s+.*\(/,
    csharp: /^\s*(public|private|protected|static|void|int|string|async)\s+.*\(/,
    php:    /^\s*(function\s+\w+|public\s+function|private\s+function)/,
    ruby:   /^\s*(def\s+\w+|class\s+\w+)/,
    dart:   /^\s*(void|int|String|double|bool|Future|class|Widget)\s+\w+/,
    swift:  /^\s*(func\s+|class\s+|struct\s+)/,
    cpp:    /^\s*(void|int|char|double|bool|class|struct)\s+\w+/,
  };
  return patterns[family] || /^\s*(function|def|fn|func|sub|proc|class)\s+/;
}

function variablePattern(family) {
  const patterns = {
    js:     /^\s*(const|let|var)\s+(\w+)/,
    python: /^\s*(\w+)\s*=/,
    go:     /^\s*(var\s+\w+|\w+\s*:=)/,
    rust:   /^\s*(let\s+(mut\s+)?\w+)/,
    java:   /^\s*(int|String|boolean|double|float|long|var|final)\s+\w+/,
    csharp: /^\s*(int|string|bool|double|float|var|const)\s+\w+/,
    dart:   /^\s*(var|final|const|int|String|double|bool)\s+\w+/,
    swift:  /^\s*(var|let)\s+\w+/,
    cpp:    /^\s*(int|char|double|float|bool|auto|const)\s+\w+/,
  };
  return patterns[family] || /^\s*(const|let|var|val|dim)\s+/;
}

function controlFlowPattern() {
  return /^\s*(if|else|else\s*if|elif|switch|case|for|while|do|foreach|loop|match|guard)\b/;
}

function errorPattern(family) {
  const patterns = {
    js:     /^\s*(try|catch|finally|throw\s+new|\.catch\()/,
    python: /^\s*(try:|except|finally:|raise)/,
    go:     /^\s*(if\s+err\s*!=\s*nil)/,
    rust:   /^\s*(\.unwrap\(\)|\.expect\(|Err\(|Ok\(|\?;)/,
    java:   /^\s*(try|catch|finally|throws?)\b/,
    csharp: /^\s*(try|catch|finally|throw)\b/,
    swift:  /^\s*(do\s*\{|catch|throw|try)/,
  };
  return patterns[family] || /^\s*(try|catch|except|finally|throw|raise|rescue)\b/;
}

function commentPattern(family) {
  const patterns = {
    js:     /^\s*(\/\/|\/\*|\*\/|\*\s)/,
    python: /^\s*#/,
    ruby:   /^\s*#/,
    shell:  /^\s*#/,
    markup: /^\s*(<!--|\/\*)/,
  };
  return patterns[family] || /^\s*(\/\/|\/\*|#|<!--|--|%)/;
}

/* ── Helper: extract name from a line ── */
function extractName(line) {
  const m = line.match(/(?:function|def|fn|func|class|const|let|var|import|use|struct)\s+(\w+)/);
  return m ? m[1] : null;
}

/* ── Detector 1: Import changes ── */
function detectImportChanges(diff, family) {
  const pat = importPattern(family);
  const insights = [];
  const addedImports = [];
  const removedImports = [];

  for (let i = 0; i < diff.length; i++) {
    const d = diff[i];
    if (!pat.test(d.line)) continue;
    if (d.type === "added")   addedImports.push({ ...d, idx: i });
    if (d.type === "removed") removedImports.push({ ...d, idx: i });
  }

  if (addedImports.length > 0) {
    const names = addedImports.map(d => d.line.trim()).slice(0, 3);
    insights.push({
      type: "import",
      severity: "suggestion",
      title: `${addedImports.length} import${addedImports.length > 1 ? "s" : ""} added`,
      description: `New dependencies added: ${names.join(", ")}${addedImports.length > 3 ? "..." : ""}. Adding imports is generally safe as long as the packages exist in your project.`,
      recommendation: "safe-to-merge",
      relatedLines: addedImports.map(d => d.idx),
    });
  }

  if (removedImports.length > 0) {
    const names = removedImports.map(d => d.line.trim()).slice(0, 3);
    insights.push({
      type: "import",
      severity: "warning",
      title: `${removedImports.length} import${removedImports.length > 1 ? "s" : ""} removed`,
      description: `Removed: ${names.join(", ")}${removedImports.length > 3 ? "..." : ""}. Removing imports may break references elsewhere in the code. Verify these are no longer used.`,
      recommendation: "review-carefully",
      relatedLines: removedImports.map(d => d.idx),
    });
  }

  return insights;
}

/* ── Detector 2: Function changes ── */
function detectFunctionChanges(diff, family) {
  const pat = functionPattern(family);
  const insights = [];
  const added = [];
  const removed = [];

  for (let i = 0; i < diff.length; i++) {
    const d = diff[i];
    if (!pat.test(d.line)) continue;
    if (d.type === "added")   added.push({ ...d, idx: i, name: extractName(d.line) });
    if (d.type === "removed") removed.push({ ...d, idx: i, name: extractName(d.line) });
  }

  // Check for modified functions (same name in both added and removed)
  const addedNames = new Set(added.filter(d => d.name).map(d => d.name));
  const removedNames = new Set(removed.filter(d => d.name).map(d => d.name));
  const modified = [...addedNames].filter(n => removedNames.has(n));
  const pureAdded = added.filter(d => !d.name || !removedNames.has(d.name));
  const pureRemoved = removed.filter(d => !d.name || !addedNames.has(d.name));

  if (modified.length > 0) {
    insights.push({
      type: "function",
      severity: "warning",
      title: `${modified.length} function${modified.length > 1 ? "s" : ""} modified`,
      description: `Changed: ${modified.join(", ")}. Function signatures or implementations were altered. This may affect callers and should be reviewed for correctness.`,
      recommendation: "review-carefully",
      relatedLines: [...added, ...removed].filter(d => modified.includes(d.name)).map(d => d.idx),
    });
  }

  if (pureAdded.length > 0) {
    const names = pureAdded.filter(d => d.name).map(d => d.name);
    insights.push({
      type: "function",
      severity: "suggestion",
      title: `${pureAdded.length} new function${pureAdded.length > 1 ? "s" : ""} added`,
      description: names.length > 0
        ? `New: ${names.join(", ")}. Adding new functions extends functionality without breaking existing code.`
        : "New functions or classes were added. These extend functionality without breaking existing code.",
      recommendation: "safe-to-merge",
      relatedLines: pureAdded.map(d => d.idx),
    });
  }

  if (pureRemoved.length > 0) {
    const names = pureRemoved.filter(d => d.name).map(d => d.name);
    insights.push({
      type: "function",
      severity: "warning",
      title: `${pureRemoved.length} function${pureRemoved.length > 1 ? "s" : ""} removed`,
      description: names.length > 0
        ? `Removed: ${names.join(", ")}. Ensure nothing else depends on these functions before accepting.`
        : "Functions or classes were removed. Verify no other code depends on them.",
      recommendation: "review-carefully",
      relatedLines: pureRemoved.map(d => d.idx),
    });
  }

  return insights;
}

/* ── Detector 3: Variable changes ── */
function detectVariableChanges(diff, family) {
  const pat = variablePattern(family);
  if (!pat) return [];
  const insights = [];
  const added = [];
  const removed = [];

  for (let i = 0; i < diff.length; i++) {
    const d = diff[i];
    if (!pat.test(d.line)) continue;
    // Skip if already caught by import or function detectors
    if (importPattern(family).test(d.line)) continue;
    if (functionPattern(family).test(d.line)) continue;
    if (d.type === "added")   added.push({ ...d, idx: i });
    if (d.type === "removed") removed.push({ ...d, idx: i });
  }

  if (added.length > 0 && removed.length > 0) {
    insights.push({
      type: "variable",
      severity: "warning",
      title: `${added.length + removed.length} variable declaration${added.length + removed.length > 1 ? "s" : ""} changed`,
      description: "Variables were added and removed. If values or types changed, downstream logic may be affected. Check that all references still resolve correctly.",
      recommendation: "review-carefully",
      relatedLines: [...added, ...removed].map(d => d.idx),
    });
  } else if (added.length > 0) {
    insights.push({
      type: "variable",
      severity: "info",
      title: `${added.length} new variable${added.length > 1 ? "s" : ""} declared`,
      description: "New variables or constants were introduced. This is typically safe unless they shadow existing names.",
      recommendation: "safe-to-merge",
      relatedLines: added.map(d => d.idx),
    });
  } else if (removed.length > 0) {
    insights.push({
      type: "variable",
      severity: "warning",
      title: `${removed.length} variable${removed.length > 1 ? "s" : ""} removed`,
      description: "Variable declarations were removed. Ensure they are no longer referenced elsewhere in the code.",
      recommendation: "review-carefully",
      relatedLines: removed.map(d => d.idx),
    });
  }

  return insights;
}

/* ── Detector 4: Control flow changes ── */
function detectControlFlowChanges(diff) {
  const pat = controlFlowPattern();
  const insights = [];
  const added = [];
  const removed = [];

  for (let i = 0; i < diff.length; i++) {
    const d = diff[i];
    if (!pat.test(d.line)) continue;
    if (d.type === "added")   added.push(i);
    if (d.type === "removed") removed.push(i);
  }

  if (added.length > 0 || removed.length > 0) {
    const total = added.length + removed.length;
    let desc = "";
    if (added.length > 0 && removed.length > 0) {
      desc = `${added.length} conditional/loop statement${added.length > 1 ? "s" : ""} added and ${removed.length} removed. The execution flow of the code has changed — test all code paths thoroughly.`;
    } else if (added.length > 0) {
      desc = `${added.length} new conditional/loop statement${added.length > 1 ? "s" : ""} added. New execution branches were introduced — make sure edge cases are handled.`;
    } else {
      desc = `${removed.length} conditional/loop statement${removed.length > 1 ? "s" : ""} removed. Simplified flow, but verify the removed conditions weren't protecting against edge cases.`;
    }

    insights.push({
      type: "control-flow",
      severity: "warning",
      title: `Control flow changed (${total} statement${total > 1 ? "s" : ""})`,
      description: desc,
      recommendation: "review-carefully",
      relatedLines: [...added, ...removed],
    });
  }

  return insights;
}

/* ── Detector 5: Error handling ── */
function detectErrorHandling(diff, family) {
  const pat = errorPattern(family);
  const insights = [];
  const added = [];
  const removed = [];

  for (let i = 0; i < diff.length; i++) {
    const d = diff[i];
    if (!pat.test(d.line)) continue;
    if (d.type === "added")   added.push(i);
    if (d.type === "removed") removed.push(i);
  }

  if (added.length > 0) {
    insights.push({
      type: "error-handling",
      severity: "suggestion",
      title: "Error handling added",
      description: `${added.length} error handling statement${added.length > 1 ? "s" : ""} (try/catch/throw) added. This improves robustness and is generally safe to merge.`,
      recommendation: "safe-to-merge",
      relatedLines: added,
    });
  }

  if (removed.length > 0) {
    insights.push({
      type: "error-handling",
      severity: "warning",
      title: "Error handling removed",
      description: `${removed.length} error handling statement${removed.length > 1 ? "s" : ""} removed. This may cause unhandled exceptions or silent failures. Review carefully.`,
      recommendation: "review-carefully",
      relatedLines: removed,
    });
  }

  return insights;
}

/* ── Detector 6: Comment changes ── */
function detectCommentChanges(diff, family) {
  const pat = commentPattern(family);
  const insights = [];
  let addedCount = 0;
  let removedCount = 0;

  for (const d of diff) {
    if (!pat.test(d.line)) continue;
    if (d.type === "added")   addedCount++;
    if (d.type === "removed") removedCount++;
  }

  if (addedCount > 0 && removedCount === 0) {
    insights.push({
      type: "comment",
      severity: "info",
      title: `${addedCount} comment${addedCount > 1 ? "s" : ""} added`,
      description: "New comments improve documentation and readability. Safe to merge.",
      recommendation: "safe-to-merge",
      relatedLines: [],
    });
  } else if (removedCount > 0 && addedCount === 0) {
    insights.push({
      type: "comment",
      severity: "info",
      title: `${removedCount} comment${removedCount > 1 ? "s" : ""} removed`,
      description: "Comments were removed. This reduces documentation — consider if the context they provided is still clear from the code itself.",
      recommendation: "keep-original",
      relatedLines: [],
    });
  } else if (addedCount > 0 && removedCount > 0) {
    insights.push({
      type: "comment",
      severity: "info",
      title: "Comments updated",
      description: `${addedCount} added, ${removedCount} removed. Documentation was revised — verify the new comments are accurate.`,
      recommendation: "review-carefully",
      relatedLines: [],
    });
  }

  return insights;
}

/* ── Detector 7: Structural changes ── */
function detectStructuralChanges(diff, leftLines, rightLines) {
  const insights = [];

  // Detect large block additions (10+ consecutive added lines)
  let streak = 0;
  let streakStart = -1;
  for (let i = 0; i < diff.length; i++) {
    if (diff[i].type === "added") {
      if (streak === 0) streakStart = i;
      streak++;
    } else {
      if (streak >= 10) {
        insights.push({
          type: "structural",
          severity: "warning",
          title: `Large block added (${streak} lines)`,
          description: `A block of ${streak} consecutive lines was added. Large additions may introduce new features or significant logic — review the entire block to understand its purpose.`,
          recommendation: "review-carefully",
          relatedLines: Array.from({ length: streak }, (_, j) => streakStart + j),
        });
      }
      streak = 0;
    }
  }
  if (streak >= 10) {
    insights.push({
      type: "structural",
      severity: "warning",
      title: `Large block added (${streak} lines)`,
      description: `A block of ${streak} consecutive lines was added at the end. Review the entire block to understand its purpose.`,
      recommendation: "review-carefully",
      relatedLines: Array.from({ length: streak }, (_, j) => streakStart + j),
    });
  }

  // Detect large block removals
  streak = 0;
  streakStart = -1;
  for (let i = 0; i < diff.length; i++) {
    if (diff[i].type === "removed") {
      if (streak === 0) streakStart = i;
      streak++;
    } else {
      if (streak >= 10) {
        insights.push({
          type: "structural",
          severity: "warning",
          title: `Large block removed (${streak} lines)`,
          description: `A block of ${streak} consecutive lines was removed. Ensure the deleted code is truly unnecessary and no functionality was lost.`,
          recommendation: "review-carefully",
          relatedLines: Array.from({ length: streak }, (_, j) => streakStart + j),
        });
      }
      streak = 0;
    }
  }
  if (streak >= 10) {
    insights.push({
      type: "structural",
      severity: "warning",
      title: `Large block removed (${streak} lines)`,
      description: `A block of ${streak} consecutive lines was removed from the end. Ensure the deleted code is truly unnecessary.`,
      recommendation: "review-carefully",
      relatedLines: Array.from({ length: streak }, (_, j) => streakStart + j),
    });
  }

  // Detect whitespace-only changes
  let whitespaceOnly = 0;
  for (const d of diff) {
    if (d.type === "equal") continue;
    // Check if there's a paired add/remove that only differs in whitespace
    if (d.line.trim() === "") whitespaceOnly++;
  }
  if (whitespaceOnly > 5) {
    insights.push({
      type: "structural",
      severity: "info",
      title: `${whitespaceOnly} blank line changes`,
      description: "Multiple blank lines were added or removed. These are formatting-only changes with no functional impact.",
      recommendation: "safe-to-merge",
      relatedLines: [],
    });
  }

  return insights;
}

/* ── Detector 8: Overall summary ── */
function detectOverallSummary(diff, stats) {
  const insights = [];

  if (stats.total === 0) {
    insights.push({
      type: "general",
      severity: "info",
      title: "No differences found",
      description: "Both code blocks are identical. Nothing to merge.",
      recommendation: "safe-to-merge",
      relatedLines: [],
    });
    return insights;
  }

  if (stats.removed === 0 && stats.added > 0) {
    insights.push({
      type: "general",
      severity: "suggestion",
      title: "Pure addition — safe to merge",
      description: `The modified version only adds ${stats.added} new line${stats.added > 1 ? "s" : ""} without changing any existing code. This is the safest type of change to merge.`,
      recommendation: "safe-to-merge",
      relatedLines: [],
    });
  } else if (stats.added === 0 && stats.removed > 0) {
    insights.push({
      type: "general",
      severity: "warning",
      title: "Pure deletion — verify before merging",
      description: `The modified version removes ${stats.removed} line${stats.removed > 1 ? "s" : ""} without adding anything new. Make sure the removed code is no longer needed.`,
      recommendation: "review-carefully",
      relatedLines: [],
    });
  } else {
    const changeRatio = (stats.added + stats.removed) / stats.total;
    if (changeRatio > 0.5) {
      insights.push({
        type: "general",
        severity: "warning",
        title: "Major refactor detected",
        description: `More than ${Math.round(changeRatio * 100)}% of the code has changed (${stats.added} added, ${stats.removed} removed). This is a significant rewrite — review each section carefully and test thoroughly.`,
        recommendation: "review-carefully",
        relatedLines: [],
      });
    } else {
      insights.push({
        type: "general",
        severity: "suggestion",
        title: "Moderate changes",
        description: `${stats.added} line${stats.added > 1 ? "s" : ""} added, ${stats.removed} removed, ${stats.unchanged} unchanged. A focused set of changes — review the modified sections and merge if logic is sound.`,
        recommendation: "review-carefully",
        relatedLines: [],
      });
    }
  }

  return insights;
}
