import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "node:path";
import { connectDB, dbStatus } from "./config/db";
import { errorHandler } from "./middlewares/errorHandler";
import { rateLimiter } from "./middlewares/rateLimiter";

// Route imports
import authRoutes from "./routes/authRoutes";
import wordRoutes from "./routes/wordRoutes";
import characterRoutes from "./routes/characterRoutes";
import shlokaRoutes from "./routes/shlokaRoutes";
import progressRoutes from "./routes/progressRoutes";
import quizRoutes from "./routes/quizRoutes";
import searchHistoryRoutes from "./routes/searchHistoryRoutes";
import fullGitaRoutes from "./modules/fullGita/routes";
import { fullGitaPage } from "./modules/fullGita/page";

// Load environment variables
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Enable CORS and json body parsing
app.use(cors());
app.use(express.json());

// Set up rate limiting
app.use(rateLimiter);

// Connect to Database
connectDB();

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/words", wordRoutes);
app.use("/api/characters", characterRoutes);
app.use("/api/shlokas", shlokaRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/search-history", searchHistoryRoutes);
app.use("/api/full-gita", fullGitaRoutes);
app.use("/assets", express.static(path.resolve(process.cwd(), "src/assets")));
app.use("/full-gita/audio", express.static(path.resolve(process.cwd(), "src/modules/fullGita/audio")));
app.get("/full-bhagavad-gita", (_req: Request, res: Response) => res.type("html").send(fullGitaPage));

// Root route - SPA Frontend
app.get("/", (req: Request, res: Response) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mahabharat Vocabulary & Spaced Repetition</title>
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- FontAwesome Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Lora:ital,wght@0,400;0,600;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/epic-avatars.css">
  <style>
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: #0f1115;
      color: #e2e8f0;
    }
    .epic-title {
      font-family: 'Cinzel', serif;
    }
    .epic-text {
      font-family: 'Lora', serif;
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #1a1d24;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #ca8a04;
      border-radius: 3px;
    }
    @keyframes sudarshanaSpin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-sudarshana-spin {
      animation: sudarshanaSpin 10s linear infinite;
    }
    .animate-sudarshana-spin-fast {
      animation: sudarshanaSpin 4s linear infinite;
    }
    .auth-screen-art {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(90deg, rgba(5, 7, 18, .9) 0%, rgba(5, 7, 18, .66) 27%, rgba(5, 7, 18, .16) 52%, transparent 72%),
        linear-gradient(0deg, rgba(5, 7, 18, .72), transparent 25%),
        url('/assets/krishna-vishvarupa-login.png');
      background-size: cover;
      background-position: center, center, 62% center;
      pointer-events: none;
    }
    .auth-panel {
      position: relative;
      width: 100%;
      max-width: 420px;
      padding: 28px;
      background: linear-gradient(145deg, rgba(11, 15, 28, .91), rgba(11, 15, 28, .72));
      border: 1px solid rgba(245, 185, 79, .42);
      border-radius: 4px 24px 4px 24px;
      box-shadow: 0 24px 80px rgba(0, 0, 0, .46), 0 0 40px rgba(219, 153, 31, .1), inset 0 1px rgba(255, 236, 183, .14);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
    }
    .auth-panel::before,
    .auth-panel::after {
      content: '';
      position: absolute;
      width: 30px;
      height: 30px;
      pointer-events: none;
    }
    .auth-panel::before { top: -1px; left: -1px; border-top: 2px solid #f5c66c; border-left: 2px solid #f5c66c; }
    .auth-panel::after { right: -1px; bottom: -1px; border-right: 2px solid #f5c66c; border-bottom: 2px solid #f5c66c; }
    .auth-panel input[type='text'],
    .auth-panel input[type='password'],
    .auth-panel #auth-submit-btn,
    .auth-panel #tab-btn-login,
    .auth-panel #tab-btn-register {
      border-radius: 10px 3px 10px 3px;
    }
    .auth-panel input:-webkit-autofill,
    .auth-panel input:-webkit-autofill:hover,
    .auth-panel input:-webkit-autofill:focus {
      -webkit-text-fill-color: #e2e8f0;
      box-shadow: inset 0 0 0 100px #121622;
      caret-color: #e2e8f0;
    }
    @media (max-width: 767px) {
      .auth-screen-art {
        background-image:
          linear-gradient(rgba(6, 8, 14, .58), rgba(6, 8, 14, .8)),
          url('/assets/krishna-vishvarupa-login.png');
        background-position: 68% center;
      }
      .auth-panel { padding: 24px 20px; }
    }
  </style>
</head>
<body class="min-h-screen flex flex-col custom-scrollbar">

  <!-- DASHBOARD CONTAINER (Visible when logged in or guest session) -->
  <div id="app-dashboard-container" class="hidden min-h-screen flex flex-col">
    <!-- Header -->
    <header class="border-b border-yellow-600/20 bg-[#161a23]/90 backdrop-blur sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2 sm:gap-4 min-w-0">
        <div class="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <!-- Krishna's Sudarshana Chakra App Logo -->
          <div class="relative group cursor-pointer shrink-0" title="Sudarshana Chakra of Lord Krishna">
            <div class="absolute -inset-1 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
            <div class="relative bg-[#11131a] border border-yellow-500/40 p-1.5 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.25)]">
              <svg class="w-8 h-8 sm:w-9 sm:h-9 animate-sudarshana-spin" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="sudarshanaGold" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#ffffff" />
                    <stop offset="30%" stop-color="#fef08a" />
                    <stop offset="65%" stop-color="#eab308" />
                    <stop offset="100%" stop-color="#854d0e" />
                  </radialGradient>
                  <radialGradient id="sudarshanaCore" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#ffffff" />
                    <stop offset="50%" stop-color="#38bdf8" />
                    <stop offset="100%" stop-color="#0284c7" />
                  </radialGradient>
                </defs>
                <circle cx="50" cy="50" r="48" fill="none" stroke="#fef08a" stroke-width="1" stroke-dasharray="2 3" opacity="0.8" />
                <circle cx="50" cy="50" r="44" fill="none" stroke="#eab308" stroke-width="1.5" opacity="0.9" />
                <g fill="url(#sudarshanaGold)" stroke="#fef08a" stroke-width="0.5">
                  <path d="M 50,2 L 54,16 L 46,16 Z" />
                  <path d="M 50,2 L 54,16 L 46,16 Z" transform="rotate(22.5 50 50)" />
                  <path d="M 50,2 L 54,16 L 46,16 Z" transform="rotate(45 50 50)" />
                  <path d="M 50,2 L 54,16 L 46,16 Z" transform="rotate(67.5 50 50)" />
                  <path d="M 50,2 L 54,16 L 46,16 Z" transform="rotate(90 50 50)" />
                  <path d="M 50,2 L 54,16 L 46,16 Z" transform="rotate(112.5 50 50)" />
                  <path d="M 50,2 L 54,16 L 46,16 Z" transform="rotate(135 50 50)" />
                  <path d="M 50,2 L 54,16 L 46,16 Z" transform="rotate(157.5 50 50)" />
                  <path d="M 50,2 L 54,16 L 46,16 Z" transform="rotate(180 50 50)" />
                  <path d="M 50,2 L 54,16 L 46,16 Z" transform="rotate(202.5 50 50)" />
                  <path d="M 50,2 L 54,16 L 46,16 Z" transform="rotate(225 50 50)" />
                  <path d="M 50,2 L 54,16 L 46,16 Z" transform="rotate(247.5 50 50)" />
                  <path d="M 50,2 L 54,16 L 46,16 Z" transform="rotate(270 50 50)" />
                  <path d="M 50,2 L 54,16 L 46,16 Z" transform="rotate(292.5 50 50)" />
                  <path d="M 50,2 L 54,16 L 46,16 Z" transform="rotate(315 50 50)" />
                  <path d="M 50,2 L 54,16 L 46,16 Z" transform="rotate(337.5 50 50)" />
                </g>
                <circle cx="50" cy="50" r="33" fill="none" stroke="#eab308" stroke-width="3" />
                <circle cx="50" cy="50" r="29" fill="none" stroke="#fef08a" stroke-width="1" />
                <g stroke="#fef08a" stroke-width="2" stroke-linecap="round">
                  <line x1="50" y1="17" x2="50" y2="29" />
                  <line x1="50" y1="17" x2="50" y2="29" transform="rotate(30 50 50)" />
                  <line x1="50" y1="17" x2="50" y2="29" transform="rotate(60 50 50)" />
                  <line x1="50" y1="17" x2="50" y2="29" transform="rotate(90 50 50)" />
                  <line x1="50" y1="17" x2="50" y2="29" transform="rotate(120 50 50)" />
                  <line x1="50" y1="17" x2="50" y2="29" transform="rotate(150 50 50)" />
                  <line x1="50" y1="17" x2="50" y2="29" transform="rotate(180 50 50)" />
                  <line x1="50" y1="17" x2="50" y2="29" transform="rotate(210 50 50)" />
                  <line x1="50" y1="17" x2="50" y2="29" transform="rotate(240 50 50)" />
                  <line x1="50" y1="17" x2="50" y2="29" transform="rotate(270 50 50)" />
                  <line x1="50" y1="17" x2="50" y2="29" transform="rotate(300 50 50)" />
                  <line x1="50" y1="17" x2="50" y2="29" transform="rotate(330 50 50)" />
                </g>
                <circle cx="50" cy="50" r="17" fill="#0b0f19" stroke="#eab308" stroke-width="2" />
                <circle cx="50" cy="50" r="9" fill="url(#sudarshanaCore)" />
                <polygon points="50,43 52,48 57,50 52,52 50,57 48,52 43,50 48,48" fill="#ffffff" />
              </svg>
            </div>
          </div>
          <div class="min-w-0">
            <h1 class="epic-title text-base sm:text-lg md:text-xl font-bold tracking-wider text-yellow-500 truncate">MAHABHARAT</h1>
            <p class="text-xs text-gray-400 font-medium hidden sm:block truncate">Spaced Repetition & Multilingual Gita Wisdom</p>
          </div>
        </div>

        <div class="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <!-- Streak Indicator -->
          <div id="streak-badge" class="hidden shrink-0 flex items-center space-x-1.5 bg-yellow-600/10 border border-yellow-500/20 px-2.5 py-1 rounded-full text-yellow-500 text-xs sm:text-sm font-semibold whitespace-nowrap">
            <i class="fa-solid fa-fire text-amber-500"></i>
            <span id="streak-count">0</span> Day Streak
          </div>

          <!-- Auth Buttons / User Profile -->
          <div id="auth-section" class="shrink-0 flex items-center gap-2">
            <button onclick="openAuthModal('login')" class="border border-yellow-500/40 hover:bg-yellow-500/10 text-yellow-500 px-3 py-1.5 rounded-lg text-xs font-bold transition">
              Sign In
            </button>
            <button onclick="openAuthModal('register')" class="bg-gradient-to-r from-yellow-500 to-amber-500 hover:brightness-110 text-gray-950 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition shadow-sm">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Database Connection Banner -->
    <div id="db-banner" class="bg-yellow-600/10 border-b border-yellow-500/20 px-4 py-2 text-center text-xs text-yellow-500 font-semibold flex items-center justify-center space-x-2">
      <i class="fa-solid fa-database animate-pulse"></i>
      <span id="db-banner-text">Connecting to database...</span>
    </div>

  <!-- Main Workspace -->
  <main class="flex-1 max-w-7xl mx-auto w-full px-4 py-6 flex flex-col md:flex-row gap-6">
    
    <!-- Sidebar Navigation -->
    <aside class="md:w-64 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-3 md:pb-0 border-b md:border-b-0 md:border-r border-gray-800/60 md:pr-4">
      <button onclick="switchTab('dashboard')" id="btn-dashboard" class="nav-btn flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold transition w-full whitespace-nowrap bg-yellow-600/10 text-yellow-500 border border-yellow-500/20">
        <i class="fa-solid fa-chart-line text-lg w-6"></i>
        <span>Dashboard</span>
      </button>
      <button onclick="switchTab('vocab')" id="btn-vocab" class="nav-btn flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold transition w-full whitespace-nowrap text-gray-400 hover:text-yellow-500 hover:bg-gray-800/30">
        <i class="fa-solid fa-book-open text-lg w-6"></i>
        <span>Vocabulary Guide (500+)</span>
      </button>
      <button onclick="switchTab('shlokas')" id="btn-shlokas" class="nav-btn flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold transition w-full whitespace-nowrap text-gray-400 hover:text-yellow-500 hover:bg-gray-800/30">
        <i class="fa-solid fa-scroll text-lg w-6"></i>
        <span>Bhagavad Gita Verses (700)</span>
      </button>
      <a href="/full-bhagavad-gita" class="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold transition w-full whitespace-nowrap text-teal-300 bg-teal-400/10 border border-teal-400/20 hover:bg-teal-400/20">
        <i class="fa-solid fa-book-open-reader text-lg w-6"></i>
        <span>Full Bhagavad Gita ↗</span>
      </a>
      <button onclick="switchTab('characters')" id="btn-characters" class="nav-btn flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold transition w-full whitespace-nowrap text-gray-400 hover:text-yellow-500 hover:bg-gray-800/30">
        <i class="fa-solid fa-shield-halved text-lg w-6"></i>
        <span>Epic Characters (50)</span>
      </button>
      <button onclick="switchTab('quiz')" id="btn-quiz" class="nav-btn flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold transition w-full whitespace-nowrap text-gray-400 hover:text-yellow-500 hover:bg-gray-800/30">
        <i class="fa-solid fa-trophy text-lg w-6"></i>
        <span>Interactive Quiz</span>
      </button>
    </aside>

    <!-- Tabs Content Container -->
    <section class="flex-1 min-w-0 bg-[#12141c] border border-gray-800/60 rounded-xl p-5 md:p-6 shadow-xl shadow-black/40">
      
      <!-- DASHBOARD TAB -->
      <div id="tab-dashboard" class="space-y-6">
        <div class="border-b border-gray-800/80 pb-4">
          <h2 class="epic-title text-xl md:text-2xl font-bold text-yellow-500 tracking-wider">Epic Portal</h2>
          <p class="text-xs text-gray-400">Welcome to the sacred study of Mahabharat vocabulary, epic personalities, and 700 Gita verses.</p>
        </div>

        <!-- Quick Stats Bento Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-[#161a23]/60 border border-gray-800/80 p-4 rounded-xl flex items-center space-x-3.5">
            <div class="bg-blue-500/10 border border-blue-500/20 text-blue-400 w-10 h-10 rounded-lg flex items-center justify-center text-xl">
              <i class="fa-solid fa-gem"></i>
            </div>
            <div>
              <p class="text-xs text-gray-400 font-semibold uppercase tracking-wider">Vocabulary Terms</p>
              <h3 id="stat-total" class="text-lg md:text-xl font-bold text-blue-400">520+</h3>
            </div>
          </div>
          <div class="bg-[#161a23]/60 border border-gray-800/80 p-4 rounded-xl flex items-center space-x-3.5">
            <div class="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 w-10 h-10 rounded-lg flex items-center justify-center text-xl">
              <i class="fa-solid fa-fire"></i>
            </div>
            <div>
              <p class="text-xs text-gray-400 font-semibold uppercase tracking-wider">Streak</p>
              <h3 id="stat-streak" class="text-lg md:text-xl font-bold text-yellow-500">0 Days</h3>
            </div>
          </div>
          <div class="bg-[#161a23]/60 border border-gray-800/80 p-4 rounded-xl flex items-center space-x-3.5">
            <div class="bg-green-500/10 border border-green-500/20 text-green-400 w-10 h-10 rounded-lg flex items-center justify-center text-xl">
              <i class="fa-solid fa-graduation-cap"></i>
            </div>
            <div>
              <p class="text-xs text-gray-400 font-semibold uppercase tracking-wider">Mastered</p>
              <h3 id="stat-mastered" class="text-lg md:text-xl font-bold text-green-400">0</h3>
            </div>
          </div>
          <div class="bg-[#161a23]/60 border border-gray-800/80 p-4 rounded-xl flex items-center space-x-3.5">
            <div class="bg-red-500/10 border border-red-500/20 text-red-400 w-10 h-10 rounded-lg flex items-center justify-center text-xl">
              <i class="fa-solid fa-clock"></i>
            </div>
            <div>
              <p class="text-xs text-gray-400 font-semibold uppercase tracking-wider">Due Reviews</p>
              <h3 id="stat-due" class="text-lg md:text-xl font-bold text-red-400">0</h3>
            </div>
          </div>
        </div>

        <!-- Featured Section -->
        <div class="grid md:grid-cols-2 gap-6 pt-2">
          <!-- Intro Card -->
          <div class="bg-[#161a23]/30 border border-yellow-600/10 p-5 rounded-xl space-y-3 flex flex-col justify-between">
            <div class="space-y-2">
              <span class="text-[10px] uppercase font-bold tracking-widest text-yellow-600">Sacred Wisdom Engine</span>
              <h3 class="epic-title text-lg font-bold text-yellow-500">50 Personalities & Multilingual Verses</h3>
              <p class="epic-text text-sm text-gray-300 leading-relaxed">
                Study the profound Sanskrit words of the Mahabharat and all 700 verses of the Bhagavad Gita translated into <b>English</b>, <b>हिंदी (Hindi)</b>, and <b>বাংলা (Bangla)</b>. Our system utilizes the SM-2 spaced repetition algorithm to optimize retention.
              </p>
            </div>
            <button onclick="switchTab('vocab')" class="bg-yellow-600/10 border border-yellow-500/20 text-yellow-500 hover:bg-yellow-600 hover:text-gray-950 px-4 py-2 rounded-lg text-xs font-semibold tracking-wider transition self-start mt-4">
              Launch Study Session <i class="fa-solid fa-arrow-right ml-1"></i>
            </button>
          </div>

          <!-- User Stats / History -->
          <div class="bg-[#161a23]/30 border border-gray-800/80 p-5 rounded-xl space-y-4">
            <h3 class="epic-title text-sm font-bold text-gray-300 tracking-wider">My Activity Records</h3>
            
            <div id="dashboard-anon" class="text-center py-6 space-y-3">
              <p class="text-xs text-gray-400">Create an account or start a guest session to save study statistics, streaks, and quiz histories.</p>
              <div class="flex justify-center space-x-3">
                <button onclick="openAuthModal('login')" class="bg-yellow-600 text-gray-950 hover:bg-yellow-500 px-4 py-1.5 rounded-lg text-xs font-bold transition">Login</button>
                <button onclick="startGuestSession()" class="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-1.5 rounded-lg text-xs font-bold transition">Start Guest</button>
              </div>
            </div>

            <div id="dashboard-user-stats" class="hidden space-y-3 text-sm">
              <div class="flex justify-between border-b border-gray-800/60 pb-2">
                <span class="text-gray-400">Full Name</span>
                <span id="stat-fullname" class="font-bold text-yellow-500">N/A</span>
              </div>
              <div class="flex justify-between border-b border-gray-800/60 pb-2">
                <span class="text-gray-400">Username</span>
                <span id="stat-username" class="font-bold text-yellow-500">Seeker</span>
              </div>
              <div class="flex justify-between border-b border-gray-800/60 pb-2">
                <span class="text-gray-400">Active Status</span>
                <span class="text-green-400 flex items-center space-x-1">
                  <span class="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"></span>
                  <span class="font-bold">Online</span>
                </span>
              </div>
              <!-- Recent Searches -->
              <div class="pt-2">
                <span class="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-2">Recent Searches</span>
                <div id="search-history-list" class="flex flex-wrap gap-1.5 text-xs text-gray-400">
                  <span class="italic">No recent search history</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- VOCABULARY GUIDE TAB -->
      <div id="tab-vocab" class="hidden space-y-6">
        <div class="border-b border-gray-800/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="epic-title text-xl md:text-2xl font-bold text-yellow-500 tracking-wider">Mahabharat Vocabulary</h2>
            <p class="text-xs text-gray-400">Search 500+ epic words. Review them to launch spaced repetition.</p>
          </div>
          <!-- Filter/Search Bar -->
          <div class="flex flex-col sm:flex-row gap-2 max-w-md w-full">
            <div class="relative flex-1">
              <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"></i>
              <input type="text" id="vocab-search" oninput="vocabCurrentPage=1; fetchWords()" placeholder="Search Sanskrit, Transliteration, Meaning..." class="w-full bg-[#161a23] border border-gray-800/80 text-sm text-gray-200 pl-9 pr-4 py-2 rounded-lg focus:outline-none focus:border-yellow-600/60">
            </div>
            <select id="vocab-filter" onchange="vocabCurrentPage=1; fetchWords()" class="bg-[#161a23] border border-gray-800/80 text-xs text-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-yellow-600/60">
              <option value="">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <!-- Pagination header -->
        <div class="flex justify-between items-center text-xs text-gray-400 bg-[#161a23]/40 border border-gray-800/60 px-4 py-2 rounded-lg">
          <span id="vocab-total-badge">Showing 0 words</span>
          <div class="flex items-center space-x-2">
            <button id="btn-vocab-prev" onclick="changeVocabPage(-1)" class="bg-gray-800 hover:bg-gray-700 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed px-3 py-1 rounded text-xs font-bold transition">
              <i class="fa-solid fa-chevron-left mr-1"></i> Prev
            </button>
            <span id="vocab-page-indicator" class="font-bold text-yellow-500">Page 1</span>
            <button id="btn-vocab-next" onclick="changeVocabPage(1)" class="bg-gray-800 hover:bg-gray-700 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed px-3 py-1 rounded text-xs font-bold transition">
              Next <i class="fa-solid fa-chevron-right ml-1"></i>
            </button>
          </div>
        </div>

        <!-- Word Catalog Grid -->
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" id="vocab-list">
          <!-- Populated via Javascript -->
        </div>
      </div>

      <!-- GITA SHLOKAS TAB -->
      <div id="tab-shlokas" class="hidden space-y-6">
        <div class="border-b border-gray-800/80 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 class="epic-title text-xl md:text-2xl font-bold text-yellow-500 tracking-wider">Bhagavad Gita Verses</h2>
            <p class="text-xs text-gray-400">All 700 verses across 18 Chapters in English, Hindi (हिंदी), and Bangla (বাংলা).</p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <!-- Multilingual Language Selector Buttons -->
            <div class="flex flex-wrap bg-[#161a23] border border-gray-800/80 p-1 rounded-lg text-xs font-bold gap-1">
              <button onclick="setGitaLang('en')" id="gita-lang-en" class="px-2.5 py-1 rounded transition bg-yellow-500 text-gray-950">English</button>
              <button onclick="setGitaLang('bn')" id="gita-lang-bn" class="px-2.5 py-1 rounded transition text-gray-400 hover:text-yellow-500">বাংলা (Bangla)</button>
              <button onclick="setGitaLang('bn-en')" id="gita-lang-bn-en" class="px-2.5 py-1 rounded transition text-gray-400 hover:text-yellow-500">বাংলা + English</button>
              <button onclick="setGitaLang('hi')" id="gita-lang-hi" class="px-2.5 py-1 rounded transition text-gray-400 hover:text-yellow-500">हिंदी</button>
              <button onclick="setGitaLang('all')" id="gita-lang-all" class="px-2.5 py-1 rounded transition text-gray-400 hover:text-yellow-500">All Languages</button>
            </div>

            <!-- Chapter Select -->
            <select id="shloka-chapter" onchange="fetchShlokas()" class="bg-[#161a23] border border-gray-800/80 text-xs text-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-yellow-600/60">
              <option value="">All 18 Chapters</option>
              <option value="1">Ch 1: Arjuna Viṣāda</option>
              <option value="2">Ch 2: Sāṅkhya Yoga</option>
              <option value="3">Ch 3: Karma Yoga</option>
              <option value="4">Ch 4: Jñāna Karma Sannyāsa</option>
              <option value="5">Ch 5: Karma Sannyāsa</option>
              <option value="6">Ch 6: Dhyāna Yoga</option>
              <option value="7">Ch 7: Jñāna Vijñāna</option>
              <option value="8">Ch 8: Akṣara Brahma</option>
              <option value="9">Ch 9: Rāja Vidyā</option>
              <option value="10">Ch 10: Vibhūti Yoga</option>
              <option value="11">Ch 11: Viśvarūpa Darśana</option>
              <option value="12">Ch 12: Bhakti Yoga</option>
              <option value="13">Ch 13: Kṣetra Kṣetrajña</option>
              <option value="14">Ch 14: Guṇatraya Vibhāga</option>
              <option value="15">Ch 15: Puruṣottama Yoga</option>
              <option value="16">Ch 16: Daivāsura Sampad</option>
              <option value="17">Ch 17: Śraddhātraya Vibhāga</option>
              <option value="18">Ch 18: Mokṣa Sannyāsa</option>
            </select>
          </div>
        </div>

        <a href="/full-bhagavad-gita" class="relative block min-h-[210px] overflow-hidden rounded-2xl border border-amber-500/30 group" aria-label="Open the Full Bhagavad Gita reader">
          <img src="/assets/krishna-scholar-artist.webp" alt="Lord Krishna in a Vedic study painting a luminous portrait of a Hindu Goddess" class="absolute inset-y-0 right-0 h-full w-full md:w-[60%] object-cover object-[70%_20%] transition duration-500 group-hover:scale-[1.02]" loading="lazy" width="1672" height="941">
          <span class="absolute inset-0 bg-gradient-to-r from-[#0d111b] via-[#0d111b]/90 to-[#0d111b]/10"></span>
          <span class="relative flex min-h-[210px] max-w-md flex-col justify-center gap-3 p-6 md:p-8">
            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-teal-300">The complete source edition</span>
            <span class="epic-title text-2xl md:text-3xl font-bold text-amber-300">Full Bhagavad Gita</span>
            <span class="text-xs leading-relaxed text-gray-200">Explore 18 chapters, Sanskrit verses, English and Hindi translations, Bangla study meanings, and devotional listening.</span>
            <span class="text-xs font-bold text-teal-300 group-hover:underline">Open the reader ↗</span>
          </span>
        </a>

        <!-- Search Bar for Verses with Mic Voice Input -->
        <div class="flex items-center gap-2 max-w-xl">
          <div class="relative flex-1">
            <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"></i>
            <input type="text" id="shloka-search" oninput="fetchShlokas()" placeholder="Search verse Sanskrit, translation, or verse number..." class="w-full bg-[#161a23] border border-gray-800/80 text-sm text-gray-200 pl-9 pr-10 py-2 rounded-lg focus:outline-none focus:border-yellow-600/60">
            <button id="shloka-mic-btn" onclick="startShlokaVoiceSearch()" title="Search Verses by Voice (Mic)" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-500 transition p-1 rounded-md">
              <i class="fa-solid fa-microphone"></i>
            </button>
          </div>
          <span id="shloka-mic-status" class="hidden text-xs text-red-400 font-medium animate-pulse flex items-center gap-1.5 bg-red-900/20 border border-red-800/40 px-2.5 py-1.5 rounded-lg whitespace-nowrap">
            <i class="fa-solid fa-circle text-[8px]"></i> Listening...
          </span>
        </div>

        <!-- Shlokas Container -->
        <div class="space-y-6 max-h-[650px] overflow-y-auto pr-2 custom-scrollbar" id="shlokas-list">
          <!-- Loaded via Javascript -->
        </div>
      </div>

      <!-- EPIC CHARACTERS TAB -->
      <div id="tab-characters" class="hidden space-y-6">
        <div class="border-b border-gray-800/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="epic-title text-xl md:text-2xl font-bold text-yellow-500 tracking-wider">Mahabharat Personalities</h2>
            <p class="text-xs text-gray-400">Discover 50 epic characters with animated portraits, voices, roles, and stories.</p>
          </div>
          <button id="epic-motion-toggle" type="button" onclick="toggleEpicAnimations()" aria-pressed="false" class="text-xs text-yellow-500 border border-yellow-500/30 rounded-lg px-3 py-2 hover:bg-yellow-500/10">Pause animations</button>
          <!-- Character Search -->
          <div class="flex gap-2 max-w-sm w-full">
            <div class="relative flex-1">
              <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"></i>
              <input type="text" id="character-search" oninput="fetchCharacters()" placeholder="Search character name..." class="w-full bg-[#161a23] border border-gray-800/80 text-sm text-gray-200 pl-9 pr-4 py-2 rounded-lg focus:outline-none focus:border-yellow-600/60">
            </div>
            <select id="character-alliance" onchange="fetchCharacters()" class="bg-[#161a23] border border-gray-800/80 text-xs text-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-yellow-600/60">
              <option value="">All Alliances</option>
              <option value="Pandavas">Pandavas & Allies</option>
              <option value="Kauravas">Kauravas & Allies</option>
              <option value="Divine">Divine & Yadavas</option>
              <option value="Neutral">Neutral & Sages</option>
            </select>
          </div>
        </div>

        <!-- Kuru Confrontation Arena (Interactive Match-Up Simulator) -->
        <div class="bg-[#161a23]/30 border border-yellow-600/30 rounded-xl p-5 space-y-4 shadow-lg">
          <div class="flex items-center space-x-3 border-b border-gray-800/60 pb-3">
            <div class="bg-yellow-500/10 border border-yellow-500/30 w-8 h-8 rounded-lg flex items-center justify-center text-yellow-500 text-lg">
              <i class="fa-solid fa-swords">⚔️</i>
            </div>
            <div>
              <h3 class="epic-title text-sm md:text-base font-bold text-yellow-500 tracking-wider">Kuru Confrontation Arena</h3>
              <p class="text-[11px] text-gray-400">Select two personalities from the epic to simulate a clash and compare attributes.</p>
            </div>
          </div>
          
          <div class="grid md:grid-cols-12 gap-4 items-center">
            <!-- Left Challenger Selection -->
            <div class="md:col-span-4 space-y-1">
              <label class="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Challenger A</label>
              <select id="arena-char-a" class="w-full bg-[#11131a] border border-gray-800/80 text-xs text-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:border-yellow-600/60" onchange="updateArenaOptions()"></select>
            </div>
            
            <!-- VS middle separator -->
            <div class="md:col-span-1 text-center font-extrabold text-yellow-500 text-sm py-2">VS</div>
            
            <!-- Right Challenger Selection -->
            <div class="md:col-span-4 space-y-1">
              <label class="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Challenger B</label>
              <select id="arena-char-b" class="w-full bg-[#11131a] border border-gray-800/80 text-xs text-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:border-yellow-600/60" onchange="updateArenaOptions()"></select>
            </div>
            
            <!-- Simulation Button -->
            <div class="md:col-span-3 pt-4 md:pt-0">
              <button onclick="simulateClash()" class="w-full bg-yellow-600 hover:bg-yellow-500 text-gray-950 font-bold py-2.5 rounded-lg text-xs md:text-sm tracking-wider uppercase transition shadow-md">
                ⚡ Simulate Clash
              </button>
            </div>
          </div>
          
          <!-- Clash Simulation Results Panel -->
          <div id="arena-results-panel" class="hidden bg-[#11131a]/90 border border-gray-800/80 rounded-lg p-5 space-y-4">
            <div class="grid md:grid-cols-2 gap-6 items-center">
              
              <!-- Left Side: Radar / Attributes Matchup -->
              <div class="space-y-4">
                <h4 class="text-xs uppercase font-bold text-yellow-500 tracking-wider flex items-center gap-1.5">
                  <i class="fa-solid fa-gauge-high"></i> Confrontation Attribute Matchup
                </h4>
                
                <div class="space-y-3">
                  <!-- Attribute 1: Valour -->
                  <div class="space-y-1">
                    <div class="flex justify-between text-[11px] font-semibold">
                      <span class="text-gray-400">Physical Valour & Strength</span>
                      <div class="space-x-2 text-xs">
                        <span id="arena-stat-valour-a" class="text-green-400 font-bold">0</span>
                        <span class="text-gray-600">vs</span>
                        <span id="arena-stat-valour-b" class="text-red-400 font-bold">0</span>
                      </div>
                    </div>
                    <div class="h-2 bg-gray-800 rounded-full overflow-hidden flex">
                      <div id="arena-bar-valour-a" class="h-full bg-green-500/80 transition-all duration-500"></div>
                      <div id="arena-bar-valour-b" class="h-full bg-red-500/80 transition-all duration-500"></div>
                    </div>
                  </div>

                  <!-- Attribute 2: Astra Weaponry -->
                  <div class="space-y-1">
                    <div class="flex justify-between text-[11px] font-semibold">
                      <span class="text-gray-400">Celestial Weaponry (Astra)</span>
                      <div class="space-x-2 text-xs">
                        <span id="arena-stat-astra-a" class="text-green-400 font-bold">0</span>
                        <span class="text-gray-600">vs</span>
                        <span id="arena-stat-astra-b" class="text-red-400 font-bold">0</span>
                      </div>
                    </div>
                    <div class="h-2 bg-gray-800 rounded-full overflow-hidden flex">
                      <div id="arena-bar-astra-a" class="h-full bg-green-500/80 transition-all duration-500"></div>
                      <div id="arena-bar-astra-b" class="h-full bg-red-500/80 transition-all duration-500"></div>
                    </div>
                  </div>

                  <!-- Attribute 3: Strategy / Divine Guidance -->
                  <div class="space-y-1">
                    <div class="flex justify-between text-[11px] font-semibold">
                      <span class="text-gray-400">Strategic Intellect & Guidance</span>
                      <div class="space-x-2 text-xs">
                        <span id="arena-stat-intellect-a" class="text-green-400 font-bold">0</span>
                        <span class="text-gray-600">vs</span>
                        <span id="arena-stat-intellect-b" class="text-red-400 font-bold">0</span>
                      </div>
                    </div>
                    <div class="h-2 bg-gray-800 rounded-full overflow-hidden flex">
                      <div id="arena-bar-intellect-a" class="h-full bg-green-500/80 transition-all duration-500"></div>
                      <div id="arena-bar-intellect-b" class="h-full bg-red-500/80 transition-all duration-500"></div>
                    </div>
                  </div>

                  <!-- Attribute 4: Dharma Weight -->
                  <div class="space-y-1">
                    <div class="flex justify-between text-[11px] font-semibold">
                      <span class="text-gray-400">Moral Alignment (Dharma Weight)</span>
                      <div class="space-x-2 text-xs">
                        <span id="arena-stat-dharma-a" class="text-green-400 font-bold">0</span>
                        <span class="text-gray-600">vs</span>
                        <span id="arena-stat-dharma-b" class="text-red-400 font-bold">0</span>
                      </div>
                    </div>
                    <div class="h-2 bg-gray-800 rounded-full overflow-hidden flex">
                      <div id="arena-bar-dharma-a" class="h-full bg-green-500/80 transition-all duration-500"></div>
                      <div id="arena-bar-dharma-b" class="h-full bg-red-500/80 transition-all duration-500"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Right Side: Simulated Lore Clash Outcome -->
              <div class="space-y-3.5 border-t md:border-t-0 md:border-l border-gray-800/80 pt-4 md:pt-0 md:pl-6">
                <div class="flex items-center justify-between">
                  <h4 class="text-xs uppercase font-bold text-yellow-500 tracking-wider">
                    📜 Simulated Battle Outcome
                  </h4>
                  <span id="arena-win-badge" class="bg-yellow-500/10 text-yellow-500 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded border border-yellow-500/20">Pandavas Favoured</span>
                </div>
                
                <p id="arena-outcome-desc" class="text-xs md:text-sm text-gray-300 leading-relaxed font-medium italic whitespace-pre-line bg-[#0d0e14] p-3.5 rounded-lg border border-gray-800/60">
                  Select characters to unleash the conflict simulation...
                </p>
                
                <div class="flex items-center justify-between text-xs font-semibold text-gray-400 pt-1">
                  <span>Dharmic Win Probability:</span>
                  <span id="arena-win-prob-text" class="text-yellow-500 font-bold">50% vs 50%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Characters Grid -->
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" id="characters-grid">
          <!-- Loaded via Javascript -->
        </div>
      </div>

      <!-- INTERACTIVE QUIZ TAB -->
      <div id="tab-quiz" class="hidden space-y-6">
        <div class="border-b border-gray-800/80 pb-4">
          <h2 class="epic-title text-xl md:text-2xl font-bold text-yellow-500 tracking-wider">Dharmic Assessment</h2>
          <p class="text-xs text-gray-400">Test your Sanskrit vocabulary comprehension and epic intelligence.</p>
        </div>

        <!-- Start Quiz Window -->
        <div id="quiz-start-window" class="text-center py-16 max-w-md mx-auto space-y-5">
          <div class="bg-yellow-500/10 border border-yellow-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-yellow-500 text-3xl">
            <i class="fa-solid fa-brain"></i>
          </div>
          <div class="space-y-2">
            <h3 class="epic-title text-lg font-bold text-gray-200">Interactive Vocabulary Quiz</h3>
            <p class="text-xs text-gray-400 leading-relaxed">
              Generate a custom 5-question multiple choice test based on Mahabharat words, powered by server-side aggregations.
            </p>
          </div>
          <button onclick="startQuiz()" class="w-full bg-yellow-600 hover:bg-yellow-500 text-gray-950 font-bold py-2.5 rounded-lg text-sm transition">
            Begin Quiz
          </button>
        </div>

        <!-- Active Quiz Play window -->
        <div id="quiz-active-window" class="hidden max-w-xl mx-auto bg-[#161a23]/40 border border-gray-800/80 rounded-xl p-5 md:p-6 space-y-6">
          <div class="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-yellow-500 border-b border-gray-800 pb-3">
            <span>Question <span id="quiz-q-num">1</span> of 5</span>
            <span class="text-gray-400">Score: <span id="quiz-running-score">0</span></span>
          </div>

          <!-- Question Content -->
          <div class="space-y-2 text-center py-4">
            <span class="text-[10px] uppercase font-bold tracking-widest text-yellow-600">Translate the word</span>
            <div class="flex items-center justify-center space-x-3">
              <h3 id="quiz-word-text" class="epic-title text-3xl font-extrabold text-yellow-500 tracking-wide">धर्म (Dharma)</h3>
              <button onclick="replayQuizAudio()" title="Play Audio Pronunciation" class="text-yellow-500 hover:text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20 p-2 rounded-full transition text-sm flex items-center justify-center w-8 h-8 focus:outline-none">
                <i class="fa-solid fa-volume-high"></i>
              </button>
            </div>
            <p id="quiz-trans-text" class="text-xs text-gray-400 italic">Transliteration: Dharma</p>
          </div>

          <!-- Multiple Choices -->
          <div class="grid gap-3" id="quiz-choices-container">
            <!-- Render choices -->
          </div>

          <div class="text-right">
            <button id="quiz-next-btn" onclick="nextQuizQuestion()" class="hidden bg-yellow-600 hover:bg-yellow-500 text-gray-950 px-5 py-2 rounded-lg text-xs font-bold transition">
              Next Question <i class="fa-solid fa-arrow-right ml-1"></i>
            </button>
          </div>
        </div>

        <!-- Quiz Completed Window -->
        <div id="quiz-complete-window" class="hidden text-center py-10 max-w-md mx-auto space-y-6">
          <div class="bg-green-500/10 border border-green-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-green-400 text-4xl">
            <i class="fa-solid fa-square-poll-vertical"></i>
          </div>
          <div class="space-y-1">
            <h3 class="epic-title text-xl font-bold text-green-400">Quiz Completed!</h3>
            <p class="text-xs text-gray-400">You have completed your evaluation.</p>
          </div>
          <div class="bg-[#161a23]/60 border border-gray-800/80 py-4 px-6 rounded-xl inline-block">
            <p class="text-xs text-gray-400 uppercase font-semibold tracking-wider">Your Score</p>
            <h4 id="quiz-final-score-text" class="text-3xl font-black text-yellow-500 mt-1">4 / 5</h4>
          </div>
          <div class="flex gap-3">
            <button onclick="startQuiz()" class="flex-1 bg-yellow-600 hover:bg-yellow-500 text-gray-950 py-2 rounded-lg text-xs font-bold transition">Try Again</button>
            <button onclick="switchTab('dashboard')" class="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded-lg text-xs font-bold transition">Return Dashboard</button>
          </div>
        </div>
      </div>

    </section>
  </main>

  <!-- CHARACTER DOSSIER MODAL -->
  <div id="character-modal" class="hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-[#12141c] border border-yellow-500/40 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 relative shadow-2xl">
      <button onclick="closeCharacterModal()" aria-label="Close character dossier" class="absolute top-4 right-4 z-10 text-gray-400 hover:text-yellow-500 text-lg w-8 h-8 rounded-full bg-gray-800/80 flex items-center justify-center">
        <i class="fa-solid fa-xmark"></i>
      </button>

      <div id="character-modal-content">
        <!-- Rendered dynamically -->
      </div>
    </div>
  </div>

  <!-- VOCABULARY DETAIL SPLASH MODAL -->
  <div id="vocab-modal" class="hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto" onclick="handleVocabModalBackdrop(event)">
    <div class="bg-[#0f121d] border border-yellow-500/40 border-t-2 border-t-yellow-500 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-7 space-y-5 relative shadow-[0_0_60px_-10px_rgba(234,179,8,0.3)] my-auto custom-scrollbar" onclick="event.stopPropagation()">
      <button onclick="closeVocabModal()" class="absolute top-4 right-4 text-gray-400 hover:text-yellow-400 text-base w-8 h-8 rounded-full bg-gray-800/80 hover:bg-gray-800 flex items-center justify-center transition cursor-pointer z-10" title="Close modal (Esc)">
        <i class="fa-solid fa-xmark"></i>
      </button>

      <div id="vocab-modal-content">
        <!-- Rendered dynamically -->
      </div>
    </div>
  </div>

  <!-- FOOTER -->
  <footer class="border-t border-gray-800/80 bg-[#0c0e12] py-4 text-center text-xs text-gray-500">
    <p>© 2026 MAHABHARAT Study Engine. Spaced Repetition for Ancient Wisdom.</p>
  </footer>
  </div> <!-- END APP DASHBOARD CONTAINER -->

  <!-- DEDICATED FULLSCREEN AUTH SCREEN -->
  <div id="auth-screen-view" class="min-h-screen flex flex-col justify-between bg-[#06080e] relative overflow-hidden text-gray-200">
    <div class="auth-screen-art" aria-hidden="true"></div>

    <header class="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
      <div class="flex items-center space-x-3">
        <div class="relative bg-[#11131a] border border-yellow-500/40 p-2 rounded-xl flex items-center justify-center shadow-[0_0_25px_rgba(234,179,8,0.3)]">
          <svg class="w-11 h-11 animate-sudarshana-spin" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="sudarshanaGoldAuth" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#ffffff" />
                <stop offset="30%" stop-color="#fef08a" />
                <stop offset="65%" stop-color="#eab308" />
                <stop offset="100%" stop-color="#854d0e" />
              </radialGradient>
              <radialGradient id="sudarshanaCoreAuth" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#ffffff" />
                <stop offset="50%" stop-color="#38bdf8" />
                <stop offset="100%" stop-color="#0284c7" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="none" stroke="#fef08a" stroke-width="1" stroke-dasharray="2 3" opacity="0.8" />
            <circle cx="50" cy="50" r="44" fill="none" stroke="#eab308" stroke-width="1.5" opacity="0.9" />
            <g fill="url(#sudarshanaGoldAuth)" stroke="#fef08a" stroke-width="0.5">
              <path d="M 50,2 L 54,16 L 46,16 Z" />
              <path d="M 50,2 L 54,16 L 46,16 Z" transform="rotate(22.5 50 50)" />
              <path d="M 50,2 L 54,16 L 46,16 Z" transform="rotate(45 50 50)" />
              <path d="M 50,2 L 54,16 L 46,16 Z" transform="rotate(67.5 50 50)" />
              <path d="M 50,2 L 54,16 L 46,16 Z" transform="rotate(90 50 50)" />
              <path d="M 50,2 L 54,16 L 46,16 Z" transform="rotate(112.5 50 50)" />
              <path d="M 50,2 L 54,16 L 46,16 Z" transform="rotate(135 50 50)" />
              <path d="M 50,2 L 54,16 L 46,16 Z" transform="rotate(157.5 50 50)" />
              <path d="M 50,2 L 54,16 L 46,16 Z" transform="rotate(180 50 50)" />
              <path d="M 50,2 L 54,16 L 46,16 Z" transform="rotate(202.5 50 50)" />
              <path d="M 50,2 L 54,16 L 46,16 Z" transform="rotate(225 50 50)" />
              <path d="M 50,2 L 54,16 L 46,16 Z" transform="rotate(247.5 50 50)" />
              <path d="M 50,2 L 54,16 L 46,16 Z" transform="rotate(270 50 50)" />
              <path d="M 50,2 L 54,16 L 46,16 Z" transform="rotate(292.5 50 50)" />
              <path d="M 50,2 L 54,16 L 46,16 Z" transform="rotate(315 50 50)" />
              <path d="M 50,2 L 54,16 L 46,16 Z" transform="rotate(337.5 50 50)" />
            </g>
            <circle cx="50" cy="50" r="33" fill="none" stroke="#eab308" stroke-width="3" />
            <circle cx="50" cy="50" r="29" fill="none" stroke="#fef08a" stroke-width="1" />
            <g stroke="#fef08a" stroke-width="2" stroke-linecap="round">
              <line x1="50" y1="17" x2="50" y2="29" />
              <line x1="50" y1="17" x2="50" y2="29" transform="rotate(30 50 50)" />
              <line x1="50" y1="17" x2="50" y2="29" transform="rotate(60 50 50)" />
              <line x1="50" y1="17" x2="50" y2="29" transform="rotate(90 50 50)" />
              <line x1="50" y1="17" x2="50" y2="29" transform="rotate(120 50 50)" />
              <line x1="50" y1="17" x2="50" y2="29" transform="rotate(150 50 50)" />
              <line x1="50" y1="17" x2="50" y2="29" transform="rotate(180 50 50)" />
              <line x1="50" y1="17" x2="50" y2="29" transform="rotate(210 50 50)" />
              <line x1="50" y1="17" x2="50" y2="29" transform="rotate(240 50 50)" />
              <line x1="50" y1="17" x2="50" y2="29" transform="rotate(270 50 50)" />
              <line x1="50" y1="17" x2="50" y2="29" transform="rotate(300 50 50)" />
              <line x1="50" y1="17" x2="50" y2="29" transform="rotate(330 50 50)" />
            </g>
            <circle cx="50" cy="50" r="17" fill="#0b0f19" stroke="#eab308" stroke-width="2" />
            <circle cx="50" cy="50" r="9" fill="url(#sudarshanaCoreAuth)" />
            <polygon points="50,43 52,48 57,50 52,52 50,57 48,52 43,50 48,48" fill="#ffffff" />
          </svg>
        </div>
        <div>
          <h1 class="epic-title text-xl md:text-2xl font-black tracking-widest bg-gradient-to-r from-yellow-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
            MAHABHARAT
          </h1>
          <p class="text-xs text-gray-400 font-medium tracking-wide">Spaced Repetition & Epic Study Sanctuary</p>
        </div>
      </div>
    </header>

    <main class="flex-1 flex items-center justify-center md:justify-start max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8 relative z-10 w-full">
      <div class="auth-panel space-y-5">
        
        <div id="auth-heading" class="hidden text-center space-y-2">
          <h2 id="auth-modal-title" class="hidden epic-title text-2xl md:text-3xl font-black text-yellow-500 tracking-wider"></h2>
          <p id="auth-modal-subtitle" class="hidden text-xs text-gray-400 font-medium"></p>
        </div>

        <div class="flex bg-[#121520] p-1.5 rounded-2xl border border-gray-800/80 gap-1 text-xs font-bold shadow-inner">
          <button id="tab-btn-login" onclick="toggleAuthMode('login')" class="flex-1 py-2.5 rounded-xl transition-all duration-200 bg-yellow-500 text-gray-950 font-black shadow-md cursor-pointer">
            Sign In
          </button>
          <button id="tab-btn-register" onclick="toggleAuthMode('register')" class="flex-1 py-2.5 rounded-xl transition-all duration-200 text-gray-400 hover:text-yellow-400 hover:bg-gray-800/50 cursor-pointer">
            Sign Up
          </button>
        </div>

        <div id="auth-error" class="hidden bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-4 py-3 rounded-xl flex items-center space-x-2">
          <i class="fa-solid fa-circle-exclamation text-sm shrink-0"></i>
          <span id="auth-error-msg">Error message</span>
        </div>

        <div id="auth-success" class="hidden bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-4 py-3 rounded-xl flex items-center space-x-2">
          <i class="fa-solid fa-circle-check text-sm shrink-0"></i>
          <span id="auth-success-msg">Success message</span>
        </div>

        <form id="auth-form" onsubmit="handleAuthSubmit(event)" class="space-y-4">
          <div id="fullname-field" class="hidden space-y-1.5">
            <label class="text-[11px] text-gray-400 block font-bold uppercase tracking-wider">Full Name</label>
            <div class="relative">
              <i class="fa-solid fa-id-card absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs"></i>
              <input type="text" id="auth-fullname" placeholder="e.g. Arjuna Pandava" class="w-full bg-[#121622] border border-gray-800 text-sm text-gray-200 pl-9 pr-3.5 py-3 rounded-xl focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/40 transition">
            </div>
          </div>

          <div id="username-field" class="space-y-1.5">
            <label id="username-label" class="text-[11px] text-gray-400 block font-bold uppercase tracking-wider">Username</label>
            <div class="relative">
              <i class="fa-solid fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs"></i>
              <input type="text" id="auth-username" required placeholder="Enter seeker username" class="w-full bg-[#121622] border border-gray-800 text-sm text-gray-200 pl-9 pr-3.5 py-3 rounded-xl focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/40 transition">
            </div>
          </div>

          <div id="password-field" class="space-y-1.5">
            <label id="password-label" class="text-[11px] text-gray-400 block font-bold uppercase tracking-wider">Password</label>
            <div class="relative">
              <i class="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs"></i>
              <input type="password" id="auth-password" oninput="checkPasswordStrength(this.value)" placeholder="••••••••" class="w-full bg-[#121622] border border-gray-800 text-sm text-gray-200 pl-9 pr-10 py-3 rounded-xl focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/40 transition">
              <button type="button" onclick="togglePasswordVisibility('auth-password', 'pass-eye-icon')" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-yellow-400 text-xs p-1">
                <i id="pass-eye-icon" class="fa-solid fa-eye"></i>
              </button>
            </div>
            
            <div id="password-strength-container" class="hidden pt-1 space-y-1">
              <div class="flex justify-between items-center text-[10px] text-gray-400 font-semibold">
                <span>Password Strength</span>
                <span id="strength-text" class="text-red-400">Weak</span>
              </div>
              <div class="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div id="strength-bar" class="h-full bg-red-500 rounded-full w-1/4 transition-all duration-300"></div>
              </div>
            </div>
          </div>

          <div id="confirm-password-field" class="hidden space-y-1.5">
            <label class="text-[11px] text-gray-400 block font-bold uppercase tracking-wider">Confirm Password</label>
            <div class="relative">
              <i class="fa-solid fa-shield-check absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs"></i>
              <input type="password" id="auth-confirm-password" placeholder="Confirm new password" class="w-full bg-[#121622] border border-gray-800 text-sm text-gray-200 pl-9 pr-10 py-3 rounded-xl focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/40 transition">
              <button type="button" onclick="togglePasswordVisibility('auth-confirm-password', 'confirm-eye-icon')" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-yellow-400 text-xs p-1">
                <i id="confirm-eye-icon" class="fa-solid fa-eye"></i>
              </button>
            </div>
          </div>

          <div id="quick-demo-accounts" class="bg-[#121622]/90 border border-yellow-500/20 rounded-2xl p-3.5 space-y-2.5">
            <div class="flex items-center justify-between text-[11px] font-bold text-gray-400">
              <span class="flex items-center gap-1.5 text-yellow-400">
                <i class="fa-solid fa-bolt-lightning text-xs"></i>
                <span>1-Click Instant Demo Login</span>
              </span>
              <span class="text-[10px] text-gray-500 font-normal">Click to sign in</span>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <button type="button" onclick="quickDemoLogin('student', 'student123')" class="bg-gradient-to-r from-yellow-500/10 to-amber-500/20 hover:from-yellow-500/25 hover:to-amber-500/35 border border-yellow-500/40 hover:border-yellow-400 text-yellow-300 p-2.5 rounded-xl text-left transition flex flex-col justify-between group cursor-pointer shadow-sm">
                <div class="flex items-center justify-between w-full">
                  <span class="text-xs font-black flex items-center gap-1.5 text-yellow-400 group-hover:text-yellow-300">
                    <i class="fa-solid fa-graduation-cap text-xs"></i>
                    <span>Student</span>
                  </span>
                  <i class="fa-solid fa-arrow-right text-[10px] text-yellow-500/60 group-hover:translate-x-0.5 transition"></i>
                </div>
                <span class="text-[10px] text-gray-400 font-mono mt-1">student / student123</span>
              </button>

              <button type="button" onclick="quickDemoLogin('admin', 'admin123')" class="bg-gradient-to-r from-amber-600/10 to-yellow-600/20 hover:from-amber-600/25 hover:to-yellow-600/35 border border-amber-500/40 hover:border-amber-400 text-amber-300 p-2.5 rounded-xl text-left transition flex flex-col justify-between group cursor-pointer shadow-sm">
                <div class="flex items-center justify-between w-full">
                  <span class="text-xs font-black flex items-center gap-1.5 text-amber-400 group-hover:text-amber-300">
                    <i class="fa-solid fa-crown text-xs"></i>
                    <span>Admin (Guru)</span>
                  </span>
                  <i class="fa-solid fa-arrow-right text-[10px] text-amber-500/60 group-hover:translate-x-0.5 transition"></i>
                </div>
                <span class="text-[10px] text-gray-400 font-mono mt-1">admin / admin123</span>
              </button>
            </div>
          </div>

          <div id="login-extras-row" class="flex items-center justify-between text-xs pt-1">
            <label class="flex items-center space-x-2 text-gray-400 cursor-pointer select-none">
              <input type="checkbox" id="auth-remember" class="accent-yellow-500 rounded bg-[#121622] border-gray-800">
              <span>Remember me</span>
            </label>
          </div>

          <button type="submit" id="auth-submit-btn" class="w-full bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 hover:brightness-110 text-gray-950 font-black py-3.5 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-yellow-500/20 transition transform active:scale-[0.98] flex items-center justify-center space-x-2 cursor-pointer">
            <i class="fa-solid fa-right-to-bracket"></i>
            <span id="auth-submit-text">Sign In</span>
          </button>

          <div id="forgot-password-btn-container" class="text-center pt-2">
            <button type="button" onclick="toggleAuthMode('forgot')" class="text-xs text-yellow-500 hover:text-yellow-400 font-semibold hover:underline cursor-pointer inline-flex items-center gap-1.5 transition">
              <i class="fa-solid fa-key-skeleton text-[11px]"></i>
              <span>Forgot Password?</span>
            </button>
          </div>
        </form>

        <div id="back-to-login-container" class="hidden pt-2 text-center text-xs text-gray-400">
          Remembered your password? 
          <button onclick="toggleAuthMode('login')" class="text-yellow-500 hover:underline font-bold ml-1 cursor-pointer">
            Return to Sign In
          </button>
        </div>
      </div>
    </main>

    <footer class="w-full text-center py-4 text-xs text-gray-500 relative z-10 border-t border-gray-900/60">
      <p>© 2026 MAHABHARAT Study Engine. Spaced Repetition for Ancient Wisdom.</p>
    </footer>
  </div>

  <!-- CLIENT SCRIPTS -->
  <script src="/assets/character-art-notes.js"></script>
  <script src="/assets/epic-avatars.js"></script>
  <script>
    const quickDemoAllowed = ${JSON.stringify(process.env.NODE_ENV !== "production")};
    let currentTab = "dashboard";
    let currentUser = null;
    let token = localStorage.getItem("token") || "";
    let activeWords = [];
    let vocabCurrentPage = 1;
    let vocabTotalPages = 1;
    let activeCharacters = [];
    let activeShlokas = [];
    let selectedWord = null;
    let currentGitaLang = "en"; // "en", "hi", "bn", "all"

    // Quiz State
    let quizData = null;
    let quizIndex = 0;
    let quizScore = 0;
    let quizAnswers = [];
    let quizAnswered = false;

    // Init App
    async function init() {
      // Restore remembered username
      const remembered = localStorage.getItem("rememberedUsername");
      const userInp = document.getElementById("auth-username");
      const remCheck = document.getElementById("auth-remember");
      if (remembered && userInp) {
        userInp.value = remembered;
        if (remCheck) remCheck.checked = true;
      }

      await getDbConnectionStatus();
      await getMe();
      fetchDashboardStats();
      fetchWords();
    }

    async function getDbConnectionStatus() {
      try {
        const res = await fetch("/api/words");
        if (res.ok) {
          document.getElementById("db-banner-text").innerText = "Connected to high-performance local MongoDB engine.";
          document.getElementById("db-banner").classList.add("bg-green-600/10", "text-green-500");
          document.getElementById("db-banner").classList.remove("bg-yellow-600/10", "text-yellow-500");
        }
      } catch (err) {
        document.getElementById("db-banner-text").innerText = "Database connection offline or starting...";
      }
    }

    async function getMe() {
      if (!token) {
        updateAuthUI(null);
        return;
      }
      try {
        const res = await fetch("/api/auth/me", {
          headers: { "Authorization": "Bearer " + token }
        });
        if (res.ok) {
          const data = await res.json();
          updateAuthUI(data.user);
        } else {
          localStorage.removeItem("token");
          token = "";
          updateAuthUI(null);
        }
      } catch (err) {
        updateAuthUI(null);
      }
    }

    function updateAuthUI(user) {
      currentUser = user;
      const section = document.getElementById("auth-section");
      const streakBadge = document.getElementById("streak-badge");
      const dashAnon = document.getElementById("dashboard-anon");
      const dashUser = document.getElementById("dashboard-user-stats");
      const authScreen = document.getElementById("auth-screen-view");
      const appContainer = document.getElementById("app-dashboard-container");

      if (user) {
        if (authScreen) authScreen.classList.add("hidden");
        if (appContainer) appContainer.classList.remove("hidden");

        const displayName = user.fullName || user.username;
        if (section) {
          section.innerHTML = \`
            <div class="flex items-center space-x-2 shrink-0">
              <div class="flex items-center space-x-1.5 bg-yellow-500/10 border border-yellow-500/25 px-2.5 py-1 rounded-lg text-xs">
                <i class="fa-solid fa-user-astronaut text-yellow-500 text-xs"></i>
                <span class="text-gray-400 font-semibold hidden sm:inline">Seeker:</span>
                <span class="text-yellow-400 font-bold truncate max-w-[80px] sm:max-w-[140px]" title="\${displayName}">\${displayName}</span>
              </div>
              <button onclick="handleLogout()" class="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap flex items-center space-x-1 shadow-sm">
                <i class="fa-solid fa-right-from-bracket text-[11px]"></i>
                <span>Logout</span>
              </button>
            </div>
          \`;
        }
        const streakElem = document.getElementById("streak-count");
        if (streakElem) streakElem.innerText = user.streak || 0;
        if (streakBadge) streakBadge.classList.remove("hidden");
        
        if (dashAnon) dashAnon.classList.add("hidden");
        if (dashUser) dashUser.classList.remove("hidden");
        const statUserElem = document.getElementById("stat-username");
        if (statUserElem) statUserElem.innerText = user.username;
        
        const statFullName = document.getElementById("stat-fullname");
        if (statFullName) statFullName.innerText = user.fullName || "N/A";
        
        fetchSearchHistory();
      } else {
        if (appContainer) appContainer.classList.add("hidden");
        if (authScreen) authScreen.classList.remove("hidden");

        if (section) {
          section.innerHTML = \`
            <div class="flex items-center gap-2">
              <button onclick="openAuthModal('login')" class="border border-yellow-500/40 hover:bg-yellow-500/10 text-yellow-500 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer">
                Sign In
              </button>
              <button onclick="openAuthModal('register')" class="bg-gradient-to-r from-yellow-500 to-amber-500 hover:brightness-110 text-gray-950 px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition shadow-sm cursor-pointer">
                Sign Up
              </button>
            </div>
          \`;
        }
        if (streakBadge) streakBadge.classList.add("hidden");
        if (dashAnon) dashAnon.classList.remove("hidden");
        if (dashUser) dashUser.classList.add("hidden");
      }
      fetchDashboardStats();
    }

    function switchTab(tab) {
      if (tab !== "characters" && window.EpicAvatars) window.EpicAvatars.stopVoice();
      currentTab = tab;
      
      document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.classList.add("text-gray-400", "hover:text-yellow-500", "hover:bg-gray-800/30");
        btn.classList.remove("bg-yellow-600/10", "text-yellow-500", "border", "border-yellow-500/20");
      });
      const activeBtn = document.getElementById("btn-" + tab);
      if (activeBtn) {
        activeBtn.classList.remove("text-gray-400", "hover:text-yellow-500", "hover:bg-gray-800/30");
        activeBtn.classList.add("bg-yellow-600/10", "text-yellow-500", "border", "border-yellow-500/20");
      }

      ["dashboard", "vocab", "shlokas", "characters", "quiz"].forEach(t => {
        document.getElementById("tab-" + t).classList.add("hidden");
      });

      document.getElementById("tab-" + tab).classList.remove("hidden");

      if (tab === "dashboard") fetchDashboardStats();
      if (tab === "vocab") fetchWords();
      if (tab === "shlokas") fetchShlokas();
      if (tab === "characters") {
        fetchCharacters();
        initArena();
      }
    }

    // Modal Control & Auth Helpers
    let authMode = "login";

    function togglePasswordVisibility(inputId, iconId) {
      const inp = document.getElementById(inputId);
      const icon = document.getElementById(iconId);
      if (!inp || !icon) return;
      if (inp.type === "password") {
        inp.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
      } else {
        inp.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
      }
    }

    function checkPasswordStrength(val) {
      const bar = document.getElementById("strength-bar");
      const text = document.getElementById("strength-text");
      const container = document.getElementById("password-strength-container");
      if (!container || !bar || !text) return;
      if (!val || authMode !== "register") {
        container.classList.add("hidden");
        return;
      }
      container.classList.remove("hidden");
      let score = 0;
      if (val.length >= 6) score++;
      if (val.length >= 10) score++;
      if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;

      if (score <= 1) {
        bar.style.width = "25%";
        bar.className = "h-full bg-red-500 rounded-full transition-all duration-300";
        text.innerText = "Weak";
        text.className = "text-[10px] text-red-400 font-bold";
      } else if (score === 2) {
        bar.style.width = "50%";
        bar.className = "h-full bg-yellow-500 rounded-full transition-all duration-300";
        text.innerText = "Fair";
        text.className = "text-[10px] text-yellow-400 font-bold";
      } else if (score === 3) {
        bar.style.width = "75%";
        bar.className = "h-full bg-amber-400 rounded-full transition-all duration-300";
        text.innerText = "Strong";
        text.className = "text-[10px] text-amber-300 font-bold";
      } else {
        bar.style.width = "100%";
        bar.className = "h-full bg-emerald-400 rounded-full transition-all duration-300";
        text.innerText = "Epic";
        text.className = "text-[10px] text-emerald-400 font-bold";
      }
    }

    function openAuthModal(mode) {
      authMode = mode || "login";
      const authScreen = document.getElementById("auth-screen-view");
      const appContainer = document.getElementById("app-dashboard-container");
      if (authScreen) authScreen.classList.remove("hidden");
      if (appContainer) appContainer.classList.add("hidden");
      toggleAuthMode(authMode);
    }

    function closeAuthModal() {
      const authScreen = document.getElementById("auth-screen-view");
      const appContainer = document.getElementById("app-dashboard-container");
      if (authScreen) authScreen.classList.add("hidden");
      if (appContainer) appContainer.classList.remove("hidden");
    }

    function toggleAuthMode(mode) {
      authMode = mode;
      const errDiv = document.getElementById("auth-error");
      const succDiv = document.getElementById("auth-success");
      if (errDiv) errDiv.classList.add("hidden");
      if (succDiv) succDiv.classList.add("hidden");

      const title = document.getElementById("auth-modal-title");
      const subtitle = document.getElementById("auth-modal-subtitle");
      const heading = document.getElementById("auth-heading");
      const headerIcon = document.getElementById("auth-header-icon");
      
      const fullnameField = document.getElementById("fullname-field");
      const confirmPassField = document.getElementById("confirm-password-field");
      const loginExtrasRow = document.getElementById("login-extras-row");
      const forgotBtnContainer = document.getElementById("forgot-password-btn-container");
      const backToLoginContainer = document.getElementById("back-to-login-container");
      const quickDemoSection = document.getElementById("quick-demo-accounts");
      
      const submitText = document.getElementById("auth-submit-text");
      const passwordLabel = document.getElementById("password-label");
      const passwordStrengthContainer = document.getElementById("password-strength-container");

      ["login", "register", "forgot"].forEach(t => {
        const btn = document.getElementById("tab-btn-" + t);
        if (btn) {
          if (t === mode) {
            btn.className = "flex-1 py-2.5 rounded-xl transition-all duration-200 bg-yellow-500 text-gray-950 font-black shadow-md cursor-pointer";
          } else {
            btn.className = "flex-1 py-2.5 rounded-xl transition-all duration-200 text-gray-400 hover:text-yellow-400 hover:bg-gray-800/50 cursor-pointer";
          }
        }
      });

      if (mode === "login") {
        if (headerIcon) headerIcon.className = "fa-solid fa-shield-halved text-2xl";
        if (heading) heading.classList.add("hidden");
        if (title) title.classList.add("hidden");
        if (subtitle) subtitle.classList.add("hidden");
        if (fullnameField) fullnameField.classList.add("hidden");
        if (confirmPassField) confirmPassField.classList.add("hidden");
        if (loginExtrasRow) loginExtrasRow.classList.remove("hidden");
        if (quickDemoSection) quickDemoSection.classList.toggle("hidden", !quickDemoAllowed);
        if (forgotBtnContainer) forgotBtnContainer.classList.remove("hidden");
        if (backToLoginContainer) backToLoginContainer.classList.add("hidden");
        if (passwordLabel) passwordLabel.innerText = "Password";
        if (submitText) submitText.innerText = "Sign In";
        if (passwordStrengthContainer) passwordStrengthContainer.classList.add("hidden");
      } else if (mode === "register") {
        if (headerIcon) headerIcon.className = "fa-solid fa-user-plus text-2xl";
        if (heading) heading.classList.remove("hidden");
        if (title) { title.innerText = "Join the Sanctuary"; title.classList.remove("hidden"); }
        if (subtitle) { subtitle.innerText = "Create your account to save reviews & daily streaks"; subtitle.classList.remove("hidden"); }
        if (fullnameField) fullnameField.classList.remove("hidden");
        if (confirmPassField) confirmPassField.classList.remove("hidden");
        if (loginExtrasRow) loginExtrasRow.classList.add("hidden");
        if (quickDemoSection) quickDemoSection.classList.add("hidden");
        if (forgotBtnContainer) forgotBtnContainer.classList.add("hidden");
        if (backToLoginContainer) backToLoginContainer.classList.add("hidden");
        if (passwordLabel) passwordLabel.innerText = "Password";
        if (submitText) submitText.innerText = "Create Account";
        const passVal = document.getElementById("auth-password") ? document.getElementById("auth-password").value : "";
        if (passVal) checkPasswordStrength(passVal);
      } else if (mode === "forgot") {
        if (headerIcon) headerIcon.className = "fa-solid fa-key-skeleton text-2xl";
        if (heading) heading.classList.remove("hidden");
        if (title) { title.innerText = "Reset Password"; title.classList.remove("hidden"); }
        if (subtitle) { subtitle.innerText = "Enter your username and set a new account password"; subtitle.classList.remove("hidden"); }
        if (fullnameField) fullnameField.classList.add("hidden");
        if (confirmPassField) confirmPassField.classList.remove("hidden");
        if (loginExtrasRow) loginExtrasRow.classList.add("hidden");
        if (quickDemoSection) quickDemoSection.classList.add("hidden");
        if (forgotBtnContainer) forgotBtnContainer.classList.add("hidden");
        if (backToLoginContainer) backToLoginContainer.classList.remove("hidden");
        if (passwordLabel) passwordLabel.innerText = "New Password";
        if (submitText) submitText.innerText = "Reset & Update Password";
        if (passwordStrengthContainer) passwordStrengthContainer.classList.add("hidden");
      }
    }

    function quickFillLogin(u, p) {
      const userInp = document.getElementById("auth-username");
      const passInp = document.getElementById("auth-password");
      if (userInp) userInp.value = u;
      if (passInp) passInp.value = p;
    }

    async function quickDemoLogin(u, p) {
      quickFillLogin(u, p);
      toggleAuthMode("login");
      const submitBtn = document.getElementById("auth-submit-btn");
      const submitText = document.getElementById("auth-submit-text");
      if (submitText) submitText.innerText = "Signing In...";
      if (submitBtn) submitBtn.disabled = true;

      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: u, password: p })
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem("token", data.token);
          token = data.token;
          closeAuthModal();
          updateAuthUI(data.user);
        } else {
          const errorDiv = document.getElementById("auth-error");
          const errorMsg = document.getElementById("auth-error-msg");
          if (errorMsg) errorMsg.innerText = data.error || "Authentication failed.";
          if (errorDiv) errorDiv.classList.remove("hidden");
        }
      } catch (err) {
        const errorDiv = document.getElementById("auth-error");
        const errorMsg = document.getElementById("auth-error-msg");
        if (errorMsg) errorMsg.innerText = "Connection failed. Please check server status.";
        if (errorDiv) errorDiv.classList.remove("hidden");
      } finally {
        if (submitText) submitText.innerText = "Sign In";
        if (submitBtn) submitBtn.disabled = false;
      }
    }

    function switchToRegisterWith(u) {
      toggleAuthMode("register");
      const userInp = document.getElementById("auth-username");
      const nameInp = document.getElementById("auth-fullname");
      if (userInp) userInp.value = u;
      if (nameInp) nameInp.value = u;
      const passInp = document.getElementById("auth-password");
      if (passInp) passInp.focus();
    }

    async function handleAuthSubmit(e) {
      e.preventDefault();
      const errorDiv = document.getElementById("auth-error");
      const errorMsg = document.getElementById("auth-error-msg");
      const successDiv = document.getElementById("auth-success");
      const successMsg = document.getElementById("auth-success-msg");

      if (errorDiv) errorDiv.classList.add("hidden");
      if (successDiv) successDiv.classList.add("hidden");

      const usernameInput = document.getElementById("auth-username");
      const username = usernameInput ? usernameInput.value.trim() : "";
      const rememberCheckbox = document.getElementById("auth-remember");

      if (authMode === "login") {
        const passwordInput = document.getElementById("auth-password");
        const password = passwordInput ? passwordInput.value : "";
        const submitBtn = document.getElementById("auth-submit-btn");
        const submitText = document.getElementById("auth-submit-text");
        if (submitText) submitText.innerText = "Signing in...";
        if (submitBtn) submitBtn.disabled = true;

        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
          });
          const data = await res.json();
          if (res.ok) {
            localStorage.setItem("token", data.token);
            token = data.token;
            if (rememberCheckbox && rememberCheckbox.checked) {
              localStorage.setItem("rememberedUsername", username);
            } else {
              localStorage.removeItem("rememberedUsername");
            }
            closeAuthModal();
            updateAuthUI(data.user);
          } else {
            if (errorMsg) {
              errorMsg.innerText = data.error || "Authentication failed.";
            }
            if (errorDiv) errorDiv.classList.remove("hidden");
          }
        } catch (err) {
          if (errorMsg) errorMsg.innerText = "Connection failed. Please verify network or server.";
          if (errorDiv) errorDiv.classList.remove("hidden");
        } finally {
          if (submitText) submitText.innerText = "Sign In";
          if (submitBtn) submitBtn.disabled = false;
        }
      } else if (authMode === "register") {
        const fullNameInput = document.getElementById("auth-fullname");
        const fullName = fullNameInput ? fullNameInput.value.trim() : "";
        const passwordInput = document.getElementById("auth-password");
        const password = passwordInput ? passwordInput.value : "";
        const confirmInput = document.getElementById("auth-confirm-password");
        const confirmPassword = confirmInput ? confirmInput.value : "";

        if (password !== confirmPassword) {
          if (errorMsg) errorMsg.innerText = "Passwords do not match.";
          if (errorDiv) errorDiv.classList.remove("hidden");
          return;
        }

        const submitBtn = document.getElementById("auth-submit-btn");
        const submitText = document.getElementById("auth-submit-text");
        if (submitText) submitText.innerText = "Creating Account...";
        if (submitBtn) submitBtn.disabled = true;

        try {
          const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, fullName: fullName || username })
          });
          const data = await res.json();
          if (res.ok) {
            localStorage.setItem("token", data.token);
            token = data.token;
            closeAuthModal();
            updateAuthUI(data.user);
          } else {
            if (errorMsg) errorMsg.innerText = data.error || "Registration failed.";
            if (errorDiv) errorDiv.classList.remove("hidden");
          }
        } catch (err) {
          if (errorMsg) errorMsg.innerText = "Connection failed.";
          if (errorDiv) errorDiv.classList.remove("hidden");
        } finally {
          if (submitText) submitText.innerText = "Create Account";
          if (submitBtn) submitBtn.disabled = false;
        }
      } else if (authMode === "forgot") {
        const passwordInput = document.getElementById("auth-password");
        const newPassword = passwordInput ? passwordInput.value : "";
        const confirmInput = document.getElementById("auth-confirm-password");
        const confirmPassword = confirmInput ? confirmInput.value : "";

        if (!newPassword || newPassword.length < 6) {
          if (errorMsg) errorMsg.innerText = "New password must be at least 6 characters long.";
          if (errorDiv) errorDiv.classList.remove("hidden");
          return;
        }

        if (newPassword !== confirmPassword) {
          if (errorMsg) errorMsg.innerText = "Passwords do not match.";
          if (errorDiv) errorDiv.classList.remove("hidden");
          return;
        }

        try {
          const res = await fetch("/api/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, newPassword, confirmPassword })
          });
          const data = await res.json();
          if (res.ok) {
            if (successMsg) successMsg.innerText = data.message || "Password updated successfully!";
            if (successDiv) successDiv.classList.remove("hidden");
            setTimeout(() => {
              toggleAuthMode("login");
              if (usernameInput) usernameInput.value = username;
              if (passwordInput) passwordInput.value = "";
              if (confirmInput) confirmInput.value = "";
              if (successDiv) successDiv.classList.add("hidden");
            }, 1800);
          } else {
            if (errorMsg) errorMsg.innerText = data.error || "Password reset failed.";
            if (errorDiv) errorDiv.classList.remove("hidden");
          }
        } catch (err) {
          if (errorMsg) errorMsg.innerText = "Connection failed.";
          if (errorDiv) errorDiv.classList.remove("hidden");
        }
      }
    }

    async function startGuestSession() {
      try {
        const res = await fetch("/api/auth/login-guest", { method: "POST" });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem("token", data.token);
          token = data.token;
          closeAuthModal();
          updateAuthUI(data.user);
        }
      } catch (err) {
        console.error(err);
      }
    }

    function handleLogout() {
      localStorage.removeItem("token");
      token = "";
      updateAuthUI(null);
    }

    // Fetch Dashboard Stats
    async function fetchDashboardStats() {
      if (!token) {
        document.getElementById("stat-streak").innerText = "0 Days";
        document.getElementById("stat-mastered").innerText = "0";
        document.getElementById("stat-due").innerText = "0";
        return;
      }
      try {
        const res = await fetch("/api/progress/stats", {
          headers: { "Authorization": "Bearer " + token }
        });
        if (res.ok) {
          const data = await res.json();
          document.getElementById("stat-total").innerText = data.totalWords;
          document.getElementById("stat-streak").innerText = (currentUser ? currentUser.streak : 0) + " Days";
          document.getElementById("stat-mastered").innerText = data.masteredCount;
          document.getElementById("stat-due").innerText = data.dueReviewsCount;
        }
      } catch (err) {
        console.error(err);
      }
    }

    // Fetch Search History
    async function fetchSearchHistory() {
      if (!token) return;
      try {
        const res = await fetch("/api/search-history", {
          headers: { "Authorization": "Bearer " + token }
        });
        if (res.ok) {
          const list = await res.json();
          const div = document.getElementById("search-history-list");
          if (list.length === 0) {
            div.innerHTML = "<span class='italic'>No recent search history</span>";
            return;
          }
          div.innerHTML = list.map(h => \`
            <span onclick="applyRecentSearch('\${h.query}')" class="bg-gray-800 hover:bg-yellow-600/20 hover:text-yellow-500 cursor-pointer px-2 py-1 rounded transition border border-gray-700/50">
              \${h.query}
            </span>
          \`).join("");
        }
      } catch (err) {
        console.error(err);
      }
    }

    function applyRecentSearch(query) {
      switchTab("vocab");
      document.getElementById("vocab-search").value = query;
      fetchWords();
    }

    // Fetch Words List (with Pagination & 500+ items support)
    async function fetchWords() {
      const search = document.getElementById("vocab-search").value;
      const difficulty = document.getElementById("vocab-filter").value;
      
      let url = \`/api/words?page=\${vocabCurrentPage}&limit=15\`;
      if (search) url += "&search=" + encodeURIComponent(search);
      if (difficulty) url += "&difficulty=" + difficulty;

      try {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          activeWords = data.words || [];
          vocabTotalPages = data.pagination ? data.pagination.pages : 1;
          const totalCount = data.pagination ? data.pagination.total : activeWords.length;
          
          document.getElementById("vocab-total-badge").innerText = \`Showing \${activeWords.length} of \${totalCount} words\`;
          document.getElementById("vocab-page-indicator").innerText = \`Page \${vocabCurrentPage} / \${vocabTotalPages}\`;
          
          document.getElementById("btn-vocab-prev").disabled = vocabCurrentPage <= 1;
          document.getElementById("btn-vocab-next").disabled = vocabCurrentPage >= vocabTotalPages;

          renderWordsList();

          if (search && token) {
            fetch("/api/search-history", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
              },
              body: JSON.stringify({ query: search })
            });
            fetchSearchHistory();
          }
        }
      } catch (err) {
        console.error(err);
      }
    }

    function changeVocabPage(delta) {
      vocabCurrentPage += delta;
      if (vocabCurrentPage < 1) vocabCurrentPage = 1;
      if (vocabCurrentPage > vocabTotalPages) vocabCurrentPage = vocabTotalPages;
      fetchWords();
    }

    let currentVocabIndex = -1;

    function renderWordsList() {
      const container = document.getElementById("vocab-list");
      if (!container) return;
      if (activeWords.length === 0) {
        container.innerHTML = \`
          <div class="col-span-full text-center py-16 text-gray-500 space-y-3 bg-[#161a23]/30 border border-gray-800/80 rounded-xl">
            <i class="fa-solid fa-magnifying-glass text-4xl text-gray-600"></i>
            <p class="text-sm">No words match your search criteria or difficulty level.</p>
          </div>
        \`;
        return;
      }

      container.innerHTML = activeWords.map((w) => {
        const diffClass = w.difficulty === "easy" ? "bg-green-500/10 text-green-400 border-green-500/20" 
                        : w.difficulty === "medium" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20";
        return \`
          <div onclick="openVocabModal('\${w._id}')" class="group bg-[#161a23]/40 hover:bg-[#1c2230] border border-gray-800 hover:border-yellow-500/50 p-4 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-[0_0_20px_rgba(234,179,8,0.15)] flex flex-col justify-between space-y-3">
            <div class="space-y-1.5">
              <div class="flex items-start justify-between gap-2">
                <h4 class="epic-title text-lg font-bold text-yellow-500 group-hover:text-yellow-400 transition">\${w.arabic}</h4>
                <span class="text-[10px] font-semibold border px-2 py-0.5 rounded-full uppercase tracking-wider \${diffClass} shrink-0">
                  \${w.difficulty}
                </span>
              </div>
              <p class="text-xs text-gray-300 font-semibold italic">\${w.transliteration}</p>
              <p class="text-xs text-yellow-500/90 font-medium line-clamp-1">\${w.translation}</p>
              <p class="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">\${w.meaning}</p>
            </div>

            <div class="pt-2 border-t border-gray-800/60 flex items-center justify-between text-[11px] text-gray-400">
              <span class="text-gray-500"><i class="fa-solid fa-book-bookmark text-yellow-500/70 mr-1"></i> \${w.occurrences || 0} occurrences</span>
              <span class="text-yellow-500/90 group-hover:translate-x-1 transition-transform font-bold flex items-center gap-1">
                View Details <i class="fa-solid fa-arrow-right text-[10px]"></i>
              </span>
            </div>
          </div>
        \`;
      }).join("");
    }

    function openVocabModal(id) {
      const index = activeWords.findIndex(w => w._id === id);
      if (index === -1) return;
      currentVocabIndex = index;
      renderVocabModalContent(activeWords[index]);
      const modal = document.getElementById("vocab-modal");
      if (modal) {
        modal.classList.remove("hidden");
      }
    }

    function selectWord(id) {
      openVocabModal(id);
    }

    function navigateVocabModal(delta) {
      if (activeWords.length === 0) return;
      let newIndex = currentVocabIndex + delta;
      if (newIndex < 0) newIndex = activeWords.length - 1;
      if (newIndex >= activeWords.length) newIndex = 0;
      currentVocabIndex = newIndex;
      renderVocabModalContent(activeWords[newIndex]);
    }

    function closeVocabModal() {
      const modal = document.getElementById("vocab-modal");
      if (modal) {
        modal.classList.add("hidden");
      }
    }

    function handleVocabModalBackdrop(e) {
      if (e.target.id === "vocab-modal") {
        closeVocabModal();
      }
    }

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeVocabModal();
        if (typeof closeCharacterModal === "function") closeCharacterModal();
      }
    });

    function renderVocabModalContent(word) {
      if (!word) return;
      selectedWord = word;
      const modalContent = document.getElementById("vocab-modal-content");
      if (!modalContent) return;

      const diffClass = word.difficulty === "easy" ? "bg-green-500/10 text-green-400 border-green-500/20" 
                      : word.difficulty === "medium" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20";

      const exampleText = word.examples && word.examples.length > 0 ? word.examples[0].arabicText : "";
      const exampleTrans = word.examples && word.examples.length > 0 ? word.examples[0].translationText : "";
      const exampleVerse = word.examples && word.examples.length > 0 ? \`Chapter \${word.examples[0].surah}, Verse \${word.examples[0].ayah}\` : "";

      modalContent.innerHTML = \`
        <div class="space-y-5">
          <!-- Top Category & Difficulty -->
          <div class="flex items-center justify-between pr-8">
            <span class="text-xs text-yellow-500/90 font-bold uppercase tracking-wider">\${word.grammarSegment || 'Vocabulary Word'}</span>
            <span class="text-[10px] font-semibold border px-2.5 py-0.5 rounded-full uppercase tracking-wider \${diffClass}">
              \${word.difficulty}
            </span>
          </div>

          <!-- Sanskrit Title Header -->
          <div class="border-b border-gray-800/80 pb-4">
            <h3 class="epic-title text-3xl sm:text-4xl font-extrabold text-yellow-500 tracking-wide">\${word.arabic}</h3>
            <p class="text-sm sm:text-base text-gray-300 italic mt-1 font-medium">Transliteration: <span class="text-yellow-400 font-bold">\${word.transliteration}</span></p>
          </div>

          <!-- English Translation -->
          <div class="bg-yellow-500/10 border border-yellow-500/25 p-3.5 rounded-xl space-y-1">
            <h4 class="text-[11px] uppercase font-bold text-yellow-500 tracking-wider">English Translation</h4>
            <p class="text-lg font-bold text-yellow-300">\${word.translation}</p>
          </div>

          <!-- Etymology & Meaning -->
          <div class="space-y-2">
            <h4 class="text-xs uppercase font-bold text-gray-400 tracking-wider">Detailed Etymology & Meaning</h4>
            <p class="text-sm text-gray-200 leading-relaxed font-medium bg-[#121520] border border-gray-800/80 p-4 rounded-xl">\${word.meaning}</p>
            <div class="flex flex-wrap gap-4 text-xs text-gray-400 pt-1">
              \${word.rootWord ? \`<p>Sanskrit Root: <span class="font-bold text-yellow-500">\${word.rootWord}</span></p>\` : ''}
              <p>Gita Frequency: <span class="font-bold text-gray-200">\${word.occurrences || 0} occurrences</span></p>
            </div>
          </div>

          <!-- Sacred Verse Usage Example -->
          \${exampleText ? \`
            <div class="bg-[#12141c] border border-yellow-500/20 p-4 rounded-xl space-y-2">
              <div class="flex justify-between items-center">
                <h5 class="text-[11px] uppercase font-bold tracking-widest text-yellow-500 flex items-center gap-1.5">
                  <i class="fa-solid fa-scroll text-yellow-500"></i> Sacred Usage Example
                </h5>
                \${exampleVerse ? \`<span class="text-[10px] text-gray-400 font-bold">\${exampleVerse}</span>\` : ''}
              </div>
              <p class="epic-text text-base sm:text-lg text-yellow-400 font-medium font-serif italic">\${exampleText}</p>
              \${exampleTrans ? \`<p class="text-xs text-gray-300 leading-relaxed">\${exampleTrans}</p>\` : ''}
            </div>
          \` : ''}

          <!-- Spaced Repetition Review (SM-2) -->
          <div class="pt-4 border-t border-gray-800 space-y-3">
            <h4 class="text-xs uppercase font-bold text-gray-300 tracking-wider flex items-center justify-between">
              <span>Spaced Repetition Review (SM-2 Algorithm)</span>
              <span class="text-[10px] text-yellow-500 font-normal">Rate recall strength</span>
            </h4>
            
            \${!token ? \`
              <div class="bg-gray-800/40 border border-gray-700/60 p-3.5 rounded-xl text-xs text-gray-300 flex items-center justify-between gap-3">
                <p class="text-gray-400"><i class="fa-solid fa-lock text-yellow-500 mr-1.5"></i> Sign in or start a Guest session to log memory recall.</p>
                <button onclick="closeVocabModal(); openAuthModal('login')" class="bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-bold px-3 py-1.5 rounded-lg text-xs shrink-0 transition cursor-pointer">Sign In</button>
              </div>
            \` : \`
              <p class="text-[11px] text-gray-400">Select recall difficulty level (0 = Forgotten, 5 = Perfect Recall):</p>
              <div class="grid grid-cols-6 gap-2">
                \${[0,1,2,3,4,5].map(rating => \`
                  <button onclick="submitReview('\${word._id}', \${rating})" class="bg-gray-800 hover:bg-yellow-500 text-gray-200 hover:text-gray-950 border border-gray-700 hover:border-yellow-400 py-2 rounded-lg font-bold text-xs transition cursor-pointer flex flex-col items-center">
                    <span class="text-sm font-black">\${rating}</span>
                    <span class="text-[9px] opacity-75">\${rating === 0 ? 'Again' : rating === 5 ? 'Easy' : 'Good'}</span>
                  </button>
                \`).join("")}
              </div>
              <div id="review-feedback" class="hidden text-xs text-green-400 font-bold text-center py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg"></div>
            \`}
          </div>

          <!-- Footer Action & Modal Nav -->
          <div class="pt-4 border-t border-gray-800 flex items-center justify-between gap-3 flex-wrap">
            <div class="flex items-center gap-2">
              <button onclick="navigateVocabModal(-1)" class="bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer">
                <i class="fa-solid fa-chevron-left text-[10px]"></i> Prev Word
              </button>
              <button onclick="navigateVocabModal(1)" class="bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer">
                Next Word <i class="fa-solid fa-chevron-right text-[10px]"></i>
              </button>
            </div>

            <button onclick="closeVocabModal()" class="bg-gradient-to-r from-yellow-500 to-amber-500 hover:brightness-110 text-gray-950 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-md">
              <i class="fa-solid fa-xmark mr-1"></i> Close & Search More
            </button>
          </div>
        </div>
      \`;
    }

    async function submitReview(wordId, rating) {
      if (!token) return;
      try {
        const res = await fetch("/api/progress/review", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify({ wordId, rating })
        });
        const data = await res.json();
        if (res.ok) {
          const feedback = document.getElementById("review-feedback");
          feedback.innerText = \`Review saved! Next recall check in \${data.progress.interval} days.\`;
          feedback.classList.remove("hidden");
          setTimeout(() => feedback.classList.add("hidden"), 4000);
          fetchDashboardStats();
        }
      } catch (err) {
        console.error(err);
      }
    }

    // Gita Language Switcher
    function setGitaLang(lang) {
      currentGitaLang = lang;
      ["en", "bn", "bn-en", "hi", "all"].forEach(l => {
        const btn = document.getElementById("gita-lang-" + l);
        if (btn) {
          if (l === lang) {
            btn.className = "px-2.5 py-1 rounded transition bg-yellow-500 text-gray-950 font-bold";
          } else {
            btn.className = "px-2.5 py-1 rounded transition text-gray-400 hover:text-yellow-500";
          }
        }
      });
      renderShlokas();
    }

    // Speech Recitation Synthesis for Verses
    function speakVerse(text, lang) {
      lang = lang || "hi-IN";
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const cleanText = (text || "").split(String.fromCharCode(10)).join(" ").split(String.fromCharCode(13)).join(" ");
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 0.85;
        utterance.pitch = 1.0;
        utterance.lang = lang;
        window.speechSynthesis.speak(utterance);
      } else {
        alert("Audio recitation is not supported on this browser.");
      }
    }

    function readShlokaAudio(chapter, verse, type) {
      const s = activeShlokas.find(function(item) { return item.chapter === chapter && item.verse === verse; });
      if (!s) return;
      if (type === "sanskrit") {
        speakVerse(s.sanskrit, "hi-IN");
      } else if (type === "en") {
        const text = s.translation + (s.explanation ? (". " + s.explanation) : "");
        speakVerse(text, "en-US");
      } else if (type === "hi") {
        const hiTrans = s.translationHindi || s.translation || "";
        const hiExp = s.explanationHindi || s.explanation || "";
        const text = hiTrans + (hiExp ? (". " + hiExp) : "");
        speakVerse(text, "hi-IN");
      } else if (type === "bn") {
        const bnTrans = s.translationBengali || s.translation || "";
        const bnExp = s.explanationBengali || s.explanation || "";
        const text = bnTrans + (bnExp ? (". " + bnExp) : "");
        speakVerse(text, "bn-IN");
      }
    }

    // Voice search using microphone for Bhagavad Gita Verses
    let isShlokaListening = false;
    let shlokaRecognition = null;

    function startShlokaVoiceSearch() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Voice speech recognition is not supported in this browser. Please try Chrome, Edge, or Safari.");
        return;
      }

      const micBtn = document.getElementById("shloka-mic-btn");
      const micStatus = document.getElementById("shloka-mic-status");
      const searchInp = document.getElementById("shloka-search");

      if (isShlokaListening && shlokaRecognition) {
        shlokaRecognition.stop();
        return;
      }

      try {
        shlokaRecognition = new SpeechRecognition();
        shlokaRecognition.continuous = false;
        shlokaRecognition.interimResults = true;
        
        if (typeof currentGitaLang !== "undefined") {
          if (currentGitaLang === "hi") shlokaRecognition.lang = "hi-IN";
          else if (currentGitaLang === "bn" || currentGitaLang === "bn-en") shlokaRecognition.lang = "bn-IN";
          else shlokaRecognition.lang = "en-US";
        } else {
          shlokaRecognition.lang = "en-US";
        }

        shlokaRecognition.onstart = function() {
          isShlokaListening = true;
          if (micBtn) {
            micBtn.classList.add("text-red-500", "animate-pulse");
            micBtn.classList.remove("text-gray-400");
          }
          if (micStatus) micStatus.classList.remove("hidden");
        };

        shlokaRecognition.onresult = function(event) {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (searchInp) {
            searchInp.value = transcript;
            fetchShlokas();
          }
        };

        shlokaRecognition.onerror = function(event) {
          console.warn("Shloka voice search error:", event.error);
          stopShlokaListeningUI();
        };

        shlokaRecognition.onend = function() {
          stopShlokaListeningUI();
        };

        shlokaRecognition.start();
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
        stopShlokaListeningUI();
      }
    }

    function stopShlokaListeningUI() {
      isShlokaListening = false;
      const micBtn = document.getElementById("shloka-mic-btn");
      const micStatus = document.getElementById("shloka-mic-status");
      if (micBtn) {
        micBtn.classList.remove("text-red-500", "animate-pulse");
        micBtn.classList.add("text-gray-400");
      }
      if (micStatus) micStatus.classList.add("hidden");
    }

    // Fetch Shlokas
    async function fetchShlokas() {
      const chapter = document.getElementById("shloka-chapter").value;
      const search = document.getElementById("shloka-search") ? document.getElementById("shloka-search").value : "";
      
      let url = "/api/shlokas";
      const params = [];
      if (chapter) params.push("chapter=" + chapter);
      if (search) params.push("search=" + encodeURIComponent(search));
      if (params.length > 0) url += "?" + params.join("&");

      try {
        const res = await fetch(url);
        if (res.ok) {
          activeShlokas = await res.json();
          renderShlokas();
        }
      } catch (err) {
        console.error(err);
      }
    }

    function renderShlokas() {
      const container = document.getElementById("shlokas-list");
      if (activeShlokas.length === 0) {
        container.innerHTML = "<div class='text-center py-10 text-gray-500 text-sm'>No Shlokas match the search or filter.</div>";
        return;
      }

      container.innerHTML = activeShlokas.map(s => {
        const hiTrans = s.translationHindi || s.translation;
        const bnTrans = s.translationBengali || s.translation;
        const hiExp = s.explanationHindi || s.explanation;
        const bnExp = s.explanationBengali || s.explanation;

        let translationBlock = "";

        if (currentGitaLang === "en") {
          translationBlock = \`
            <div class="space-y-2 bg-[#11131a]/40 p-4 rounded-lg border border-gray-800/60">
              <div class="flex items-center justify-between pb-1 border-b border-gray-800/60">
                <span class="text-yellow-500 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"><i class="fa-solid fa-book-open"></i> English Translation</span>
                <button onclick="readShlokaAudio(\${s.chapter}, \${s.verse}, 'en')" title="Listen in English" class="text-xs text-yellow-500 hover:text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20 px-2.5 py-1 rounded font-bold transition flex items-center gap-1">
                  <i class="fa-solid fa-volume-high"></i>
                  <span>Listen Out Loud</span>
                </button>
              </div>
              <p class="text-gray-200 font-medium leading-relaxed text-sm md:text-base pt-1">\${s.translation}</p>
              <p class="text-gray-300 leading-relaxed text-xs md:text-sm pt-2 border-t border-gray-800/80"><strong class="text-yellow-600 uppercase text-[10px] tracking-wider block mb-0.5">Commentary</strong>\${s.explanation}</p>
            </div>
          \`;
        } else if (currentGitaLang === "hi") {
          translationBlock = \`
            <div class="space-y-2 bg-[#11131a]/40 p-4 rounded-lg border border-amber-900/30">
              <div class="flex items-center justify-between pb-1 border-b border-gray-800/60">
                <span class="text-amber-500 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"><i class="fa-solid fa-om"></i> हिंदी अनुवाद</span>
                <button onclick="readShlokaAudio(\${s.chapter}, \${s.verse}, 'hi')" title="Listen in Hindi" class="text-xs text-amber-500 hover:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded font-bold transition flex items-center gap-1">
                  <i class="fa-solid fa-volume-high"></i>
                  <span>हिंदी में सुनें</span>
                </button>
              </div>
              <p class="text-gray-200 font-medium leading-relaxed text-sm md:text-base pt-1">\${hiTrans}</p>
              <p class="text-gray-300 leading-relaxed text-xs md:text-sm pt-2 border-t border-gray-800/80"><strong class="text-amber-600 uppercase text-[10px] tracking-wider block mb-0.5">व्याख्या (Commentary)</strong>\${hiExp}</p>
            </div>
          \`;
        } else if (currentGitaLang === "bn") {
          translationBlock = \`
            <div class="space-y-2 bg-[#11131a]/60 p-4 rounded-lg border border-emerald-900/40">
              <div class="flex items-center justify-between pb-1 border-b border-gray-800/60">
                <span class="text-emerald-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"><i class="fa-solid fa-language"></i> বাংলা অনুবাদ (Bangla Translation)</span>
                <button onclick="readShlokaAudio(\${s.chapter}, \${s.verse}, 'bn')" title="Listen in Bangla" class="text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded font-bold transition flex items-center gap-1">
                  <i class="fa-solid fa-volume-high"></i>
                  <span>বাংলায় শুনুন</span>
                </button>
              </div>
              <p class="text-gray-200 font-semibold leading-relaxed text-sm md:text-base pt-1">\${bnTrans}</p>
              <p class="text-gray-300 leading-relaxed text-xs md:text-sm pt-2 border-t border-gray-800/80"><strong class="text-emerald-500 uppercase text-[10px] tracking-wider block mb-0.5">ব্যাখ্যা (Bangla Commentary)</strong>\${bnExp}</p>
            </div>
          \`;
        } else if (currentGitaLang === "bn-en") {
          translationBlock = \`
            <div class="grid md:grid-cols-2 gap-4 pt-2 border-t border-gray-800/60">
              <div class="bg-[#11131a] p-3.5 rounded-lg border border-emerald-900/40 space-y-2">
                <div class="flex items-center justify-between pb-1 border-b border-gray-800/80">
                  <span class="text-xs uppercase font-bold text-emerald-400 flex items-center gap-1.5"><i class="fa-solid fa-language"></i> বাংলা (Bangla)</span>
                  <button onclick="readShlokaAudio(\${s.chapter}, \${s.verse}, 'bn')" title="Listen in Bangla" class="text-[11px] text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-0.5 rounded font-bold transition flex items-center gap-1">
                    <i class="fa-solid fa-volume-high"></i>
                    <span>বাংলায় শুনুন</span>
                  </button>
                </div>
                <p class="text-xs md:text-sm text-gray-200 font-medium leading-relaxed">\${bnTrans}</p>
                <p class="text-xs text-gray-400 pt-1.5 border-t border-gray-800/80 leading-relaxed"><strong class="text-emerald-500 block text-[10px] uppercase tracking-wider mb-0.5">ব্যাখ্যা (Commentary)</strong>\${bnExp}</p>
              </div>
              <div class="bg-[#11131a] p-3.5 rounded-lg border border-yellow-900/40 space-y-2">
                <div class="flex items-center justify-between pb-1 border-b border-gray-800/80">
                  <span class="text-xs uppercase font-bold text-yellow-500 flex items-center gap-1.5"><i class="fa-solid fa-book-open"></i> English</span>
                  <button onclick="readShlokaAudio(\${s.chapter}, \${s.verse}, 'en')" title="Listen in English" class="text-[11px] text-yellow-500 hover:text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20 px-2 py-0.5 rounded font-bold transition flex items-center gap-1">
                    <i class="fa-solid fa-volume-high"></i>
                    <span>Listen</span>
                  </button>
                </div>
                <p class="text-xs md:text-sm text-gray-200 font-medium leading-relaxed">\${s.translation}</p>
                <p class="text-xs text-gray-400 pt-1.5 border-t border-gray-800/80 leading-relaxed"><strong class="text-yellow-600 block text-[10px] uppercase tracking-wider mb-0.5">English Commentary</strong>\${s.explanation}</p>
              </div>
            </div>
          \`;
        } else {
          // All Languages Side by Side / Stacked
          translationBlock = \`
            <div class="grid md:grid-cols-3 gap-4 pt-2 border-t border-gray-800/60">
              <div class="bg-[#11131a] p-3 rounded-lg border border-gray-800 space-y-2">
                <div class="flex items-center justify-between pb-1 border-b border-gray-800/80">
                  <span class="text-[10px] uppercase font-bold text-yellow-500">English</span>
                  <button onclick="readShlokaAudio(\${s.chapter}, \${s.verse}, 'en')" title="Listen in English" class="text-[10px] text-yellow-500 hover:text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20 px-1.5 py-0.5 rounded font-bold transition flex items-center gap-1">
                    <i class="fa-solid fa-volume-high"></i>
                    <span>Listen</span>
                  </button>
                </div>
                <p class="text-xs text-gray-200 font-medium">\${s.translation}</p>
                <p class="text-[11px] text-gray-400 pt-1">\${s.explanation}</p>
              </div>
              <div class="bg-[#11131a] p-3 rounded-lg border border-gray-800 space-y-2">
                <div class="flex items-center justify-between pb-1 border-b border-gray-800/80">
                  <span class="text-[10px] uppercase font-bold text-amber-500">हिंदी (Hindi)</span>
                  <button onclick="readShlokaAudio(\${s.chapter}, \${s.verse}, 'hi')" title="Listen in Hindi" class="text-[10px] text-amber-500 hover:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-1.5 py-0.5 rounded font-bold transition flex items-center gap-1">
                    <i class="fa-solid fa-volume-high"></i>
                    <span>सुनें</span>
                  </button>
                </div>
                <p class="text-xs text-gray-200 font-medium">\${hiTrans}</p>
                <p class="text-[11px] text-gray-400 pt-1">\${hiExp}</p>
              </div>
              <div class="bg-[#11131a] p-3 rounded-lg border border-gray-800 space-y-2">
                <div class="flex items-center justify-between pb-1 border-b border-gray-800/80">
                  <span class="text-[10px] uppercase font-bold text-emerald-400">বাংলা (Bangla)</span>
                  <button onclick="readShlokaAudio(\${s.chapter}, \${s.verse}, 'bn')" title="Listen in Bangla" class="text-[10px] text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-1.5 py-0.5 rounded font-bold transition flex items-center gap-1">
                    <i class="fa-solid fa-volume-high"></i>
                    <span>শুনুন</span>
                  </button>
                </div>
                <p class="text-xs text-gray-200 font-medium">\${bnTrans}</p>
                <p class="text-[11px] text-gray-400 pt-1">\${bnExp}</p>
              </div>
            </div>
          \`;
        }

        return \`
          <div class="bg-[#161a23]/30 border border-gray-800/80 rounded-xl p-5 space-y-4 shadow-md hover:border-yellow-500/20 transition">
            <div class="flex items-center justify-between border-b border-gray-800/60 pb-3">
              <span class="text-xs text-yellow-600 font-bold uppercase tracking-wider">\${s.chapterName}</span>
              <div class="flex items-center space-x-3">
                <span class="text-xs text-gray-400 font-bold">Chapter \${s.chapter}, Verse \${s.verse}</span>
                <button onclick="readShlokaAudio(\${s.chapter}, \${s.verse}, 'sanskrit')" title="Listen to Sanskrit Recitation Out Loud" class="text-yellow-500 hover:text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20 px-2.5 py-1 rounded text-xs font-bold transition flex items-center space-x-1">
                  <i class="fa-solid fa-volume-high"></i>
                  <span>Recite (Sanskrit)</span>
                </button>
              </div>
            </div>

            <div class="text-center py-2">
              <p class="epic-text text-xl md:text-2xl text-yellow-500 font-serif font-semibold whitespace-pre-line leading-relaxed">\${s.sanskrit}</p>
            </div>

            <p class="text-xs text-gray-400 italic text-center">Transliteration: <span class="text-gray-300 font-medium">\${s.transliteration}</span></p>

            \${translationBlock}
          </div>
        \`;
      }).join("");
    }

    // Character Avatar SVG & Sanskrit Name Helper
    function getCharacterSanskritName(name) {
      const map = {
        "Arjuna": "अर्जुनः",
        "Krishna": "श्रीकृष्णः",
        "Karna": "कर्णः",
        "Bhishma": "भीष्मः",
        "Yudhishthira": "युधिष्ठिरः",
        "Bheema": "भीमः",
        "Nakula": "नकुलः",
        "Sahadeva": "सहदेवः",
        "Draupadi": "द्रौपदी",
        "Duryodhana": "दुर्योधनः",
        "Dushasana": "दुःशासनः",
        "Gandhari": "गांधारी",
        "Dhritarashtra": "धृतराष्ट्रः",
        "Kunti": "कुन्ती",
        "Drona": "द्रोणाचार्यः",
        "Ashwatthama": "अश्वत्थामा",
        "Shakuni": "शकुनिः",
        "Vyasa": "महर्षि व्यासः",
        "Abhimanyu": "अभिमन्युः",
        "Ghatotkacha": "घटोत्कचः",
        "Iravan": "इरावान्",
        "Subhadra": "सुभद्रा",
        "Balarama": "बलरामः",
        "Satyaki (Yuyudhana)": "सात्यकिः",
        "Kripacharya": "कृपाचार्यः",
        "Vidura": "विदुरः",
        "Sanjaya": "संजयः",
        "Dhrishtadyumna": "धृष्टद्युम्नः",
        "Shikhandi": "शिखंडी",
        "Ekalavya": "एकलव्यः",
        "Barbarika (Khatu Shyam)": "बर्बरीकः",
        "Shalya": "शल्यः",
        "Jarasandha": "जरासंधः",
        "Yuyutsu": "युयुत्सुः",
        "Kuntibhoja": "कुन्तिभोजः",
        "Virata": "विराटः",
        "Uttara (Matsya Prince)": "उत्तरः",
        "Uttaraa (Matsya Princess)": "उत्तरा",
        "Parikshit": "परीक्षितः",
        "Janamejaya": "जनमेजयः",
        "Kichaka": "कीचकः",
        "Hidimbi": "हिडिम्बी",
        "Ulupi": "उलूपी",
        "Chitrangada (Manipura)": "चित्रांगदा",
        "Babruvahana": "बभ्रुवाहनः",
        "Jayadratha": "जयद्रथः",
        "Amba": "अम्बा",
        "Ambika & Ambalika": "अम्बिका",
        "Pandu": "पाण्डुः",
        "Madri": "माद्री"
      };
      return map[name] || name;
    }

    function getCharacterPortrait(c) {
      return "/assets/characters/" + String(c.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + ".jpg";
    }

    // Fetch Characters
    function toggleEpicAnimations() {
      const tab = document.getElementById("tab-characters");
      const button = document.getElementById("epic-motion-toggle");
      const paused = tab.classList.toggle("epic-all-paused");
      button.setAttribute("aria-pressed", paused ? "true" : "false");
      button.textContent = paused ? "Resume animations" : "Pause animations";
    }

    async function fetchCharacters() {
      const search = document.getElementById("character-search").value;
      const alliance = document.getElementById("character-alliance").value;

      let url = "/api/characters";
      const params = [];
      if (search) params.push("search=" + encodeURIComponent(search));
      if (alliance) params.push("alliance=" + alliance);
      if (params.length > 0) url += "?" + params.join("&");

      try {
        const res = await fetch(url);
        if (res.ok) {
          activeCharacters = await res.json();
          renderCharacters();
        }
      } catch (err) {
        console.error(err);
      }
    }

    function renderCharacters() {
      const container = document.getElementById("characters-grid");
      if (activeCharacters.length === 0) {
        container.innerHTML = "<div class='text-center py-10 text-gray-500 text-sm col-span-3'>No characters found.</div>";
        return;
      }

      container.innerHTML = activeCharacters.map(c => {
        const allianceLower = c.alliance ? c.alliance.toLowerCase() : "";
        const allianceClass = allianceLower.includes("pandavas") ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : allianceLower.includes("kauravas") ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : allianceLower.includes("divine") ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                            : "bg-blue-500/10 text-blue-400 border-blue-500/20";
        
        const avatarArt = window.EpicAvatars ? window.EpicAvatars.render(c.name, "card") : '<img src="' + getCharacterPortrait(c) + '" alt="" class="w-full h-full object-cover">';

        return \`
          <div class="bg-[#161a23]/40 border border-gray-800/80 hover:border-yellow-500/30 rounded-xl overflow-hidden shadow-lg transition flex flex-col justify-between group">
            
            <!-- Animated character portrait -->
            <div class="relative epic-card-frame w-full overflow-hidden bg-gray-900">
              \${avatarArt}

              <!-- Alliance Pill -->
              <span class="absolute top-2 right-2 text-[10px] font-extrabold border px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-md \${allianceClass}">
                \${c.alliance}
              </span>
            </div>

            <!-- Card Body -->
            <div class="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div class="space-y-1">
                <span class="text-[10px] uppercase font-bold tracking-widest text-yellow-600">\${c.role}</span>
                <h3 class="epic-title text-lg font-extrabold text-yellow-500">\${c.name}</h3>
                <p class="text-xs text-gray-300 line-clamp-3 leading-relaxed font-medium">\${c.description}</p>
              </div>

              <div class="space-y-2 pt-2 border-t border-gray-800/60 text-[11px]">
                <div>
                  <span class="text-gray-400 font-semibold block mb-0.5">Attributes</span>
                  <div class="flex flex-wrap gap-1">
                    \${c.keyAttributes ? c.keyAttributes.map(a => \`<span class="bg-gray-800/80 px-1.5 py-0.5 rounded text-gray-300 text-[10px]">\${a}</span>\`).join("") : ''}
                  </div>
                </div>

                \${c.weapons && c.weapons.length > 0 ? \`
                  <div>
                    <span class="text-gray-400 font-semibold block mb-0.5">Weapons</span>
                    <div class="flex flex-wrap gap-1">
                      \${c.weapons.map(w => \`<span class="bg-yellow-600/10 border border-yellow-500/20 px-1.5 py-0.5 rounded text-yellow-500 text-[10px]">\${w}</span>\`).join("")}
                    </div>
                  </div>
                \` : ''}

                <button onclick="openCharacterModal('\${c._id}')" class="w-full mt-2 bg-yellow-600/10 border border-yellow-500/20 hover:bg-yellow-600 hover:text-gray-950 text-yellow-500 py-1.5 rounded text-xs font-bold transition">
                  Inspect Character Dossier <i class="fa-solid fa-arrow-right ml-1"></i>
                </button>
              </div>
            </div>

          </div>
        \`;
      }).join("");
      if (window.EpicAvatars) window.EpicAvatars.observeCards(container);
    }

    function openCharacterModal(id) {
      const c = activeCharacters.find(item => item._id === id);
      if (!c) return;

      const modal = document.getElementById("character-modal");
      const modalContent = document.getElementById("character-modal-content");
      
      const allianceLower = c.alliance ? c.alliance.toLowerCase() : "";
      const allianceClass = allianceLower.includes("pandavas") ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : allianceLower.includes("kauravas") ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : allianceLower.includes("divine") ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                          : "bg-blue-500/10 text-blue-400 border-blue-500/20";

      const avatarArt = window.EpicAvatars ? window.EpicAvatars.render(c.name, "modal") : '<img src="' + getCharacterPortrait(c) + '" alt="" class="w-full h-full object-cover">';

      modalContent.innerHTML = \`
        <div class="space-y-4">
          <div class="relative epic-modal-frame rounded-xl overflow-hidden bg-gray-900 border border-gray-800">
            \${avatarArt}
            <span class="absolute top-3 right-3 text-xs font-extrabold border px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md \${allianceClass}">
              \${c.alliance}
            </span>
          </div>

          <div class="space-y-2">
            <h4 class="text-xs uppercase font-bold text-gray-400 tracking-wider">Epic Biography & Role</h4>
            <p class="text-sm text-gray-200 leading-relaxed font-medium bg-[#161a23]/50 p-4 rounded-xl border border-gray-800/80">\${c.description}</p>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-[#161a23]/50 p-3.5 rounded-xl border border-gray-800/80 space-y-1.5">
              <h5 class="text-xs font-bold text-yellow-500 uppercase tracking-wider">Key Character Attributes</h5>
              <div class="flex flex-wrap gap-1.5">
                \${c.keyAttributes ? c.keyAttributes.map(a => \`<span class="bg-gray-800 px-2 py-1 rounded text-xs text-gray-300 font-semibold">\${a}</span>\`).join("") : ''}
              </div>
            </div>

            <div class="bg-[#161a23]/50 p-3.5 rounded-xl border border-gray-800/80 space-y-1.5">
              <h5 class="text-xs font-bold text-yellow-500 uppercase tracking-wider">Primary Weapons & Astras</h5>
              <div class="flex flex-wrap gap-1.5">
                \${c.weapons && c.weapons.length > 0 ? c.weapons.map(w => \`<span class="bg-yellow-600/10 border border-yellow-500/30 text-yellow-500 px-2 py-1 rounded text-xs font-semibold">\${w}</span>\`).join("") : '<span class="text-xs text-gray-500">Unarmed / Sage Wisdom</span>'}
              </div>
            </div>
          </div>
        </div>
      \`;

      if (window.EpicAvatars) window.EpicAvatars.mountDossier(c, modalContent.querySelector(".space-y-4"));
      modal.classList.remove("hidden");
    }

    function closeCharacterModal() {
      if (window.EpicAvatars) window.EpicAvatars.stopVoice();
      document.getElementById("character-modal").classList.add("hidden");
    }

    // Kuru Confrontation Arena Simulation Engine
    let arenaCharacters = [];
    async function initArena() {
      try {
        const res = await fetch("/api/characters");
        if (res.ok) {
          arenaCharacters = await res.json();
          populateArenaSelectors();
        }
      } catch (err) {
        console.error(err);
      }
    }

    const characterArenaStats = {
      "Krishna": { valour: 90, astra: 98, intellect: 100, dharma: 100, quote: "As Parthasarathi, His strategy is absolute and His cosmic presence protects truth.", primaryWeapon: "Sudarshana Chakra" },
      "Arjuna": { valour: 95, astra: 96, intellect: 90, dharma: 92, quote: "His unparalleled focus with Gandiva is legendary; his skill is guided by Krishna Himself.", primaryWeapon: "Gandiva Bow" },
      "Karna": { valour: 96, astra: 94, intellect: 85, dharma: 70, quote: "His loyalty to Duryodhana drives him, fighting with immense valour but bounded by dynamic fate.", primaryWeapon: "Vijaya Bow & Vasavi Shakti" },
      "Bhishma": { valour: 97, astra: 93, intellect: 92, dharma: 85, quote: "The Grand Patriarch whose vow of celibacy and choice of death make him an immovable force.", primaryWeapon: "Grand Celestial Bow" },
      "Yudhishthira": { valour: 80, astra: 82, intellect: 95, dharma: 98, quote: "The Son of Dharma, his core strength lies in uncompromised truth and absolute composure.", primaryWeapon: "Spear of Truth" },
      "Duryodhana": { valour: 94, astra: 80, intellect: 75, dharma: 45, quote: "Driven by ambition and martial pride, his heavy iron mace strikes with devastating force.", primaryWeapon: "Heavy Iron Mace" },
      "Draupadi": { valour: 50, astra: 40, intellect: 94, dharma: 96, quote: "The fire-born Queen whose words of ultimate truth act as a spiritual force moving destiny.", primaryWeapon: "Words of Unyielding Truth" },
      "Drona": { valour: 94, astra: 95, intellect: 90, dharma: 80, quote: "The royal preceptor of warfare who teaches precision but is bounded by Hastinapur's throne.", primaryWeapon: "Brahmashira Astra" },
      "Bheema": { valour: 98, astra: 84, intellect: 78, dharma: 88, quote: "Possesses the strength of ten thousand elephants, crushing all opposition with raw power.", primaryWeapon: "Gada (Mace)" },
      "Barbarika (Khatu Shyam)": { valour: 99, astra: 99, intellect: 95, dharma: 98, quote: "Invincible prince with three arrows that can mark, target, and destroy entire armies in seconds.", primaryWeapon: "Teen Baan (Three Arrows)" }
    };

    function getArenaStats(name, charObj) {
      if (characterArenaStats[name]) return characterArenaStats[name];
      let valour = 82, astra = 80, intellect = 83, dharma = 80;
      const alliance = (charObj && charObj.alliance) ? charObj.alliance.toLowerCase() : "";
      const role = (charObj && charObj.role) ? charObj.role.toLowerCase() : "";
      
      if (alliance.indexOf("pandavas") !== -1) { dharma = 88; valour += 4; }
      if (alliance.indexOf("kauravas") !== -1) { valour += 5; dharma = 58; }
      if (alliance.indexOf("divine") !== -1) { valour = 94; astra = 95; intellect = 95; dharma = 96; }
      
      const weapon = (charObj && charObj.weapons && charObj.weapons.length > 0) ? charObj.weapons[0] : "Martial Skill";
      const descSnippet = (charObj && charObj.description) ? charObj.description.substring(0, 90) + "..." : "A prominent warrior of epic stature.";
      
      return {
        valour: valour,
        astra: astra,
        intellect: intellect,
        dharma: dharma,
        quote: descSnippet,
        primaryWeapon: weapon
      };
    }

    function populateArenaSelectors() {
      const selectA = document.getElementById("arena-char-a");
      const selectB = document.getElementById("arena-char-b");
      if (!selectA || !selectB) return;
      if (selectA.children.length > 0) return;

      var optionsHTML = arenaCharacters.map(function(c) {
        return '<option value="' + c.name + '">' + c.name + ' (' + c.alliance + ')</option>';
      }).join("");
      selectA.innerHTML = optionsHTML;
      selectB.innerHTML = optionsHTML;
      
      if (selectB.children.length > 1) {
        selectB.selectedIndex = 1;
      }
      updateArenaOptions();
    }

    function updateArenaOptions() {
      const selectA = document.getElementById("arena-char-a");
      const selectB = document.getElementById("arena-char-b");
      if (selectA.value === selectB.value) {
        if (selectB.selectedIndex + 1 < selectB.options.length) {
          selectB.selectedIndex += 1;
        } else {
          selectB.selectedIndex = 0;
        }
      }
    }

    function simulateClash() {
      const selectA = document.getElementById("arena-char-a");
      const selectB = document.getElementById("arena-char-b");
      if (!selectA || !selectB) return;
      
      const nameA = selectA.value;
      const nameB = selectB.value;
      
      const charA = arenaCharacters.find(function(c) { return c.name === nameA; }) || { name: nameA, role: "Warrior", alliance: "None", description: "" };
      const charB = arenaCharacters.find(function(c) { return c.name === nameB; }) || { name: nameB, role: "Warrior", alliance: "None", description: "" };

      const statsA = getArenaStats(nameA, charA);
      const statsB = getArenaStats(nameB, charB);

      document.getElementById("arena-stat-valour-a").innerText = statsA.valour;
      document.getElementById("arena-stat-valour-b").innerText = statsB.valour;
      document.getElementById("arena-bar-valour-a").style.width = ((statsA.valour / (statsA.valour + statsB.valour)) * 100) + '%';
      document.getElementById("arena-bar-valour-b").style.width = ((statsB.valour / (statsA.valour + statsB.valour)) * 100) + '%';

      document.getElementById("arena-stat-astra-a").innerText = statsA.astra;
      document.getElementById("arena-stat-astra-b").innerText = statsB.astra;
      document.getElementById("arena-bar-astra-a").style.width = ((statsA.astra / (statsA.astra + statsB.astra)) * 100) + '%';
      document.getElementById("arena-bar-astra-b").style.width = ((statsB.astra / (statsA.astra + statsB.astra)) * 100) + '%';

      document.getElementById("arena-stat-intellect-a").innerText = statsA.intellect;
      document.getElementById("arena-stat-intellect-b").innerText = statsB.intellect;
      document.getElementById("arena-bar-intellect-a").style.width = ((statsA.intellect / (statsA.intellect + statsB.intellect)) * 100) + '%';
      document.getElementById("arena-bar-intellect-b").style.width = ((statsB.intellect / (statsA.intellect + statsB.intellect)) * 100) + '%';

      document.getElementById("arena-stat-dharma-a").innerText = statsA.dharma;
      document.getElementById("arena-stat-dharma-b").innerText = statsB.dharma;
      document.getElementById("arena-bar-dharma-a").style.width = ((statsA.dharma / (statsA.dharma + statsB.dharma)) * 100) + '%';
      document.getElementById("arena-bar-dharma-b").style.width = ((statsB.dharma / (statsA.dharma + statsB.dharma)) * 100) + '%';

      const scoreA = statsA.valour * 0.25 + statsA.astra * 0.3 + statsA.intellect * 0.2 + statsA.dharma * 0.25;
      const scoreB = statsB.valour * 0.25 + statsB.astra * 0.3 + statsB.intellect * 0.2 + statsB.dharma * 0.25;

      const probA = Math.round((scoreA / (scoreA + scoreB)) * 100);
      const probB = 100 - probA;

      document.getElementById("arena-win-prob-text").innerText = nameA + ' ' + probA + '% vs ' + probB + '% ' + nameB;

      let winner = nameA;
      let winnerAlliance = charA.alliance;
      
      if (scoreB > scoreA) {
        winner = nameB;
        winnerAlliance = charB.alliance;
      }

      const badge = document.getElementById("arena-win-badge");
      badge.innerText = winnerAlliance + ' Favoured';
      if (winnerAlliance.toLowerCase().indexOf("pandavas") !== -1) {
        badge.className = "bg-green-500/10 text-green-400 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded border border-green-500/20";
      } else if (winnerAlliance.toLowerCase().indexOf("kauravas") !== -1) {
        badge.className = "bg-red-500/10 text-red-400 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded border border-red-500/20";
      } else {
        badge.className = "bg-blue-500/10 text-blue-400 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded border border-blue-500/20";
      }

      const narrative = "On the sacred soil of Kurukshetra, the cosmic energy surges as " + nameA + " (" + charA.role + ") confronts " + nameB + " (" + charB.role + ")!<br><br>" +
        nameA + " commands the field with " + statsA.primaryWeapon + ", demonstrating " + statsA.quote + "<br><br>" +
        nameB + " answers with " + statsB.primaryWeapon + ", asserting that " + statsB.quote + "<br><br>" +
        "<strong>The Decisive Turn:</strong> In this legendary matchup, " + winner + " establishes dominance, wielding superior " +
        (scoreB > scoreA ? "celestial power" : "dharmic weight") + " to sway the battle-lines!";

      document.getElementById("arena-outcome-desc").innerHTML = narrative;
      document.getElementById("arena-results-panel").classList.remove("hidden");
    }

    // Quiz Play logic
    async function startQuiz() {
      if (!token) {
        try {
          const guestRes = await fetch("/api/auth/login-guest", { method: "POST" });
          const guestData = await guestRes.json();
          if (guestData.token) {
            token = guestData.token;
            localStorage.setItem("token", token);
            if (typeof updateAuthUI === "function" && guestData.user) {
              updateAuthUI(guestData.user);
            }
          }
        } catch (e) {
          console.error("Guest session creation failed", e);
        }
      }
      try {
        const headers = token ? { "Authorization": "Bearer " + token } : {};
        const res = await fetch("/api/quiz/generate", { headers });
        const data = await res.json();
        if (res.ok) {
          quizData = data.questions;
          quizIndex = 0;
          quizScore = 0;
          quizAnswers = [];
          
          document.getElementById("quiz-start-window").classList.add("hidden");
          document.getElementById("quiz-complete-window").classList.add("hidden");
          document.getElementById("quiz-active-window").classList.remove("hidden");
          
          loadQuizQuestion();
        } else {
          alert(data.error || "Failed to start quiz.");
        }
      } catch (err) {
        console.error(err);
      }
    }

    function playQuizSanskritAudio(rawWord) {
      if (!rawWord) return;
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        let textToSpeak = rawWord;
        if (rawWord.indexOf("(") !== -1) {
          textToSpeak = rawWord.split("(")[0].trim();
        }
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = 0.85;
        utterance.pitch = 1.0;
        utterance.lang = "hi-IN";
        window.speechSynthesis.speak(utterance);
      }
    }

    function replayQuizAudio() {
      if (quizData && quizData[quizIndex]) {
        playQuizSanskritAudio(quizData[quizIndex].word);
      }
    }

    function loadQuizQuestion() {
      quizAnswered = false;
      const q = quizData[quizIndex];
      document.getElementById("quiz-q-num").innerText = quizIndex + 1;
      document.getElementById("quiz-running-score").innerText = quizScore;
      document.getElementById("quiz-word-text").innerText = q.word;
      document.getElementById("quiz-trans-text").innerText = "Transliteration: " + q.transliteration;
      document.getElementById("quiz-next-btn").classList.add("hidden");

      // Play audio pronunciation of the Sanskrit word at the start of every question
      playQuizSanskritAudio(q.word);

      const choicesDiv = document.getElementById("quiz-choices-container");
      choicesDiv.innerHTML = q.choices.map((choice, i) => \`
        <button onclick="selectQuizAnswer(\${i})" id="btn-choice-\${i}" class="w-full text-left bg-[#161a23]/60 border border-gray-800 hover:border-yellow-500/40 p-3.5 rounded-lg text-xs md:text-sm text-gray-300 font-semibold transition duration-150">
          \${choice}
        </button>
      \`).join("");
    }

    function selectQuizAnswer(index) {
      if (quizAnswered) return;
      quizAnswered = true;
      const q = quizData[quizIndex];
      const selected = q.choices[index];
      const correct = q.correctAnswer;
      const isCorrect = selected === correct;

      quizAnswers.push({
        wordId: q.wordId,
        answer: selected
      });

      if (isCorrect) {
        quizScore++;
        document.getElementById("btn-choice-" + index).classList.add("bg-green-500/10", "border-green-500", "text-green-400");
      } else {
        document.getElementById("btn-choice-" + index).classList.add("bg-red-500/10", "border-red-500", "text-red-400");
        const correctIndex = q.choices.findIndex(c => c === correct);
        if (correctIndex !== -1) {
          document.getElementById("btn-choice-" + correctIndex).classList.add("bg-green-500/10", "border-green-500", "text-green-400");
        }
      }

      document.getElementById("quiz-running-score").innerText = quizScore;
      document.getElementById("quiz-next-btn").classList.remove("hidden");
    }

    async function nextQuizQuestion() {
      quizIndex++;
      if (quizIndex < quizData.length) {
        loadQuizQuestion();
      } else {
        await submitQuiz();
      }
    }

    async function submitQuiz() {
      try {
        if (!token) {
          document.getElementById("quiz-active-window").classList.add("hidden");
          document.getElementById("quiz-complete-window").classList.remove("hidden");
          document.getElementById("quiz-final-score-text").innerText = quizScore + " / " + (quizData ? quizData.length : 5);
          return;
        }
        const res = await fetch("/api/quiz/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify({ answers: quizAnswers })
        });
        const data = await res.json();
        if (res.ok) {
          document.getElementById("quiz-active-window").classList.add("hidden");
          document.getElementById("quiz-complete-window").classList.remove("hidden");
          document.getElementById("quiz-final-score-text").innerText = data.score + " / " + data.totalQuestions;
          fetchDashboardStats();
        } else {
          document.getElementById("quiz-active-window").classList.add("hidden");
          document.getElementById("quiz-complete-window").classList.remove("hidden");
          document.getElementById("quiz-final-score-text").innerText = quizScore + " / " + (quizData ? quizData.length : 5);
        }
      } catch (err) {
        console.error(err);
        document.getElementById("quiz-active-window").classList.add("hidden");
        document.getElementById("quiz-complete-window").classList.remove("hidden");
        document.getElementById("quiz-final-score-text").innerText = quizScore + " / " + (quizData ? quizData.length : 5);
      }
    }

    // Expose all handlers to window object for inline HTML event attributes
    window.checkPasswordStrength = checkPasswordStrength;
    window.togglePasswordVisibility = togglePasswordVisibility;
    window.openAuthModal = openAuthModal;
    window.closeAuthModal = closeAuthModal;
    window.toggleAuthMode = toggleAuthMode;
    window.quickFillLogin = quickFillLogin;
    window.quickDemoLogin = quickDemoLogin;
    window.switchToRegisterWith = switchToRegisterWith;
    window.handleAuthSubmit = handleAuthSubmit;
    window.startGuestSession = startGuestSession;
    window.handleLogout = handleLogout;
    window.switchTab = switchTab;
    window.fetchWords = fetchWords;
    window.fetchShlokas = fetchShlokas;
    window.fetchCharacters = fetchCharacters;
    window.openCharacterModal = openCharacterModal;
    window.closeCharacterModal = closeCharacterModal;
    window.simulateClash = simulateClash;
    window.updateArenaOptions = updateArenaOptions;
    window.startQuiz = startQuiz;
    window.selectQuizAnswer = selectQuizAnswer;
    window.nextQuizQuestion = nextQuizQuestion;
    window.replayQuizAudio = replayQuizAudio;

    // Run Startup Init
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
    window.addEventListener("load", () => {
      if (!currentUser && token) {
        getMe();
      }
    });
  </script>
</body>
</html>`);
});

// Load Global Error Handler
app.use(errorHandler);

// Launch Dev Server
app.listen(PORT, () => {
  console.log(`Development Server is now running on http://localhost:${PORT}`);
});
