import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Breadcrumb } from "../components/CommonUI";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setMsg({ type: "error", text: "Please fill in both fields." });
      return;
    }
    setMsg({
      type: "ok",
      text: "Login button works! (Demo only - no real account was checked.)",
    });
  };

  return (
    <div className="login-page">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Login" },
        ]}
      />

      <section className="auth-page">
        <div className="auth-box form-box">
          <h1>Welcome Back</h1>
          <p style={{ color: "var(--muted)" }}>Login to your FandomVerse account</p>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="login-email">Email</label>
              <input
                type="email"
                id="login-email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <div style={{ display: "flex", gap: "6px" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="login-password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="icon-btn"
                  style={{ flexShrink: 0, marginTop: "4px" }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <label style={{ fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
              <input type="checkbox" /> Remember me
            </label>

            <button
              className="btn"
              type="submit"
              style={{ width: "100%", justifyContent: "center", marginTop: "15px" }}
            >
              Login
            </button>

            {msg.text && <p className={`form-msg ${msg.type}`}>{msg.text}</p>}
          </form>

          <p style={{ marginTop: "15px" }}>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
          <p className="demo-note">
            Login is UI only for this project. It does not check or store any account.
          </p>
        </div>
      </section>
    </div>
  );
}
