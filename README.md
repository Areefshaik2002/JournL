# 📓 JournL — Life Journal Application

> *Capture your day in less than five minutes.*

**JournL** is a modern full-stack journaling web application built to record daily thoughts, moods, and experiences. Built with React 19, TypeScript, Tailwind CSS v4, Express v5, and Amazon DynamoDB.

---

## 🚀 Features Implemented

- **🔐 Authentication**: Registration, Login, Logout, JWT HttpOnly cookie session management, Protected Routes, and Persistent Login.
- **📊 Dashboard**: Dynamic welcome screen, active writing streak calculator, total entries metric, today's completion status, quick journal creation shortcut, and recent entries feed.
- **📝 Journal Management (CRUD)**: Create, View, Edit, and Delete journal entries. Includes title, mood selector (Happy, Calm, Neutral, Sad, Anxious, Energetic), custom tag pills, content, and automatic timestamping.
- **⏳ Timeline**: Browse complete journal history with live search by title/content, mood filtering, tag filtering, and ascending/descending chronological sorting.
- **📈 Insights & Analytics**: Visual mood distribution breakdown percentage bars, most used tag cloud with usage frequencies, writing streak stats, and overall activity counters.
- **🗄️ AWS DynamoDB & Fallback**: Native DynamoDB client using `@aws-sdk/lib-dynamodb` document client with built-in automatic mock store fallback if AWS credentials are not set.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Routing**: React Router v7
- **HTTP Client**: Axios (configured with `withCredentials: true`)

### Backend
- **Runtime**: Node.js + Express v5
- **Language**: TypeScript (`tsx` runner, ES Modules)
- **Database**: AWS SDK v3 (`@aws-sdk/client-dynamodb`, `@aws-sdk/lib-dynamodb`)
- **Security**: JWT (`jsonwebtoken`), Password Hashing (`bcrypt`), `cookie-parser`, `cors`

---

## 📝 Implementation Step Logs & Notes

### Step 1: Base Setup & Connection
- Configured Express server running on port `3001` (bypassing macOS AirPlay receiver port 5000 conflict).
- Configured Vite React frontend running on port `5174` with Tailwind CSS v4 styling.
- Enabled CORS with credentials for cookie-based auth between frontend and backend.

### Step 2: Database Setup (AWS DynamoDB + Fallback Store)
- Installed `@aws-sdk/client-dynamodb` and `@aws-sdk/lib-dynamodb` in the backend.
- Created `src/config/db.ts` to initialize `DynamoDBDocumentClient`.
- Implemented automatic environment check: if `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are provided in `Backend/.env`, the system connects directly to AWS DynamoDB tables (`JournL-Users`, `JournL-Journals`). If blank, it gracefully defaults to an in-memory mock database to allow local execution without setup friction.

### Step 3: Authentication & Security
- Created `UserService` and `AuthController` for user registration and authentication.
- Passwords are securely hashed using `bcrypt` (10 rounds).
- Issued 7-day JWT tokens transmitted via `HttpOnly` cookies (`token`) for security against XSS.
- Added `authenticateJWT` middleware to protect `/api/journals` and `/api/dashboard` API routes.
- Built `AuthContext` and `ProtectedRoute` on the frontend for smooth persistent auth state.

### Step 4: Journal CRUD & Timeline Features
- Implemented `JournalService` and `JournalController` supporting full CRUD operations (`GET`, `POST`, `PUT`, `DELETE` on `/api/journals`).
- Built `JournalEditor` page supporting entry creation, edit modes, custom tag additions/deletions, and mood tags.
- Built `JournalDetail` page for full reading and entry management.
- Built `Timeline` page supporting real-time search queries, mood filter dropdowns, tag filter dropdowns, and date sorting (`Newest` / `Oldest`).

### Step 5: Dashboard & Insights Analytics
- Created `DashboardController` calculating active daily streaks by checking continuous consecutive dates, total count of journals written, and today's status.
- Built `Dashboard` page with user greeting, streak cards, and recent entries.
- Built `Insights` page displaying interactive mood percentage progress bars and tag usage chips.

---

## 🏃 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm

### 1. Backend Setup
```bash
cd Backend
npm install
```

Create a `.env` file inside `Backend/`:
```env
PORT=3001
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
CORS_ORIGIN=http://localhost:5174

# AWS DynamoDB (Optional - leave blank to use automatic local mock database)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
USERS_TABLE_NAME=JournL-Users
JOURNALS_TABLE_NAME=JournL-Journals
```

Start backend development server:
```bash
npm run dev
```
*(Backend will run on http://localhost:3001)*

### 2. Frontend Setup
In a new terminal:
```bash
cd Frontend
npm install
npm run dev
```
*(Frontend will run on http://localhost:5174)*

---

## 🌐 API Reference

### Auth
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Sign in and set HttpOnly JWT cookie
- `POST /api/auth/logout` — Clear auth cookie
- `GET /api/auth/me` — Get current logged-in user

### Journals
- `GET /api/journals` — Fetch user's journal entries
- `GET /api/journals/:id` — Fetch single entry by ID
- `POST /api/journals` — Create a new entry
- `PUT /api/journals/:id` — Update an existing entry
- `DELETE /api/journals/:id` — Delete an entry

### Dashboard
- `GET /api/dashboard` — Get streak, today's status, recent entries, and mood/tag analytics summary

---

## 🎯 Verification & Build

Both Frontend and Backend TypeScript codebases build cleanly without errors:
- **Backend build**: `npm run build` (tsc ES Module output)
- **Frontend build**: `npm run build` (tsc -b && vite build)
