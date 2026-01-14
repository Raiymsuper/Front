// src/pages/MyBookings.jsx  (refactored to your backend)
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/MyBookings.css";

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

function statusClass(s) {
  const v = String(s || "").toLowerCase();
  if (v === "approved") return "status--approved";
  if (v === "rejected") return "status--rejected";
  return "status--pending";
}

function iconByType(type) {
  if (type === "lab") return "🧪";
  if (type === "hall") return "🏛️";
  if (type === "sport") return "🏀";
  return "📌";
}

function isPastBooking(b) {
  // booking is past if date is before today OR (date is today and time_to is <= now)
  const now = new Date();
  const [y, m, d] = String(b.date).split("-").map(Number);
  const [hh, mm] = String(b.time_to).split(":").map(Number);

  const end = new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0);
  return end.getTime() <= now.getTime();
}

export default function MyBookings() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("current"); // current | past
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | pending | approved | rejected

  const [msg, setMsg] = useState({ text: "", type: "" }); // type: "", "err", "ok"

  const [me, setMe] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setMsg({ text: "", type: "" });

        const meRes = await fetch(`${API_BASE}/users/me`, { headers: { ...authHeaders() } });
        const meJson = await meRes.json().catch(() => ({}));
        if (!meRes.ok) throw new Error(meJson.detail || "Failed to load profile");
        setMe(meJson);

        // keep localStorage in sync (optional)
        localStorage.setItem("pnumber", meJson.pnumber || "");
        localStorage.setItem("name", meJson.full_name || "");
        localStorage.setItem("role", meJson.role || "");

        const bRes = await fetch(`${API_BASE}/me/bookings`, { headers: { ...authHeaders() } });
        const bJson = await bRes.json().catch(() => []);
        if (!bRes.ok) throw new Error((bJson && bJson.detail) || "Failed to load bookings");

        const mapped = (Array.isArray(bJson) ? bJson : []).map((b) => ({
          id: b.id,
          resource: b.resource || { name: "—", type: "" },
          date: b.date,
          time_from: b.time_from,
          time_to: b.time_to,
          purpose: b.purpose,
          status: b.status, // "pending" | "approved" | "rejected"
        }));

        setBookings(mapped);
      } catch (e) {
        setMsg({ text: String(e.message || e), type: "err" });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();

    const withPastFlag = bookings.map((b) => ({ ...b, is_past: isPastBooking(b) }));

    let base = withPastFlag.filter((b) => (activeTab === "current" ? !b.is_past : b.is_past));

    if (statusFilter !== "all") {
      base = base.filter((b) => String(b.status).toLowerCase() === statusFilter);
    }

    if (!qq) return base;

    return base.filter((b) => {
      const rn = (b.resource?.name || "").toLowerCase();
      const pur = (b.purpose || "").toLowerCase();
      const tp = (b.resource?.type || "").toLowerCase();
      return rn.includes(qq) || pur.includes(qq) || tp.includes(qq);
    });
  }, [bookings, activeTab, q, statusFilter]);

  const kpiUpcoming = useMemo(() => bookings.filter((b) => !isPastBooking(b)).length, [bookings]);
  const kpiTotal = bookings.length;

  const toggleMobileMenu = () => setMobileOpen((v) => !v);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const openDetails = (b) => {
    setMsg({
      text: `Booking #${b.id}: ${b.resource?.name}, ${b.date} ${b.time_from}-${b.time_to}. Status: ${String(
        b.status
      ).toUpperCase()}.`,
      type: "",
    });
  };

  const cancelBooking = async (b) => {
    setMsg({ text: "", type: "" });

    const past = isPastBooking(b);
    const canCancel = !past && String(b.status).toLowerCase() === "pending"; // only pending cancels
    if (!canCancel) return;

    try {
      const res = await fetch(`${API_BASE}/me/bookings/${b.id}/cancel`, {
        method: "POST",
        headers: { ...authHeaders() },
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMsg({ text: json.detail || "Cancel failed", type: "err" });
        return;
      }

      setBookings((prev) => prev.filter((x) => x.id !== b.id));
      setMsg({ text: "Booking cancelled.", type: "ok" });
    } catch {
      setMsg({ text: "Network error while cancelling. Check backend and CORS.", type: "err" });
    }
  };

  return (
    <>
      <header className="nav">
        <div className="nav__inner">
          <Link className="brand" to="/dashboard">
            <span className="brand__dot"></span>
            Smart Campus
          </Link>

          <nav className="menu" aria-label="Primary">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/catalog">Catalog</Link>
            <Link to="/booking">Booking</Link>
            <Link to="/my-bookings" style={{ color: "var(--ink)" }}>
              My account
            </Link>
          </nav>

          <div className="nav__actions">
            <button className="btn btn--ghost" onClick={logout} type="button">
              Logout
            </button>
          </div>

          <button className="burger" aria-label="Open menu" onClick={toggleMobileMenu}>
            <span></span><span></span><span></span>
          </button>
        </div>

        <div className={`mobile ${mobileOpen ? "mobile--open" : ""}`} id="mobileMenu">
          <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
            Dashboard
          </Link>
          <Link to="/catalog" onClick={() => setMobileOpen(false)}>
            Catalog
          </Link>
          <Link to="/booking" onClick={() => setMobileOpen(false)}>
            Booking
          </Link>
          <Link to="/my-bookings" onClick={() => setMobileOpen(false)}>
            My account
          </Link>
          <div className="mobile__cta">
            <button className="btn btn--ghost" onClick={logout} type="button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="page">
        <div className="top">
          <div className="title">
            <h1>My bookings</h1>
            <p>Manage your upcoming requests, view history, and track statuses.</p>
          </div>

          <div className="cta topCta">
            <Link className="btn btn--soft" to="/catalog">
              Browse resources
            </Link>
            <Link className="btn btn--primary" to="/booking">
              New booking
            </Link>
          </div>
        </div>

        <div className="grid">
          {/* LEFT: BOOKINGS */}
          <section className="panel">
            <div className="tabs">
              <button
                className={`tab ${activeTab === "current" ? "tab--active" : ""}`}
                onClick={() => setActiveTab("current")}
                type="button"
              >
                Current
              </button>
              <button
                className={`tab ${activeTab === "past" ? "tab--active" : ""}`}
                onClick={() => setActiveTab("past")}
                type="button"
              >
                Past
              </button>
            </div>

            <div className="filters">
              <div className="search">
                🔎{" "}
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by resource / type / purpose…" />
              </div>

              <select className="select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="list">
              {loading ? (
                <div className="sub" style={{ padding: "6px 2px" }}>Loading…</div>
              ) : filtered.length === 0 ? (
                <div className="sub" style={{ padding: "6px 2px" }}>No bookings found.</div>
              ) : (
                filtered.map((b) => {
                  const past = isPastBooking(b);
                  const canCancel = !past && String(b.status).toLowerCase() === "pending";
                  const ico = iconByType(b.resource?.type);

                  return (
                    <div className="item" key={b.id}>
                      <div className="ico">{ico}</div>
                      <div className="meta">
                        <div className="row1">
                          <div style={{ minWidth: 0 }}>
                            <div className="name">
                              {b.resource?.name}{" "}
                              <span className={`chip status ${statusClass(b.status)}`}>
                                {String(b.status).toUpperCase()}
                              </span>
                            </div>
                            <div className="sub">
                              {b.date} • {b.time_from}–{b.time_to}
                            </div>
                          </div>

                          <div className="actions">
                            <button className="btnSmall" type="button" onClick={() => openDetails(b)}>
                              Details
                            </button>
                            <button
                              className="btnSmall btnSmall--danger"
                              type="button"
                              disabled={!canCancel}
                              onClick={() => cancelBooking(b)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>

                        <div className="chips">
                          <span className="chip">Purpose: {b.purpose}</span>
                          <span className="chip">ID: #{b.id}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {msg.text ? <div className={`msg ${msg.type ? `msg--${msg.type}` : ""}`}>{msg.text}</div> : null}
          </section>

          {/* RIGHT: PROFILE */}
          <aside className="panel">
            <div className="profileTop">
              <div className="avatar">{initials(me?.full_name || "Smart Campus")}</div>
              <div>
                <div className="pname">{me?.full_name || "User"}</div>
                <div className="psub">
                  {(me?.pnumber || profileFallback("pnumber"))} • {(me?.role || profileFallback("role"))}
                </div>
              </div>
            </div>

            <div className="kpis">
              <div className="kpi">
                <div className="n">{kpiUpcoming}</div>
                <div className="t">Upcoming</div>
              </div>
              <div className="kpi">
                <div className="n">{kpiTotal}</div>
                <div className="t">Total</div>
              </div>
            </div>

            <div className="quick">
              <Link to="/booking">
                Create booking <span>›</span>
              </Link>
              <Link to="/catalog">
                Check availability <span>›</span>
              </Link>
              <Link to="/dashboard">
                Go to dashboard <span>›</span>
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

function profileFallback(key) {
  if (key === "pnumber") return localStorage.getItem("pnumber") || "P-XXXXXXX";
  if (key === "role") return localStorage.getItem("role") || "student";
  return "";
}
