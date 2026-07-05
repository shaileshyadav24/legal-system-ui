import { create } from 'zustand'

export const useUserStore = create((set) => ({
  isAuthenticated: false,
  isRegistered: false,
  userType: null,
  userName: null,
  userEmail: null,
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
