// ─── APP STATE CONTEXT ───────────────────────────────────────
import { AppProvider, useApp } from "../context/AppContext";

// ─── PAGES ───────────────────────────────────────────────────
import ChatroomPage from "./ChatroomPage";
import CompletedPage from "./CompletedPage";
import ScheduledPage from "./ScheduledPage";
import WaitingRoomPage from "./WaitingRoomPage";

export default function SessionPage() {
  const { activeSession, activeView, setActiveView } = useApp();
  if (!activeSession) return null;

  if (activeView === "chatroom") return <ChatroomPage session={activeSession} />;
  if (activeView === "scheduled") return <ScheduledPage session={activeSession} />;
  if (activeView === "completed") return <CompletedPage session={activeSession} />;
  return <WaitingRoomPage session={activeSession} />;
}