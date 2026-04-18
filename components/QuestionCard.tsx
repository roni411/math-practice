"use client";

import { useState, useEffect, useTransition } from "react";
import { Question } from "@/types";
import MotivationalModal, { pickMessage } from "./MotivationalModal";
import { addSolvedQuestion, getSolvedCount } from "@/services/questionsService";

const topicMeta: Record<string, { label: string; color: string }> = {
  geometry:    { label: "גיאומטריה",                    color: "bg-green-100 text-green-700"   },
  derivatives: { label: "חשבון דיפרנציאלי ואינטגרלי", color: "bg-orange-100 text-orange-700" },
  probability: { label: "סטטיסטיקה והסתברות",          color: "bg-teal-100 text-teal-700"     },
};

const STORAGE_KEY = (date: string) => `math-done-${date}`;
const today = () => new Date().toISOString().split("T")[0];

interface QuestionCardProps {
  question: Question;
  index: number;
  cardLabel?: string;
  pickMessageFn?: () => string;
}

export default function QuestionCard({ question, index, cardLabel, pickMessageFn }: QuestionCardProps) {
  const { label, color } = topicMeta[question.topic] ?? {
    label: question.topic,
    color: "bg-gray-100 text-gray-700",
  };

  const [solutionVisible, setSolutionVisible] = useState(false);
  const [done, setDone] = useState(false);
  const [modal, setModal] = useState<{ message: string; count: number } | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const key = STORAGE_KEY(today());
    const saved: string[] = JSON.parse(localStorage.getItem(key) ?? "[]");
    setDone(saved.includes(question.id));
  }, [question.id]);

  const handleSolved = () => {
    // Mark locally
    const key = STORAGE_KEY(today());
    const saved: string[] = JSON.parse(localStorage.getItem(key) ?? "[]");
    if (!saved.includes(question.id)) {
      localStorage.setItem(key, JSON.stringify([...saved, question.id]));
    }
    setDone(true);

    // Save to Supabase + fetch count, then show modal
    startTransition(async () => {
      try {
        await addSolvedQuestion(question.id);
        const count = await getSolvedCount();
        const picker = pickMessageFn ?? pickMessage;
        setModal({ message: picker(), count });
      } catch {
        // Still show modal even if Supabase fails
        const picker = pickMessageFn ?? pickMessage;
        setModal({ message: picker(), count: 0 });
      }
    });
  };

  return (
    <>
      {modal && (
        <MotivationalModal
          message={modal.message}
          solvedCount={modal.count}
          onClose={() => setModal(null)}
        />
      )}

      <div
        className={`bg-white rounded-2xl shadow-sm border p-5 flex flex-col gap-4 transition-all duration-200
          ${done ? "border-green-200 bg-green-50/40" : "border-gray-100"}`}
      >
        {/* Card header */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-400">{cardLabel ?? `שאלה ${index + 1} להיום`}</span>
          <div className="flex items-center gap-2">
            {done && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">
                ✓ פתרתי
              </span>
            )}
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${color}`}>
              {label || question.topic}
            </span>
          </div>
        </div>

        {/* Main info */}
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-gray-800">שאלה {question.question_number}</h2>
          <p className="text-sm text-gray-500">{question.year} • מועד {question.moed}</p>
        </div>

        {/* Exam label */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
          <span className="text-xs text-gray-400">קוד שאלון</span>
          <span className="text-xs font-bold text-gray-600">{question.exam_code}</span>
          <span className="text-gray-300 mx-1">|</span>
          <span className="text-xs text-gray-400">4 יחידות לימוד</span>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 mt-1">
          <button
            onClick={() => question.question_url && window.open(question.question_url, "_blank")}
            disabled={!question.question_url}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 text-white font-semibold text-sm
              active:bg-blue-700 transition-colors
              disabled:opacity-40 disabled:cursor-not-allowed
              hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            פתח שאלון (שאלה {question.question_number})
          </button>

          <div className="flex gap-2">
            {/* Reveal / open solution */}
            {!solutionVisible ? (
              <button
                onClick={() => setSolutionVisible(true)}
                disabled={!question.solution_url}
                className="flex-1 py-2.5 px-4 rounded-xl border-2 border-blue-600 text-blue-600 font-semibold text-sm
                  active:bg-blue-50 transition-colors
                  disabled:opacity-40 disabled:cursor-not-allowed
                  hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              >
                הצג פתרון
              </button>
            ) : (
              <button
                onClick={() => question.solution_url && window.open(question.solution_url, "_blank")}
                className="flex-1 py-2.5 px-4 rounded-xl border-2 border-blue-600 bg-blue-50 text-blue-700 font-semibold text-sm
                  active:bg-blue-100 transition-colors
                  hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              >
                פתח פתרון ↗
              </button>
            )}

            {/* Solved button */}
            {!done ? (
              <button
                onClick={handleSolved}
                disabled={isPending}
                className="flex-1 py-2.5 px-4 rounded-xl border-2 border-green-500 text-green-600 font-semibold text-sm
                  active:bg-green-50 transition-colors
                  disabled:opacity-50
                  hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
              >
                {isPending ? "..." : "פתרתי ✓"}
              </button>
            ) : (
              <div className="flex-1 py-2.5 px-4 rounded-xl bg-green-50 border-2 border-green-200 text-green-600 font-semibold text-sm text-center">
                ✈️ כל הכבוד!
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
