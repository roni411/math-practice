"use client";

import { Question } from "@/types";
import QuestionCard from "./QuestionCard";
import { pickExamPrepMessage } from "./MotivationalModal";

interface Props {
  questions: Question[];
}

export default function UnsolvedQuestionList({ questions }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {questions.map((q, i) => (
        <QuestionCard
          key={q.id}
          question={q}
          index={i}
          cardLabel={`שאלה ${i + 1} מתוך ${questions.length}`}
          pickMessageFn={pickExamPrepMessage}
        />
      ))}
    </div>
  );
}
