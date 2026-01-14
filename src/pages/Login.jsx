// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./css/Login.css";

const API_BASE = "http://127.0.0.1:8000";

export default function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("student"); // UI-only
  const [pnumber, setPnumber] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setOk("");

    const pn = pnumber.trim();
    const pw = password.trim();

    if (!pn || !pw) {
      setError("Please enter P-number and password.");
      return;
    }

    try {
      // FastAPI OAuth2PasswordRequestForm -> application/x-www-form-urlencoded
      const body = new URLSearchParams();
      body.append("username", pn); // username = pnumber
      body.append("password", pw);

      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });

      if (!res.ok) {
        let msg = `Login failed (${res.status}). Check credentials.`;
        try {
          const data = await res.json();
          if (data?.detail) msg = data.detail;
        } catch {
          // ignore
        }
        setError(msg);
        return;
      }

      const data = await res.json();
      if (!data?.access_token) {
        setError("Login failed: no access_token returned.");
        return;
      }

      // store token for later API calls
      localStorage.setItem("auth", "true");
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("token_type", data.token_type || "bearer");

      // UI-only (backend determines role from token)
      localStorage.setItem("role", role);
      localStorage.setItem("pnumber", pn);

      setOk("Success. Redirecting…");

      // redirect to dashboard route (create this route)
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Pnumber or password is invalid.");
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
            <Link className="btn btn--ghost" to="/">
              Back
            </Link>
          </div>
        </div>
      </header>

      <main className="authWrap">
        <section className="authCard">
          <div className="authHead">
            <h1>Sign-in</h1>
          </div>

          <form onSubmit={submit}>
            <div className="row">

              <div className="field">
                <label htmlFor="pnumber">P-number</label>
                <input
                  id="pnumber"
                  value={pnumber}
                  onChange={(e) => setPnumber(e.target.value)}
                  placeholder="e.g. P1234567"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="secret123"
                autoComplete="current-password"
              />
            </div>

            {error ? <div className="err">{error}</div> : null}
            {ok ? <div className="okbox">{ok}</div> : null}

            <div className="authActions">
              <button className="btn btn--primary" type="submit">
                Sign in
              </button>
            </div>
          </form>

          <div className="mini">
            <span>Need an account?</span>
            <Link to="/register">Register</Link>
          </div>
        </section>
      </main>
    </>
  );
}
