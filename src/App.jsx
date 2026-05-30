// ============================================================
// KOVALENT
// Frameworks: React, Tailwind (CDN), React Router (CDN)
// ============================================================

// ─── DESIGN TOKENS ──────────────────────────────────────────
const PURPLE = {
  50: "#f3f0ff", 100: "#e0d9ff", 200: "#c4b5fd",
  400: "#a78bfa", 600: "#7c3aed", 800: "#4c1d95",
};
const COLORS = {
  bg: "#fafaf9", card: "#ffffff", border: "#e5e7eb",
  text: "#1a1a2e", muted: "#6b7280", purple: "#6c4fc2",
  purpleLight: "#ede9ff", purpleDark: "#4c1d95",
  accent: "#f59e0b", success: "#10b981", danger: "#ef4444",
  warm: "#fef3c7",
};

// import { useState, useContext, createContext, useEffect, useRef } from "react";

// ─── STYLES ──────────────────────────────────────────────────
import { T } from "./styles/theme";


// ─── MOCK DATA ───────────────────────────────────────────────
import { MOCK_USERS, CURRENT_USER, MOCK_SESSIONS, MY_SESSIONS } from "./data/mockData";

// ─── APP STATE CONTEXT ───────────────────────────────────────
import { AppProvider, useApp } from "./context/AppContext";

// ─── UTILITY COMPONENTS ──────────────────────────────────────
// import ActivityDot from "./components/ActivityDot";
// import Avatar from "./components/Avatar";
// import AvatarRow from "./components/AvatarRow";
// import Badge from "./components/Badge";
// import Button from "./components/Button";
// import Card from "./components/Card";
// import Pill from "./components/Pill";
// import Section from "./components/Section";
import Toast from "./components/Toast";
// import TokenBadge from "./components/TokenBadge";

// ─── FEED CARD COMPONENTS ────────────────────────────────────
// import ActivityBadge from "./components/ActivityBadge";
// import LearnCard from "./components/LearnCard";
// import MeetupCard from "./components/MeetupCard";
//import SessionCard from "../components/SessionCard";
// import TeachCard from "./components/TeachCard";

// ─── PAGES ───────────────────────────────────────────────────
import BottomNav from "./pages/BottomNav";
// import ChatroomPage from "./pages/ChatroomPage";
// import CompletedPage from "./pages/CompletedPage";
import FeedPage from "./pages/FeedPage";
import MySessionsPage from "./pages/MySessionsPage";
import ProfilePage from "./pages/ProfilePage";
// import TopicsPage from "./pages/TopicsPage";
// import ScheduledPage from "./pages/ScheduledPage";
import SessionPage from "./pages/SessionPage";
import SettingsPage from "./pages/SettingsPage";
// import WaitingRoomPage from "./pages/WaitingRoomPage";

// ─── ROOT APP ─────────────────────────────────────────────────

function AppInner() {
  const { tab, toast } = useApp();

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 430,
        minHeight: "100vh",
        background: T.appBg,
        position: "relative",
        overflowX: "hidden",
        paddingBottom: tab === "session" ? 0 : 76,
        boxShadow: "0 0 60px rgba(109,40,217,0.22), 0 0 120px rgba(0,0,0,0.55)",
      }}
    >
      {tab === "feed" && <FeedPage />}
      {tab === "mySessions" && <MySessionsPage />}
      {tab === "session" && <SessionPage />}
      {tab === "profile" && <ProfilePage />}
      {tab === "settings" && <SettingsPage />}

      {tab !== "session" && <BottomNav />}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <div
        style={{
          minHeight: "100vh",
          background: T.desktopBg,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <AppInner />
      </div>
    </AppProvider>
  );
}