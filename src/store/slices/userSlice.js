import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isAuthenticated: false,
  isRegistered: false,
  userType: null,
  userName: null,
  userEmail: null,
  showModal: false
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserType: (state, action) => {
      state.userType = action.payload
      state.showModal = false
    },
    setUserProfile: (state, action) => {
      const { name, email, userType } = action.payload
      state.userName = name
      state.userEmail = email
      state.userType = userType
      state.isRegistered = true
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true
      state.showModal = false
      state.userEmail = action.payload.email
      state.userType = action.payload.userType || state.userType
      state.userName = action.payload.name || state.userName
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.userType = null
      state.userEmail = null
      state.userName = null
      state.showModal = false
    },
    resetUser: (state) => {
      state.isAuthenticated = false
      state.userType = null
      state.userEmail = null
      state.userName = null
      state.showModal = true
    }
  }
})

export const { setUserType, setUserProfile, loginSuccess, logout, resetUser } = userSlice.actions
export default userSlice.reducer