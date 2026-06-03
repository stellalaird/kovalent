import { useState } from "react";
import { useApp } from "../context/AppContext";
import { T } from "../styles/theme";
import Badge from "../components/Badge";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import TokenBadge from "../components/TokenBadge";

export default function ProfilePage() {
  const { profile, setProfile } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);

  function save() { setProfile(form); setEditing(false); }

  const stats = [
    { icon: "🎓", label: "Taught",  value: profile.taught  },
    { icon: "📖", label: "Learned", value: profile.learned },
    { icon: "🤝", label: "Meetups", value: profile.meetups },
    { icon: "★",  label: "Rating",  value: profile.rating  },
  ];

  return (
    <div>
      <PageHeader>
        <div style={{ fontFamily: T.fontDisplay, fontSize: 24, fontWeight: 900, color: T.text, letterSpacing: "-0.04em", paddingBottom: 16 }}>
          Profile
        </div>
      </PageHeader>

      <div style={{ padding: "22px 16px 28px" }}>
        {/* Avatar row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <div style={{
            width: 76, height: 76, borderRadius: "50%",
            background: profile.color,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 900, fontSize: 26, fontFamily: T.fontDisplay,
            boxShadow: `0 0 0 2px ${T.card}, 0 0 0 4px rgba(180,140,40,0.6), 0 0 24px rgba(180,140,40,0.3)`,
            flexShrink: 0,
          }}>
            {profile.avatar}
          </div>
          <div>
            <div style={{ fontFamily: T.fontDisplay, fontWeight: 900, fontSize: 22, color: T.text, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              {profile.name}
            </div>
            <div style={{ fontSize: 13, color: T.textMid, marginTop: 4, fontWeight: 500 }}>
              {profile.year} · {profile.major}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
          <TokenBadge count={profile.tokens} />
          <Badge color={T.textMid} bg={T.surface}>{profile.gender}</Badge>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
          {stats.map(({ icon, label, value }) => (
            <Card key={label} style={{ borderTop: `2px solid ${T.purple}`, boxShadow: `${T.cardShadow}, 0 0 16px rgba(180,140,40,0.06)` }}>
              <div style={{ padding: "16px 14px 14px" }}>
                <div style={{ fontSize: 20, marginBottom: 8 }}>{icon}</div>
                <div style={{
                  fontFamily: T.fontDisplay, fontWeight: 900, fontSize: 28,
                  letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 4,
                  background: T.purpleGradient,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>
                  {value}
                </div>
                <div style={{ fontSize: 11, color: T.muted, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</div>
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
            {[["Name","name"],["Year","year"],["Major","major"],["Gender","gender"],["Bio","bio"],["Contact","contact"]].map(([label, key]) => (
              <div key={key} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 5 }}>
                  {label}
                </div>
                {editing ? (
                  <input
                    value={form[key] || ""}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    style={{
                      width: "100%", borderRadius: 10, border: `1px solid ${T.border}`,
                      padding: "9px 13px", fontSize: 14, outline: "none",
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
