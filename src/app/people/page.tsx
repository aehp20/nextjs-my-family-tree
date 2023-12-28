'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Button,
  Flex,
  Typography,
  Table,
  Space,
  Popconfirm,
  message,
} from 'antd'
import { TablePaginationConfig } from 'antd/es/table/interface'
import dayjs from 'dayjs'
import Link from 'next/link'

const { Title } = Typography

const columns = [
  {
    title: 'First name',
    dataIndex: 'first_name',
    render: (text: string, { person_id }: { person_id: string }) => (
      <Link href={`/people/${person_id}`}>{text}</Link>
    ),
  },
  {
    title: 'F. last name',
    dataIndex: 'father_last_name',
  },
  {
    title: 'M. last name',
    dataIndex: 'mother_last_name',
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    render: (text: string) => (text === 'm' ? 'Man' : 'Woman'),
  },
  {
    title: 'Birthday',
    dataIndex: 'birthday',
    render: (text: string) => (text ? dayjs(text).format('DD/MM/YYYY') : ''),
  },
]

async function fetchPeople(currentPage: number, currentPageSize: number) {
  const response = await fetch(
    `/api/people?page=${currentPage}&limit=${currentPageSize}`
  )
  const people = await response.json()

  return people
}

function People() {
  const [people, setPeople] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPageSize, setCurrentPageSize] = useState(10)
  const [selectedPeopleKeys, setSelectedPeopleKeys] = useState<React.Key[]>([])
  const [isFetching, setIsFetching] = useState(false)

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedPeopleKeys(selectedRowKeys)
    },
  }

  const fetchData = useCallback(
    (currentPage: number, currentPageSize: number) => {
      setIsFetching(true)
      fetchPeople(currentPage, currentPageSize)
        .then(({ items, total }) => {
          setPeople(
            items.map((person: { person_id: string }) => ({
              ...person,
              key: person.person_id,
            }))
          )
          setTotalPages(total)
        })
        .finally(() => setIsFetching(false))
    },
    []
  )

  const confirm = useCallback(async () => {
    const idsArray = selectedPeopleKeys.map((id) => `id=${id}`)
    const idsString = idsArray.join('&')

    const response = await fetch(`/api/people?${idsString}`, {
      method: 'DELETE',
    })
    const deletedResponse = await response.json()

    if (deletedResponse) {
      setSelectedPeopleKeys([])
      fetchData(currentPage, currentPageSize)

      message.success('Delete success!')
    }
  }, [selectedPeopleKeys, fetchData, currentPage, currentPageSize])

  const handleOnChange = useCallback(
    (pagination: TablePaginationConfig) => {
      const { current, pageSize } = pagination
      if (current) {
        setCurrentPage(current)
      }
      if (pageSize) {
        setCurrentPageSize(pageSize)
      }
    },
    [setCurrentPage, setCurrentPageSize]
  )

  useEffect(() => {
    fetchData(currentPage, currentPageSize)
  }, [fetchData, currentPage, currentPageSize])

  return (
    <div>
      <Flex justify="space-between">
        <Title level={4}>People {totalPages ? `(${totalPages})` : ''}</Title>
        <Space>
          {selectedPeopleKeys.length > 0 && (
            <Popconfirm
              title="Delete people"
              description="Are you sure to delete the selected item(s)?"
              onConfirm={confirm}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" danger>
                Delete ({selectedPeopleKeys.length})
              </Button>
            </Popconfirm>
          )}
          <Button type="primary" href="/people/add">
            Add
          </Button>
        </Space>
      </Flex>
      <div>
        {people.length > 0 ? (
          <Table
            loading={isFetching}
            rowSelection={{
              type: 'checkbox',
              ...rowSelection,
            }}
            columns={columns}
            dataSource={people}
            pagination={{
              position: ['none', 'bottomCenter'],
              defaultCurrent: currentPage,
              total: totalPages,
            }}
            onChange={handleOnChange}
          />
        ) : null}
      </div>
    </div>
  )
}

export default People
