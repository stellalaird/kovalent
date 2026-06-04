import { T } from "../styles/theme";
import { useState } from "react";
import { useApp } from "../context/AppContext";

const TOPICS = [
  { tag: "music",       label: "Music",       emoji: "🎵" },
  { tag: "guitar",      label: "Guitar",      emoji: "🎸" },
  { tag: "art",         label: "Art",         emoji: "🎨" },
  { tag: "creative",    label: "Creative",    emoji: "✏️" },
  { tag: "coding",      label: "Coding",      emoji: "💻" },
  { tag: "tech",        label: "Tech",        emoji: "🔧" },
  { tag: "language",    label: "Language",    emoji: "🌐" },
  { tag: "photography", label: "Photography", emoji: "📷" },
  { tag: "games",       label: "Games",       emoji: "🎲" },
  { tag: "strategy",    label: "Strategy",    emoji: "♟️" },
  { tag: "fitness",     label: "Fitness",     emoji: "🏃" },
  { tag: "outdoors",    label: "Outdoors",    emoji: "🌿" },
  { tag: "social",      label: "Social",      emoji: "🤝" },
];

const fieldStyle = {
  width: "100%",
  borderRadius: 12,
  border: `1px solid ${T.border}`,
  padding: "11px 14px",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
  color: T.text,
  background: "#fff",
  fontFamily: T.fontBody,
  letterSpacing: "-0.01em",
  transition: "border-color 0.15s",
};

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

export default function CreateSessionPage() {
  const { setTab, profile, setCustomSessions, joinSession, showToast } = useApp();
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
  const [form, setForm] = useState({
    type: "learn",
    title: "",
    description: "",
    level: "All Levels",
    selectedTags: [],
  });

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  function handleCreate() {
    if (!form.title.trim()) return;
    const id = `custom-${Date.now()}`;
    const tags = form.selectedTags;

    let session;
    if (form.type === "teach") {
      // We are the teacher → Learn card
      session = {
        id, type: "learn",
        skill: form.title,
        teacher: profile,
        level: form.level,
        description: form.description,
        tags,
        status: "feed",
        activityLevel: "low",
        interested: 0,
        minGroup: 2, maxGroup: 8,
        taught: profile.taught ?? 0,
        waitingRoom: [],
        messages: [],
      };
    } else if (form.type === "learn") {
      // We want to learn → Teach card (we are the requester)
      session = {
        id, type: "teach",
        skill: form.title,
        requester: profile,
        level: form.level,
        description: form.description,
        tags,
        status: "feed",
        activityLevel: "low",
        interested: 0,
        waitingRoom: [],
      };
    } else {
      // Meetup / collab
      session = {
        id, type: "collab",
        activity: form.title,
        description: form.description,
        tags,
        status: "feed",
        activityLevel: "low",
        interested: 0,
        maxGroup: 20,
        participants: [profile],
        proposals: [],
        messages: [],
      };
    }

    setCustomSessions(prev => [session, ...prev]);
    if (form.type === "teach") joinSession(session, "teacher");
    if (form.type === "learn") joinSession(session, "learner");
    if (form.type === "collab") joinSession(session, "participant");
    showToast("Session posted to the feed!");
    setTab("mySessions");
  }

  function toggleTag(tag) {
    setForm(f => ({
      ...f,
      selectedTags: f.selectedTags.includes(tag)
        ? f.selectedTags.filter(t => t !== tag)
        : [...f.selectedTags, tag],
    }));
  }

  const typeOptions = [
    { id: "learn", label: "Learn" },
    { id: "teach", label: "Teach" },
    { id: "collab", label: "Meetup" },
  ];

  const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

  const descPlaceholder = form.type === "learn"
    ? "What do you want to learn? What will this session cover?"
    : form.type === "teach"
      ? "What will this session cover? What should people expect?"
      : "What will this meetup be about? What should people expect?";

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
          onClick={() => setTab("feed")}
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
          New Session
        </div>
      </div>

      {/* Scrollable form */}
      <div style={{ flex: 1, overflowY: "auto", padding: "22px 18px 120px", background: T.appBg }}>

        {/* Session type */}
        <Field label="Session Type">
          <div style={{ display: "flex", gap: 8 }}>
            {typeOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => set("type", opt.id)}
                style={{
                  flex: 1,
                  padding: "10px 6px",
                  borderRadius: 12,
                  border: form.type === opt.id ? `1.5px solid ${T.cardBorderBright}` : `1px solid ${T.border}`,
                  background: form.type === opt.id ? T.purpleLight : T.card,
                  color: form.type === opt.id ? T.purpleDeep : T.muted,
                  fontWeight: form.type === opt.id ? 700 : 500,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: T.fontBody,
                  transition: "all 0.15s",
                  letterSpacing: "-0.01em",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Field>

        {/* Title */}
        <Field label={form.type === "collab" ? "Activity Name" : "Skill / Topic"}>
          <input
            value={form.title}
            onChange={e => set("title", e.target.value)}
            placeholder={form.type === "collab" ? "e.g. Board Game Night" : "e.g. Jazz Guitar Basics"}
            style={fieldStyle}
            onFocus={e => e.target.style.borderColor = T.cardBorderBright}
            onBlur={e => e.target.style.borderColor = T.border}
          />
        </Field>

        {/* Description */}
        <Field label="Description">
          <textarea
            value={form.description}
            onChange={e => set("description", e.target.value)}
            placeholder={descPlaceholder}
            rows={4}
            style={{ ...fieldStyle, resize: "none", lineHeight: 1.6 }}
            onFocus={e => e.target.style.borderColor = T.cardBorderBright}
            onBlur={e => e.target.style.borderColor = T.border}
          />
        </Field>

        {/* Level — not shown for collab */}
        {form.type !== "collab" && (
          <Field label="Level">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {levels.map(l => (
                <button
                  key={l}
                  onClick={() => set("level", l)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 999,
                    border: form.level === l ? `1.5px solid ${T.cardBorderBright}` : `1px solid ${T.border}`,
                    background: form.level === l ? T.purpleLight : T.card,
                    color: form.level === l ? T.purpleDeep : T.muted,
                    fontWeight: form.level === l ? 700 : 500,
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: T.fontBody,
                    transition: "all 0.15s",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          </Field>
        )}

        {/* Communities / Tags */}
        <Field label="Communities">
          <div style={{
            maxHeight: 160,
            overflowY: "auto",
            border: `1px solid ${T.border}`,
            borderRadius: 12,
            background: T.card,
            padding: "6px 8px",
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
          }}>
            {TOPICS.map(({ tag, label, emoji }) => {
              const selected = form.selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 999,
                    border: selected ? `1.5px solid ${T.cardBorderBright}` : `1px solid ${T.border}`,
                    background: selected ? T.purpleLight : T.surface,
                    color: selected ? T.purpleDeep : T.muted,
                    fontWeight: selected ? 700 : 500,
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: T.fontBody,
                    transition: "all 0.15s",
                    letterSpacing: "-0.01em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {emoji} {label}
                </button>
              );
            })}
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
          onClick={handleCreate}
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
          }}
        >
          Create Session
        </button>
      </div>
    </div>
  );
}
