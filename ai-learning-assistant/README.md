# StudyAI — Full-Stack AI Learning Assistant

A full-stack MERN app that transforms PDFs into interactive learning experiences powered by **Google Gemini AI**.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Auth** | JWT-based login & signup |
| 📄 **PDF Upload** | Upload, store & view study documents |
| 💬 **AI Chat** | Context-aware Q&A about your document |
| 📝 **AI Summary** | One-click document summarization |
| 🧠 **Concept Explainer** | Deep-dive explanations of any topic |
| 🃏 **Flashcards** | Auto-generated flip cards with favorites |
| 🎯 **Quizzes** | Configurable multiple-choice quizzes |
| 📊 **Dashboard** | Progress tracking & recent activity |
| 📱 **Responsive** | Mobile-friendly dark UI |

---

## 🛠 Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, React Router v6, Axios, react-hot-toast  
**Backend:** Node.js, Express, MongoDB (Mongoose), Multer, pdf-parse  
**AI:** Google Gemini 1.5 Flash  
**Auth:** JWT + bcrypt

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+
- MongoDB (local or [Atlas](https://cloud.mongodb.com))
- Google Gemini API key ([get one free](https://aistudio.google.com/app/apikey))

### 2. Clone & Install
```bash
git clone <repo-url>
cd ai-learning-assistant
npm install          # installs root concurrently
cd backend && npm install
cd ../frontend && npm install
```

### 3. Configure Environment

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-learning-assistant
JWT_SECRET=your_super_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 4. Run Development Servers
```bash
# From project root — runs both frontend & backend:
npm run dev

# Or run them separately:
npm run dev:backend   # http://localhost:5000
npm run dev:frontend  # http://localhost:5173
```

Open **http://localhost:5173** in your browser.

---

## 📁 Project Structure

```
ai-learning-assistant/
├── backend/
│   ├── config/         # MongoDB connection
│   ├── controllers/    # Route handlers (auth, documents, AI, flashcards, quizzes, dashboard)
│   ├── middleware/     # JWT auth + Multer upload
│   ├── models/         # Mongoose schemas (User, Document, Flashcard, Quiz, ChatHistory)
│   ├── routes/         # Express routers
│   ├── uploads/        # Uploaded PDF files (auto-created)
│   └── server.js       # Entry point
├── frontend/
│   └── src/
│       ├── components/ # Layout & sidebar
│       ├── context/    # AuthContext (global user state)
│       ├── pages/      # All route pages
│       └── services/   # Axios API helpers
└── package.json        # Root — runs both with concurrently
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/profile` | Get profile (🔒) |
| PUT | `/api/auth/profile` | Update name (🔒) |
| PUT | `/api/auth/password` | Change password (🔒) |

### Documents
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/documents` | Upload PDF (multipart) (🔒) |
| GET | `/api/documents` | List documents (🔒) |
| GET | `/api/documents/:id` | Get document (🔒) |
| DELETE | `/api/documents/:id` | Delete document (🔒) |

### AI
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/ai/chat/:docId` | Chat with document (🔒) |
| GET | `/api/ai/chat/:docId/history` | Chat history (🔒) |
| POST | `/api/ai/flashcards/:docId` | Generate flashcards (🔒) |
| POST | `/api/ai/quiz/:docId` | Generate quiz (🔒) |
| POST | `/api/ai/summary/:docId` | Generate summary (🔒) |
| POST | `/api/ai/explain/:docId` | Explain concept (🔒) |

### Flashcards
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/flashcards` | All user flashcards (🔒) |
| GET | `/api/flashcards/document/:docId` | By document (🔒) |
| PATCH | `/api/flashcards/:id/favorite` | Toggle favorite (🔒) |
| PATCH | `/api/flashcards/:id/review` | Mark reviewed (🔒) |
| DELETE | `/api/flashcards/:id` | Delete (🔒) |

### Quizzes
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/quizzes` | All user quizzes (🔒) |
| GET | `/api/quizzes/document/:docId` | By document (🔒) |
| GET | `/api/quizzes/:id` | Get quiz (answers hidden if incomplete) (🔒) |
| POST | `/api/quizzes/:id/submit` | Submit answers (🔒) |
| DELETE | `/api/quizzes/:id` | Delete (🔒) |

### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard` | Stats + recent activity (🔒) |

> 🔒 = Requires `Authorization: Bearer <token>` header

---

## 📝 Notes

- PDFs up to **50MB** are supported
- Text is extracted server-side with `pdf-parse`; Gemini uses up to ~15,000 characters of extracted text per request
- Chat history is persisted per user per document in MongoDB
- Quiz answers are hidden from the API until the quiz is submitted

---

## 🔮 Possible Enhancements

- [ ] In-browser PDF viewer (react-pdf)
- [ ] Spaced repetition scheduling for flashcards
- [ ] Study streak & XP gamification
- [ ] Export flashcards to Anki format
- [ ] Support DOCX / TXT uploads
- [ ] Email verification
