import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs, { Stats } from 'fs'

import { prisma } from '@/app/libs/prisma'
import { getFileExtension } from '@/app/utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const person = await prisma.person.findUnique({
    where: { person_id: params.id },
    select: {
      person_id: true,
      photo: true,
    },
  })

  if (!person) {
    return NextResponse.json({ message: 'Person not found' })
  }

  if (!person.photo) {
    return NextResponse.json(
      { message: 'Photo not found' },
      {
        status: 404,
      }
    )
  }

  const filePath = path.join(
    process.cwd(),
    'private/uploads/photos/' + person.photo
  )

  const contentType = getFileExtension(`${person.photo}`)

  try {
    const stats: Stats = await fs.promises.stat(filePath)
    const data = fs.readFileSync(filePath)
    const response = new NextResponse(data, {
      status: 200,
      headers: new Headers({
        'content-type': `image/${contentType}`,
        'content-length': `${stats.size}`,
      }),
    })

    return response
  } catch (error) {
    return NextResponse.json(String(error))
  }
}
