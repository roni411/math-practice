"use client";

import { useState, useTransition } from "react";
import { Question } from "@/types";
import { addQuestion, deleteQuestion, resetSolvedQuestions } from "@/services/questionsService";

const TOPICS = [
  { value: "geometry",    label: "גיאומטריה" },
  { value: "derivatives", label: "חשבון דיפרנציאלי ואינטגרלי" },
  { value: "probability", label: "סטטיסטיקה והסתברות" },
];

const MOEDS = ["קיץ א", "קיץ ב", "חורף"];
const NUM_QUESTIONS = 8;

// One row per question in the bulk form
interface QuestionRow {
  question_number: number;
  topic: string;
  include: boolean;
}

function defaultTopic(qNum: number): string {
  if (qNum <= 3) return "probability";
  if (qNum <= 5) return "geometry";
  return "derivatives";
}

function defaultRows(): QuestionRow[] {
  return Array.from({ length: NUM_QUESTIONS }, (_, i) => ({
    question_number: i + 1,
    topic: defaultTopic(i + 1),
    include: true,
  }));
}

interface Props {
  initialQuestions: Question[];
}

export default function AdminPanel({ initialQuestions }: Props) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);

  // Bulk form state
  const [year, setYear] = useState(new Date().getFullYear());
  const [moed, setMoed] = useState("קיץ א");
  const [examUrl, setExamUrl] = useState("");
  const [solutionUrl, setSolutionUrl] = useState("");
  const [rows, setRows] = useState<QuestionRow[]>(defaultRows());

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const updateRow = (i: number, field: keyof QuestionRow, value: string | boolean) =>
    setRows((prev) => prev.map((r, idx) => idx === i ? { ...r, [field]: value } : r));

  const handleBulkAdd = () => {
    setError(null);
    const toAdd = rows.filter((r) => r.include);
    if (toAdd.length === 0) { setError("בחרי לפחות שאלה אחת"); return; }

    startTransition(async () => {
      try {
        await Promise.all(
          toAdd.map((r) =>
            addQuestion({
              year: Number(year),
              question_number: r.question_number,
              topic: r.topic,
              exam_code: "471",
              moed,
              question_url: examUrl || null,
              solution_url: solutionUrl || null,
            })
          )
        );
        const { getAllQuestions } = await import("@/services/questionsService");
        setQuestions(await getAllQuestions());
        // Reset URLs only; keep year/moed for convenience
        setExamUrl("");
        setSolutionUrl("");
        setRows(defaultRows());
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteQuestion(id);
        setQuestions((prev) => prev.filter((q) => q.id !== id));
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  };

  const inputCls = "border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full";

  return (
    <main className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-white border-b border-gray-100 px-4 py-4 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ניהול שאלות</h1>
            <p className="text-sm text-gray-400">בגרות 4 יחידות • קוד 471</p>
          </div>
          <a href="/" className="text-sm text-blue-600 hover:underline">← חזרה לתרגול</a>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-6">

        {/* ── Bulk add form ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-5">
          <h2 className="font-bold text-gray-800">הוספת שאלון שלם</h2>

          {/* Exam metadata */}
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-xs text-gray-500">
              שנה
              <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} className={inputCls} />
            </label>
            <label className="flex flex-col gap-1 text-xs text-gray-500">
              מועד
              <select value={moed} onChange={(e) => setMoed(e.target.value)} className={inputCls}>
                {MOEDS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs text-gray-500 col-span-2">
              קישור לשאלון (PDF)
              <input type="url" value={examUrl} onChange={(e) => setExamUrl(e.target.value)}
                placeholder="https://..." className={inputCls} />
            </label>
            <label className="flex flex-col gap-1 text-xs text-gray-500 col-span-2">
              קישור לפתרון (PDF)
              <input type="url" value={solutionUrl} onChange={(e) => setSolutionUrl(e.target.value)}
                placeholder="https://..." className={inputCls} />
            </label>
          </div>

          {/* Per-question topic selection */}
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-500 mb-1">בחרי נושא לכל שאלה (בטלי ✓ לשאלות שלא רלוונטיות)</p>
            <div className="divide-y divide-gray-50 border rounded-xl overflow-hidden">
              {rows.map((row, i) => (
                <div key={i} className={`flex items-center gap-3 px-4 py-2 ${row.include ? "" : "opacity-40"}`}>
                  <input type="checkbox" checked={row.include}
                    onChange={(e) => updateRow(i, "include", e.target.checked)}
                    className="w-4 h-4 accent-blue-600 cursor-pointer flex-shrink-0" />
                  <span className="text-sm text-gray-600 w-16 flex-shrink-0">שאלה {row.question_number}</span>
                  <select value={row.topic} onChange={(e) => updateRow(i, "topic", e.target.value)}
                    disabled={!row.include}
                    className="flex-1 border rounded-lg px-2 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:cursor-not-allowed">
                    {TOPICS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-xs text-red-600 font-mono">{error}</p>}

          <button onClick={handleBulkAdd} disabled={isPending}
            className="self-start px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm
              hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {isPending ? "שומר..." : `הוסף שאלון (${rows.filter(r => r.include).length} שאלות)`}
          </button>
        </div>

        {/* ── Reset progress ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-800 text-sm">איפוס התקדמות</p>
            <p className="text-xs text-gray-400 mt-0.5">מחיקת כל השאלות הפתורות מ-Supabase ומהדפדפן</p>
          </div>
          <button
            onClick={() => {
              if (!confirm("למחוק את כל ההתקדמות?")) return;
              startTransition(async () => {
                try {
                  await resetSolvedQuestions();
                  // Clear localStorage too
                  Object.keys(localStorage)
                    .filter((k) => k.startsWith("math-done"))
                    .forEach((k) => localStorage.removeItem(k));
                  alert("אופס! ההתקדמות אופסה.");
                } catch (e) {
                  setError(e instanceof Error ? e.message : String(e));
                }
              });
            }}
            disabled={isPending}
            className="px-4 py-2 rounded-xl border-2 border-red-300 text-red-500 text-sm font-semibold
              hover:bg-red-50 disabled:opacity-50 transition-colors"
          >
            אפס הכל
          </button>
        </div>

        {/* ── Questions table ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800">שאלות קיימות ({questions.length})</h2>
          </div>

          {questions.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-10">אין שאלות עדיין</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500">
                <tr>
                  <th className="text-right px-4 py-2 font-medium">שנה</th>
                  <th className="text-right px-4 py-2 font-medium">מועד</th>
                  <th className="text-right px-4 py-2 font-medium">שאלה</th>
                  <th className="text-right px-4 py-2 font-medium">נושא</th>
                  <th className="text-right px-4 py-2 font-medium">שאלון</th>
                  <th className="text-right px-4 py-2 font-medium">פתרון</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {questions.map((q) => (
                  <tr key={q.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-700">{q.year}</td>
                    <td className="px-4 py-2 text-gray-700">{q.moed}</td>
                    <td className="px-4 py-2 text-gray-700">{q.question_number}</td>
                    <td className="px-4 py-2 text-gray-500 text-xs">{TOPICS.find(t => t.value === q.topic)?.label ?? q.topic}</td>
                    <td className="px-4 py-2">
                      {q.question_url
                        ? <a href={q.question_url} target="_blank" className="text-blue-500 hover:underline text-xs">פתח ↗</a>
                        : <span className="text-gray-300 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-2">
                      {q.solution_url
                        ? <a href={q.solution_url} target="_blank" className="text-blue-500 hover:underline text-xs">פתח ↗</a>
                        : <span className="text-gray-300 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-2">
                      <button onClick={() => handleDelete(q.id)} disabled={isPending}
                        className="text-xs text-red-400 hover:text-red-600 disabled:opacity-50">
                        מחק
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
