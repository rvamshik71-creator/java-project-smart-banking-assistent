/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Shield,
  PieChart,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
  BarChart3,
  Target,
  TrendingUp,
  Calculator,
  Sparkles,
  Bell,
  Settings,
  Menu,
  ChevronDown,
  ChevronRight,
  LogOut,
  Globe,
  Eye,
  EyeOff,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertTriangle,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  PlusCircle,
  Clock,
  KeyRound,
  User,
  Check,
  AlertCircle,
  HelpCircle,
  Info
} from 'lucide-react';
import {
  UserProfile,
  BankAccount,
  Transaction,
  BudgetCategory,
  SavingsGoal,
  ChatMessage,
  AppNotification
} from '../../types/banking';

interface UserDashboardProps {
  currentUser: UserProfile;
  accounts: BankAccount[];
  transactions: Transaction[];
  budgets: BudgetCategory[];
  savingsGoals: SavingsGoal[];
  notifications: AppNotification[];
  onSignOut: () => void;
  onNavigateHome: () => void;
  onPerformTransfer: (
    fromAccNum: string,
    toAccNum: string,
    amount: number,
    description: string
  ) => { success: boolean; message: string; txnId?: string };
  onCreateBudget: (category: BudgetCategory['category'], limit: number) => void;
  onCreateSavingsGoal: (name: string, targetAmount: number, targetDate: string) => void;
  onAddSavingsDeposit: (goalId: string, amount: number) => void;
  onMarkAllNotificationsRead: () => void;
  showToast: (msg: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  currentUser,
  accounts,
  transactions,
  budgets,
  savingsGoals,
  notifications,
  onSignOut,
  onNavigateHome,
  onPerformTransfer,
  onCreateBudget,
  onCreateSavingsGoal,
  onAddSavingsDeposit,
  onMarkAllNotificationsRead,
  showToast
}) => {
  // Navigation
  const [activeTab, setActiveTab] = useState<
    'overview' | 'accounts' | 'transfer' | 'history' | 'spending' | 'budget' | 'savings' | 'emi' | 'banko' | 'notifications' | 'settings'
  >('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Balance visibility toggle
  const [showBalance, setShowBalance] = useState(true);

  // Selected Account Modal
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);

  // Transfer Flow State
  const [transferStep, setTransferStep] = useState<1 | 2 | 3>(1);
  const [transferFrom, setTransferFrom] = useState(accounts[0]?.fullNumber || '');
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferDesc, setTransferDesc] = useState('');
  const [transferError, setTransferError] = useState<string | null>(null);
  const [transferResult, setTransferResult] = useState<{
    success: boolean;
    txnId?: string;
    amount?: number;
    time?: string;
    message?: string;
  } | null>(null);

  // Transactions Search & Filter State
  const [txSearch, setTxSearch] = useState('');
  const [txCategoryFilter, setTxCategoryFilter] = useState('ALL');
  const [txTypeFilter, setTxTypeFilter] = useState<'ALL' | 'credit' | 'debit'>('ALL');
  const [txStatusFilter, setTxStatusFilter] = useState<'ALL' | 'SUCCESS' | 'PENDING' | 'FAILED'>('ALL');
  const [selectedTxDetail, setSelectedTxDetail] = useState<Transaction | null>(null);

  // Budget Modal State
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [newBudgetCategory, setNewBudgetCategory] = useState<BudgetCategory['category']>('Food');
  const [newBudgetLimit, setNewBudgetLimit] = useState('');

  // Savings Goal Modals
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalAmount, setNewGoalAmount] = useState('');
  const [newGoalDate, setNewGoalDate] = useState('');
  const [depositGoalId, setDepositGoalId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState('');

  // Calculator State
  const [calcTab, setCalcTab] = useState<'emi' | 'simple' | 'compound' | 'target'>('emi');
  const [emiPrincipal, setEmiPrincipal] = useState(200000);
  const [emiRate, setEmiRate] = useState(10.5);
  const [emiTenure, setEmiTenure] = useState(24);

  const [siPrincipal, setSiPrincipal] = useState(50000);
  const [siRate, setSiRate] = useState(7.0);
  const [siYears, setSiYears] = useState(3);

  const [ciPrincipal, setCiPrincipal] = useState(50000);
  const [ciRate, setCiRate] = useState(8.0);
  const [ciYears, setCiYears] = useState(5);
  const [ciFreq, setCiFreq] = useState(12);

  const [targetGoal, setTargetGoal] = useState(100000);
  const [targetYears, setTargetYears] = useState(2);
  const [targetReturnRate, setTargetReturnRate] = useState(8.0);

  // BANKO AI Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm-0',
      sender: 'assistant',
      text: `Hello ${currentUser.name}! I'm BANKO, your Smart Banking Assistant. How can I help you manage your accounts, analyze spending, calculate EMIs or track your savings goals today?`,
      time: 'Just now'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Settings State
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confPass, setConfPass] = useState('');
  const [passError, setPassError] = useState<string | null>(null);

  // Derived Financial Computations
  const totalBalance = accounts.reduce((sum, a) => sum + (a.status !== 'FROZEN' ? a.balance : 0), 0);
  const totalIncome = transactions
    .filter((t) => t.type === 'credit' && t.status === 'SUCCESS')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === 'debit' && t.status === 'SUCCESS')
    .reduce((sum, t) => sum + t.amount, 0);
  const netSavings = totalIncome - totalExpenses;

  // Spending By Category
  const spendingByCategory = transactions
    .filter((t) => t.type === 'debit' && t.status === 'SUCCESS')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const highestCategoryEntry = Object.entries(spendingByCategory).sort((a, b) => b[1] - a[1])[0] || [
    'General',
    0
  ];

  // Dynamic Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Unread notifications count
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Filtered transactions
  const filteredTransactions = transactions.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(txSearch.toLowerCase()) ||
      t.id.toLowerCase().includes(txSearch.toLowerCase()) ||
      t.category.toLowerCase().includes(txSearch.toLowerCase());
    const matchCat = txCategoryFilter === 'ALL' || t.category === txCategoryFilter;
    const matchType = txTypeFilter === 'ALL' || t.type === txTypeFilter;
    const matchStatus = txStatusFilter === 'ALL' || t.status === txStatusFilter;
    return matchSearch && matchCat && matchType && matchStatus;
  });

  // Calculate EMI
  const calculateEMI = (P: number, r: number, n: number) => {
    const monthlyRate = r / 12 / 100;
    if (monthlyRate === 0) return { emi: P / n, totalPayment: P, totalInterest: 0 };
    const emi = (P * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;
    return {
      emi: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest)
    };
  };

  // Scroll chat to bottom
  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiLoading]);

  // Voice Recognition simulation / Web Speech API
  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      showToast('Speech recognition not supported in this browser.');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';

    if (isVoiceActive) {
      setIsVoiceActive(false);
      recognition.stop();
    } else {
      setIsVoiceActive(true);
      recognition.start();
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setChatInput(transcript);
        setIsVoiceActive(false);
      };
      recognition.onerror = () => setIsVoiceActive(false);
      recognition.onend = () => setIsVoiceActive(false);
    }
  };

  // Send Chat Message
  const handleSendMessage = async (customPrompt?: string) => {
    const messageText = (customPrompt || chatInput).trim();
    if (!messageText) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsAiLoading(true);

    try {
      // Send to server backend proxy
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: messageText,
          userData: {
            name: currentUser.name,
            email: currentUser.email,
            totalBalance,
            accounts: accounts.map((a) => ({ name: a.name, number: a.number, balance: a.balance })),
            recentTransactions: transactions.slice(0, 5),
            spendingSummary: spendingByCategory,
            highestCategory: highestCategoryEntry
          }
        })
      });

      let reply = '';
      if (res.ok) {
        const data = await res.json();
        reply = data.reply;
      } else {
        // Realistic fallback grounded in user data
        reply = getLocalBankoResponse(messageText);
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => [...prev, botMsg]);

      if (isTtsEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(reply.slice(0, 150));
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      const reply = getLocalBankoResponse(messageText);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Local Grounded Banko response generator
  const getLocalBankoResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('balance') || q.includes('how much money')) {
      return `Your total available balance is ₹${totalBalance.toLocaleString('en-IN', {
        minimumFractionDigits: 2
      })} across your active accounts (Savings Account: ₹${accounts[0]?.balance.toLocaleString(
        'en-IN'
      )}, Current Account: ₹${accounts[1]?.balance.toLocaleString('en-IN')}).`;
    }
    if (q.includes('transaction') || q.includes('recent')) {
      const latest = transactions[0];
      return `Your latest transaction was "${latest.name}" for ₹${latest.amount.toLocaleString(
        'en-IN'
      )} (${latest.type.toUpperCase()}) on ${latest.date}. Status: ${latest.status}.`;
    }
    if (q.includes('spend') || q.includes('expense')) {
      return `You have spent ₹${totalExpenses.toLocaleString(
        'en-IN'
      )} this month. Your largest spending category is ${highestCategoryEntry[0]} (₹${highestCategoryEntry[1].toLocaleString(
        'en-IN'
      )}).`;
    }
    if (q.includes('save') || q.includes('saving')) {
      return `You have accumulated net savings of ₹${netSavings.toLocaleString(
        'en-IN'
      )} this month. You also have 3 active savings goals with ₹35,000 saved towards your Laptop Fund!`;
    }
    if (q.includes('emi') || q.includes('loan')) {
      return `For a ₹2,00,000 loan at 10.5% interest over 24 months, your monthly EMI is ₹9,275 with total interest of ₹22,600. You can explore exact calculations on the EMI Calculator tab!`;
    }
    return `As your Smart Banking Assistant, I monitor your accounts, validate money transfers, compute EMIs, and track budgets. Let me know if you would like me to analyze any specific spending category or transaction!`;
  };

  // Handle Transfer Flow
  const handleContinueTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setTransferError(null);

    const amt = parseFloat(transferAmount);
    if (!transferTo.trim()) {
      setTransferError('Please provide a valid receiver account number.');
      return;
    }
    if (isNaN(amt) || amt <= 0) {
      setTransferError('Please enter a transfer amount greater than ₹0.');
      return;
    }

    const source = accounts.find((a) => a.fullNumber === transferFrom);
    if (!source) {
      setTransferError('Please select a valid source account.');
      return;
    }

    if (source.balance < amt) {
      setTransferError(`Insufficient balance in ${source.name}. Available: ₹${source.balance.toLocaleString('en-IN')}`);
      return;
    }

    if (transferTo.trim() === source.fullNumber) {
      setTransferError('Source and receiver accounts cannot be identical.');
      return;
    }

    setTransferStep(2);
  };

  const handleConfirmTransfer = () => {
    const amt = parseFloat(transferAmount);
    const res = onPerformTransfer(transferFrom, transferTo, amt, transferDesc);

    setTransferResult({
      success: res.success,
      txnId: res.txnId,
      amount: amt,
      time: new Date().toLocaleString(),
      message: res.message
    });
    setTransferStep(3);
  };

  // Handle Export CSV
  const handleExportCSV = () => {
    const header = 'ID,Date,Description,Category,Type,Amount,Status,Reference\n';
    const rows = filteredTransactions
      .map(
        (t) =>
          `"${t.id}","${t.date}","${t.name}","${t.category}","${t.type}","${t.amount}","${t.status}","${t.reference}"`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SBA-Transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast('Transaction statement downloaded.');
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-white font-sans antialiased flex selection:bg-blue-600">
      {/* ──────────────────────────────────────────────────────────
          SIDEBAR NAVIGATION
          ────────────────────────────────────────────────────────── */}
      <aside
        className={`hidden md:flex flex-col justify-between border-r border-white/10 bg-[#0A0F1D]/95 backdrop-blur-2xl transition-all duration-300 z-30 shrink-0 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div>
          {/* Logo & Header */}
          <div className="h-20 flex items-center justify-between px-5 border-b border-white/10">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              {!isSidebarCollapsed && (
                <div className="truncate">
                  <span className="font-bold text-sm text-white block">Smart Banking</span>
                  <span className="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase">
                    Powered by BANKO
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
              title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            {[
              { id: 'overview', label: 'Dashboard', icon: PieChart },
              { id: 'accounts', label: 'My Accounts', icon: DollarSign },
              { id: 'transfer', label: 'Money Transfer', icon: ArrowUpRight },
              { id: 'history', label: 'Transaction History', icon: FileText },
              { id: 'spending', label: 'Spending Analysis', icon: BarChart3 },
              { id: 'budget', label: 'Budget Planner', icon: Target },
              { id: 'savings', label: 'Savings Goals', icon: TrendingUp },
              { id: 'emi', label: 'EMI Calculator', icon: Calculator },
              { id: 'banko', label: 'BANKO AI', icon: Sparkles },
              { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  title={isSidebarCollapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-3 truncate">
                    <IconComponent className="w-4 h-4 shrink-0" />
                    {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </div>
                  {item.badge && item.badge > 0 && !isSidebarCollapsed && (
                    <span className="px-1.5 py-0.5 rounded-full bg-cyan-500 text-[10px] font-bold text-black">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-white/10">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {currentUser.avatarText}
              </div>
              {!isSidebarCollapsed && (
                <div className="truncate">
                  <div className="text-xs font-semibold text-white truncate">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{currentUser.email}</div>
                </div>
              )}
            </div>
            <button
              onClick={onSignOut}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 cursor-pointer transition"
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
        {/* Top Header */}
        <header className="h-20 border-b border-white/10 bg-[#0A0F1D]/80 backdrop-blur-xl px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-base font-semibold text-white">
                {getGreeting()}, {currentUser.name}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Smart Banking Assistant</span>
                <span>·</span>
                <span className="text-cyan-400 font-medium">BANKO AI Ready</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('banko')}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Ask BANKO</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-[#0A0F1D]" />
              )}
            </button>

            <button
              onClick={onNavigateHome}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 transition cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>Public Site</span>
            </button>

            <button
              onClick={onSignOut}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/10 text-slate-400 hover:text-red-400 transition cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileNavOpen && (
          <div className="md:hidden bg-[#0A0F1D] border-b border-white/10 p-4 space-y-1">
            {[
              { id: 'overview', label: 'Dashboard', icon: PieChart },
              { id: 'accounts', label: 'My Accounts', icon: DollarSign },
              { id: 'transfer', label: 'Money Transfer', icon: ArrowUpRight },
              { id: 'history', label: 'Transaction History', icon: FileText },
              { id: 'spending', label: 'Spending Analysis', icon: BarChart3 },
              { id: 'budget', label: 'Budget Planner', icon: Target },
              { id: 'savings', label: 'Savings Goals', icon: TrendingUp },
              { id: 'emi', label: 'EMI Calculator', icon: Calculator },
              { id: 'banko', label: 'BANKO AI', icon: Sparkles },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setIsMobileNavOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                  activeTab === item.id ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Tab Content Container */}
        <main className="p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* =========================================================================
              TAB: OVERVIEW / DASHBOARD
              ========================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Balance Card & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Total Balance Card */}
                <div className="lg:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-[#0F1B35] to-[#0A1022] border border-white/15 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                        TOTAL BALANCE
                      </span>
                      <button
                        onClick={() => setShowBalance(!showBalance)}
                        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition cursor-pointer"
                      >
                        {showBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{showBalance ? 'Hide' : 'Show'}</span>
                      </button>
                    </div>

                    <div className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tabular-nums tracking-tight">
                      {showBalance
                        ? `₹${totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                        : '••••••••'}
                    </div>

                    <div className="text-xs text-slate-400 mt-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Available Balance: ₹{totalBalance.toLocaleString('en-IN')} (Combined Accounts)</span>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/10">
                    <button
                      onClick={() => setActiveTab('transfer')}
                      className="p-3 rounded-2xl bg-white/5 hover:bg-blue-600 border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer group shadow-sm"
                    >
                      <ArrowUpRight className="w-4 h-4 text-cyan-400 group-hover:text-white" />
                      <span>Transfer Money</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('history')}
                      className="p-3 rounded-2xl bg-white/5 hover:bg-blue-600 border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer group shadow-sm"
                    >
                      <FileText className="w-4 h-4 text-cyan-400 group-hover:text-white" />
                      <span>Transactions</span>
                    </button>
                    <button
                      onClick={() => setIsBudgetModalOpen(true)}
                      className="p-3 rounded-2xl bg-white/5 hover:bg-blue-600 border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer group shadow-sm"
                    >
                      <Target className="w-4 h-4 text-cyan-400 group-hover:text-white" />
                      <span>Add Budget</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('banko')}
                      className="p-3 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500 border border-cyan-500/30 text-cyan-300 hover:text-black text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Ask BANKO</span>
                    </button>
                  </div>
                </div>

                {/* 🤖 BANKO AI Feature Card */}
                <div className="p-6 rounded-3xl bg-[#0E1528] border border-cyan-500/20 shadow-xl flex flex-col justify-between relative overflow-hidden">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">🤖 BANKO</h3>
                        <span className="text-[11px] text-cyan-400">Your Smart Banking Assistant</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pt-2">
                      Need help understanding your finances, tracking category spending, or calculating an EMI?
                    </p>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-slate-300">
                      💡 <em>"You spent ₹{highestCategoryEntry[1].toLocaleString('en-IN')} on {highestCategoryEntry[0]} this month."</em>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('banko')}
                    className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#070B14] font-bold text-xs transition cursor-pointer mt-4 flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <span>Ask BANKO</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Financial Summary 3 Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="p-6 rounded-2xl bg-[#0E1528] border border-white/10 shadow-lg">
                  <span className="text-xs text-slate-400 font-medium">Monthly Inflow (Income)</span>
                  <div className="text-2xl font-bold text-emerald-400 mt-2 tabular-nums">
                    ₹{totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[11px] text-emerald-400/80 font-semibold mt-1">Stipend & Credits</div>
                </div>

                <div className="p-6 rounded-2xl bg-[#0E1528] border border-white/10 shadow-lg">
                  <span className="text-xs text-slate-400 font-medium">Monthly Outflow (Expenses)</span>
                  <div className="text-2xl font-bold text-white mt-2 tabular-nums">
                    ₹{totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium mt-1">Transactions & Transfers</div>
                </div>

                <div className="p-6 rounded-2xl bg-[#0E1528] border border-white/10 shadow-lg">
                  <span className="text-xs text-slate-400 font-medium">Net Savings This Month</span>
                  <div className="text-2xl font-bold text-cyan-400 mt-2 tabular-nums">
                    ₹{netSavings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[11px] text-cyan-400/80 font-semibold mt-1">Accumulated Balance Growth</div>
                </div>
              </div>

              {/* Recent Transactions & Spending Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Transactions (2 cols) */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0E1528] border border-white/10 shadow-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-bold text-white">Recent Transactions</h3>
                      <p className="text-xs text-slate-400">Latest account credits and debits</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('history')}
                      className="text-xs text-cyan-400 hover:underline font-semibold cursor-pointer"
                    >
                      View All
                    </button>
                  </div>

                  <div className="divide-y divide-white/5">
                    {transactions.slice(0, 5).map((txn) => (
                      <div
                        key={txn.id}
                        onClick={() => setSelectedTxDetail(txn)}
                        className="py-3.5 flex items-center justify-between hover:bg-white/5 px-2 rounded-xl transition cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                              txn.type === 'credit'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {txn.type === 'credit' ? (
                              <ArrowDownLeft className="w-4 h-4" />
                            ) : (
                              <ArrowUpRight className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-white">{txn.name}</div>
                            <div className="text-[10px] text-slate-400">
                              {txn.date} · {txn.category}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div
                            className={`text-xs font-bold tabular-nums ${
                              txn.type === 'credit' ? 'text-emerald-400' : 'text-white'
                            }`}
                          >
                            {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                          </div>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              txn.status === 'SUCCESS'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : txn.status === 'PENDING'
                                ? 'bg-amber-500/10 text-amber-400'
                                : 'bg-red-500/10 text-red-400'
                            }`}
                          >
                            {txn.status === 'SUCCESS' ? '✓ SUCCESS' : txn.status === 'FAILED' ? '✕ FAILED' : '⏳ PENDING'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Spending Overview & Savings Goal (1 col) */}
                <div className="space-y-6">
                  {/* Category Breakdown */}
                  <div className="p-6 rounded-3xl bg-[#0E1528] border border-white/10 shadow-lg space-y-4">
                    <h3 className="text-sm font-bold text-white">Spending by Category</h3>
                    <div className="space-y-3">
                      {(['Food', 'Shopping', 'Bills', 'Transport', 'Other'] as const).map((cat) => {
                        const amount = spendingByCategory[cat] || 0;
                        const pct = totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0;
                        return (
                          <div key={cat} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-300">{cat}</span>
                              <span className="font-semibold text-white">₹{amount.toLocaleString('en-IN')} ({pct}%)</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                              <div
                                className="h-full bg-cyan-400 rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Primary Savings Goal Highlight */}
                  {savingsGoals[0] && (
                    <div className="p-6 rounded-3xl bg-[#0E1528] border border-white/10 shadow-lg space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                            Active Goal
                          </span>
                          <h4 className="font-bold text-white text-sm mt-0.5">{savingsGoals[0].name}</h4>
                        </div>
                        <span className="text-xs font-bold text-white">
                          {Math.round((savingsGoals[0].currentAmount / savingsGoals[0].targetAmount) * 100)}%
                        </span>
                      </div>

                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round((savingsGoals[0].currentAmount / savingsGoals[0].targetAmount) * 100)
                            )}%`
                          }}
                        />
                      </div>

                      <div className="flex justify-between text-xs text-slate-400 pt-1">
                        <span>₹{savingsGoals[0].currentAmount.toLocaleString('en-IN')} saved</span>
                        <span>Target: ₹{savingsGoals[0].targetAmount.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: MY ACCOUNTS
              ========================================================================= */}
          {activeTab === 'accounts' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white">My Accounts</h2>
                  <p className="text-xs text-slate-400">Active bank accounts and linked balances</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {accounts.map((acc) => (
                  <div
                    key={acc.id}
                    onClick={() => setSelectedAccount(acc)}
                    className="p-6 rounded-3xl bg-[#0E1528] border border-white/10 shadow-xl hover:border-cyan-500/40 transition cursor-pointer relative overflow-hidden group"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">
                          {acc.type}
                        </span>
                        <h3 className="text-lg font-bold text-white mt-1">{acc.name}</h3>
                        <p className="font-mono text-xs text-slate-400 mt-0.5">{acc.number}</p>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                          acc.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {acc.status}
                      </span>
                    </div>

                    <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-end">
                      <div>
                        <span className="text-[11px] text-slate-400 block">Available Balance</span>
                        <div className="text-2xl font-extrabold text-white tabular-nums">
                          ₹{acc.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                      </div>

                      <button className="text-xs text-cyan-400 font-semibold group-hover:underline flex items-center gap-1">
                        <span>Account Details</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: MONEY TRANSFER
              ========================================================================= */}
          {activeTab === 'transfer' && (
            <div className="max-w-xl mx-auto space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white text-center">Transfer Money</h2>
                <p className="text-xs text-slate-400 text-center">
                  Secure multi-step fund transfer validated by banking rules
                </p>
              </div>

              {/* Progress Steps */}
              <div className="flex justify-between items-center px-6">
                {[
                  { step: 1, label: 'Details' },
                  { step: 2, label: 'Confirm' },
                  { step: 3, label: 'Receipt' }
                ].map((s) => (
                  <div key={s.step} className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        transferStep >= s.step
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      {s.step}
                    </div>
                    <span className="text-xs font-medium text-slate-300">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Step 1: Transfer Details */}
              {transferStep === 1 && (
                <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1528] border border-white/10 shadow-2xl">
                  <form onSubmit={handleContinueTransfer} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">From Account</label>
                      <select
                        value={transferFrom}
                        onChange={(e) => setTransferFrom(e.target.value)}
                        className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                      >
                        {accounts.map((a) => (
                          <option key={a.id} value={a.fullNumber} className="bg-[#0A0F1D]">
                            {a.name} ({a.fullNumber}) — ₹{a.balance.toLocaleString('en-IN')}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Receiver Account Number
                      </label>
                      <input
                        type="text"
                        required
                        value={transferTo}
                        onChange={(e) => setTransferTo(e.target.value)}
                        placeholder="e.g. SB-2500119283 (Abhiram) or SB-7791002341"
                        className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Amount (₹)</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Description / Purpose
                      </label>
                      <input
                        type="text"
                        value={transferDesc}
                        onChange={(e) => setTransferDesc(e.target.value)}
                        placeholder="e.g. Project component split, Hostel dues"
                        className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                      />
                    </div>

                    {transferError && (
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{transferError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition cursor-pointer shadow-md mt-2"
                    >
                      Continue to Review
                    </button>
                  </form>
                </div>
              )}

              {/* Step 2: Confirmation */}
              {transferStep === 2 && (
                <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1528] border border-white/10 shadow-2xl space-y-6">
                  <h3 className="text-base font-bold text-white text-center">Confirm Transfer</h3>

                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">From Account:</span>
                      <strong className="text-white font-mono">{transferFrom}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">To Receiver:</span>
                      <strong className="text-white font-mono">{transferTo}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Transfer Amount:</span>
                      <strong className="text-cyan-400 text-sm">
                        ₹{parseFloat(transferAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Description:</span>
                      <strong className="text-slate-200">{transferDesc || 'Standard Fund Transfer'}</strong>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setTransferStep(1)}
                      className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs transition cursor-pointer"
                    >
                      Back / Edit
                    </button>
                    <button
                      onClick={handleConfirmTransfer}
                      className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition cursor-pointer shadow-md"
                    >
                      Confirm Transfer
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Result */}
              {transferStep === 3 && transferResult && (
                <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1528] border border-white/10 shadow-2xl text-center space-y-5">
                  {transferResult.success ? (
                    <>
                      <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Transfer Successful</h3>
                      <p className="text-xs text-slate-300">
                        ₹{transferResult.amount?.toLocaleString('en-IN')} has been debited and transferred.
                      </p>

                      <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-xs space-y-2 text-left">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Transaction ID:</span>
                          <span className="text-cyan-400 font-mono font-semibold">{transferResult.txnId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Date & Time:</span>
                          <span className="text-slate-200">{transferResult.time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Status:</span>
                          <span className="text-emerald-400 font-bold">✓ COMPLETED</span>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => setActiveTab('history')}
                          className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs transition cursor-pointer"
                        >
                          View Transactions
                        </button>
                        <button
                          onClick={() => {
                            setTransferStep(1);
                            setTransferAmount('');
                            setTransferTo('');
                            setTransferDesc('');
                            setActiveTab('overview');
                          }}
                          className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition cursor-pointer shadow-md"
                        >
                          Back to Dashboard
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/30">
                        <AlertCircle className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Transfer Failed</h3>
                      <p className="text-xs text-red-400 leading-relaxed">{transferResult.message}</p>

                      <button
                        onClick={() => setTransferStep(1)}
                        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition cursor-pointer shadow-md"
                      >
                        Try Again
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB: TRANSACTION HISTORY
              ========================================================================= */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Transaction History</h2>
                  <p className="text-xs text-slate-400">Filter, search, and inspect bank account activity</p>
                </div>

                <button
                  onClick={handleExportCSV}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Export Statement (CSV)</span>
                </button>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#0E1528] border border-white/10">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={txSearch}
                    onChange={(e) => setTxSearch(e.target.value)}
                    placeholder="Search by name, ID..."
                    className="w-full bg-black/40 border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <select
                    value={txCategoryFilter}
                    onChange={(e) => setTxCategoryFilter(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="Food">Food</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Bills">Bills</option>
                    <option value="Transport">Transport</option>
                    <option value="Salary">Salary</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <select
                    value={txTypeFilter}
                    onChange={(e) => setTxTypeFilter(e.target.value as any)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  >
                    <option value="ALL">All Types (Debit & Credit)</option>
                    <option value="debit">Debit Only</option>
                    <option value="credit">Credit Only</option>
                  </select>
                </div>

                <div>
                  <select
                    value={txStatusFilter}
                    onChange={(e) => setTxStatusFilter(e.target.value as any)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="SUCCESS">Successful</option>
                    <option value="PENDING">Pending</option>
                    <option value="FAILED">Failed</option>
                  </select>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="p-6 rounded-3xl bg-[#0E1528] border border-white/10 shadow-lg overflow-x-auto">
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    No transactions found matching your filter criteria.
                  </div>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-black/30 text-slate-400 uppercase text-[10px] font-bold border-b border-white/5">
                      <tr>
                        <th className="p-3.5">Txn ID</th>
                        <th className="p-3.5">Date</th>
                        <th className="p-3.5">Description</th>
                        <th className="p-3.5">Category</th>
                        <th className="p-3.5">Type</th>
                        <th className="p-3.5">Amount</th>
                        <th className="p-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredTransactions.map((tx) => (
                        <tr
                          key={tx.id}
                          onClick={() => setSelectedTxDetail(tx)}
                          className="hover:bg-white/5 cursor-pointer transition"
                        >
                          <td className="p-3.5 font-mono text-cyan-400 font-semibold">{tx.id}</td>
                          <td className="p-3.5 text-slate-400">{tx.date}</td>
                          <td className="p-3.5 font-semibold text-white">{tx.name}</td>
                          <td className="p-3.5 text-slate-300">{tx.category}</td>
                          <td className="p-3.5 uppercase font-bold text-[10px]">
                            <span className={tx.type === 'credit' ? 'text-emerald-400' : 'text-slate-300'}>
                              {tx.type}
                            </span>
                          </td>
                          <td className="p-3.5 font-bold tabular-nums">
                            <span className={tx.type === 'credit' ? 'text-emerald-400' : 'text-white'}>
                              {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                tx.status === 'SUCCESS'
                                  ? 'bg-emerald-500/10 text-emerald-400'
                                  : tx.status === 'PENDING'
                                  ? 'bg-amber-500/10 text-amber-400'
                                  : 'bg-red-500/10 text-red-400'
                              }`}
                            >
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: SPENDING ANALYSIS
              ========================================================================= */}
          {activeTab === 'spending' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Spending Analysis</h2>
                <p className="text-xs text-slate-400">
                  Current month category breakdown and database-grounded insights
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-[#0E1528] border border-white/10 shadow-lg md:col-span-2 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white">Category Expenditure (March 2026)</h3>
                    <span className="text-xs text-cyan-400 font-bold">Total: ₹{totalExpenses.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="space-y-4 pt-2">
                    {(['Food', 'Shopping', 'Bills', 'Transport', 'Other'] as const).map((cat) => {
                      const amt = spendingByCategory[cat] || 0;
                      const pct = totalExpenses > 0 ? Math.round((amt / totalExpenses) * 100) : 0;
                      return (
                        <div key={cat} className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold text-slate-200">{cat}</span>
                            <span className="text-slate-400">
                              ₹{amt.toLocaleString('en-IN')} · <strong className="text-cyan-400">{pct}%</strong>
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Grounded Insights Card */}
                <div className="p-6 rounded-3xl bg-[#0E1528] border border-white/10 shadow-lg space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-cyan-400">
                      <Sparkles className="w-4 h-4" />
                      <h4 className="font-bold text-xs uppercase tracking-wider">Intelligent Insights</h4>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-xs text-slate-300 space-y-2">
                      <p>
                        📊 <strong>Highest Category:</strong> Your highest spending category is{' '}
                        <span className="text-amber-400 font-bold">{highestCategoryEntry[0]}</span> (₹{highestCategoryEntry[1].toLocaleString('en-IN')}).
                      </p>
                      <p>
                        📉 <strong>Trend:</strong> Your total discretionary spending is lower than previous month by approximately ₹3,400.
                      </p>
                      <p>
                        🎯 <strong>Budget Health:</strong> You have active budget allocations across 5 categories.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('banko')}
                    className="w-full py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-cyan-300 text-xs font-semibold transition cursor-pointer"
                  >
                    Ask BANKO for Recommendations →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: BUDGET PLANNER
              ========================================================================= */}
          {activeTab === 'budget' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white">Budget Planner</h2>
                  <p className="text-xs text-slate-400">Monthly limits, category caps and warning alerts</p>
                </div>
                <button
                  onClick={() => setIsBudgetModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-md"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Budget</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {budgets.map((b) => {
                  const remaining = Math.max(0, b.limit - b.spent);
                  const pct = Math.min(100, Math.round((b.spent / b.limit) * 100));
                  const isOver = b.spent > b.limit;
                  const isNear = pct >= 80 && !isOver;

                  return (
                    <div
                      key={b.id}
                      className={`p-6 rounded-3xl bg-[#0E1528] border shadow-lg space-y-3 ${
                        isOver
                          ? 'border-red-500/40 bg-red-950/10'
                          : isNear
                          ? 'border-amber-500/30'
                          : 'border-white/10'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-white text-base">{b.category}</h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            isOver
                              ? 'bg-red-500/20 text-red-400'
                              : isNear
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-emerald-500/10 text-emerald-400'
                          }`}
                        >
                          {isOver ? '⚠ Over Budget' : `${pct}% Used`}
                        </span>
                      </div>

                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isOver ? 'bg-red-500' : isNear ? 'bg-amber-400' : 'bg-blue-600'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[11px]">Budget Limit</span>
                          <strong className="text-white">₹{b.limit.toLocaleString('en-IN')}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Total Spent</span>
                          <strong className={isOver ? 'text-red-400' : 'text-slate-200'}>
                            ₹{b.spent.toLocaleString('en-IN')}
                          </strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Remaining</span>
                          <strong className={isOver ? 'text-red-400' : 'text-emerald-400'}>
                            ₹{remaining.toLocaleString('en-IN')}
                          </strong>
                        </div>
                      </div>

                      {isOver && (
                        <div className="p-2 rounded-lg bg-red-500/10 text-red-300 text-[11px] flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>Alert: You have exceeded this category's planned monthly threshold.</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: SAVINGS GOALS
              ========================================================================= */}
          {activeTab === 'savings' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white">Savings Goals</h2>
                  <p className="text-xs text-slate-400">Track progress toward personal milestones and academic goals</p>
                </div>
                <button
                  onClick={() => setIsGoalModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-md"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Goal</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {savingsGoals.map((g) => {
                  const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
                  return (
                    <div
                      key={g.id}
                      className="p-6 rounded-3xl bg-[#0E1528] border border-white/10 shadow-lg space-y-4 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-white text-base">{g.name}</h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              g.status === 'COMPLETED'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-cyan-500/20 text-cyan-300'
                            }`}
                          >
                            {g.status === 'COMPLETED' ? 'COMPLETED' : `${pct}% Done`}
                          </span>
                        </div>

                        {/* Milestone indicators */}
                        <div className="flex justify-between text-[10px] text-slate-400 pt-3">
                          <span className={pct >= 25 ? 'text-cyan-400 font-bold' : ''}>25%</span>
                          <span className={pct >= 50 ? 'text-cyan-400 font-bold' : ''}>50%</span>
                          <span className={pct >= 75 ? 'text-cyan-400 font-bold' : ''}>75%</span>
                          <span className={pct >= 100 ? 'text-emerald-400 font-bold' : ''}>100%</span>
                        </div>

                        <div className="h-2 rounded-full bg-white/10 overflow-hidden mt-1">
                          <div
                            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>

                        <div className="flex justify-between text-xs pt-3">
                          <span className="text-slate-400">Saved: ₹{g.currentAmount.toLocaleString('en-IN')}</span>
                          <span className="text-slate-400">Target: ₹{g.targetAmount.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="text-[11px] text-slate-500 pt-2">Target Date: {g.targetDate}</div>
                      </div>

                      {g.status !== 'COMPLETED' && (
                        <button
                          onClick={() => {
                            setDepositGoalId(g.id);
                            setDepositAmount('1000');
                          }}
                          className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 text-xs font-semibold border border-white/10 transition cursor-pointer mt-2"
                        >
                          + Add Savings Deposit
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: EMI & INTEREST CALCULATOR
              ========================================================================= */}
          {activeTab === 'emi' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white text-center">EMI & Financial Calculators</h2>
                <p className="text-xs text-slate-400 text-center">
                  Academic interactive simulation tools for loan repayment, interest, and savings target planning
                </p>
              </div>

              {/* Calculator Subtabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 p-1 rounded-2xl bg-black/40 border border-white/10 text-xs font-semibold">
                <button
                  onClick={() => setCalcTab('emi')}
                  className={`py-2 rounded-xl transition cursor-pointer ${
                    calcTab === 'emi' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  EMI Calculator
                </button>
                <button
                  onClick={() => setCalcTab('simple')}
                  className={`py-2 rounded-xl transition cursor-pointer ${
                    calcTab === 'simple' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Simple Interest
                </button>
                <button
                  onClick={() => setCalcTab('compound')}
                  className={`py-2 rounded-xl transition cursor-pointer ${
                    calcTab === 'compound' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Compound Interest
                </button>
                <button
                  onClick={() => setCalcTab('target')}
                  className={`py-2 rounded-xl transition cursor-pointer ${
                    calcTab === 'target' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Savings Target
                </button>
              </div>

              {/* Calculator Content */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1528] border border-white/10 shadow-2xl space-y-6">
                {/* 1. EMI Calculator */}
                {calcTab === 'emi' && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                          <span>Principal Loan Amount:</span>
                          <strong className="text-white font-mono">₹{emiPrincipal.toLocaleString('en-IN')}</strong>
                        </div>
                        <input
                          type="range"
                          min="10000"
                          max="2000000"
                          step="10000"
                          value={emiPrincipal}
                          onChange={(e) => setEmiPrincipal(Number(e.target.value))}
                          className="w-full accent-blue-500 cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                          <span>Interest Rate (% per annum):</span>
                          <strong className="text-cyan-400 font-mono">{emiRate}%</strong>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="24"
                          step="0.25"
                          value={emiRate}
                          onChange={(e) => setEmiRate(Number(e.target.value))}
                          className="w-full accent-blue-500 cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                          <span>Tenure (Months):</span>
                          <strong className="text-white font-mono">{emiTenure} Months ({Math.round(emiTenure / 12)} Yrs)</strong>
                        </div>
                        <input
                          type="range"
                          min="6"
                          max="84"
                          step="6"
                          value={emiTenure}
                          onChange={(e) => setEmiTenure(Number(e.target.value))}
                          className="w-full accent-blue-500 cursor-pointer"
                        />
                      </div>
                    </div>

                    {(() => {
                      const res = calculateEMI(emiPrincipal, emiRate, emiTenure);
                      return (
                        <div className="p-5 rounded-2xl bg-black/40 border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                              Monthly EMI
                            </span>
                            <div className="text-2xl font-extrabold text-cyan-400 mt-1 tabular-nums">
                              ₹{res.emi.toLocaleString('en-IN')}
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                              Total Interest
                            </span>
                            <div className="text-lg font-bold text-white mt-1 tabular-nums">
                              ₹{res.totalInterest.toLocaleString('en-IN')}
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                              Total Repayment
                            </span>
                            <div className="text-lg font-bold text-emerald-400 mt-1 tabular-nums">
                              ₹{res.totalPayment.toLocaleString('en-IN')}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* 2. Simple Interest */}
                {calcTab === 'simple' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Principal (₹)</label>
                        <input
                          type="number"
                          value={siPrincipal}
                          onChange={(e) => setSiPrincipal(Number(e.target.value))}
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Rate of Interest (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={siRate}
                          onChange={(e) => setSiRate(Number(e.target.value))}
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Tenure (Years)</label>
                        <input
                          type="number"
                          value={siYears}
                          onChange={(e) => setSiYears(Number(e.target.value))}
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    {(() => {
                      const interest = (siPrincipal * siRate * siYears) / 100;
                      const total = siPrincipal + interest;
                      return (
                        <div className="p-5 rounded-2xl bg-black/40 border border-white/10 grid grid-cols-2 gap-4 text-center">
                          <div>
                            <span className="text-xs text-slate-400 block">Simple Interest</span>
                            <strong className="text-xl text-cyan-400 mt-1 block">₹{Math.round(interest).toLocaleString('en-IN')}</strong>
                          </div>
                          <div>
                            <span className="text-xs text-slate-400 block">Maturity Total Amount</span>
                            <strong className="text-xl text-emerald-400 mt-1 block">₹{Math.round(total).toLocaleString('en-IN')}</strong>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* 3. Compound Interest */}
                {calcTab === 'compound' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Principal (₹)</label>
                        <input
                          type="number"
                          value={ciPrincipal}
                          onChange={(e) => setCiPrincipal(Number(e.target.value))}
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Annual Rate (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={ciRate}
                          onChange={(e) => setCiRate(Number(e.target.value))}
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Years</label>
                        <input
                          type="number"
                          value={ciYears}
                          onChange={(e) => setCiYears(Number(e.target.value))}
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Frequency</label>
                        <select
                          value={ciFreq}
                          onChange={(e) => setCiFreq(Number(e.target.value))}
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                        >
                          <option value="12">Monthly (12/yr)</option>
                          <option value="4">Quarterly (4/yr)</option>
                          <option value="1">Annually (1/yr)</option>
                        </select>
                      </div>
                    </div>

                    {(() => {
                      const r = ciRate / 100;
                      const amount = ciPrincipal * Math.pow(1 + r / ciFreq, ciFreq * ciYears);
                      const interest = amount - ciPrincipal;
                      return (
                        <div className="p-5 rounded-2xl bg-black/40 border border-white/10 grid grid-cols-2 gap-4 text-center">
                          <div>
                            <span className="text-xs text-slate-400 block">Compound Interest</span>
                            <strong className="text-xl text-cyan-400 mt-1 block">₹{Math.round(interest).toLocaleString('en-IN')}</strong>
                          </div>
                          <div>
                            <span className="text-xs text-slate-400 block">Total Accumulated Value</span>
                            <strong className="text-xl text-emerald-400 mt-1 block">₹{Math.round(amount).toLocaleString('en-IN')}</strong>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* 4. Savings Target SIP */}
                {calcTab === 'target' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Target Amount (₹)</label>
                        <input
                          type="number"
                          value={targetGoal}
                          onChange={(e) => setTargetGoal(Number(e.target.value))}
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Time Horizon (Years)</label>
                        <input
                          type="number"
                          value={targetYears}
                          onChange={(e) => setTargetYears(Number(e.target.value))}
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Expected Return (%)</label>
                        <input
                          type="number"
                          step="0.5"
                          value={targetReturnRate}
                          onChange={(e) => setTargetReturnRate(Number(e.target.value))}
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    {(() => {
                      const months = targetYears * 12;
                      const i = targetReturnRate / 100 / 12;
                      const monthlySIP = (targetGoal * i) / (Math.pow(1 + i, months) - 1);
                      return (
                        <div className="p-5 rounded-2xl bg-black/40 border border-white/10 text-center">
                          <span className="text-xs text-slate-400 block">Monthly Contribution Required</span>
                          <strong className="text-3xl text-emerald-400 mt-1 block font-extrabold tabular-nums">
                            ₹{Math.round(monthlySIP).toLocaleString('en-IN')} / month
                          </strong>
                          <span className="text-[11px] text-slate-400 mt-1 block">
                            To reach ₹{targetGoal.toLocaleString('en-IN')} in {targetYears} years at {targetReturnRate}% p.a.
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                )}

                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-slate-400 text-center">
                  Academic financial simulation tool for demonstration only. Does not constitute binding banking underwriting.
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: BANKO AI CHAT
              ========================================================================= */}
          {activeTab === 'banko' && (
            <div className="max-w-4xl mx-auto space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🤖</span>
                  <h2 className="text-xl font-bold text-white">BANKO — Your Smart Banking Assistant</h2>
                </div>
                <p className="text-xs text-slate-400">
                  Ask intelligent questions about your accounts, recent transfers, spending insights, and budgets
                </p>
              </div>

              {/* Quick Questions Chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  "What's my balance?",
                  'Show my recent transactions',
                  'How much did I spend this month?',
                  'Where did I spend the most?',
                  'How much did I save?',
                  'Calculate my EMI',
                  'Explain my spending pattern'
                ].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(q)}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/30 text-xs text-slate-300 hover:text-cyan-300 transition cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Chat Thread Container */}
              <div className="h-[480px] rounded-3xl bg-[#0E1528] border border-white/10 shadow-2xl flex flex-col justify-between overflow-hidden">
                {/* Messages scroll list */}
                <div className="p-6 overflow-y-auto space-y-4 flex-1">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 max-w-[85%] ${
                        msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                          msg.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        }`}
                      >
                        {msg.sender === 'user' ? currentUser.avatarText : '🤖'}
                      </div>

                      <div>
                        <div
                          className={`p-4 rounded-2xl text-xs leading-relaxed ${
                            msg.sender === 'user'
                              ? 'bg-blue-600 text-white rounded-tr-none'
                              : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1 block px-1">{msg.time}</span>
                      </div>
                    </div>
                  ))}

                  {isAiLoading && (
                    <div className="flex gap-3 max-w-[85%]">
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30">
                        🤖
                      </div>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-cyan-300 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                        <span>BANKO is analyzing your banking data...</span>
                      </div>
                    </div>
                  )}
                  <div ref={chatScrollRef} />
                </div>

                {/* Chat Input Bar */}
                <div className="p-4 border-t border-white/10 bg-black/30">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask BANKO about balances, spending, budgets or banking..."
                      className="flex-1 bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                    />

                    <button
                      type="button"
                      onClick={toggleVoiceInput}
                      className={`p-3 rounded-xl border transition cursor-pointer ${
                        isVoiceActive
                          ? 'bg-red-500 text-white border-red-500 animate-pulse'
                          : 'bg-white/5 text-slate-300 border-white/10'
                      }`}
                      title="Voice Speech Input"
                    >
                      {isVoiceActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsTtsEnabled(!isTtsEnabled)}
                      className={`p-3 rounded-xl border transition cursor-pointer ${
                        isTtsEnabled
                          ? 'bg-white/5 text-cyan-400 border-white/10'
                          : 'bg-white/5 text-slate-500 border-white/10'
                      }`}
                      title={isTtsEnabled ? 'Voice Output Enabled' : 'Voice Output Muted'}
                    >
                      {isTtsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </button>

                    <button
                      type="submit"
                      disabled={!chatInput.trim() || isAiLoading}
                      className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: NOTIFICATIONS
              ========================================================================= */}
          {activeTab === 'notifications' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white">Notifications</h2>
                  <p className="text-xs text-slate-400">Account alerts, transfer confirmations and system notes</p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllNotificationsRead}
                    className="text-xs text-cyan-400 font-semibold hover:underline cursor-pointer"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 rounded-2xl border transition ${
                      n.read
                        ? 'bg-[#0E1528]/60 border-white/5 text-slate-400'
                        : 'bg-[#0E1528] border-cyan-500/30 text-white'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            n.type === 'success'
                              ? 'bg-emerald-400'
                              : n.type === 'warning'
                              ? 'bg-amber-400'
                              : 'bg-cyan-400'
                          }`}
                        />
                        <h4 className="font-bold text-xs">{n.title}</h4>
                      </div>
                      <span className="text-[10px] text-slate-500">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 pl-4 leading-relaxed">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: SETTINGS & PROFILE
              ========================================================================= */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Profile & Security Settings</h2>
                <p className="text-xs text-slate-400">Manage account information, credentials, and notification preferences</p>
              </div>

              {/* Profile Details */}
              <div className="p-6 rounded-3xl bg-[#0E1528] border border-white/10 space-y-4 shadow-lg">
                <h3 className="text-sm font-bold text-white">User Information</h3>
                <div className="space-y-3 text-xs divide-y divide-white/5">
                  <div className="flex justify-between py-2">
                    <span className="text-slate-400">Full Name:</span>
                    <strong className="text-white">{currentUser.name}</strong>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-400">Email Address:</span>
                    <strong className="text-white">{currentUser.email}</strong>
                  </div>
                  {currentUser.rollNumber && (
                    <div className="flex justify-between py-2">
                      <span className="text-slate-400">Roll Number:</span>
                      <strong className="text-cyan-400 font-mono">{currentUser.rollNumber}</strong>
                    </div>
                  )}
                  <div className="flex justify-between py-2">
                    <span className="text-slate-400">Branch:</span>
                    <strong className="text-cyan-300 font-semibold">{currentUser.branch || 'CSE (Data Science)'}</strong>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-400">Department:</span>
                    <strong className="text-slate-200">{currentUser.department || 'Computer Science & Engineering (Data Science)'}</strong>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-400">Institution:</span>
                    <strong className="text-slate-200">{currentUser.institution || 'Marri Laxman Reddy Institute of Technology (MLRIT)'}</strong>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-400">Phone:</span>
                    <strong className="text-white">{currentUser.phone}</strong>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-400">Access Role:</span>
                    <span className="font-bold text-cyan-400">STUDENT / USER</span>
                  </div>
                </div>
              </div>

              {/* Security & Password */}
              <div className="p-6 rounded-3xl bg-[#0E1528] border border-white/10 space-y-4 shadow-lg">
                <h3 className="text-sm font-bold text-white">Security & Password</h3>
                <p className="text-xs text-slate-400">
                  Password hashes are securely stored with BCrypt in the Spring Boot database.
                </p>

                <button
                  onClick={() => setIsChangePasswordOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition cursor-pointer shadow-md"
                >
                  Change Password
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ──────────────────────────────────────────────────────────
          MODALS
          ────────────────────────────────────────────────────────── */}

      {/* Account Details Modal */}
      {selectedAccount && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#0E1528] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider">
                  {selectedAccount.type}
                </span>
                <h3 className="text-lg font-bold text-white">{selectedAccount.name}</h3>
              </div>
              <button
                onClick={() => setSelectedAccount(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Account Number:</span>
                <strong className="text-white font-mono">{selectedAccount.fullNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Account Status:</span>
                <span className="text-emerald-400 font-bold">✓ {selectedAccount.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Current Balance:</span>
                <strong className="text-white">₹{selectedAccount.balance.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Created Date:</span>
                <strong className="text-slate-300">{selectedAccount.createdDate}</strong>
              </div>
            </div>

            <button
              onClick={() => setSelectedAccount(null)}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Transaction Detail Modal */}
      {selectedTxDetail && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#0E1528] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider">
                  Transaction Receipt
                </span>
                <h3 className="text-base font-bold text-white">{selectedTxDetail.name}</h3>
              </div>
              <button
                onClick={() => setSelectedTxDetail(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Transaction ID:</span>
                <strong className="text-cyan-400 font-mono">{selectedTxDetail.id}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount:</span>
                <strong className={selectedTxDetail.type === 'credit' ? 'text-emerald-400' : 'text-white'}>
                  ₹{selectedTxDetail.amount.toLocaleString('en-IN')} ({selectedTxDetail.type.toUpperCase()})
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Category:</span>
                <strong className="text-slate-200">{selectedTxDetail.category}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date & Time:</span>
                <strong className="text-slate-200">{selectedTxDetail.date}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Reference:</span>
                <strong className="text-slate-400 font-mono text-[11px]">{selectedTxDetail.reference}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="text-emerald-400 font-bold">✓ {selectedTxDetail.status}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedTxDetail(null)}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Create Budget Modal */}
      {isBudgetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#0E1528] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white">Create Monthly Budget</h3>
              <button onClick={() => setIsBudgetModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const limit = parseFloat(newBudgetLimit);
                if (limit > 0) {
                  onCreateBudget(newBudgetCategory, limit);
                  setIsBudgetModalOpen(false);
                  setNewBudgetLimit('');
                  showToast(`Budget for ${newBudgetCategory} set to ₹${limit.toLocaleString('en-IN')}`);
                }
              }}
              className="space-y-4 pt-2"
            >
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                <select
                  value={newBudgetCategory}
                  onChange={(e) => setNewBudgetCategory(e.target.value as any)}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
                >
                  <option value="Food">Food & Dining</option>
                  <option value="Shopping">Shopping & Lifestyle</option>
                  <option value="Travel">Travel & Transit</option>
                  <option value="Bills">Bills & Utilities</option>
                  <option value="Other">Other Expenses</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Monthly Limit (₹)</label>
                <input
                  type="number"
                  required
                  min="100"
                  value={newBudgetLimit}
                  onChange={(e) => setNewBudgetLimit(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBudgetModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md"
                >
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Goal Modal */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#0E1528] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white">Create Savings Goal</h3>
              <button onClick={() => setIsGoalModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const target = parseFloat(newGoalAmount);
                if (newGoalName.trim() && target > 0) {
                  onCreateSavingsGoal(newGoalName.trim(), target, newGoalDate || 'December 2026');
                  setIsGoalModalOpen(false);
                  setNewGoalName('');
                  setNewGoalAmount('');
                  showToast(`Savings Goal "${newGoalName}" created!`);
                }
              }}
              className="space-y-4 pt-2"
            >
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Goal Name</label>
                <input
                  type="text"
                  required
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  placeholder="e.g. Capstone Research Fund"
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Target Amount (₹)</label>
                <input
                  type="number"
                  required
                  min="500"
                  value={newGoalAmount}
                  onChange={(e) => setNewGoalAmount(e.target.value)}
                  placeholder="e.g. 50000"
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Target Date</label>
                <input
                  type="text"
                  value={newGoalDate}
                  onChange={(e) => setNewGoalDate(e.target.value)}
                  placeholder="e.g. November 2026"
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGoalModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Savings Deposit Modal */}
      {depositGoalId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#0E1528] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white">Deposit to Savings Goal</h3>
              <button onClick={() => setDepositGoalId(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const amt = parseFloat(depositAmount);
                if (amt > 0) {
                  onAddSavingsDeposit(depositGoalId, amt);
                  setDepositGoalId(null);
                  setDepositAmount('');
                  showToast(`Deposited ₹${amt.toLocaleString('en-IN')} to savings goal.`);
                }
              }}
              className="space-y-4 pt-2"
            >
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Deposit Amount (₹)</label>
                <input
                  type="number"
                  required
                  min="100"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="e.g. 2000"
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDepositGoalId(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md"
                >
                  Deposit Funds
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#0E1528] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white">Change Account Password</h3>
              <button onClick={() => setIsChangePasswordOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPassError(null);
                if (!currPass || !newPass) {
                  setPassError('Please complete all required fields.');
                  return;
                }
                if (newPass.length < 6) {
                  setPassError('New password must be at least 6 characters.');
                  return;
                }
                if (newPass !== confPass) {
                  setPassError('New password confirmation does not match.');
                  return;
                }
                setIsChangePasswordOpen(false);
                setCurrPass('');
                setNewPass('');
                setConfPass('');
                showToast('Password updated successfully.');
              }}
              className="space-y-3.5 pt-2"
            >
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currPass}
                  onChange={(e) => setCurrPass(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Enter new secure password"
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confPass}
                  onChange={(e) => setConfPass(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              {passError && (
                <div className="p-2.5 rounded-lg bg-red-500/10 text-red-400 text-xs">{passError}</div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
