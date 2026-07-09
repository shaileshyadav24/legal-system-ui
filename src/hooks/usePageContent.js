import { useQuery } from '@tanstack/react-query'
import { fetchPageContent } from '../services/contentService'

export function usePageContent(page) {
  const { data, status, error } = useQuery({
    queryKey: ['content', page],
    queryFn: () => fetchPageContent(page),
    staleTime: Infinity
  })

  return {
    content: data || null,
    status: status === 'pending' ? 'loading' : status,
    error: error?.message || null
  }
}
