'use client'

import { useEffect, useState } from 'react'
import {
  Button,
  DatePicker,
  Form,
  Input,
  Space,
  Select,
  message,
  Col,
  Row,
  Upload,
} from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import type { UploadChangeParam } from 'antd/es/upload'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'
import { UploadRequestOption } from 'rc-upload/lib/interface'
import dayjs, { Dayjs } from 'dayjs'
import Image from 'next/image'

import type { Person } from '../types'

async function fetchPerson(id: string) {
  const response = await fetch(`/api/people/${id}`)
  const person = await response.json()

  return person
}

async function fetchPersonPhoto(id: string) {
  const response = await fetch(`/api/people/${id}/photo`)

  if (!response.ok) {
    const { message } = await response.clone().json()

    if (message === 'Photo not found') {
      return null
    }

    throw new Error('HTTP error ' + response.status)
  }

  const blob = await response.clone().blob()
  const text = await blob.arrayBuffer()
  const encoded = Buffer.from(text).toString('base64')
  const imageBase64 = `data:${blob.type};base64, ${encoded}`

  return imageBase64
}

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result as string))
  reader.readAsDataURL(img)
}

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!')
  }
  return isJpgOrPng && isLt2M
}

function FormPerson({
  params,
  onSuccess,
}: {
  params?: { id: string }
  onSuccess?: (person: Person) => void
}) {
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>()

  const [form] = Form.useForm()

  const onFinish = async (values: {
    first_name: string
    father_last_name?: string
    mother_last_name?: string
    birthday: Dayjs | undefined
    gender: string
    photo: { file: { originFileObj: File } } | undefined
  }) => {
    console.log('values', values)
    const formData = new FormData()
    formData.append('first_name', values.first_name)
    formData.append('gender', values.gender)

    if (values.father_last_name) {
      formData.append('father_last_name', values.father_last_name)
    }
    if (values.mother_last_name) {
      formData.append('mother_last_name', values.mother_last_name)
    }
    if (values.father_last_name) {
      formData.append('father_last_name', values.father_last_name)
    }
    if (values.birthday) {
      formData.append('birthday', dayjs(values.birthday).toISOString())
    }
    if (values.photo) {
      formData.append('photo', values.photo.file.originFileObj)
    }

    const response = await fetch(
      `/api/people${params?.id ? `/${params.id}` : ''}`,
      {
        method: params?.id ? 'PUT' : 'POST',
        body: formData,
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

  const handleCustomRequestPhoto = (options: UploadRequestOption) => {
    setTimeout(() => {
      options?.onSuccess?.('ok')
    }, 0)
  }

  const handleChangePhoto: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoading(false)
        setImageUrl(url)
      })
    }
  }

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  useEffect(() => {
    if (params?.id) {
      fetchPerson(params.id).then((data) => {
        form.setFieldsValue({
          ...data,
          birthday: data.birthday ? dayjs(data.birthday) : null,
        })
      })
      fetchPersonPhoto(params.id).then((data) => {
        if (data) {
          setImageUrl(data)
        }
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
      <Row gutter={[16, 16]}>
        <Col span={12}>
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
        </Col>
        <Col span={12}>
          <Form.Item name="photo" label="Photo">
            <Upload
              name="photo"
              listType="picture-circle"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleChangePhoto}
              customRequest={handleCustomRequestPhoto}
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="Picture of the user"
                  width={200}
                  height={200}
                />
              ) : (
                uploadButton
              )}
            </Upload>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Space>
        </Form.Item>
      </Row>
    </Form>
  )
}

export default FormPerson
