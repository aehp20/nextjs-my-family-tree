'use client'

import PageFamily from '../add/page'

function EditFamily({ params }: { params: { id: string } }) {
  return <PageFamily params={params} />
}

export default EditFamily
