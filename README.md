# Smart Banking Assistant — Powered by BANKO

An intelligent, secure digital banking platform conceptualized, architected, and developed by Computer Science & Engineering (Data Science) students at Marri Laxman Reddy Institute of Technology (MLRIT).

## Developed by MLRIT CSE (Data Science) Students
- **Vamshi Krishna** (Roll: 25R21A67B5) — Department: CSE (Data Science) — `25r21a67b5@mlrit.ac.in`
- **Abhiram** (Roll: 25R21A67A0) — Department: CSE (Data Science) — `25r21a67A0@mlrit.ac.in`
- **Priyanshu** (Roll: 25R21A6779) — Department: CSE (Data Science) — `25r21a6779@mlrit.ac.in`

---

## Architecture Overview
```text
FRONTEND (React + Vite + Tailwind CSS)
        │
        │ REST APIs
        ↓
BACKEND (Java 17 + Spring Boot + Spring Data JPA + Spring Security)
        │
        ↓
DATABASE (MySQL)
```

---

## Core Features
1. **Smart Dashboard**: Real-time account balances, monthly income, expenses, and transaction logs.
2. **Money Transfer**: Inter-account and recipient transfers with validation, balance checks, and status tracking.
3. **Spending Analysis**: Categorized breakdown of monthly expenditures (Food, Shopping, Bills, Transport, etc.).
4. **Budget Planner**: Monthly category budgeting with spending warnings.
5. **Savings Goals**: Visual progress tracking towards goals (Emergency Fund, New Laptop, Education).
6. **EMI & Interest Calculator**: Interactive loan EMI, total interest, and repayment schedules.
7. **BANKO AI Assistant**: Conversational banking assistance for spending queries, balance reviews, and insights.
8. **Security & Role-Based Access**: Role-based access for User and Admin portals with protected banking data.

---

## Project Structure
```text
SMART-BANKING-ASSISTANT/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/mlrit/sba/
│       ├── SmartBankingAssistantApplication.java
│       ├── controller/
│       ├── service/
│       ├── repository/
│       ├── model/
│       └── config/
├── database/
│   ├── schema.sql
│   └── sample-data.sql
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── server.ts
├── package.json
└── README.md
```

---

## Running the Application

### 1. Database Setup
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/sample-data.sql
```

### 2. Frontend & Node API
```bash
npm install
npm run dev
```

### 3. Java Spring Boot Backend (Optional standalone)
```bash
cd backend
mvn clean spring-boot:run
```
