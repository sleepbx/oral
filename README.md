# Oral

A premium, mobile-first web application designed for the early detection and risk assessment of oral cancer, built with Next.js and React.

### 🌐 Live Application
**[https://oral-cancer-screening.vercel.app](https://oral-cancer-screening.vercel.app)**

## Features
- **Mobile-First UX**: Designed to look and feel like a native iOS/Android application with smooth transitions and fixed bottom action bars.
- **Two-Stage Assessment**:
  1. **Symptom Screening**: Evaluates immediate high-risk symptoms (ulcers, patches, lumps).
  2. **Lifestyle Risk Factors**: Calculates a cumulative risk score based on age, gender, tobacco use (smoking/smokeless), and alcohol consumption.
- **Dynamic Scoring Algorithm**: Instantly categorizes users into Low, Moderate, or High Risk based on established clinical parameters.
- **Admin Portal**: Secure dashboard to view all patient submissions and risk scores.
- **Premium UI**: Utilizes "glassmorphism" effects, large touch-friendly cards, and curated typography (`Inter`).

## Tech Stack
- **Framework:** Next.js (App Router)
- **Styling:** Vanilla CSS variables and Flexbox/Grid
- **Deployment:** Vercel

## Running Locally

1. Clone the repository:
```bash
git clone https://github.com/sleepbx/oral.git
```
2. Install dependencies:
```bash
npm install
```
3. Run the development server:
```bash
npm run dev
```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.
