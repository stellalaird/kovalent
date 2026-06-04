import { T } from "../styles/theme";
import { useState } from "react";
import { useApp } from "../context/AppContext";

const fieldStyle = {
  width: "100%",
  borderRadius: 12,
  border: `1px solid ${T.border}`,
  padding: "11px 14px",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
  color: T.text,
  background: "#fff",
  fontFamily: T.fontBody,
  letterSpacing: "-0.01em",
  transition: "border-color 0.15s",
};

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontSize: 10, fontWeight: 700, color: T.muted,
        textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 7,
      }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function formatTime(dateVal, timeVal) {
  if (!dateVal || !timeVal) return null;
  const [year, month, day] = dateVal.split("-").map(Number);
  const [hRaw, min] = timeVal.split(":").map(Number);
  const d = new Date(year, month - 1, day);
  const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
  const monthName = d.toLocaleDateString("en-US", { month: "long" });
  const ampm = hRaw >= 12 ? "PM" : "AM";
  const h12 = hRaw % 12 || 12;
  const minStr = String(min).padStart(2, "0");
  return `${weekday}, ${monthName} ${day} · ${h12}:${minStr} ${ampm}`;
}

export default function ProposeMeetupPage({ session }) {
  const { setActiveView, setActiveSession, setMySessions, profile } = useApp();
  const fieldStyle = {
    width: "100%",
    borderRadius: 12,
    border: `1px solid ${T.border}`,
    padding: "11px 14px",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    color: T.text,
    background: T.surface,
    fontFamily: T.fontBody,
    letterSpacing: "-0.01em",
    transition: "border-color 0.15s",
  };

  const [form, setForm] = useState({
    dateVal: "",
    timeVal: "",
    location: "",
    note: "",
  });

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  const canSubmit = form.dateVal && form.timeVal && form.location.trim();

  function handlePropose() {
    if (!canSubmit) return;
    const time = formatTime(form.dateVal, form.timeVal);
    const proposal = {
      id: `prop-${session.id}-${Date.now()}`,
      proposer: profile,
      time,
      location: form.location.trim(),
      note: form.note.trim() || null,
      interested: 0,
      registrations: 0,
      messages: [],
    };
    const addProposal = s => ({
      ...s,
      proposals: [...(s.proposals || []), proposal],
    });
    setActiveSession(prev => addProposal(prev));
    setMySessions(prev => prev.map(s => s.id === session.id ? addProposal(s) : s));
    setActiveView("waitingRoom");
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      <div style={{
        padding: "14px 18px 16px",
        background: T.headerBg,
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: `1px solid ${T.border}`,
        flexShrink: 0,
      }}>
        <button
          onClick={() => setActiveView("waitingRoom")}
          style={{
            background: "none", border: "none", color: T.purple,
            fontWeight: 700, fontSize: 14, cursor: "pointer", padding: 0,
            letterSpacing: "-0.01em", marginBottom: 12,
          }}
        >
          ← Back
        </button>
        <div style={{
          fontFamily: T.fontDisplay, fontSize: 24, fontWeight: 900,
          color: T.text, letterSpacing: "-0.04em",
        }}>
          Propose Meetup
        </div>
        <div style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>
          {session.activity}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "22px 18px 120px", background: T.appBg }}>
        <Field label="Date">
          <input
            type="date"
            min={today}
            value={form.dateVal}
            onChange={e => set("dateVal", e.target.value)}
            style={fieldStyle}
            onFocus={e => e.target.style.borderColor = T.cardBorderBright}
            onBlur={e => e.target.style.borderColor = T.border}
          />
        </Field>

        <Field label="Time">
          <input
            type="time"
            value={form.timeVal}
            onChange={e => set("timeVal", e.target.value)}
            style={fieldStyle}
            onFocus={e => e.target.style.borderColor = T.cardBorderBright}
            onBlur={e => e.target.style.borderColor = T.border}
          />
        </Field>

        <Field label="Location">
          <input
            value={form.location}
            onChange={e => set("location", e.target.value)}
            placeholder="e.g. Norris Game Room"
            style={fieldStyle}
            onFocus={e => e.target.style.borderColor = T.cardBorderBright}
            onBlur={e => e.target.style.borderColor = T.border}
          />
        </Field>

        <Field label="Note (optional)">
          <textarea
            value={form.note}
            onChange={e => set("note", e.target.value)}
            placeholder="e.g. Right after classes, easy for everyone"
            rows={3}
            style={{ ...fieldStyle, resize: "none", lineHeight: 1.6 }}
            onFocus={e => e.target.style.borderColor = T.cardBorderBright}
            onBlur={e => e.target.style.borderColor = T.border}
          />
        </Field>
      </div>

      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        padding: "16px 18px 28px",
        background: `linear-gradient(to top, ${T.appBg} 70%, transparent)`,
        pointerEvents: "none",
      }}>
        <button
          onClick={handlePropose}
          disabled={!canSubmit}
          style={{
            width: "100%",
            padding: "15px 0",
            borderRadius: 14,
            border: "none",
            background: canSubmit ? T.purpleGradient : T.surface,
            color: canSubmit ? "#fff" : T.muted,
            fontSize: 15,
            fontWeight: 700,
            fontFamily: T.fontBody,
            cursor: canSubmit ? "pointer" : "default",
            letterSpacing: "-0.01em",
            boxShadow: canSubmit ? T.btnPrimaryShadow : "none",
            pointerEvents: "all",
            transition: "all 0.15s",
          }}
        >
          Propose Meetup
        </button>
      </div>
    </div>
  );
}
