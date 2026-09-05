# 🎓 RRCE Student Voice — Petition & Advocacy Platform

A dedicated, student-led petition and grievance platform built specifically for students and alumni of **RajaRajeswari College of Engineering (RRCE), Bengaluru**.

This platform mobilizes students to oppose the mandatory **₹1,000 Convocation Gown Fee** and demand full financial transparency regarding unaccounted **Alumni Association Fees** previously collected.

---

## 🚀 Key Features

- **🔴 Animated Live Signature Ticker**: Real-time counter and live event ticker displaying signatures as they come in, progress towards the 500-student milestone, and active department alerts.
- **🔒 Safe & Anonymous USN Verification**: Students can sign anonymously to protect against attendance or internal mark retaliation. USNs (`1RR21...`) are verified to prevent duplicate signatures and maintain credibility while masking public identities as `1RR21CS***`.
- **💰 Financial Reality Check & Calculator**: Interactive batch calculator showing the math behind RRCE's ₹1,000 non-refundable charge vs. standard ₹150–₹250 rental deposits across VTU colleges.
- **📜 Formal Letter to Principal & VTU**: Generates a formal, printable representation letter addressed to Principal Dr. R. Balakrishna and the VTU Grievance Cell with live signature counts.
- **📱 1-Click WhatsApp Mobilization**: Pre-drafted WhatsApp broadcast message ready to send directly to RRCE class and section groups.
- **📢 Multi-Petition Support**: Students can raise other campus grievances (canteen pricing, placement fees, lab equipment).

---

## 💻 Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run both API server and frontend together**:
   ```bash
   npm run dev
   ```
   - Frontend will be available at: `http://localhost:5173`
   - API server will be available at: `http://localhost:3001`

3. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🌐 Deploying to Vercel (1-Click Ready)

The project is pre-configured with `vercel.json` and a serverless API handler in `/api/index.js`.

### Option 1: Via GitHub & Vercel Dashboard (Recommended)
1. Push this project to your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: RRCE Student Voice Petition Platform"
   git remote add origin https://github.com/your-username/rrce-petition.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository. Vercel will automatically detect:
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Click **Deploy**. Your petition platform is live and shareable with students!

### Option 2: Using Vercel CLI
```bash
npm install -g vercel
vercel
```
Follow the prompts and accept the default settings.
