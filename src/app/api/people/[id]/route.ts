import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { writeFile } from 'fs/promises'
import fs from 'fs'

import { prisma } from '@/app/libs/prisma'
import { getFileExtension } from '@/app/utils'

const PATH_FOLDER_PHOTOS = 'private/uploads/photos/'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const person = await prisma.person.findUnique({
    where: { person_id: params.id },
  })
  return NextResponse.json(person)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const formData = await request.formData()

  const first_name = formData.get('first_name')
  const father_last_name = formData.get('father_last_name')
  const mother_last_name = formData.get('mother_last_name')
  const gender = formData.get('gender')
  const birthday = formData.get('birthday')
  const photo = formData.get('photo')

  const updatedPerson = await prisma.person.update({
    where: { person_id: params.id },
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
      const filename = `${updatedPerson.person_id}.${getFileExtension(
        photo.name
      )}`
      await writeFile(
        path.join(process.cwd(), PATH_FOLDER_PHOTOS + filename),
        buffer
      )
      await prisma.person.update({
        where: { person_id: updatedPerson.person_id },
        data: {
          photo: filename,
        },
      })
      return NextResponse.json({ success: true })
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json(error.message)
      }
      return NextResponse.json(String(error))
    }
  }

  if (photo === 'undefined') {
    const person = await prisma.person.findUnique({
      where: { person_id: params.id },
    })

    if (person?.photo) {
      const pathPhoto = path.join(
        process.cwd(),
        PATH_FOLDER_PHOTOS + person.photo
      )
      const fileExists = fs.existsSync(pathPhoto)

      if (fileExists) {
        fs.unlink(pathPhoto, async (error) => {
          if (error instanceof Error) {
            return NextResponse.json(error.message)
          }

          await prisma.person.update({
            where: { person_id: updatedPerson.person_id },
            data: {
              photo: null,
            },
          })

          console.log('File deleted successfully')
        })
      }
    }

    return NextResponse.json({ success: true })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const person = await prisma.person.delete({
      where: { person_id: params.id },
    })
    return NextResponse.json(person)
  } catch (error: unknown) {
    if (error instanceof Error) return NextResponse.json(error.message)
    return NextResponse.json(String(error))
  }
}
