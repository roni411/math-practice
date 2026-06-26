"use client";

import { useEffect } from "react";

const MESSAGES = [
  "קיבלת 86 במועד א׳ – עכשיו אתה הולך על יותר.",
  "86 זה ציון מכובד. מועד ב׳ הוא ההזדמנות שלך לעלות ממנו.",
  "ה-86 שלך הוכיח שאתה יודע. עכשיו אתה מוכיח שאתה יכול יותר.",
  "86 זה הרצפה, לא התקרה.",
  "אתה לא מתחיל מאפס – אתה מתחיל מ-86.",
  "יש תלמידים שמסתפקים ב-86. אתה לא אחד מהם.",
  "מועד ב׳ הוא לא תיקון – הוא שדרוג.",
  "הצלחת להגיע ל-86 עם ההכנה הקודמת. תאר לעצמך מה תוכל להגיע אליו עכשיו.",
  "כל תרגיל שאתה עושה עכשיו הוא נקודה נוספת על הציון שלך.",
  "מה שחסר בין 86 לציון שאתה רוצה – אתה בונה אותו עכשיו.",
];

const EXAM_PREP_MESSAGES = [
  "קיבלת 86 במועד א׳ – עכשיו אתה הולך על יותר.",
  "86 זה ציון מכובד. מועד ב׳ הוא ההזדמנות שלך לעלות ממנו.",
  "ה-86 שלך הוכיח שאתה יודע. עכשיו אתה מוכיח שאתה יכול יותר.",
  "86 זה הרצפה, לא התקרה.",
  "אתה לא מתחיל מאפס – אתה מתחיל מ-86.",
  "יש תלמידים שמסתפקים ב-86. אתה לא אחד מהם.",
  "מועד ב׳ הוא לא תיקון – הוא שדרוג.",
  "הצלחת להגיע ל-86 עם ההכנה הקודמת. תאר לעצמך מה תוכל להגיע אליו עכשיו.",
  "כל תרגיל שאתה עושה עכשיו הוא נקודה נוספת על הציון שלך.",
  "מה שחסר בין 86 לציון הבא – אתה בונה אותו עכשיו, שאלה אחרי שאלה.",
  "מועד ב׳ הוא מתנה. אתה כבר יודע מה יוצא בבחינה – עכשיו תשתלם על זה.",
  "כשתשב בבחינה ותראה שאלה כזו – תדע שכבר פתרת אותה.",
  "כל שאלה שפתרת לבד בנתה בך ביטחון שאף מורה לא יכול לתת.",
  "הראשון הוכיח שאתה מסוגל. השני יוכיח שאתה שאפתן.",
  "תחשוב על הרגע שתראה ציון גבוה יותר מ-86 – אתה בונה אותו עכשיו.",
  "88, 90, 92 – כל שאלה כאן מסיטה את הציון למעלה.",
  "ה-86 של מועד א׳ הוא הבסיס. מועד ב׳ הוא הבניין שמעליו.",
  "כשמכירים את החומר ברמה הזו – הציון הבא רק צריך לעקוב.",
  "כל שאלה שנסגרת היא פחות הפתעות ביום הבחינה.",
  "אתה עושה את העבודה שרוב האנשים דוחים. זה ההבדל בין 86 לציון הבא.",
];

export function pickMessage(): string {
  return MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
}

export function pickExamPrepMessage(): string {
  return EXAM_PREP_MESSAGES[Math.floor(Math.random() * EXAM_PREP_MESSAGES.length)];
}

interface Props {
  message: string;
  solvedCount: number;
  onClose: () => void;
  theme?: "pilot" | "exam";
}

export default function MotivationalModal({ message, solvedCount, onClose, theme = "exam" }: Props) {
  const icon      = theme === "exam" ? "🏆" : "✈️";
  const floatIcon = theme === "exam" ? "🏆" : "✈️";
  const countText = theme === "exam" ? "בדרך למועד ב׳" : "בדרך לטייס";
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      <style>{`
        @keyframes modal-pop {
          0%   { opacity: 0; transform: scale(0.85) translateY(16px); }
          100% { opacity: 1; transform: scale(1)    translateY(0); }
        }
        @keyframes float-up {
          0%   { opacity: 1; transform: translateY(0)    scale(1); }
          100% { opacity: 0; transform: translateY(-90px) scale(1.4); }
        }
        .modal-card  { animation: modal-pop 0.3s cubic-bezier(0.34,1.56,0.64,1) both; }
        .float-plane { animation: float-up 1.6s ease-out both; }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
        onClick={onClose}
      >
        {/* Floating icons */}
        {[...Array(6)].map((_, i) => (
          <span
            key={i}
            className="float-plane pointer-events-none fixed text-2xl select-none"
            style={{
              left: `${10 + i * 15}%`,
              bottom: "30%",
              animationDelay: `${i * 0.18}s`,
            }}
          >
            {floatIcon}
          </span>
        ))}

        {/* Card */}
        <div
          className="modal-card relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center gap-5 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Big icon */}
          <div className="text-6xl">{icon}</div>

          {/* Message */}
          <p className="text-xl font-bold text-gray-800 leading-snug">{message}</p>

          {/* Count */}
          <div className="bg-blue-50 rounded-2xl px-5 py-3 w-full">
            <p className="text-sm font-semibold text-blue-700">
              כבר פתרת <span className="text-2xl font-bold">{solvedCount}</span> שאלות {countText}!
            </p>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="mt-1 w-full py-3 rounded-2xl bg-blue-600 text-white font-bold text-base
              hover:bg-blue-700 active:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            המשך לתרגל 💪
          </button>
        </div>
      </div>
    </>
  );
}
