# Academia–Industry Collaboration Portal

A centralized platform bridging the gap between student competencies and industry demands through skill mapping, assessments, internships, and placement readiness.

---

## Current Development Phase: Phase 1 (Project Foundation)

This repository currently implements **Phase 1: Project Foundation**. 

### Included in this Phase:
- Monorepo folder architecture (`frontend/`, `backend/`, `.agents/`)
- Express.js REST API server with `/api/health` monitoring
- Mongoose database connection setup with graceful offline degradation
- React + Vite frontend application with Tailwind CSS design tokens (`#F8FAFC`, `#4F46E5`, `#0F172A`)
- Responsive Foundation Landing Page showcasing the four user roles (Student, Industry, Academician, Institution) and the 7-step career cycle
- Centralized Axios client with live API health verification
- Basic client-side routing (`/`, `/login`, `/register`)

> **Note:** Business features such as User Authentication, Profiles, Skill Assessments, Matching Engine, and AI Integration will be incrementally implemented in subsequent phases as defined in `EXECUTION_PLAN.md`.

---

## Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router DOM, Axios, Recharts, Lucide Icons
- **Backend:** Node.js, Express.js, Mongoose, dotenv, cors
- **Database:** MongoDB (via Mongoose)
- **AI Integration (Upcoming):** Gemini API via backend proxy

---

## Project Structure

```text
Academia_Portal/
├── frontend/             # React + Vite Client
│   ├── src/
│   │   ├── components/   # Reusable UI components (Navbar, Footer, etc.)
│   │   ├── pages/        # LandingPage, LoginPlaceholder, RegisterPlaceholder
│   │   ├── services/     # Centralized API service layer
│   │   ├── App.jsx       # Routing shell
│   │   └── index.css     # Tailwind design system tokens
│   ├── package.json
│   └── vite.config.js
│
├── backend/              # Node.js + Express Server
│   ├── src/
│   │   ├── config/       # Database & environment configurations
│   │   ├── controllers/  # Request handlers (Health controller)
│   │   ├── middleware/   # Error handling & 404 handlers
│   │   ├── routes/       # Express route definitions
│   │   ├── app.js        # Express app configuration
│   │   └── server.js     # Server entry point
│   ├── package.json
│   └── .env.example
│
├── .agents/              # Agent customizations and workflows
├── GEMINI.md             # Core specifications and design system
├── BusinessGuidelines.md # Business domain guidelines
├── EXECUTION_PLAN.md     # Master execution blueprint
├── .env.example          # Root environment template
└── README.md             # Project documentation
```

---

## Setup & Running Instructions

### Prerequisites
- Node.js (v18 or higher recommended; v24 verified)
- npm (v10 or higher)
- MongoDB instance (optional for Phase 1; server runs in degraded mode if offline)

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm start
```
The backend server will start on `http://localhost:5000`.
- Health Check Endpoint: `http://localhost:5000/api/health`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
The frontend application will start on `http://localhost:5173`.

---

## Environment Variables

### Backend (`backend/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/academia_portal
JWT_SECRET=your_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
```

### Frontend (`frontend/.env`):
```env
VITE_API_BASE_URL=/api
```
