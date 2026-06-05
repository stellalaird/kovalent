import { T } from "../styles/theme";
import { useState } from "react";
import { MOCK_SESSIONS } from "../data/mockData";
import { useApp } from "../context/AppContext";
import PageHeader from "../components/PageHeader";
import Pill from "../components/Pill";
import TokenBadge from "../components/TokenBadge";
import SessionCard from "../components/SessionCard";
import TopicsPageContent from "../pages/TopicsPage";

export default function FeedPage() {
  const { feedView, setFeedView, activeTopic, sessionTypeFilter, setSessionTypeFilter, mySessions, profile, setTab, customSessions, communityFilter, setCommunityFilter, communitySort, setCommunitySort, joinedCommunities } = useApp();
  const [chronological, setChronological] = useState(false);

  const activityRank = { high: 0, medium: 1, low: 2 };
  const joinedIds = new Set(mySessions.map((s) => s.id));
  const feedSessions = [
    ...MOCK_SESSIONS.filter((s) => s.status === "feed" && !joinedIds.has(s.id)),
    ...customSessions.filter((s) => !joinedIds.has(s.id)),
  ];

  const typeFilter = sessionTypeFilter === "groups" ? "collab" : sessionTypeFilter;

  const expanded = feedSessions
    .filter((s) => typeFilter === "all" || s.type === typeFilter)
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
          <div style={{ fontSize: 11, color: T.muted, marginTop: 2, fontWeight: 500, letterSpacing: "0.01em" }}>
            Northwestern's skill-share community
          </div>
        </div>
        <TokenBadge count={profile.tokens} />
      </div>

      {!activeTopic && (
        <div style={{ display: "flex", gap: 0, background: "rgba(180,140,40,0.1)", borderRadius: 12, padding: 4, marginBottom: 10 }}>
          {[
            { id: "sessions", label: "Sessions" },
            { id: "topics", label: "Communities" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFeedView(id)}
              style={{
                flex: 1,
                padding: "7px 0",
                borderRadius: 9,
                border: "none",
                background: feedView === id ? T.surface : "transparent",
                color: feedView === id ? T.text : T.muted,
                fontWeight: feedView === id ? 700 : 500,
                fontFamily: T.fontBody,
                fontSize: 13,
                cursor: "pointer",
                letterSpacing: "-0.01em",
                boxShadow: feedView === id ? "0 1px 4px rgba(100,70,0,0.15)" : "none",
                transition: "all 0.15s",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      {!activeTopic && feedView === "topics" && (
        <div style={{ display: "flex", gap: 6, paddingBottom: 12, overflowX: "auto", alignItems: "center" }}>
          {[
            { id: "all",    label: "All" },
            { id: "joined", label: "Joined" },
          ].map(({ id, label }) => (
            <button key={id} onClick={() => setCommunityFilter(id)} style={filterBtnStyle(communityFilter === id, T.purple)}>
              {label}
            </button>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", gap: 6, flexShrink: 0 }}>
            {[
              { id: "alpha",         label: "A↑" },
              { id: "most_upcoming", label: "📅↑" },
              { id: "most_people",   label: "👤↑" },
            ].map(({ id, label }) => (
              <button key={id} onClick={() => setCommunitySort(id)} style={filterBtnStyle(communitySort === id, T.purple)}>
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
      {!activeTopic && feedView === "sessions" && (
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

          <div style={{ marginLeft: "auto", flexShrink: 0 }}>
            <button
              onClick={() => setChronological(c => !c)}
              style={filterBtnStyle(chronological, T.purple)}
            >
              🕐↑
            </button>
          </div>
        </div>
      )}
    </PageHeader>
  );

  if (feedView === "topics") {
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
        {header}
        <div style={{ flex: 1, overflowY: "auto", background: T.appBg }}>
          <TopicsPageContent />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      {header}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 80px", background: T.appBg, position: "relative" }}>
        {sorted.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>🔍</div>
            <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 18, color: T.text, letterSpacing: "-0.02em" }}>
              Nothing here yet
            </div>
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
