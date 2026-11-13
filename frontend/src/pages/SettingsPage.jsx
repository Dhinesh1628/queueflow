import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import api from '../services/api';
import {
  Settings,
  User,
  Mail,
  Database,
  ShieldCheck,
  Check,
  Server,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import PasswordInput from '../components/common/PasswordInput';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { formatDateTime } from '../utils/formatters';

const SettingsPage = () => {
  const { manager, updateProfile, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(manager?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  // GDPR Account Deletion modal
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    try {
      setLoadingProfile(true);
      const res = await updateProfile({ name: name.trim() });
      if (res.success) {
        toast.success('Profile name updated successfully');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update name');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Please enter your current password');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      setLoadingPassword(true);
      const res = await updateProfile({ currentPassword, newPassword });
      if (res.success) {
        toast.success('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeletingAccount(true);
      const res = await api.delete('/auth/account');
      if (res.data.success) {
        toast.success('Account and all associated queue records permanently erased.');
        logout();
        navigate('/login');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to execute data deletion');
    } finally {
      setDeletingAccount(false);
      setDeleteAccountModal(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl" id="main-content">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#8C532B] dark:text-[#C78753]" />
          <h2 className="text-xl sm:text-2xl font-bold text-[#26221F] dark:text-[#FAF8F5] tracking-tight font-mono">
            STUDIO & TENANT CONFIGURATION
          </h2>
        </div>
        <p className="text-xs sm:text-sm font-mono text-[#736A62] dark:text-[#A69B8F] mt-0.5">
          MANAGER IDENTITY, BCRYPT SECURITY CREDENTIALS & COMPLIANCE TELEMETRY
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white dark:bg-[#26201B] border border-[#E6E0D4] dark:border-[#3E342C] rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-[#26221F] dark:text-[#FAF8F5] tracking-tight mb-4 font-mono">
          OPERATOR CREDENTIALS & IDENTITY
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-b border-[#E6E0D4] dark:border-[#3E342C]">
          <div className="w-14 h-14 rounded-xl bg-[#8C532B]/10 border border-[#8C532B]/20 flex items-center justify-center text-[#8C532B] dark:text-[#C78753] font-bold font-mono text-xl uppercase shrink-0">
            {manager?.name ? manager.name.charAt(0) : 'M'}
          </div>
          <div>
            <h4 className="text-lg font-bold text-[#26221F] dark:text-[#FAF8F5]">{manager?.name}</h4>
            <a
              href={`mailto:${manager?.email}`}
              className="text-xs text-[#736A62] dark:text-[#A69B8F] hover:text-[#8C532B] flex items-center gap-1.5 mt-0.5 transition-colors font-mono"
            >
              <Mail className="w-3.5 h-3.5 text-[#8C532B]" />
              <span>{manager?.email}</span>
            </a>
            <p className="text-[11px] font-mono text-[#8C827A] mt-1">
              PROVISIONED: {formatDateTime(manager?.createdAt)}
            </p>
          </div>
        </div>

        {/* Name Update Form */}
        <form onSubmit={handleUpdateName} className="mt-6 space-y-4 max-w-md">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#736A62] dark:text-[#C78753] mb-1.5">
              Display Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#8C827A] absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#F8F6F0] dark:bg-[#1A1613] border border-[#E6E0D4] dark:border-[#3E342C] rounded-lg pl-10 pr-3.5 py-2 text-sm text-[#26221F] dark:text-[#FAF8F5] focus:outline-none focus:border-[#8C532B] font-mono transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loadingProfile}
            className="flex items-center gap-2 px-4 py-2 bg-[#8C532B] hover:bg-[#774421] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-lg shadow-sm disabled:opacity-50 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{loadingProfile ? 'SAVING...' : 'UPDATE NAME'}</span>
          </button>
        </form>
      </div>

      {/* Password Update Card */}
      <div className="bg-white dark:bg-[#26201B] border border-[#E6E0D4] dark:border-[#3E342C] rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-[#26221F] dark:text-[#FAF8F5] tracking-tight mb-1 font-mono">
          SECURITY & ENCRYPTION
        </h3>
        <p className="text-xs font-mono text-[#736A62] dark:text-[#A69B8F] mb-6">
          BCRYPT KEY DERIVATION · 10 ROUNDS SALT HASHING
        </p>

        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#736A62] dark:text-[#C78753] mb-1.5">
              Current Password
            </label>
            <PasswordInput
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              name="current-password"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#736A62] dark:text-[#C78753] mb-1.5">
              New Password
            </label>
            <PasswordInput
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              name="new-password"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#736A62] dark:text-[#C78753] mb-1.5">
              Confirm New Password
            </label>
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-type new password"
              name="confirm-password"
            />
          </div>

          <button
            type="submit"
            disabled={loadingPassword}
            className="flex items-center gap-2 px-4 py-2 bg-[#8C532B] hover:bg-[#774421] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-lg shadow-sm disabled:opacity-50 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{loadingPassword ? 'UPDATING...' : 'CHANGE PASSWORD'}</span>
          </button>
        </form>
      </div>

      {/* System Architecture Diagnostics */}
      <div className="bg-white dark:bg-[#26201B] border border-[#E6E0D4] dark:border-[#3E342C] rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-[#26221F] dark:text-[#FAF8F5] tracking-tight mb-4 font-mono">
          INFRASTRUCTURE TELEMETRY & DIAGNOSTICS
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
          <div className="p-4 rounded-lg bg-[#F8F6F0] dark:bg-[#1A1613] border border-[#E6E0D4] dark:border-[#3E342C] space-y-2">
            <div className="flex items-center gap-2 text-[#2E7D32] dark:text-[#4CAF50] font-semibold text-xs">
              <Database className="w-4 h-4" />
              <span>MONGODB ATLAS</span>
            </div>
            <p className="text-xs text-[#26221F] dark:text-[#FAF8F5] font-bold">Cluster0 Active</p>
            <p className="text-[11px] text-[#736A62] dark:text-[#A69B8F]">
              Persistent replica set with atomic sequence counters
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#F8F6F0] dark:bg-[#1A1613] border border-[#E6E0D4] dark:border-[#3E342C] space-y-2">
            <div className="flex items-center gap-2 text-[#8C532B] dark:text-[#C78753] font-semibold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>SECURITY HEADERS</span>
            </div>
            <p className="text-xs text-[#26221F] dark:text-[#FAF8F5] font-bold">Helmet & Rate Limiter</p>
            <p className="text-[11px] text-[#736A62] dark:text-[#A69B8F]">
              XSS protection, CSP, and brute-force mitigations
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#F8F6F0] dark:bg-[#1A1613] border border-[#E6E0D4] dark:border-[#3E342C] space-y-2">
            <div className="flex items-center gap-2 text-[#594F45] dark:text-[#C78753] font-semibold text-xs">
              <Server className="w-4 h-4 text-[#8C532B]" />
              <span>TENANCY BOUNDARY</span>
            </div>
            <p className="text-xs text-[#26221F] dark:text-[#FAF8F5] font-bold">JWT Scoped</p>
            <p className="text-[11px] text-[#736A62] dark:text-[#A69B8F]">
              Manager isolation across all queues and token records
            </p>
          </div>
        </div>
      </div>

      {/* GDPR Data Erasure / Account Deletion Danger Zone */}
      <div className="bg-[#B71C1C]/5 dark:bg-[#26201B] border border-[#B71C1C]/20 rounded-xl p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#B71C1C]/10 border border-[#B71C1C]/25 text-[#B71C1C] shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-[#26221F] dark:text-[#FAF8F5] tracking-tight font-mono">
              GDPR RIGHT TO ERASURE / DATA PURGE
            </h3>
            <p className="text-xs text-[#736A62] dark:text-[#A69B8F] mt-1 leading-relaxed font-mono">
              In accordance with GDPR Article 17, execute permanent deletion of your manager profile and all associated queues, tokens, and analytics telemetry. This operation cannot be reversed.
            </p>
            <button
              type="button"
              onClick={() => setDeleteAccountModal(true)}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#B71C1C] hover:bg-[#8B0000] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Permanently Delete Account & All Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Legal & Copyright */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#E6E0D4] dark:border-[#3E342C] text-xs font-mono text-[#8C827A]">
        <p>© {new Date().getFullYear()} QUEUEFLOW STUDIO · ALL RIGHTS RESERVED.</p>
        <div className="flex items-center gap-3">
          <Link to="/privacy" className="hover:text-[#8C532B] transition-colors">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link to="/terms" className="hover:text-[#8C532B] transition-colors">
            Terms of Service
          </Link>
          <span>•</span>
          <Link to="/cookies" className="hover:text-[#8C532B] transition-colors">
            Cookie Policy
          </Link>
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={deleteAccountModal}
        onClose={() => setDeleteAccountModal(false)}
        onConfirm={handleDeleteAccount}
        isLoading={deletingAccount}
        title="Permanently Delete Account?"
        message="Are you completely sure? This will delete your manager profile, all created queues, all customer tokens, and all analytics history permanently from MongoDB Atlas."
        confirmText="Confirm Permanent Erasure"
        isDanger={true}
      />
    </div>
  );
};

export default SettingsPage;
