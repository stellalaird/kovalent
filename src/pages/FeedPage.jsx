import { T } from "../styles/theme";
import { useState } from "react";
import { MOCK_SESSIONS } from "../data/mockData";
import { useApp } from "../context/AppContext";
import PageHeader from "../components/PageHeader";
import Pill from "../components/Pill";
import TokenBadge from "../components/TokenBadge";
import SessionCard from "../components/SessionCard";

export default function FeedPage() {
  const { sessionTypeFilter, setSessionTypeFilter, mySessions, profile, setTab, customSessions, joinedCommunities } = useApp();
  const [chronological, setChronological] = useState(false);
  const [joinedOnly, setJoinedOnly] = useState(false);

  const activityRank = { high: 0, medium: 1, low: 2 };
  const joinedIds = new Set(mySessions.map((s) => s.id));
  const feedSessions = [
    ...MOCK_SESSIONS.filter((s) => s.status === "feed" && !joinedIds.has(s.id)),
    ...customSessions.filter((s) => !joinedIds.has(s.id)),
  ];

  const typeFilter = sessionTypeFilter === "groups" ? "collab" : sessionTypeFilter;

  const expanded = feedSessions
    .filter((s) => typeFilter === "all" || s.type === typeFilter)
    .filter((s) => !joinedOnly || (s.tags || []).some(tag => joinedCommunities.includes(tag)))
    .flatMap(s => {
      if (s.type === "collab" && s.proposals?.length > 0) {
        return s.proposals.map(p => ({ ...s, _proposalKey: `${s.id}__feed__${p.id}`, _proposal: p }));
      }
      return [s];
    });

  const getTime = s => s._proposal?.time || s.scheduledTime || null;

  // Parse "Saturday, June 7 · 8:00 AM" → Date object
  function parseSessionTime(str) {
    if (!str) return null;
    try {
      // Strip day name, keep "June 7 · 8:00 AM"
      const withoutDay = str.replace(/^[A-Za-z]+,\s*/, "");
      // Split on " · " to get date and time parts
      const [datePart, timePart] = withoutDay.split(" · ");
      return new Date(`${datePart} 2025 ${timePart || "12:00 AM"}`);
    } catch {
      return null;
    }
  }

  const byActivity = (a, b) => (activityRank[a.activityLevel] ?? 2) - (activityRank[b.activityLevel] ?? 2);

  function interleave(a, b, ratio = 2) {
    const result = [];
    let ai = 0, bi = 0;
    while (ai < a.length || bi < b.length) {
      for (let i = 0; i < ratio && ai < a.length; i++) result.push(a[ai++]);
      if (bi < b.length) {
        result.push(b[bi++]);
        // Keep same-base-session proposals together
        while (bi < b.length && b[bi].id === b[bi - 1].id) result.push(b[bi++]);
      }
    }
    return result;
  }

  const sorted = (() => {
    let arr;
    if (chronological) {
      arr = [...expanded].sort((a, b) => {
        const ta = parseSessionTime(getTime(a));
        const tb = parseSessionTime(getTime(b));
        if (ta && tb) return ta - tb;
        if (ta) return -1;
        if (tb) return 1;
        return 0;
      });
    } else {
      const learnTeach = expanded.filter(s => s.type !== "collab").sort(byActivity);
      const collabs   = expanded.filter(s => s.type === "collab").sort(byActivity);
      arr = interleave(learnTeach, collabs, 2);
    }
    // Pin Lakefront Hike (s19) to 4th from last
    const lhIdx = arr.findIndex(s => s.id === "s19");
    if (lhIdx !== -1 && arr.length >= 4) {
      const [item] = arr.splice(lhIdx, 1);
      arr.splice(arr.length - 3, 0, item);
    }
    return arr;
  })();

  const filterBtnStyle = (active, color) => ({
    padding: "4px 12px",
    borderRadius: 6,
    border: active ? `1px solid ${color}55` : `1px solid ${T.border}`,
    background: active ? `${color}18` : "transparent",
    color: active ? color : T.muted,
    fontWeight: active ? 600 : 500,
    fontFamily: T.fontBody,
    fontSize: 12,
    cursor: "pointer",
    letterSpacing: "0.01em",
    transition: "all 0.15s",
    whiteSpace: "nowrap",
    flexShrink: 0,
  });

  const header = (
    <PageHeader>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L21 7V17L12 22L3 17V7L12 2Z" stroke="url(#kv-g)" strokeWidth="2" strokeLinejoin="round" fill="none"/>
            <circle cx="12" cy="12" r="2.5" fill="url(#kv-g)"/>
            <defs>
              <linearGradient id="kv-g" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F0C040"/>
                <stop offset="1" stopColor="#B8860B"/>
              </linearGradient>
            </defs>
          </svg>
          <span style={{
            fontSize: 24, fontWeight: 900, letterSpacing: "-0.04em",
            background: T.purpleGradient,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            fontFamily: T.fontDisplay,
          }}>
            kovalent
          </span>
        </div>
        <TokenBadge count={profile.tokens} />
      </div>

      <div style={{ display: "flex", gap: 6, paddingBottom: 12, overflowX: "auto", alignItems: "center" }}>
          {[
            { id: "all",    label: "All",    color: T.purple },
            { id: "learn",  label: "Learn",  color: T.sessionTypes.learn.badge },
            { id: "teach",  label: "Teach",  color: T.sessionTypes.teach.badge },
            { id: "groups", label: "Collabs", color: T.purple },
          ].map(({ id, label, color }) => (
            <button
              key={id}
              onClick={() => setSessionTypeFilter(id)}
              style={filterBtnStyle(sessionTypeFilter === id, color)}
            >
              {label}
            </button>
          ))}

          <div style={{ marginLeft: "auto", display: "flex", gap: 6, flexShrink: 0 }}>
            <button
              onClick={() => setJoinedOnly(j => !j)}
              style={{ ...filterBtnStyle(joinedOnly, T.purple), display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="9" cy="7" r="3"
                  fill={joinedOnly ? T.purpleVibrant : "none"}
                  stroke={joinedOnly ? T.purpleVibrant : T.muted}
                  strokeWidth="1.8" />
                <circle cx="17" cy="9" r="2.5"
                  fill={joinedOnly ? T.purpleVibrant : "none"}
                  stroke={joinedOnly ? T.purpleVibrant : T.muted}
                  strokeWidth="1.8" />
                <path d="M2 20c0-3.314 3.134-6 7-6s7 2.686 7 6"
                  fill={joinedOnly ? T.purpleVibrant : "none"}
                  stroke={joinedOnly ? T.purpleVibrant : T.muted}
                  strokeWidth="1.8" strokeLinecap="round" />
                <path d="M19 15c1.657 0 3 1.343 3 3"
                  stroke={joinedOnly ? T.purpleVibrant : T.muted}
                  strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
            <button
              onClick={() => setChronological(c => !c)}
              style={{ ...filterBtnStyle(chronological, T.purple), display: "flex", alignItems: "center", gap: 3 }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9"
                  fill={chronological ? T.purpleVibrant : "none"}
                  stroke={chronological ? T.purpleVibrant : T.muted}
                  strokeWidth="1.8" />
                <path d="M12 7v5l3 3"
                  stroke={chronological ? T.appBg : T.muted}
                  strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              ↑
            </button>
          </div>
        </div>
    </PageHeader>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      {header}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 80px", background: T.appBg, position: "relative" }}>
        {sorted.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 20px" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🏘️</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: T.text, marginBottom: 4 }}>Nothing here yet</div>
            <div style={{ fontSize: 13, color: T.muted }}>Join communities to view their sessions</div>
          </div>
        )}
        {sorted.map((session) => (
          <SessionCard key={session._proposalKey || session.id} session={session} />
        ))}
      </div>
      <button
        onClick={() => setTab("createSession")}
        style={{
          position: "absolute",
          bottom: 90,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: T.purpleGradient,
          border: "none",
          color: "#fff",
          fontSize: 28,
          fontWeight: 300,
          lineHeight: 1,
          cursor: "pointer",
          boxShadow: T.btnPrimaryShadow,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        +
      </button>
    </div>
  );
}
