"use client";
import { useRouter, usePathname } from "next/navigation";
import { FiArrowLeft, FiPlus, FiCode, FiLogOut, FiLogIn } from "react-icons/fi";
import Logo from "./Logo";
import { useAuth } from "./AuthContext";
import { logout } from "@/lib/auth";
import { getAll } from "@/lib/storage";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router   = useRouter();
  const pathname = usePathname();
  const isHome   = pathname === "/";
  const isLogin  = pathname === "/login";
  const { user, configured } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user) { setCount(0); return; }
    getAll(user.uid).then((data) => setCount(data.length));
  }, [user, pathname]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Logo />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* When logged in */}
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

              {/* User avatar + logout */}
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

          {/* When not logged in and Firebase is configured */}
          {!user && configured && !isLogin && (
            <button className="btn btn-primary" onClick={() => router.push("/login")}>
              <FiLogIn size={14} />
              <span className="btn-text">Sign In</span>
            </button>
          )}

          {/* When Firebase is not configured — show nav without auth */}
          {!user && !configured && (
            <>
              {!isHome && (
                <button className="btn btn-ghost" onClick={() => router.push("/")}>
                  <FiArrowLeft size={14} />
                  <span className="btn-text">Snippets</span>
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
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
