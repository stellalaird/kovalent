import { useApp } from "../context/AppContext";
import HasTeacherCard from "./HasTeacherCard";
import PriorTeacherCard from "./PriorTeacherCard";
import CollabCard from "./CollabCard";

export default function SessionCard({ session }) {
  const { teacherOverrides } = useApp();

  if (session.type === "collab") return <CollabCard session={session} />;
  if (session.type === "learn")  return <HasTeacherCard session={session} />;

  // type === "teach": has a teacher → HasTeacherCard, otherwise → PriorTeacherCard
  const hasTeacher = !!teacherOverrides[session.id];
  return hasTeacher
    ? <HasTeacherCard session={session} />
    : <PriorTeacherCard session={session} />;
}
