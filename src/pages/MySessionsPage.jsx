import { useState } from "react";
import { useApp } from "../context/AppContext";
import { T } from "../styles/theme";
import Badge from "../components/Badge";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import Pill from "../components/Pill";
import Section from "../components/Section";

// Derive icon / badge config from a session's type + myRole
function sessionConfig(s) {
  if (s.type === "collab") {
    return { icon: "🤝", iconBg: T.successBg,  badgeColor: T.success,  badgeBg: T.successBg,  label: "Collab" };
  }
  if (s.myRole === "teacher") {
    return { icon: "📖", iconBg: "#DBEAFE",   badgeColor: "#1D4ED8",  badgeBg: "#DBEAFE",     label: "Teach"  };
  }
  // learner in a learn session (has teacher)
  return     { icon: "🎓", iconBg: T.purpleLight, badgeColor: T.purple,   badgeBg: T.purpleLight, label: "Learn"  };
}

export default function MySessionsPage() {
  const { mySessions, openSession } = useApp();
  const [filter, setFilter] = useState("all");

  const filtered = mySessions.filter(s => {
    if (filter === "all") return true;
    const { label } = sessionConfig(s);
    if (filter === "teach")  return label === "Teach";
    if (filter === "learn")  return label === "Learn";
    if (filter === "collab") return label === "Collab";
    return true;
  });
  const grouped = {
    waiting_room: filtered.filter(s => s.status === "waiting_room"),
    scheduled:    filtered.filter(s => s.status === "scheduled"),
    completed:    filtered.filter(s => s.status === "completed"),
  };

  function SessionMiniCard({ s }) {
    const label = s.skill || s.activity || "Session";
    const cfg   = sessionConfig(s);
    const statusViews = { waiting_room: "waitingRoom", scheduled: "waitingRoom", completed: "completed" };

    const timeStr = s.scheduledTime || "";
    const locStr  = s.location || "";

    // Count info — same logic as feed cards
    let countStr = "";
    if (s.type === "learn") {
      const parts = [`${s.interested} interested`];
      if (s.scheduledTime && s.interested >= (s.minGroup ?? 0)) {
        const regCount = s.participants?.length ?? 0;
        if (regCount > 0) parts.push(`${regCount} registered`);
      }
      if (s.minGroup && s.maxGroup) parts.push(`capacity: ${s.minGroup}–${s.maxGroup}`);
      countStr = parts.join(" · ");
    } else if (s.type === "collab") {
      const pList = s.participants || [];
      countStr = `${pList.length + (s.interested ?? 0)} interested`;
    }

    return (
      <Card
        style={{ marginBottom: 10, cursor: "pointer" }}
        onClick={() => openSession(s, statusViews[s.status] || "waitingRoom")}
      >
        <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
          {/* Type icon */}
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: cfg.iconBg, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 19,
          }}>
            {cfg.icon}
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Line 1: title + badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
              <span style={{
                fontWeight: 700, fontSize: 14, color: T.text,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                flex: 1, minWidth: 0,
              }}>
                {label}
              </span>
              <Badge color={cfg.badgeColor} bg={cfg.badgeBg}>{cfg.label}</Badge>
            </div>
            {/* Line 2: time (T.textMid, matches feed) */}
            {timeStr && (
              <div style={{ fontSize: 12, color: T.textMid, fontWeight: 500 }}>{timeStr}</div>
            )}
            {/* Line 3: location (T.textMid, matches feed) */}
            {locStr && (
              <div style={{ fontSize: 12, color: T.textMid, fontWeight: 500 }}>{locStr}</div>
            )}
            {/* Line 4: count info (muted, matches feed) */}
            {countStr && (
              <div style={{ fontSize: 12, color: T.muted }}>{countStr}</div>
            )}
          </div>

          <div style={{ fontSize: 18, color: T.purple, fontWeight: 300, flexShrink: 0 }}>›</div>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <PageHeader>
        <div style={{
          fontSize: 22, fontWeight: 800, color: T.text,
          letterSpacing: "-0.03em", marginBottom: 10,
        }}>
          My Sessions
        </div>
        <div style={{ display: "flex", gap: 8, paddingBottom: 12, overflowX: "auto" }}>
          {[
            { id: "all",    label: "All"    },
            { id: "teach",  label: "Teach"  },
            { id: "learn",  label: "Learn"  },
            { id: "collab", label: "Collab" },
          ].map(({ id, label }) => (
            <Pill key={id} active={filter === id} onClick={() => setFilter(id)}>
              {label}
            </Pill>
          ))}
        </div>
      </PageHeader>

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
