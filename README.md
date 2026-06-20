# Likho — Going Live (Step by Step)

You have 2 files here:
- `index.html` — the app students will see
- `api/generate.js` — the secret backend that talks to Claude safely

Follow these steps in order. None of it needs you to know how to code.

---

## Step 1 — Get your Anthropic API key

1. Go to **console.anthropic.com** and sign up.
2. Add a payment method under **Billing** (you're charged per use, it's usually a few rupees per generation — not a flat fee).
3. Go to **API Keys** → **Create Key**. Copy it somewhere safe — it starts with `sk-ant-...`
4. Never paste this key into `index.html` or anything that goes in the browser. It only goes into Vercel's settings in Step 4.

## Step 2 — Put your code on GitHub

1. Go to **github.com**, sign up, click **New repository**, name it `likho`.
2. On the new repo page, click **uploading an existing file**.
3. Drag in `index.html` and the whole `api` folder (with `generate.js` inside).
4. Click **Commit changes**.

## Step 3 — Deploy on Vercel

1. Go to **vercel.com**, sign up using your GitHub account (one click).
2. Click **Add New → Project**, pick your `likho` repo, click **Deploy**.
3. Vercel auto-detects the `api/generate.js` file and turns it into your backend automatically. No config needed.

## Step 4 — Add your API key to Vercel (the important part)

1. In your Vercel project, go to **Settings → Environment Variables**.
2. Add one:
   - Name: `ANTHROPIC_API_KEY`
   - Value: the `sk-ant-...` key from Step 1
3. Go to **Deployments**, click the latest one, click **Redeploy** (so it picks up the new key).

## Step 5 — You're live

Vercel gives you a free URL like `likho.vercel.app`. Open it on your phone — it should work exactly like it did in our chat, except now it's really calling your own backend and your own key.

---

### What's next
- Custom domain (e.g. `likho.app`) — buy one (~₹600–1000/yr from Namecheap or GoDaddy), add it in Vercel Settings → Domains.
- Razorpay subscriptions + login accounts — next phase, message me when you're here.
- **Start your Razorpay merchant signup now, in parallel** — their KYC/business verification can take a few days, so it's worth starting while you finish the steps above.
