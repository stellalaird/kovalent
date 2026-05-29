// ─── MOCK DATA ───────────────────────────────────────
import { MOCK_USERS, CURRENT_USER, MOCK_SESSIONS, MY_SESSIONS } from "../data/mockData";

// ─── APP STATE CONTEXT ───────────────────────────────────────
import { AppProvider, useApp } from "../context/AppContext";

// ─── UTILITY COMPONENTS ──────────────────────────────────────
import Pill from "../components/Pill";
import Section from "../components/Section";
import TokenBadge from "../components/TokenBadge";

// ─── FEED CARD COMPONENTS ────────────────────────────────────
import TeachCard from "../components/TeachCard";
import LearnCard from "../components/LearnCard";
import MeetupCard from "../components/MeetupCard";

export default function FeedPage() {
  const { feedFilter, setFeedFilter } = useApp();
  const filtered = MOCK_SESSIONS.filter(s => s.type === feedFilter && s.status === "feed");

  return (
    <div>
      <div style={{ padding: "16px 16px 0", background: "#fff", borderBottom: "1px solid #f3f4f6", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e", letterSpacing: "-0.02em" }}>
              <span style={{ color: "#6c4fc2" }}>Kovalent</span>
            </div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>Northwestern's skill-share community</div>
          </div>
          <TokenBadge count={CURRENT_USER.tokens} />
        </div>
        <div style={{ display: "flex", gap: 8, paddingBottom: 14, overflowX: "auto" }}>
          {["teach", "learn", "meetup"].map(f => (
            <Pill key={f} active={feedFilter === f} onClick={() => setFeedFilter(f)}>
              {f === "teach" ? "🎓 Teach" : f === "learn" ? "📖 Learn" : "🤝 Meet Up"}
            </Pill>
          ))}
        </div>
      </div>

      <div style={{ padding: 16 }}>
        {feedFilter === "teach" && (
          <>
            <Section title="Trending Skills">
              {filtered.filter(s => s.activityLevel === "high").map(s => <TeachCard key={s.id} session={s} />)}
            </Section>
            <Section title="New Offerings">
              {filtered.filter(s => s.activityLevel !== "high").map(s => <TeachCard key={s.id} session={s} />)}
            </Section>
          </>
        )}
        {feedFilter === "learn" && (
          <>
            <div style={{ background: "#ede9ff", borderRadius: 12, padding: "12px 14px", marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#4c1d95", marginBottom: 4 }}>Can you teach something?</div>
              <div style={{ fontSize: 13, color: "#5b21b6" }}>Students below are looking for teachers. Offer to teach and earn tokens!</div>
            </div>
            {filtered.map(s => <LearnCard key={s.id} session={s} />)}
          </>
        )}
        {feedFilter === "meetup" && (
          <>
            <div style={{ background: "#f0fdf4", borderRadius: 12, padding: "12px 14px", marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#065f46", marginBottom: 4 }}>Find your people 🌿</div>
              <div style={{ fontSize: 13, color: "#047857" }}>Meet other NU students around shared hobbies. No expertise needed!</div>
            </div>
            {filtered.sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.activityLevel] - { high: 0, medium: 1, low: 2 }[b.activityLevel])).map(s => <MeetupCard key={s.id} session={s} />)}
          </>
        )}
      </div>
    </div>
  );
}