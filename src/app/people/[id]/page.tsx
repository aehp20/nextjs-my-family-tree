'use client'

import PagePerson from '../add/page'

function EditPeople({ params }: { params: { id: string } }) {
  return <PagePerson params={params} />
}

export default EditPeople
