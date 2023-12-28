import { Gender, RelType } from '@/app/tree-families/constants'

export declare type Relation = Readonly<{
  id: string
  type: RelType
}>

export declare type Node = Readonly<{
  id: string
  label: string
  gender: Gender
  parents: readonly Relation[]
  children: readonly Relation[]
  siblings: readonly Relation[]
  spouses: readonly Relation[]
  placeholder?: boolean
}>

export declare type ExtNode = Node &
  Readonly<{
    top: number
    left: number
    hasSubTree: boolean
  }>

export interface FamilyNodeProps {
  node: ExtNode
  isRoot: boolean
  isHover?: boolean
  onClick: (id: string) => void
  onSubClick: (id: string) => void
  style?: React.CSSProperties
}

interface NodePersonRelation {
  id: string
  type: string
}

export interface NodePerson {
  id: string
  label: string
  parents: NodePersonRelation[]
  siblings: NodePersonRelation[]
  spouses: NodePersonRelation[]
  children: NodePersonRelation[]
}
