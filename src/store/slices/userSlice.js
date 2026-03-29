import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userType: null,
  showModal: true
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserType: (state, action) => {
      state.userType = action.payload
      state.showModal = false
    },
    showModal: (state) => {
      state.showModal = true
    },
    hideModal: (state) => {
      state.showModal = false
    },
    resetUser: (state) => {
      state.userType = null
      state.showModal = true
    }
  }
})

export const { setUserType, showModal, hideModal, resetUser } = userSlice.actions
export default userSlice.reducer