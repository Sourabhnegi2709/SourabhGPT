# GPT Full-Stack Chat Application

## Overview
This project is a full-stack chat application that integrates a React + Vite frontend with an Express + MongoDB backend. The backend connects to Google's Gemini API for AI-powered chat responses. The project is organized into two main folders: `Frontend` and `Backend`.

---

## Project Structure

```
GPT/
├── Backend/
│   ├── app.js              # Express server and API logic
│   ├── package.json        # Backend dependencies and scripts
│   ├── models/             # Mongoose schemas (e.g., Thread.js)
│   ├── routes/             # (For future API route files)
│   └── utils/              # (For future utility modules)
├── Frontend/
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   ├── main.jsx        # Entry point
│   │   ├── components/     # (For future React components)
│   │   └── assets/         # Static assets
│   ├── public/             # Static files (e.g., vite.svg)
│   ├── package.json        # Frontend dependencies and scripts
│   └── vite.config.js      # Vite configuration
└── .github/
    └── copilot-instructions.md # AI agent instructions
```

---

## Features
- **Frontend**: Built with React and Vite for fast development and hot module reload.
- **Backend**: Express server with CORS, JSON parsing, and integration with Gemini API.
- **Database**: MongoDB with Mongoose for chat message storage (models in `Backend/models/`).
- **AI Integration**: Uses Gemini API for generating chat responses.

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm
- MongoDB instance (local or cloud)
- Gemini API key (add to `.env` in `Backend/`)

### Setup
1. **Clone the repository**
2. **Install dependencies**
   - Backend: `cd Backend && npm install`
   - Frontend: `cd Frontend && npm install`
3. **Configure environment**
   - Create a `.env` file in `Backend/` with your Gemini API key:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```
4. **Start the servers**
   - Backend: `npm start` (from `Backend/`)
   - Frontend: `npm run dev` (from `Frontend/`)

---

## Scripts
- **Backend**
  - `npm start` — Starts the Express server with nodemon
- **Frontend**
  - `npm run dev` — Starts Vite dev server
  - `npm run build` — Builds the frontend for production
  - `npm run lint` — Lints the frontend code

---

## API Endpoints
- `POST /chat` — Main chat endpoint (see `Backend/app.js`)

---

## Contributing
- Follow the structure for adding new models, routes, or React components.
- Update `.github/copilot-instructions.md` if you change workflows or architecture.

---

## License
This project is for educational/demo purposes. Add your license as needed.
