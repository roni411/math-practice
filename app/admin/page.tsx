export const dynamic = "force-dynamic";

import { getAllQuestions } from "@/services/questionsService";
import AdminPanel from "@/components/AdminPanel";

export default async function AdminPage() {
  const questions = await getAllQuestions();
  return <AdminPanel initialQuestions={questions} />;
}
