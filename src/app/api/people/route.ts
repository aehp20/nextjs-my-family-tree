import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '../../libs/prisma'

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
    },
    orderBy: {
      first_name: 'asc',
    },
  })
  return NextResponse.json({ items: people, total: count._count.person_id })
}

export async function POST(request: NextRequest) {
  const { first_name, father_last_name, mother_last_name, gender, birthday } =
    await request.json()
  const newPerson = await prisma.person.create({
    data: {
      first_name,
      father_last_name,
      mother_last_name,
      gender,
      birthday,
    },
    select: {
      person_id: true,
      first_name: true,
      father_last_name: true,
      mother_last_name: true,
    },
  })
  return NextResponse.json(newPerson)
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
