# QRe8 Security Configuration Guide

This document outlines the security measures implemented in QRe8 and provides instructions for configuring additional server-side protection.

## Table of Contents

1. [Client-Side Security](#client-side-security)
2. [Cloudflare Pages Security Headers](#cloudflare-pages-security-headers)
3. [Cloudflare WAF Rate Limiting](#cloudflare-waf-rate-limiting)
4. [Cloudflare Turnstile Configuration](#cloudflare-turnstile-configuration)
5. [Security Best Practices](#security-best-practices)

---

## Client-Side Security

QRe8 implements multiple layers of client-side security:

### Input Validation (Zod Schemas)
- **Maximum lengths** on all text inputs to prevent DoS
- **Phone number validation** with regex pattern
- **Geo coordinates validation** with range checking (-90 to 90 for lat, -180 to 180 for lon)
- **Email validation** using Zod's built-in email validator
- **URL validation** for website fields

### XSS Prevention
- HTML sanitization removes `<script>` tags and HTML elements
- Control character removal from all inputs
- Proper escaping for WiFi, vCard, and iCalendar formats

### Rate Limiting (Client-Side)
Located in `src/lib/rate-limit.ts`:
- **QR Generation**: 60 per hour
- **Downloads**: 30 per hour  
- **Burst Protection**: 10 per minute

> ⚠️ **Note**: Client-side rate limiting can be bypassed. Always implement server-side rate limiting.

---

## Cloudflare Pages Security Headers

Security headers are configured in `public/_headers`:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' challenges.cloudflare.com; ...
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

These headers are automatically applied by Cloudflare Pages.

---

## Cloudflare WAF Rate Limiting

Since QRe8 is a static site, server-side rate limiting must be configured in Cloudflare's dashboard.

### Step 1: Access WAF Rules

1. Log into [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your domain (e.g., `qre8.changa.tech`)
3. Navigate to **Security** → **WAF** → **Rate limiting rules**

### Step 2: Create Rate Limiting Rules

#### Rule 1: General Page Rate Limit
```
Name: QRe8 - General Rate Limit
If incoming requests match:
  - URI Path contains "/"
  
Rate limiting:
  - Requests: 100 requests per 1 minute
  - Per: IP address
  
Action: Block for 1 minute
```

#### Rule 2: Strict Asset Rate Limit
```
Name: QRe8 - Asset Download Protection
If incoming requests match:
  - URI Path contains "/_next/"
  
Rate limiting:
  - Requests: 200 requests per 1 minute
  - Per: IP address
  
Action: Block for 5 minutes
```

### Step 3: Enable Bot Fight Mode

1. Go to **Security** → **Bots**
2. Enable **Bot Fight Mode** (free tier) or configure **Super Bot Fight Mode** (Pro+)

### Step 4: Configure Firewall Rules

Create additional firewall rules for suspicious patterns:

```
Name: Block Suspicious User Agents
If:
  - User Agent contains "curl" OR
  - User Agent contains "wget" OR
  - User Agent contains "python-requests" OR
  - User Agent is empty
  
Action: Challenge (CAPTCHA)
```

---

## Cloudflare Turnstile Configuration

QRe8 uses Cloudflare Turnstile for bot protection.

### Environment Variables

**Development** (`.env.local`):
```env
# Test keys - always pass
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

**Production** (set in Cloudflare Pages):
```env
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-actual-site-key
TURNSTILE_SECRET_KEY=your-actual-secret-key
```

### Setting Up Turnstile

1. Go to [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile)
2. Click **Add Site**
3. Enter your domain: `qre8.changa.tech`
4. Select **Managed** widget type
5. Copy the Site Key and Secret Key
6. Add to Cloudflare Pages environment variables:
   - Go to **Workers & Pages** → **QRe8** → **Settings** → **Environment variables**
   - Add `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
   - Add `TURNSTILE_SECRET_KEY` (for future server-side validation)

---

## Security Best Practices

### For Developers

1. **Never commit secrets** - Use environment variables
2. **Update dependencies regularly** - Run `npm audit` frequently
3. **Test input validation** - Try XSS payloads in all forms
4. **Monitor rate limits** - Check Cloudflare analytics for abuse patterns

### For Deployment

1. **Enable HTTPS only** - Cloudflare handles this automatically
2. **Set up alerts** - Configure Cloudflare notifications for security events
3. **Review access logs** - Monitor for suspicious patterns
4. **Keep service worker updated** - Increment `CACHE_VERSION` on each deploy

### Security Checklist

- [x] Security headers configured (`_headers`)
- [x] Service worker with versioned caching
- [x] Input validation with length limits
- [x] XSS sanitization on all inputs
- [x] Proper escaping for QR formats
- [x] Client-side rate limiting
- [ ] Cloudflare WAF rate limiting (manual setup required)
- [ ] Cloudflare Bot Fight Mode (manual setup required)
- [x] Turnstile integration
- [x] HTTPS enforced (via Cloudflare)

---

## Incident Response

If you detect abuse:

1. **Check Cloudflare Analytics** for attack patterns
2. **Add IP blocks** in Cloudflare Firewall
3. **Increase rate limits** temporarily if needed
4. **Enable "Under Attack" mode** for severe DDoS

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-12-23 | Initial security hardening |

---

*This document is part of the QRe8 security hardening initiative.*
