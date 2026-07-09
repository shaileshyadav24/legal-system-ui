# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server (port 3000, per `vite.config.js`; README mentions 5173 which is stale)
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build

There is no lint script, ESLint config, or test framework configured in this repo, despite the README mentioning ESLint — don't assume `npm run lint` or `npm test` exist.

## Architecture

React 18 SPA (Vite) for a legal-chatbot frontend, using **Zustand** for client state, **TanStack Query (react-query v5)** for all server data, and React Router for routing. No backend lives in this repo — it talks to an external JWT-auth'd API expected at `http://localhost:8000`.

The state-management split is deliberate: **react-query owns anything the server is authoritative for** (auth validation, chat sessions, chat messages, page content JSON); **Zustand owns pure client state** that has no server representation (which chat is active, not-yet-sent draft chats, pinned-chat ids). Don't reach for Redux patterns here — there is no Redux in this codebase.

### Auth flow
Real JWT auth against `/auth/register`, `/auth/login`, `/auth/me`, `/auth/logout`, `/auth/forgot-password`, `/auth/reset-password` (see `src/services/authService.js` and `src/services/api.js`). The token + user profile are persisted to `localStorage` under `AUTH_STORAGE_KEY` ('authUser', exported from `api.js`). `src/stores/useUserStore.js` (Zustand) tracks `isAuthenticated`/`userType`/`userName`/`userEmail` for rendering; `AuthGuard` (`src/components/AuthGuard.jsx`) reads `isAuthenticated` from it to gate `/chat`.

On mount, `App.jsx` optimistically restores auth state from the stored token, then calls `GET /auth/me` to confirm the token hasn't been revoked elsewhere (e.g. logged out from another tab) — a `401` there clears the session. Any other authenticated react-query call that 401s is handled globally: `main.jsx` configures a `QueryCache`/`MutationCache` `onError` on the `QueryClient` that clears storage and hard-redirects to `/login` on any `401`. Plain `try/catch`-driven calls (login/register themselves) are unaffected by that global handler, since a 401 there just means "wrong password," not "revoked session."

`userType` (Lawyer/Layman — which prompt persona to query) is **not** part of the backend's user model at all; it's a client-only preference chosen at registration and persisted separately via `chatService.js#storeUserType`/`loadStoredUserType` (`localStorage['userType']`), since login doesn't return it.

**Dev-only note:** `/auth/forgot-password` returns a real `reset_token` in dev (no email sending is wired up server-side yet). `authService.js#sendPasswordResetEmail` only `console.info`s it — don't add UI that renders `reset_token`, per the backend API docs. `ResetPasswordPage` has a manual "reset token" field (pre-filled from a `?token=` query param if present) since there's no email link to click yet.

### Content-driven pages
Auth pages (`LoginPage`, `RegisterPage`, `ForgotPasswordPage`, `ResetPasswordPage`) don't hardcode copy. They call `usePageContent(page)` (`src/hooks/usePageContent.js`), a thin react-query wrapper (`queryKey: ['content', page]`, `staleTime: Infinity`) around `contentService.fetchPageContent`, which fetches `/public/content/<page>.json`. To change page copy, edit the matching JSON file in `public/content/`, not the JSX — components just read nested fields off the fetched `content` object (e.g. `content?.brand?.title`).

### Chat flow — sessions are server-owned, drafts are not
The backend model (see its own API docs) is session-based: `POST /query/user` / `POST /query/lawyer` take `{ query, collection_name?, session_id? }` and return `{ answer, urls, session_id }`. The server — not the client — owns conversation history, keyed by `session_id`; there's no client-supplied history array anymore. `GET /chat/sessions` lists a user's sessions, `GET /chat/sessions/{id}/messages` returns its `{query, answer, urls, created_at}` turns, `DELETE /chat/sessions/{id}` deletes one.

There is **no session-create endpoint** — a new chat only becomes a real backend session once its first message gets a `200` response with a `session_id`. Until then it's a **draft**: a `useChatsStore` (Zustand, `src/stores/useChatsStore.js`) entry with a client-generated id (`draft-<timestamp>`) and its messages held directly in the store. `ChatPage.jsx` merges `useChatsStore`'s drafts with the react-query-cached session list (`queryKey: ['sessions']`) into one array for `ChatSidebar`; each item carries `isDraft` so the UI code can tell drafts from real sessions.

`Chatbot.jsx` is where a draft gets promoted: on a successful send, if `isDraft && response.sessionId`, it seeds the react-query cache at `['messages', sessionId]` with the reconstructed message list, invalidates `['sessions']` (so the sidebar picks up the server-generated title), removes the draft from `useChatsStore`, and repoints `activeChatId` at the new session id — all before the next render, so there's no flicker/refetch.

Message shape is normalized to `{ text, sender, urls }` everywhere (both draft messages and the flattened form of fetched session history — see `chatbotService.js#messageFromHistoryEntry`), so `ChatbotMessageList` never needs to know whether it's rendering a draft or a real session.

Pinning is a client-only feature layered on top (the backend has no concept of it): pinned ids live in `useChatsStore` and are persisted via `chatService.js#loadPinnedChatIds`/`savePinnedChatIds`.

Errors: `api.js#apiRequest` throws `ApiError` (with `.status`) for non-2xx; `204` is treated as "success, no body" (used by logout/delete/reset-password, and specially by `/query/*` to mean "no relevant context found" — `sendQuery` turns that into `{ answer: null, urls: [], noContext: true }` rather than an error). `chatbotService.js#createBotMessage` renders the `noContext` case as a "nothing found" message, and `createErrorMessage` special-cases `error.status === 404` (unknown `collection_name`).

### UI components
`src/components/ui/` holds generic, presentational primitives (`Button`, `Input`, `Card`) each paired with a co-located `.scss` file. Feature components (`Chatbot`, `ChatSidebar`, `ChatbotInputArea`, `ChatbotMessageList`, `UserTypeModal`) also each pair a `.jsx` with a same-named `.scss`. Global/shared styles live in `src/styles/` (`colors.scss`, `common.scss`) and `src/index.scss`/`src/App.scss`. `UserTypeModal` is currently dead code (not rendered anywhere) — `userSlice`'s `showModal`/`resetUser`-equivalent state in `useUserStore` exists but nothing currently mounts the modal in response to it.

### Theming
Light/dark mode via a `data-theme` attribute on `<html>`, toggled by `src/hooks/useTheme.js` + `src/components/ThemeToggle.jsx` (rendered globally from `App.jsx`, fixed top-right on every route). `colors.scss` defines the light palette as the default `:root`, with a `dark-palette` mixin applied both via `prefers-color-scheme: dark` (no explicit choice stored) and `:root[data-theme="dark"]` (explicit override, persisted to `localStorage['theme']`). An inline script in `index.html`'s `<head>` applies the stored theme before React mounts to avoid a flash of the wrong theme.
