"use client";

import { useEffect } from "react";

const MESSAGES = [
  "עוד צעד קטן בדרך לקוקפיט ✈️",
  "כל שאלה שאתה פותר מקרבת אותך לשמיים.",
  "טייסים מתקדמים משימה אחרי משימה.",
  "משמעת והתמדה – בדיוק מה שטייס צריך.",
  "עוד תרגיל אחד בדרך לחלום הגדול.",
  "הדרך לשמיים עוברת דרך הניירות האלה.",
  "כל בגרות שעוברים – מסלול ההמראה מתקצר.",
  "ראש בענן, רגליים על הגז. כך עושים את זה.",
  "אתה בונה את עצמך שאלה אחרי שאלה.",
  "טייסים הם אנשים שלא ויתרו על החלום.",
];

const EXAM_PREP_MESSAGES = [
  "כל השאלות מאחוריך בנו אותך לרגע הזה.",
  "מה שפעם נראה קשה – עכשיו אתה פותר. זה לא מקרה.",
  "הבחינה הקרובה לא מפחידה אותך, כי הכנת את עצמך.",
  "אתה לא אותו תלמיד שהתחיל. אתה הרבה יותר חזק עכשיו.",
  "עבודה קשה + התמדה = ביטחון אמיתי. זה בדיוק מה שעשית.",
  "כמעט כל יום שאלה אחרי שאלה – זה לא עוד תלמיד, זה מישהו שרוצה באמת.",
  "הבחינה הקרובה? אתה מוכן לה יותר מכפי שאתה חושב.",
  "זה לא מזל, זה עבודה. ואתה עבדת.",
  "כל שאלה שנסגרת – פחות הפתעות בבחינה.",
  "הביטחון שצברת שאלה אחרי שאלה – אף אחד לא יכול לקחת ממך אותו.",
  "ההתמדה שלך מדברת בעד עצמה. שאלה אחרי שאלה, יום אחרי יום.",
  "כשתשב בבחינה ותראה שאלה כזו – תדע שכבר פתרת אותה.",
  "המאמץ שהשקעת עכשיו הוא הרוגע שתרגיש ביום הבחינה.",
  "אתה מוכיח לעצמך כל פעם מחדש שאתה מסוגל.",
  "כל שאלה שנסגרת היא עוד דלת שנפתחת בבחינה.",
  "קשה זה לא סימן שאתה לא יכול – זה סימן שאתה גדל.",
  "הראש שלך כבר יודע דברים שלא ידע לפני כמה חודשים.",
  "יש תלמידים שמקווים – ויש כאלה שמתכוננים. אתה מהסוג השני.",
  "כל שאלה כאן היא משהו שלא יפתיע אותך בבחינה.",
  "הצלחה בבחינה לא נולדת ביום הבחינה. היא נבנית עכשיו.",
  "אתה עושה את העבודה שרוב האנשים דוחים. זה הכל.",
  "פרגון אמיתי: אתה רואה את הקושי ובוחר לא לברוח ממנו.",
  "כל שאלה שפתרת לבד בנתה בך ביטחון שאף מורה לא יכול לתת.",
  "בחינה היא רק בוחן – והכנה שלך היא הסיפור האמיתי.",
  "תזכור את הרגע הזה ביום הבחינה. ככה מגיעים מוכנים.",
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
}

export default function MotivationalModal({ message, solvedCount, onClose }: Props) {
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
        {/* Floating planes */}
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
            ✈️
          </span>
        ))}

        {/* Card */}
        <div
          className="modal-card relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center gap-5 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Big icon */}
          <div className="text-6xl">✈️</div>

          {/* Message */}
          <p className="text-xl font-bold text-gray-800 leading-snug">{message}</p>

          {/* Count */}
          <div className="bg-blue-50 rounded-2xl px-5 py-3 w-full">
            <p className="text-sm font-semibold text-blue-700">
              כבר פתרת <span className="text-2xl font-bold">{solvedCount}</span> שאלות בדרך לטייס!
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
