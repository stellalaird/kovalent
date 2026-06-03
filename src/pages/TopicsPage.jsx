// ─── MOCK DATA ───────────────────────────────────────
import { MOCK_USERS, CURRENT_USER, MOCK_SESSIONS, MY_SESSIONS } from "../data/mockData";

// ─── APP STATE CONTEXT ───────────────────────────────────────
import { AppProvider, useApp } from "../context/AppContext";

// ─── STYLES ──────────────────────────────────────────────────
import { T } from "../styles/theme";

// ─── UTILITY COMPONENTS ──────────────────────────────────────
import Badge from "../components/Badge";
import Card from "../components/Card";
import Section from "../components/Section";

// ─── FEED CARD COMPONENTS ────────────────────────────────────
import LearnCard from "../components/LearnCard";
import MeetupCard from "../components/MeetupCard";
import TeachCard from "../components/TeachCard";

// ── Per-topic accent colors ──────────────────────────────────
const TOPIC_ACCENT = {
  music:       { bg: "#FEF3C7", color: "#D97706" },
  guitar:      { bg: "#FEF3C7", color: "#D97706" },
  art:         { bg: "#FCE7F3", color: "#DB2777" },
  creative:    { bg: "#FCE7F3", color: "#DB2777" },
  coding:      { bg: "#DBEAFE", color: "#1D4ED8" },
  tech:        { bg: "#DBEAFE", color: "#1D4ED8" },
  language:    { bg: "#D1FAE5", color: "#065F46" },
  photography: { bg: "#F1F5F9", color: "#475569" },
  games:       { bg: T.purpleLight, color: T.purpleDeep },
  strategy:    { bg: T.purpleLight, color: T.purpleDeep },
  fitness:     { bg: "#ECFDF5", color: "#047857" },
  outdoors:    { bg: "#ECFDF5", color: "#047857" },
  social:      { bg: "#FFF7ED", color: "#C2410C" },
};

const TOPIC_DEFS = [
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

const ALL_SESSIONS = [
  ...MOCK_SESSIONS,
  {
    id: "s-comp1",
    type: "learn",
    skill: "Intro to Chess",
    teacher: MOCK_USERS[0],
    level: "Beginner",
    status: "completed",
    tags: ["games", "strategy"],
    scheduledTime: "May 15, 2025 · 3:00 PM",
    location: "Tech LG52",
    participants: [MOCK_USERS[1], MOCK_USERS[3]],
    attended: [MOCK_USERS[1], MOCK_USERS[3]],
    interested: 0,
    minGroup: 2,
    maxGroup: 6,
    taught: 1,
    activityLevel: "low",
    description: "Taught chess basics to a small group.",
    messages: [],
  },
];

function TopicDetailPage({ tag, onBack }) {
  const topicDef = TOPIC_DEFS.find((t) => t.tag === tag) || { label: tag, emoji: "🏷️" };
  const accent = TOPIC_ACCENT[tag] || { bg: T.purpleLight, color: T.purple };

  const tagged = ALL_SESSIONS.filter((session) => (session.tags || []).includes(tag));
  const upcoming = tagged.filter((session) => ["feed", "waiting_room", "scheduled"].includes(session.status));
  const completed = tagged.filter((session) => session.status === "completed");

  return (
    <div>
      {/* Topic detail header — gradient banner */}
      <div style={{
        background: T.purpleGradient,
        padding: "18px 16px 22px",
      }}>
        <button
          onClick={onBack}
          style={{
            background: "rgba(255,255,255,0.18)",
            border: "1px solid rgba(255,255,255,0.25)",
            color: "#fff",
            borderRadius: 10,
            padding: "5px 12px",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 13,
            marginBottom: 16,
            backdropFilter: "blur(6px)",
          }}
        >
          ← Topics
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            background: "rgba(255,255,255,0.18)",
            border: "1px solid rgba(255,255,255,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
          }}>
            {topicDef.emoji}
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
              {topicDef.label}
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.72)", marginTop: 2 }}>
              {tagged.length} session{tagged.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: 16 }}>
        {upcoming.length > 0 && (
          <Section title={`Upcoming (${upcoming.length})`}>
            {upcoming.map((session) => {
              if (session.type === "learn") return <LearnCard key={session.id} session={session} />;
              if (session.type === "teach") return <TeachCard key={session.id} session={session} />;
              return <MeetupCard key={session.id} session={session} />;
            })}
          </Section>
        )}

        {completed.length > 0 && (
          <Section title={`Completed (${completed.length})`}>
            {completed.map((session) => (
              <Card key={session.id} style={{ marginBottom: 10 }}>
                <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 12,
                    background: T.successBg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, flexShrink: 0,
                  }}>
                    ✅
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {session.skill || session.activity}
                    </div>
                    <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>
                      {session.scheduledTime || "Past session"}
                    </div>
                  </div>
                  <Badge color={T.success} bg={T.successBg}>Done</Badge>
                </div>
              </Card>
            ))}
          </Section>
        )}

        {tagged.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: T.text }}>No sessions yet</div>
            <div style={{ fontSize: 14, color: T.muted, marginTop: 4 }}>Be the first to create one!</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TopicsPageContent() {
  const { activeTopic, setActiveTopic } = useApp();

  if (activeTopic) {
    return <TopicDetailPage tag={activeTopic} onBack={() => setActiveTopic(null)} />;
  }

  const tagCounts = {};
  ALL_SESSIONS.forEach((session) => {
    (session.tags || []).forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const visibleTopics = TOPIC_DEFS.filter((topic) => tagCounts[topic.tag] > 0);

  return (
    <div style={{ padding: "16px 16px 8px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {visibleTopics.map((topic) => {
          const count = tagCounts[topic.tag] || 0;
          const accent = TOPIC_ACCENT[topic.tag] || { bg: T.purpleLight, color: T.purple };

          return (
            <div
              key={topic.tag}
              onClick={() => setActiveTopic(topic.tag)}
              style={{
                background: T.card,
                borderRadius: T.cardRadius,
                border: `1px solid ${T.cardBorder}`,
                boxShadow: T.cardShadow,
                padding: "14px 14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 12,
                transition: "transform 0.12s, box-shadow 0.12s",
              }}
            >
              {/* Accent icon bubble */}
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 13,
                background: accent.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                flexShrink: 0,
              }}>
                {topic.emoji}
              </div>

              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: T.text }}>
                  {topic.label}
                </div>
                <div style={{ fontSize: 12, color: accent.color, fontWeight: 600, marginTop: 2 }}>
                  {count} session{count !== 1 ? "s" : ""}
                </div>
              </div>

              <span style={{ marginLeft: "auto", color: T.muted, fontSize: 16, flexShrink: 0 }}>›</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
