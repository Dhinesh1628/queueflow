import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import {
  Settings,
  User,
  Mail,
  Lock,
  Database,
  ShieldCheck,
  Check,
  Server,
} from 'lucide-react';
import { formatDateTime } from '../utils/formatters';

const SettingsPage = () => {
  const { manager, updateProfile } = useAuth();
  const toast = useToast();

  const [name, setName] = useState(manager?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

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

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Account & System Settings
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Manage your queue manager profile and view platform configurations
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-white tracking-tight mb-4">
          Manager Profile Information
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-400 flex items-center justify-center text-white font-extrabold text-2xl uppercase shadow-lg shadow-indigo-600/30 shrink-0">
            {manager?.name ? manager.name.charAt(0) : 'M'}
          </div>
          <div>
            <h4 className="text-lg font-bold text-white">{manager?.name}</h4>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5" />
              {manager?.email}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Account created on {formatDateTime(manager?.createdAt)}
            </p>
          </div>
        </div>

        {/* Name Update Form */}
        <form onSubmit={handleUpdateName} className="mt-6 space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Display Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loadingProfile}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{loadingProfile ? 'Saving...' : 'Update Name'}</span>
          </button>
        </form>
      </div>

      {/* Password Update Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-white tracking-tight mb-1">
          Security & Password
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Update your secure password using bcrypt hashing standards
        </p>

        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              New Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="Minimum 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="Re-type new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loadingPassword}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{loadingPassword ? 'Updating...' : 'Change Password'}</span>
          </button>
        </form>
      </div>

      {/* System Diagnostics Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-white tracking-tight mb-4">
          System & Architecture Status
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
              <Database className="w-4 h-4" />
              <span>MongoDB Atlas</span>
            </div>
            <p className="text-xs text-slate-300 font-medium">Cluster0 Active</p>
            <p className="text-[11px] text-slate-500">
              Persistent storage with multi-counter index optimization
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>JWT Authentication</span>
            </div>
            <p className="text-xs text-slate-300 font-medium">Manager Isolated</p>
            <p className="text-[11px] text-slate-500">
              Zero cross-tenant data leakage between queue managers
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs">
              <Server className="w-4 h-4" />
              <span>REST Engine</span>
            </div>
            <p className="text-xs text-slate-300 font-medium">Atomic Operations</p>
            <p className="text-[11px] text-slate-500">
              Guaranteed race-condition safe sequence numbering
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
