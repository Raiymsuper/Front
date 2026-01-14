// src/pages/Dashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/Dashboard.css";

const API_BASE = "http://127.0.0.1:8000";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function initials(name) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] || "S";
  const b = parts[1]?.[0] || "C";
  return (a + b).toUpperCase();
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [me, setMe] = useState(null);
  const [labs, setLabs] = useState([]);
  const [q, setQ] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" }); // type: "", "err"

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setMsg({ text: "", type: "" });

        // profile (optional, but nice for UI). If you don't have /users/me yet, remove this block.
        try {
          const meRes = await fetch(`${API_BASE}/users/me`, { headers: { ...authHeaders() } });
          if (meRes.ok) {
            const meJson = await meRes.json();
            setMe(meJson);
            localStorage.setItem("name", meJson.full_name || "");
            localStorage.setItem("pnumber", meJson.pnumber || "");
            localStorage.setItem("role", meJson.role || "");
          } else {
            // fallback from localStorage
            setMe({
              full_name: localStorage.getItem("name") || "User",
              pnumber: localStorage.getItem("pnumber") || "P-XXXXXXX",
              role: localStorage.getItem("role") || "student",
            });
          }
        } catch {
          setMe({
            full_name: localStorage.getItem("name") || "User",
            pnumber: localStorage.getItem("pnumber") || "P-XXXXXXX",
            role: localStorage.getItem("role") || "student",
          });
        }

        // load resources
        const res = await fetch(`${API_BASE}/resources`);
        const data = await res.json().catch(() => []);
        if (!res.ok) {
          throw new Error((data && data.detail) || "Failed to load resources");
        }

        const onlyLabs = (Array.isArray(data) ? data : []).filter((r) => String(r.type).toLowerCase() === "lab");
        setLabs(onlyLabs);
      } catch (e) {
        setMsg({ text: String(e.message || e), type: "err" });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredLabs = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return labs;
    return labs.filter((r) => (r.name || "").toLowerCase().includes(qq));
  }, [labs, q]);

  const toggleMobileMenu = () => setMobileOpen((v) => !v);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const todayText = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  }, []);

  return (
    <>
      <header className="nav">
        <div className="nav__inner">
          <Link className="brand" to="/dashboard">
            <span className="brand__dot"></span>
            Smart Campus
          </Link>

          <div className="nav__actions">
            <span className="btn btn--soft" style={{ cursor: "default" }}>
              📅 <span>{todayText}</span>
            </span>

            <Link className="btn btn--ghost" to="/my-bookings">
              My bookings
            </Link>

            <button className="btn btn--ghost" onClick={logout} type="button">
              Logout
            </button>
          </div>

          <button className="burger" aria-label="Open menu" onClick={toggleMobileMenu}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <div className={`mobile ${mobileOpen ? "mobile--open" : ""}`} id="mobileMenu">
          <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
            Dashboard
          </Link>
          <Link to="/my-bookings" onClick={() => setMobileOpen(false)}>
            My bookings
          </Link>
          <Link to="/catalog" onClick={() => setMobileOpen(false)}>
            Catalog
          </Link>
          <Link to="/booking" onClick={() => setMobileOpen(false)}>
            Booking
          </Link>
          <div className="mobile__cta">
            <button className="btn btn--ghost" onClick={logout} type="button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="page">
        <div className="dashTop">
          <div className="dashTitle">
            <h1>Available Labs</h1>
            <p>Choose a lab and create a booking request.</p>
          </div>

          <div className="profileMini">
            <div className="avatar">{initials(me?.full_name || "User")}</div>
            <div>
              <div className="pname">{me?.full_name || "User"}</div>
              <div className="psub">
                {(me?.pnumber || "P-XXXXXXX")} • {(me?.role || "student")}
              </div>
            </div>
          </div>
        </div>

        <div className="filters">
          <div className="search">
            🔎{" "}
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search labs by name…"
            />
          </div>

          <button className="btn btn--soft" type="button" onClick={() => navigate("/catalog?type=lab")}>
            View all in catalog
          </button>
        </div>

        {msg.text ? <div className={`msg ${msg.type ? `msg--${msg.type}` : ""}`}>{msg.text}</div> : null}

        <div className="list">
          {loading ? (
            <div className="sub" style={{ padding: "6px 2px" }}>
              Loading…
            </div>
          ) : filteredLabs.length === 0 ? (
            <div className="sub" style={{ padding: "6px 2px" }}>
              No labs found.
            </div>
          ) : (
            filteredLabs.map((lab) => (
              <div key={lab.id} className="item">
                <div className="ico">🧪</div>

                <div className="meta">
                  <div className="name">{lab.name}</div>
                  <div className="sub">Resource ID: #{lab.id}</div>
                </div>

                <div className="actions">
                  <button
                    className="btn btn--primary"
                    type="button"
                    onClick={() => navigate(`/booking?resource_id=${lab.id}`)}
                  >
                    Book
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <footer className="footer" style={{ marginTop: 18 }}>
          <div className="footer__inner">
            <span>© 2026 Smart Campus Booking</span>
            <span className="footer__muted">Dashboard</span>
          </div>
        </footer>
      </main>
    </>
  );
}
