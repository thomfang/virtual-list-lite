import React, { useState, useMemo, useRef } from 'react';
import { VirtualList } from './VirtualList';

export type ReactVirtualListProps = {
  list: any[];
  itemSize: number;
  bufferCount: number;
  remainCount?: number;
  paddingHead?: string;
  paddingTail?: string;
  sizeGetter?: (element: HTMLElement) => number;
  positionGetter?: (element: HTMLElement) => number;
  onReachTail?: () => void;
  renderItem: (item: any, index: number) => React.ReactElement;
};

const defaultSizeGetter = (element: HTMLElement) => element.offsetHeight;
const defaultPositionGetter = (element: HTMLElement) => element.offsetTop;

export const ReactVirtualList: React.FC<ReactVirtualListProps> = ({
  itemSize,
  bufferCount,
  remainCount = 0,
  onReachTail,
  list,
  renderItem,
  paddingHead = 'paddingTop',
  paddingTail = 'paddingBottom',
  sizeGetter = defaultSizeGetter,
  positionGetter = defaultPositionGetter
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
  const [padding, setPadding] = useState({ head: 0, tail: 0 });
  const [virtualList] = useState(
    () => new VirtualList(itemSize, bufferCount, remainCount)
  );

  virtualList.setSizeGetter(sizeGetter);
  virtualList.setPositionGetter(positionGetter);

  const containerRef = useRef<HTMLDivElement>();
  const scrollerRef = useRef<HTMLDivElement>();

  const renderList = useMemo(() => list.slice(startIndex, endIndex), [
    list,
    startIndex,
    endIndex
  ]);

  const scrollHandler = () => {
    const container = containerRef.current as HTMLDivElement;
    const scroller = scrollerRef.current as HTMLDivElement;
    const { scrollTop, offsetHeight: containerSize } = container;
    const result = virtualList.compute(
      containerSize,
      scrollTop,
      list.length,
      [].slice.call(scroller.children)
    );

    setPadding({
      head: result.paddingHead,
      tail: result.paddingTail
    });

    if (result.shouldUpdate) {
      setStartIndex(result.startIndex);
      setEndIndex(result.endIndex);
    }

    if (result.reachTail) {
      onReachTail && onReachTail();
    }
  };

  return (
    <div
      ref={containerRef as any}
      onScroll={scrollHandler}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative'
      }}
    >
      <div
        ref={scrollerRef as any}
        style={{
          [paddingHead]: padding.head + 'px',
          [paddingTail]: padding.tail + 'px',
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%'
        }}
      >
        {renderList.map((item, index) => renderItem(item, index))}
      </div>
    </div>
  );
};
