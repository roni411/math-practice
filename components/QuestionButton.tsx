"use client";

interface QuestionButtonProps {
  pdfUrl?: string;
}

export default function QuestionButton({ pdfUrl }: QuestionButtonProps) {
  const handleClick = () => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!pdfUrl}
      className="flex-1 py-3 px-4 rounded-xl bg-blue-600 text-white font-semibold text-sm
        active:bg-blue-700 transition-colors duration-150
        disabled:opacity-40 disabled:cursor-not-allowed
        hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
    >
      פתח שאלה
    </button>
  );
}
