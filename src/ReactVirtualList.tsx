import React, { useState, useMemo, useRef } from 'react';
import { VirtualList } from './VirtualList';

const paddingAttrNames = {
  vertical: {
    head: 'paddingTop',
    tail: 'paddingBottom'
  },
  horzental: {
    head: 'paddingLeft',
    tail: 'paddingRight'
  }
};

export type ReactVirtualListProps = {
  list: any[];
  itemSize: number;
  bufferCount: number;
  remainCount?: number;
  sizeGetter?: (element: HTMLElement) => number;
  positionGetter?: (element: HTMLElement) => number;
  verticalLayout?: boolean;
  onReachTail?: () => void;
  renderItem: (item: any, index: number) => React.ReactElement;
};

export const ReactVirtualList: React.FC<ReactVirtualListProps> = ({
  itemSize,
  bufferCount,
  remainCount = 0,
  onReachTail,
  list,
  renderItem,
  verticalLayout = true
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
  const [padding, setPadding] = useState({ head: 0, tail: 0 });
  const [virtualList] = useState(
    () => new VirtualList(itemSize, bufferCount, remainCount, verticalLayout)
  );

  const containerRef = useRef<HTMLDivElement>();
  const scrollerRef = useRef<HTMLDivElement>();
  const paddingAttr = verticalLayout
    ? paddingAttrNames.vertical
    : paddingAttrNames.horzental;

  const renderList = useMemo(() => list.slice(startIndex, endIndex), [
    list,
    startIndex,
    endIndex
  ]);

  const scrollHandler = () => {
    const container = containerRef.current as HTMLDivElement;
    const scroller = scrollerRef.current as HTMLDivElement;
    let scrollPosition!: number;
    let containerSize!: number;

    if (verticalLayout) {
      scrollPosition = container.scrollTop;
      containerSize = container.offsetHeight;
    } else {
      scrollPosition = container.scrollLeft;
      containerSize = container.offsetWidth;
    }

    const result = virtualList.compute(
      containerSize,
      scrollPosition,
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
          [paddingAttr.head]: padding.head + 'px',
          [paddingAttr.tail]: padding.tail + 'px',
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
