# MedBlocAI

> **Empowering African Patients with AI + Blockchain Health Records**

[![Built for African Blockchain Festival](https://img.shields.io/badge/Built%20for-African%20Blockchain%20Festival-blue)]()
[![Base Sepolia](https://img.shields.io/badge/Network-Base%20Sepolia-purple)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Overview

**MedBlocAI** is a decentralized health record platform that combines **blockchain** and **AI** to help patients across Africa:
- **Own** their medical data securely
- **Store** records on IPFS with blockchain verification
- **Understand** health insights through AI analysis
- **Control** who accesses their information

## Architecture

```
React Frontend ← → Base Sepolia Smart Contract
  (RainbowKit)              ↓
       ↓              HealthRecordRegistry
   Web3.Storage              ↓
     (IPFS)           Flask AI Service
```

## Features

- **Multi-Wallet Support** - Connect with RainbowKit (MetaMask, WalletConnect, Coinbase, etc.)
- **Decentralized Storage** - Health records on IPFS
- **Blockchain Registry** - Immutable record hashes on Base L2
- **AI Health Analysis** - Symptom analysis and recommendations
- **Patient Privacy** - Only you control your data

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React, Vite, Tailwind CSS, RainbowKit, wagmi, viem |
| **Blockchain** | Solidity, Hardhat, Base Sepolia |
| **Storage** | IPFS (web3.storage) |
| **AI Backend** | Flask, Python, scikit-learn |
| **Deployment** | Vercel (Frontend), Render (Backend) |

## Project Structure

```
medblocai/
├── frontend/          # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── App.jsx
│   └── package.json
├── contracts/         # Solidity smart contracts
│   └── HealthRecordRegistry.sol
├── backend/           # Flask AI service
│   ├── app.py
│   ├── ai_model.py
│   └── requirements.txt
├── scripts/           # Deployment scripts
│   └── deploy.js
├── test/              # Contract tests
│   └── HealthRecordRegistry.test.js
└── hardhat.config.js
```

## Setup & Installation

### Prerequisites
- Node.js v18+
- Python 3.9+
- MetaMask or any Web3 wallet
- Git

### 1. Clone the repository
```bash
git clone https://github.com/jayteemoney/medblocai.git
cd medblocai
```

### 2. Install dependencies
```bash
# Install contract dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install backend dependencies
cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && cd ..
```

### 3. Configure environment variables
```bash
# Root .env for Hardhat
cp .env.example .env
# Add your Base Sepolia RPC URL and private key

# Frontend .env
cp frontend/.env.example frontend/.env
# Add WalletConnect Project ID and contract address

# Backend .env
cp backend/.env.example backend/.env
```

### 4. Deploy smart contract
```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network baseSepolia
```

### 5. Run the application
```bash
# Terminal 1 - Frontend
cd frontend && npm run dev

# Terminal 2 - Backend
cd backend && python app.py
```

## Testing

```bash
# Run smart contract tests
npx hardhat test

# Run with coverage
npx hardhat coverage
```

## Deployment

- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Render
- **Smart Contract**: Base Sepolia Testnet

## Contributing

This is a hackathon project, but contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Hackathon

Built for the **African Blockchain Festival Hackathon** - showcasing the power of blockchain and AI for healthcare in Africa.

## Acknowledgments

- Base blockchain team for developer support
- RainbowKit for amazing wallet UX
- African Blockchain Festival organizers
- Open source community

---

**Disclaimer**: This is a hackathon MVP. Not intended for production use with real medical data.
