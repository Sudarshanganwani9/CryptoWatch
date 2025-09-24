# 📊 CryptoWatch

CryptoWatch is a modern web app for tracking cryptocurrency prices, setting alerts, and monitoring the market in real time.
Built with React + TypeScript + Vite, styled using TailwindCSS + shadcn/ui, and powered by the CoinGecko API.


---

## 🚀 Features

🔍 Live crypto price tracking (via CoinGecko API)

⏰ Customizable price alerts

📈 Interactive charts & analytics

🎨 Modern UI with shadcn/ui components

⚡ Fast build system with Vite

🛠️ Written in TypeScript for type safety



---

## 📦 Tech Stack

Frontend: React, TypeScript, Vite

Styling: TailwindCSS, shadcn/ui

API: CoinGecko (free demo API key)

Build Tools: PostCSS, ESLint



---

## 🛠️ Installation & Setup

1. Clone the repository

git clone https://github.com/Sudarshanganwani9/CryptoWatch.git
cd CryptoWatch-main

2. Install dependencies

npm install
  or
yarn install
  or
bun install

3. Configure environment variables

Create a .env file in the root directory and add your CoinGecko API key:

VITE_COINGECKO_API_KEY=your_demo_or_pro_key_here

👉 To get a free demo key, sign up at CoinGecko Developers.

4. Start development server

npm run dev

Open http://localhost:5173 in your browser.

5. Build for production

npm run build
npm run preview


---

## 📂 Project Structure

CryptoWatch-main/
├── public/               # Static assets
├── src/
│   ├── components/       # UI and feature components
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── package.json
├── vite.config.ts        # Vite configuration
├── tailwind.config.ts    # Tailwind config
└── tsconfig.json         # TypeScript config


---

## 🔑 API Usage

The app uses CoinGecko API. Example request:

curl "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&x_cg_demo_api_key=YOUR_KEY"


---

## 📝 Scripts

npm run dev – Start local dev server

npm run build – Build for production

npm run preview – Preview production build

npm run lint – Run ESLint

