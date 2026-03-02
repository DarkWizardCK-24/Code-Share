"use client";

export default function Toast({ msg, type = "success" }) {
  const icon  = type === "success" ? "✓" : type === "error" ? "✕" : "ℹ";
  const color = type === "success" ? "#3FB950" : type === "error" ? "#FF7B72" : "#58A6FF";

  return (
    <div className="toast">
      <span style={{ color, fontSize: 16, fontWeight: 700 }}>{icon}</span>
      {msg}
    </div>
  );
}
