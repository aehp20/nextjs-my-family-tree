export async function fetchPersonPhoto(id: string) {
  const response = await fetch(`/api/people/${id}/photo`)

  if (!response.ok) {
    const { message } = await response.clone().json()

    if (message === 'Photo not found') {
      return null
    }

    throw new Error('HTTP error ' + response.status)
  }

  const blob = await response.clone().blob()
  const text = await blob.arrayBuffer()
  const encoded = Buffer.from(text).toString('base64')
  const imageBase64 = `data:${blob.type};base64, ${encoded}`

  return imageBase64
}
