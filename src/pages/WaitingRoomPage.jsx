// ─── MOCK DATA ───────────────────────────────────────
import { MOCK_USERS, CURRENT_USER, MOCK_SESSIONS, MY_SESSIONS } from "../data/mockData";

// ─── APP STATE CONTEXT ───────────────────────────────────────
import { AppProvider, useApp } from "../context/AppContext";

// ─── UTILITY COMPONENTS ──────────────────────────────────────
import Avatar from "../components/Avatar";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Card from "../components/Card";
import Section from "../components/Section";

export default function WaitingRoomPage({ session }) {
  const { setTab, setActiveView, mySessions, showToast } = useApp();
  const isTeach = session.type === "teach";
  const isMeetup = session.type === "meetup";
  const label = session.skill || session.activity || "Session";
  const participants = session.waitingRoom || session.participants || [];
  const host = session.teacher || null;

  return (
    <div>
      <div style={{ background: "#6c4fc2", padding: "20px 16px 16px" }}>
        <button onClick={() => setTab("mySessions")} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 8, padding: "6px 12px", fontWeight: 600, cursor: "pointer", fontSize: 13, marginBottom: 14 }}>← Back</button>
        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          {isTeach ? "Teaching Session" : isMeetup ? "Group Meetup" : "Learning Session"}
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginTop: 4 }}>{label}</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", borderRadius: 999, padding: "4px 12px", marginTop: 8, fontSize: 13, color: "#fff" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
          Waiting Room · {participants.length + 1} joined
        </div>
      </div>

      <div style={{ padding: 16 }}>
        {/* Host card */}
        {host && (
          <Section title="Teacher">
            <Card style={{ marginBottom: 0 }}>
              <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar user={host} size={48} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{host.name}</div>
                  <div style={{ fontSize: 13, color: "#6b7280" }}>{host.year} · {host.major}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                    <span style={{ fontSize: 12, color: "#f59e0b" }}>★ {host.rating}</span>
                    <span style={{ fontSize: 12, color: "#6b7280" }}>· {host.taught} sessions taught</span>
                  </div>
                </div>
                <Badge color="#6c4fc2" bg="#ede9ff">Host</Badge>
              </div>
            </Card>
          </Section>
        )}

        {/* Participants */}
        <Section title={`Participants (${participants.length + 1})`}>
          {[CURRENT_USER, ...participants].map(u => (
            <Card key={u.id} style={{ marginBottom: 8 }}>
              <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar user={u} size={38} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{u.name} {u.id === "me" && <Badge color="#6c4fc2" bg="#ede9ff">You</Badge>}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>{u.year} · {u.major}</div>
                </div>
                <span style={{ fontSize: 12, color: "#f59e0b" }}>★ {u.rating}</span>
              </div>
            </Card>
          ))}
        </Section>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Button onClick={() => setActiveView("chatroom")}>
            💬 Open Chatroom
          </Button>
          <Button variant="ghost" onClick={() => showToast("Availability sent!")}>
            📅 Submit Availability
          </Button>
          <Button variant="danger" small onClick={() => { setTab("mySessions"); showToast("Left waiting room"); }}>
            Leave Session
          </Button>
        </div>
      </div>
    </div>
  );
}