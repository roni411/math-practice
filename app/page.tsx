// Always render server-side so Supabase credentials are used at request time,
// not during the static build step.
export const dynamic = "force-dynamic";

import QuestionCard from "@/components/QuestionCard";
import { getTodaysQuestions } from "@/services/questionsService";

function formatHebrewDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("he-IL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function HomePage() {
  let questions;
  let hebrewDate;
  let errorMessage: string | null = null;

  try {
    const daily = await getTodaysQuestions();
    questions = daily.questions;
    hebrewDate = formatHebrewDate(daily.date);
  } catch (e) {
    errorMessage = e instanceof Error ? e.message : String(e);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-4 shadow-sm">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">תרגול מתמטיקה</h1>
          <p className="text-sm text-gray-400 mt-0.5">בגרות 4 יחידות • קוד 471</p>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-6">
        {errorMessage ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex flex-col gap-2">
            <p className="text-sm font-bold text-red-800">שגיאה בטעינת השאלות</p>
            <p className="text-xs text-red-700 font-mono break-all">{errorMessage}</p>
          </div>
        ) : (
          <>
            {/* Date + section title */}
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-bold text-gray-800">השאלות של היום</h2>
              <p className="text-sm text-gray-400">{hebrewDate}</p>
            </div>

            {/* Daily prompt banner */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 flex items-center gap-3">
              <span className="text-2xl">📚</span>
              <div>
                <p className="text-sm font-semibold text-blue-800">2 שאלות להיום</p>
                <p className="text-xs text-blue-500">פתור את שתי השאלות ותבדוק את עצמך!</p>
              </div>
            </div>

            {/* Question cards */}
            <div className="flex flex-col gap-4">
              {questions!.map((q, i) => (
                <QuestionCard key={q.id} question={q} index={i} />
              ))}
            </div>

            <p className="text-center text-xs text-gray-300 pb-4">
              שאלות חדשות מחר ✓
            </p>
          </>
        )}
      </div>
    </main>
  );
}
