import LearnCard from "../components/LearnCard";
import TeachCard from "../components/TeachCard";
import CollabCard from "../components/CollabCard";

export default function SessionCard({ session }) {
  if (session.type === "learn")  return <LearnCard  session={session} />;
  if (session.type === "teach")  return <TeachCard  session={session} />;
  return <CollabCard session={session} />;
}
