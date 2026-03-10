import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { useAuthStore } from '../store/auth-store';

type Step = 'request' | 'reset';

export function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { forgotPassword, confirmForgotPassword, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError('');
    try {
      await forgotPassword(email);
      setStep('reset');
    } catch {
      // Error set in store
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError('');

    if (newPassword !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setLocalError('Password must be at least 8 characters');
      return;
    }

    try {
      await confirmForgotPassword(email, code, newPassword);
      setSuccessMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    } catch {
      // Error set in store
    }
  };

  const displayError = localError || error;

  if (step === 'reset') {
    return (
      <AuthLayout>
        <h2 className="text-xl font-bold text-slate-800 mb-1">Reset your password</h2>
        <p className="text-sm text-slate-500 mb-6">
          Enter the code sent to <strong className="text-slate-700">{email}</strong> and your new password
        </p>

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-sm text-green-700 flex items-center gap-2">
            <span>&#10003;</span> {successMessage}
          </div>
        )}

        {displayError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-start gap-2">
            <span className="shrink-0 mt-0.5">&#9888;</span>
            <span>{displayError}</span>
          </div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-4">
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

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              required
              autoComplete="new-password"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 transition-all placeholder:text-slate-400"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !!successMessage}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-sm shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:from-orange-600 hover:to-red-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button onClick={() => setStep('request')} className="text-sm text-orange-600 hover:text-orange-700 font-medium">
            Use a different email
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h2 className="text-xl font-bold text-slate-800 mb-1">Forgot password?</h2>
      <p className="text-sm text-slate-500 mb-6">Enter your email and we'll send you a reset code</p>

      {displayError && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-start gap-2">
          <span className="shrink-0 mt-0.5">&#9888;</span>
          <span>{displayError}</span>
        </div>
      )}

      <form onSubmit={handleRequestCode} className="space-y-4">
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

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-sm shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:from-orange-600 hover:to-red-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Sending code...' : 'Send Reset Code'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link to="/login" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
          Back to sign in
        </Link>
      </div>
    </AuthLayout>
  );
}
