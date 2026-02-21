# Legal System Chatbot - Frontend Application

A modern React-based frontend application for a legal system chatbot.

## Features

- **User Type Selection**: Popup modal on page load asking users to select their type (Lawyer or Layman)
- **Chatbot Interface**: Clean and modern chat UI with message history
- **API Integration**: POST requests to `localhost:8000/query` endpoint
- **Loading States**: Visual loading indicator while waiting for API responses
- **Responsive Design**: Works on desktop and mobile devices

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. The application will open in your browser at `http://localhost:3000`

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## API Configuration

The application expects a backend API running at `http://localhost:8000/query`.

The API endpoint should accept POST requests with the following JSON format:
```json
{
  "query": "user's question",
  "user_type": "Lawyer" or "Layman"
}
```

Expected response format:
```json
{
  "message": "response text"
}
```
or
```json
{
  "text": "response text"
}
```

## Project Structure

```
legal-system-ui/
├── src/
│   ├── components/
│   │   ├── UserTypeModal.jsx    # User type selection popup
│   │   ├── UserTypeModal.css
│   │   ├── Chatbot.jsx          # Main chatbot interface
│   │   └── Chatbot.css
│   ├── services/
│   │   └── api.js               # API service functions
│   ├── App.jsx                  # Main app component
│   ├── App.css
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Technologies Used

- React 18
- Vite (build tool)
- CSS3 (for styling)

## Notes

- User type selection is stored in localStorage, so users won't be asked again on page refresh
- The chatbot displays a loading animation while waiting for API responses
- Messages are automatically scrolled to the bottom when new messages arrive
