# QRe8 - QR Code GeneratorThis is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).



A beautiful, fast, and privacy-first QR code generator PWA built with Next.js and shadcn/ui.## Getting Started



**QRe8** = QR + Cr**8** (Create) — say it out loud! 🎤First, run the development server:



## Features```bash

npm run dev

- ⚡ **Instant Generation** - Real-time QR code preview# or

- 🎨 **Customizable** - Colors, size & error correctionyarn dev

- 📱 **PWA Ready** - Works offline on any device# or

- 🔒 **Privacy First** - All processing happens locallypnpm dev

- 🛡️ **Bot Protection** - Cloudflare Turnstile integration# or

bun dev

## QR Code Types```



- URL/TextOpen [http://localhost:3000](http://localhost:3000) with your browser to see the result.

- WiFi Networks

- Contact Cards (vCard)You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

- Email

- SMSThis project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

- Phone Call

- GPS Location## Learn More

- Calendar Events

To learn more about Next.js, take a look at the following resources:

## Tech Stack

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

- [Next.js 16](https://nextjs.org/) - React framework- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

- [shadcn/ui](https://ui.shadcn.com/) - UI components

- [Tailwind CSS](https://tailwindcss.com/) - StylingYou can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

- [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) - Bot protection

- [qrcode](https://www.npmjs.com/package/qrcode) - QR generation## Deploy on Vercel



## DevelopmentThe easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.



```bashCheck out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Environment Variables

Create a `.env.local` file:

```bash
# For local development (always passes)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA

# For production
# NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_real_site_key
```

## Deployment

### Branch Strategy

| Branch | Environment | URL |
|--------|-------------|-----|
| `dev` | Development | qre8.changa-tech.com |
| `main` | Production | qre8.changa.tech |

### Cloudflare Pages

This project is configured for static export to Cloudflare Pages.

**Required GitHub Secrets:**

- `CLOUDFLARE_API_TOKEN` - API token with Pages edit permissions
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` - Turnstile site key for builds
- `AZURE_DEVOPS_PAT` - Personal Access Token for Azure DevOps sync

### CI/CD Pipeline

1. Push to `dev` → Auto-deploys to qre8.changa-tech.com
2. Push to `main` → Auto-deploys to qre8.changa.tech
3. On `main` merge → Syncs to Azure DevOps (dev.azure.com/changatech/QRe8)

## Repository

- **GitHub (Dev):** [github.com/lafaCodes/QRe8](https://github.com/lafaCodes/QRe8)
- **Azure DevOps:** [dev.azure.com/changatech/QRe8](https://dev.azure.com/changatech/QRe8)

## Author

Maintained by [lafa.codes](https://lafa.codes) ([CHANGA.tech](https://changa.tech))

## License

MIT
