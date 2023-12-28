import { NODE_WIDTH, NODE_HEIGHT } from '@/app/tree-families/constants'
import type { CSSProperties } from 'react'
import type { ExtNode } from '@/app/tree-families/types'

export function getNodeStyle({ left, top }: Readonly<ExtNode>): CSSProperties {
  return {
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
    transform: `translate(${left * (NODE_WIDTH / 2)}px, ${
      top * (NODE_HEIGHT / 2)
    }px)`,
  }
}
