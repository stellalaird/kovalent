import { useState, useContext, createContext, useEffect, useRef } from "react";

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

export default function ScheduledPage({ session }) {
  const { setTab, setActiveView, showToast } = useApp();
  const [showContact, setShowContact] = useState(null);
  const label = session.skill || session.activity;
  const host = session.teacher;
  const participants = session.participants || [];

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg, #6c4fc2 0%, #4c1d95 100%)", padding: "20px 16px 16px" }}>
        <button onClick={() => setTab("mySessions")} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 8, padding: "6px 12px", fontWeight: 600, cursor: "pointer", fontSize: 13, marginBottom: 14 }}>← Back</button>
        <Badge color="#fff" bg="rgba(255,255,255,0.2)">Scheduled ✓</Badge>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginTop: 8 }}>{label}</div>
      </div>

      <div style={{ padding: 16 }}>
        {/* Confirmed details */}
        <Card style={{ marginBottom: 16 }}>
          <div style={{ padding: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, color: "#374151" }}>📋 Session Details</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["🕐", "When", session.scheduledTime || "Saturday, June 7 · 2:00 PM"],
                ["📍", "Where", session.location || "Norris University Center"],
                ["🎒", "Materials", session.materials || "Nothing to bring"],
              ].map(([icon, label, val]) => (
                <div key={label} style={{ display: "flex", gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e" }}>{val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Participants with contact */}
        <Section title="Participants">
          {[CURRENT_USER, ...(host ? [host] : []), ...participants].map(u => (
            <Card key={u.id} style={{ marginBottom: 8 }}>
              <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar user={u} size={40} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>
                    {u.name} {u.id === "me" && <Badge color="#6c4fc2" bg="#ede9ff">You</Badge>}
                    {u.id === host?.id && <Badge color="#92400e" bg="#fef3c7">Teacher</Badge>}
                  </div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>{u.year}</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <Badge color="#10b981" bg="#d1fae5">✓ Confirmed</Badge>
                  <button onClick={() => setShowContact(showContact === u.id ? null : u.id)}
                    style={{ background: "#f3f4f6", border: "none", borderRadius: 8, padding: "4px 8px", fontSize: 12, cursor: "pointer", fontWeight: 600, color: "#374151" }}>
                    Contact
                  </button>
                </div>
              </div>
              {showContact === u.id && (
                <div style={{ padding: "0 14px 12px", background: "#f9fafb", borderTop: "1px solid #f3f4f6" }}>
                  <div style={{ fontSize: 13, color: "#374151" }}>📧 {u.contact}</div>
                </div>
              )}
            </Card>
          ))}
        </Section>

        <div style={{ display: "flex", gap: 8 }}>
          <Button onClick={() => setActiveView("chatroom")} style={{ flex: 1 }}>💬 Group Chat</Button>
          <Button variant="secondary" onClick={() => showToast("Calendar event added!")}>📅 Add to Calendar</Button>
        </div>
      </div>
    </div>
  );
}