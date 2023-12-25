"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirtualList = exports.ScrollDirection = void 0;
var sizeGetters = {
    vertical: function (element) { return element.offsetHeight; },
    horizental: function (element) { return element.offsetWidth; }
};
var positionGetters = {
    vertical: function (element) { return element.offsetTop; },
    horizental: function (element) { return element.offsetLeft; }
};
var ScrollDirection;
(function (ScrollDirection) {
    ScrollDirection[ScrollDirection["vertical"] = 0] = "vertical";
    ScrollDirection[ScrollDirection["horizontal"] = 1] = "horizontal";
})(ScrollDirection = exports.ScrollDirection || (exports.ScrollDirection = {}));
var VirtualList = /** @class */ (function () {
    function VirtualList(itemExtent, bufferCount, countToTheTrailing, direction) {
        if (countToTheTrailing === void 0) { countToTheTrailing = 0; }
        if (direction === void 0) { direction = ScrollDirection.vertical; }
        this.itemExtent = itemExtent;
        this.bufferCount = bufferCount;
        this.countToTheTrailing = countToTheTrailing;
        this.direction = direction;
        this.itemDetails = [];
        if (direction === ScrollDirection.vertical) {
            this.itemSizeGetter = sizeGetters.vertical;
            this.itemPositionGetter = positionGetters.vertical;
        }
        else {
            this.itemSizeGetter = sizeGetters.horizental;
            this.itemPositionGetter = positionGetters.horizental;
        }
    }
    VirtualList.prototype.updateItem = function (index, element) {
        this.itemDetails[index] = {
            index: index,
            pos: this.itemPositionGetter(element),
            size: this.itemSizeGetter(element)
        };
    };
    VirtualList.prototype.compute = function (containerSize, scrollPosition, totalCount, renderedItemElements) {
        var _this = this;
        var startIndex;
        var endIndex;
        var paddingTrailing;
        var shouldUpdate = false;
        var isReachTheEnd = false;
        if (totalCount === 0) {
            this.startIndex = null;
            this.endIndex = null;
            return {
                startIndex: 0,
                endIndex: 0,
                paddingTrailing: 0,
                paddingLeading: 0,
                shouldUpdate: false,
                isReachTheEnd: false,
                shouldScrollToLeading: true,
            };
        }
        if ((this.startIndex == null && this.endIndex == null) || totalCount < this.itemDetails.length) {
            return this.computeFirstRender(containerSize, totalCount);
        }
        renderedItemElements.forEach(function (elem, i) {
            var idx = _this.startIndex + i;
            // if (this.itemDetails[idx]) {
            //   return
            // }
            _this.updateItem(idx, elem);
        });
        var bottom = scrollPosition + containerSize;
        var itemLength = this.itemDetails.length;
        for (var i = 0; i < itemLength; i++) {
            var itemDetail = this.itemDetails[i];
            if (itemDetail.pos <= scrollPosition) {
                startIndex = i;
            }
            else if (itemDetail.pos > bottom && endIndex == null) {
                endIndex = i;
                break;
            }
        }
        if (startIndex == null) {
            startIndex = 0;
        }
        if (endIndex == null) {
            endIndex = Math.max(Math.ceil(containerSize / this.itemExtent) + startIndex, itemLength);
        }
        startIndex = Math.max(0, startIndex - this.bufferCount);
        endIndex = Math.min(totalCount - 1, endIndex + this.bufferCount);
        var paddingLeading = startIndex === 0 ? 0 : this.itemDetails[startIndex].pos;
        if (endIndex > itemLength - 1) {
            paddingTrailing = (totalCount - endIndex - 1) * this.itemExtent;
        }
        else {
            paddingTrailing = (totalCount - itemLength) * this.itemExtent;
            for (var j = endIndex + 1; j < itemLength; j++) {
                paddingTrailing += this.itemDetails[j].size;
            }
        }
        if (this.startIndex !== startIndex || this.endIndex !== endIndex) {
            shouldUpdate = true;
            this.startIndex = startIndex;
            this.endIndex = endIndex;
        }
        // console.log('render', startIndex, endIndex, totalCount, itemLength)
        isReachTheEnd = totalCount - (endIndex + 1) <= this.countToTheTrailing;
        return {
            startIndex: startIndex,
            endIndex: endIndex,
            paddingLeading: paddingLeading,
            paddingTrailing: paddingTrailing,
            shouldUpdate: shouldUpdate,
            isReachTheEnd: isReachTheEnd,
            shouldScrollToLeading: false,
        };
    };
    VirtualList.prototype.computeFirstRender = function (containerSize, totalCount) {
        var startIndex = 0;
        var visibleCount = Math.ceil(containerSize / this.itemExtent);
        var endIndex = Math.min(this.bufferCount + visibleCount, totalCount - 1);
        var renderCount = endIndex - startIndex;
        var paddingLeading = 0;
        var paddingTrailing = (totalCount - renderCount) * this.itemExtent;
        this.itemDetails.length = 0;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
        // console.log('first render', startIndex, endIndex, totalCount)
        return {
            startIndex: startIndex,
            endIndex: endIndex,
            paddingLeading: paddingLeading,
            paddingTrailing: paddingTrailing,
            shouldUpdate: true,
            isReachTheEnd: totalCount - (endIndex + 1) <= this.countToTheTrailing,
            shouldScrollToLeading: true,
        };
    };
    VirtualList.prototype.reset = function () {
        this.startIndex = null;
        this.endIndex = null;
        this.itemDetails = [];
    };
    return VirtualList;
}());
exports.VirtualList = VirtualList;
