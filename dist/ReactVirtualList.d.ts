import React, { ReactNode, RefObject } from 'react';
import { ScrollDirection } from './VirtualList';
export type ReactListViewProps = {
    itemCount: number;
    itemExtent: number;
    bufferCount?: number;
    countToTheTrailing?: number;
    sizeGetter?: (element: HTMLElement) => number;
    positionGetter?: (element: HTMLElement) => number;
    direction?: ScrollDirection;
    onReachTheEnd?: () => void;
    containerStyles?: React.CSSProperties;
    itemBuilder: (index: number) => ReactNode;
    scrollerRef?: RefObject<HTMLDivElement>;
    active?: boolean;
};
export declare function ReactListView({ itemCount, itemExtent, bufferCount, countToTheTrailing, onReachTheEnd, itemBuilder, direction, containerStyles, scrollerRef: customScrollerRef, active, }: ReactListViewProps): React.JSX.Element;
