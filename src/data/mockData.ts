/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
} from '../types/banking';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'u-1',
    name: 'Vamshi Krishna',
    email: '25r21a67b5@mlrit.ac.in',
    phone: '+91 9876543210',
    role: 'USER',
    avatarText: 'VK',
    status: 'ACTIVE',
    joinedDate: '2025-08-14',
    accountCount: 2,
    rollNumber: '25R21A67B5',
    branch: 'CSE (Data Science)',
    department: 'Department of Computer Science and Engineering (Data Science)',
    institution: 'Marri Laxman Reddy Institute of Technology (MLRIT)'
  },
  {
    id: 'adm-1',
    name: 'Abhiram (Admin)',
    email: '25r21a67A0@mlrit.ac.in',
    phone: '+91 9876543211',
    role: 'ADMIN',
    avatarText: 'AB',
    status: 'ACTIVE',
    joinedDate: '2025-07-01',
    accountCount: 1,
    rollNumber: '25R21A67A0',
    branch: 'CSE (Data Science)',
    department: 'Department of Computer Science and Engineering (Data Science)',
    institution: 'Marri Laxman Reddy Institute of Technology (MLRIT)'
  },
  {
    id: 'u-2',
    name: 'Priyanshu',
    email: '25r21a6779@mlrit.ac.in',
    phone: '+91 9876543212',
    role: 'USER',
    avatarText: 'PR',
    status: 'ACTIVE',
    joinedDate: '2025-08-20',
    accountCount: 1,
    rollNumber: '25R21A6779',
    branch: 'CSE (Data Science)',
    department: 'Department of Computer Science and Engineering (Data Science)',
    institution: 'Marri Laxman Reddy Institute of Technology (MLRIT)'
  },
  {
    id: 'u-3',
    name: 'Dr. K. Srinivas Rao',
    email: 'srinivas.rao@mlrit.ac.in',
    phone: '+91 9440112233',
    role: 'USER',
    avatarText: 'SR',
    status: 'ACTIVE',
    joinedDate: '2025-09-02',
    accountCount: 2
  },
  {
    id: 'u-4',
    name: 'Rohit Sharma',
    email: 'rohit.sharma@gmail.com',
    phone: '+91 9123456789',
    role: 'USER',
    avatarText: 'RS',
    status: 'SUSPENDED',
    joinedDate: '2025-09-18',
    accountCount: 1
  }
];

export const INITIAL_ACCOUNTS: BankAccount[] = [
  {
    id: 'acc-1',
    userId: 'u-1',
    userName: 'Vamshi Krishna',
    name: 'Savings Account',
    number: '•••• 4192',
    fullNumber: 'SB-4192881052',
    balance: 45250.0,
    type: 'Savings Account',
    status: 'ACTIVE',
    createdDate: '2025-08-15',
    currency: 'INR'
  },
  {
    id: 'acc-2',
    userId: 'u-1',
    userName: 'Vamshi Krishna',
    name: 'Current Account',
    number: '•••• 8821',
    fullNumber: 'CA-8821004921',
    balance: 120000.0,
    type: 'Current Account',
    status: 'ACTIVE',
    createdDate: '2025-09-01',
    currency: 'INR'
  },
  {
    id: 'acc-3',
    userId: 'u-2',
    userName: 'Priyanshu',
    name: 'Student Savings',
    number: '•••• 7791',
    fullNumber: 'SB-7791002341',
    balance: 28400.0,
    type: 'Savings Account',
    status: 'ACTIVE',
    createdDate: '2025-08-20',
    currency: 'INR'
  },
  {
    id: 'acc-4',
    userId: 'u-3',
    userName: 'Dr. K. Srinivas Rao',
    name: 'Faculty Salary Account',
    number: '•••• 3320',
    fullNumber: 'SB-3320881900',
    balance: 215000.0,
    type: 'Savings Account',
    status: 'ACTIVE',
    createdDate: '2025-09-02',
    currency: 'INR'
  },
  {
    id: 'acc-5',
    userId: 'u-4',
    userName: 'Rohit Sharma',
    name: 'Standard Savings',
    number: '•••• 9912',
    fullNumber: 'SB-9912003819',
    balance: 8200.0,
    type: 'Savings Account',
    status: 'FROZEN',
    createdDate: '2025-09-18',
    currency: 'INR'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-9021',
    userId: 'u-1',
    userName: 'Vamshi Krishna',
    accountNumber: '•••• 4192',
    accountType: 'Savings Account',
    name: 'Campus Cafeteria & Dining',
    category: 'Food',
    date: '2026-03-28 13:15',
    amount: 350.0,
    type: 'debit',
    status: 'SUCCESS',
    reference: 'UPI/REF/9021882'
  },
  {
    id: 'TXN-9020',
    userId: 'u-1',
    userName: 'Vamshi Krishna',
    accountNumber: '•••• 4192',
    accountType: 'Savings Account',
    name: 'Amazon Academic Textbook',
    category: 'Shopping',
    date: '2026-03-27 16:40',
    amount: 1250.0,
    type: 'debit',
    status: 'SUCCESS',
    reference: 'PG/AMZ/449102'
  },
  {
    id: 'TXN-9019',
    userId: 'u-1',
    userName: 'Vamshi Krishna',
    accountNumber: '•••• 4192',
    accountType: 'Savings Account',
    name: 'College Semester Fee Stipend',
    category: 'Salary',
    date: '2026-03-25 09:30',
    amount: 15000.0,
    type: 'credit',
    status: 'SUCCESS',
    reference: 'NEFT/MLRIT/00912'
  },
  {
    id: 'TXN-9018',
    userId: 'u-1',
    userName: 'Vamshi Krishna',
    accountNumber: '•••• 8821',
    accountType: 'Current Account',
    name: 'Hostel Electricity & Wi-Fi',
    category: 'Bills',
    date: '2026-03-22 18:20',
    amount: 850.0,
    type: 'debit',
    status: 'SUCCESS',
    reference: 'BBPS/TSSPDCL/881'
  },
  {
    id: 'TXN-9017',
    userId: 'u-1',
    userName: 'Vamshi Krishna',
    accountNumber: '•••• 4192',
    accountType: 'Savings Account',
    name: 'Hyderabad Metro Transit Pass',
    category: 'Transport',
    date: '2026-03-20 08:45',
    amount: 500.0,
    type: 'debit',
    status: 'SUCCESS',
    reference: 'METRO/HYD/77102'
  },
  {
    id: 'TXN-9016',
    userId: 'u-1',
    userName: 'Vamshi Krishna',
    accountNumber: '•••• 4192',
    accountType: 'Savings Account',
    name: 'Transfer to Abhiram (Project Expenses)',
    category: 'Other',
    date: '2026-03-18 11:10',
    amount: 2000.0,
    type: 'debit',
    status: 'SUCCESS',
    reference: 'IMPS/SBA/661902'
  },
  {
    id: 'TXN-9015',
    userId: 'u-1',
    userName: 'Vamshi Krishna',
    accountNumber: '•••• 4192',
    accountType: 'Savings Account',
    name: 'Peer Transfer from Priyanshu',
    category: 'Other',
    date: '2026-03-15 14:05',
    amount: 1200.0,
    type: 'credit',
    status: 'SUCCESS',
    reference: 'UPI/PRIY/11094'
  },
  {
    id: 'TXN-9014',
    userId: 'u-1',
    userName: 'Vamshi Krishna',
    accountNumber: '•••• 8821',
    accountType: 'Current Account',
    name: 'Online Cloud Server Subscription',
    category: 'Bills',
    date: '2026-03-10 19:30',
    amount: 1499.0,
    type: 'debit',
    status: 'FAILED',
    reference: 'SUB/CLOUD/9901'
  }
];

export const INITIAL_TRANSFERS: TransferRecord[] = [
  {
    id: 'TRF-1001',
    senderName: 'Vamshi Krishna',
    senderAccount: 'SB-4192881052',
    receiverName: 'Abhiram',
    receiverAccount: 'SB-2500119283',
    amount: 2000.0,
    date: '2026-03-18 11:10',
    reference: 'IMPS/SBA/661902',
    description: 'Hardware Lab Components',
    status: 'SUCCESS'
  },
  {
    id: 'TRF-1002',
    senderName: 'Priyanshu',
    senderAccount: 'SB-7791002341',
    receiverName: 'Vamshi Krishna',
    receiverAccount: 'SB-4192881052',
    amount: 1200.0,
    date: '2026-03-15 14:05',
    reference: 'UPI/PRIY/11094',
    description: 'Project Book Share',
    status: 'SUCCESS'
  },
  {
    id: 'TRF-1003',
    senderName: 'Vamshi Krishna',
    senderAccount: 'CA-8821004921',
    receiverName: 'College Book Depository',
    receiverAccount: 'SB-9988112233',
    amount: 4500.0,
    date: '2026-03-05 10:20',
    reference: 'NEFT/SBA/448102',
    description: 'Reference Textbooks & Lab Kits',
    status: 'SUCCESS'
  },
  {
    id: 'TRF-1004',
    senderName: 'Rohit Sharma',
    senderAccount: 'SB-9912003819',
    receiverName: 'Unknown External Wallet',
    receiverAccount: 'WL-00991122',
    amount: 50000.0,
    date: '2026-03-02 23:45',
    reference: 'FLAG/TRF/00918',
    description: 'Suspicious Midnight Wire',
    status: 'FAILED'
  }
];

export const INITIAL_BUDGETS: BudgetCategory[] = [
  { id: 'b-1', category: 'Food', limit: 7000, spent: 4950, month: 'March 2026' },
  { id: 'b-2', category: 'Shopping', limit: 6000, spent: 6500, month: 'March 2026' }, // Over budget warning
  { id: 'b-3', category: 'Travel', limit: 3000, spent: 1800, month: 'March 2026' },
  { id: 'b-4', category: 'Bills', limit: 4000, spent: 2350, month: 'March 2026' },
  { id: 'b-5', category: 'Other', limit: 5000, spent: 2000, month: 'March 2026' }
];

export const INITIAL_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: 'sg-1',
    name: 'Laptop Fund (MLRIT Project)',
    targetAmount: 60000,
    currentAmount: 35000,
    targetDate: 'December 2026',
    status: 'IN_PROGRESS',
    category: 'Electronics'
  },
  {
    id: 'sg-2',
    name: 'Emergency Buffer Fund',
    targetAmount: 25000,
    currentAmount: 20000,
    targetDate: 'August 2026',
    status: 'IN_PROGRESS',
    category: 'Safety'
  },
  {
    id: 'sg-3',
    name: 'Cloud Certification Exam',
    targetAmount: 15000,
    currentAmount: 15000,
    targetDate: 'March 2026',
    status: 'COMPLETED',
    category: 'Education'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n-1',
    title: 'Transfer Successful',
    message: '₹2,000 transferred to Abhiram for Hardware Lab Components.',
    time: '2 hours ago',
    category: 'Transactions',
    read: false,
    type: 'success'
  },
  {
    id: 'n-2',
    title: 'Budget Alert',
    message: 'Your Shopping budget is over limit (₹6,500 spent of ₹6,000 limit).',
    time: '5 hours ago',
    category: 'System',
    read: false,
    type: 'warning'
  },
  {
    id: 'n-3',
    title: 'Security Notice',
    message: 'New session initiated via Spring Boot Authentication API.',
    time: '1 day ago',
    category: 'Security',
    read: true,
    type: 'info'
  },
  {
    id: 'n-4',
    title: 'BANKO Feature Update',
    message: 'BANKO AI financial insights updated with automated category breakdown.',
    time: '2 days ago',
    category: 'System',
    read: true,
    type: 'info'
  }
];

export const INITIAL_COMPLAINTS: ComplaintTicket[] = [
  {
    id: 'cmp-1',
    ticketNumber: 'SBA-TKT-2026-081',
    userName: 'Vamshi Krishna',
    userEmail: '25r21a67b5@mlrit.ac.in',
    category: 'Technical',
    subject: 'Delayed SMS notification on UPI credit',
    description: 'Received ₹1,200 peer transfer on March 15 but confirmation notification was delayed by 10 minutes.',
    priority: 'LOW',
    status: 'RESOLVED',
    createdAt: '2026-03-15 15:00',
    updatedAt: '2026-03-16 09:30',
    resolutionNotes: 'Notification queue delay resolved with Spring Boot asynchronous task executor.'
  },
  {
    id: 'cmp-2',
    ticketNumber: 'SBA-TKT-2026-082',
    userName: 'Priyanshu',
    userEmail: '25r21a6779@mlrit.ac.in',
    category: 'Transfer',
    subject: 'Refund status for failed subscription billing',
    description: 'Transaction failed at merchant terminal but amount was momentarily held in processing state.',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    createdAt: '2026-03-24 11:20',
    updatedAt: '2026-03-24 14:10',
    resolutionNotes: 'Under verification with payment gateway clearing gateway.'
  },
  {
    id: 'cmp-3',
    ticketNumber: 'SBA-TKT-2026-083',
    userName: 'Rohit Sharma',
    userEmail: 'rohit.sharma@gmail.com',
    category: 'Account',
    subject: 'Account frozen notification inquiry',
    description: 'Cannot initiate outward wire transfer after midnight security trigger.',
    priority: 'HIGH',
    status: 'OPEN',
    createdAt: '2026-03-27 10:15',
    updatedAt: '2026-03-27 10:15'
  }
];

export const INITIAL_LOANS: LoanApplication[] = [
  {
    id: 'ln-101',
    applicantName: 'Vamshi Krishna',
    applicantEmail: '25r21a67b5@mlrit.ac.in',
    loanType: 'Education Loan',
    amount: 150000,
    interestRate: 8.5,
    tenureMonths: 36,
    monthlyEmi: 4735,
    appliedDate: '2026-02-10',
    status: 'APPROVED',
    remarks: 'Approved for MLRIT Academic Final Year Capstone Project grant.'
  },
  {
    id: 'ln-102',
    applicantName: 'Priyanshu',
    applicantEmail: '25r21a6779@mlrit.ac.in',
    loanType: 'Personal Loan',
    amount: 50000,
    interestRate: 11.5,
    tenureMonths: 12,
    monthlyEmi: 4431,
    appliedDate: '2026-03-15',
    status: 'UNDER_REVIEW',
    remarks: 'Pending student ID and guarantor verification.'
  },
  {
    id: 'ln-103',
    applicantName: 'Dr. K. Srinivas Rao',
    applicantEmail: 'srinivas.rao@mlrit.ac.in',
    loanType: 'Home Loan',
    amount: 2500000,
    interestRate: 8.25,
    tenureMonths: 180,
    monthlyEmi: 24268,
    appliedDate: '2026-01-20',
    status: 'ACTIVE',
    remarks: 'Active EMI debited monthly from Faculty Salary Account.'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-1',
    timestamp: '2026-03-28 10:14:02',
    adminName: 'Abhiram (Admin)',
    action: 'ADMIN_LOGIN',
    target: 'System Console',
    result: 'SUCCESS',
    details: 'Admin authentication validated via Spring Security session.'
  },
  {
    id: 'aud-2',
    timestamp: '2026-03-27 11:30:15',
    adminName: 'Abhiram (Admin)',
    action: 'ACCOUNT_FROZEN',
    target: 'Account SB-9912003819 (Rohit Sharma)',
    result: 'WARNING',
    details: 'Triggered security freeze due to irregular midnight wire attempt.'
  },
  {
    id: 'aud-3',
    timestamp: '2026-03-26 15:45:00',
    adminName: 'Abhiram (Admin)',
    action: 'LOAN_APPROVED',
    target: 'Loan LN-101 (Vamshi Krishna)',
    result: 'SUCCESS',
    details: 'Academic Education Loan ₹1,50,000 sanctioned at 8.5% p.a.'
  },
  {
    id: 'aud-4',
    timestamp: '2026-03-25 14:10:22',
    adminName: 'Abhiram (Admin)',
    action: 'COMPLAINT_RESOLVED',
    target: 'Ticket SBA-TKT-2026-081',
    result: 'SUCCESS',
    details: 'SMS notification delay resolved in message broker queue.'
  },
  {
    id: 'aud-5',
    timestamp: '2026-03-20 09:00:10',
    adminName: 'Abhiram (Admin)',
    action: 'SYSTEM_SETTING_CHANGED',
    target: 'Daily Transfer Limit',
    result: 'SUCCESS',
    details: 'Updated daily student account transfer limit to ₹1,00,000.'
  }
];

export const INITIAL_SETTINGS: SystemSettingsConfig = {
  dailyTransferLimit: 100000,
  perTransactionLimit: 50000,
  maintenanceMode: false,
  systemAnnouncements: 'Smart Banking Assistant 2.0: Java Spring Boot & MySQL academic release active.',
  supportEmail: 'support@smartbanking.mlrit.ac.in',
  transactionNotifications: true,
  securityAlerts: true,
  twoFactorRequirement: false
};
