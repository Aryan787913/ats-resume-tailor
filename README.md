# ATS Resume Tailor

> Beat the ATS. Land the interview.

A full-stack web app that takes your resume + a job description and outputs a tailored, ATS-optimized PDF resume — powered by Claude AI and compiled via Overleaf.

---

## How It Works

1. **Claude Call #1** — Rewrites your resume from scratch using keywords from the JD
2. **Claude Call #2** — Converts the rewritten resume to LaTeX
3. **Overleaf** — Compiles the LaTeX to a beautiful PDF
4. **Download** — You get a `tailored_resume.pdf` to submit

---

## Environment Variables

Copy `.env.example` to `.env` in the `backend/` folder and fill in:

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Your Claude API key from [console.anthropic.com](https://console.anthropic.com) |
| `OVERLEAF_SESSION_COOKIE` | Value of `overleaf_session2` cookie from Overleaf (see below) |
| `OVERLEAF_GCLB_TOKEN` | Value of `GCLB` cookie from Overleaf (see below) |

### How to get Overleaf cookies

1. Log into [https://www.overleaf.com](https://www.overleaf.com)
2. Open DevTools (`F12`) → **Application** tab → **Cookies** → `https://www.overleaf.com`
3. Find `overleaf_session2` → copy the full **Value** (it starts with `s%3A`)
4. Find `GCLB` → copy its **Value**
5. Paste into your `.env`

> ⚠️ Cookies expire. If you see "Overleaf session expired", repeat these steps.

---

## Local Development

```bash
# 1. Clone and install
git clone <your-repo>
cd ats-resume-tailor
npm run install:all

# 2. Set up env vars
cp .env.example backend/.env
# edit backend/.env with your keys

# 3. Start backend (port 3001)
npm run dev:backend

# 4. Start frontend (port 3000) — in another terminal
npm run dev:frontend

# Visit http://localhost:3000
```

---

## Deploy for FREE 24/7 — Step by Step

### Option A: Railway (Easiest — Recommended)

Railway gives you $5/month free credit which is enough for this app.

1. Push this repo to GitHub (make sure `.env` is in `.gitignore`)
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Deploy the **backend** service:
   - Root directory: `backend`
   - Start command: `node server.js`
   - Add env vars in the Railway dashboard
4. Deploy the **frontend** service:
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Start command: `npx serve -s build`
   - Add env var: `REACT_APP_API_URL=https://your-backend.railway.app`
5. Update `FRONTEND_URL` in backend env to your frontend Railway URL

### Option B: Render (100% Free tier)

1. Push to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. **Backend:**
   - Root: `backend`
   - Build: `npm install`
   - Start: `node server.js`
   - Add env vars in dashboard
4. **Frontend:**
   - New Static Site → root: `frontend`
   - Build: `npm run build`
   - Publish dir: `build`
   - Add redirect rule: `/* → /index.html` (200)
   - Set `REACT_APP_API_URL` to your backend Render URL

> ⚠️ Free Render services spin down after 15min inactivity (cold starts ~30s)

### Option C: Fly.io (Best for always-on free tier)

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Deploy backend
cd backend
fly launch --name ats-tailor-backend
fly secrets set ANTHROPIC_API_KEY=... OVERLEAF_SESSION_COOKIE=... OVERLEAF_GCLB_TOKEN=...
fly deploy

# Build + deploy frontend
cd ../frontend
npm run build
# Host the build/ folder on Netlify or Vercel (both free)
```

### Option D: Netlify (Frontend) + Railway (Backend)

- Frontend → [netlify.com](https://netlify.com): drag-drop the `frontend/build` folder. Free forever.
- Backend → Railway (see Option A above)

---

## Docker Compose (Self-hosted VPS)

If you have a free Oracle Cloud / Google Cloud free-tier VM:

```bash
cp .env.example .env
# fill in .env

docker-compose up -d
# Frontend: http://your-ip:3000
# Backend: http://your-ip:3001
```

---

## Selling This App (SaaS)

To monetize, add:

1. **Auth** — [Clerk.dev](https://clerk.dev) free tier (10k users free)
2. **Payments** — [Stripe](https://stripe.com) — charge per generation or monthly
3. **Usage limits** — Track generations per user in a free [PlanetScale](https://planetscale.com) or [Supabase](https://supabase.com) DB
4. **Landing page** — The included landing page is conversion-ready

Suggested pricing:
- Free: 1 resume/month
- Pro ($9/mo): Unlimited resumes
- One-time ($4.99): Single tailored resume

---

## Tech Stack

- **Frontend:** React 18, custom CSS (no framework needed)
- **Backend:** Node.js + Express
- **AI:** Anthropic Claude (`claude-sonnet-4-5-20250929`)
- **PDF:** Overleaf (LaTeX compilation)
- **Rate limiting:** 10 req/IP/hour

---

## Security Notes

- Resume text and JD are **never logged or stored**
- All processing is in-memory, per-request
- API keys live only in environment variables

---

## Refreshing Overleaf Cookies

Cookies last ~30 days. When you see "session expired":
1. Log into overleaf.com in your browser
2. DevTools → Application → Cookies → copy `overleaf_session2` and `GCLB`
3. Update your deployment's env vars

For n8n users: You can automate cookie refresh with a scheduled n8n workflow that reads cookies from a browser automation node.
