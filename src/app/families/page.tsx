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
import Link from 'next/link'

import { fetchFamilies } from '@/app/families/utils'

const { Title } = Typography

const columns = [
  {
    title: 'Family name',
    dataIndex: 'family_name',
    render: (text: string, { family_id }: { family_id: string }) => (
      <Link href={`/families/${family_id}`}>{text}</Link>
    ),
  },
  {
    title: '# Children',
    dataIndex: 'count_children',
  },
]

function Families() {
  const [families, setFamilies] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPageSize, setCurrentPageSize] = useState(10)
  const [selectedFamiliesKeys, setSelectedFamiliesKeys] = useState<React.Key[]>(
    []
  )
  const [isFetching, setIsFetching] = useState(false)

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedFamiliesKeys(selectedRowKeys)
    },
  }

  const fetchData = useCallback(
    (currentPage: number, currentPageSize: number) => {
      setIsFetching(true)
      fetchFamilies(currentPage, currentPageSize)
        .then(({ items, total }) => {
          setFamilies(
            items.map(
              (family: {
                family_id: string
                father: {
                  first_name: string
                  father_last_name: string
                  mother_last_name: string
                }
                mother: {
                  first_name: string
                  father_last_name: string
                  mother_last_name: string
                }
                children: unknown[]
              }) => ({
                family_id: family.family_id,
                key: family.family_id,
                family_name: `
                  ${family.father.first_name}
                  ${family.father.father_last_name ?? ''}
                  ${family.father.mother_last_name ?? ''}
                   -
                  ${family.mother.first_name}
                  ${family.mother.father_last_name ?? ''}
                  ${family.mother.mother_last_name ?? ''}
                `,
                count_children: family.children.length,
              })
            )
          )
          setTotalPages(total)
        })
        .finally(() => setIsFetching(false))
    },
    []
  )

  const confirm = useCallback(async () => {
    const idsArray = selectedFamiliesKeys.map((id) => `id=${id}`)
    const idsString = idsArray.join('&')

    const response = await fetch(`/api/families?${idsString}`, {
      method: 'DELETE',
    })
    const deletedResponse = await response.json()

    if (deletedResponse) {
      setSelectedFamiliesKeys([])
      fetchData(currentPage, currentPageSize)

      message.success('Delete success!')
    }
  }, [selectedFamiliesKeys, fetchData, currentPage, currentPageSize])

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
        <Title level={4}>Families {totalPages ? `(${totalPages})` : ''}</Title>
        <Space>
          {selectedFamiliesKeys.length > 0 && (
            <Popconfirm
              title="Delete families"
              description="Are you sure to delete the selected item(s)?"
              onConfirm={confirm}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" danger>
                Delete ({selectedFamiliesKeys.length})
              </Button>
            </Popconfirm>
          )}
          <Button type="primary" href="/families/add">
            Add
          </Button>
        </Space>
      </Flex>
      <div>
        {families.length > 0 ? (
          <Table
            loading={isFetching}
            rowSelection={{
              type: 'checkbox',
              ...rowSelection,
            }}
            columns={columns}
            dataSource={families}
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

export default Families
