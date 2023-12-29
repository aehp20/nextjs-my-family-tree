import { memo, useCallback } from 'react'
import classNames from 'classnames'
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
    <div className="flex absolute p-[10px]" style={style}>
      <div
        role="button"
        onKeyDown={clickHandler}
        className={classNames(
          'flex flex-[1] items-center justify-center border-solid border-2 border-black/20 rounded-lg overflow-hidden cursor-pointer bg-[#a4ecff] p-1',
          'hover:border-black/80 hover:bg-[#a4d5ff]',
          { 'text-black/80': isRoot }
        )}
        onClick={clickHandler}
        tabIndex={0}
      >
        <div className="text-xs leading-none opacity-70">{node.label}</div>
      </div>
      {node.hasSubTree && (
        <div
          role="button"
          className="absolute top-[6px] right-[18px] w-[18px] h-[10px] border-solid border-1 border-black/20 rounded-lg cursor-pointer bg-[#3a8fba]"
          onClick={clickSubHandler}
          onKeyDown={clickSubHandler}
          tabIndex={0}
        />
      )}
    </div>
  )
})
