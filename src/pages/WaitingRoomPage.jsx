import { CURRENT_USER, MOCK_USERS } from "../data/mockData";
import { useApp } from "../context/AppContext";
import { T } from "../styles/theme";
import Avatar from "../components/Avatar";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Card from "../components/Card";
import Section from "../components/Section";

export default function WaitingRoomPage({ session }) {
  const { setTab, setActiveView, mySessions, setMySessions, joinSession, showToast, setViewingUser } = useApp();
  const mySession = mySessions.find((s) => s.id === session.id);
  const alreadyJoined = !!mySession;
  const isTeach = session.type === "teach";
  const isMeetup = session.type === "meetup";
  const alreadyRegistered = isTeach && mySession?.status === "scheduled";
  const label = session.skill || session.activity || "Session";
  const host = session.teacher || null;

  // ── Build participant lists ──────────────────────────────
  // Registered = confirmed attendance (teach sessions only for now)
  const registeredList = isTeach ? (session.participants || []) : [];
  const registeredIds = new Set(registeredList.map((u) => u.id));

  // Known real users who are interested
  const knownInterested = [
    ...(alreadyJoined ? [CURRENT_USER] : []),
    ...(session.waitingRoom || []),
    ...(!isTeach ? (session.participants || []) : []),
  ]
    .filter((u, i, arr) => arr.findIndex((x) => x.id === u.id) === i)
    .filter((u) => !registeredIds.has(u.id));

  // Target interested count from mock data
  const targetInterested = isTeach
    ? (session.interested ?? knownInterested.length)
    : (session.participants?.length ?? 0) + (session.interested ?? 0);

  // Fill the gap with real users from the pool
  const usedIds = new Set([
    ...knownInterested.map((u) => u.id),
    ...registeredList.map((u) => u.id),
    ...(host ? [host.id] : []),
  ]);
  const pool = MOCK_USERS.filter((u) => !usedIds.has(u.id));
  const needed = Math.max(0, targetInterested - knownInterested.length);
  const extras = pool.slice(0, needed);

  const interestedList = [...knownInterested, ...extras];
  // Registered users sorted to the top
  const allParticipants = [...registeredList, ...interestedList];
  const totalCount = allParticipants.length;

  return (
    <div>
      <div style={{ background: T.purpleGradient, padding: "20px 16px 16px" }}>
        <button
          onClick={() => setTab("mySessions")}
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
          ← Back
        </button>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "rgba(255,255,255,0.7)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          {isMeetup ? "Group Collab" : session.myRole === "learner" ? "Learning Session" : "Teaching Session"}
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginTop: 4 }}>{label}</div>

        {/* Info chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
          {/* Joined count — always shown */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.15)", borderRadius: 999, padding: "4px 11px", fontSize: 12, color: "#fff" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.success, display: "inline-block" }} />
            {totalCount} joined
          </div>

          {/* Capacity — teach sessions only */}
          {isTeach && session.minGroup && session.maxGroup && (
            <div style={{ display: "inline-flex", alignItems: "center", background: "rgba(255,255,255,0.15)", borderRadius: 999, padding: "4px 11px", fontSize: 12, color: "#fff" }}>
              capacity: {session.minGroup}–{session.maxGroup}
            </div>
          )}

          {/* Registered count — teach sessions, only if > 0 */}
          {isTeach && registeredList.length > 0 && (
            <div style={{ display: "inline-flex", alignItems: "center", background: "rgba(255,255,255,0.15)", borderRadius: 999, padding: "4px 11px", fontSize: 12, color: "#fff" }}>
              {registeredList.length} registered
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: 16 }}>
        {/* Action buttons — at the top */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {/* Join — shown until the user has joined */}
          {!alreadyJoined && (
            <Button onClick={() => joinSession(session)}>✓ Join</Button>
          )}

          {/* Register — shown when joined, teach, meeting details set, not yet registered */}
          {alreadyJoined && isTeach && session.scheduledTime && !alreadyRegistered && (
            <Button
              onClick={() => {
                setMySessions(prev =>
                  prev.map(s => s.id === session.id ? { ...s, status: "scheduled" } : s)
                );
              }}
            >
              ✓ Register
            </Button>
          )}

          {/* Registered state */}
          {alreadyRegistered && isTeach && (
            <Button variant="success" style={{ cursor: "default" }} onClick={() => {}}>
              ✓ Registered
            </Button>
          )}

          {/* Chat — available after joining, for teach and collab sessions */}
          {alreadyJoined && (isTeach || isMeetup) && (
            <Button onClick={() => setActiveView("chatroom")}>💬 Group Chat</Button>
          )}

          {/* Cancel Registration (if registered) or Leave */}
          {alreadyRegistered ? (
            <Button
              variant="danger"
              small
              onClick={() => {
                setMySessions(prev =>
                  prev.map(s => s.id === session.id ? { ...s, status: "waiting_room" } : s)
                );
              }}
            >
              Cancel Registration
            </Button>
          ) : (
            <Button
              variant="danger"
              small
              onClick={() => {
                setMySessions(prev => prev.filter(s => s.id !== session.id));
                setTab("feed");
              }}
            >
              Leave
            </Button>
          )}
        </div>

        {/* Meeting details — teach sessions only */}
        {isTeach && (
          <Section title="Meeting Details">
            <Card style={{ marginBottom: 16 }}>
              <div style={{ padding: 14 }}>
                {!session.scheduledTime && (session.interested ?? 0) < (session.minGroup ?? 0) && (
                  <div style={{ fontSize: 12, color: T.muted, fontStyle: "italic", marginBottom: 12 }}>
                    Need {(session.minGroup ?? 0) - (session.interested ?? 0)} more interested before the teacher can schedule.
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    ["🕐", "When",      session.scheduledTime || "TBD"],
                    ["📍", "Where",     session.location      || "TBD"],
                    ["🎒", "Materials", session.materials     || "TBD"],
                  ].map(([icon, lbl, val]) => (
                    <div key={lbl} style={{ display: "flex", gap: 10 }}>
                      <span style={{ fontSize: 18 }}>{icon}</span>
                      <div>
                        <div style={{ fontSize: 11, color: T.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{lbl}</div>
                        <div style={{ fontSize: 14, fontWeight: val === "TBD" ? 400 : 600, color: val === "TBD" ? T.muted : T.text, marginTop: 1 }}>{val}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </Section>
        )}

        {host && (
          <Section title="Teacher">
            <Card style={{ marginBottom: 0, cursor: "pointer" }} onClick={() => setViewingUser(host)}>
              <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar user={host} size={48} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: T.text }}>{host.name}</div>
                  <div style={{ fontSize: 13, color: T.muted }}>
                    {host.year} · {host.major}
                  </div>
                  <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>
                    {host.taught} sessions taught
                  </div>
                </div>
                <Badge color={T.purple} bg={T.purpleLight}>Host</Badge>
              </div>
            </Card>
          </Section>
        )}

        <Section title={`Participants (${totalCount})`}>
          {allParticipants.map((u) => (
            <Card
              key={u.id}
              style={{ marginBottom: 8, cursor: u.id !== "me" ? "pointer" : "default" }}
              onClick={u.id !== "me" ? () => setViewingUser(u) : undefined}
            >
              <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar user={u} size={38} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: T.text, display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
                    {u.name}
                    {u.id === "me" && (
                      <Badge color={T.purple} bg={T.purpleLight}>You</Badge>
                    )}
                  </div>
                  {u.year && (
                    <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>
                      {u.year}{u.major ? ` · ${u.major}` : ""}
                    </div>
                  )}
                </div>
                {registeredIds.has(u.id) && (
                  <Badge color={T.success} bg={T.successBg}>Registered</Badge>
                )}
              </div>
            </Card>
          ))}
        </Section>

      </div>
    </div>
  );
}
