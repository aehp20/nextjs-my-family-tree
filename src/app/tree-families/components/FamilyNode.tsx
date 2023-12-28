import { memo, useCallback } from 'react'
import styled, { css } from 'styled-components'
import type { FamilyNodeProps } from '@/app/tree-families/types'

export const FamilyNode = memo(function FamilyNode({
  node,
  isRoot,
  onClick,
  onSubClick,
  style,
}: FamilyNodeProps) {
  const clickHandler = useCallback(() => onClick(node.id), [node.id, onClick])
  const clickSubHandler = useCallback(
    () => onSubClick(node.id),
    [node.id, onSubClick]
  )

  return (
    <DivRoot style={style}>
      <DivInner $isRoot={isRoot} onClick={clickHandler}>
        <DivId>{node.label}</DivId>
      </DivInner>
      {node.hasSubTree && <DivSub onClick={clickSubHandler} />}
    </DivRoot>
  )
})

const DivSub = styled.div`
  position: absolute;
  top: 6px;
  right: 18px;
  width: 18px;
  height: 10px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px 0;
  background: #3a8fba;
  cursor: pointer;
`

const DivRoot = styled.div`
  position: absolute;
  display: flex;
  padding: 10px;
`

const DivInner = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  background: #a4ecff;
  padding: 4px;

  ${(props: { $isRoot: boolean }) =>
    props.$isRoot &&
    css`
      border-color: rgba(0, 0, 0, 0.8);
    `}

  &:hover {
    border-color: rgba(0, 0, 0, 0.8);
    background: #a4d5ff;
  }
`

const DivId = styled.div`
  font-size: 14px;
  line-height: 1;
  opacity: 0.7;
`
