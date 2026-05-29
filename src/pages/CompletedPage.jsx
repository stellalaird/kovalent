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

export default function CompletedPage({ session }) {
  const { setTab, showToast } = useApp();
  const label = session.skill || session.activity;
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const participants = session.attended || session.participants || [];

  return (
    <div>
      <div style={{ background: "#065f46", padding: "20px 16px 16px" }}>
        <button onClick={() => setTab("mySessions")} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 8, padding: "6px 12px", fontWeight: 600, cursor: "pointer", fontSize: 13, marginBottom: 14 }}>← Back</button>
        <Badge color="#fff" bg="rgba(255,255,255,0.2)">Completed 🎉</Badge>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginTop: 8 }}>{label}</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>{session.scheduledTime}</div>
      </div>

      <div style={{ padding: 16 }}>
        {/* Photo section */}
        <Card style={{ marginBottom: 16 }}>
          <div style={{ padding: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>📸 Group Photo</div>
            <div style={{ background: "#f3f4f6", borderRadius: 12, height: 140, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              onClick={() => showToast("Photo upload coming soon!")}>
              <span style={{ fontSize: 36, marginBottom: 6 }}>🖼️</span>
              <span style={{ fontSize: 13, color: "#6b7280" }}>Tap to upload group photo</span>
            </div>
          </div>
        </Card>

        {/* Attendance */}
        <Section title="Attendance">
          {[CURRENT_USER, ...participants].map(u => (
            <Card key={u.id} style={{ marginBottom: 8 }}>
              <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar user={u} size={38} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{u.name} {u.id === "me" && <Badge color="#6c4fc2" bg="#ede9ff">You</Badge>}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>{u.year}</div>
                </div>
                <Badge color="#065f46" bg="#d1fae5">✓ Attended</Badge>
              </div>
            </Card>
          ))}
        </Section>

        {/* Rating */}
        <Card style={{ marginBottom: 16 }}>
          <div style={{ padding: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Rate this session</div>
            {!submitted ? (
              <>
                <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} onClick={() => setRating(n)}
                      onMouseEnter={() => setHoverRating(n)} onMouseLeave={() => setHoverRating(0)}
                      style={{ background: "none", border: "none", fontSize: 28, cursor: "pointer", color: n <= (hoverRating || rating) ? "#f59e0b" : "#e5e7eb" }}>★</button>
                  ))}
                </div>
                <Button small onClick={() => { if (rating > 0) { setSubmitted(true); showToast("Rating submitted! +2 tokens earned ✦"); } }}>
                  Submit Rating
                </Button>
              </>
            ) : (
              <div style={{ color: "#065f46", fontWeight: 600, fontSize: 14 }}>✅ Thanks for rating! +2 tokens earned ✦</div>
            )}
          </div>
        </Card>

        {/* Tokens earned */}
        <Card style={{ marginBottom: 16, background: "#fffbeb", border: "1px solid #fde68a" }}>
          <div style={{ padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 32 }}>✦</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: "#92400e" }}>+5 Tokens Earned!</div>
              <div style={{ fontSize: 13, color: "#713f12" }}>For completing this session. Current total: {CURRENT_USER.tokens + 5}</div>
            </div>
          </div>
        </Card>

        <Button onClick={() => showToast("New session created from this one!")}>
          🔁 Repeat Session
        </Button>
      </div>
    </div>
  );
}