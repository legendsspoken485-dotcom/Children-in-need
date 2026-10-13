# HOPEBRIDGE — Child Welfare Charity Website

> "Every Child Deserves a Chance."

HOPEBRIDGE is an international humanitarian charity web platform built to connect legitimate humanitarian assistance with genuine child-welfare needs across six foundational pillars:

1. **Children Without Parental Care** (Kinship care & family-first protection)
2. **Food & Nutrition Relief** (Daily school lunches & pediatric dietary support)
3. **Safe Shelter** (Emergency accommodation & transitional housing)
4. **Education & School Supplies** (Textbooks, learning kits & open classrooms)
5. **Healthcare** (Pediatric screenings & preventative care)
6. **Clean Drinking Water & Sanitation** (Community boreholes & school WASH facilities)

---

## 🚀 Deployment to Vercel

HOPEBRIDGE is configured for single-click deployment on **Vercel** with full client-side routing support.

### One-Click Deploy via Vercel CLI
```bash
# 1. Install Vercel CLI if needed
npm install -g vercel

# 2. Deploy directly from repository root
vercel
```

### Git-Connected Automatic Deployment
1. Push this repository to **GitHub** (or GitLab/Bitbucket).
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Import your GitHub repository.
4. Vercel automatically detects the Vite React framework with the following preset:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click **Deploy**. The `vercel.json` file in the repository configures automatic single-page application (SPA) rewrites to `/index.html` so that deep links (`/causes`, `/campaigns`, `/donate`, `/safeguarding`) and page reloads work seamlessly.

---

## ⚙️ Environment Variables

The core informational website, cause briefings, staged campaigns, interactive glass UI, and demonstration donation journey operate **out-of-the-box without requiring third-party credentials or API keys**.

For optional production integrations, configure the following variables in the **Vercel Project Settings > Environment Variables**:

| Variable Name | Description | Required? | Source / Notes |
|:---|:---|:---|:---|
| `VITE_SITE_URL` | Canonical public URL of the deployed application | Optional | E.g. `https://hopebridge.vercel.app` |
| `VITE_CONTACT_API_URL` | External webhook / serverless handler for incoming contact messages | Optional | Webhook or Serverless endpoint URL |
| `VITE_STRIPE_PUBLIC_KEY` | Public key for live Stripe merchant donation gateway | Optional | Stripe Dashboard (when payment integration is approved) |

Refer to `.env.example` for reference variable placeholders.

---

## 🛠 Local Development & Build

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm (version 9 or higher)

### Installation
```bash
# Install dependencies
npm install

# Start the local development server (port 3000)
npm run dev
```

### Verification & Production Build
```bash
# Type check and lint
npm run lint

# Compile production bundle to /dist
npm run build

# Preview production build locally
npm run preview
```

---

## 🛡 Child Safeguarding & Ethical Principles
- **Zero Exploitation**: We reject dehumanizing "poverty marketing" and sensationalized suffering images.
- **Privacy First**: No identifiable child beneficiary addresses, school coordinates, or confidential medical files are published.
- **Anti-Institutionalization**: We support family preservation and kinship care over unregulated institutional orphanages.
- **Reporting Line**: Direct child safeguarding concerns can be reported confidentially to `safeguarding@hopebridge.org`.

---

## 📄 License
Licensed under the Apache License, Version 2.0.
