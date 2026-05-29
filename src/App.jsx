// ============================================================
// KOVALENT
// Frameworks: React, Tailwind (CDN), React Router (CDN)
// ============================================================

// import { useState, useContext, createContext, useEffect, useRef } from "react";

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

// ─── MOCK DATA ───────────────────────────────────────
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
// import TeachCard from "./components/TeachCard";

// ─── PAGES ───────────────────────────────────────────────────
import BottomNav from "./pages/BottomNav";
// import ChatroomPage from "./pages/ChatroomPage";
// import CompletedPage from "./pages/CompletedPage";
import FeedPage from "./pages/FeedPage";
import MySessionsPage from "./pages/MySessionsPage";
import ProfilePage from "./pages/ProfilePage";
// import ScheduledPage from "./pages/ScheduledPage";
import SessionPage from "./pages/SessionPage";
import SettingsPage from "./pages/SettingsPage";
// import WaitingRoomPage from "./pages/WaitingRoomPage";

// ─── ROOT APP ─────────────────────────────────────────────────

function AppInner() {
  const { tab, toast, darkMode } = useApp();

  return (
    <div style={{
      maxWidth: 480, margin: "0 auto",
      minHeight: "100vh",
      background: darkMode ? "#0f0f1a" : "#f9fafb",
      fontFamily: "'Nunito', system-ui, sans-serif",
      paddingBottom: 80,
      position: "relative",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes slideUp { from { opacity: 0; transform: translate(-50%, 12px); } to { opacity: 1; transform: translate(-50%, 0); } }
        ::-webkit-scrollbar { width: 0; }
        input:focus, select:focus { border-color: #6c4fc2 !important; outline: none !important; }
      `}</style>

      <div style={{ minHeight: "calc(100vh - 80px)", overflowY: "auto" }}>
        {tab === "feed" && <FeedPage />}
        {tab === "mySessions" && <MySessionsPage />}
        {tab === "profile" && <ProfilePage />}
        {tab === "settings" && <SettingsPage />}
        {tab === "session" && <SessionPage />}
      </div>

      {tab !== "session" && <BottomNav />}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}