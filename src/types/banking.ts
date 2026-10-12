/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'USER' | 'ADMIN';
  avatarText: string;
  avatarUrl?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'LOCKED';
  joinedDate: string;
  accountCount: number;
  branch?: string;
  department?: string;
  rollNumber?: string;
  institution?: string;
}

export interface BankAccount {
  id: string;
  userId: string;
  userName: string;
  name: string;
  number: string;
  fullNumber: string;
  balance: number;
  type: 'Savings Account' | 'Current Account';
  status: 'ACTIVE' | 'DORMANT' | 'FROZEN';
  createdDate: string;
  currency: string;
}

export interface Transaction {
  id: string;
  userId: string;
  userName?: string;
  accountNumber: string;
  accountType: string;
  name: string;
  category: 'Salary' | 'Food' | 'Shopping' | 'Bills' | 'Transport' | 'Other';
  date: string;
  amount: number;
  type: 'credit' | 'debit';
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  reference: string;
}

export interface TransferRecord {
  id: string;
  senderName: string;
  senderAccount: string;
  receiverName: string;
  receiverAccount: string;
  amount: number;
  date: string;
  reference: string;
  description: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'CANCELLED';
}

export interface BudgetCategory {
  id: string;
  category: 'Food' | 'Shopping' | 'Travel' | 'Bills' | 'Other';
  limit: number;
  spent: number;
  month: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
  category: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  category: 'Transactions' | 'Security' | 'System';
  read: boolean;
  type: 'success' | 'warning' | 'info' | 'danger';
}

export interface ComplaintTicket {
  id: string;
  ticketNumber: string;
  userName: string;
  userEmail: string;
  category: 'Transfer' | 'Account' | 'Card' | 'Technical' | 'Other';
  subject: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
  resolutionNotes?: string;
}

export interface LoanApplication {
  id: string;
  applicantName: string;
  applicantEmail: string;
  loanType: 'Personal Loan' | 'Home Loan' | 'Education Loan' | 'Auto Loan';
  amount: number;
  interestRate: number;
  tenureMonths: number;
  monthlyEmi: number;
  appliedDate: string;
  status: 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'COMPLETED';
  remarks?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminName: string;
  action:
    | 'ADMIN_LOGIN'
    | 'USER_SUSPENDED'
    | 'USER_ACTIVATED'
    | 'ACCOUNT_FROZEN'
    | 'ACCOUNT_UNFROZEN'
    | 'LOAN_APPROVED'
    | 'LOAN_REJECTED'
    | 'COMPLAINT_RESOLVED'
    | 'SYSTEM_SETTING_CHANGED'
    | 'GLOBAL_WIRE_FREEZE';
  target: string;
  result: 'SUCCESS' | 'FAILURE' | 'WARNING';
  details: string;
}

export interface SystemSettingsConfig {
  dailyTransferLimit: number;
  perTransactionLimit: number;
  maintenanceMode: boolean;
  systemAnnouncements: string;
  supportEmail: string;
  transactionNotifications: boolean;
  securityAlerts: boolean;
  twoFactorRequirement: boolean;
}
