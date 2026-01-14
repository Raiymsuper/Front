// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/Register.css";

const API_BASE = "http://127.0.0.1:8000";

export default function Register() {
  const navigate = useNavigate();

  const [pnumber, setPnumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("student");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setOk("");

    const pn = pnumber.trim();
    const fn = fullName.trim();
    const pw = password.trim();

    if (!pn || !fn || !pw) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      // Backend register currently expects query params
      const params = new URLSearchParams({
        pnumber: pn,
        full_name: fn,
        password: pw,
        role,
      });

      const res = await fetch(`${API_BASE}/auth/register?${params.toString()}`, {
        method: "POST",
      });

      if (!res.ok) {
        let msg = `Registration failed (${res.status}).`;
        try {
          const data = await res.json();
          if (data?.detail) msg = data.detail;
        } catch {
          // ignore
        }
        setError(msg);
        return;
      }

      setOk("Account created successfully. Redirecting to sign in…");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      console.error(err);
      setError("Network error. Is FastAPI running?");
    }
  };

  return (
    <>
      <header className="nav">
        <div className="nav__inner">
          <Link className="brand" to="/">
            <span className="brand__dot"></span>
            Smart Campus
          </Link>
          <div className="nav__actions">
            <Link className="btn btn--ghost" to="/login">
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <main className="authWrap">
        <section className="authCard">
          <div className="authHead">
            <h1>Create account</h1>
            <p>Register to book campus resources.</p>
          </div>

          <form onSubmit={submit}>
            <div className="field">
              <label htmlFor="pnumber">P-number</label>
              <input
                id="pnumber"
                value={pnumber}
                onChange={(e) => setPnumber(e.target.value)}
                placeholder="P1234567"
                autoComplete="username"
              />
            </div>

            <div className="field">
              <label htmlFor="full_name">Full name</label>
              <input
                id="full_name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Temirlan Omarov"
                autoComplete="name"
              />
            </div>

            <div className="field">
              <label htmlFor="role">Role</label>
              <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="staff">Staff</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="secret123"
                autoComplete="new-password"
              />
            </div>

            {error ? <div className="err">{error}</div> : null}
            {ok ? <div className="ok">{ok}</div> : null}

            <div className="actions">
              <button className="btn btn--primary btn--lg" type="submit">
                Register
              </button>
            </div>
          </form>

          <div className="mini">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </section>
      </main>
    </>
  );
}
