// ─── APP STATE CONTEXT ───────────────────────────────────────
import { AppProvider, useApp } from "../context/AppContext";

// ─── PAGES ───────────────────────────────────────────────────
import ChatroomPage from "./ChatroomPage";
import CompletedPage from "./CompletedPage";
import ScheduledPage from "./ScheduledPage";
import SetMeetingTimePage from "./SetMeetingTimePage";
import ProposeCollabPage from "./ProposeCollabPage";
import ProposalChatroomPage from "./ProposalChatroomPage";
import WaitingRoomPage from "./WaitingRoomPage";

export default function SessionPage() {
  const { activeSession, activeView, setActiveView } = useApp();
  if (!activeSession) return null;

  if (activeView === "chatroom") return <ChatroomPage session={activeSession} />;
  if (activeView === "scheduled") return <ScheduledPage session={activeSession} />;
  if (activeView === "completed") return <CompletedPage session={activeSession} />;
  if (activeView === "setMeetingTime") return <SetMeetingTimePage session={activeSession} />;
  if (activeView === "proposeCollab") return <ProposeCollabPage session={activeSession} />;
  if (activeView === "proposalChat") return <ProposalChatroomPage session={activeSession} />;
  return <WaitingRoomPage session={activeSession} />;
}