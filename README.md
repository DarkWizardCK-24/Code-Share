# CodeShare

A modern code snippet sharing platform built with Next.js and Firebase. Create, manage, compare, and share syntax-highlighted code snippets across 20+ programming languages.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Firebase](https://img.shields.io/badge/Firebase-12-orange?logo=firebase)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?logo=tailwindcss)

## Features

- **Authentication** — Email/password and Google OAuth sign-in
- **Create Snippets** — Write code with tab support and live syntax highlighting preview
- **20+ Languages** — JavaScript, Python, Go, Rust, Java, C#, PHP, Ruby, Dart, Swift, C++ and more
- **Share via Link** — Copy a shareable URL to any snippet, viewable without login
- **Search & Filter** — Find snippets by title, content, or programming language
- **Code Comparison** — Side-by-side diff view with line-by-line added/removed/unchanged markers
- **Smart Insights** — Language-aware analysis of diffs detecting changes in imports, functions, control flow, error handling, and more
- **Merge Lines** — Selectively merge individual lines from one version to another during comparison
- **Download Code** — Save any snippet or comparison result as a file
- **Copy to Clipboard** — One-click copy for code and shareable links
- **Responsive UI** — Clean, dark-themed interface with Montserrat and JetBrains Mono fonts

## Tech Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Framework  | Next.js 16 (App Router, Turbopack) |
| Frontend   | React 19, Tailwind CSS 3            |
| Auth       | Firebase Authentication              |
| Database   | Cloud Firestore                      |
| Syntax     | react-syntax-highlighter             |
| Icons      | react-icons                          |

## Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project with **Authentication** and **Firestore** enabled

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/DarkWizardCK-24/Code-Share.git
   cd Code-Share
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy the example file and fill in your Firebase credentials:

   ```bash
   cp .env.example .env
   ```

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Enable Firebase services**

   In the [Firebase Console](https://console.firebase.google.com):
   - **Authentication** → Sign-in method → Enable Email/Password and Google
   - **Firestore Database** → Create database

5. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                  # Next.js App Router pages
│   ├── compare/          # Code comparison page
│   ├── login/            # Authentication page
│   ├── new/              # Create snippet page
│   └── snippet/[id]/     # View snippet page
├── components/           # React components
│   ├── AuthContext.jsx    # Auth state provider
│   ├── ComparePage.jsx   # Side-by-side diff viewer
│   ├── HomePage.jsx      # Dashboard with search & filter
│   ├── LoginPage.jsx     # Sign in / sign up forms
│   ├── NewPage.jsx       # Snippet editor with preview
│   └── ViewPage.jsx      # Snippet viewer with sharing
├── lib/                  # Utilities
│   ├── auth.js           # Firebase auth helpers
│   ├── diff.js           # LCS-based line diff algorithm
│   ├── firebase.js       # Firebase initialization
│   ├── insights.js       # Language-aware diff analysis
│   ├── languages.js      # Supported language definitions
│   └── storage.js        # Firestore CRUD operations
└── firestore.rules       # Firestore security rules
```

## Firestore Security Rules

Snippets are stored under `users/{userId}/snippets/{snippetId}`:
- **Read** — Public (anyone with the link can view)
- **Write** — Owner only (authenticated user must match the userId)

Deploy rules via:

```bash
firebase deploy --only firestore:rules
```

## Scripts

| Command         | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start dev server (Turbopack) |
| `npm run build` | Production build             |
| `npm run start` | Start production server      |
| `npm run lint`  | Run ESLint                   |

## License

This project is open source and available under the [MIT License](LICENSE).