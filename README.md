# Acess11 Insights: AI-Powered Accessibility Checker

Access11 Insights is a web application built with Next.js that allows you to scan any website for common accessibility issues. It uses Google's Gemini AI model via Genkit to provide intelligent, actionable suggestions for fixing the identified problems.

This project serves as a powerful starter kit demonstrating the integration of a GenAI backend with a modern React frontend.

## ✨ Features

- **URL-Based Scanning**: Enter any website URL to start an accessibility audit.
- **Comprehensive Analysis**: The backend uses `axe-core` to run a robust analysis against WCAG standards.
- **AI-Powered Suggestions**: For each violation found, Genkit and the Gemini model provide a detailed explanation and a code-based suggestion for the fix.
- **Interactive UI**: A clean, responsive interface built with ShadCN UI and Tailwind CSS to display results in an organized and easy-to-understand manner.
- **Dark Mode**: A sleek dark theme is enabled by default.

## 🚀 Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit) (with Gemini)
- **UI**: [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [ShadCN UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
- **Linting & Formatting**: ESLint, Prettier
- **Deployment**: Firebase App Hosting (template default)

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en) (v20 or later recommended)
- An active Google AI Studio API key.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/firebase/genkit-nextjs-shadcn-starter.git
    cd genkit-nextjs-shadcn-starter
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your environment variables:**
    Create a `.env` file in the root of the project and add your Google AI Studio API key. This is required for the Genkit flows to work.
    ```env
    GEMINI_API_KEY="YOUR_API_KEY_HERE"
    ```

### Running the Development Server

You need to run two separate processes for the Next.js frontend and the Genkit AI backend.

1.  **Start the Genkit server:**
    This command watches for changes in your AI flows.
    ```bash
    npm run genkit:watch
    ```

2.  **Start the Next.js frontend:**
    In a new terminal window, run:
    ```bash
    npm run dev
    ```

The application will be available at [http://localhost:9002](http://localhost:9002).

## 📂 Project Structure

```
.
├── src
│   ├── ai                 # All Genkit-related code
│   │   ├── flows          # Genkit flow definitions
│   │   └── genkit.ts      # Genkit initialization and configuration
│   ├── app                # Next.js App Router pages and layout
│   │   ├── actions.ts     # Server Actions for form submissions
│   │   └── page.tsx       # The main page component
│   ├── components         # Reusable React components
│   │   ├── ui             # ShadCN UI components
│   │   └── access11-checker.tsx # The main application component
│   └── lib                # Utility functions
└── tailwind.config.ts     # Tailwind CSS configuration
```

This clear separation of concerns makes it easy to manage the frontend UI and the backend AI logic independently.
