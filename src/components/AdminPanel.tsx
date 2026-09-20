import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User } from '../types';
import { TurnitScopeLogo } from './TurnitScopeLogo';
import {
  Shield,
  Coins,
  UserPlus,
  Users,
  Ticket,
  Clock,
  CheckCircle2,
  Copy,
  Plus,
  Trash2,
  Search,
  Sparkles,
  RefreshCw,
  Sliders,
  TrendingUp,
  FileCheck2,
  UserCog,
  AlertTriangle,
  LogOut,
  X,
  Edit3,
  Eye,
  Database,
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    currentUser,
    users,
    activationCodes,
    transactions,
    giveCredits,
    addUserAsAdmin,
    updateUserAsAdmin,
    deleteUser,
    generateCode,
    deleteCode,
    refreshFromFirestore,
    isFirestoreSyncing,
    setActivePanel,
    setIsProfileModalOpen,
    signOutAuth,
    resetAllData,
  } = useApp();

  // Give credits form state
  const [selectedUserId, setSelectedUserId] = useState<string>(currentUser.id);
  const [creditAmount, setCreditAmount] = useState<number>(25);
  const [creditReason, setCreditReason] = useState<string>('Administrative credit top-up');
  const [grantSuccess, setGrantSuccess] = useState<string | null>(null);

  // Edit user modal state
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editCredits, setEditCredits] = useState<number>(0);
  const [editPlan, setEditPlan] = useState<string>('');
  const [editExpiry, setEditExpiry] = useState<string>('');
  const [isSavingUser, setIsSavingUser] = useState<boolean>(false);

  // Add user modal state
  const [isAddingUser, setIsAddingUser] = useState<boolean>(false);
  const [newUserName, setNewUserName] = useState<string>('');
  const [newUserEmail, setNewUserEmail] = useState<string>('');
  const [newUserCredits, setNewUserCredits] = useState<number>(25);
  const [newUserPlan, setNewUserPlan] = useState<string>('Standard Verified Plan');
  const [isCreatingUser, setIsCreatingUser] = useState<boolean>(false);

  // Generate code form state
  const [newCodeName, setNewCodeName] = useState('');
  const [newCodeCredits, setNewCodeCredits] = useState<number>(20);
  const [newCodeMaxUses, setNewCodeMaxUses] = useState<number>(50);
  const [newCodeNote, setNewCodeNote] = useState('');
  const [codeCopied, setCodeCopied] = useState<string | null>(null);

  // User search filter
  const [userSearch, setUserSearch] = useState('');

  // User deletion state
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  // Selected tab in admin
  const [adminTab, setAdminTab] = useState<'allocate' | 'codes' | 'users' | 'logs'>('allocate');

  const selectedUser = users.find(u => u.id === selectedUserId) || currentUser;

  // Handle giving credits
  const handleGiveCredits = (e: React.FormEvent) => {
    e.preventDefault();
    if (creditAmount === 0) return;

    const success = giveCredits(selectedUserId, creditAmount, creditReason);
    if (success) {
      setGrantSuccess(`Allocated +${creditAmount} credits to ${selectedUser.name}!`);
      setTimeout(() => setGrantSuccess(null), 4000);
    }
  };

  // Handle generating code
  const handleGenerateCode = (e: React.FormEvent) => {
    e.preventDefault();
    const codeToUse = newCodeName.trim() || `TC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    generateCode(codeToUse, newCodeCredits, newCodeMaxUses, newCodeNote);
    setNewCodeName('');
    setNewCodeNote('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCodeCopied(text);
    setTimeout(() => setCodeCopied(null), 2500);
  };

  // Aggregate stats
  const totalCreditsInCirculation = users.reduce((acc, u) => acc + u.credits, 0);
  const totalScansAllUsers = users.reduce((acc, u) => acc + u.totalScans, 0);

  const filteredUsers = users.filter(
    u =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col select-none" id="admin-panel-root">
      {/* Top Admin Navigation Header */}
      <header className="bg-slate-950/80 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <TurnitScopeLogo size="sm" variant="dark" showSubtitle={false} />
          <div className="h-5 w-px bg-slate-800" />
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center gap-1.5">
              <Shield className="w-3 h-3" />
              Admin Portal
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Credit Management & Provisioning
            </span>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="flex items-center gap-2.5">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">Firestore DB:</span>
            <span className="font-mono text-emerald-300 font-semibold">Live Synced</span>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-slate-400">Master Admin:</span>
            <span className="font-mono text-amber-300 font-semibold">{currentUser.email || 'admin@turnitscope.com'}</span>
          </div>

          <button
            onClick={refreshFromFirestore}
            disabled={isFirestoreSyncing}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition cursor-pointer disabled:opacity-50"
            id="btn-admin-sync-firestore"
            title="Force Synchronize all documents with Cloud Firestore"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isFirestoreSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isFirestoreSyncing ? 'Syncing...' : 'Sync Firestore'}</span>
          </button>

          <button
            onClick={() => setActivePanel('client')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
            id="btn-admin-client-view"
            title="Switch to Client Interface"
          >
            <Eye className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Client View</span>
          </button>

          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
            id="btn-admin-profile"
            title="Edit Administrator Profile"
          >
            <UserCog className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Profile</span>
          </button>

          <button
            onClick={signOutAuth}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition cursor-pointer active:scale-98"
            id="btn-admin-signout"
            title="Sign Out from Administrator Portal"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Admin Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* KPI Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="admin-kpi-grid">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Total Active Credits</span>
              <Coins className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">
              {totalCreditsInCirculation}
            </div>
            <div className="text-[11px] text-amber-400/80 mt-1">
              Across {users.length} registered clients
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Total Documents Scanned</span>
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">
              {totalScansAllUsers}
            </div>
            <div className="text-[11px] text-emerald-400/80 mt-1">
              Turnitin & AI checks
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Client Accounts</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">
              {users.length}
            </div>
            <div className="text-[11px] text-indigo-400/80 mt-1">
              Active student & lab accounts
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Activation Vouchers</span>
              <Ticket className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">
              {activationCodes.length}
            </div>
            <div className="text-[11px] text-rose-400/80 mt-1">
              Ready for client redemption
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setAdminTab('allocate')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              adminTab === 'allocate'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Give Credits to User</span>
          </button>

          <button
            onClick={() => setAdminTab('codes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              adminTab === 'codes'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Activation Codes ({activationCodes.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              adminTab === 'users'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Manage Users ({users.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('logs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              adminTab === 'logs'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Audit & Credit Logs ({transactions.length})</span>
          </button>
        </div>

        {/* Tab 1: GIVE CREDITS TO USER (Core Requirement) */}
        {adminTab === 'allocate' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="give-credits-panel">
            {/* Credit Allocation Form (Left 2 columns) */}
            <div className="lg:col-span-2 bg-slate-800/60 border border-slate-700/70 rounded-2xl p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Coins className="w-5 h-5 text-amber-400" />
                  <span>Direct Credit Provisioning</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Instantly credit any student, researcher, or institutional client account. The balance updates live in the client dashboard.
                </p>
              </div>

              <form onSubmit={handleGiveCredits} className="space-y-5">
                {/* Select User */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Select Recipient User
                  </label>
                  <select
                    value={selectedUserId}
                    onChange={e => setSelectedUserId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    id="select-credit-recipient"
                  >
                    {users.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.email}) — Current Balance: {u.credits} Credits
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount Selection & Presets */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-300">
                      Credits to Allocate
                    </label>
                    <span className="text-xs text-amber-400 font-bold font-mono">
                      +{creditAmount} Credits
                    </span>
                  </div>

                  {/* Preset Buttons */}
                  <div className="grid grid-cols-5 gap-2 mb-3">
                    {[5, 10, 25, 50, 100].map(amt => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => setCreditAmount(amt)}
                        className={`py-2 rounded-xl text-xs font-bold font-mono transition border ${
                          creditAmount === amt
                            ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/20'
                            : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        +{amt}
                      </button>
                    ))}
                  </div>

                  {/* Custom Amount Input */}
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={creditAmount}
                    onChange={e => setCreditAmount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    placeholder="Enter custom credit amount..."
                    id="input-credit-amount"
                  />
                </div>

                {/* Reason / Note */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Allocation Reason / Reference Note
                  </label>
                  <input
                    type="text"
                    value={creditReason}
                    onChange={e => setCreditReason(e.target.value)}
                    placeholder="e.g., Monthly institutional top-up, Grant award, Test credit"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    id="input-credit-reason"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    New balance will be:{' '}
                    <span className="font-bold text-amber-400 font-mono">
                      {selectedUser.credits + creditAmount} credits
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 transition shadow-lg shadow-amber-400/20 active:scale-98"
                    id="btn-confirm-give-credits"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Give {creditAmount} Credits</span>
                  </button>
                </div>

                {grantSuccess && (
                  <div className="bg-emerald-900/40 border border-emerald-500/50 rounded-xl p-3 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{grantSuccess}</span>
                  </div>
                )}
              </form>
            </div>

            {/* Recipient User Preview Card (Right column) */}
            <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-6 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Selected User Profile
                </h4>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center text-lg shadow-md">
                    {selectedUser.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-white">{selectedUser.name}</h5>
                    <p className="text-xs text-slate-400">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-2 border-b border-slate-700/50">
                    <span className="text-slate-400">Current Credits:</span>
                    <span className="font-bold font-mono text-amber-400 text-sm">
                      {selectedUser.credits}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-700/50">
                    <span className="text-slate-400">Total Scans Run:</span>
                    <span className="font-bold font-mono text-white">
                      {selectedUser.totalScans}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-700/50">
                    <span className="text-slate-400">Active Plan:</span>
                    <span className="font-medium text-slate-300">
                      {selectedUser.planName}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-400">Member Since:</span>
                    <span className="font-mono text-slate-400">
                      {selectedUser.createdAt}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delete Action if eligible */}
              {selectedUser.id !== currentUser.id && selectedUser.role !== 'admin' && (
                <div className="pt-4 border-t border-slate-700/60">
                  <button
                    type="button"
                    onClick={() => setUserToDelete(selectedUser)}
                    className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Delete User Account</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: ACTIVATION CODES GENERATOR & LIST */}
        {adminTab === 'codes' && (
          <div className="space-y-6">
            {/* Generator Card */}
            <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                <Ticket className="w-4 h-4 text-indigo-400" />
                <span>Create Activation Code (Promo Voucher)</span>
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Generate redeemable vouchers that clients can enter in their "Redeem Code" tab to claim credits.
              </p>

              <form onSubmit={handleGenerateCode} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Code (e.g. TC-PRO100)
                  </label>
                  <input
                    type="text"
                    value={newCodeName}
                    onChange={e => setNewCodeName(e.target.value.toUpperCase())}
                    placeholder="Auto-generate or enter..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Credit Value
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newCodeCredits}
                    onChange={e => setNewCodeCredits(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Max Redemptions
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newCodeMaxUses}
                    onChange={e => setNewCodeMaxUses(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm"
                  >
                    + Generate Voucher
                  </button>
                </div>
              </form>
            </div>

            {/* Codes List Table */}
            <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">
                  Active Activation Codes
                </span>
                <span className="text-xs text-slate-400">
                  {activationCodes.length} codes available
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-900/60 border-b border-slate-700 text-slate-400 text-[11px] font-bold">
                      <th className="py-3 px-5">Code</th>
                      <th className="py-3 px-4">Credits Granted</th>
                      <th className="py-3 px-4">Usage / Max</th>
                      <th className="py-3 px-4">Created Date</th>
                      <th className="py-3 px-4">Note</th>
                      <th className="py-3 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60 text-slate-300">
                    {activationCodes.map(c => (
                      <tr key={c.id} className="hover:bg-slate-750 transition">
                        <td className="py-3.5 px-5 font-mono font-bold text-white flex items-center gap-2">
                          <span>{c.code}</span>
                          <button
                            onClick={() => copyToClipboard(c.code)}
                            className="p-1 hover:text-indigo-400 text-slate-500 rounded transition"
                            title="Copy code"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          {codeCopied === c.code && (
                            <span className="text-[10px] text-emerald-400 font-sans">
                              Copied!
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                          +{c.credits} Credits
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-300">
                          {c.usedCount} / {c.maxUses}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">{c.createdAt}</td>
                        <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">
                          {c.note || '—'}
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <button
                            onClick={() => deleteCode(c.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 rounded transition"
                            title="Delete code"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: CLIENT USER LIST */}
        {adminTab === 'users' && (
          <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  placeholder="Search clients by name or email..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-xs text-slate-400">
                  {filteredUsers.length} total users
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setNewUserName('');
                    setNewUserEmail('');
                    setNewUserCredits(25);
                    setNewUserPlan('Standard Verified Plan');
                    setIsAddingUser(true);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5 cursor-pointer"
                  id="btn-admin-add-user"
                  title="Add new user directly to Cloud Firestore"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Add User</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-900/60 border-b border-slate-700 text-slate-400 text-[11px] font-bold">
                    <th className="py-3 px-5">Client Name</th>
                    <th className="py-3 px-4">Email Address</th>
                    <th className="py-3 px-4">Verified Status</th>
                    <th className="py-3 px-4">Credit Balance</th>
                    <th className="py-3 px-4">Scans Completed</th>
                    <th className="py-3 px-4">Active Plan</th>
                    <th className="py-3 px-5 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 text-slate-300">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-750 transition">
                      <td className="py-3.5 px-5 font-bold text-white flex items-center gap-2.5">
                        {u.photoURL ? (
                          <img
                            src={u.photoURL}
                            alt={u.name}
                            className="w-7 h-7 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                            {u.name.charAt(0)}
                          </div>
                        )}
                        <span>{u.name}</span>
                        {u.role === 'admin' ? (
                          <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-bold border border-amber-400/30">
                            Admin
                          </span>
                        ) : (
                          <span className="text-[10px] bg-slate-700/60 text-slate-300 px-1.5 py-0.5 rounded">
                            User
                          </span>
                        )}
                        {u.id === currentUser.id && (
                          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded">
                            You
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {u.email}
                      </td>
                      <td className="py-3.5 px-4">
                        {u.emailVerified ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            ✓ Verified ({u.authProvider === 'google' ? 'Google' : 'Email'})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Unverified
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-amber-400 text-sm">
                          {u.credits}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono">{u.totalScans}</td>
                      <td className="py-3.5 px-4 text-slate-400">{u.planName}</td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedUserId(u.id);
                              setAdminTab('allocate');
                            }}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 transition inline-flex items-center gap-1"
                            title="Allocate credits"
                          >
                            <Plus className="w-3 h-3" />
                            <span className="hidden xl:inline">+ Credits</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingUser(u);
                              setEditName(u.name);
                              setEditCredits(u.credits);
                              setEditPlan(u.planName || 'Standard Verified Plan');
                              setEditExpiry(u.planExpiry || '2027-12-31');
                            }}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 transition inline-flex items-center gap-1 cursor-pointer"
                            title={`Edit user profile & credits for ${u.name}`}
                          >
                            <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Edit</span>
                          </button>
                          {u.id !== currentUser.id && u.role !== 'admin' && (
                            <button
                              type="button"
                              onClick={() => setUserToDelete(u)}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 transition inline-flex items-center gap-1 cursor-pointer"
                              title={`Delete user account for ${u.name}`}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                              <span className="hidden sm:inline">Delete</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: AUDIT & TRANSACTION LOGS */}
        {adminTab === 'logs' && (
          <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">
                Credit Audit & Deduction Logs
              </span>
              <span className="text-xs text-slate-400">
                Live ledger of all transactions
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-900/60 border-b border-slate-700 text-slate-400 text-[11px] font-bold">
                    <th className="py-3 px-5">Timestamp</th>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Transaction Type</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Balance After</th>
                    <th className="py-3 px-5">Details / Memo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 text-slate-300">
                  {transactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-750 transition">
                      <td className="py-3.5 px-5 text-slate-400 font-mono text-[11px]">
                        {tx.date}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {tx.userName}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            tx.type === 'admin_grant'
                              ? 'bg-amber-400/15 text-amber-400 border border-amber-400/20'
                              : tx.type === 'redeem_code'
                              ? 'bg-emerald-400/15 text-emerald-400 border border-emerald-400/20'
                              : 'bg-rose-400/15 text-rose-400 border border-rose-400/20'
                          }`}
                        >
                          {tx.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold">
                        <span
                          className={tx.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}
                        >
                          {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {tx.balanceAfter} credits
                      </td>
                      <td className="py-3.5 px-5 text-slate-400 max-w-sm truncate">
                        {tx.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Delete User Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">
                Delete User Account?
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                You are about to delete this account from TurnitScope. This will immediately remove all credentials, credit balances, and data.
              </p>
            </div>

            {/* User Details Summary Card */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-700/50">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                  {userToDelete.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-white">{userToDelete.name}</div>
                  <div className="text-slate-400 font-mono text-[11px]">{userToDelete.email}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div className="text-slate-400">
                  Credit Balance:{' '}
                  <span className="font-mono font-bold text-amber-400">
                    {userToDelete.credits} Credits
                  </span>
                </div>
                <div className="text-slate-400">
                  Scans Run:{' '}
                  <span className="font-mono font-bold text-white">
                    {userToDelete.totalScans}
                  </span>
                </div>
                <div className="text-slate-400">
                  Plan:{' '}
                  <span className="font-medium text-slate-300">
                    {userToDelete.planName}
                  </span>
                </div>
                <div className="text-slate-400">
                  Status:{' '}
                  <span className="font-medium text-slate-300">
                    {userToDelete.emailVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-[11px] text-rose-300 flex items-start gap-2">
              <Trash2 className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>
                This action is irreversible and permanently deletes the Firestore database record for this user.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                disabled={isDeletingUser}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingUser}
                onClick={async () => {
                  setIsDeletingUser(true);
                  try {
                    await deleteUser(userToDelete.id);
                    if (selectedUserId === userToDelete.id) {
                      setSelectedUserId(currentUser.id);
                    }
                    setUserToDelete(null);
                  } finally {
                    setIsDeletingUser(false);
                  }
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/20 transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeletingUser ? 'Deleting from Firestore...' : 'Yes, Delete User'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New User Modal (Direct Firestore Sync) */}
      {isAddingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <UserPlus className="w-5 h-5" />
              </div>
              <button
                type="button"
                onClick={() => setIsAddingUser(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Add New Client Account</h3>
              <p className="text-xs text-slate-400 mt-1">
                Creates a new user record immediately persisted in Cloud Firestore.
              </p>
            </div>

            <form
              onSubmit={async e => {
                e.preventDefault();
                if (!newUserName.trim() || !newUserEmail.trim()) return;
                setIsCreatingUser(true);
                try {
                  const success = await addUserAsAdmin({
                    name: newUserName.trim(),
                    email: newUserEmail.trim(),
                    credits: Number(newUserCredits) || 0,
                    planName: newUserPlan,
                    planExpiry: '2027-12-31',
                  });
                  if (success) {
                    setIsAddingUser(false);
                    setNewUserName('');
                    setNewUserEmail('');
                    setNewUserCredits(25);
                  }
                } finally {
                  setIsCreatingUser(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={e => setNewUserName(e.target.value)}
                  placeholder="e.g. Dr. Alex Morgan"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={e => setNewUserEmail(e.target.value)}
                  placeholder="e.g. alex.morgan@university.edu"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Initial Credits
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10000"
                    value={newUserCredits}
                    onChange={e => setNewUserCredits(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Assigned Plan
                  </label>
                  <select
                    value={newUserPlan}
                    onChange={e => setNewUserPlan(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Standard Verified Plan">Standard Verified</option>
                    <option value="Academic Pro Researcher">Academic Pro</option>
                    <option value="Enterprise Campus License">Enterprise Campus</option>
                    <option value="Faculty Unlimited">Faculty Unlimited</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddingUser(false)}
                  disabled={isCreatingUser}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingUser}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{isCreatingUser ? 'Saving to Firestore...' : 'Create in Firestore'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal (Direct Firestore Sync) */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                <Edit3 className="w-5 h-5" />
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Edit User Account</h3>
              <p className="text-xs text-slate-400 mt-1">
                Updating this user profile immediately syncs to Cloud Firestore collection <code className="text-amber-400 font-mono">users/{editingUser.id}</code>.
              </p>
            </div>

            <form
              onSubmit={async e => {
                e.preventDefault();
                setIsSavingUser(true);
                try {
                  const success = await updateUserAsAdmin(editingUser.id, {
                    name: editName.trim() || editingUser.name,
                    credits: Math.max(0, editCredits),
                    planName: editPlan,
                    planExpiry: editExpiry,
                  });
                  if (success) {
                    setEditingUser(null);
                  }
                } finally {
                  setIsSavingUser(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email (Account Reference)
                </label>
                <input
                  type="email"
                  disabled
                  value={editingUser.email}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 font-mono cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Credit Balance
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50000"
                    value={editCredits}
                    onChange={e => setEditCredits(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Plan Expiration
                  </label>
                  <input
                    type="date"
                    value={editExpiry}
                    onChange={e => setEditExpiry(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Plan Tier
                </label>
                <select
                  value={editPlan}
                  onChange={e => setEditPlan(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Standard Verified Plan">Standard Verified Plan</option>
                  <option value="Academic Pro Researcher">Academic Pro Researcher</option>
                  <option value="Enterprise Campus License">Enterprise Campus License</option>
                  <option value="Faculty Unlimited">Faculty Unlimited</option>
                  <option value="Pay-As-You-Go">Pay-As-You-Go</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  disabled={isSavingUser}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingUser}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-500 hover:bg-amber-400 shadow-lg shadow-amber-500/20 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isSavingUser ? 'Updating in Firestore...' : 'Save to Firestore'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
