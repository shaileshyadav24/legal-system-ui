import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query'
import App from './App'
import { AUTH_STORAGE_KEY } from './services/api'
import './index.scss'

// A 401 from any authenticated query/mutation means the token is missing,
// expired, or was revoked (e.g. from another tab) — drop the session and
// send the user back to login. A hard redirect also guarantees no stale
// cached data survives into the next session.
const handleAuthError = (error) => {
  if (error?.status === 401) {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    if (window.location.pathname !== '/login') {
      window.location.assign('/login')
    }
  }
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: handleAuthError }),
  mutationCache: new MutationCache({ onError: handleAuthError }),
  defaultOptions: {
    queries: { retry: false, refetchOnWindowFocus: false }
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
