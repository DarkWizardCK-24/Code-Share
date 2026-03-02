"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiUser, FiLogIn } from "react-icons/fi";
import { SiGoogle } from "react-icons/si";
import { loginWithEmail, signupWithEmail, loginWithGoogle } from "@/lib/auth";
import { useAuth } from "./AuthContext";
import Toast from "./Toast";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, configured } = useAuth();
  const [tab, setTab]           = useState("signin");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [name, setName]         = useState("");
  const [error, setError]       = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) router.push("/");
  }, [user, loading, router]);

  // If Firebase not configured, redirect home
  useEffect(() => {
    if (!configured) router.push("/");
  }, [configured, router]);

  const clearForm = () => { setEmail(""); setPassword(""); setConfirm(""); setName(""); setError(null); };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setSubmitting(true);
    setError(null);
    try {
      await loginWithEmail(email, password);
      router.push("/");
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setSubmitting(true);
    setError(null);
    try {
      await signupWithEmail(email, password, name.trim());
      router.push("/");
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await loginWithGoogle();
      router.push("/");
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || user) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, color: "var(--t3)", fontSize: 14 }}>
        <span style={{ animation: "pulse 1.5s infinite" }}>Loading...</span>
      </div>
    );
  }

  return (
    <div className="page-enter" style={{ maxWidth: 440, margin: "60px auto", padding: "0 24px" }}>
      {/* Logo area */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14, margin: "0 auto 16px",
          background: "linear-gradient(135deg, #58a6ff 0%, #1f6feb 50%, #a371f7 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 30px rgba(88,166,255,.3)",
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M8 6L3 12L8 18" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 6L21 12L16 18" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13 4L11 20" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--t1)", letterSpacing: "-.4px" }}>
          Welcome to Code<span style={{ color: "var(--accent)" }}>Share</span>
        </h1>
        <p style={{ color: "var(--t2)", fontSize: 14, marginTop: 6 }}>
          Sign in to save and manage your code snippets.
        </p>
      </div>

      {/* Card */}
      <div style={{
        background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12,
        padding: "24px",
      }}>
        {/* Tab bar */}
        <div className="tab-bar" style={{ width: "100%", marginBottom: 20 }}>
          <button className={`tab ${tab === "signin" ? "tab-active" : "tab-inactive"}`}
            onClick={() => { setTab("signin"); clearForm(); }}>
            <FiLogIn size={13} /> Sign In
          </button>
          <button className={`tab ${tab === "signup" ? "tab-active" : "tab-inactive"}`}
            onClick={() => { setTab("signup"); clearForm(); }}>
            <FiUser size={13} /> Sign Up
          </button>
        </div>

        {/* Google Sign In */}
        <button className="btn btn-secondary" onClick={handleGoogle} disabled={submitting}
          style={{ width: "100%", justifyContent: "center", padding: "10px 16px", marginBottom: 16 }}>
          <SiGoogle size={14} /> Continue with Google
        </button>

        <div style={{
          display: "flex", alignItems: "center", gap: 12, marginBottom: 16,
          color: "var(--t3)", fontSize: 12,
        }}>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          or
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        {/* Form */}
        <form onSubmit={tab === "signin" ? handleSignIn : handleSignUp}>
          {tab === "signup" && (
            <div style={{ marginBottom: 12 }}>
              <label className="lbl"><FiUser size={10} style={{ marginRight: 3 }} /> Display Name</label>
              <input className="inp" placeholder="Your name" value={name}
                onChange={(e) => setName(e.target.value)} />
            </div>
          )}
          <div style={{ marginBottom: 12 }}>
            <label className="lbl"><FiMail size={10} style={{ marginRight: 3 }} /> Email</label>
            <input className="inp" type="email" placeholder="you@example.com" value={email}
              onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label className="lbl"><FiLock size={10} style={{ marginRight: 3 }} /> Password</label>
            <input className="inp" type="password" placeholder="Min 6 characters" value={password}
              onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {tab === "signup" && (
            <div style={{ marginBottom: 12 }}>
              <label className="lbl"><FiLock size={10} style={{ marginRight: 3 }} /> Confirm Password</label>
              <input className="inp" type="password" placeholder="Repeat password" value={confirm}
                onChange={(e) => setConfirm(e.target.value)} required />
            </div>
          )}

          {error && (
            <div style={{
              background: "rgba(255,123,114,.1)", border: "1px solid rgba(255,123,114,.2)",
              borderRadius: 8, padding: "8px 12px", marginBottom: 12,
              fontSize: 13, color: "var(--red)", fontWeight: 600,
            }}>
              {error}
            </div>
          )}

          <button className="btn btn-primary" type="submit" disabled={submitting}
            style={{ width: "100%", justifyContent: "center", padding: "10px 16px", fontSize: 14, opacity: submitting ? 0.6 : 1 }}>
            {submitting ? "Please wait..." : tab === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

function friendlyError(code) {
  const map = {
    "auth/invalid-email":           "Invalid email address.",
    "auth/user-disabled":           "This account has been disabled.",
    "auth/user-not-found":          "No account found with this email.",
    "auth/wrong-password":          "Incorrect password.",
    "auth/invalid-credential":      "Invalid email or password.",
    "auth/email-already-in-use":    "An account with this email already exists.",
    "auth/weak-password":           "Password is too weak. Use at least 6 characters.",
    "auth/popup-closed-by-user":    "Sign-in popup was closed.",
    "auth/network-request-failed":  "Network error. Check your connection.",
    "auth/too-many-requests":       "Too many attempts. Please try again later.",
  };
  return map[code] || "Something went wrong. Please try again.";
}
