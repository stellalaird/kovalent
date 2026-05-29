import { useState, useContext, createContext, useEffect, useRef } from "react";

// ─── APP STATE CONTEXT ───────────────────────────────────────
import { AppProvider, useApp } from "../context/AppContext";

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
    ["🎓", "Sessions Taught", profile.taught],
    ["📖", "Sessions Learned", profile.learned],
    ["🤝", "Meetups", profile.meetups],
    ["★", "Rating", profile.rating],
  ];

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg, #6c4fc2 0%, #4c1d95 100%)", padding: "24px 16px 80px" }} />

      <div style={{ padding: "0 16px", marginTop: -60 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 14, marginBottom: 16 }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: profile.color, display: "flex", alignItems: "center",
            justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 24,
            border: "4px solid #fff", boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}>{profile.avatar}</div>
          <div style={{ paddingBottom: 4 }}>
            <div style={{ fontWeight: 800, fontSize: 20, color: "#1a1a2e" }}>{profile.name}</div>
            <div style={{ fontSize: 13, color: "#6b7280" }}>{profile.year} · {profile.major}</div>
          </div>
        </div>

        {/* Token display */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <TokenBadge count={profile.tokens} />
          <Badge color="#374151" bg="#f3f4f6">{profile.gender}</Badge>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {stats.map(([icon, label, val]) => (
            <Card key={label}>
              <div style={{ padding: "12px 14px" }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
                <div style={{ fontWeight: 800, fontSize: 18, color: "#1a1a2e" }}>{val}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{label}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Edit profile */}
        <Card style={{ marginBottom: 20 }}>
          <div style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Profile Info</div>
              <button onClick={() => editing ? save() : setEditing(true)} style={{ background: editing ? "#6c4fc2" : "#f3f4f6", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 13, fontWeight: 700, color: editing ? "#fff" : "#374151", cursor: "pointer" }}>
                {editing ? "Save" : "Edit"}
              </button>
            </div>
            {[
              ["Name", "name"], ["Year", "year"], ["Major", "major"],
              ["Gender", "gender"], ["Bio", "bio"], ["Contact", "contact"],
            ].map(([label, key]) => (
              <div key={key} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>{label}</div>
                {editing ? (
                  <input value={form[key] || ""} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    style={{ width: "100%", borderRadius: 8, border: "1px solid #e5e7eb", padding: "8px 12px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                ) : (
                  <div style={{ fontSize: 14, color: "#1a1a2e" }}>{profile[key] || "—"}</div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}