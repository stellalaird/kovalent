import { CURRENT_USER } from "../data/mockData";
import { useApp } from "../context/AppContext";
import { T } from "../styles/theme";
import Avatar from "../components/Avatar";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Card from "../components/Card";
import Section from "../components/Section";

export default function WaitingRoomPage({ session }) {
  const { setTab, setActiveView, showToast } = useApp();
  const isTeach = session.type === "teach";
  const isMeetup = session.type === "meetup";
  const label = session.skill || session.activity || "Session";
  const participants = session.waitingRoom || session.participants || [];
  const host = session.teacher || null;

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
          {isTeach ? "Teaching Session" : isMeetup ? "Group Meetup" : "Learning Session"}
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginTop: 4 }}>{label}</div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(255,255,255,0.15)",
            borderRadius: 999,
            padding: "4px 12px",
            marginTop: 8,
            fontSize: 13,
            color: "#fff",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: T.success,
              display: "inline-block",
            }}
          />
          Waiting Room · {participants.length + 1} joined
        </div>
      </div>

      <div style={{ padding: 16 }}>
        {host && (
          <Section title="Teacher">
            <Card style={{ marginBottom: 0 }}>
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

        <Section title={`Participants (${participants.length + 1})`}>
          {[CURRENT_USER, ...participants].map((u) => (
            <Card key={u.id} style={{ marginBottom: 8 }}>
              <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar user={u} size={38} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: T.text }}>
                    {u.name}{" "}
                    {u.id === "me" && (
                      <Badge color={T.purple} bg={T.purpleLight}>
                        You
                      </Badge>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: T.muted }}>
                    {u.year} · {u.major}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </Section>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Button onClick={() => setActiveView("chatroom")}>💬 Open Chatroom</Button>
          <Button variant="ghost" onClick={() => showToast("Availability sent!")}>
            📅 Submit Availability
          </Button>
          <Button
            variant="danger"
            small
            onClick={() => {
              setTab("mySessions");
              showToast("Left waiting room");
            }}
          >
            Leave Session
          </Button>
        </div>
      </div>
    </div>
  );
}
