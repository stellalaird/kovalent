import { useState } from "react";

// ─── APP STATE CONTEXT ───────────────────────────────────────
import { useApp } from "../context/AppContext";

// ─── STYLES ──────────────────────────────────────────────────
import { T } from "../styles/theme";

// ─── UTILITY COMPONENTS ──────────────────────────────────────
import Badge from "../components/Badge";
import Card from "../components/Card";
import TokenBadge from "../components/TokenBadge";

export default function ProfilePage() {
  const { profile, setProfile, showToast } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);

  function save() {
    setProfile(form);
    setEditing(false);
    showToast("Profile updated!");
  }

  const stats = [
    { icon: "🎓", label: "Taught",  value: profile.taught },
    { icon: "📖", label: "Learned", value: profile.learned },
    { icon: "🤝", label: "Meetups", value: profile.meetups },
    { icon: "★",  label: "Rating",  value: profile.rating },
  ];

  return (
    <div>
      {/* Banner */}
      <div style={{
        background: `linear-gradient(140deg, #7C3AED 0%, ${T.purpleDeep} 55%, #1E0A4C 100%)`,
        padding: "28px 16px 84px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Subtle radial highlight */}
        <div style={{
          position: "absolute", top: -40, right: -40,
          width: 180, height: 180, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.10) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
      </div>

      <div style={{ padding: "0 16px", marginTop: -64 }}>
        {/* Avatar + name row */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 14, marginBottom: 14 }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: profile.color,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 800, fontSize: 26,
            boxShadow: `0 0 0 3px #fff, 0 0 0 5.5px ${T.purple}, 0 4px 16px rgba(0,0,0,0.18)`,
            flexShrink: 0,
          }}>{profile.avatar}</div>
          <div style={{ paddingBottom: 4 }}>
            <div style={{ fontWeight: 800, fontSize: 20, color: T.text, letterSpacing: "-0.02em" }}>{profile.name}</div>
            <div style={{ fontSize: 13, color: T.textMid, marginTop: 2 }}>{profile.year} · {profile.major}</div>
          </div>
        </div>

        {/* Token + gender badges */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <TokenBadge count={profile.tokens} />
          <Badge color={T.textMid} bg={T.purpleLight}>{profile.gender}</Badge>
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {stats.map(({ icon, label, value }) => (
            <Card key={label}>
              <div style={{ padding: "14px 14px 12px" }}>
                <div style={{ fontSize: 18, marginBottom: 6 }}>{icon}</div>
                <div style={{ fontWeight: 800, fontSize: 20, color: T.purple, letterSpacing: "-0.02em" }}>{value}</div>
                <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{label}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Edit profile card */}
        <Card style={{ marginBottom: 24 }}>
          <div style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: T.text }}>Profile Info</div>
              <button
                onClick={() => editing ? save() : setEditing(true)}
                style={{
                  background: editing ? T.purpleGradient : T.purpleFaint,
                  border: "none",
                  borderRadius: 10,
                  padding: "6px 16px",
                  fontSize: 13,
                  fontWeight: 700,
                  color: editing ? "#fff" : T.purple,
                  cursor: "pointer",
                  boxShadow: editing ? T.btnPrimaryShadow : "none",
                  transition: "all 0.15s",
                }}
              >
                {editing ? "Save" : "Edit"}
              </button>
            </div>
            {[
              ["Name", "name"], ["Year", "year"], ["Major", "major"],
              ["Gender", "gender"], ["Bio", "bio"], ["Contact", "contact"],
            ].map(([label, key]) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>
                  {label}
                </div>
                {editing ? (
                  <input
                    value={form[key] || ""}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    style={{
                      width: "100%", borderRadius: 10,
                      border: `1.5px solid ${T.border}`,
                      padding: "8px 12px", fontSize: 14,
                      outline: "none", boxSizing: "border-box",
                      color: T.text, background: T.purpleFaint,
                    }}
                  />
                ) : (
                  <div style={{ fontSize: 14, color: T.text }}>{profile[key] || "—"}</div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
