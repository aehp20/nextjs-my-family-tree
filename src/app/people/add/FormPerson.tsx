'use client'

import { useEffect } from 'react'
import { Button, DatePicker, Form, Input, Space, Select, message } from 'antd'
import dayjs, { Dayjs } from 'dayjs'

import type { Person } from '../types'

async function fetchPerson(id: string) {
  const response = await fetch(`/api/people/${id}`)
  const person = await response.json()

  return person
}

function FormPerson({
  params,
  onSuccess,
}: {
  params?: { id: string }
  onSuccess?: (person: Person) => void
}) {
  const [form] = Form.useForm()

  const onFinish = async (values: { birthday: Dayjs | undefined }) => {
    let data

    if (values.birthday) {
      data = { ...values, birthday: dayjs(values.birthday).toISOString() }
    } else {
      data = values
    }

    const response = await fetch(
      `/api/people${params?.id ? `/${params.id}` : ''}`,
      {
        method: params?.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    )
    const person = await response.json()

    if (person && onSuccess) {
      onSuccess(person)
    }
  }

  const onFinishFailed = () => {
    message.error('Submit failed!')
  }

  const onGenderChange = (value: string) => {
    form.setFieldsValue({ gender: value })
  }

  useEffect(() => {
    if (params?.id) {
      fetchPerson(params.id).then((data) => {
        form.setFieldsValue({
          ...data,
          birthday: data.birthday ? dayjs(data.birthday) : null,
        })
      })
    }
  }, [params])

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      initialValues={{ gender: 'm' }}
    >
      <Form.Item
        name="first_name"
        label="First name"
        rules={[{ required: true }]}
      >
        <Input placeholder="Enter a first name" />
      </Form.Item>
      <Form.Item name="father_last_name" label="Father last name">
        <Input placeholder="Enter a father last name" />
      </Form.Item>
      <Form.Item name="mother_last_name" label="Mother last name">
        <Input placeholder="Enter a mother last name" />
      </Form.Item>
      <Form.Item name="gender" label="Gender">
        <Select
          onChange={onGenderChange}
          allowClear
          options={[
            { value: 'm', label: 'Man' },
            { value: 'w', label: 'Woman' },
            { value: 'o', label: 'Other' },
          ]}
        />
      </Form.Item>
      <Form.Item name="birthday" label="Birthday">
        <DatePicker format="DD/MM/YYYY" />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default FormPerson
