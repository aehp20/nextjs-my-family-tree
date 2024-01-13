'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Button,
  Typography,
  Table,
  Popconfirm,
  message,
  Input,
  Space,
} from 'antd'
import type { InputRef } from 'antd'
import type { ColumnType } from 'antd/es/table'
import type { FilterConfirmProps } from 'antd/es/table/interface'
import {
  ManOutlined,
  WomanOutlined,
  LineOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { TablePaginationConfig } from 'antd/es/table/interface'
import dayjs from 'dayjs'
import Link from 'next/link'
import Highlighter from 'react-highlight-words'

const { Title } = Typography

interface DataType {
  person_id: string
  first_name: string
  father_last_name: string
  mother_last_name: number
  gender: string
  birthday: string
}

type DataIndex = keyof DataType

async function fetchPeople(
  currentPage: number,
  currentPageSize: number,
  query?: string
) {
  const urlBase = `/api/people?page=${currentPage}&limit=${currentPageSize}`
  const url = query ? `${urlBase}&query=${query}` : urlBase
  const response = await fetch(url)
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
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedPeopleKeys(selectedRowKeys)
    },
  }

  const fetchData = useCallback(
    (currentPage: number, currentPageSize: number, query?: string) => {
      setIsFetching(true)
      fetchPeople(currentPage, currentPageSize, query)
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

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
    // Filter on Database
    fetchData(
      1,
      currentPageSize,
      JSON.stringify({ [dataIndex]: selectedKeys[0] })
    )
  }

  const handleReset = (
    clearFilters: () => void,
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    clearFilters()
    confirm()
    setSearchText('')
    setSearchedColumn(dataIndex)
    // Filter on Database
    fetchData(1, currentPageSize)
  }

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): ColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() =>
              clearFilters && handleReset(clearFilters, confirm, dataIndex)
            }
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close()
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text: string, { person_id }: { person_id: string }) =>
      searchedColumn === dataIndex ? (
        <Link href={`/people/${person_id}`}>
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ''}
          />
        </Link>
      ) : (
        <Link href={`/people/${person_id}`}>{text}</Link>
      ),
  })

  const columns = [
    {
      title: 'First name',
      dataIndex: 'first_name',
      ...getColumnSearchProps('first_name'),
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
      render: (text: string) =>
        text === 'm' ? (
          <ManOutlined />
        ) : text === 'w' ? (
          <WomanOutlined />
        ) : (
          <LineOutlined />
        ),
    },
    {
      title: 'Birthday',
      dataIndex: 'birthday',
      render: (text: string) => (text ? dayjs(text).format('DD/MM/YYYY') : ''),
    },
  ]

  useEffect(() => {
    fetchData(currentPage, currentPageSize)
  }, [fetchData, currentPage, currentPageSize])

  return (
    <div>
      <div className="mt-2">
        <Title level={4}>People {totalPages ? `(${totalPages})` : ''}</Title>
      </div>
      <div className="flex justify-between mb-2">
        <Button href="/people/add" type="primary">
          Add
        </Button>
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
      </div>
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
              position: ['bottomCenter'],
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
