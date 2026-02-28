# 🏕️ OneCamp Frontend

Welcome to the public, open-source frontend repository for **OneCamp**!
Building a modern, real-time collaboration workspace.

## 🚀 The Complete Backend for just $9

This repository contains the full Next.js frontend for OneCamp. To power this frontend, you need the robust, highly-scalable backend written in **Go**.

We are excited to announce that you can purchase a lifetime license for the complete backend codebase for just **$9**.

👉 **[Get the Backend License at onemana.dev](https://onemana.dev)**

**Launch Date:** March 7th, 2026.
*🔥 Sign up early to receive exclusive coupons!*

Our Go backend includes:
- Highly scalable microservices architecture.
- Real-time signaling and state synchronization.
- Pre-configured Postgres, Redis, and MinIO integrations.
- Complete Docker setup for effortless deployment.

---

## 🛠️ Tech Stack

The OneCamp frontend is built with modern, cutting-edge tools to deliver a premium user experience:

- **Framework:** [Next.js 15](https://nextjs.org/) & [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [Radix UI](https://www.radix-ui.com/)
- **Real-time Audio/Video:** [LiveKit](https://livekit.io/)
- **Rich Text & Collaboration:** [Tiptap](https://tiptap.dev/), [Hocuspocus](https://tiptap.dev/hocuspocus), and [Yjs](https://yjs.dev/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)

---

## 💻 Getting Started

### Prerequisites

Ensure you have the following installed:
- Node.js (v20+)
- `pnpm` (recommended), `npm`, or `yarn`

### 1. Clone the repository

```bash
git clone https://github.com/onecamp-fe-public.git
cd onecamp-fe-public
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Setup

Create a `.env.local` file in the root of the project and add the following variables:

```env
# Backend URLs
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000/
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3001/

# Real-time Services
NEXT_PUBLIC_LIVEKIT_URL=http://localhost:7880
NEXT_PUBLIC_COLLABORATION_URL=ws://localhost:1234
NEXT_PUBLIC_MQTT_HOST=localhost

# Application Info
NEXT_PUBLIC_ORG_NAME="One Camp"

# Firebase Configuration (add your own keys if needed)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run the Development Server

Start the app locally using Turbopack:

```bash
pnpm dev
# The app will run on http://localhost:3001
```

---

## 🤝 Community & Support

- Check out **[onemana.dev](https://onemana.dev)** for the backend license and more updates.
- Have questions? Feel free to open an issue or reach out to us!

*Happy coding!*
