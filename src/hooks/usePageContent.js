import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadPageContent } from '../store/slices/contentSlice'

export function usePageContent(page) {
  const dispatch = useDispatch()
  const state = useSelector((state) => state.content)
  const pageContent = state.pages[page] || null

  useEffect(() => {
    if (!pageContent || state.currentPage !== page) {
      dispatch(loadPageContent(page))
    }
  }, [dispatch, page, pageContent, state.currentPage])

  return {
    content: pageContent,
    status: state.status,
    error: state.error
  }
}
