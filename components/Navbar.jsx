"use client";
import { useRouter, usePathname } from "next/navigation";
import { FiArrowLeft, FiPlus, FiCode, FiLogOut, FiLogIn, FiMenu, FiX } from "react-icons/fi";
import Logo from "./Logo";
import { useAuth } from "./AuthContext";
import { createClient } from "@/lib/supabase";
import { getAll } from "@/lib/storage";
import { useEffect, useState, useRef } from "react";

export default function Navbar() {
  const router   = useRouter();
  const pathname = usePathname();
  const isHome   = pathname === "/";
  const { user } = useAuth();
  const [count, setCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!user) { setCount(0); return; }
    getAll(user.uid).then((data) => setCount(data.length));
  }, [user, pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  };

  const handleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    });
  };

  const nav = (path) => { router.push(path); setMenuOpen(false); };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Logo />

        {/* ── Desktop nav ── */}
        <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <a
            href={process.env.NEXT_PUBLIC_DEVFOLIO_URL || 'https://dev-folio-two-rho.vercel.app'}
            className="btn btn-ghost"
            style={{ fontSize: 12, padding: "5px 10px" }}
          >
            ↩ DevFolio
          </a>
          {user && (
            <>
              {!isHome && (
                <button className="btn btn-ghost" onClick={() => router.push("/")}>
                  <FiArrowLeft size={14} />
                  <span className="btn-text">Snippets</span>
                  {count > 0 && (
                    <span style={{
                      background: "var(--bg4)", color: "var(--t2)", borderRadius: 20,
                      padding: "1px 7px", fontSize: 11, fontWeight: 700,
                    }}>
                      {count}
                    </span>
                  )}
                </button>
              )}
              <button className="btn btn-secondary" onClick={() => router.push("/compare")}>
                <FiCode size={14} />
                <span className="btn-text">Compare</span>
              </button>
              <button className="btn btn-primary" onClick={() => router.push("/new")}>
                <FiPlus size={15} />
                <span className="btn-text">New Snippet</span>
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 4 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--accent2), var(--purple))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 800, color: "#fff", flexShrink: 0,
                }}>
                  {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                </div>
                <button className="btn btn-ghost btn-icon" onClick={handleLogout} title="Logout">
                  <FiLogOut size={14} />
                </button>
              </div>
            </>
          )}
          {!user && (
            <button className="btn btn-primary" onClick={handleLogin}>
              <FiLogIn size={14} />
              <span className="btn-text">Sign In</span>
            </button>
          )}
        </div>

        {/* ── Mobile nav ── */}
        <div className="nav-mobile" ref={menuRef} style={{ display: "none", alignItems: "center", gap: 8 }}>
          <button className="btn btn-primary btn-icon" onClick={() => nav("/new")} title="New Snippet">
            <FiPlus size={16} />
          </button>
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => setMenuOpen(!menuOpen)}
            title="Menu"
          >
            {menuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>

          {menuOpen && (
            <div className="mobile-menu" style={{
              position: "absolute", top: "100%", right: 0,
              width: 220, background: "var(--bg2)",
              border: "1px solid var(--border)", borderRadius: 12,
              boxShadow: "0 16px 48px rgba(0,0,0,.5)",
              overflow: "hidden", zIndex: 300,
              animation: "popIn .15s ease both",
            }}>
              {user && (
                <>
                  {/* User info */}
                  <div style={{
                    padding: "14px 16px", borderBottom: "1px solid var(--border2)",
                    display: "flex", alignItems: "center", gap: 10,
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: "linear-gradient(135deg, var(--accent2), var(--purple))",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 800, color: "#fff", flexShrink: 0,
                    }}>
                      {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--t1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {user.displayName || user.email}
                      </div>
                    </div>
                  </div>

                  {!isHome && (
                    <button className="mobile-menu-item" onClick={() => nav("/")}>
                      <FiArrowLeft size={15} />
                      <span>Snippets</span>
                      {count > 0 && (
                        <span style={{
                          background: "var(--bg4)", color: "var(--t2)", borderRadius: 20,
                          padding: "1px 7px", fontSize: 11, fontWeight: 700, marginLeft: "auto",
                        }}>
                          {count}
                        </span>
                      )}
                    </button>
                  )}
                  <button className="mobile-menu-item" onClick={() => nav("/compare")}>
                    <FiCode size={15} />
                    <span>Compare Code</span>
                  </button>
                  <div style={{ borderTop: "1px solid var(--border2)" }}>
                    <button className="mobile-menu-item" onClick={() => { handleLogout(); setMenuOpen(false); }}
                      style={{ color: "var(--red)" }}
                    >
                      <FiLogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}

              {!user && (
                <button className="mobile-menu-item" onClick={() => { handleLogin(); setMenuOpen(false); }}>
                  <FiLogIn size={15} />
                  <span>Sign In with GitHub</span>
                </button>
              )}
              <a href={process.env.NEXT_PUBLIC_DEVFOLIO_URL || 'https://dev-folio-two-rho.vercel.app'} className="mobile-menu-item">
                <span>↩ DevFolio</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
