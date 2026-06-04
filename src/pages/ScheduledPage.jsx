import { T } from "../styles/theme";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import Avatar from "../components/Avatar";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Card from "../components/Card";
import Section from "../components/Section";

export default function ScheduledPage({ session }) {
  const { setTab, setActiveView, showToast, profile } = useApp();
  const [showContact, setShowContact] = useState(null);
  const label = session.skill || session.activity;
  const host = session.teacher;
  const participants = session.participants || [];

  return (
    <div>
      <div
        style={{
          background: T.purpleGradient,
          padding: "20px 16px 16px",
        }}
      >
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
        <Badge color="#fff" bg="rgba(255,255,255,0.2)">
          Scheduled ✓
        </Badge>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginTop: 8 }}>{label}</div>
      </div>

      <div style={{ padding: 16 }}>
        <Card style={{ marginBottom: 16 }}>
          <div style={{ padding: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, color: T.text }}>
              📋 Session Details
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["🕐", "When", session.scheduledTime || "Saturday, June 7 · 2:00 PM"],
                ["📍", "Where", session.location || "Norris University Center"],
                ["🎒", "Materials", session.materials || "Nothing to bring"],
              ].map(([icon, lbl, val]) => (
                <div key={lbl} style={{ display: "flex", gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: 12, color: T.muted }}>{lbl}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Section title="Participants">
          {[profile, ...(host ? [host] : []), ...participants].map((u) => (
            <Card key={u.id} style={{ marginBottom: 8 }}>
              <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar user={u} size={40} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: T.text }}>
                    {u.name}{" "}
                    {u.id === "me" && (
                      <Badge color={T.purple} bg={T.purpleLight}>
                        You
                      </Badge>
                    )}
                    {u.id === host?.id && (
                      <Badge color={T.gold} bg={T.goldBg}>
                        Teacher
                      </Badge>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: T.muted }}>{u.year}</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <Badge color={T.success} bg={T.successBg}>✓ Confirmed</Badge>
                  <button
                    onClick={() => setShowContact(showContact === u.id ? null : u.id)}
                    style={{
                      background: T.purpleFaint,
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      padding: "4px 8px",
                      fontSize: 12,
                      cursor: "pointer",
                      fontWeight: 600,
                      color: T.textMid,
                    }}
                  >
                    Contact
                  </button>
                </div>
              </div>
              {showContact === u.id && (
                <div
                  style={{
                    padding: "0 14px 12px",
                    background: T.purpleFaint,
                    borderTop: `1px solid ${T.border}`,
                  }}
                >
                  <div style={{ fontSize: 13, color: T.textMid }}>📧 {u.contact}</div>
                </div>
              )}
            </Card>
          ))}
        </Section>

        <div style={{ display: "flex", gap: 8 }}>
          <Button onClick={() => setActiveView("chatroom")} style={{ flex: 1 }}>
            💬 Group Chat
          </Button>
          <Button variant="secondary" onClick={() => showToast("Calendar event added!")}>
            📅 Add to Calendar
          </Button>
        </div>
      </div>
    </div>
  );
}
