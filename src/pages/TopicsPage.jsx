import { T } from "../styles/theme";
// ─── MOCK DATA ───────────────────────────────────────
import { MOCK_USERS, MOCK_SESSIONS, MY_SESSIONS } from "../data/mockData";

// ─── APP STATE CONTEXT ───────────────────────────────────────
import { useState } from "react";
import { AppProvider, useApp } from "../context/AppContext";

// ─── STYLES ──────────────────────────────────────────────────

// ─── UTILITY COMPONENTS ──────────────────────────────────────
import Avatar from "../components/Avatar";
import AvatarRow from "../components/AvatarRow";
import Badge from "../components/Badge";
import Card from "../components/Card";
import Section from "../components/Section";

// ─── FEED CARD COMPONENTS ────────────────────────────────────
import CollabCard from "../components/CollabCard";
import SessionCard from "../components/SessionCard";

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
  games:       { bg: "rgba(201,162,39,0.14)", color: "#8B6914" },
  strategy:    { bg: "rgba(201,162,39,0.14)", color: "#8B6914" },
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
  ...MY_SESSIONS.filter(s => s.status === "completed"),
];

function CompletedSessionCard({ s }) {
  const { openSession, profile } = useApp();
  const tLearn = T.sessionTypes.learn;
  const tTeach = T.sessionTypes.teach;
  const isCollab = s.type === "collab";
  const isTeachRole = s.myRole === "teacher";
  const teacher = s.type === "learn" ? s.teacher : null;
  const pList = s.participants || [];
  const wList = s.waitingRoom || [];
  const collabOverflow = Math.max(0, (pList.length + (s.interested ?? 0)) - 1);
  const teachOverflow  = Math.max(0, (s.interested ?? 0) - 1);
  const avatarEl = isCollab
    ? <AvatarRow users={pList} size={34} max={1} overflowCount={collabOverflow} />
    : isTeachRole
      ? <Avatar user={profile} size={34} />
      : s.type === "teach"
        ? <AvatarRow users={wList} size={34} max={1} overflowCount={teachOverflow} />
        : teacher
          ? <Avatar user={teacher} size={34} />
          : null;
  const title = s.skill || s.activity || "Session";
  const sub = s.scheduledTime || "";

  return (
    <div
      style={{
        marginBottom: 8, cursor: "pointer",
        borderRadius: T.cardRadius,
        border: `1px solid ${T.cardBorder}`,
        background: isCollab ? "#F2E8CE" : "#FFFFFF",
        boxShadow: T.cardShadow,
        overflow: "hidden",
      }}
      onClick={() => openSession(s, "completed")}
    >
      <div style={{ padding: "13px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        {avatarEl}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: sub ? 2 : 0 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: T.text, letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, minWidth: 0 }}>
              {title}
            </span>
            <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
              {!isCollab && isTeachRole  && <Badge color={tTeach.badge} bg={tTeach.bg}>Teach</Badge>}
              {!isCollab && !isTeachRole && <Badge color={tLearn.badge} bg={tLearn.bg}>Learn</Badge>}
            </div>
          </div>
          {sub && <div style={{ fontSize: 12, color: T.muted }}>{sub}</div>}
        </div>
        <div style={{ color: T.muted, flexShrink: 0, opacity: 0.5, fontSize: 16 }}>›</div>
      </div>
    </div>
  );
}

function TopicDetailPage({ tag, onBack }) {
  const { setActiveTopic, setFeedView, joinedCommunities, setJoinedCommunities, setViewingUser, profile, customCommunities } = useApp();
  const isJoined = joinedCommunities.includes(tag);
  const toggleJoin = () => setJoinedCommunities(prev =>
    prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
  );
  const [activeTab, setActiveTab] = useState("sessions");

  const customDef = (customCommunities || []).find(c => c.tag === tag);
  const topicDef = TOPIC_DEFS.find((t) => t.tag === tag) || customDef || { label: tag, emoji: "🏷️" };
  const accent = customDef?.accent || TOPIC_ACCENT[tag] || { bg: T.purpleLight, color: T.purple };
  const withTag = s => ({ ...s, _fromCommunity: tag });

  const tagged = ALL_SESSIONS.filter((session) => (session.tags || []).includes(tag));

  // Collect all unique people from tagged sessions
  const people = (() => {
    const seen = new Set();
    const result = [];
    for (const s of tagged) {
      const users = [
        s.teacher,
        ...(s.participants || []),
        ...(s.attended || []),
        ...(s.waitingRoom || []),
      ].filter(Boolean);
      for (const u of users) {
        if (!seen.has(u.id)) { seen.add(u.id); result.push(u); }
      }
    }
    // Add current user if they've joined the community and aren't already listed
    if (isJoined && !seen.has(profile.id)) result.unshift(profile);
    return result;
  })();
  const upcoming = tagged.filter((session) => ["feed", "waiting_room", "scheduled"].includes(session.status));
  const completed = tagged
    .filter((session) => session.status === "completed")
    .sort((a, b) => {
      const parse = s => s?.scheduledTime ? new Date(s.scheduledTime.replace(" · ", " ")) : new Date(0);
      return parse(b) - parse(a);
    });

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
          ← Back
        </button>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
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
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
              {topicDef.label}
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.72)", marginTop: 2 }}>
              {tagged.length} session{tagged.length !== 1 ? "s" : ""}
            </div>
          </div>
          <button
            onClick={toggleJoin}
            style={{
              padding: "7px 18px",
              borderRadius: 999,
              border: isJoined ? "1.5px solid rgba(255,255,255,0.5)" : "none",
              background: isJoined ? "transparent" : T.purpleGradient,
              color: "#fff",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              letterSpacing: "-0.01em",
              flexShrink: 0,
              transition: "all 0.15s",
            }}
          >
            {isJoined ? "✓ Joined" : "Join"}
          </button>
        </div>

      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${T.border}`, background: T.surface }}>
        {["sessions", "people"].map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            style={{
              flex: 1,
              padding: "11px 0",
              border: "none",
              borderBottom: activeTab === t ? `2px solid ${T.purple}` : "2px solid transparent",
              background: "transparent",
              color: activeTab === t ? T.purple : T.muted,
              fontWeight: activeTab === t ? 700 : 500,
              fontFamily: T.fontBody,
              fontSize: 13,
              cursor: "pointer",
              letterSpacing: "-0.01em",
              transition: "all 0.15s",
            }}
          >
            {t === "sessions" ? "Sessions" : `People (${people.length})`}
          </button>
        ))}
      </div>

      <div style={{ padding: "28px 16px 16px" }}>
        {activeTab === "sessions" && (
          <>
            {upcoming.length > 0 && (
              <Section title={`Upcoming (${upcoming.length})`}>
                {upcoming.map((session) => {
                  if (session.type === "collab") return <CollabCard key={session.id} session={withTag(session)} />;
                  return <SessionCard key={session.id} session={withTag(session)} />;
                })}
              </Section>
            )}

            {completed.length > 0 && (
              <Section title={`Past (${completed.length})`}>
                {completed.map((session) => (
                  <CompletedSessionCard key={session.id} s={withTag(session)} />
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
          </>
        )}

        {activeTab === "people" && (
          <>
            {people.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: T.text }}>No people yet</div>
              </div>
            )}
            {people.map(u => (
              <Card key={u.id} style={{ marginBottom: 8, cursor: "pointer" }} onClick={() => setViewingUser(u)}>
                <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
                  <Avatar user={u} size={40} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: T.text, letterSpacing: "-0.01em" }}>{u.name}</div>
                    {u.year && <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{u.year}{u.major ? ` · ${u.major}` : ""}</div>}
                  </div>
                  {u.id === profile.id
                    ? <Badge color={T.purple} bg={T.purpleLight}>You</Badge>
                    : u.rating != null && <Badge color={T.purple} bg={T.purpleLight}>★ {u.rating}</Badge>
                  }
                </div>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default function TopicsPageContent() {
  const { activeTopic, setActiveTopic, joinedCommunities, communityFilter, communitySort, customCommunities } = useApp();

  if (activeTopic) {
    return <TopicDetailPage tag={activeTopic} onBack={() => setActiveTopic(null)} />;
  }

  const upcomingStatuses = new Set(["feed", "waiting_room", "scheduled"]);
  const tagCounts = {};
  ALL_SESSIONS.forEach((session) => {
    if (!upcomingStatuses.has(session.status)) return;
    (session.tags || []).forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  // Show all communities that have any session (upcoming or past), but only count upcoming
  const anyTagCounts = {};
  ALL_SESSIONS.forEach((session) => {
    (session.tags || []).forEach((tag) => {
      anyTagCounts[tag] = (anyTagCounts[tag] || 0) + 1;
    });
  });

  // Count unique people per tag
  const tagPeopleCounts = {};
  TOPIC_DEFS.forEach(({ tag }) => {
    const seen = new Set();
    ALL_SESSIONS.forEach(s => {
      if (!(s.tags || []).includes(tag)) return;
      [s.teacher, ...(s.participants || []), ...(s.attended || []), ...(s.waitingRoom || [])]
        .filter(Boolean).forEach(u => seen.add(u.id));
    });
    tagPeopleCounts[tag] = seen.size;
  });

  const allTopics = [
    ...TOPIC_DEFS.filter((topic) => anyTagCounts[topic.tag] > 0),
    ...(customCommunities || []),
  ];
  const visibleTopics = (() => {
    let topics = communityFilter === "joined"
      ? allTopics.filter(t => joinedCommunities.includes(t.tag))
      : [...allTopics];
    if (communitySort === "most_upcoming") return topics.sort((a, b) => (tagCounts[b.tag] || 0) - (tagCounts[a.tag] || 0));
    if (communitySort === "most_people")   return topics.sort((a, b) => (tagPeopleCounts[b.tag] || 0) - (tagPeopleCounts[a.tag] || 0));
    return topics.sort((a, b) => a.label.localeCompare(b.label)); // alpha (default)
  })();

  return (
    <div style={{ padding: "16px 12px 8px" }}>
      {communityFilter === "joined" && visibleTopics.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: 48, marginBottom: 14 }}>🏘️</div>
          <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 18, color: T.text, marginBottom: 6, letterSpacing: "-0.02em" }}>
            Nothing here yet
          </div>
          <div style={{ fontSize: 14, color: T.muted, lineHeight: 1.6 }}>Open a community and tap Join!</div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {visibleTopics.map((topic) => {
          const count = tagCounts[topic.tag] || 0; // upcoming only
          const accent = topic.accent || TOPIC_ACCENT[topic.tag] || { bg: T.purpleLight, color: T.purple };

          return (
            <div
              key={topic.tag}
              onClick={() => setActiveTopic(topic.tag)}
              style={{
                background: T.card,
                borderRadius: T.cardRadius,
                border: `1px solid ${T.cardBorder}`,
                boxShadow: T.cardShadow,
                padding: "12px 10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 10,
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
                <div style={{ fontSize: 12, color: accent.color, fontWeight: 600, marginTop: 2, whiteSpace: "nowrap" }}>
                  {count} sessions
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
