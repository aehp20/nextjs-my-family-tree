'use client'

import ReactFamilyTree from 'react-family-tree'
import { useCallback, useEffect, useState } from 'react'

import { fetchFamilies } from '@/app/families/utils'
import { NODE_WIDTH, NODE_HEIGHT } from '@/app/tree-families/constants'
import { getNodeStyle } from '@/app/tree-families/utils/getNodeStyle'
import { FamilyNode } from '@/app/tree-families/components/FamilyNode'
import { getObjectNodePeople } from '@/app/tree-families/utils/getObjectNodePeople'
import type { NodePerson, ExtNode } from '@/app/tree-families/types'

function TreeFamilies() {
  const [nodePeople, setNodePeople] = useState<NodePerson[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [rootId, setRootId] = useState<string>()

  const fetchData = useCallback(
    (currentPage: number, currentPageSize: number) => {
      setIsFetching(true)
      fetchFamilies(currentPage, currentPageSize)
        .then(({ items }) => {
          const objectNodePeople = getObjectNodePeople(items)
          const nodes = Object.values(objectNodePeople)
          setNodePeople(nodes)
          setRootId(nodes[0].id)
        })
        .finally(() => setIsFetching(false))
    },
    []
  )

  useEffect(() => {
    fetchData(1, 500)
  }, [])

  return (
    <>
      <div>Family Tree</div>
      {!isFetching && nodePeople.length > 0 ? (
        <ReactFamilyTree
          nodes={nodePeople}
          rootId={rootId}
          width={NODE_WIDTH}
          height={NODE_HEIGHT}
          renderNode={(node: Readonly<ExtNode>) => (
            <FamilyNode
              key={node.id}
              node={node}
              isRoot={node.id === rootId}
              onClick={() => console.log('use setSelectId to display details')}
              onSubClick={setRootId}
              style={getNodeStyle(node)}
            />
          )}
        />
      ) : null}
    </>
  )
}

export default TreeFamilies
