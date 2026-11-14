import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import api from '../services/api';
import {
  Settings,
  User,
  Mail,
  Check,
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
        toast.success('Profile updated successfully');
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
        toast.success('Your account has been deleted.');
        logout();
        navigate('/login');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account');
    } finally {
      setDeletingAccount(false);
      setDeleteAccountModal(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl" id="main-content">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#26221F] dark:text-[#FAF8F5] tracking-tight">
          Settings
        </h2>
        <p className="text-xs sm:text-sm text-[#736A62] dark:text-[#A69B8F] mt-1">
          Manage your manager profile and account preferences.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white dark:bg-[#26201B] border border-[#E6E0D4] dark:border-[#3E342C] rounded-2xl p-6 shadow-xs">
        <h3 className="text-base font-semibold text-[#26221F] dark:text-[#FAF8F5] mb-4">
          Profile Information
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-b border-[#E6E0D4] dark:border-[#3E342C]">
          <div className="w-12 h-12 rounded-full bg-[#8C532B]/10 text-[#8C532B] dark:text-[#C78753] flex items-center justify-center font-bold text-lg shrink-0">
            {manager?.name ? manager.name.charAt(0).toUpperCase() : 'M'}
          </div>
          <div>
            <h4 className="text-base font-semibold text-[#26221F] dark:text-[#FAF8F5]">{manager?.name}</h4>
            <a
              href={`mailto:${manager?.email}`}
              className="text-xs text-[#736A62] dark:text-[#A69B8F] hover:text-[#8C532B] flex items-center gap-1.5 mt-0.5 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{manager?.email}</span>
            </a>
            {manager?.createdAt && (
              <p className="text-xs text-[#8C827A] mt-1">
                Member since {formatDateTime(manager.createdAt)}
              </p>
            )}
          </div>
        </div>

        {/* Name Update Form */}
        <form onSubmit={handleUpdateName} className="mt-6 space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-medium text-[#736A62] dark:text-[#A69B8F] mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#8C827A] absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#F8F6F0] dark:bg-[#1A1613] border border-[#E6E0D4] dark:border-[#3E342C] rounded-xl pl-10 pr-3.5 py-2 text-sm text-[#26221F] dark:text-[#FAF8F5] focus:outline-none focus:border-[#8C532B] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loadingProfile}
            className="flex items-center gap-2 px-4 py-2 bg-[#8C532B] hover:bg-[#774421] text-white text-xs font-semibold rounded-lg shadow-xs disabled:opacity-50 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{loadingProfile ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </form>
      </div>

      {/* Password Update Card */}
      <div className="bg-white dark:bg-[#26201B] border border-[#E6E0D4] dark:border-[#3E342C] rounded-2xl p-6 shadow-xs">
        <h3 className="text-base font-semibold text-[#26221F] dark:text-[#FAF8F5] mb-1">
          Change Password
        </h3>
        <p className="text-xs text-[#736A62] dark:text-[#A69B8F] mb-6">
          Update your login password to keep your account secure.
        </p>

        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-medium text-[#736A62] dark:text-[#A69B8F] mb-1.5">
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
            <label className="block text-xs font-medium text-[#736A62] dark:text-[#A69B8F] mb-1.5">
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
            <label className="block text-xs font-medium text-[#736A62] dark:text-[#A69B8F] mb-1.5">
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
            className="flex items-center gap-2 px-4 py-2 bg-[#8C532B] hover:bg-[#774421] text-white text-xs font-semibold rounded-lg shadow-xs disabled:opacity-50 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{loadingPassword ? 'Updating...' : 'Update Password'}</span>
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-white dark:bg-[#26201B] border border-[#B71C1C]/30 rounded-2xl p-6 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-[#B71C1C]/10 text-[#B71C1C] shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-[#B71C1C] tracking-tight">
              Delete Account
            </h3>
            <p className="text-xs text-[#736A62] dark:text-[#A69B8F] mt-1 leading-relaxed">
              Once you delete your account, all your queues and customer tokens will be permanently removed. This action cannot be undone.
            </p>
            <button
              type="button"
              onClick={() => setDeleteAccountModal(true)}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#B71C1C] hover:bg-[#991515] text-white text-xs font-semibold rounded-lg shadow-xs transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Legal & Copyright */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#E6E0D4] dark:border-[#3E342C] text-xs text-[#8C827A]">
        <p>© {new Date().getFullYear()} QueueFlow. All rights reserved.</p>
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
        title="Delete Account?"
        message="Are you sure you want to delete your account? All your queues and customer tokens will be permanently deleted."
        confirmText="Yes, Delete My Account"
        isDanger={true}
      />
    </div>
  );
};

export default SettingsPage;
