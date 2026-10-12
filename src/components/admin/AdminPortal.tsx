/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Shield,
  Users,
  DollarSign,
  ArrowUpRight,
  FileText,
  AlertTriangle,
  FileCheck,
  BarChart3,
  Sparkles,
  Bell,
  Lock,
  History,
  Settings,
  User,
  LogOut,
  Globe,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  X,
  Download,
  Eye,
  Check,
  ChevronDown,
  ChevronRight,
  Menu,
  PieChart
} from 'lucide-react';
import {
  UserProfile,
  BankAccount,
  Transaction,
  TransferRecord,
  ComplaintTicket,
  LoanApplication,
  AuditLogEntry,
  SystemSettingsConfig
} from '../../types/banking';

interface AdminPortalProps {
  currentAdmin: UserProfile;
  users: UserProfile[];
  accounts: BankAccount[];
  transactions: Transaction[];
  transfers: TransferRecord[];
  complaints: ComplaintTicket[];
  loans: LoanApplication[];
  auditLogs: AuditLogEntry[];
  settings: SystemSettingsConfig;
  onSignOut: () => void;
  onNavigateHome: () => void;
  onUpdateUserStatus: (userId: string, newStatus: UserProfile['status']) => void;
  onUpdateAccountStatus: (accId: string, newStatus: BankAccount['status']) => void;
  onUpdateComplaintStatus: (ticketId: string, newStatus: ComplaintTicket['status'], notes?: string) => void;
  onUpdateLoanStatus: (loanId: string, newStatus: LoanApplication['status']) => void;
  onUpdateSettings: (newSettings: Partial<SystemSettingsConfig>) => void;
  showToast: (msg: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentAdmin,
  users,
  accounts,
  transactions,
  transfers,
  complaints,
  loans,
  auditLogs,
  settings,
  onSignOut,
  onNavigateHome,
  onUpdateUserStatus,
  onUpdateAccountStatus,
  onUpdateComplaintStatus,
  onUpdateLoanStatus,
  onUpdateSettings,
  showToast
}) => {
  // Navigation
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'users'
    | 'accounts'
    | 'transactions'
    | 'transfers'
    | 'complaints'
    | 'loans'
    | 'reports'
    | 'banko'
    | 'notifications'
    | 'security'
    | 'audit-logs'
    | 'settings'
    | 'profile'
  >('overview');

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // User Management State
  const [userSearch, setUserSearch] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState<'ALL' | 'ACTIVE' | 'SUSPENDED' | 'LOCKED'>('ALL');
  const [selectedUserDetail, setSelectedUserDetail] = useState<UserProfile | null>(null);

  // Account Management State
  const [accountSearch, setAccountSearch] = useState('');
  const [selectedAccountDetail, setSelectedAccountDetail] = useState<BankAccount | null>(null);

  // Transaction Monitoring State
  const [txSearch, setTxSearch] = useState('');
  const [investigatingTx, setInvestigatingTx] = useState<Transaction | null>(null);

  // Transfer Monitoring State
  const [transferSearch, setTransferSearch] = useState('');
  const [selectedTransferDetail, setSelectedTransferDetail] = useState<TransferRecord | null>(null);

  // Complaint Support State
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintTicket | null>(null);
  const [resolutionInput, setResolutionInput] = useState('');

  // Loan Management State
  const [selectedLoan, setSelectedLoan] = useState<LoanApplication | null>(null);

  // Reports & Analytics State
  const [reportType, setReportType] = useState<'users' | 'accounts' | 'transactions' | 'loans'>('transactions');
  const [reportGenerated, setReportGenerated] = useState(false);

  // System Settings state
  const [tempDailyLimit, setTempDailyLimit] = useState(settings.dailyTransferLimit.toString());
  const [tempAnnouncement, setTempAnnouncement] = useState(settings.systemAnnouncements);
  const [tempMaintenance, setTempMaintenance] = useState(settings.maintenanceMode);

  // Derived Admin Statistics
  const totalUsersCount = users.length;
  const activeUsersCount = users.filter((u) => u.status === 'ACTIVE').length;
  const suspendedUsersCount = users.filter((u) => u.status === 'SUSPENDED' || u.status === 'LOCKED').length;
  const totalAccountsCount = accounts.length;
  const totalBalanceAcrossSystem = accounts.reduce((s, a) => s + a.balance, 0);

  const totalTransactionsCount = transactions.length;
  const successfulTxCount = transactions.filter((t) => t.status === 'SUCCESS').length;
  const failedTxCount = transactions.filter((t) => t.status === 'FAILED').length;
  const openComplaintsCount = complaints.filter((c) => c.status === 'OPEN' || c.status === 'IN_PROGRESS').length;
  const activeLoansCount = loans.filter((l) => l.status === 'APPROVED' || l.status === 'ACTIVE').length;

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchStatus = userStatusFilter === 'ALL' || u.status === userStatusFilter;
    return matchSearch && matchStatus;
  });

  // Filtered accounts
  const filteredAccounts = accounts.filter(
    (a) =>
      a.fullNumber.toLowerCase().includes(accountSearch.toLowerCase()) ||
      a.userName.toLowerCase().includes(accountSearch.toLowerCase())
  );

  // Filtered transactions
  const filteredTransactions = transactions.filter(
    (t) =>
      t.id.toLowerCase().includes(txSearch.toLowerCase()) ||
      t.name.toLowerCase().includes(txSearch.toLowerCase()) ||
      (t.userName && t.userName.toLowerCase().includes(txSearch.toLowerCase()))
  );

  // Filtered transfers
  const filteredTransfers = transfers.filter(
    (tr) =>
      tr.id.toLowerCase().includes(transferSearch.toLowerCase()) ||
      tr.senderName.toLowerCase().includes(transferSearch.toLowerCase()) ||
      tr.receiverName.toLowerCase().includes(transferSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050811] text-white font-sans antialiased flex selection:bg-amber-500">
      {/* ──────────────────────────────────────────────────────────
          ADMIN OPERATIONS SIDEBAR
          ────────────────────────────────────────────────────────── */}
      <aside
        className={`hidden md:flex flex-col justify-between border-r border-white/10 bg-[#070C1A] transition-all duration-300 z-30 shrink-0 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div>
          {/* Admin Header */}
          <div className="h-20 flex items-center justify-between px-5 border-b border-white/10">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center shrink-0 shadow-lg shadow-amber-600/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              {!isSidebarCollapsed && (
                <div className="truncate">
                  <span className="font-bold text-xs uppercase tracking-wider text-amber-400 block">
                    ADMIN PORTAL
                  </span>
                  <span className="text-[11px] text-white font-semibold">Operations Center</span>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* 14 Navigation Tabs (Section 27) */}
          <nav className="p-3 space-y-0.5 overflow-y-auto max-h-[calc(100vh-160px)]">
            {[
              { id: 'overview', label: 'Dashboard', icon: BarChart3 },
              { id: 'users', label: 'User Management', icon: Users },
              { id: 'accounts', label: 'Account Management', icon: DollarSign },
              { id: 'transactions', label: 'Transaction Monitoring', icon: FileText },
              { id: 'transfers', label: 'Transfer Monitoring', icon: ArrowUpRight },
              { id: 'complaints', label: 'Complaints & Support', icon: AlertTriangle, badge: openComplaintsCount },
              { id: 'loans', label: 'Loan Management', icon: FileCheck },
              { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
              { id: 'banko', label: 'BANKO Analytics', icon: Sparkles },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'security', label: 'Security Center', icon: Lock },
              { id: 'audit-logs', label: 'Audit Logs', icon: History },
              { id: 'settings', label: 'System Settings', icon: Settings },
              { id: 'profile', label: 'Admin Profile', icon: User }
            ].map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  title={isSidebarCollapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-3 truncate">
                    <IconComp className="w-4 h-4 shrink-0" />
                    {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </div>
                  {item.badge && item.badge > 0 && !isSidebarCollapsed && (
                    <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-[10px] font-bold text-black">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Admin Footer */}
        <div className="p-3 border-t border-white/10">
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {currentAdmin.avatarText}
              </div>
              {!isSidebarCollapsed && (
                <div className="truncate">
                  <div className="text-xs font-semibold text-white truncate">{currentAdmin.name}</div>
                  <div className="text-[10px] text-amber-400 font-mono">SYS_ADMIN</div>
                </div>
              )}
            </div>
            <button
              onClick={onSignOut}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ──────────────────────────────────────────────────────────
          MAIN VIEWPORT
          ────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Admin Top Header */}
        <header className="h-20 border-b border-white/10 bg-[#070C1A]/90 backdrop-blur-xl px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-base font-bold text-white">Bank Operations & Management Center</h1>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Active Administrator:</span>
                <span className="text-amber-400 font-semibold">{currentAdmin.name} (MLRIT)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 transition cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400 inline mr-1" />
              <span>Public Home</span>
            </button>

            <button
              onClick={onSignOut}
              className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold border border-red-500/20 transition cursor-pointer"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileNavOpen && (
          <div className="md:hidden bg-[#070C1A] border-b border-white/10 p-4 space-y-1">
            {[
              { id: 'overview', label: 'Dashboard', icon: BarChart3 },
              { id: 'users', label: 'User Management', icon: Users },
              { id: 'accounts', label: 'Account Management', icon: DollarSign },
              { id: 'transactions', label: 'Transaction Monitoring', icon: FileText },
              { id: 'transfers', label: 'Transfer Monitoring', icon: ArrowUpRight },
              { id: 'complaints', label: 'Complaints & Support', icon: AlertTriangle },
              { id: 'loans', label: 'Loan Management', icon: FileCheck },
              { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
              { id: 'banko', label: 'BANKO Analytics', icon: Sparkles },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'security', label: 'Security Center', icon: Lock },
              { id: 'audit-logs', label: 'Audit Logs', icon: History },
              { id: 'settings', label: 'System Settings', icon: Settings },
              { id: 'profile', label: 'Admin Profile', icon: User }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setIsMobileNavOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                  activeTab === item.id ? 'bg-amber-600 text-white' : 'text-slate-400'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Content Container */}
        <main className="p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* =========================================================================
              TAB: ADMIN DASHBOARD (OVERVIEW)
              ========================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Top Operational Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-6 rounded-2xl bg-[#090F22] border border-white/10 shadow-lg">
                  <span className="text-xs text-slate-400 font-medium">Total Registered Users</span>
                  <div className="text-2xl font-bold text-white mt-1 tabular-nums">{totalUsersCount}</div>
                  <div className="text-[11px] text-cyan-400 font-semibold mt-1">
                    {activeUsersCount} Active · {suspendedUsersCount} Suspended
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#090F22] border border-white/10 shadow-lg">
                  <span className="text-xs text-slate-400 font-medium">Total Accounts Managed</span>
                  <div className="text-2xl font-bold text-white mt-1 tabular-nums">{totalAccountsCount}</div>
                  <div className="text-[11px] text-emerald-400 font-semibold mt-1">
                    ₹{totalBalanceAcrossSystem.toLocaleString('en-IN')} Total Holdings
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#090F22] border border-white/10 shadow-lg">
                  <span className="text-xs text-slate-400 font-medium">Transactions Monitored</span>
                  <div className="text-2xl font-bold text-white mt-1 tabular-nums">{totalTransactionsCount}</div>
                  <div className="text-[11px] text-emerald-400 font-semibold mt-1">
                    {successfulTxCount} Success · {failedTxCount} Failed
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#090F22] border border-white/10 shadow-lg">
                  <span className="text-xs text-slate-400 font-medium">Open Support Tickets</span>
                  <div className="text-2xl font-bold text-amber-400 mt-1 tabular-nums">{openComplaintsCount}</div>
                  <div className="text-[11px] text-amber-400 font-semibold mt-1">
                    {activeLoansCount} Active Academic Loans
                  </div>
                </div>
              </div>

              {/* Operations Overview & Recent Audit Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-6 rounded-3xl bg-[#090F22] border border-white/10 shadow-lg space-y-4">
                  <h3 className="text-base font-semibold text-white">System Activity & Volumes</h3>
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Spring Security Auth</span>
                      <strong className="text-emerald-400 text-sm mt-1 block">100% OK</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">MySQL DB Health</span>
                      <strong className="text-emerald-400 text-sm mt-1 block">CONNECTED</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">REST Endpoints</span>
                      <strong className="text-cyan-400 text-sm mt-1 block">READY</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">BANKO AI Inference</span>
                      <strong className="text-cyan-400 text-sm mt-1 block">ONLINE</strong>
                    </div>
                  </div>

                  <div className="pt-2 space-y-2">
                    <span className="text-xs font-semibold text-slate-300">Quick Navigation</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <button
                        onClick={() => setActiveTab('users')}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 text-left transition"
                      >
                        Manage Users →
                      </button>
                      <button
                        onClick={() => setActiveTab('complaints')}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 text-left transition"
                      >
                        Support Tickets ({openComplaintsCount}) →
                      </button>
                      <button
                        onClick={() => setActiveTab('loans')}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 text-left transition"
                      >
                        Review Loans →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recent Admin Audit Activity */}
                <div className="p-6 rounded-3xl bg-[#090F22] border border-white/10 shadow-lg space-y-4">
                  <h3 className="text-base font-semibold text-white">Recent Security Events</h3>
                  <div className="space-y-3">
                    {auditLogs.slice(0, 4).map((log) => (
                      <div key={log.id} className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-[10px] text-amber-400 font-bold">{log.action}</span>
                          <span className="text-[10px] text-slate-500">{log.timestamp.split(' ')[1]}</span>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-tight">{log.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: USER MANAGEMENT (Section 29)
              ========================================================================= */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">User Management</h2>
                  <p className="text-xs text-slate-400">Search, inspect, activate, or suspend registered student accounts</p>
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#090F22] border border-white/10">
                <div className="relative sm:col-span-2">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full bg-black/40 border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <select
                    value={userStatusFilter}
                    onChange={(e) => setUserStatusFilter(e.target.value as any)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="ACTIVE">Active Users</option>
                    <option value="SUSPENDED">Suspended Users</option>
                  </select>
                </div>
              </div>

              {/* User Table */}
              <div className="p-6 rounded-3xl bg-[#090F22] border border-white/10 shadow-lg overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/30 text-slate-400 uppercase text-[10px] font-bold border-b border-white/5">
                    <tr>
                      <th className="p-3.5">Name</th>
                      <th className="p-3.5">Email</th>
                      <th className="p-3.5">Accounts</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Joined Date</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-white/5 transition">
                        <td className="p-3.5 font-bold text-white">{u.name}</td>
                        <td className="p-3.5 text-slate-300">{u.email}</td>
                        <td className="p-3.5 text-cyan-400 font-semibold">{u.accountCount} Accounts</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              u.status === 'ACTIVE'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-red-500/10 text-red-400'
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-400">{u.joinedDate}</td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => setSelectedUserDetail(u)}
                            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-medium"
                          >
                            View
                          </button>
                          {u.status === 'ACTIVE' ? (
                            <button
                              onClick={() => {
                                onUpdateUserStatus(u.id, 'SUSPENDED');
                                showToast(`Suspended user ${u.name}`);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-bold"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                onUpdateUserStatus(u.id, 'ACTIVE');
                                showToast(`Activated user ${u.name}`);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-bold"
                            >
                              Activate
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: ACCOUNT MANAGEMENT (Section 30)
              ========================================================================= */}
          {activeTab === 'accounts' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Account Management</h2>
                <p className="text-xs text-slate-400">Supervise institutional accounts, balances, and security freeze locks</p>
              </div>

              <div className="p-6 rounded-3xl bg-[#090F22] border border-white/10 shadow-lg overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/30 text-slate-400 uppercase text-[10px] font-bold border-b border-white/5">
                    <tr>
                      <th className="p-3.5">Account Number</th>
                      <th className="p-3.5">Account Holder</th>
                      <th className="p-3.5">Type</th>
                      <th className="p-3.5">Current Balance</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredAccounts.map((acc) => (
                      <tr key={acc.id} className="hover:bg-white/5 transition">
                        <td className="p-3.5 font-mono text-cyan-400 font-bold">{acc.fullNumber}</td>
                        <td className="p-3.5 font-semibold text-white">{acc.userName}</td>
                        <td className="p-3.5 text-slate-300">{acc.type}</td>
                        <td className="p-3.5 font-bold tabular-nums">₹{acc.balance.toLocaleString('en-IN')}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              acc.status === 'ACTIVE'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-red-500/10 text-red-400'
                            }`}
                          >
                            {acc.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          {acc.status === 'ACTIVE' ? (
                            <button
                              onClick={() => {
                                onUpdateAccountStatus(acc.id, 'FROZEN');
                                showToast(`Account ${acc.fullNumber} frozen.`);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-bold"
                            >
                              Freeze
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                onUpdateAccountStatus(acc.id, 'ACTIVE');
                                showToast(`Account ${acc.fullNumber} unfrozen.`);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-bold"
                            >
                              Unfreeze
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: TRANSACTION MONITORING (Section 31)
              ========================================================================= */}
          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Transaction Monitoring</h2>
                <p className="text-xs text-slate-400">System-wide transaction ledger and investigatory oversight</p>
              </div>

              <div className="p-6 rounded-3xl bg-[#090F22] border border-white/10 shadow-lg overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/30 text-slate-400 uppercase text-[10px] font-bold border-b border-white/5">
                    <tr>
                      <th className="p-3.5">Txn ID</th>
                      <th className="p-3.5">Account / User</th>
                      <th className="p-3.5">Description</th>
                      <th className="p-3.5">Amount</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-white/5 transition">
                        <td className="p-3.5 font-mono text-cyan-400 font-semibold">{tx.id}</td>
                        <td className="p-3.5 text-white font-medium">{tx.userName || 'Account User'}</td>
                        <td className="p-3.5 text-slate-300">{tx.name}</td>
                        <td className="p-3.5 font-bold tabular-nums">
                          <span className={tx.type === 'credit' ? 'text-emerald-400' : 'text-white'}>
                            {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-400">{tx.date}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              tx.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => setInvestigatingTx(tx)}
                            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-medium"
                          >
                            Investigate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: TRANSFER MONITORING (Section 32)
              ========================================================================= */}
          {activeTab === 'transfers' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Transfer Monitoring</h2>
                <p className="text-xs text-slate-400">Inter-account money transfers and clearing statuses</p>
              </div>

              <div className="p-6 rounded-3xl bg-[#090F22] border border-white/10 shadow-lg overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/30 text-slate-400 uppercase text-[10px] font-bold border-b border-white/5">
                    <tr>
                      <th className="p-3.5">Transfer ID</th>
                      <th className="p-3.5">Sender</th>
                      <th className="p-3.5">Receiver</th>
                      <th className="p-3.5">Amount</th>
                      <th className="p-3.5">Date / Time</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredTransfers.map((tr) => (
                      <tr key={tr.id} className="hover:bg-white/5 transition">
                        <td className="p-3.5 font-mono text-cyan-400 font-bold">{tr.id}</td>
                        <td className="p-3.5 text-white">{tr.senderName} ({tr.senderAccount})</td>
                        <td className="p-3.5 text-white">{tr.receiverName} ({tr.receiverAccount})</td>
                        <td className="p-3.5 font-bold tabular-nums">₹{tr.amount.toLocaleString('en-IN')}</td>
                        <td className="p-3.5 text-slate-400">{tr.date}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              tr.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                            }`}
                          >
                            {tr.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: COMPLAINTS & SUPPORT (Section 33)
              ========================================================================= */}
          {activeTab === 'complaints' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Complaints & Support Tickets</h2>
                <p className="text-xs text-slate-400">Resolve user grievances, transaction inquiries, and notification delays</p>
              </div>

              <div className="space-y-4">
                {complaints.map((c) => (
                  <div key={c.id} className="p-6 rounded-3xl bg-[#090F22] border border-white/10 shadow-lg space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div>
                        <span className="font-mono text-[10px] text-cyan-400 font-bold">{c.ticketNumber}</span>
                        <h3 className="text-base font-bold text-white mt-0.5">{c.subject}</h3>
                        <div className="text-xs text-slate-400">
                          From: {c.userName} ({c.userEmail}) · Category: {c.category}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.priority === 'HIGH' || c.priority === 'URGENT'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-white/10 text-slate-300'
                          }`}
                        >
                          {c.priority} PRIORITY
                        </span>
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                            c.status === 'RESOLVED'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : c.status === 'IN_PROGRESS'
                              ? 'bg-cyan-500/10 text-cyan-400'
                              : 'bg-amber-500/10 text-amber-400'
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5">
                      {c.description}
                    </p>

                    {c.resolutionNotes && (
                      <div className="text-xs text-emerald-400 p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                        ✓ <strong>Resolution Notes:</strong> {c.resolutionNotes}
                      </div>
                    )}

                    {c.status !== 'RESOLVED' && (
                      <div className="pt-2 flex justify-end gap-2">
                        <button
                          onClick={() => {
                            onUpdateComplaintStatus(c.id, 'RESOLVED', 'Issue investigated and resolved via Spring Boot backend.');
                            showToast(`Resolved ticket ${c.ticketNumber}`);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md"
                        >
                          Mark as Resolved
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: LOAN MANAGEMENT (Section 34)
              ========================================================================= */}
          {activeTab === 'loans' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Loan Management (Academic Simulation)</h2>
                <p className="text-xs text-slate-400">Review student education, personal, and project equipment applications</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {loans.map((l) => (
                  <div key={l.id} className="p-6 rounded-3xl bg-[#090F22] border border-white/10 shadow-lg space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-amber-400">{l.loanType}</span>
                        <h4 className="font-bold text-white text-base mt-0.5">{l.applicantName}</h4>
                        <span className="text-[11px] text-slate-400">{l.applicantEmail}</span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          l.status === 'APPROVED' || l.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-amber-500/10 text-amber-400'
                        }`}
                      >
                        {l.status}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Principal:</span>
                        <strong className="text-white">₹{l.amount.toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Interest Rate:</span>
                        <strong className="text-cyan-400">{l.interestRate}% p.a.</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Tenure:</span>
                        <strong className="text-slate-200">{l.tenureMonths} Months</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Monthly EMI:</span>
                        <strong className="text-emerald-400">₹{l.monthlyEmi.toLocaleString('en-IN')}</strong>
                      </div>
                    </div>

                    {l.status === 'UNDER_REVIEW' && (
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => {
                            onUpdateLoanStatus(l.id, 'APPROVED');
                            showToast(`Approved loan for ${l.applicantName}`);
                          }}
                          className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            onUpdateLoanStatus(l.id, 'REJECTED');
                            showToast(`Rejected loan application.`);
                          }}
                          className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: REPORTS & ANALYTICS (Section 35)
              ========================================================================= */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white">Reports & Analytics</h2>
                  <p className="text-xs text-slate-400">Generate and export institutional audit summaries</p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[#090F22] border border-white/10 shadow-lg space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Report Target</label>
                    <select
                      value={reportType}
                      onChange={(e) => {
                        setReportType(e.target.value as any);
                        setReportGenerated(false);
                      }}
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
                    >
                      <option value="transactions">Transaction Activity Report</option>
                      <option value="users">User Roster & KYC Report</option>
                      <option value="accounts">Account Balance Holdings Report</option>
                      <option value="loans">Loan Portfolio Report</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Date Range</label>
                    <select className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white">
                      <option>Current Academic Semester (2025-2026)</option>
                      <option>Last 30 Days</option>
                      <option>All Historical Records</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={() => setReportGenerated(true)}
                      className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md"
                    >
                      Generate Report
                    </button>
                  </div>
                </div>

                {reportGenerated && (
                  <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-white text-sm uppercase tracking-wider">
                          Generated {reportType.toUpperCase()} Summary
                        </h4>
                        <span className="text-[11px] text-slate-400">Prepared for MLRIT Academic Audit</span>
                      </div>
                      <button
                        onClick={() => showToast('Report exported as CSV statement.')}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white flex items-center gap-1.5"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export CSV</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-center text-xs">
                      <div className="p-3 rounded-xl bg-white/5">
                        <span className="text-slate-400 block">Total Records</span>
                        <strong className="text-white text-base mt-1 block">
                          {reportType === 'transactions'
                            ? totalTransactionsCount
                            : reportType === 'users'
                            ? totalUsersCount
                            : reportType === 'accounts'
                            ? totalAccountsCount
                            : loans.length}
                        </strong>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5">
                        <span className="text-slate-400 block">Status Validated</span>
                        <strong className="text-emerald-400 text-base mt-1 block">100% Clean</strong>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5">
                        <span className="text-slate-400 block">Generated By</span>
                        <strong className="text-white text-base mt-1 block">{currentAdmin.name}</strong>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5">
                        <span className="text-slate-400 block">Database</span>
                        <strong className="text-cyan-400 text-base mt-1 block">MySQL 8.0</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: BANKO ANALYTICS (Section 36)
              ========================================================================= */}
          {activeTab === 'banko' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">BANKO AI Analytics</h2>
                <p className="text-xs text-slate-400">Inference query frequency, latency metrics, and question category insights</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="p-6 rounded-2xl bg-[#090F22] border border-white/10 shadow-lg">
                  <span className="text-xs text-slate-400 font-medium">Total AI Queries Processed</span>
                  <div className="text-2xl font-bold text-cyan-400 mt-1 tabular-nums">4,812</div>
                  <div className="text-[11px] text-cyan-400/80 font-semibold mt-1">100% Privacy Preserved</div>
                </div>

                <div className="p-6 rounded-2xl bg-[#090F22] border border-white/10 shadow-lg">
                  <span className="text-xs text-slate-400 font-medium">Average Response Latency</span>
                  <div className="text-2xl font-bold text-emerald-400 mt-1 tabular-nums">1.8s</div>
                  <div className="text-[11px] text-emerald-400 font-semibold mt-1">Zero dropped requests</div>
                </div>

                <div className="p-6 rounded-2xl bg-[#090F22] border border-white/10 shadow-lg">
                  <span className="text-xs text-slate-400 font-medium">Top Question Topic</span>
                  <div className="text-2xl font-bold text-white mt-1">Balance & Spending</div>
                  <div className="text-[11px] text-slate-400 mt-1">42% of total queries</div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: AUDIT LOGS (Section 38)
              ========================================================================= */}
          {activeTab === 'audit-logs' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Security & Audit Logs</h2>
                <p className="text-xs text-slate-400">
                  Append-oriented immutable record of all administrative interventions and role transitions
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#090F22] border border-white/10 shadow-lg overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/30 text-slate-400 uppercase text-[10px] font-bold border-b border-white/5">
                    <tr>
                      <th className="p-3.5">Timestamp</th>
                      <th className="p-3.5">Admin</th>
                      <th className="p-3.5">Action</th>
                      <th className="p-3.5">Target</th>
                      <th className="p-3.5">Result</th>
                      <th className="p-3.5">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/5 transition">
                        <td className="p-3.5 text-slate-400 font-mono text-[11px]">{log.timestamp}</td>
                        <td className="p-3.5 font-bold text-white">{log.adminName}</td>
                        <td className="p-3.5 font-mono text-amber-400 font-semibold">{log.action}</td>
                        <td className="p-3.5 text-slate-300">{log.target}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              log.result === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                            }`}
                          >
                            {log.result}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-300">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: SYSTEM SETTINGS (Section 39)
              ========================================================================= */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">System Settings</h2>
                <p className="text-xs text-slate-400">Platform limits, global notices, and maintenance mode</p>
              </div>

              <div className="p-6 rounded-3xl bg-[#090F22] border border-white/10 shadow-lg space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Daily Account Transfer Limit (₹)
                  </label>
                  <input
                    type="number"
                    value={tempDailyLimit}
                    onChange={(e) => setTempDailyLimit(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Global System Announcement Banner
                  </label>
                  <input
                    type="text"
                    value={tempAnnouncement}
                    onChange={(e) => setTempAnnouncement(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/10">
                  <div>
                    <strong className="text-xs text-white block">Maintenance Mode</strong>
                    <span className="text-[11px] text-slate-400">Suspend non-admin transactions temporarily</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={tempMaintenance}
                    onChange={(e) => setTempMaintenance(e.target.checked)}
                    className="w-5 h-5 accent-amber-500 cursor-pointer"
                  />
                </div>

                <button
                  onClick={() => {
                    onUpdateSettings({
                      dailyTransferLimit: parseFloat(tempDailyLimit) || 100000,
                      systemAnnouncements: tempAnnouncement,
                      maintenanceMode: tempMaintenance
                    });
                    showToast('System settings updated.');
                  }}
                  className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition cursor-pointer shadow-md mt-2"
                >
                  Save Settings
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: ADMIN PROFILE (Section 40)
              ========================================================================= */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Administrator Profile</h2>
                <p className="text-xs text-slate-400">Administrative identity and Spring Security supervisor privileges</p>
              </div>

              <div className="p-6 rounded-3xl bg-[#090F22] border border-white/10 shadow-lg space-y-3 text-xs divide-y divide-white/5">
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Administrator Name:</span>
                  <strong className="text-white">{currentAdmin.name}</strong>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Official Email:</span>
                  <strong className="text-white">{currentAdmin.email}</strong>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">System Role:</span>
                  <span className="font-bold text-amber-400">SYSTEM_ADMIN (ROLE_ADMIN)</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Institution:</span>
                  <strong className="text-slate-200">Marri Laxman Reddy Institute of Technology (MLRIT)</strong>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Department / Branch:</span>
                  <span className="font-semibold text-cyan-400">CSE (Data Science)</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Last Login:</span>
                  <span className="text-emerald-400">Today, Authenticated via Spring Security</span>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: NOTIFICATIONS & SECURITY CENTER
              ========================================================================= */}
          {(activeTab === 'notifications' || activeTab === 'security') && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {activeTab === 'security' ? 'Security Center' : 'Admin Operational Alerts'}
                </h2>
                <p className="text-xs text-slate-400">
                  {activeTab === 'security'
                    ? 'Failed logins, lockouts, and anomalous access attempts'
                    : 'System-wide operational notifications'}
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#090F22] border border-white/10 shadow-lg space-y-3">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center justify-between">
                  <div>
                    <strong>Multiple Failed Login Alert</strong>
                    <div className="text-[11px] text-slate-300 mt-0.5">
                      3 failed attempts detected from IP 192.168.1.45 (Rate limiting active).
                    </div>
                  </div>
                  <button
                    onClick={() => showToast('IP added to temporary scrutiny queue.')}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold"
                  >
                    View Details
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between">
                  <div>
                    <strong>HSM Key Rotation & BCrypt Health</strong>
                    <div className="text-[11px] text-slate-300 mt-0.5">
                      Password hashing and session JWT secrets operating with valid TTL.
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold">100% HEALTHY</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Investigating Modal */}
      {investigatingTx && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#090F22] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white">Investigate Transaction</h3>
              <button onClick={() => setInvestigatingTx(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Txn ID:</span>
                <strong className="text-cyan-400 font-mono">{investigatingTx.id}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount:</span>
                <strong className="text-white">₹{investigatingTx.amount.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Description:</span>
                <span className="text-slate-200">{investigatingTx.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Reference:</span>
                <span className="font-mono text-[11px] text-slate-400">{investigatingTx.reference}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Admin rule: Historical completed financial records cannot be rewritten arbitrarily.
            </p>

            <button
              onClick={() => {
                setInvestigatingTx(null);
                showToast('Audit report appended.');
              }}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold"
            >
              Close Investigation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
