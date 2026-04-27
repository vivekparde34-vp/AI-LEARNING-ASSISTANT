# AI-LEARNING-ASSISTANT
<div align="center">

# 🎓 StudyAI

### Your Intelligent Learning Companion

*Transform static Documents into interactive, personalized study experiences — powered by Google Gemini AI.*

<br/>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Gemini](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-4285F4?logo=google&logoColor=white)](https://aistudio.google.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

<br/>

[**Live Demo**](https://github.com/vivekparde34-vp/RAGproject) · [**Report Bug**](https://github.com/vivekparde34-vp/RAGproject/issues) · [**Request Feature**](https://github.com/vivekparde34-vp/RAGproject/issues)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Demo](#-demo)
- [Key Features](#-key-features)
- [Technology Stack](#%EF%B8%8F-technology-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Running the App](#running-the-app)
- [API Reference](#-api-reference)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## 🌟 About the Project

Most students waste hours passively re-reading textbooks. **StudyAI** changes that.

Upload any PDF — a research paper, a textbook chapter, lecture notes — and instantly unlock:
- An AI tutor that answers questions *grounded in your document*
- Auto-generated flashcards and quizzes for active recall
- Plain-English explanations of complex concepts
- A dashboard tracking everything you've studied

Built on a **MERN stack** with **Retrieval-Augmented Generation (RAG)**, StudyAI doesn't hallucinate — every answer is anchored to the content you uploaded.

---

## 🎬 Demo

> 📸 *Screenshots and a live demo link will be added here. To preview locally, follow the [Getting Started](#-getting-started) guide.*

<!-- Add screenshots here once available:
<p align="center">
  <img src="docs/screenshots/dashboard.png" alt="Dashboard" width="700"/>
  <img src="docs/screenshots/chat.png" alt="AI Chat" width="700"/>
  <img src="docs/screenshots/flashcards.png" alt="Flashcards" width="700"/>
</p>
-->

---

## ✨ Key Features

| Feature | Description |
|:---|:---|
| 📄 **Intelligent PDF Ingestion** | Upload documents and let the AI extract, chunk, and index content for deep contextual analysis. |
| 💬 **AI Tutor Chat** | Converse with your document. The AI provides citation-backed answers using RAG — no guessing. |
| 📝 **One-Click Summarization** | Get the gist of long chapters instantly with coherent, high-quality AI-generated summaries. |
| 🧠 **Concept Explainer** | Stuck on a complex term? Break it down into simple language without leaving the app. |
| 🃏 **Smart Flashcards** | Auto-generate study cards from your material. Mark favorites and track review progress. |
| 🎯 **Adaptive Quizzes** | Test your knowledge with AI-generated multiple-choice questions, complete with explanations. |
| 📊 **Learning Dashboard** | Track progress, recent activity, and study stats in one clean interface. |

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|:---|:---|
| [React 18](https://reactjs.org/) (Vite) | UI framework |
| [Tailwind CSS](https://tailwindcss.com/) | Styling with glassmorphism design |
| [React Router v6](https://reactrouter.com/) | Client-side routing |
| [Lucide React](https://lucide.dev/) | Icon library |
| React Context API | Global authentication state |
| [React Hot Toast](https://react-hot-toast.com/) | User notifications |

### Backend
| Technology | Purpose |
|:---|:---|
| [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) | REST API server |
| [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) | Database & ODM |
| `pdf-parse` | Robust PDF text extraction |
| [Multer](https://github.com/expressjs/multer) | Secure file upload handling |
| [JWT](https://jwt.io/) + [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | Authentication & password security |

### AI Layer
| Technology | Purpose |
|:---|:---|
| [Google Gemini 2.5 Flash](https://ai.google.dev/) | Core AI engine |
| RAG (Retrieval-Augmented Generation) | Grounds answers in uploaded documents |
| Structured JSON generation | Powers flashcards & quiz formatting |

---

## 🏗 Architecture

```
ai-learning-assistant/
├── backend/                    # Express Server & AI Logic
│   ├── config/
│   │   └── db.js               # MongoDB connection setup
│   ├── controllers/
│   │   ├── aiController.js     # Gemini API calls (chat, quiz, flashcards)
│   │   ├── authController.js   # Register, login, JWT issuance
│   │   └── documentController.js # PDF upload & indexing
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT route guards
│   │   └── uploadMiddleware.js # Multer config
│   ├── models/
│   │   ├── User.js             # User schema
│   │   └── Document.js         # PDF metadata & extracted text
│   ├── routes/                 # API endpoint definitions
│   └── uploads/                # Temporary PDF storage
│
├── frontend/                   # React Application
│   └── src/
│       ├── components/         # Reusable UI (Navbar, Cards, Modals)
│       ├── context/            # AuthContext — global login state
│       ├── pages/              # Route views (Dashboard, Chat, Flashcards, Quiz)
│       └── services/           # Axios API wrappers
│
└── package.json                # Concurrently dev scripts
```

**Data flow:**
1. User uploads PDF → `pdf-parse` extracts text → stored in MongoDB
2. User sends a question → backend retrieves relevant document chunks → passes to Gemini with context → streams response back

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **[Node.js](https://nodejs.org/) v18+** — `node --version` to check
- **[MongoDB](https://www.mongodb.com/)** — local instance or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- **Google Gemini API Key** — [Get one free here](https://aistudio.google.com/app/apikey) (no billing required for Flash tier)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/vivekparde34-vp/RAGproject.git
cd ai-learning-assistant

# 2. Install all dependencies (root + backend + frontend via concurrently)
npm install
```

### Environment Setup

Create a `.env` file inside the `backend/` directory:

```bash
cp backend/.env.example backend/.env   # if the example file exists
# — or create it manually:
```

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/ai-learning-assistant

# Auth
JWT_SECRET=your_long_random_secret_string_here

# AI
GEMINI_API_KEY=your_google_gemini_api_key

# CORS
CLIENT_URL=http://localhost:5173
```

| Variable | Required | Description |
|:---|:---:|:---|
| `PORT` | ✅ | Port the Express server listens on |
| `NODE_ENV` | ✅ | `development` or `production` |
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Secret used to sign JWTs — use a long random string |
| `GEMINI_API_KEY` | ✅ | Your Google AI Studio API key |
| `CLIENT_URL` | ✅ | Frontend origin, used for CORS |

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

### Running the App

```bash
# Start both frontend and backend simultaneously
npm run dev
```

| Service | URL |
|:---|:---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |

---

## 🔌 API Reference

All protected routes require a `Bearer <token>` header (obtained from `/api/auth/login`).

### Auth
| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---:|
| `POST` | `/api/auth/register` | Create a new account | — |
| `POST` | `/api/auth/login` | Log in, receive JWT | — |

### Documents
| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---:|
| `POST` | `/api/documents` | Upload a PDF | 🔒 |
| `GET` | `/api/documents` | List all user documents | 🔒 |
| `DELETE` | `/api/documents/:id` | Delete a document | 🔒 |

### AI Features
| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---:|
| `POST` | `/api/ai/chat/:id` | Chat with a document | 🔒 |
| `POST` | `/api/ai/summarize/:id` | Summarize a document | 🔒 |
| `POST` | `/api/ai/explain/:id` | Explain a concept | 🔒 |
| `POST` | `/api/ai/flashcards/:id` | Generate flashcards | 🔒 |
| `POST` | `/api/ai/quiz/:id` | Generate a quiz | 🔒 |

### Dashboard
| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---:|
| `GET` | `/api/dashboard` | Fetch study stats | 🔒 |

> Full request/response schemas are documented in [`docs/API.md`](docs/API.md) *(coming soon)*.

---

## 🔮 Roadmap

- [ ] **Spaced Repetition** — Anki-style review scheduling for flashcards
- [ ] **Multi-Format Support** — Ingest DOCX, TXT, and web URLs
- [ ] **In-Browser PDF Viewer** — Annotate and highlight directly in the app
- [ ] **Gamification** — Study streaks, XP points, and achievement badges
- [ ] **Social Study** — Share flashcard decks and run group quizzes
- [ ] **Export** — Download flashcards as Anki decks or quizzes as PDFs

See the [open issues](https://github.com/vivekparde34-vp/RAGproject/issues) for a full list of proposed features and known bugs.

---

## 🤝 Contributing

Contributions make the open-source community an incredible place to learn and build — any help is **greatly appreciated**.

```bash
# 1. Fork the repo and create your branch
git checkout -b feature/your-feature-name

# 2. Commit your changes with a clear message
git commit -m "feat: add spaced repetition scheduler"

# 3. Push and open a Pull Request
git push origin feature/your-feature-name
```

**Before submitting:**
- Run `npm run lint` and fix any warnings
- Add or update tests if applicable
- Keep PRs focused — one feature or fix per PR

Please follow the [Contributor Covenant](https://www.contributor-covenant.org/) code of conduct in all interactions.

---

## 🔧 Troubleshooting

<details>
<summary><strong>MongoDB connection fails on startup</strong></summary>

- Ensure MongoDB is running locally: `sudo systemctl start mongod`
- Or verify your Atlas connection string includes the correct username, password, and cluster host
- Check that your IP is whitelisted in the Atlas Network Access settings

</details>

<details>
<summary><strong>Gemini API returns 403 or quota errors</strong></summary>

- Confirm your `GEMINI_API_KEY` in `.env` is correct and active
- The free tier has per-minute rate limits — wait a moment and retry
- Check your usage at [Google AI Studio](https://aistudio.google.com/)

</details>

<details>
<summary><strong>Frontend can't reach the backend (CORS error)</strong></summary>

- Ensure `CLIENT_URL` in `backend/.env` exactly matches the frontend URL (including port)
- Make sure both services are running (`npm run dev` from the root)

</details>

<details>
<summary><strong>PDF upload fails silently</strong></summary>

- Check that the `backend/uploads/` directory exists and is writable
- Ensure the file is a valid PDF and under the upload size limit (default: 10MB)

</details>

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">

Built with ❤️ for students everywhere.

⭐ **Star this repo if it helped you!** ⭐

</div>
