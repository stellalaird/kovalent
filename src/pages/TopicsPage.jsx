// ─── MOCK DATA ───────────────────────────────────────
import { MOCK_USERS, CURRENT_USER, MOCK_SESSIONS, MY_SESSIONS } from "../data/mockData";

// ─── APP STATE CONTEXT ───────────────────────────────────────
import { AppProvider, useApp } from "../context/AppContext";

// ─── UTILITY COMPONENTS ──────────────────────────────────────
import Badge from "../components/Badge";
import Card from "../components/Card";
import Section from "../components/Section";

// ─── FEED CARD COMPONENTS ────────────────────────────────────
import LearnCard from "../components/LearnCard";
import MeetupCard from "../components/MeetupCard";
import TeachCard from "../components/TeachCard";


const TOPIC_DEFS = [
  { tag: "music", label: "Music", emoji: "🎵" },
  { tag: "guitar", label: "Guitar", emoji: "🎸" },
  { tag: "art", label: "Art", emoji: "🎨" },
  { tag: "creative", label: "Creative", emoji: "✏️" },
  { tag: "coding", label: "Coding", emoji: "💻" },
  { tag: "tech", label: "Tech", emoji: "🔧" },
  { tag: "language", label: "Language", emoji: "🌐" },
  { tag: "photography", label: "Photography", emoji: "📷" },
  { tag: "games", label: "Games", emoji: "🎲" },
  { tag: "strategy", label: "Strategy", emoji: "♟️" },
  { tag: "fitness", label: "Fitness", emoji: "🏃" },
  { tag: "outdoors", label: "Outdoors", emoji: "🌿" },
  { tag: "social", label: "Social", emoji: "🤝" },
];

const ALL_SESSIONS = [
  ...MOCK_SESSIONS,
  {
    id: "s-comp1",
    type: "teach",
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
  const topicDef = TOPIC_DEFS.find((t) => t.tag === tag) || {
    label: tag,
    emoji: "🏷️",
  };

  const tagged = ALL_SESSIONS.filter((session) =>
    (session.tags || []).includes(tag)
  );

  const upcoming = tagged.filter((session) =>
    ["feed", "waiting_room", "scheduled"].includes(session.status)
  );

  const completed = tagged.filter((session) => session.status === "completed");

  return (
    <div>
      <div style={{ background: "#6c4fc2", padding: "20px 16px" }}>
        <button
          onClick={onBack}
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "none",
            color: "#fff",
            borderRadius: 8,
            padding: "6px 12px",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 13,
            marginBottom: 14,
          }}
        >
          ← Topics
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
            }}
          >
            {topicDef.emoji}
          </div>

          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>
              {topicDef.label}
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
              {tagged.length} session{tagged.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: 16 }}>
        {upcoming.length > 0 && (
          <Section title={`Upcoming (${upcoming.length})`}>
            {upcoming.map((session) => {
              if (session.type === "teach") {
                return <TeachCard key={session.id} session={session} />;
              }

              if (session.type === "learn") {
                return <LearnCard key={session.id} session={session} />;
              }

              return <MeetupCard key={session.id} session={session} />;
            })}
          </Section>
        )}

        {completed.length > 0 && (
          <Section title={`Completed (${completed.length})`}>
            {completed.map((session) => (
              <Card key={session.id} style={{ marginBottom: 10 }}>
                <div
                  style={{
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: "#f0fdf4",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                    }}
                  >
                    ✅
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: "#1a1a2e",
                      }}
                    >
                      {session.skill || session.activity}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#6b7280",
                        marginTop: 2,
                      }}
                    >
                      {session.scheduledTime || "Past session"}
                    </div>
                  </div>

                  <Badge color="#065f46" bg="#d1fae5">
                    Done
                  </Badge>
                </div>
              </Card>
            ))}
          </Section>
        )}

        {tagged.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#374151" }}>
              No sessions yet
            </div>
            <div style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>
              Be the first to create one!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TopicsPageContent() {
  const { activeTopic, setActiveTopic } = useApp();

  if (activeTopic) {
    return (
      <TopicDetailPage
        tag={activeTopic}
        onBack={() => setActiveTopic(null)}
      />
    );
  }

  const tagCounts = {};

  ALL_SESSIONS.forEach((session) => {
    (session.tags || []).forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const visibleTopics = TOPIC_DEFS.filter((topic) => tagCounts[topic.tag] > 0);

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}
      >
        {visibleTopics.map((topic) => {
          const count = tagCounts[topic.tag] || 0;

          return (
            <div
              key={topic.tag}
              onClick={() => setActiveTopic(topic.tag)}
              style={{
                background: "#fff",
                borderRadius: 14,
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                padding: "14px 16px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: "#ede9ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  flexShrink: 0,
                }}
              >
                {topic.emoji}
              </div>

              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    color: "#1a1a2e",
                  }}
                >
                  {topic.label}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#9ca3af",
                    marginTop: 2,
                  }}
                >
                  {count} session{count !== 1 ? "s" : ""}
                </div>
              </div>

              <span style={{ marginLeft: "auto", color: "#c4b5fd", fontSize: 18 }}>
                ›
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}