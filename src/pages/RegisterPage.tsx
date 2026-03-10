import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { useAuthStore } from '../store/auth-store';

type Step = 'register' | 'confirm';

export function RegisterPage() {
  const [step, setStep] = useState<Step>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState('');
  const [localError, setLocalError] = useState('');
  const { signUp, confirmSignUp, signIn, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError('');

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters');
      return;
    }

    try {
      const result = await signUp(email, password, name);
      if (result.needsConfirmation) {
        setStep('confirm');
      }
    } catch {
      // Error set in store
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await confirmSignUp(email, code);
      // Auto sign in after confirmation
      await signIn(email, password);
      navigate('/', { replace: true });
    } catch {
      // Error set in store
    }
  };

  const displayError = localError || error;

  if (step === 'confirm') {
    return (
      <AuthLayout>
        <h2 className="text-xl font-bold text-slate-800 mb-1">Verify your email</h2>
        <p className="text-sm text-slate-500 mb-6">
          We sent a verification code to <strong className="text-slate-700">{email}</strong>
        </p>

        {displayError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-start gap-2">
            <span className="shrink-0 mt-0.5">&#9888;</span>
            <span>{displayError}</span>
          </div>
        )}

        <form onSubmit={handleConfirm} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Verification Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter 6-digit code"
              required
              maxLength={6}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/70 text-sm text-center tracking-[0.3em] font-mono text-lg focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 transition-all placeholder:text-slate-400 placeholder:tracking-normal placeholder:text-sm placeholder:font-sans"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-sm shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:from-orange-600 hover:to-red-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verifying...' : 'Verify & Sign In'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-400">
          Didn't receive the code? Check your spam folder.
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h2 className="text-xl font-bold text-slate-800 mb-1">Create your account</h2>
      <p className="text-sm text-slate-500 mb-6">Start planning healthy meals for your family</p>

      {displayError && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-start gap-2">
          <span className="shrink-0 mt-0.5">&#9888;</span>
          <span>{displayError}</span>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            autoComplete="name"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 transition-all placeholder:text-slate-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 transition-all placeholder:text-slate-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              required
              autoComplete="new-password"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 transition-all placeholder:text-slate-400 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {password.length > 0 && password.length < 8 && (
            <p className="text-xs text-amber-600 mt-1">Must be at least 8 characters</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
            required
            autoComplete="new-password"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 transition-all placeholder:text-slate-400"
          />
          {confirmPassword.length > 0 && password !== confirmPassword && (
            <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-sm shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:from-orange-600 hover:to-red-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Creating account...
            </span>
          ) : 'Create Account'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-orange-600 hover:text-orange-700 font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
