# QRe8 - QR Code Generator

A beautiful, fast, and privacy-first QR code generator PWA built with Next.js and shadcn/ui.

**QRe8** = QR + Cr**8** (Create) — say it out loud! 🎤

[![Deploy to Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-F38020?logo=cloudflare)](https://qre8.changa.tech)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## ✨ Features

- ⚡ **Instant Generation** - Real-time QR code preview
- 🎨 **Customizable** - Colors, size & error correction
- 📱 **PWA Ready** - Install on any device, works offline
- 🔒 **Privacy First** - All QR generation happens locally
- 🛡️ **Bot Protection** - Cloudflare Turnstile integration
- 🌙 **Dark Mode** - System theme detection + manual toggle
- 📥 **Download** - Export as PNG with custom size

## 📊 QR Code Types

| Type | Description |
|------|-------------|
| URL/Text | Any URL or plain text |
| WiFi | Auto-connect network credentials |
| vCard | Contact cards with name, phone, email |
| Email | Pre-filled email compose |
| SMS | Pre-filled text message |
| Phone | Click-to-call phone number |
| Geo | GPS coordinates / location |
| Event | Calendar event (iCal format) |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        QRe8 System                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐         ┌─────────────────────────┐   │
│  │   Frontend PWA  │ HTTPS   │   Backend API           │   │
│  │   (This Repo)   │◄───────►│   (Private Repo)        │   │
│  │                 │         │                         │   │
│  │  • Next.js 16   │         │  • Hono.js              │   │
│  │  • shadcn/ui    │         │  • PostgreSQL           │   │
│  │  • Tailwind CSS │         │  • SMTP2GO              │   │
│  │  • Static PWA   │         │  • OTP Auth             │   │
│  └────────┬────────┘         └─────────────────────────┘   │
│           │                                                 │
│           ▼                                                 │
│  ┌─────────────────┐                                       │
│  │ Cloudflare      │                                       │
│  │ • Pages         │                                       │
│  │ • Turnstile     │                                       │
│  │ • WAF           │                                       │
│  └─────────────────┘                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Frontend (This Repository)
- **Framework:** Next.js 16 (App Router, Static Export)
- **UI:** shadcn/ui + Tailwind CSS
- **Hosting:** Cloudflare Pages
- **Features:** PWA, offline support, theme switching

### Backend (Private Repository)
- **Framework:** Hono.js (TypeScript)
- **Database:** PostgreSQL
- **Email:** SMTP2GO (OTP verification)
- **Auth:** OTP-based, JWT tokens
- **Hosting:** Cloudflare Workers / Tunnel

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 16](https://nextjs.org/) |
| UI Components | [shadcn/ui](https://ui.shadcn.com/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| QR Generation | [qrcode](https://www.npmjs.com/package/qrcode) |
| Bot Protection | [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) |
| Validation | [Zod](https://zod.dev/) |
| Theming | [next-themes](https://github.com/pacocoursey/next-themes) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/lafaCodes/Qre8.git
cd Qre8

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create a `.env.local` file:

```env
# Cloudflare Turnstile (use test key for local dev)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA

# Backend API URL (when backend is ready)
# NEXT_PUBLIC_API_URL=https://api.qre8.changa.tech
```

---

## 📦 Deployment

### Branch Strategy

| Branch | Environment | URL |
|--------|-------------|-----|
| `dev` | Staging | qre8-dev.pages.dev |
| `main` | Production | qre8.changa.tech |

### Cloudflare Pages

This project uses static export for Cloudflare Pages.

**Required GitHub Secrets:**

| Secret | Description |
|--------|-------------|
| `CLOUDFLARE_API_TOKEN` | API token with Pages permissions |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile site key |

### CI/CD Pipeline

1. Push to `dev` → Auto-deploys to staging
2. Push to `main` → Auto-deploys to production
3. PRs run build check only (no deployment)

---

## 🔐 Security

- All QR generation is client-side (no data sent to server)
- Cloudflare Turnstile prevents bot abuse
- Content Security Policy headers configured
- Rate limiting on API endpoints (when backend enabled)
- See [SECURITY.md](SECURITY.md) for Cloudflare WAF setup

---

## 📖 Development

### Project Structure

```
qr-code-generator/
├── app/                  # Next.js App Router
│   ├── globals.css       # Global styles + splash screen
│   ├── layout.tsx        # Root layout + providers
│   └── page.tsx          # Main QR generator page
├── src/
│   ├── components/       # React components
│   │   ├── forms/        # QR type input forms
│   │   └── ui/           # shadcn/ui components
│   └── lib/              # Utilities & QR logic
├── public/
│   ├── _headers          # Cloudflare security headers
│   ├── manifest.json     # PWA manifest
│   └── sw.js             # Service worker
└── .github/
    ├── workflows/        # CI/CD pipelines
    └── copilot-instructions.md  # AI assistant guidelines
```

### Version Tracking

- Version info logged to console on page load
- Press `Cmd+Shift+V` (Mac) / `Ctrl+Shift+V` (Win) to view version
- Inspect `#app-version` element in DevTools

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch from `dev`: `git checkout -b features/my-feature`
3. Commit changes: `git commit -m "feat: add my feature"`
4. Push and create PR to `dev`

See [.github/copilot-instructions.md](.github/copilot-instructions.md) for coding guidelines.

---

## 📄 License

MIT © [CHANGA.tech](https://changa.tech)

---

## 🔗 Links

- **Live:** [qre8.changa.tech](https://qre8.changa.tech)
- **GitHub:** [github.com/lafaCodes/Qre8](https://github.com/lafaCodes/Qre8)
- **Author:** [lafa.codes](https://lafa.codes) / [CHANGA.tech](https://changa.tech)
