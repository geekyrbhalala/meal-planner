import { DAILY_PROTEIN_TARGET } from '../../utils/nutrition-calc';

interface ProteinTrackerProps {
  averageProtein: number;
}

export function ProteinTracker({ averageProtein }: ProteinTrackerProps) {
  const percentage = Math.min(100, Math.round((averageProtein / DAILY_PROTEIN_TARGET) * 100));
  const isGoalMet = averageProtein >= DAILY_PROTEIN_TARGET;

  return (
    <div className={`rounded-2xl p-5 border ${
      isGoalMet
        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
        : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
    }`}>
      <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
        💪 Daily Protein Goal
      </h3>

      <div className="flex items-center gap-5">
        {/* Progress ring */}
        <div className="relative w-24 h-24 shrink-0">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 96 96">
            <circle
              cx="48" cy="48" r="40"
              stroke="#e2e8f0" strokeWidth="8" fill="none"
            />
            <circle
              cx="48" cy="48" r="40"
              stroke={isGoalMet ? '#16a34a' : '#f59e0b'}
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentage / 100)}`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-xl font-bold ${isGoalMet ? 'text-green-600' : 'text-amber-600'}`}>
              {percentage}%
            </span>
            <span className="text-[10px] text-slate-400">goal</span>
          </div>
        </div>

        <div>
          <p className="text-3xl font-bold text-slate-800">
            {averageProtein}g
            <span className="text-sm font-normal text-slate-400"> / {DAILY_PROTEIN_TARGET}g</span>
          </p>
          <p className="text-sm text-slate-500 mt-0.5">avg. daily protein</p>
          {isGoalMet ? (
            <p className="text-sm font-medium mt-2 text-green-600 flex items-center gap-1">
              🎉 Goal achieved! Keep it up!
            </p>
          ) : (
            <p className="text-sm font-medium mt-2 text-amber-600 flex items-center gap-1">
              🎯 Need {DAILY_PROTEIN_TARGET - averageProtein}g more — add paneer or dal!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
