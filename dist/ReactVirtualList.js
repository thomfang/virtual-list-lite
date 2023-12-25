"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactListView = void 0;
var react_1 = __importStar(require("react"));
var VirtualList_1 = require("./VirtualList");
var paddingAttrNames = {
    vertical: {
        leading: 'paddingTop',
        trailing: 'paddingBottom'
    },
    horizontal: {
        leading: 'paddingLeft',
        trailing: 'paddingRight'
    }
};
function ReactListView(_a) {
    var _b;
    var itemCount = _a.itemCount, itemExtent = _a.itemExtent, _c = _a.bufferCount, bufferCount = _c === void 0 ? 3 : _c, _d = _a.countToTheTrailing, countToTheTrailing = _d === void 0 ? 0 : _d, onReachTheEnd = _a.onReachTheEnd, itemBuilder = _a.itemBuilder, _e = _a.direction, direction = _e === void 0 ? VirtualList_1.ScrollDirection.vertical : _e, _f = _a.containerStyles, containerStyles = _f === void 0 ? {} : _f, customScrollerRef = _a.scrollerRef, active = _a.active;
    var isVerticalScroll = direction === VirtualList_1.ScrollDirection.vertical;
    var _g = (0, react_1.useState)(0), startIndex = _g[0], setStartIndex = _g[1];
    var _h = (0, react_1.useState)(0), endIndex = _h[0], setEndIndex = _h[1];
    var _j = (0, react_1.useState)({ leading: 0, trailing: 0 }), padding = _j[0], setPadding = _j[1];
    var virtualList = (0, react_1.useState)(function () { return new VirtualList_1.VirtualList(itemExtent, bufferCount, countToTheTrailing, direction); })[0];
    var containerRef = (0, react_1.useRef)(null);
    var listWrapperRef = (0, react_1.useRef)(null);
    var paddingAttr = isVerticalScroll
        ? paddingAttrNames.vertical
        : paddingAttrNames.horizontal;
    var scrollerRef = customScrollerRef !== null && customScrollerRef !== void 0 ? customScrollerRef : containerRef;
    var update = (0, react_1.useCallback)(function () {
        if (scrollerRef.current == null || listWrapperRef.current == null) {
            return;
        }
        var container = scrollerRef.current;
        var list = listWrapperRef.current;
        var scrollPosition;
        var containerSize;
        if (isVerticalScroll) {
            scrollPosition = container.scrollTop;
            containerSize = container.offsetHeight;
        }
        else {
            scrollPosition = container.scrollLeft;
            containerSize = container.offsetWidth;
        }
        var result = virtualList.compute(containerSize, scrollPosition, itemCount, [].slice.call(list.children));
        setPadding({
            leading: result.paddingLeading,
            trailing: result.paddingTrailing
        });
        if (result.shouldUpdate) {
            setStartIndex(result.startIndex);
            setEndIndex(result.endIndex);
        }
        if (result.shouldScrollToLeading) {
            if (isVerticalScroll) {
                container.scrollTop = 0;
            }
            else {
                container.scrollLeft = 0;
            }
        }
        if (result.isReachTheEnd) {
            onReachTheEnd === null || onReachTheEnd === void 0 ? void 0 : onReachTheEnd();
        }
    }, [isVerticalScroll, itemCount, onReachTheEnd, virtualList, scrollerRef]);
    (0, react_1.useEffect)(function () {
        if (active) {
            update();
            document.addEventListener('scroll', update);
        }
        else {
            document.removeEventListener('scroll', update);
        }
        return function () {
            document.removeEventListener('scroll', update);
        };
    }, [active, update]);
    (0, react_1.useLayoutEffect)(function () {
        update();
    }, [itemCount, update]);
    var items = [];
    var end = Math.min(itemCount - 1, endIndex);
    for (var i = startIndex; i <= end; i++) {
        items.push(react_1.default.createElement(react_1.default.Fragment, { key: i }, itemBuilder(i)));
    }
    return (react_1.default.createElement("div", { ref: scrollerRef, onScroll: update, style: __assign({ width: '100%', position: 'relative', overflow: 'auto' }, containerStyles) },
        react_1.default.createElement("div", { ref: listWrapperRef, style: (_b = {
                    left: 0,
                    top: 0,
                    width: '100%'
                },
                _b[paddingAttr.leading] = padding.leading + 'px',
                _b[paddingAttr.trailing] = padding.trailing + 'px',
                _b) }, items)));
}
exports.ReactListView = ReactListView;
