type Getter = (element: HTMLElement) => number

const sizeGetters = {
  vertical: (element: HTMLElement) => element.offsetHeight,
  horizental: (element: HTMLElement) => element.offsetWidth
}
const positionGetters = {
  vertical: (element: HTMLElement) => element.offsetTop,
  horizental: (element: HTMLElement) => element.offsetLeft
}

export enum ScrollDirection {
  vertical,
  horizontal
}

export type VirtualListComputeResult = {
  startIndex: number
  endIndex: number
  paddingLeading: number
  paddingTrailing: number
  shouldUpdate: boolean
  isReachTheEnd: boolean
  shouldScrollToLeading: boolean
}

export class VirtualList {
  private startIndex!: number | null
  private endIndex!: number | null
  private itemDetails: {
    index: number
    pos: number
    size: number
  }[] = []

  private itemSizeGetter!: Getter
  private itemPositionGetter!: Getter


  public readonly itemExtent!: number
  public readonly bufferCount!: number
  public readonly countToTheTrailing!: number
  public readonly direction!: ScrollDirection

  constructor({
    itemExtent,
    bufferCount,
    countToTheTrailing = 0,
    direction = ScrollDirection.vertical,
  }: {
    itemExtent: number
    bufferCount: number
    countToTheTrailing?: number
    direction?: ScrollDirection
  }) {
    this.itemExtent = itemExtent
    this.bufferCount = bufferCount
    this.countToTheTrailing = countToTheTrailing
    this.direction = direction
    if (direction === ScrollDirection.vertical) {
      this.itemSizeGetter = sizeGetters.vertical
      this.itemPositionGetter = positionGetters.vertical
    } else {
      this.itemSizeGetter = sizeGetters.horizental
      this.itemPositionGetter = positionGetters.horizental
    }
  }

  updateItem(index: number, element: HTMLElement) {
    this.itemDetails[index] = {
      index,
      pos: this.itemPositionGetter(element),
      size: this.itemSizeGetter(element)
    }
  }

  compute(
    containerSize: number,
    scrollPosition: number,
    totalCount: number,
    renderedItemElements: HTMLElement[]
  ): VirtualListComputeResult {
    let startIndex!: number
    let endIndex!: number
    let paddingTrailing!: number
    let shouldUpdate = false
    let isReachTheEnd = false

    if (totalCount === 0) {
      this.startIndex = null
      this.endIndex = null
      return {
        startIndex: 0,
        endIndex: 0,
        paddingTrailing: 0,
        paddingLeading: 0,
        shouldUpdate: false,
        isReachTheEnd: false,
        shouldScrollToLeading: true,
      }
    }

    if ((this.startIndex == null && this.endIndex == null) || totalCount < this.itemDetails.length) {
      return this.computeFirstRender(containerSize, totalCount)
    }

    renderedItemElements.forEach((elem, i) => {
      const idx = (this.startIndex as number) + i
      // if (this.itemDetails[idx]) {
      //   return
      // }
      this.updateItem(idx, elem)
    })

    const bottom = scrollPosition + containerSize
    const itemLength = this.itemDetails.length

    for (let i = 0; i < itemLength; i++) {
      const itemDetail = this.itemDetails[i]
      if (itemDetail.pos <= scrollPosition) {
        startIndex = i
      } else if (itemDetail.pos > bottom && endIndex == null) {
        endIndex = i
        break
      }
    }

    if (startIndex == null) {
      startIndex = 0
    }
    if (endIndex == null) {
      endIndex = Math.max(Math.ceil(containerSize / this.itemExtent) + startIndex, itemLength)
    }

    startIndex = Math.max(0, startIndex - this.bufferCount)
    endIndex = Math.min(totalCount - 1, endIndex + this.bufferCount)

    const paddingLeading = startIndex === 0 ? 0 : this.itemDetails[startIndex].pos

    if (endIndex > itemLength - 1) {
      paddingTrailing = (totalCount - endIndex - 1) * this.itemExtent
    } else {
      paddingTrailing = (totalCount - itemLength) * this.itemExtent
      for (let j = endIndex + 1; j < itemLength; j++) {
        paddingTrailing += this.itemDetails[j].size
      }
    }

    if (this.startIndex !== startIndex || this.endIndex !== endIndex) {
      shouldUpdate = true
      this.startIndex = startIndex
      this.endIndex = endIndex
    }



    // console.log('render', startIndex, endIndex, totalCount, itemLength)

    isReachTheEnd = totalCount - (endIndex + 1) <= this.countToTheTrailing

    return {
      startIndex,
      endIndex,
      paddingLeading,
      paddingTrailing,
      shouldUpdate,
      isReachTheEnd,
      shouldScrollToLeading: false,
    }
  }

  private computeFirstRender(containerSize: number, totalCount: number): VirtualListComputeResult {
    const startIndex = 0
    const visibleCount = Math.ceil(containerSize / this.itemExtent)
    const endIndex = Math.min(this.bufferCount + visibleCount, totalCount - 1)
    const renderCount = endIndex - startIndex
    const paddingLeading = 0
    const paddingTrailing = (totalCount - renderCount) * this.itemExtent

    this.itemDetails.length = 0
    this.startIndex = startIndex
    this.endIndex = endIndex

    // console.log('first render', startIndex, endIndex, totalCount)

    return {
      startIndex,
      endIndex,
      paddingLeading,
      paddingTrailing,
      shouldUpdate: true,
      isReachTheEnd: totalCount - (endIndex + 1) <= this.countToTheTrailing,
      shouldScrollToLeading: true,
    }
  }

  reset() {
    this.startIndex = null
    this.endIndex = null
    this.itemDetails = []
  }
}