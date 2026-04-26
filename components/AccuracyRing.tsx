export default function AccuracyRing({ accuracy }: { accuracy: number }) {
  // accuracy is 0.0 - 1.0
  const percentage = Math.round(accuracy * 100);
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let colorClass = "text-red-500";
  if (percentage >= 75) colorClass = "text-emerald-500";
  else if (percentage >= 50) colorClass = "text-yellow-500";

  return (
    <div className="relative flex items-center justify-center w-16 h-16">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
        <circle
          className="text-slate-200"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="40"
          cy="40"
        />
        <circle
          className={`${colorClass} transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]`}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="40"
          cy="40"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-sm font-bold text-slate-800">{percentage}%</span>
      </div>
    </div>
  );
}
