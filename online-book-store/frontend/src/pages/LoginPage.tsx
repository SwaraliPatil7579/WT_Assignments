import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, BookOpen, ArrowRight, Sparkles, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const toast = useToast();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim() || !password) {
      setErrorMessage('Please fill in both email/username and password.');
      return;
    }

    setIsLoading(true);
    const result = await login(identifier, password);
    setIsLoading(false);

    if (result.success) {
      toast.success('Welcome back!', `Logged in as ${result.fullName || result.username}`);
      onNavigate('catalogue');
    } else {
      setErrorMessage(result.message);
      toast.error('Authentication Failed', result.message);
    }
  };

  const fillDemoAccount = () => {
    setIdentifier('demo@bookstore.com');
    setPassword('demo123');
    setErrorMessage('');
    toast.info('Demo Filled', 'Pre-filled demo credentials: demo@bookstore.com / demo123');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Top Brand Logo */}
        <div className="text-center mb-8">
          <div
            onClick={() => onNavigate('home')}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-700 to-sky-500 text-white shadow-lg shadow-brand-500/25 mb-3 cursor-pointer hover:scale-105 transition-transform"
          >
            <BookOpen className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome to ReadVault</h1>
          <p className="text-sm text-slate-500 mt-1">
            Sign in to access your saved books, cart, and order tracking
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6">
          {/* Demo Helper Banner */}
          <div className="p-3.5 bg-brand-50/80 border border-brand-200/70 rounded-2xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-brand-800 font-semibold">
              <Sparkles className="w-4 h-4 text-brand-600 shrink-0" />
              <span>Testing the app? Use 1-click demo</span>
            </div>
            <button
              type="button"
              onClick={fillDemoAccount}
              className="px-3 py-1 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg text-[11px] shrink-0 transition-colors shadow-sm"
            >
              Fill Demo
            </button>
          </div>

          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-semibold">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Identifier Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email or Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="demo@bookstore.com or username"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={fillDemoAccount}
                  className="text-xs text-brand-600 hover:underline font-semibold"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4"
                />
                <span className="text-xs font-medium text-slate-600">Remember my session</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Register */}
          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
            <span>Don't have an account yet? </span>
            <button
              onClick={() => onNavigate('register')}
              className="font-bold text-brand-600 hover:underline"
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Secured with Spring Boot REST and MongoDB Auth</span>
        </div>
      </div>
    </div>
  );
};
