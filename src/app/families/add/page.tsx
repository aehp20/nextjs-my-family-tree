'use client'

import { useState, useEffect } from 'react'
import { Button, Form, message, Alert } from 'antd'
import { useRouter } from 'next/navigation'

import SelectPeople from '@/app/components/SelectPeople'
import type { FamilyFormProps } from '@/app/families/types'
import type { Person } from '@/app/people/types'

async function fetchFamily(id: string) {
  const response = await fetch(`/api/families/${id}`)
  const family = await response.json()

  return family
}

function PageFamily({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [form] = Form.useForm<FamilyFormProps>()

  const [father, setFather] = useState<Person>()
  const [mother, setMother] = useState<Person>()
  const [children, setChildren] = useState<Person[]>()
  const [globalError, setGlobalError] = useState<string>()

  const onFinish = async (values: FamilyFormProps) => {
    const { father, mother, children } = values

    let validation = true
    setGlobalError('')

    if (children?.includes(father)) {
      validation = false
      setGlobalError('You cannot add a father as a child')
    }
    if (children?.includes(mother)) {
      validation = false
      setGlobalError('You cannot add a mother as a child')
    }

    if (validation) {
      const response = await fetch(
        `/api/families${params?.id ? `/${params.id}` : ''}`,
        {
          method: params?.id ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        }
      )
      const family = await response.json()
      if (family) {
        message.success('Submit success!')
        router.push('/families')
      }
    }
  }

  const onFinishFailed = () => {
    message.error('Submit failed!')
  }

  useEffect(() => {
    if (params?.id) {
      fetchFamily(params.id).then((data) => {
        setFather(data.father)
        setMother(data.mother)
        setChildren(data.children)
      })
    }
  }, [params])

  return (
    <div>
      <div>{params?.id ? 'Edit' : 'Add'} Family</div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <SelectPeople
          name="father"
          label="Father"
          required
          form={form}
          initialValue={father}
        />
        <SelectPeople
          name="mother"
          label="Mother"
          required
          form={form}
          initialValue={mother}
        />
        <SelectPeople
          name="children"
          label="Children"
          multiple
          form={form}
          initialValue={children}
        />
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
        {globalError && (
          <Alert description={globalError} type="error" showIcon />
        )}
      </Form>
    </div>
  )
}

export default PageFamily
