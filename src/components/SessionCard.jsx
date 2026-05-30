// ─── FEED CARD COMPONENTS ────────────────────────────────────
import TeachCard from "../components/TeachCard";
import LearnCard from "../components/LearnCard";
import MeetupCard from "../components/MeetupCard";

export default function SessionCard({ session }) {
  if (session.type === "teach") return <TeachCard session={session} />;
  if (session.type === "learn") return <LearnCard session={session} />;
  return <MeetupCard session={session} />;
}