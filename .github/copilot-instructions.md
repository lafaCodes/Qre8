# Copilot Instructions for QRe8

You are assisting in building **QRe8**, a security-focused, serverless QR code PWA.

## High-Level Architecture

QRe8 consists of:

### Frontend
- Next.js (App Router)
- Deployed on Cloudflare Pages
- Static build (no SSR)
- PWA (manifest + service worker)
- No secrets in frontend
- Communicates with backend via HTTPS JSON APIs only

### Backend
- Hono-based API
- Deterministic and auditable
- Handles all business logic
- Exposed via Cloudflare Tunnel
- No direct public database access

### Database
- PostgreSQL
- Minimal data storage
- Hash all sensitive fields
- No raw emails stored

### Email
- SMTP2GO
- Sender: qre8@changa.tech
- Used only for OTP verification

### AI Agent
- Optional
- Assistive only
- Never authoritative
- Never handles authentication, authorization, or database writes

---

## Core Security Rules (MANDATORY)

- Never store plaintext email addresses
- Never store plaintext OTPs
- Always hash emails and OTPs using SHA-256 or stronger
- OTP expiry: maximum 10 minutes
- OTP attempt limit: maximum 5 attempts
- Issue short-lived session tokens (JWT or HMAC)
- All authentication logic must be deterministic
- AI logic is forbidden in auth, token, or persistence layers
- No secrets in frontend code
- Validate all input strictly
- Rate-limit all public endpoints

---

## Backend Guidelines (Hono)

- Use functional handlers, not classes
- Avoid magic abstractions
- Middleware must be explicit
- Prefer small, composable functions
- Use TypeScript with strict typing
- Define explicit API contracts
- Log security-relevant events (without PII)

### Example Backend Endpoint Style

```ts
app.post("/otp/request", async (c) => {
  const { email } = await c.req.json();
  
  // Validate input
  if (!email || !isValidEmail(email)) {
    return c.json({ error: "Invalid email" }, 400);
  }
  
  // Hash email before storage
  const emailHash = await hashSHA256(email);
  
  // Generate and hash OTP
  const otp = generateSecureOTP();
  const otpHash = await hashSHA256(otp);
  
  // Store with expiry (10 min max)
  await db.storeOTP(emailHash, otpHash, Date.now() + 10 * 60 * 1000);
  
  // Send OTP via email
  await sendOTPEmail(email, otp);
  
  return c.json({ success: true });
});
```

---

## Frontend Guidelines (Next.js)

- Frontend is UI-only
- No business logic
- No secrets
- Use `fetch()` to call backend
- Handle errors gracefully
- Support offline PWA behavior
- Differentiate staging vs production via environment variables
- Use Zod for form validation
- Escape all user input before QR encoding
- Size limits on all text inputs
- Use shadcn/ui components
- Tailwind CSS for styling
- Support dark/light themes via next-themes

---

## Data Model Constraints

- Use UUIDs for identifiers
- Use branded types for sensitive hashes
- Do not store raw QR payloads
- Store only hashes and metadata
- All timestamps must be UTC

---

## AI Usage Rules

### Allowed
- QR format suggestions
- Payload validation hints
- Admin insights
- Non-security automation

### Forbidden
- OTP generation or validation
- Token generation
- Authorization decisions
- Database writes
- Rate limiting logic

---

## Testing Expectations

- Write tests for all auth logic
- Test OTP expiry and attempt limits
- Test token validation
- Tests must not rely on AI behavior
- Prefer deterministic tests

---

## Deployment Constraints

- Frontend: Cloudflare Pages
- Backend: Cloudflare Workers or self-hosted behind Tunnel
- No runtime secrets in frontend
- Use environment variables only
- Do not assume Vercel environment

---

## Git Workflow

### Branch Naming
- `main` - Production (auto-deploys)
- `dev` - Staging/integration
- `features/*` - New features (branch from `dev`)
- `bugs/*` - Bug fixes (branch from `dev`)

### Commit Messages
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `refactor:` - Code refactor
- `chore:` - Maintenance
- `security:` - Security-related changes

### PR Flow
1. Create feature/bug branch from `dev`
2. Make changes and commit
3. Push branch and create PR to `dev`
4. After review, merge to `dev`
5. Periodically merge `dev` to `main` for production

---

## Environment Variables

### Frontend (public, prefix with NEXT_PUBLIC_)
- `NEXT_PUBLIC_API_URL` - Backend API base URL
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` - Cloudflare Turnstile

### Backend (secret, never expose)
- `DATABASE_URL` - PostgreSQL connection
- `SMTP_API_KEY` - SMTP2GO API key
- `JWT_SECRET` - Token signing key
- `TURNSTILE_SECRET_KEY` - Turnstile verification

---

## Coding Style

- Prefer clarity over cleverness
- No unnecessary abstractions
- Security > convenience
- Explicit > implicit
- Small functions > large functions

---

## When Unsure

If requirements are unclear:
- Ask for clarification
- Do not invent business logic
- Default to safest behavior
