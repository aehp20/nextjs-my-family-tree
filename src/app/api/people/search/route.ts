import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/app/libs/prisma'

export async function GET(request: NextRequest) {
  const value = request.nextUrl.searchParams.get('value') || undefined
  const people = await prisma.person.findMany({
    select: {
      person_id: true,
      first_name: true,
      father_last_name: true,
      mother_last_name: true,
      gender: true,
      birthday: true,
    },
    where: {
      OR: [
        {
          first_name: {
            contains: value,
            mode: 'insensitive',
          },
        },
        {
          father_last_name: {
            contains: value,
            mode: 'insensitive',
          },
        },
        {
          mother_last_name: {
            contains: value,
            mode: 'insensitive',
          },
        },
      ],
    },
    orderBy: {
      first_name: 'asc',
    },
  })
  return NextResponse.json({ items: people })
}
