'use client'

import { useState, useEffect } from 'react'
import { Menu } from 'antd'
import Link from 'next/link'

const items = [
  {
    label: <Link href="/">Home</Link>,
    key: 'home',
  },
  {
    label: <Link href="/people">People</Link>,
    key: 'people',
  },
  {
    label: <Link href="/families">Families</Link>,
    key: 'families',
  },
  {
    label: <Link href="/tree-families">Family Tree</Link>,
    key: 'tree-families',
  },
]

function Navbar() {
  const [current, setCurrent] = useState('home')

  const onClick = (event: { key: string }) => {
    setCurrent(event.key)
  }

  useEffect(() => {
    const pathname = window.location.pathname.split('/')[1]
    setCurrent(pathname === '' ? 'home' : pathname)
  }, [])

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  )
}

export default Navbar
