import { Work_Sans } from 'next/font/google'

import { RootStyleRegistry } from './components/RootStyleRegistry'

import Navbar from './components/Navbar'

import './index.css'

export const metadata = {
  title: 'My family',
  description: 'My family app',
  keywords: 'family, tree',
}

const font = Work_Sans({
  weight: ['400'],
  style: ['normal'],
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <RootStyleRegistry>
          <Navbar />
          {children}
        </RootStyleRegistry>
      </body>
    </html>
  )
}
