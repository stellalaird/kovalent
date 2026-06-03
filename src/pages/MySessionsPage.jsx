import { useState } from "react";
import { useApp } from "../context/AppContext";
import { T } from "../styles/theme";
import Avatar from "../components/Avatar";
import AvatarRow from "../components/AvatarRow";
import Badge from "../components/Badge";
import PageHeader from "../components/PageHeader";
import Pill from "../components/Pill";
import Section from "../components/Section";

export default function MySessionsPage() {
  const { mySessions, openSession } = useApp();
  const [filter, setFilter] = useState("all");

  const isTeachRole = s => s.myRole === "teacher";
  const isCollab = s => s.type === "collab";

  const filtered = mySessions.filter(s => {
    if (filter === "all") return true;
    if (filter === "collab") return isCollab(s);
    if (filter === "teach") return !isCollab(s) && isTeachRole(s);
    if (filter === "learn") return !isCollab(s) && !isTeachRole(s);
    return true;
  });

  const grouped = {
    waiting_room: filtered.filter(s => s.status === "waiting_room"),
    scheduled: filtered.filter(s => s.status === "scheduled"),
    completed: filtered.filter(s => s.status === "completed"),
  };

  function SessionMiniCard({ s }) {
    const title = s.skill || s.activity || "Session";
    const statusViews = { waiting_room: "waitingRoom", scheduled: "waitingRoom", completed: "completed" };
    const tLearn = T.sessionTypes.learn;
    const tTeach = T.sessionTypes.teach;

    const teacher = s.type === "learn" ? s.teacher : null;
    const pList = s.participants || [];
    const wList = s.waitingRoom || [];

    const avatarEl = isCollab(s)
      ? <AvatarRow users={pList} size={34} max={1} />
      : isTeachRole(s)
        ? <AvatarRow users={pList.length ? pList : wList} size={34} max={1} />
        : teacher
          ? <Avatar user={teacher} size={34} />
          : null;

    const sub = s.scheduledTime || (isCollab(s)
      ? `${(pList.length + (s.interested ?? 0))} interested`
      : `${s.interested ?? 0} interested`);

    return (
      <div
        style={{
          marginBottom: 8, cursor: "pointer",
          borderRadius: T.cardRadius,
          border: `1px solid ${T.cardBorder}`,
          background: isCollab(s) ? "#F2E8CE" : "#FFFFFF",
          boxShadow: T.cardShadow,
          overflow: "hidden",
        }}
        onClick={() => openSession(s, statusViews[s.status] || "waitingRoom")}
      >
        <div style={{ padding: "13px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          {avatarEl}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: sub ? 2 : 0 }}>
              <span style={{
                fontSize: 14, fontWeight: 600, color: T.text,
                letterSpacing: "-0.01em",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                flex: 1, minWidth: 0,
              }}>
                {title}
              </span>
              <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                {!isCollab(s) && isTeachRole(s) && <Badge color={tTeach.badge} bg={tTeach.bg}>Teach</Badge>}
                {!isCollab(s) && !isTeachRole(s) && <Badge color={tLearn.badge} bg={tLearn.bg}>Learn</Badge>}
              </div>
            </div>
            {sub && <div style={{ fontSize: 12, color: T.muted }}>{sub}</div>}
          </div>
          <div style={{ color: T.muted, flexShrink: 0, opacity: 0.5, fontSize: 16 }}>›</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader>
        <div style={{
          fontFamily: T.fontDisplay, fontSize: 24, fontWeight: 900,
          color: T.text, letterSpacing: "-0.04em", marginBottom: 12,
        }}>
          My Sessions
        </div>
        <div style={{ display: "flex", gap: 6, paddingBottom: 14, overflowX: "auto" }}>
          {["all", "teach", "learn", "collab"].map(id => (
            <Pill key={id} active={filter === id} onClick={() => setFilter(id)}>
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </Pill>
          ))}
        </div>
      </PageHeader>

      <div style={{ padding: "18px 16px", background: T.appBg, minHeight: "100vh" }}>
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
            <div style={{ fontSize: 48, marginBottom: 14 }}>📭</div>
            <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 18, color: T.text, marginBottom: 6, letterSpacing: "-0.02em" }}>
              No sessions yet
            </div>
            <div style={{ fontSize: 14, color: T.muted, lineHeight: 1.6 }}>Join a session from the feed to get started!</div>
          </div>
        )}
      </div>
    </div>
  );
}
