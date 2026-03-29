export async function fetchPageContent(page) {
  const response = await fetch(`/content/${page}.json`)
  if (!response.ok) {
    throw new Error(`Failed to load content for ${page}`)
  }
  const data = await response.json()
  return data
}
