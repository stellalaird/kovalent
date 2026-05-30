import { useState } from "react";

// ─── APP STATE CONTEXT ───────────────────────────────────────
import { useApp } from "../context/AppContext";

// ─── STYLES ──────────────────────────────────────────────────
import { T } from "../styles/theme";

// ─── UTILITY COMPONENTS ──────────────────────────────────────
import Avatar from "../components/Avatar";
import Card from "../components/Card";
import Pill from "../components/Pill";
import Section from "../components/Section";

export default function MySessionsPage() {
  const { mySessions, openSession } = useApp();
  const [filter, setFilter] = useState("all");

  const filtered = mySessions.filter(s => filter === "all" || s.type === filter);
  const grouped = {
    waiting_room: filtered.filter(s => s.status === "waiting_room"),
    scheduled:    filtered.filter(s => s.status === "scheduled"),
    completed:    filtered.filter(s => s.status === "completed"),
  };

  function SessionMiniCard({ s }) {
    const label = s.skill || s.activity || "Session";
    const partner = s.teacher || (s.participants && s.participants[0]);
    const statusViews = { waiting_room: "waitingRoom", scheduled: "scheduled", completed: "completed" };

    return (
      <Card style={{ marginBottom: 10, cursor: "pointer" }} onClick={() => openSession(s, statusViews[s.status] || "waitingRoom")}>
        <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
          {partner
            ? <Avatar user={partner} size={40} />
            : <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: T.purpleLight,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
              }}>🤝</div>
          }
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontWeight: 700, fontSize: 14, color: T.text,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>{label}</div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>
              {s.type === "teach"
                ? (s.myRole === "teacher" ? "Teaching" : "Learning")
                : s.type === "learn" ? "Requested" : "Meetup"}
              {s.scheduledTime && ` · ${s.scheduledTime}`}
            </div>
          </div>
          <div style={{ fontSize: 18, color: T.purple, fontWeight: 300, flexShrink: 0 }}>›</div>
        </div>
      </Card>
    );
  }

  return (
    <div>
      {/* Sticky header — matches FeedPage style */}
      <div style={{
        padding: "14px 16px 0",
        background: "rgba(246,244,253,0.92)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: `1px solid ${T.border}`,
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{
          fontSize: 22, fontWeight: 800, color: T.text,
          letterSpacing: "-0.03em", marginBottom: 10,
        }}>My Sessions</div>
        <div style={{ display: "flex", gap: 8, paddingBottom: 12, overflowX: "auto" }}>
          {["all", "teach", "learn", "meetup"].map(f => (
            <Pill key={f} active={filter === f} onClick={() => setFilter(f)}>
              {f === "all" ? "All" : f === "teach" ? "Teach" : f === "learn" ? "Learn" : "Meet Up"}
            </Pill>
          ))}
        </div>
      </div>

      <div style={{ padding: 16 }}>
        {grouped.waiting_room.length > 0 && (
          <Section title={`Waiting Rooms (${grouped.waiting_room.length})`}>
            {grouped.waiting_room.map(s => <SessionMiniCard key={s.id} s={s} />)}
          </Section>
        )}
        {grouped.scheduled.length > 0 && (
          <Section title={`Scheduled (${grouped.scheduled.length})`}>
            {grouped.scheduled.map(s => <SessionMiniCard key={s.id} s={s} />)}
          </Section>
        )}
        {grouped.completed.length > 0 && (
          <Section title={`Completed (${grouped.completed.length})`}>
            {grouped.completed.map(s => <SessionMiniCard key={s.id} s={s} />)}
          </Section>
        )}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: T.text, marginBottom: 6 }}>No sessions yet</div>
            <div style={{ fontSize: 14, color: T.muted }}>Join a session from the feed to get started!</div>
          </div>
        )}
      </div>
    </div>
  );
}
