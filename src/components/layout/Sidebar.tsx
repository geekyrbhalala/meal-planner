import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth-store';

const NAV_ITEMS = [
  { to: '/', label: 'Meal Plan', icon: '🍽️', activeColor: 'bg-green-50 text-green-700 border-green-200' },
  { to: '/grocery', label: 'Grocery', icon: '🛒', activeColor: 'bg-amber-50 text-amber-700 border-amber-200' },
  { to: '/recipes', label: 'Recipes', icon: '👨‍🍳', activeColor: 'bg-orange-50 text-orange-700 border-orange-200' },
  { to: '/nutrition', label: 'Nutrition', icon: '💪', activeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { to: '/pantry', label: 'Pantry', icon: '🏪', activeColor: 'bg-purple-50 text-purple-700 border-purple-200' },
];

const FUN_FACTS = [
  { emoji: '🌱', text: 'A balanced vegetarian diet provides all essential nutrients your body needs!' },
  { emoji: '🥦', text: 'Broccoli has more protein per calorie than steak!' },
  { emoji: '🫘', text: 'Rajma + Rice = complete protein. Nature is amazing!' },
  { emoji: '🌶️', text: 'Gujarat is the most vegetarian state in India — 70%+ population!' },
  { emoji: '🧀', text: 'Paneer has ~18g protein per 100g — a vegetarian powerhouse!' },
];

export function Sidebar() {
  const fact = FUN_FACTS[new Date().getDay() % FUN_FACTS.length];
  const { user, signOut, isAuthenticated } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?';

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 glass-card min-h-screen border-r border-white/40">
        <div className="px-5 py-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-green-200">
              🥗
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                Meal Planner
              </h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Vegetarian Weekly Plan</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                  isActive
                    ? `${item.activeColor} shadow-sm`
                    : 'text-slate-500 hover:bg-white/60 hover:text-slate-700 border-transparent'
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 pb-3">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-100">
            <p className="text-xs text-amber-700 font-medium">{fact.emoji} Did you know?</p>
            <p className="text-[11px] text-amber-600 mt-1 leading-relaxed">{fact.text}</p>
          </div>
        </div>

        {/* User profile section */}
        {isAuthenticated && user && (
          <div className="px-3 pb-4 relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                {userInitial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">{user.name || 'User'}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
              </div>
              <svg className={`w-4 h-4 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>

            {showUserMenu && (
              <div className="absolute bottom-full left-3 right-3 mb-1 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden pop-in z-50">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-3 left-3 right-3 glass-card rounded-2xl flex justify-around py-2 px-1 z-40 shadow-lg shadow-black/5">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'text-green-700 bg-green-50 scale-105'
                  : 'text-slate-400 active:scale-95'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px]">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
