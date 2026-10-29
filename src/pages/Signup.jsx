import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Breadcrumb } from "../components/CommonUI";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    fav: "Anime",
    password: "",
    confirm: "",
  });
  const [msg, setMsg] = useState({ type: "", text: "" });

  const handleSignup = (e) => {
    e.preventDefault();
    const { name, email, password, confirm } = formData;

    if (!name.trim() || !email.trim() || !password) {
      setMsg({ type: "error", text: "Please fill in all fields." });
      return;
    }
    if (password.length < 6) {
      setMsg({ type: "error", text: "Password should be at least 6 characters." });
      return;
    }
    if (password !== confirm) {
      setMsg({ type: "error", text: "Passwords do not match." });
      return;
    }

    setMsg({
      type: "ok",
      text: `Welcome ${name}! (Demo only - no account was created and nothing was saved.)`,
    });
    setFormData({ name: "", email: "", fav: "Anime", password: "", confirm: "" });
  };

  return (
    <div className="signup-page">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Sign Up" },
        ]}
      />

      <section className="auth-page">
        <div className="auth-box form-box">
          <h1>Join FandomVerse</h1>
          <p style={{ color: "var(--muted)" }}>Create your free fan account</p>

          <form onSubmit={handleSignup}>
            <div className="form-group">
              <label htmlFor="su-name">Full name</label>
              <input
                type="text"
                id="su-name"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="su-email">Email</label>
              <input
                type="email"
                id="su-email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="su-fav">Favourite fandom</label>
              <select
                id="su-fav"
                value={formData.fav}
                onChange={(e) => setFormData({ ...formData, fav: e.target.value })}
              >
                <option value="Anime">Anime</option>
                <option value="Gaming">Gaming</option>
                <option value="Movies">Movies</option>
                <option value="TV Shows">TV Shows</option>
                <option value="K-Pop">K-Pop</option>
                <option value="Comics">Comics</option>
                <option value="Manga">Manga</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="su-password">Password</label>
              <input
                type="password"
                id="su-password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="su-confirm">Confirm password</label>
              <input
                type="password"
                id="su-confirm"
                placeholder="Type it again"
                value={formData.confirm}
                onChange={(e) => setFormData({ ...formData, confirm: e.target.value })}
              />
            </div>

            <button
              className="btn"
              type="submit"
              style={{ width: "100%", justifyContent: "center" }}
            >
              Create account
            </button>

            {msg.text && <p className={`form-msg ${msg.type}`}>{msg.text}</p>}
          </form>

          <p style={{ marginTop: "15px" }}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
          <p className="demo-note">
            Sign up is UI only for this project. No account is created and nothing is saved.
          </p>
        </div>
      </section>
    </div>
  );
}
