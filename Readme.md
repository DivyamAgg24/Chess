# ♟️ Chess Website

A full-stack chess application where players can log in, play real-time games, and track progress.  
Built with **React (frontend)**, **Express + Passport (backend)**, and **Prisma (database)**.

---

## 🚀 Features
- **Google Login** with Passport.js  
- **Real-time Chess Gameplay** with WebSockets  
- **Persistent Sessions** (users stay logged in even after refresh)  
- **Game State Tracking** (resumes after reconnects)  
- **User Accounts** with creation date and last login info  
- **Clean UI** built with React + Tailwind  

---

## 🛠️ Tech Stack
- **Frontend:** React, TypeScript, Tailwind  
- **Backend:** Node.js, Express, Passport.js  
- **Database:** PostgreSQL + Prisma ORM  
- **Authentication:** Google OAuth 2.0  
- **Real-time:** WebSockets  

---

## ⚡ Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/DivyamAgg24/Chess.git
cd Chess
```

### 2. Install the Dependencies
``` bash
# frontend
cd frontend
npm install

# backend1 (Websocket)
cd ../backend1

# backend2 (Express)
cd ../backend2
npm install
```

### 3. Environment Setup
Create .env files in both frontend/ and backend2/

Frontend .env
```bash
VITE_API_URL=http://localhost:4000
```

Backend2 .emv
```bash
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
CALLBACK_URL="your_google_callback_url"
SESSION_SECRET="your_secret"
CLIENT_URL="your_client"
```

### 4. Run the servers
```bash
# frontend
cd frontend
npm run dev

# backend1
cd ../backend1
npm run dev

# backend2
cd ../backend2
npm run dev
```

## Demo
The `demo/` folder contains a demo video of the working website.

## Vercel Link
[Chess Website on Vercel](https://chess-two-self.vercel.app)
