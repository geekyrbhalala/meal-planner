import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
      {/* Decorative food emojis */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-10">
        <span className="absolute text-6xl top-[10%] left-[5%] animate-float">🍛</span>
        <span className="absolute text-5xl top-[20%] right-[10%] animate-float" style={{ animationDelay: '1s' }}>🥘</span>
        <span className="absolute text-6xl bottom-[15%] left-[15%] animate-float" style={{ animationDelay: '2s' }}>🫓</span>
        <span className="absolute text-5xl bottom-[25%] right-[8%] animate-float" style={{ animationDelay: '0.5s' }}>🥗</span>
        <span className="absolute text-4xl top-[50%] left-[50%] animate-float" style={{ animationDelay: '1.5s' }}>🍽️</span>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 shadow-lg mb-4">
            <span className="text-3xl">🍽️</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Meal Planner</h1>
          <p className="text-sm text-slate-500 mt-1">Plan smart, eat healthy, save time</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/60 p-6 sm:p-8 pop-in">
          {children}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Made with love for healthy families
        </p>
      </div>
    </div>
  );
}
