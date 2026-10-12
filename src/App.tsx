/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  BankAccount,
  Transaction,
  TransferRecord,
  BudgetCategory,
  SavingsGoal,
  AppNotification,
  ComplaintTicket,
  LoanApplication,
  AuditLogEntry,
  SystemSettingsConfig
} from './types/banking';
import {
  INITIAL_USERS,
  INITIAL_ACCOUNTS,
  INITIAL_TRANSACTIONS,
  INITIAL_TRANSFERS,
  INITIAL_BUDGETS,
  INITIAL_SAVINGS_GOALS,
  INITIAL_NOTIFICATIONS,
  INITIAL_COMPLAINTS,
  INITIAL_LOANS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SETTINGS
} from './data/mockData';
import { PublicHomePage } from './components/public/PublicHomePage';
import { AuthPages } from './components/auth/AuthPages';
import { UserDashboard } from './components/user/UserDashboard';
import { AdminPortal } from './components/admin/AdminPortal';

export default function App() {
  // ── Application State ────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<
    'main' | 'login' | 'register' | 'forgot-password' | 'dashboard' | 'admin'
  >('main');

  // Banking Models
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [accounts, setAccounts] = useState<BankAccount[]>(INITIAL_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [transfers, setTransfers] = useState<TransferRecord[]>(INITIAL_TRANSFERS);
  const [budgets, setBudgets] = useState<BudgetCategory[]>(INITIAL_BUDGETS);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(INITIAL_SAVINGS_GOALS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [complaints, setComplaints] = useState<ComplaintTicket[]>(INITIAL_COMPLAINTS);
  const [loans, setLoans] = useState<LoanApplication[]>(INITIAL_LOANS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [settings, setSettings] = useState<SystemSettingsConfig>(INITIAL_SETTINGS);

  // Global Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3600);
  };

  // URL / View Synchronization
  const navigateTo = (view: 'main' | 'login' | 'register' | 'forgot-password' | 'dashboard' | 'admin') => {
    if (view === 'dashboard' && currentUser?.role !== 'USER') {
      setCurrentView('login');
      window.history.pushState(null, '', '/login');
      return;
    }
    if (view === 'admin' && currentUser?.role !== 'ADMIN') {
      setCurrentView('login');
      window.history.pushState(null, '', '/login');
      return;
    }

    setCurrentView(view);
    const path = view === 'main' ? '/' : `/${view}`;
    window.history.pushState(null, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname;
      if (p === '/login' || p === '/admin/login') setCurrentView('login');
      else if (p === '/register') setCurrentView('register');
      else if (p === '/forgot-password') setCurrentView('forgot-password');
      else if (p === '/dashboard' || p === '/accounts' || p === '/transfer' || p === '/transactions') {
        if (currentUser?.role === 'USER') setCurrentView('dashboard');
        else setCurrentView('login');
      } else if (p === '/admin' || p.startsWith('/admin/')) {
        if (currentUser?.role === 'ADMIN') setCurrentView('admin');
        else setCurrentView('login');
      } else {
        setCurrentView('main');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentUser]);

  // Handle Login Success
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    if (user.role === 'ADMIN') {
      setCurrentView('admin');
      window.history.pushState(null, '', '/admin');
      showToast(`Welcome Administrator ${user.name}`);
    } else {
      setCurrentView('dashboard');
      window.history.pushState(null, '', '/dashboard');
      showToast(`Welcome back, ${user.name}!`);
    }

    // Append Audit Log
    const newLog: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      adminName: user.name,
      action: user.role === 'ADMIN' ? 'ADMIN_LOGIN' : 'ADMIN_LOGIN',
      target: `${user.role} Authentication Endpoint`,
      result: 'SUCCESS',
      details: `${user.role} logged in successfully via Spring Security authentication flow.`
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Handle Sign Out
  const handleSignOut = () => {
    setCurrentUser(null);
    setCurrentView('login');
    window.history.pushState(null, '', '/login');
    showToast('Signed out of Smart Banking Assistant.');
  };

  // Handle Register User
  const handleRegisterUser = (newUser: UserProfile) => {
    setUsers((prev) => [newUser, ...prev]);
    // Create an initial student savings account
    const newAccount: BankAccount = {
      id: `acc-${Date.now()}`,
      userId: newUser.id,
      userName: newUser.name,
      name: 'Primary Savings Account',
      number: `•••• ${Math.floor(1000 + Math.random() * 9000)}`,
      fullNumber: `SB-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      balance: 10000.0,
      type: 'Savings Account',
      status: 'ACTIVE',
      createdDate: new Date().toISOString().split('T')[0],
      currency: 'INR'
    };
    setAccounts((prev) => [...prev, newAccount]);
  };

  // Handle Money Transfer
  const handlePerformTransfer = (
    fromAccNum: string,
    toAccNum: string,
    amount: number,
    description: string
  ) => {
    const sourceAcc = accounts.find((a) => a.fullNumber === fromAccNum);
    if (!sourceAcc) {
      return { success: false, message: 'Source account not found.' };
    }

    if (sourceAcc.balance < amount) {
      return { success: false, message: 'Insufficient balance for this transfer.' };
    }

    // Deduct from source
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.fullNumber === fromAccNum ? { ...acc, balance: acc.balance - amount } : acc
      )
    );

    const txnId = `TXN-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toLocaleString();

    // Create Transaction Record
    const newTxn: Transaction = {
      id: txnId,
      userId: currentUser?.id || 'u-1',
      userName: currentUser?.name || 'Vamshi Krishna',
      accountNumber: sourceAcc.number,
      accountType: sourceAcc.type,
      name: description || `Transfer to ${toAccNum}`,
      category: 'Other',
      date: now,
      amount,
      type: 'debit',
      status: 'SUCCESS',
      reference: `UPI/SBA/${Math.floor(100000 + Math.random() * 900000)}`
    };
    setTransactions((prev) => [newTxn, ...prev]);

    // Create Transfer Record
    const newTransfer: TransferRecord = {
      id: `TRF-${Math.floor(1000 + Math.random() * 9000)}`,
      senderName: currentUser?.name || 'Vamshi Krishna',
      senderAccount: fromAccNum,
      receiverName: 'External Account / Student',
      receiverAccount: toAccNum,
      amount,
      date: now,
      reference: newTxn.reference,
      description: description || 'Fund Transfer',
      status: 'SUCCESS'
    };
    setTransfers((prev) => [newTransfer, ...prev]);

    // Create Notification
    const newNotification: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Transfer Successful',
      message: `₹${amount.toLocaleString('en-IN')} debited from ${sourceAcc.name} to ${toAccNum}.`,
      time: 'Just now',
      category: 'Transactions',
      read: false,
      type: 'success'
    };
    setNotifications((prev) => [newNotification, ...prev]);

    showToast(`Transferred ₹${amount.toLocaleString('en-IN')} successfully!`);
    return { success: true, message: 'Transfer completed successfully.', txnId };
  };

  // Handle Budget Creation
  const handleCreateBudget = (category: BudgetCategory['category'], limit: number) => {
    setBudgets((prev) => {
      const existing = prev.find((b) => b.category === category);
      if (existing) {
        return prev.map((b) => (b.category === category ? { ...b, limit } : b));
      }
      return [
        ...prev,
        {
          id: `b-${Date.now()}`,
          category,
          limit,
          spent: 0,
          month: 'March 2026'
        }
      ];
    });
  };

  // Handle Savings Goal Creation
  const handleCreateSavingsGoal = (name: string, targetAmount: number, targetDate: string) => {
    const newGoal: SavingsGoal = {
      id: `sg-${Date.now()}`,
      name,
      targetAmount,
      currentAmount: 0,
      targetDate,
      status: 'IN_PROGRESS',
      category: 'General'
    };
    setSavingsGoals((prev) => [...prev, newGoal]);
  };

  // Handle Savings Goal Deposit
  const handleAddSavingsDeposit = (goalId: string, amount: number) => {
    setSavingsGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const newCurrent = g.currentAmount + amount;
          return {
            ...g,
            currentAmount: newCurrent,
            status: newCurrent >= g.targetAmount ? 'COMPLETED' : 'IN_PROGRESS'
          };
        }
        return g;
      })
    );
  };

  // Handle Notifications Read
  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.');
  };

  // Admin Actions
  const handleUpdateUserStatus = (userId: string, newStatus: UserProfile['status']) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));
    const targetUser = users.find((u) => u.id === userId);
    const newLog: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      adminName: currentUser?.name || 'Administrator',
      action: newStatus === 'SUSPENDED' ? 'USER_SUSPENDED' : 'USER_ACTIVATED',
      target: `User ${targetUser?.name || userId}`,
      result: 'SUCCESS',
      details: `User status changed to ${newStatus} by administrator.`
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleUpdateAccountStatus = (accId: string, newStatus: BankAccount['status']) => {
    setAccounts((prev) => prev.map((a) => (a.id === accId ? { ...a, status: newStatus } : a)));
    const targetAcc = accounts.find((a) => a.id === accId);
    const newLog: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      adminName: currentUser?.name || 'Administrator',
      action: newStatus === 'FROZEN' ? 'ACCOUNT_FROZEN' : 'ACCOUNT_UNFROZEN',
      target: `Account ${targetAcc?.fullNumber || accId}`,
      result: 'WARNING',
      details: `Account lock status updated to ${newStatus}.`
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleUpdateComplaintStatus = (
    ticketId: string,
    newStatus: ComplaintTicket['status'],
    notes?: string
  ) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === ticketId
          ? {
              ...c,
              status: newStatus,
              updatedAt: new Date().toLocaleString(),
              resolutionNotes: notes || c.resolutionNotes
            }
          : c
      )
    );
    const newLog: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      adminName: currentUser?.name || 'Administrator',
      action: 'COMPLAINT_RESOLVED',
      target: `Ticket ${ticketId}`,
      result: 'SUCCESS',
      details: notes || `Complaint ticket status changed to ${newStatus}.`
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleUpdateLoanStatus = (loanId: string, newStatus: LoanApplication['status']) => {
    setLoans((prev) => prev.map((l) => (l.id === loanId ? { ...l, status: newStatus } : l)));
    const targetLoan = loans.find((l) => l.id === loanId);
    const newLog: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      adminName: currentUser?.name || 'Administrator',
      action: newStatus === 'APPROVED' ? 'LOAN_APPROVED' : 'LOAN_REJECTED',
      target: `Loan ${loanId} (${targetLoan?.applicantName})`,
      result: 'SUCCESS',
      details: `Academic loan application status changed to ${newStatus}.`
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleUpdateSettings = (newSettings: Partial<SystemSettingsConfig>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    const newLog: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      adminName: currentUser?.name || 'Administrator',
      action: 'SYSTEM_SETTING_CHANGED',
      target: 'Platform System Settings',
      result: 'SUCCESS',
      details: 'System limits or announcements modified by administrator.'
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // ── Render Views ─────────────────────────────────────────────────────

  // View: Login / Register / Forgot Password
  if (
    currentView === 'login' ||
    currentView === 'register' ||
    currentView === 'forgot-password'
  ) {
    return (
      <>
        <AuthPages
          currentView={currentView}
          onNavigate={navigateTo}
          onLoginSuccess={handleLoginSuccess}
          users={users}
          onRegisterUser={handleRegisterUser}
        />
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0F1B31] text-white px-5 py-3 rounded-2xl text-xs font-medium shadow-2xl flex items-center gap-3 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#4A78B0]" />
            <span>{toastMessage}</span>
          </div>
        )}
      </>
    );
  }

  // View: User Dashboard
  if (currentView === 'dashboard' && currentUser?.role === 'USER') {
    // Current user's accounts and transactions
    const userAccounts = accounts.filter(
      (a) => a.userId === currentUser.id || a.userName.includes(currentUser.name)
    );
    const userTransactions = transactions.filter(
      (t) => t.userId === currentUser.id || !t.userId
    );

    return (
      <>
        <UserDashboard
          currentUser={currentUser}
          accounts={userAccounts.length > 0 ? userAccounts : accounts.slice(0, 2)}
          transactions={userTransactions}
          budgets={budgets}
          savingsGoals={savingsGoals}
          notifications={notifications}
          onSignOut={handleSignOut}
          onNavigateHome={() => navigateTo('main')}
          onPerformTransfer={handlePerformTransfer}
          onCreateBudget={handleCreateBudget}
          onCreateSavingsGoal={handleCreateSavingsGoal}
          onAddSavingsDeposit={handleAddSavingsDeposit}
          onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
          showToast={showToast}
        />
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0F1B31] text-white px-5 py-3 rounded-2xl text-xs font-medium shadow-2xl flex items-center gap-3 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>{toastMessage}</span>
          </div>
        )}
      </>
    );
  }

  // View: Admin Portal
  if (currentView === 'admin' && currentUser?.role === 'ADMIN') {
    return (
      <>
        <AdminPortal
          currentAdmin={currentUser}
          users={users}
          accounts={accounts}
          transactions={transactions}
          transfers={transfers}
          complaints={complaints}
          loans={loans}
          auditLogs={auditLogs}
          settings={settings}
          onSignOut={handleSignOut}
          onNavigateHome={() => navigateTo('main')}
          onUpdateUserStatus={handleUpdateUserStatus}
          onUpdateAccountStatus={handleUpdateAccountStatus}
          onUpdateComplaintStatus={handleUpdateComplaintStatus}
          onUpdateLoanStatus={handleUpdateLoanStatus}
          onUpdateSettings={handleUpdateSettings}
          showToast={showToast}
        />
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0F1B31] text-white px-5 py-3 rounded-2xl text-xs font-medium shadow-2xl flex items-center gap-3 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>{toastMessage}</span>
          </div>
        )}
      </>
    );
  }

  // Default View: Public Homepage (currentView === 'main')
  // CRITICAL REQUIREMENT: PRESERVE THE EXISTING HOMEPAGE GUI & LAYOUT
  return (
    <>
      <PublicHomePage
        currentUser={currentUser}
        onNavigate={navigateTo}
        onSignOut={handleSignOut}
      />
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F1B31] text-white px-5 py-3 rounded-2xl text-xs font-medium shadow-2xl flex items-center gap-3 border border-white/10">
          <span className="w-2 h-2 rounded-full bg-[#4A78B0]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}
