export const dynamic = "force-dynamic";

import UnsolvedQuestionList from "@/components/UnsolvedQuestionList";
import { getUnsolvedQuestions } from "@/services/questionsService";

export default async function UnsolvedPage() {
  let questions;
  let errorMessage: string | null = null;

  try {
    questions = await getUnsolvedQuestions();
  } catch (e) {
    errorMessage = e instanceof Error ? e.message : String(e);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-4 shadow-sm">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">שאלות לתיפור</h1>
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
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-bold text-gray-800">שאלות שעדיין לא נפתרו</h2>
              <p className="text-sm text-gray-400">{questions!.length} שאלות נותרו</p>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 flex items-center gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <p className="text-sm font-semibold text-blue-800">כל השאלות שלא נפתרו</p>
                <p className="text-xs text-blue-500">סדר: הסתברות • גיאומטריה • חשבון • חוזר חלילה</p>
              </div>
            </div>

            <UnsolvedQuestionList questions={questions!} />

            {questions!.length === 0 && (
              <div className="text-center py-16 flex flex-col items-center gap-3">
                <span className="text-5xl">🏆</span>
                <p className="text-lg font-bold text-gray-800">פתרת את כל השאלות!</p>
                <p className="text-sm text-gray-400">אין שאלות שנותרו לתיפור</p>
              </div>
            )}

            <p className="text-center text-xs text-gray-300 pb-4">
              שאלות פתורות נעלמות מהרשימה ✓
            </p>
          </>
        )}
      </div>
    </main>
  );
}
