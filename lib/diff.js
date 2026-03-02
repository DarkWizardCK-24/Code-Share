/**
 * Simple LCS-based line diff algorithm.
 * Returns an array of { type, line, leftNum?, rightNum? }
 *   type: "equal" | "added" | "removed"
 */
export function computeDiff(leftText, rightText) {
  const a = leftText.split("\n");
  const b = rightText.split("\n");
  const m = a.length;
  const n = b.length;

  // Build LCS table
  const dp = Array.from({ length: m + 1 }, () => new Uint16Array(n + 1));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  // Backtrack
  const result = [];
  let i = m;
  let j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      result.unshift({ type: "equal", line: a[i - 1], leftNum: i, rightNum: j });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: "added", line: b[j - 1], rightNum: j });
      j--;
    } else {
      result.unshift({ type: "removed", line: a[i - 1], leftNum: i });
      i--;
    }
  }

  return result;
}

/** Summary stats from a diff result */
export function diffStats(diff) {
  let added = 0;
  let removed = 0;
  let unchanged = 0;
  for (const d of diff) {
    if (d.type === "added") added++;
    else if (d.type === "removed") removed++;
    else unchanged++;
  }
  return { added, removed, unchanged, total: diff.length };
}
