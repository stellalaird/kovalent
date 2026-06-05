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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
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
            }}
          >
            ← Back
          </button>
          <button
            onClick={() => setActiveView("chatroom")}
            style={{
              background: "rgba(255,255,255,0.25)",
              border: "1px solid rgba(255,255,255,0.4)",
              color: "#fff",
              borderRadius: 10,
              padding: "6px 14px",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: 13,
              letterSpacing: "-0.01em",
              display: "flex", alignItems: "center", gap: 5,
            }}
          >
            Group Chat 💬
          </button>
        </div>
        <Badge color="#fff" bg="rgba(255,255,255,0.2)">
          Scheduled ✓
        </Badge>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginTop: 8 }}>{label}</div>
        {session.description && (
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.6, margin: "10px 0 0", letterSpacing: "-0.01em" }}>
            {session.description}
          </p>
        )}
        {session.tags && session.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
            {session.tags.map(tag => (
              <div key={tag} style={{ display: "inline-flex", alignItems: "center", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 999, padding: "4px 11px", fontSize: 12, color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>
                #{tag}
              </div>
            ))}
          </div>
        )}
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
          <Button variant="secondary" onClick={() => showToast("Calendar event added!")}>
            📅 Add to Calendar
          </Button>
        </div>
      </div>
    </div>
  );
}
