import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { writeFile } from 'fs/promises'

import { prisma } from '@/app/libs/prisma'
import { getFileExtension } from '@/app/utils'

export async function GET(request: NextRequest) {
  const page = Number(request.nextUrl.searchParams.get('page'))
  const limit = Number(request.nextUrl.searchParams.get('limit'))
  const count = await prisma.person.aggregate({
    _count: {
      person_id: true,
    },
  })
  const people = await prisma.person.findMany({
    skip: (page - 1) * limit,
    take: limit,
    select: {
      person_id: true,
      first_name: true,
      father_last_name: true,
      mother_last_name: true,
      gender: true,
      birthday: true,
      photo: true,
    },
    orderBy: {
      first_name: 'asc',
    },
  })
  return NextResponse.json({ items: people, total: count._count.person_id })
}

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  const first_name = formData.get('first_name')
  const father_last_name = formData.get('father_last_name')
  const mother_last_name = formData.get('mother_last_name')
  const gender = formData.get('gender')
  const birthday = formData.get('birthday')
  const photo = formData.get('photo')

  const newPerson = await prisma.person.create({
    data: {
      first_name: `${first_name}`,
      father_last_name: father_last_name ? `${father_last_name}` : null,
      mother_last_name: mother_last_name ? `${mother_last_name}` : null,
      gender: gender ? `${gender}` : gender,
      birthday: birthday ? `${birthday}` : null,
    },
    select: {
      person_id: true,
    },
  })

  if (photo instanceof Blob) {
    try {
      const buffer = Buffer.from(await photo.arrayBuffer())
      const filename = `${newPerson.person_id}.${getFileExtension(photo.name)}`
      await writeFile(
        path.join(process.cwd(), 'private/uploads/photos/' + filename),
        buffer
      )
      await prisma.person.update({
        where: { person_id: newPerson.person_id },
        data: {
          photo: filename,
        },
      })
    } catch (error) {
      if (error instanceof Error) return NextResponse.json(error.message)
      return NextResponse.json(String(error))
    }
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(request: NextRequest) {
  try {
    const ids = request.nextUrl.searchParams.getAll('id')
    const result = await prisma.person.deleteMany({
      where: { person_id: { in: ids } },
    })
    return NextResponse.json(result)
  } catch (error: unknown) {
    if (error instanceof Error) return NextResponse.json(error.message)
    return NextResponse.json(String(error))
  }
}
