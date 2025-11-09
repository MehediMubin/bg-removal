# 🎨 BG Removal - AI-Powered Background Removal SaaS

A full-stack web application that removes image backgrounds using ClipDrop's AI API. Users can sign up with Clerk authentication, and remove backgrounds from images with a simple, intuitive interface.

## ✨ Features

-  **🔐 User Authentication** - Secure sign-up and login with Clerk
-  **🎯 Background Removal** - One-click background removal powered by ClipDrop AI
-  **💰 Credit System** - Users credits that are consumed per image processed
-  **📊 Real-time Credits** - Track remaining credits instantly
-  **🚀 Production Ready** - Deployed on Vercel (frontend) with robust error handling

## 🏗️ Tech Stack

### Frontend

-  **React** 19 - UI library
-  **Vite** 7 - Fast build tool
-  **Tailwind CSS** 4 - Styling
-  **Axios** - HTTP client
-  **@clerk/clerk-react** - Authentication UI
-  **react-toastify** - Toast notifications

### Backend

-  **Node.js** - Runtime
-  **Express** 5 - Web framework
-  **MongoDB** - Database
-  **Mongoose** 8 - ODM
-  **Svix** - Webhook management
-  **ClipDrop API** - Background removal AI

## 📋 Prerequisites

Before you begin, ensure you have:

-  **Node.js** 18+ and **pnpm**
-  **MongoDB** instance (local or cloud, e.g., MongoDB Atlas)
-  **Clerk** account and API keys
-  **ClipDrop** API key
-  **Git**

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/MehediMubin/bg-removal.git
cd bg-removal
```

### 2. Environment Setup

#### Server Configuration

Create `server/.env`:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net

# Server
PORT=5000

# Clerk Webhooks
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx

# ClipDrop API
CLIPDROP_API_KEY=xxxxxxxxxxxxxxxxxxxxx
```

#### Client Configuration

Create `client/.env` (or `.env.local`):

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
VITE_BACKEND_URL=http://localhost:5000
```

### 3. Install Dependencies

```bash
# Install server dependencies
cd server
pnpm install

# Install client dependencies
cd ../client
pnpm install
```

### 4. Get API Keys

#### Clerk

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Copy `Publishable Key` to client `.env`
4. Go to **Webhooks** → Create webhook for `https://yourdomain/api/user/webhooks`
5. Copy webhook secret to server `.env`
6. In **Sessions** → Add custom claim: `{"clerkId":"{{user.id}}"}`

#### MongoDB

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and database
3. Copy connection string to `MONGODB_URI` in server `.env`

#### ClipDrop

1. Sign up at [ClipDrop](https://clipdrop.co)
2. Get your API key from dashboard
3. Add to server `.env` as `CLIPDROP_API_KEY`

### 5. Run Development Servers

#### Start Backend (Terminal 1)

```bash
cd server
pnpm dev
# Server runs on http://localhost:5000
```

#### Start Frontend (Terminal 2)

```bash
cd client
pnpm dev
# Client runs on http://localhost:5173
```

Visit **http://localhost:5173** in your browser.

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👤 Author

[MehediMubin](https://github.com/MehediMubin)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ⭐ Show Your Support

If you found this project helpful, please consider giving it a star on GitHub!

---

**Happy Background Removing! 🎨**
