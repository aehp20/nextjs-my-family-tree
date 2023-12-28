'use client'

import { message } from 'antd'
import { useRouter } from 'next/navigation'

import FormPerson from './FormPerson'

function PagePerson({ params }: { params?: { id: string } }) {
  const router = useRouter()

  const handleOnSuccess = () => {
    message.success('Submit success!')

    router.push('/people')
  }

  return (
    <div>
      <div>{params?.id ? 'Edit' : 'Add'} People</div>
      <FormPerson params={params} onSuccess={handleOnSuccess} />
    </div>
  )
}

export default PagePerson
