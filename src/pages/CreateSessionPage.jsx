import { T } from "../styles/theme";
import { useState } from "react";
import { useApp } from "../context/AppContext";

const TOPICS = [
  { tag: "art",         label: "Art",         emoji: "🎨" },
  { tag: "coding",      label: "Coding",      emoji: "💻" },
  { tag: "creative",    label: "Creative",    emoji: "✏️" },
  { tag: "fitness",     label: "Fitness",     emoji: "🏃" },
  { tag: "games",       label: "Games",       emoji: "🎲" },
  { tag: "guitar",      label: "Guitar",      emoji: "🎸" },
  { tag: "language",    label: "Language",    emoji: "🌐" },
  { tag: "music",       label: "Music",       emoji: "🎵" },
  { tag: "outdoors",    label: "Outdoors",    emoji: "🌿" },
  { tag: "photography", label: "Photography", emoji: "📷" },
  { tag: "social",      label: "Social",      emoji: "🤝" },
  { tag: "strategy",    label: "Strategy",    emoji: "♟️" },
  { tag: "tech",        label: "Tech",        emoji: "🔧" },
];

const fieldStyle = {
  width: "100%",
  borderRadius: 12,
  border: `1px solid ${T.border}`,
  padding: "11px 14px",
  fontSize: 16,
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
  const { setTab, profile, setCustomSessions, joinSession, showToast, joinedCommunities, offerToTeachSession, setOfferToTeachSession, setTeacherOverrides, setMySessions, setActiveSession, openSession, customCommunities } = useApp();
  const isOfferToTeach = !!offerToTeachSession;
  const [joinedFilter, setJoinedFilter] = useState(false);
  const [showCreateCommunityConfirm, setShowCreateCommunityConfirm] = useState(false);
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
  const [form, setForm] = useState(() => isOfferToTeach ? {
    type: "teach",
    title: offerToTeachSession.skill || "",
    description: offerToTeachSession.description || "",
    level: offerToTeachSession.level === "All Levels" ? "All" : (offerToTeachSession.level || "All"),
    selectedTags: offerToTeachSession.tags || [],
    minCapacity: offerToTeachSession.minGroup ?? 2,
    maxCapacity: offerToTeachSession.maxGroup ?? null,
  } : {
    type: "learn",
    title: "",
    description: "",
    level: "All",
    selectedTags: [],
    minCapacity: 2,
    maxCapacity: null,
  });

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  function handleCreate() {
    if (!form.title.trim()) return;
    const level = form.level === "All" ? "All Levels" : form.level;

    if (isOfferToTeach) {
      const src = offerToTeachSession;
      const updated = {
        ...src,
        skill: form.title,
        description: form.description,
        level,
        tags: form.selectedTags,
        minGroup: form.minCapacity,
        maxGroup: form.maxCapacity ?? null,
        myRole: "teacher",
        scheduledTime: null,
        location: null,
      };
      setTeacherOverrides(prev => ({ ...prev, [src.id]: profile }));
      setMySessions(prev => prev.map(s => s.id === src.id ? updated : s));
      setOfferToTeachSession(null);
      openSession(updated, "waitingRoom");
      return;
    }

    const id = `custom-${Date.now()}`;
    const tags = form.selectedTags;

    let session;
    if (form.type === "teach") {
      // We are the teacher → Learn card
      session = {
        id, type: "learn",
        skill: form.title,
        teacher: profile,
        level,
        description: form.description,
        tags,
        status: "feed",
        activityLevel: "low",
        interested: 0,
        minGroup: form.minCapacity, maxGroup: form.maxCapacity ?? null,
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
        level,
        description: form.description,
        tags,
        status: "feed",
        activityLevel: "low",
        interested: 0,
        waitingRoom: [],
      };
    } else {
      // Collab / collab
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
    { id: "collab", label: "Collab" },
  ];

  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  const descPlaceholder = form.type === "learn"
    ? "What do you want to learn? What will this session cover?"
    : form.type === "teach"
      ? "What will this session cover? What should people expect?"
      : "What will this collab be about? What should people expect?";

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
          onClick={() => {
            if (isOfferToTeach) { setOfferToTeachSession(null); setTab("session"); }
            else setTab("feed");
          }}
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
          {isOfferToTeach ? "Offer to Teach" : "New Session"}
        </div>
      </div>

      {/* Scrollable form */}
      <div style={{ flex: 1, overflowY: "auto", padding: "22px 18px 120px", background: T.appBg }}>

        {/* Session type */}
        {!isOfferToTeach && (
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
        )}

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

        {/* Capacity — only for teach sessions */}
        {form.type === "teach" && (
          <Field label="Capacity">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Min — fixed */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.textMid, letterSpacing: "-0.01em" }}>Minimum</div>
                  <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>Can't go below 2 (no 1-on-1s)</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <button
                    onClick={() => set("minCapacity", Math.max(2, form.minCapacity - 1))}
                    style={{
                      width: 28, height: 28, borderRadius: 7,
                      border: `1px solid ${T.border}`, background: T.surface,
                      color: T.muted, fontSize: 15, fontWeight: 700,
                      cursor: form.minCapacity <= 2 ? "default" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      opacity: form.minCapacity <= 2 ? 0.4 : 1,
                    }}
                  >−</button>
                  <div style={{
                    background: T.surface, border: `1px solid ${T.border}`,
                    borderRadius: 8, padding: "5px 14px",
                    fontSize: 14, fontWeight: 700, color: T.textMid,
                    minWidth: 44, textAlign: "center",
                  }}>{form.minCapacity}</div>
                  <button
                    onClick={() => {
                      const next = form.minCapacity + 1;
                      set("minCapacity", next);
                      if (form.maxCapacity != null && form.maxCapacity < next) set("maxCapacity", next);
                    }}
                    style={{
                      width: 28, height: 28, borderRadius: 7,
                      border: `1px solid ${T.border}`, background: T.surface,
                      color: T.muted, fontSize: 15, fontWeight: 700,
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >+</button>
                </div>
              </div>

              {/* Max — optional stepper */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.textMid, letterSpacing: "-0.01em" }}>Maximum</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {form.maxCapacity != null && (
                    <>
                      <button
                        onClick={() => set("maxCapacity", Math.max(form.minCapacity, form.maxCapacity - 1))}
                        style={{
                          width: 28, height: 28, borderRadius: 7,
                          border: `1px solid ${T.border}`, background: T.surface,
                          color: T.muted, fontSize: 15, fontWeight: 700,
                          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >−</button>
                      <div style={{
                        background: T.surface, border: `1px solid ${T.border}`,
                        borderRadius: 8, padding: "5px 14px",
                        fontSize: 14, fontWeight: 700, color: T.textMid,
                        minWidth: 44, textAlign: "center",
                      }}>{form.maxCapacity}</div>
                      <button
                        onClick={() => set("maxCapacity", form.maxCapacity + 1)}
                        style={{
                          width: 28, height: 28, borderRadius: 7,
                          border: `1px solid ${T.border}`, background: T.surface,
                          color: T.muted, fontSize: 15, fontWeight: 700,
                          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >+</button>
                      <button
                        onClick={() => set("maxCapacity", null)}
                        style={{
                          background: "none", border: "none",
                          color: T.muted, fontSize: 11, cursor: "pointer",
                          padding: 0, fontFamily: T.fontBody,
                        }}
                      >✕</button>
                    </>
                  )}
                  {form.maxCapacity == null && (
                    <button
                      onClick={() => set("maxCapacity", 10)}
                      style={{
                        padding: "5px 12px", borderRadius: 7,
                        border: `1px solid ${T.border}`, background: T.surface,
                        color: T.muted, fontWeight: 600, fontSize: 12,
                        cursor: "pointer", fontFamily: T.fontBody, letterSpacing: "-0.01em",
                      }}
                    >Add max</button>
                  )}
                </div>
              </div>
            </div>
          </Field>
        )}

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
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 7 }}>
            Tag Communities (optional)
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 6 }}>
              {[["All", false], ["Joined", true]].map(([lbl, val]) => (
                <button
                  key={lbl}
                  onClick={() => setJoinedFilter(val)}
                  style={{
                    padding: "4px 12px", borderRadius: 6, fontSize: 12,
                    border: joinedFilter === val ? `1px solid ${T.purple}55` : `1px solid ${T.border}`,
                    background: joinedFilter === val ? `${T.purple}18` : "transparent",
                    color: joinedFilter === val ? T.purple : T.muted,
                    fontWeight: joinedFilter === val ? 600 : 500,
                    fontFamily: T.fontBody, cursor: "pointer",
                    letterSpacing: "0.01em", transition: "all 0.15s", whiteSpace: "nowrap",
                  }}
                >
                  {lbl}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowCreateCommunityConfirm(true)}
              style={{
                padding: "4px 12px", borderRadius: 6, fontSize: 12,
                border: `1px dashed ${T.purple}88`,
                background: "transparent",
                color: T.purple, fontWeight: 500,
                fontFamily: T.fontBody, cursor: "pointer",
                letterSpacing: "0.01em", transition: "all 0.15s", whiteSpace: "nowrap",
              }}
            >
              + Create new community
            </button>
          </div>

          <div style={{
            maxHeight: 160,
            overflowY: "auto",
            border: `1px solid ${T.border}`,
            borderRadius: 12,
            background: T.card,
            padding: "10px 12px",
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
          }}>
            {[...TOPICS, ...(customCommunities || [])].filter(({ tag }) => !joinedFilter || joinedCommunities.includes(tag)).map(({ tag, label, emoji }) => {
              const selected = form.selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 999,
                    border: selected ? `1.5px solid ${T.gold}` : `1px solid ${T.border}`,
                    background: selected ? T.goldBg : T.surface,
                    color: selected ? T.gold : T.muted,
                    fontWeight: selected ? 700 : 500,
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: T.fontBody,
                    transition: "all 0.15s",
                    letterSpacing: "-0.01em",
                    whiteSpace: "nowrap",
                    boxShadow: "none",
                  }}
                >
                  {emoji} {label}
                </button>
              );
            })}
            {joinedFilter && [...TOPICS, ...(customCommunities || [])].filter(({ tag }) => joinedCommunities.includes(tag)).length === 0 && (
              <div style={{ fontSize: 13, color: T.muted, fontStyle: "italic", padding: "6px 4px" }}>
                You haven't joined any communities yet.
              </div>
            )}
          </div>

        </div>
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
            cursor: form.title.trim() && form.description.trim() ? "pointer" : "default",
            letterSpacing: "-0.01em",
            boxShadow: form.title.trim() && form.description.trim() ? T.btnPrimaryShadow : "none",
            opacity: form.title.trim() && form.description.trim() ? 1 : 0.5,
            pointerEvents: "all",
          }}
        >
          {isOfferToTeach ? "Teach Session" : "Create Session"}
        </button>
      </div>

      {/* Create Community confirmation modal */}
      {showCreateCommunityConfirm && (
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100, padding: "0 24px",
        }}
          onClick={() => setShowCreateCommunityConfirm(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: T.card,
              borderRadius: 20,
              padding: "24px 20px",
              width: "100%",
              boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
            }}
          >
            <div style={{
              fontFamily: T.fontDisplay, fontSize: 18, fontWeight: 800,
              color: T.text, letterSpacing: "-0.03em", marginBottom: 10,
            }}>
              Leave this form?
            </div>
            <div style={{ fontSize: 14, color: T.muted, lineHeight: 1.5, marginBottom: 24 }}>
              Creating a community will take you to a new page. Your progress on this form will be lost and you'll need to fill it out again.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowCreateCommunityConfirm(false)}
                style={{
                  flex: 1, padding: "12px 0", borderRadius: 12,
                  border: `1px solid ${T.border}`, background: T.surface,
                  color: T.muted, fontWeight: 600, fontSize: 14,
                  cursor: "pointer", fontFamily: T.fontBody, letterSpacing: "-0.01em",
                }}
              >
                Stay
              </button>
              <button
                onClick={() => {
                  setShowCreateCommunityConfirm(false);
                  if (isOfferToTeach) setOfferToTeachSession(null);
                  setTab("createCommunity");
                }}
                style={{
                  flex: 1, padding: "12px 0", borderRadius: 12,
                  border: "none", background: T.danger,
                  color: "#fff", fontWeight: 700, fontSize: 14,
                  cursor: "pointer", fontFamily: T.fontBody, letterSpacing: "-0.01em",
                }}
              >
                Create Community
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
