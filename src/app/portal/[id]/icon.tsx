import { ImageResponse } from 'next/og'
import { api } from '@/trpc/server'

export const size = { width: 64, height: 64 }
export const contentType = 'image/svg+xml'

export default async function Icon({ params }: { params: { id: string } }) {
  // Fetch the project/portal data using the id param
  const project = await api.project.getForPortal({ id: params.id })
  const color = project?.primaryColor || '#2563eb'

  return new ImageResponse(
    (
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
        <circle cx="32" cy="32" r="28" fill={color} />
      </svg>
    ),
    { ...size }
  )
} 