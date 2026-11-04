# Saketh Goljana · Product Developer & Design Engineer

A high-performance portfolio and client conversion engine built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

## ✨ Features

- **Obsessive Visual Craft**: Plus Jakarta Sans geometric typography, analog film grain, smooth Framer Motion spring physics, and system dual-theme (Sun/Moon).
- **Interactive Work Showcase**: Multi-screen mobile & web case study viewer with horizontal snapshot runways and keyboard navigation.
- **Interactive iPhone AI Assistant**: Powered by Google Gemini (`gemini-3.1-flash-lite`) with context-aware responses and direct lead-generation routing.
- **Booking & Brief Studio**: 30-minute introductory call scheduler with RFC 5545 `.ics` and Google Calendar export, plus milestone brief intake.
- **Private Studio CRM (`/crm`)**: Authenticated pipeline dashboard with 6-digit Google Authenticator (TOTP) PIN login, financial tracking (USD/INR), and bidirectional Google Sheets synchronization.
- **Resilient Error Boundaries**: Custom architectural `404 Not Found` (`not-found.tsx`) and `500 Runtime Exception` boundary (`error.tsx`) with 1-click diagnostic drawer.
- **Interactive Feedback Widget**: Non-intrusive floating feedback tool on desktop and bottom-sheet drawer on mobile.

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+
- npm / pnpm

### 2. Environment Variables
Copy `.env.example` to `.env.local` and configure your credentials:

```bash
cp .env.example .env.local
```

Required variables:
- `ADMIN_SECRET`: Master password for CRM Studio access.
- `ADMIN_TOTP_SECRET`: Base32 secret key for Google Authenticator 6-digit PIN login.
- `GEMINI_API_KEY`: Google Gemini API key for the interactive AI assistant.
- `GOOGLE_SHEET_WEBHOOK_URL`: (Optional) Google Apps Script Web App URL for CRM spreadsheet synchronization.
- `GOOGLE_SHEETS_SECRET`: (Optional) Shared authentication secret matching `google-apps-script.js`.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm run start
```
