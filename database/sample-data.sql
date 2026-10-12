-- =====================================================================
-- SMART BANKING ASSISTANT (Sample Demonstration Data)
-- Academic Project by MLRIT Students:
--   Vamshi Krishna (25R21A67B5)
--   Abhiram (25R21A67A0)
--   Priyanshu (25R21A6779)
-- =====================================================================

USE smart_banking_db;

-- 1. SEED DEMO USERS
-- (Passwords are BCrypt hashed for production, or demo strings)
INSERT INTO users (id, name, email, phone, password, role) VALUES
(1, 'Vamshi Krishna', '25r21a67b5@mlrit.ac.in', '+91 9876543210', '$2a$10$e7K9h90M.x25qWdF9f2Qle99HkZ.sM3XQ2W1/4jD/Xz7V5B8uU0yO', 'USER'),
(2, 'System Administrator', 'admin.supervisor@smartbanking.org', '+91 9876543200', '$2a$10$e7K9h90M.x25qWdF9f2Qle99HkZ.sM3XQ2W1/4jD/Xz7V5B8uU0yO', 'ADMIN');

-- 2. SEED ACCOUNTS FOR VAMSHI KRISHNA
INSERT INTO accounts (id, user_id, account_number, account_type, balance, status) VALUES
(1, 1, 'SB-4192881052', 'Savings Account', 45250.00, 'ACTIVE'),
(2, 1, 'CA-8821903411', 'Current Account', 120000.00, 'ACTIVE');

-- 3. SEED TRANSACTIONS
INSERT INTO transactions (account_id, type, category, amount, description, status) VALUES
(1, 'CREDIT', 'Salary', 45000.00, 'Monthly Salary Credited', 'SUCCESS'),
(1, 'DEBIT', 'Food', 2500.00, 'Grocery Supermarket & Meals', 'SUCCESS'),
(1, 'DEBIT', 'Shopping', 3200.00, 'Clothing & Retail Store', 'SUCCESS'),
(1, 'DEBIT', 'Bills', 1500.00, 'Electricity & Utility Bill', 'SUCCESS'),
(1, 'DEBIT', 'Transport', 1200.00, 'Fuel & Metro Travel', 'SUCCESS'),
(1, 'DEBIT', 'Food', 1800.00, 'Weekend Dining', 'SUCCESS'),
(2, 'CREDIT', 'Other', 25000.00, 'Client Project Settlement', 'SUCCESS');

-- 4. SEED BUDGETS
INSERT INTO budgets (user_id, category, monthly_limit, amount_spent, month) VALUES
(1, 'Food', 6000.00, 4300.00, 'October 2026'),
(1, 'Shopping', 5000.00, 3200.00, 'October 2026'),
(1, 'Bills', 3000.00, 1500.00, 'October 2026'),
(1, 'Transport', 2000.00, 1200.00, 'October 2026');

-- 5. SEED SAVINGS GOALS
INSERT INTO savings_goals (user_id, goal_name, target_amount, current_amount, target_date, status) VALUES
(1, 'Emergency Fund', 50000.00, 32500.00, '2026-12-31', 'IN_PROGRESS'),
(1, 'New Laptop', 65000.00, 24000.00, '2027-03-31', 'IN_PROGRESS'),
(1, 'Certifications & Education', 15000.00, 15000.00, '2026-09-30', 'COMPLETED');

-- 6. SEED LOANS (FOR EMI TRACKING)
INSERT INTO loans (user_id, loan_type, principal_amount, interest_rate, tenure, emi, status) VALUES
(1, 'Personal Loan', 100000.00, 10.50, 24, 4638.00, 'ACTIVE');
