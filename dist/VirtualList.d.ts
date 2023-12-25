export declare enum ScrollDirection {
    vertical = 0,
    horizontal = 1
}
export type VirtualListComputeResult = {
    startIndex: number;
    endIndex: number;
    paddingLeading: number;
    paddingTrailing: number;
    shouldUpdate: boolean;
    isReachTheEnd: boolean;
    shouldScrollToLeading: boolean;
};
export declare class VirtualList {
    readonly itemExtent: number;
    readonly bufferCount: number;
    readonly countToTheTrailing: number;
    readonly direction: ScrollDirection;
    private startIndex;
    private endIndex;
    private itemDetails;
    private itemSizeGetter;
    private itemPositionGetter;
    constructor(itemExtent: number, bufferCount: number, countToTheTrailing?: number, direction?: ScrollDirection);
    updateItem(index: number, element: HTMLElement): void;
    compute(containerSize: number, scrollPosition: number, totalCount: number, renderedItemElements: HTMLElement[]): VirtualListComputeResult;
    private computeFirstRender;
    reset(): void;
}
