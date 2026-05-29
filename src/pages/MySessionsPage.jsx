import { useState, useContext, createContext, useEffect, useRef } from "react";

// ─── APP STATE CONTEXT ───────────────────────────────────────
import { AppProvider, useApp } from "../context/AppContext";

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
    scheduled: filtered.filter(s => s.status === "scheduled"),
    completed: filtered.filter(s => s.status === "completed"),
  };

  function SessionMiniCard({ s }) {
    const label = s.skill || s.activity || "Session";
    const partner = s.teacher || (s.participants && s.participants[0]);
    const statusViews = { waiting_room: "waitingRoom", scheduled: "scheduled", completed: "completed" };
    return (
      <Card style={{ marginBottom: 10, cursor: "pointer" }} onClick={() => openSession(s, statusViews[s.status] || "waitingRoom")}>
        <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
          {partner ? <Avatar user={partner} size={40} /> : <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#ede9ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤝</div>}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a2e" }}>{label}</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>
              {s.type === "teach" ? (s.myRole === "teacher" ? "Teaching" : "Learning") : s.type === "learn" ? "Requested" : "Meetup"}
              {s.scheduledTime && ` · ${s.scheduledTime}`}
            </div>
          </div>
          <div style={{ fontSize: 20, color: "#9ca3af" }}>›</div>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <div style={{ padding: "16px 16px 0", background: "#fff", borderBottom: "1px solid #f3f4f6", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#1a1a2e", marginBottom: 12 }}>My Sessions</div>
        <div style={{ display: "flex", gap: 8, paddingBottom: 14, overflowX: "auto" }}>
          {["all", "teach", "learn", "meetup"].map(f => (
            <Pill key={f} active={filter === f} onClick={() => setFilter(f)}>
              {f === "all" ? "All" : f === "teach" ? "Teach" : f === "learn" ? "Learn" : "Meet Up"}
            </Pill>
          ))}
        </div>
      </div>

      <div style={{ padding: 16 }}>
        {grouped.waiting_room.length > 0 && (
          <Section title={`⏳ Waiting Rooms (${grouped.waiting_room.length})`}>
            {grouped.waiting_room.map(s => <SessionMiniCard key={s.id} s={s} />)}
          </Section>
        )}
        {grouped.scheduled.length > 0 && (
          <Section title={`📅 Scheduled (${grouped.scheduled.length})`}>
            {grouped.scheduled.map(s => <SessionMiniCard key={s.id} s={s} />)}
          </Section>
        )}
        {grouped.completed.length > 0 && (
          <Section title={`✅ Completed (${grouped.completed.length})`}>
            {grouped.completed.map(s => <SessionMiniCard key={s.id} s={s} />)}
          </Section>
        )}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#374151", marginBottom: 6 }}>No sessions yet</div>
            <div style={{ fontSize: 14, color: "#6b7280" }}>Join a session from the feed to get started!</div>
          </div>
        )}
      </div>
    </div>
  );
}