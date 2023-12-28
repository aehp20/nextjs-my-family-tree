import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/libs/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const family = await prisma.family.findUnique({
    where: { family_id: params.id },
    select: {
      family_id: true,
      father: {
        select: {
          person_id: true,
          first_name: true,
          father_last_name: true,
          mother_last_name: true,
        },
      },
      mother: {
        select: {
          person_id: true,
          first_name: true,
          father_last_name: true,
          mother_last_name: true,
        },
      },
      children: {
        select: {
          person_id: true,
          first_name: true,
          father_last_name: true,
          mother_last_name: true,
        },
      },
    },
  })
  return NextResponse.json(family)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { father, mother, children } = await request.json()
  const updatedFamily = await prisma.family.update({
    where: { family_id: params.id },
    data: {
      father_id: father,
      mother_id: mother,
    },
    select: {
      family_id: true,
      children: {
        select: {
          person_id: true,
        },
      },
    },
  })
  const response = await prisma.$transaction([
    ...updatedFamily.children.map((person: { person_id: string }) =>
      prisma.person.update({
        where: { person_id: person.person_id },
        data: {
          family_id: null,
        },
      })
    ),
    ...children.map((person_id: string) =>
      prisma.person.update({
        where: { person_id },
        data: {
          family_id: updatedFamily.family_id,
        },
      })
    ),
  ])
  return NextResponse.json(response)
}
