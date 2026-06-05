import { T } from "../styles/theme";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import Avatar from "../components/Avatar";
import Badge from "../components/Badge";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import TokenBadge from "../components/TokenBadge";

export default function ProfilePage() {
  const { profile, setProfile, mySessions, privacy, setTab } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);

  function save() {
    const seed = (form.name || "user").replace(/\s+/g, "");
    setProfile({ ...form, photo: `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}` });
    setEditing(false);
  }

  const rating = profile.rating;

  const completed = mySessions.filter(s => s.status === "completed");
  const taughtCount  = completed.filter(s => s.myRole === "teacher").length;
  const learnedCount = completed.filter(s => s.type !== "collab" && s.myRole !== "teacher").length;
  const collabsCount = completed.filter(s => s.type === "collab").length;

  const stats = [
    { icon: "🎓", label: "Taught",  value: taughtCount  },
    { icon: "📖", label: "Learned", value: learnedCount },
    { icon: "🤝", label: "Collabs", value: collabsCount },
  ];

  return (
    <div>
      <PageHeader>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 16 }}>
          <div style={{ fontFamily: T.fontDisplay, fontSize: 24, fontWeight: 900, color: T.text, letterSpacing: "-0.04em" }}>
            Profile
          </div>
          <button
            onClick={() => setTab("settings")}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: 4, display: "flex", flexDirection: "column",
              gap: 4, alignItems: "center", justifyContent: "center",
            }}
          >
            <span style={{ display: "block", width: 20, height: 2, borderRadius: 2, background: T.text }} />
            <span style={{ display: "block", width: 20, height: 2, borderRadius: 2, background: T.text }} />
            <span style={{ display: "block", width: 20, height: 2, borderRadius: 2, background: T.text }} />
          </button>
        </div>
      </PageHeader>

      <div style={{ padding: "22px 16px 28px" }}>
        {/* Avatar row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <Avatar user={profile} size={76} ring />
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontFamily: T.fontDisplay, fontWeight: 900, fontSize: 22, color: T.text, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                {profile.name}
              </span>
              {profile.gender && <span style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>{profile.gender}</span>}
            </div>
            <div style={{ fontSize: 13, color: T.textMid, marginTop: 4, fontWeight: 500 }}>
              {profile.year} · {profile.major}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
          <TokenBadge count={profile.tokens} showLabel />
          {privacy.showRating && <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: T.goldBg, color: T.gold,
            padding: "5px 12px", borderRadius: 999,
            fontSize: 13, fontWeight: 700, letterSpacing: "-0.01em",
            border: `1px solid ${T.goldBorder}`,
            boxShadow: "0 0 12px rgba(245,158,11,0.2)",
          }}>★ {rating} teach rating</span>}
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 22 }}>
          {stats.map(({ icon, label, value }) => (
            <Card key={label} style={{ borderTop: `2px solid ${T.purple}` }}>
              <div style={{ padding: "14px 12px 12px" }}>
                <div style={{ fontSize: 18, marginBottom: 6 }}>{icon}</div>
                <div style={{
                  fontFamily: T.fontDisplay, fontWeight: 900, fontSize: 22,
                  letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 4,
                  background: T.purpleGradient,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>
                  {value}
                </div>
                <div style={{ fontSize: 10, color: T.muted, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Profile info */}
        <Card>
          <div style={{ padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 16, color: T.text, letterSpacing: "-0.02em" }}>
                Profile Info
              </div>
              <button
                onClick={() => editing ? save() : setEditing(true)}
                style={{
                  background: editing ? T.purpleGradient : T.surface,
                  border: editing ? "none" : `1px solid ${T.border}`,
                  borderRadius: 10, padding: "7px 18px", fontSize: 13, fontWeight: 700,
                  color: editing ? "#fff" : T.purple,
                  cursor: "pointer",
                  boxShadow: editing ? T.btnPrimaryShadow : "none",
                  transition: "all 0.15s", letterSpacing: "-0.01em",
                }}
              >
                {editing ? "Save" : "Edit"}
              </button>
            </div>
            {[["Name","name"],["Pronouns","gender"],["Year","year"],["Major","major"],["Bio","bio"],["Phone","phone"],["Email","contact"]].map(([label, key], i, arr) => (
              <div key={key} style={{ marginBottom: i === arr.length - 1 ? 0 : 16 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 5 }}>
                  {label}
                </div>
                {editing && key === "year" ? (
                  <select
                    value={form[key] || ""}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    style={{
                      width: "100%", borderRadius: 10, border: `1px solid ${T.border}`,
                      padding: "9px 13px", fontSize: 16, outline: "none",
                      boxSizing: "border-box", color: T.text, background: T.surface,
                      letterSpacing: "-0.01em", appearance: "none",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat", backgroundPosition: "right 13px center",
                      cursor: "pointer",
                    }}
                  >
                    {["1st Year","2nd Year","3rd Year","4th Year","Grad"].map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : editing ? (
                  <input
                    value={form[key] || ""}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    style={{
                      width: "100%", borderRadius: 10, border: `1px solid ${T.border}`,
                      padding: "9px 13px", fontSize: 16, outline: "none",
                      boxSizing: "border-box", color: T.text, background: T.surface,
                      transition: "border-color 0.15s", letterSpacing: "-0.01em",
                    }}
                    onFocus={e => e.target.style.borderColor = T.cardBorderBright}
                    onBlur={e => e.target.style.borderColor = T.border}
                  />
                ) : (
                  <div style={{ fontSize: 14, color: T.text, lineHeight: 1.6, letterSpacing: "-0.01em" }}>
                    {profile[key] || "—"}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
