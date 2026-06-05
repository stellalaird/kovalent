import { createContext, useContext, useState } from "react";
import { setDarkMode as setThemeDarkMode } from "../styles/theme";

// ─── MOCK DATA ───────────────────────────────────────
import { CURRENT_USER, MY_SESSIONS } from "../data/mockData";

const AppCtx = createContext(null);
function useApp() { return useContext(AppCtx); }

function AppProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState("feed");
  const [feedView, setFeedView] = useState("sessions");
  const [sessionTypeFilter, setSessionTypeFilter] = useState("all");
  const [activeTopic, setActiveTopic] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [activeView, setActiveView] = useState(null); // "waitingRoom"|"chatroom"|"scheduled"|"completed"
  const [mySessions, setMySessions] = useState([]);
  const [customSessions, setCustomSessions] = useState([]);
  const [teacherOverrides, setTeacherOverrides] = useState({});
  const [profile, setProfile] = useState(CURRENT_USER);
  const [darkMode, _setDarkMode] = useState(false);
  function setDarkMode(val) {
    setThemeDarkMode(val);  // update Proxy target before re-render
    _setDarkMode(val);
  }
  const [notifs, setNotifs] = useState({ messages: true, sessions: true, reminders: false });
  const [privacy, setPrivacy] = useState({ showContact: "community", showRating: true });
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [activeProposal, setActiveProposal] = useState(null);
  const [offerToTeachSession, setOfferToTeachSession] = useState(null);
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [customCommunities, setCustomCommunities] = useState([]);
  const [communityFilter, setCommunityFilter] = useState("all");
  const [communitySort,   setCommunitySort]   = useState("alpha");

  function loginAsMJ() {
    setProfile(CURRENT_USER);
    setMySessions(MY_SESSIONS);
    setJoinedCommunities([]);
    setCustomCommunities([]);
    setCustomSessions([]);
    setLoggedIn(true);
    setTab("feed");
  }

  function signUp(profileData) {
    const seed = (profileData.name || "user").replace(/\s+/g, "");
    setProfile({
      ...profileData,
      id: "me",
      avatar: profileData.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2),
      color: "#6c4fc2",
      photo: `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`,
      tokens: 3,
      taught: 0, learned: 0, collabs: 0,
      rating: null,
    });
    setMySessions([]);
    setJoinedCommunities([]);
    setCustomCommunities([]);
    setCustomSessions([]);
    setLoggedIn(true);
    setTab("feed");
  }

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function joinSession(session, roleOverride) {
    const already = mySessions.find(s => s.id === session.id);
    if (already) return;
    const myRole = roleOverride ?? (session.type === "collab" ? "participant" : "learner");
    let entry = { ...session, status: "waiting_room", myRole };
    // For PriorTeacher sessions joined as learner, add us to waitingRoom and bump interested
    if (session.type === "teach" && myRole === "learner") {
      const alreadyInRoom = (session.waitingRoom || []).some(u => u.id === profile.id);
      if (!alreadyInRoom) {
        entry = {
          ...entry,
          waitingRoom: [...(session.waitingRoom || []), profile],
          interested: (session.interested ?? 0) + 1,
        };
      }
    }
    setMySessions(prev => [...prev, entry]);
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
      customSessions, setCustomSessions,
      teacherOverrides, setTeacherOverrides,
      profile, setProfile,
      darkMode, setDarkMode,
      toast, showToast,
      modal, setModal,
      viewingUser, setViewingUser,
      activeProposal, setActiveProposal,
      offerToTeachSession, setOfferToTeachSession,
      joinedCommunities, setJoinedCommunities,
      customCommunities, setCustomCommunities,
      communityFilter, setCommunityFilter,
      communitySort, setCommunitySort,
      notifs, setNotifs,
      privacy, setPrivacy,
      joinSession, openSession,
      loggedIn, loginAsMJ, signUp,
    }}>
      {children}
    </AppCtx.Provider>
  );
}


export { AppProvider, useApp };