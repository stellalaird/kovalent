import { useState } from "react";
import { T } from "../styles/theme";
import { useApp } from "../context/AppContext";
import Avatar from "../components/Avatar";
import { CURRENT_USER } from "../data/mockData";

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Grad"];

const inputStyle = {
  width: "100%", boxSizing: "border-box",
  borderRadius: 12, border: `1.5px solid ${T.border}`,
  padding: "11px 14px", fontSize: 15, outline: "none",
  color: T.text, background: T.surface,
  letterSpacing: "-0.01em", transition: "border-color 0.15s",
  fontFamily: "inherit",
};

export default function WelcomeScreen() {
  const { loginAsMJ, signUp } = useApp();
  const [view, setView] = useState("home"); // "home" | "signup"
  const [form, setForm] = useState({ name: "", year: "1st Year", major: "", gender: "", bio: "", contact: "" });
  const [errors, setErrors] = useState({});

  function set(key, val) { setForm(p => ({ ...p, [key]: val })); }

  function handleSignUp() {
    const e = {};
    if (!form.name.trim()) e.name = true;
    if (!form.major.trim()) e.major = true;
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    signUp(form);
  }

  if (view === "signup") {
    return (
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 20px 40px" }}>
        <button
          onClick={() => setView("home")}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}
        >
          <span style={{ fontSize: 18, color: T.muted }}>←</span>
          <span style={{ fontSize: 14, color: T.muted, fontWeight: 600 }}>Back</span>
        </button>

        <div style={{ fontFamily: T.fontDisplay, fontWeight: 900, fontSize: 26, color: T.text, letterSpacing: "-0.04em", marginBottom: 6 }}>
          Create your profile
        </div>
        <div style={{ fontSize: 14, color: T.muted, marginBottom: 28, lineHeight: 1.5 }}>
          You'll start with 3 tokens — earn more by teaching.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { label: "Full Name *", key: "name", placeholder: "Your name" },
            { label: "Major *", key: "major", placeholder: "e.g. Computer Science" },
            { label: "Gender / Pronouns", key: "gender", placeholder: "e.g. She/Her" },
            { label: "Email", key: "contact", placeholder: "you@northwestern.edu" },
            { label: "Bio", key: "bio", placeholder: "Tell the community a little about yourself…", multiline: true },
          ].map(({ label, key, placeholder, multiline }) => (
            <div key={key}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                {label}
              </div>
              {multiline ? (
                <textarea
                  value={form[key]}
                  onChange={e => set(key, e.target.value)}
                  placeholder={placeholder}
                  rows={3}
                  style={{ ...inputStyle, resize: "none", borderColor: errors[key] ? T.danger : T.border }}
                  onFocus={e => e.target.style.borderColor = T.cardBorderBright}
                  onBlur={e => e.target.style.borderColor = errors[key] ? T.danger : T.border}
                />
              ) : (
                <input
                  value={form[key]}
                  onChange={e => set(key, e.target.value)}
                  placeholder={placeholder}
                  style={{ ...inputStyle, borderColor: errors[key] ? T.danger : T.border }}
                  onFocus={e => e.target.style.borderColor = T.cardBorderBright}
                  onBlur={e => e.target.style.borderColor = errors[key] ? T.danger : T.border}
                />
              )}
              {errors[key] && <div style={{ fontSize: 12, color: T.danger, marginTop: 4 }}>Required</div>}
            </div>
          ))}

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
              Year
            </div>
            <select
              value={form.year}
              onChange={e => set("year", e.target.value)}
              style={{
                ...inputStyle,
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
                cursor: "pointer",
              }}
            >
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        <button
          onClick={handleSignUp}
          style={{
            marginTop: 32, width: "100%", padding: "15px 0",
            background: T.purpleGradient, border: "none", borderRadius: 14,
            fontSize: 16, fontWeight: 800, color: "#fff",
            cursor: "pointer", letterSpacing: "-0.02em",
            boxShadow: T.btnPrimaryShadow, fontFamily: T.fontDisplay,
          }}
        >
          Join Kovalent
        </button>
      </div>
    );
  }

  // Home view
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "48px 24px 40px", overflowY: "auto" }}>
      {/* Logo / wordmark */}
      <div style={{ marginBottom: 40 }}>
        <div style={{
          fontFamily: T.fontDisplay, fontWeight: 900, fontSize: 38,
          letterSpacing: "-0.05em", lineHeight: 1,
          background: T.purpleGradient,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>
          Welcome to
        </div>
        <div style={{
          fontFamily: T.fontDisplay, fontWeight: 900, fontSize: 38,
          letterSpacing: "-0.05em", lineHeight: 1,
          background: T.purpleGradient,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>
          Kovalent
        </div>
        <div style={{ fontSize: 13, color: T.muted, marginTop: 12, lineHeight: 1.6, fontWeight: 400 }}>
          Refresh this web-app at any point to return to this page
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* MJ demo card */}
        <button
          onClick={loginAsMJ}
          style={{
            background: T.card, border: `1.5px solid ${T.cardBorderBright}`,
            borderRadius: 16, padding: "18px 20px",
            cursor: "pointer", textAlign: "left",
            boxShadow: T.cardGlow,
            display: "flex", alignItems: "center", gap: 16,
            transition: "transform 0.12s",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.01)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          <Avatar user={CURRENT_USER} size={52} ring />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, marginBottom: 3, letterSpacing: "0.02em", textTransform: "uppercase" }}>
              Prefilled user
            </div>
            <div style={{ fontFamily: T.fontDisplay, fontWeight: 900, fontSize: 18, color: T.text, letterSpacing: "-0.03em", lineHeight: 1.2 }}>
              {CURRENT_USER.name}
            </div>
            <div style={{ fontSize: 12, color: T.textMid, marginTop: 3, fontWeight: 500 }}>
              {CURRENT_USER.year} · {CURRENT_USER.major}
            </div>
          </div>
          <span style={{ fontSize: 20, color: T.muted }}>→</span>
        </button>

        {/* New user */}
        <button
          onClick={() => setView("signup")}
          style={{
            background: T.purpleGradient, border: "none",
            borderRadius: 16, padding: "18px 20px",
            cursor: "pointer", textAlign: "left",
            boxShadow: T.btnPrimaryShadow,
            display: "flex", alignItems: "center", gap: 14,
            transition: "transform 0.12s",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.01)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          <div style={{
            width: 52, height: 52, borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, flexShrink: 0,
          }}>
            ✦
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: T.fontDisplay, fontWeight: 900, fontSize: 18, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.2 }}>
              Create my own profile
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 3, fontWeight: 500 }}>
              Start with 3 tokens
            </div>
          </div>
          <span style={{ fontSize: 20, color: "rgba(255,255,255,0.7)" }}>→</span>
        </button>
      </div>
    </div>
  );
}
