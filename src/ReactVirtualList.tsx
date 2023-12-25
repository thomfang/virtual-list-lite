import React, { ReactNode, RefObject, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { VirtualList, ScrollDirection } from './VirtualList'

const paddingAttrNames = {
  vertical: {
    leading: 'paddingTop',
    trailing: 'paddingBottom'
  },
  horizontal: {
    leading: 'paddingLeft',
    trailing: 'paddingRight'
  }
}

export type ReactListViewProps = {
  itemCount: number
  itemExtent: number
  bufferCount?: number
  countToTheTrailing?: number
  sizeGetter?: (element: HTMLElement) => number
  positionGetter?: (element: HTMLElement) => number
  direction?: ScrollDirection
  onReachTheEnd?: () => void
  containerStyles?: React.CSSProperties
  itemBuilder: (index: number) => ReactNode
  scrollerRef?: RefObject<HTMLDivElement>
}

export function ReactListView({
  itemCount,
  itemExtent,
  bufferCount = 3,
  countToTheTrailing = 0,
  onReachTheEnd,
  itemBuilder,
  direction = ScrollDirection.vertical,
  containerStyles = {},
  scrollerRef: customScrollerRef,
}: ReactListViewProps) {
  const isVerticalScroll = direction === ScrollDirection.vertical

  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(0)
  const [padding, setPadding] = useState({ leading: 0, trailing: 0 })
  const [virtualList] = useState(() => new VirtualList({
    itemExtent,
    bufferCount,
    countToTheTrailing,
    direction,
  }))

  const containerRef = useRef<HTMLDivElement>(null)
  const listWrapperRef = useRef<HTMLDivElement>(null)
  const paddingAttr = isVerticalScroll
    ? paddingAttrNames.vertical
    : paddingAttrNames.horizontal

  const scrollerRef = customScrollerRef ?? containerRef

  const update = useCallback(() => {
    if (scrollerRef.current == null || listWrapperRef.current == null) {
      return
    }

    const container = scrollerRef.current as HTMLDivElement
    const list = listWrapperRef.current as HTMLDivElement
    let scrollPosition!: number
    let containerSize!: number

    if (isVerticalScroll) {
      scrollPosition = container.scrollTop
      containerSize = container.offsetHeight
    } else {
      scrollPosition = container.scrollLeft
      containerSize = container.offsetWidth
    }

    const result = virtualList.compute(
      containerSize,
      scrollPosition,
      itemCount,
      [].slice.call(list.children)
    )

    setPadding({
      leading: result.paddingLeading,
      trailing: result.paddingTrailing
    })

    if (result.shouldUpdate) {
      setStartIndex(result.startIndex)
      setEndIndex(result.endIndex)
    }

    if (result.shouldScrollToLeading) {
      if (isVerticalScroll) {
        container.scrollTop = 0
      } else {
        container.scrollLeft = 0
      }
    }

    if (result.isReachTheEnd) {
      onReachTheEnd?.()
    }
  }, [isVerticalScroll, itemCount, onReachTheEnd, virtualList, scrollerRef])

  useLayoutEffect(() => {
    update()
  }, [itemCount, update])

  const items: ReactNode[] = []
  const end = Math.min(itemCount - 1, endIndex)

  for (let i = startIndex; i <= end; i++) {
    items.push(
      <React.Fragment key={i}>
        {itemBuilder(i)}
      </React.Fragment>
    )
  }

  return (
    <div
      ref={scrollerRef}
      onScroll={update}
      style={{
        width: '100%',
        position: 'relative',
        overflow: 'auto',
        ...containerStyles
      }}>
      <div
        ref={listWrapperRef}
        style={{
          left: 0,
          top: 0,
          width: '100%',
          [paddingAttr.leading]: padding.leading + 'px',
          [paddingAttr.trailing]: padding.trailing + 'px'
        }}>
        {items}
      </div>
    </div>
  )
}
