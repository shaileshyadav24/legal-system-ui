import { create } from 'zustand'
import { getStoredUser } from '../services/authService'
import { loadStoredUserType } from '../services/chatService'

// Hydrated synchronously (not in a useEffect) so a page refresh never
// renders a logged-out state first — AuthGuard reads isAuthenticated on the
// very first render, before any effect gets a chance to run. The token is
// still verified against GET /auth/me in the background (see App.jsx); this
// is just the optimistic initial value.
const cachedUser = getStoredUser()

export const useUserStore = create((set) => ({
  isAuthenticated: !!cachedUser?.token,
  isRegistered: false,
  userType: cachedUser?.token ? (loadStoredUserType() || 'layman') : null,
  userName: cachedUser?.full_name || null,
  userEmail: cachedUser?.email || null,
  showModal: false,

  setUserType: (userType) => set({ userType, showModal: false }),

  setUserProfile: ({ name, email, userType }) => set({
    userName: name,
    userEmail: email,
    userType,
    isRegistered: true
  }),

  loginSuccess: ({ email, userType, name }) => set((state) => ({
    isAuthenticated: true,
    showModal: false,
    userEmail: email,
    userType: userType || state.userType,
    userName: name || state.userName
  })),

  logout: () => set({
    isAuthenticated: false,
    userType: null,
    userEmail: null,
    userName: null,
    showModal: false
  }),

  resetUser: () => set({
    isAuthenticated: false,
    userType: null,
    userEmail: null,
    userName: null,
    showModal: true
  })
}))
