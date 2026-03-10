"use client";

interface SolutionButtonProps {
  solutionPdfUrl?: string;
}

export default function SolutionButton({ solutionPdfUrl }: SolutionButtonProps) {
  const handleClick = () => {
    if (solutionPdfUrl) {
      window.open(solutionPdfUrl, "_blank");
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!solutionPdfUrl}
      className="flex-1 py-3 px-4 rounded-xl bg-white text-blue-600 font-semibold text-sm
        border-2 border-blue-600
        active:bg-blue-50 transition-colors duration-150
        disabled:opacity-40 disabled:cursor-not-allowed
        hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
    >
      הצג פתרון
    </button>
  );
}
