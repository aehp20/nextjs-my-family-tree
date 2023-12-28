import { Pacifico } from 'next/font/google'

import { RootStyleRegistry } from './components/RootStyleRegistry'
import StyledComponentsRegistry from '@/app/components/StyledComponentsRegistry'
import GlobalStyles from '@/app//styles/GlobalStyles'

import Navbar from './components/Navbar'

export const metadata = {
  title: 'My family',
  description: 'My family app',
  keywords: 'family, tree',
}

const pacifico = Pacifico({
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
      <body className={pacifico.className}>
        <StyledComponentsRegistry>
          <GlobalStyles />
          <RootStyleRegistry>
            <Navbar />
            {children}
          </RootStyleRegistry>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
