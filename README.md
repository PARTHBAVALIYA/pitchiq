# PitchIQ — AI Pitch Coach
> Built by Parth | King Water Company

An AI-powered pitch analysis platform that helps founders and sales reps fix their pitch scripts before the real meeting.

---

## 🚀 Deploy to Vercel (5 minutes)

### Step 1 — Install Node.js
Download from https://nodejs.org (choose LTS version)

### Step 2 — Install Vercel CLI
```bash
npm install -g vercel
```

### Step 3 — Go into the project folder
```bash
cd pitchiq
```

### Step 4 — Install dependencies
```bash
npm install
```

### Step 5 — Test it locally first
```bash
npm start
```
Opens at http://localhost:3000 — make sure it works!

### Step 6 — Deploy to Vercel
```bash
vercel
```
- Follow the prompts (press Enter for all defaults)
- Vercel gives you a live URL like: `pitchiq.vercel.app`

### Step 7 — Your app is LIVE! 🎉
Share the URL with anyone in the world.

---

## 🌐 Connect a Custom Domain (optional)
1. Buy `pitchiq.com` on Namecheap (~$10/year)
2. In Vercel dashboard → your project → Settings → Domains
3. Add your domain and follow the DNS instructions

---

## 📁 Project Structure
```
pitchiq/
├── public/
│   └── index.html          # HTML entry point
├── src/
│   ├── index.js            # React entry point
│   ├── App.js              # Main app component
│   ├── App.css             # All styles
│   └── analyzer.js         # Pitch analysis engine
├── package.json            # Dependencies
└── README.md               # This file
```

---

## 🔮 Next Steps (Roadmap)
- [ ] Connect real Claude AI API via backend
- [ ] Add user accounts (Supabase)
- [ ] Add payment (Razorpay/Stripe)
- [ ] Add video pitch upload & transcription
- [ ] Body language analysis

---

Built with React · Deployed on Vercel · Powered by PitchIQ Engine v1.0
