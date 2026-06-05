import { T } from "../styles/theme";
import { useState } from "react";
import { useApp } from "../context/AppContext";

const BUILTIN_COMMUNITY_NAMES = [
  "art","coding","creative","fitness","games","guitar",
  "language","music","outdoors","photography","social","strategy","tech",
];

const ACCENT_OPTIONS = [
  { bg: "#FEF9C3", color: "#CA8A04" }, // yellow
  { bg: "#FFEDD5", color: "#EA580C" }, // orange
  { bg: "#FEE2E2", color: "#DC2626" }, // red
  { bg: "#FCE7F3", color: "#DB2777" }, // pink
  { bg: "#EDE9FE", color: "#7C3AED" }, // purple
  { bg: "#DBEAFE", color: "#2563EB" }, // blue
  { bg: "#CCFBF1", color: "#0F766E" }, // teal
  { bg: "#DCFCE7", color: "#16A34A" }, // green
  { bg: "#ECFCCB", color: "#65A30D" }, // lime
  { bg: "#E0E7FF", color: "#4F46E5" }, // indigo
  { bg: "#E0F2FE", color: "#0284C7" }, // sky
  { bg: "#FFF1F2", color: "#E11D48" }, // rose
];

const EMOJI_OPTIONS = [
  "🎵","🎸","🎺","🥁","🎹","🎨","✏️","📸","🎬","🎭",
  "💻","🔧","🔬","🧬","🚀","🌐","📚","✍️","🎯","🧩",
  "🏃","🧘","⚽","🏀","🎾","🌿","🌍","🍳","☕","🏔️",
  "🤝","🎲","♟️","🏆","💡","🗣️","🎤","🎡","🌸","⭐",
];

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontSize: 10, fontWeight: 700, color: T.muted,
        textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 7,
      }}>
        {label}
      </div>
      {children}
    </div>
  );
}

export default function CreateCommunityPage() {
  const { setTab, setFeedView, setCustomCommunities, setJoinedCommunities, showToast, customCommunities, setActiveTopic } = useApp();

  const fieldStyle = {
    width: "100%",
    borderRadius: 12,
    border: `1px solid ${T.border}`,
    padding: "11px 14px",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    color: T.text,
    background: T.surface,
    fontFamily: T.fontBody,
    letterSpacing: "-0.01em",
    transition: "border-color 0.15s",
  };

  const [form, setForm] = useState({ name: "", emoji: "🎵" });
  const [selectedAccent, setSelectedAccent] = useState(ACCENT_OPTIONS[0]);
  const [nameError, setNameError] = useState(null);

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }));
    if (key === "name") setNameError(null);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      {/* Header */}
      <div style={{
        padding: "14px 18px 16px",
        background: T.headerBg,
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: `1px solid ${T.border}`,
        flexShrink: 0,
      }}>
        <button
          onClick={() => { setTab("feed"); setFeedView("topics"); }}
          style={{
            background: "none", border: "none", color: T.purple,
            fontWeight: 700, fontSize: 14, cursor: "pointer", padding: 0,
            letterSpacing: "-0.01em", marginBottom: 12,
          }}
        >
          ← Back
        </button>
        <div style={{
          fontFamily: T.fontDisplay, fontSize: 24, fontWeight: 900,
          color: T.text, letterSpacing: "-0.04em",
        }}>
          New Community
        </div>
      </div>

      {/* Scrollable form */}
      <div style={{ flex: 1, overflowY: "auto", padding: "22px 18px 120px", background: T.appBg }}>

        {/* Community Name — top */}
        <Field label="Community Name">
          <input
            value={form.name}
            onChange={e => set("name", e.target.value)}
            placeholder="e.g. Jazz Lovers, Study Grind, Outdoor Crew"
            style={{ ...fieldStyle, borderColor: nameError ? "#DC2626" : T.border }}
            onFocus={e => e.target.style.borderColor = nameError ? "#DC2626" : T.cardBorderBright}
            onBlur={e => e.target.style.borderColor = nameError ? "#DC2626" : T.border}
          />
          {nameError && (
            <div style={{ fontSize: 12, color: "#DC2626", marginTop: 6, fontWeight: 500 }}>
              {nameError}
            </div>
          )}
        </Field>

        {/* Icon preview */}
        <Field label="Icon">
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{
              width: 72, height: 72, borderRadius: 20,
              background: selectedAccent.bg,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 36,
              border: `1px solid ${T.border}`,
            }}>
              {form.emoji}
            </div>
          </div>
        </Field>

        {/* Emoji picker */}
        <Field label="Emoji">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(8, 1fr)",
            gap: 6,
          }}>
            {EMOJI_OPTIONS.map(e => (
              <button
                key={e}
                onClick={() => set("emoji", e)}
                style={{
                  aspectRatio: "1",
                  borderRadius: 9,
                  border: form.emoji === e ? `1.5px solid ${T.cardBorderBright}` : `1px solid ${T.border}`,
                  background: form.emoji === e ? T.purpleLight : T.card,
                  fontSize: 18,
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                {e}
              </button>
            ))}
          </div>
        </Field>

        {/* Color */}
        <Field label="Color">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 8,
          }}>
            {ACCENT_OPTIONS.map((accent, i) => (
              <button
                key={i}
                onClick={() => setSelectedAccent(accent)}
                style={{
                  aspectRatio: "1",
                  borderRadius: 10,
                  background: accent.bg,
                  border: selectedAccent === accent
                    ? `2.5px solid ${accent.color}`
                    : `1px solid ${T.border}`,
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 800, color: accent.color,
                  transition: "all 0.12s",
                }}
              >
                {selectedAccent === accent ? "✓" : ""}
              </button>
            ))}
          </div>
        </Field>

      </div>

      {/* Sticky Create button */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "16px 18px 28px",
        background: `linear-gradient(to top, ${T.appBg} 70%, transparent)`,
        pointerEvents: "none",
      }}>
        <button
          onClick={() => {
            const name = form.name.trim();
            if (!name) return;
            const nameLower = name.toLowerCase();
            const isDuplicate =
              BUILTIN_COMMUNITY_NAMES.includes(nameLower) ||
              (customCommunities || []).some(c => c.label.toLowerCase() === nameLower);
            if (isDuplicate) {
              setNameError(`A community called "${name}" already exists.`);
              return;
            }
            const tag = `custom-${Date.now()}`;
            setCustomCommunities(prev => [...prev, { tag, label: name, emoji: form.emoji, accent: selectedAccent }]);
            setJoinedCommunities(prev => [...prev, tag]);
            showToast("Community created!");
            setActiveTopic(tag);
            setTab("communities");
          }}
          style={{
            width: "100%",
            padding: "15px 0",
            borderRadius: 14,
            border: "none",
            background: T.purpleGradient,
            color: "#fff",
            fontSize: 15,
            fontWeight: 700,
            fontFamily: T.fontBody,
            cursor: "pointer",
            letterSpacing: "-0.01em",
            boxShadow: T.btnPrimaryShadow,
            pointerEvents: "all",
            opacity: form.name.trim() ? 1 : 0.5,
          }}
        >
          Create Community
        </button>
      </div>
    </div>
  );
}
