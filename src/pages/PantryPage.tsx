import { PantryPageComponent } from '../components/pantry/PantryPage';

export function PantryPage() {
  return (
    <div className="space-y-4 sm:space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
          🏪 My Pantry
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Track what you have at home — these items are auto-deducted from your grocery list
        </p>
      </div>
      <PantryPageComponent />
    </div>
  );
}
