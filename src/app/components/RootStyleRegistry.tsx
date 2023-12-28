'use client'
import { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs'

export const RootStyleRegistry = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [cache] = useState(() => createCache())

  useServerInsertedHTML(() => {
    return (
      <script
        dangerouslySetInnerHTML={{
          __html: `</script>${extractStyle(cache)}<script>`,
        }}
      />
    )
  })

  return <StyleProvider cache={cache}>{children}</StyleProvider>
}
