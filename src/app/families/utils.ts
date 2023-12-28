export async function fetchFamilies(
  currentPage: number,
  currentPageSize: number
) {
  const response = await fetch(
    `/api/families?page=${currentPage}&limit=${currentPageSize}`
  )
  const families = await response.json()

  return families
}
