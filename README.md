# Legal System Chatbot - Frontend Application

A modern React-based frontend application for a legal system chatbot with AI-powered contract review capabilities.

## Features

### 🔐 Authentication System
- **User Registration**: Create accounts with user type selection (Lawyer/Layman)
- **Login/Logout**: Secure authentication with JWT tokens
- **Password Recovery**: Forgot password and reset password functionality
- **Protected Routes**: Authenticated access to chat features

### 💬 Chat Interface
- **Multi-Chat Support**: Create and manage multiple chat sessions
- **Real-time Messaging**: Interactive chat with AI legal assistant
- **Message History**: Persistent chat history with timestamps
- **Related Links**: AI-generated relevant legal resources
- **Responsive Design**: Optimized for desktop and mobile devices

### 🎨 Content Management
- **Dynamic Content**: All UI text managed through JSON configuration files
- **Redux Integration**: Centralized state management for content and user data
- **Internationalization Ready**: Easy content updates without code changes

### 🔧 Technical Features
- **API Integration**: RESTful API communication with backend services
- **Loading States**: Visual feedback during API calls and content loading
- **Error Handling**: Comprehensive error management and user feedback
- **Local Storage**: Persistent user sessions and chat data

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

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. The application will open in your browser at `http://localhost:5173`

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## API Configuration

The application communicates with a backend API. Configure the following endpoints:

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset confirmation

### Chat Endpoints
- `POST /api/chat/start` - Initialize new chat session
- `POST /api/chat/query` - Send chat message and receive AI response

### Expected API Response Formats

**Authentication Response:**
```json
{
  "user": {
    "email": "user@example.com",
    "name": "John Doe",
    "userType": "lawyer"
  },
  "token": "jwt-token-here"
}
```

**Chat Query Response:**
```json
{
  "answer": "Legal analysis response...",
  "urls": ["https://example.com/legal-resource-1", "https://example.com/legal-resource-2"]
}
```

## Content Management

The application uses a JSON-based content management system. All UI text is stored in `/public/content/` directory:

- `login.json` - Login page content
- `register.json` - Registration page content
- `forgot-password.json` - Password recovery content
- `reset-password.json` - Password reset content
- `chat.json` - Chat interface content

### Content Structure Example
```json
{
  "brand": {
    "logo": "⚖️",
    "title": "Review contracts",
    "subtitle": "with AI Lawyer"
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
│   │   └── UserTypeModal.jsx    # User type selection
│   ├── pages/                   # Page components
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── ForgotPasswordPage.jsx
│   │   ├── ResetPasswordPage.jsx
│   │   └── ChatPage.jsx
│   ├── services/                # API and utility services
│   │   ├── api.js
│   │   ├── authService.js
│   │   └── contentService.js
│   ├── store/                   # Redux store
│   │   ├── index.js
│   │   └── slices/
│   │       ├── userSlice.js
│   │       ├── chatsSlice.js
│   │       └── contentSlice.js
│   ├── hooks/                   # Custom React hooks
│   │   └── usePageContent.js
│   ├── App.jsx                  # Main app component
│   ├── App.scss                 # App styles
│   ├── main.jsx                 # Entry point
│   └── index.scss               # Global styles
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Technologies Used

- **React 18** - UI framework with hooks
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Sass/SCSS** - Styling with CSS preprocessor
- **Vite** - Build tool and development server
- **ESLint** - Code linting

## Development Notes

### Content Updates
- Modify JSON files in `/public/content/` to update UI text
- Changes are reflected immediately in development mode
- No code changes required for content updates

### State Management
- User authentication state managed in `userSlice`
- Chat sessions managed in `chatsSlice`
- Dynamic content managed in `contentSlice`

### Authentication Flow
1. User registers/logs in
2. JWT token stored in localStorage
3. AuthGuard protects chat routes
4. User type determines AI response context

### Chat Functionality
- Multiple chat sessions supported
- Messages persisted in localStorage
- AI responses include legal analysis and related links
- Real-time loading states and error handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
