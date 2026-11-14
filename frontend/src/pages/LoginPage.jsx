import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useTheme } from '../context/ThemeContext';
import { Mail, ArrowRight, ShieldCheck, Sun, Moon } from 'lucide-react';
import PasswordInput from '../components/common/PasswordInput';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const isExpired = new URLSearchParams(location.search).get('expired') === 'true';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      const res = await login(email, password);
      if (res.success) {
        toast.success(`Authenticated as ${res.manager.name}`);
        navigate('/');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] dark:bg-[#1C1815] text-[#26221F] dark:text-[#FAF8F5] flex flex-col justify-center items-center p-4 sm:p-6 relative transition-colors duration-150">
      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Warm Alabaster Light Mode' : 'Switch to Espresso Dark Mode'}
          className="p-2.5 rounded-xl bg-white dark:bg-[#26201B] border border-[#E6E0D4] dark:border-[#3E342C] text-[#736A62] dark:text-[#A69B8F] hover:text-[#26221F] dark:hover:text-white shadow-xs transition-colors cursor-pointer"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-[#D4A373]" />
          ) : (
            <Moon className="w-4 h-4 text-[#736A62]" />
          )}
        </button>
      </div>

      <div className="w-full max-w-md">
        {/* Clickable Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-lg bg-[#8C532B] flex items-center justify-center text-white font-bold text-base shadow-sm">
              QF
            </div>
            <span className="text-2xl font-bold text-[#26221F] dark:text-[#FAF8F5] tracking-tight">QueueFlow</span>
          </Link>
          <p className="text-xs text-[#736A62] dark:text-[#A69B8F]">
            Enterprise Queue Operations & Token Dispatch Platform
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-[#26201B] border border-[#E6E0D4] dark:border-[#3E342C] rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#26221F] dark:text-[#FAF8F5] tracking-tight">Manager Sign In</h2>
            <p className="text-xs text-[#736A62] dark:text-[#A69B8F] mt-0.5">
              Access your department counters and live dispatch consoles
            </p>
          </div>

          {isExpired && (
            <div className="mb-4 p-3 rounded-lg bg-[#B87A44]/10 border border-[#B87A44]/25 text-xs text-[#8C532B] dark:text-[#D4A373]">
              Your session has expired. Please sign in again.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#26221F] dark:text-[#FAF8F5] uppercase tracking-wider mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#736A62] dark:text-[#A69B8F] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="manager@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F8F6F0] dark:bg-[#1C1815] border border-[#E6E0D4] dark:border-[#3E342C] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#26221F] dark:text-[#FAF8F5] placeholder-[#A69B8F] focus:outline-none focus:border-[#8C532B] focus:ring-1 focus:ring-[#8C532B]/30 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#26221F] dark:text-[#FAF8F5] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter account password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#8C532B] hover:bg-[#774421] disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-md shadow-[#8C532B]/20 transition-all cursor-pointer mt-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials for Reviewers */}
          <div className="mt-6 pt-5 border-t border-[#E6E0D4] dark:border-[#3E342C]">
            <div className="p-3 rounded-xl bg-[#F8F6F0] dark:bg-[#1C1815] border border-[#E6E0D4] dark:border-[#3E342C] text-xs text-[#736A62] dark:text-[#A69B8F]">
              <div className="flex items-center justify-between mb-1.5 text-[#26221F] dark:text-[#FAF8F5] font-semibold">
                <span>Pre-Configured Demo Credentials</span>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('dineshkandukuri336@gmail.com');
                    setPassword('QueueFlow2026!');
                  }}
                  className="text-xs text-[#8C532B] dark:text-[#D4A373] hover:text-[#774421] font-semibold underline cursor-pointer"
                >
                  Auto-fill
                </button>
              </div>
              <p className="text-[11px] text-[#736A62] dark:text-[#A69B8F] font-mono">
                dineshkandukuri336@gmail.com • QueueFlow2026!
              </p>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-[#736A62] dark:text-[#A69B8F]">
            Don&apos;t have a manager account?{' '}
            <Link
              to="/register"
              className="text-[#8C532B] dark:text-[#D4A373] hover:text-[#774421] font-semibold underline ml-1"
            >
              Register here
            </Link>
          </div>
        </div>

        {/* Footer & Security links */}
        <div className="flex items-center justify-center gap-4 mt-6 text-xs text-[#736A62] dark:text-[#A69B8F]">
          <Link to="/privacy" className="hover:text-[#26221F] dark:hover:text-[#FAF8F5] transition-colors">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link to="/terms" className="hover:text-[#26221F] dark:hover:text-[#FAF8F5] transition-colors">
            Terms of Service
          </Link>
          <span>•</span>
          <span className="flex items-center gap-1 text-[#2E7D32]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span>Encrypted</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
