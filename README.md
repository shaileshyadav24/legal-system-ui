# VakeelAI - Frontend Application

A modern React-based frontend application for VakeelAI, an AI-powered legal Q&A chatbot, backed by a JWT-authenticated, session-based chat API.

## Features

### 🔐 Authentication System
- **User Registration**: Create accounts with a user type preference (Lawyer/Layman) that controls chat tone
- **Login/Logout**: JWT-based authentication against a real backend, with server-side token revocation on logout
- **Session validation**: On load, the cached token is re-checked against the server so a token revoked from another tab is caught
- **Password Recovery**: Forgot password and reset password flow (dev-only: the reset token is logged to the console, not shown in the UI, since email delivery isn't wired up server-side yet)
- **Protected Routes**: Authenticated access to chat features

### 💬 Chat Interface
- **Multi-Chat Support**: Create and manage multiple chat sessions, backed by server-side session history
- **Real-time Messaging**: Interactive chat with an AI legal assistant, with separate plain-language and legal-professional response tones
- **Message History**: Chat history is fetched from the server per session, not stored in the browser
- **Related Links**: AI-generated relevant legal resources/case links
- **Responsive Design**: Optimized for desktop and mobile devices
- **Light/Dark Theme**: Toggle in the top-right corner; respects OS preference by default and persists an explicit choice

### 🎨 Content Management
- **Dynamic Content**: All UI text managed through JSON configuration files
- **Internationalization Ready**: Easy content updates without code changes

### 🔧 Technical Features
- **API Integration**: RESTful, JWT-authenticated communication with the backend
- **Loading States**: Visual feedback during API calls and content loading
- **Error Handling**: Distinct handling for unauthorized/expired sessions, unknown collections, no-results, and model failures

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API server running on `http://localhost:8000`

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd legal-system-ui
```

2. Install dependencies:
```bash
npm install
```

3. Configure the API URL (optional in dev — defaults to `http://localhost:8000`):
```bash
cp .env.example .env.local
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. The application will open in your browser at `http://localhost:3000` (see `vite.config.js`)

## Building for Production

```bash
VITE_API_URL=https://api.example.com npm run build
```

The built files will be in the `dist` directory. `VITE_API_URL` is baked into the build at build time (Vite env vars are static, not runtime-configurable) — build separately per environment, or bake it in at container build time (see `Dockerfile`).

### Docker

```bash
docker build --build-arg VITE_API_URL=https://api.example.com -t legal-system-ui .
docker run -p 8080:80 legal-system-ui
```

This builds a static bundle with Node and serves it via nginx (`nginx.conf`), with SPA fallback routing so client-side routes (e.g. `/chat`) resolve to `index.html`.

## API Configuration

The application communicates with a backend API, configured via the `VITE_API_URL` environment variable (see `.env.example`) and falling back to `http://localhost:8000` if unset. All chat and history endpoints require a `Authorization: Bearer <access_token>` header, obtained from login/register.

### Authentication Endpoints
- `POST /auth/register` - Create an account, returns a token
- `POST /auth/login` - Log in, returns a token
- `GET /auth/me` - Validate the current token / fetch the current profile
- `POST /auth/logout` - Revoke the current token server-side
- `POST /auth/forgot-password` - Request a password reset token
- `POST /auth/reset-password` - Reset a password using that token

### Chat Endpoints
- `POST /query/user` - Plain-language legal Q&A
- `POST /query/lawyer` - Legal-professional-tone Q&A
- `GET /chat/sessions` - List the current user's chat sessions
- `GET /chat/sessions/{id}/messages` - Fetch a session's message history
- `DELETE /chat/sessions/{id}` - Delete a session

### Expected API Response Formats

**Auth Response** (`/auth/register`, `/auth/login`):
```json
{
  "access_token": "eyJhbGciOi...",
  "token_type": "bearer",
  "user": {
    "id": "6a4ad88dcd56258f7ba07ff6",
    "email": "user@example.com",
    "full_name": "Jane Doe",
    "role": "user"
  }
}
```

**Chat Query Response** (`/query/user`, `/query/lawyer`):
```json
{
  "answer": "Legal analysis response...",
  "urls": ["https://example.com/legal-resource-1"],
  "session_id": "6a4ad75d123aeb6c54a06e41"
}
```

A `204` with no body means no relevant context was found for the query; a `404` means an unknown `collection_name` was supplied; a `500` means the LLM failed to generate a response.

## Content Management

The application uses a JSON-based content management system. All UI text is stored in `/public/content/` directory:

- `login.json` - Login page content
- `register.json` - Registration page content
- `forgot-password.json` - Password recovery content
- `reset-password.json` - Password reset content (includes a `fields.token` label for the manual reset-token field)
- `chat.json` - Chat interface content

### Content Structure Example
```json
{
  "brand": {
    "logo": "⚖️",
    "title": "VakeelAI",
    "subtitle": "The AI assistant for your legal needs"
  },
  "heading": "Login",
  "fields": {
    "email": "Email",
    "password": "Password"
  },
  "submitButton": "Log in"
}
```

## Project Structure

```
legal-system-ui/
├── public/
│   └── content/                 # JSON content files
│       ├── login.json
│       ├── register.json
│       ├── forgot-password.json
│       ├── reset-password.json
│       └── chat.json
├── src/
│   ├── components/
│   │   ├── ui/                  # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   └── Card.jsx
│   │   ├── AuthGuard.jsx        # Route protection
│   │   ├── ChatSidebar.jsx      # Chat session sidebar
│   │   ├── Chatbot.jsx          # Main chat interface
│   │   ├── ThemeToggle.jsx      # Light/dark theme toggle
│   │   └── UserTypeModal.jsx    # (currently unused) user type selection modal
│   ├── pages/                   # Page components
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── ForgotPasswordPage.jsx
│   │   ├── ResetPasswordPage.jsx
│   │   └── ChatPage.jsx
│   ├── services/                # API and utility services
│   │   ├── api.js               # Shared fetch client, auth header, error normalization
│   │   ├── authService.js       # Register/login/logout/me/forgot/reset
│   │   ├── chatHistoryService.js# Sessions list/messages/delete
│   │   ├── chatbotService.js    # Query call + message shaping
│   │   ├── chatService.js       # userType + pinned-chat-id localStorage helpers
│   │   └── contentService.js    # Fetches /public/content JSON
│   ├── stores/                  # Zustand stores (client-only state)
│   │   ├── useUserStore.js      # Auth/user-type state
│   │   └── useChatsStore.js     # Active chat, draft chats, pinned ids
│   ├── hooks/                   # Custom React hooks
│   │   ├── usePageContent.js    # react-query wrapper around contentService
│   │   └── useTheme.js          # Light/dark theme state + persistence
│   ├── App.jsx                  # Routes + auth bootstrap
│   ├── App.scss                 # App/auth-page layout styles
│   ├── main.jsx                 # Entry point (React Query client + Router)
│   └── index.scss               # Global styles
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Technologies Used

- **React 18** - UI framework with hooks
- **Zustand** - Client-only state (active chat, drafts, pins, user/auth flags)
- **TanStack Query (react-query v5)** - All server data: auth validation, chat sessions/messages, page content
- **React Router** - Client-side routing
- **Sass/SCSS** - Styling with CSS preprocessor
- **Vite** - Build tool and development server

There is no lint script, ESLint config, or test framework currently set up in this repo.

## Development Notes

### Content Updates
- Modify JSON files in `/public/content/` to update UI text
- Changes are reflected immediately in development mode
- No code changes required for content updates

### State Management
State is deliberately split by ownership:
- **react-query** owns anything the server is authoritative for: `/auth/me` validation, the chat sessions list, a session's messages, and page content JSON. Query keys: `['content', page]`, `['sessions']`, `['messages', chatId]`.
- **Zustand** owns pure client state with no server representation: `useUserStore` (auth/user-type flags) and `useChatsStore` (which chat is active, not-yet-sent draft chats, pinned chat ids).
- A global `QueryCache`/`MutationCache` error handler (in `main.jsx`) clears the session and redirects to `/login` on any `401` from an authenticated query/mutation — this is how a token revoked from another tab gets caught.

### Authentication Flow
1. User registers/logs in against the real backend; the JWT + profile are cached in `localStorage`
2. On app load, the cached session is used optimistically, then verified via `GET /auth/me`
3. `AuthGuard` protects chat routes based on Zustand's `isAuthenticated` flag
4. `userType` (Lawyer/Layman) is a client-only preference — the backend has no concept of it — chosen at registration and reused on subsequent logins from `localStorage`

### Chat Functionality
- Chat sessions and their message history are server-owned, fetched via `GET /chat/sessions` / `GET /chat/sessions/{id}/messages`
- A new chat is a client-only "draft" until its first message succeeds and the server returns a `session_id` — there is no session-create endpoint
- Pinning chats is a client-only feature (no backend support), persisted to `localStorage`
- AI responses include an answer and related links; a query with no relevant context returns a distinct "nothing found" state rather than an error

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
