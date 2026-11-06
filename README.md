# Saketh Goljana — Engineering Portfolio & Client Studio Engine

> **Live Production**: [https://sakethgoljana.tech](https://sakethgoljana.tech)  
> **Contact**: [hello@sakethgoljana.tech](mailto:hello@sakethgoljana.tech) · [LinkedIn](https://www.linkedin.com/in/saketh-goljana/) · [GitHub](https://github.com/SakethGoljana)

A high-performance personal engineering portfolio and automated client conversion studio built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. Features a built-in zero-cost CRM, real-time Google Gemini interactive AI assistant in an iPhone mockup, Google Sheets cloud synchronization, and automated email notifications powered by Resend.

---

## 🌟 Flagship Featured Case Study: Dispatch

The portfolio showcases **Dispatch** — a high-performance cross-platform bulk WhatsApp automation engine built for schools, clinics, and businesses:

- **Repository**: [https://github.com/SakethGoljana/Dispatch](https://github.com/SakethGoljana/Dispatch)
- **Direct APK Download**: [dispatch-v1.0.0.apk (Latest GitHub Release)](https://github.com/SakethGoljana/Dispatch/releases/latest/download/dispatch-v1.0.0.apk)
- **Tech Stack**: React Native 0.88.0, Expo SDK 58.0.0, Expo Router v4, TypeScript, Meta Graph API v21.0, SheetJS binary buffer parser, EAS Build, and EAS Over-The-Air (OTA) Updates.
- **Key Architecture**: 100% ephemeral on-device spreadsheet parsing in RAM (zero-knowledge privacy), dynamic column filter engine, 8 Indian regional language presets, and official Meta Cloud API + 1-tap `wa.me` deep linking with zero account ban risk.

---

## 🛠️ Architecture & Core Features

### 1. Interactive Experience & Visual Craft
- **Apple-Inspired Design System**: Plus Jakarta Sans geometric typography, analog film grain canvas, 60 FPS Framer Motion spring physics, and system dual-theme (Obsidian Dark / Crisp Light).
- **Global Command Palette (`⌘K` / `Ctrl+K`)**: Instant keyboard navigation, quick APK download, GitHub shortcuts, theme switching, and direct contact actions accessible from any route.
- **Sub-10ms Interactive iPhone AI Assistant**: Snark assistant embedded inside an iPhone frame, powered by Google Gemini (`gemini-3.1-flash-lite`) with context-aware responses and direct lead-generation routing.
- **Booking & Brief Intake Studio**: 30-minute introductory call scheduler with RFC 5545 `.ics` and Google Calendar export, timezone-aware IST slot calculators, and project milestone intake.

### 2. Private Studio CRM (`/crm`)
- **Pipeline Kanban & Table View**: Lead stages (`New`, `Contacted`, `Proposal`, `Booked`, `Completed`), project need categorization, deal valuation, and currency tracking (USD/INR).
- **2-Factor Authentication (2FA)**: Master admin password + 6-digit Google Authenticator / Authy TOTP code verification (RFC 6238 timing-safe evaluation).
- **Smart Contact Actions**: Direct one-tap WhatsApp deep link for phone numbers and pre-filled email composer for client email addresses.
- **Fail-Safe Bulk Synchronization**: Sync local leads to Google Sheets in one click with data-wipe guards (`allowEmpty` requirement to prevent accidental sheet clearing).

### 3. Serverless Backend & Infrastructure
- **Automated Email Notifications (Resend)**:
  - Instant admin alert to `sakethgoljana098@gmail.com` with rich client data card and 1-click CRM jump.
  - Polished confirmation receipt to the visitor from `hello@sakethgoljana.tech`.
  - Dispatched non-blockingly using Next.js `after()` API.
- **Zero-Cost Production Database (Google Sheets)**:
  - Acts as a 100% free, zero-maintenance cloud database via Google Apps Script (`google-apps-script.js`).
  - Native formula-injection neutralization (CWE-1236) sanitizing `=`, `+`, `-`, `@`, `\t`, `\r`.
- **Security & Rate Limiting**:
  - Multi-tier proxy IP resolution prioritizing platform-verified headers (`x-vercel-forwarded-for`, `cf-connecting-ip`, `x-real-ip`).
  - Fixed-window in-memory limiter with `.unref()` timers protecting `/api/auth`, `/api/chat`, `/api/leads`, and `/api/feedback`.
  - Production guards preventing placeholder secrets or default keys from executing.

---

## 📁 Repository Structure

```text
├── public/                 # Static assets, logos, and screenshot mockups
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/       # CRM 2FA session verification & login
│   │   │   ├── chat/       # Google Gemini streaming AI assistant
│   │   │   ├── feedback/   # Micro-feedback telemetry endpoint
│   │   │   ├── leads/      # Lead creation, update, and background sync
│   │   │   └── sheets/     # Google Sheets webhook proxy
│   │   ├── crm/            # Authenticated CRM pipeline dashboard
│   │   ├── globals.css     # Tailwind CSS v4 styling & utilities
│   │   ├── layout.tsx      # Root layout, fonts, and global palette
│   │   └── page.tsx        # Unified single-page portfolio experience
│   ├── components/
│   │   ├── BookingAndBrief.tsx # Scheduler & milestone project brief intake
│   │   ├── CommandPalette.tsx  # Global ⌘K launcher
│   │   ├── FeedbackWidget.tsx  # Floating feedback trigger & modal
│   │   ├── Footer.tsx          # Social docks & quick links
│   │   ├── IPhoneAIChat.tsx    # Interactive Gemini assistant frame
│   │   ├── Navbar.tsx          # Dynamic island header & mobile dock
│   │   └── WorkShowcase.tsx    # Multi-screen modal showcase & case studies
│   └── lib/
│       ├── auth.ts         # Session cookie issuance & secret guards
│       ├── googleSheets.ts # Google Apps Script webhook integration
│       ├── leads.ts        # Lead persistence with atomic file writes
│       ├── notifications.ts# Resend email notification engine
│       ├── rateLimit.ts    # Platform-aware IP rate limiter
│       └── totp.ts         # RFC 6238 TOTP generator & validator
├── google-apps-script.js   # Production Google Apps Script webhook receiver
└── package.json
```

---

## 🚀 Local Development

### 1. Prerequisites
- **Node.js**: v20 or later
- **npm** or **pnpm**

### 2. Environment Setup
Copy the example environment file:
```bash
cp .env.example .env.local
```

Configure your variables in `.env.local`:
```env
# Master password for /crm
ADMIN_SECRET=your_secure_password_here

# Google Authenticator Base32 TOTP secret (at least 16 characters)
ADMIN_TOTP_SECRET=YOUR_BASE32_AUTHENTICATOR_SECRET

# Google Gemini API Key (from Google AI Studio)
GEMINI_API_KEY=your_gemini_api_key_here

# Resend API Key for automated notifications & confirmations
RESEND_API_KEY=re_your_api_key_here
NOTIFICATION_EMAIL=sakethgoljana098@gmail.com
SENDER_EMAIL=hello@sakethgoljana.tech

# Optional: Google Sheets Cloud Database
GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/AKfycb.../exec
GOOGLE_SHEETS_SECRET=your_sheets_sync_secret_here
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📊 Google Sheets Cloud Database Setup (100% Free)

To use Google Sheets as your production cloud database:

1. Create a new Google Spreadsheet at [sheets.new](https://sheets.new).
2. Go to **Extensions > Apps Script**.
3. Replace all code with the contents of `google-apps-script.js`.
4. In the left menu of Apps Script, click **Project Settings (gear icon) > Script Properties > Add Script Property**:
   - **Property**: `SCRIPT_SECRET`
   - **Value**: Any strong random string (e.g. `my_sync_secret_2026`).
5. Click **Deploy > New Deployment**:
   - Select **Web app**.
   - Execute as: **Me**.
   - Who has access: **Anyone**.
6. Copy the Web App URL and add it to your `.env.local` or Vercel environment variables:
   ```env
   GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
   GOOGLE_SHEETS_SECRET=my_sync_secret_2026
   ```

---

## 🌐 Production Deployment (Vercel)

1. Push this repository to your GitHub account (`https://github.com/SakethGoljana/Portfolio`).
2. Import the repository in [Vercel](https://vercel.com).
3. Add the environment variables from your `.env.local` into Vercel Project Settings.
4. Add your custom domain `sakethgoljana.tech` under **Settings > Domains**.
5. In Cloudflare DNS, point a `CNAME` for `@` and `www` to `cname.vercel-dns.com` (DNS Only / Grey Cloud).

---

## 📄 License & Attribution

Designed and engineered by **[Saketh Goljana](https://sakethgoljana.tech)**.  
Open-source under the MIT License.
