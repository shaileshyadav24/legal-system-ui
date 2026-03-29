import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchPageContent } from '../../services/contentService'

export const loadPageContent = createAsyncThunk('content/loadPageContent', async (page) => {
  const content = await fetchPageContent(page)
  return { page, content }
})

const initialState = {
  status: 'idle',
  currentPage: null,
  pages: {},
  error: null
}

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadPageContent.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadPageContent.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.currentPage = action.payload.page
        state.pages[action.payload.page] = action.payload.content
      })
      .addCase(loadPageContent.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
})

export default contentSlice.reducer
