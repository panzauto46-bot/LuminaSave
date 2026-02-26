# 🌟 LuminaSave

> **Crypto Savings Made Easy as Banking**
> 
> A seamless, intuitive, and secure decentralized application (dApp) that bridges the gap between traditional banking savings and DeFi yield-generating protocols.

[![Web3](https://img.shields.io/badge/Web3-Ready-blue?style=for-the-badge&logo=web3.js)](https://lumina-save.vercel.app/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.2-purple?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Yo Protocol](https://img.shields.io/badge/Yo_Protocol-Integrated-green?style=for-the-badge)](#)

---

## 📖 About The Project

LuminaSave is a modern Web3 application built to make crypto savings management as accessible and straightforward as traditional web banking. By leveraging the **Yo Protocol** under the hood, LuminaSave allows users to create savings goals, deposit digital assets, and redeem them natively via on-chain smart contracts—all wrapped in a sleek, user-friendly, and responsive user interface.

### 🌟 Key Features

- **🚀 Effortless Goal Creation**: Set custom, targeted savings goals with just a few clicks.
- **🔗 Seamless Web3 Integration**: Connect your wallet easily using Wagmi and Viem.
- **🏦 Real On-Chain Transactions**: True decentralized deposits and redemptions powered by [Yo Protocol](https://yoprotocol.io/).
- **📊 Intuitive Dashboard**: Monitor your portfolio, track goal progresses, and manage your assets from a centralized dashboard.
- **💡 Risk Transparency**: Clear upfront information on DeFi risks, making sure users are always informed before participating.
- **🌗 Dark Mode Support**: Elegantly designed to support both light and dark themes using Tailwind CSS and Framer Motion.

---

## 🛠️ Technology Stack

| Category         | Technology / Libraries                                                                  |
| ---------------- | ----------------------------------------------------------------------------------------|
| **Frontend**     | React 19, TypeScript, Vite                                                              |
| **Styling**      | Tailwind CSS v4, Framer Motion, Lucide React, clsx, tailwind-merge                      |
| **Web3 & Crypto**| Wagmi, Viem, @yo-protocol/react, @yo-protocol/core                                      |
| **State Mgt.**   | React Context API, React Query (@tanstack/react-query)                                  |

---

## 📂 Project Structure

A quick look at the core repository structure:

```text
LuminaSave/
├── src/
│   ├── components/         # UI Elements (Dashboard, Modals, Goals, Landing Page)
│   ├── context/            # Application state management (AppContext)
│   ├── hooks/              # Custom React Web3 & UI hooks
│   ├── utils/              # Helper functions and formatters
│   ├── wallet/             # Wagmi & Web3 wallet configurations
│   ├── App.tsx             # Main React entry with animated page routing
│   ├── index.css           # Global Styles & Tailwind directives
│   ├── main.tsx            # Application mounting point
│   └── types.ts            # Core TypeScript interfaces & definitions
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite bundler configuration
```

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm`, `yarn`, or `pnpm` depending on your preference.

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/panzauto46-bot/LuminaSave.git
   cd LuminaSave
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build locally**:
   ```bash
   npm run preview
   ```

---

## 🎨 Design & Animations

LuminaSave utilizes **Framer Motion** extensively to provide a dynamic and fluid user experience. Page transitions, modal presentations, and scrolling progress indicators are meticulously animated to create a premium, "app-like" feel on the web.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  <i>Built with ❤️ for a better Web3 future.</i>
</p>
