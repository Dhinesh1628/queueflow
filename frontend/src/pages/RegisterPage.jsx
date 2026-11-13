import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useTheme } from '../context/ThemeContext';
import { Mail, User, ArrowRight, ShieldCheck, Sun, Moon } from 'lucide-react';
import PasswordInput from '../components/common/PasswordInput';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      toast.error('All fields are required');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!consentChecked) {
      toast.error('You must agree to the Terms of Service and Privacy Policy to continue');
      return;
    }

    try {
      setLoading(true);
      const res = await register(name.trim(), email.trim(), password);
      if (res.success) {
        toast.success(`Account registered for ${name}`);
        navigate('/');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
            Create your Queue Manager Account
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white dark:bg-[#26201B] border border-[#E6E0D4] dark:border-[#3E342C] rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#26221F] dark:text-[#FAF8F5] tracking-tight">Register Manager</h2>
            <p className="text-xs text-[#736A62] dark:text-[#A69B8F] mt-0.5">
              Set up your profile to manage multi-counter queues and live tokens
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#26221F] dark:text-[#FAF8F5] uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#736A62] dark:text-[#A69B8F] absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Henderson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#F8F6F0] dark:bg-[#1C1815] border border-[#E6E0D4] dark:border-[#3E342C] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#26221F] dark:text-[#FAF8F5] placeholder-[#A69B8F] focus:outline-none focus:border-[#8C532B] focus:ring-1 focus:ring-[#8C532B]/30 transition-colors"
                />
              </div>
            </div>

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
                placeholder="At least 6 characters"
                name="new-password"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#26221F] dark:text-[#FAF8F5] uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <PasswordInput
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type password"
                name="confirm-password"
              />
            </div>

            {/* GDPR Consent & Age Verification Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#736A62] dark:text-[#A69B8F] select-none">
                <input
                  type="checkbox"
                  required
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="mt-0.5 rounded bg-[#F8F6F0] dark:bg-[#1C1815] border-[#E6E0D4] dark:border-[#3E342C] text-[#8C532B] focus:ring-[#8C532B]"
                />
                <span className="leading-relaxed">
                  I confirm I am at least 16 years of age and agree to the{' '}
                  <Link to="/terms" className="text-[#8C532B] dark:text-[#D4A373] hover:text-[#774421] underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-[#8C532B] dark:text-[#D4A373] hover:text-[#774421] underline">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#8C532B] hover:bg-[#774421] disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-md shadow-[#8C532B]/20 transition-all cursor-pointer mt-2"
            >
              <span>{loading ? 'Creating Account...' : 'Create Manager Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[#736A62] dark:text-[#A69B8F]">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-[#8C532B] dark:text-[#D4A373] hover:text-[#774421] font-semibold underline ml-1"
            >
              Sign In
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

export default RegisterPage;
