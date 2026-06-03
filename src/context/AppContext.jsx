import { createContext, useContext, useState } from "react";

// ─── MOCK DATA ───────────────────────────────────────
import { CURRENT_USER, MY_SESSIONS } from "../data/mockData";

const AppCtx = createContext(null);
function useApp() { return useContext(AppCtx); }

function AppProvider({ children }) {
  const [tab, setTab] = useState("feed");
  const [feedView, setFeedView] = useState("sessions");
  const [sessionTypeFilter, setSessionTypeFilter] = useState("all");
  const [activeTopic, setActiveTopic] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [activeView, setActiveView] = useState(null); // "waitingRoom"|"chatroom"|"scheduled"|"completed"
  const [mySessions, setMySessions] = useState(MY_SESSIONS);
  const [profile, setProfile] = useState(CURRENT_USER);
  const [darkMode, setDarkMode] = useState(false);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function joinSession(session) {
    const already = mySessions.find(s => s.id === session.id);
    if (already) return;
    const myRole = session.type === "collab" ? "participant" : "learner";
    setMySessions(prev => [...prev, { ...session, status: "waiting_room", myRole }]);
  }

  function openSession(session, view = "waitingRoom") {
    setActiveSession(session);
    setActiveView(view);
    setTab("session");
  }

  return (
    <AppCtx.Provider value={{
      tab, setTab,
      feedView, setFeedView,
      sessionTypeFilter, setSessionTypeFilter,
      activeTopic, setActiveTopic,
      expandedCard, setExpandedCard,
      activeSession, setActiveSession,
      activeView, setActiveView,
      mySessions, setMySessions,
      profile, setProfile,
      darkMode, setDarkMode,
      toast, showToast,
      modal, setModal,
      viewingUser, setViewingUser,
      joinSession, openSession,
    }}>
      {children}
    </AppCtx.Provider>
  );
}


export { AppProvider, useApp };