# Virtual List

For efficiently rendering large lists data, simple and easy to use. 

## Installation

`npm i easy-virtual-list --save`

## Usage

### VirtualList

```ts
import { VirtualList, ScrollDirection } from 'easy-virtual-list'
const virtualList = new VirtualList({
  itemExtent: 64,
  bufferCount: 3,
  countToTheTrailing: 3,
  direction: ScrollDirection.vertical,
})

container.addEventListener('scroll', (e) => {
  const {
    shouldUpdate,
    isReachTheEnd,
    startIndex,
    endIndex,
    paddingLeading,
    paddingTrailing,
    shouldScrollToLeading
  } = virtualList.compute(
    container.offsetHeight,
    e.scrollTop,
    data.length,
    Array.from(container.children),
  );
});
```

| Property Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| itemExtent | number | true | - | The size of each item, in order to calculate the size of the virtual list |
| bufferCount | number | true | - | Number of items of pre-rendered at the leading and trailing |
| countToTheTrailing | number | false | 0 | Set the number of items left at the tail to trigger scrolling onReachTheEnd event |
| direction | ScrollDirection | false | ScrollDirection.vertical | List view scroll direction |

### VirtualList for React

```tsx
import { ReactVirtualList } from 'easy-virtual-list'
const App = () => {
  const [userList, setUserList] = useState([])
  const [page, setPage] = useState(0)
  const loadNextPage = () => {
    setPage(page + 1)
  }

  useEffect(() => {
    fetchUserList(page).then(newItems => {
      setUserList([...userList, ...newItems])
    })
  }, [page])

  return (
    <ReactVirtualList
      itemCount={userList.length}
      itemExtent={100}
      bufferCount={3}
      onReachTheEnd={loadNextPage}
      itemBuilder={(index) => (
        <Item data={userList[index]} />
      )}
    />
  )
}
```

| Property Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| itemCount | number | true | - | List view item count |
| itemExtent | number | true | - | The size of each item, in order to calculate the size of the virtual list |
| bufferCount | number | true | - | Number of items of pre-rendered at the leading and trailing |
| countToTheTrailing | number | false | 0 | Set the number of items left at the tail to trigger scrolling onReachTheEnd event |
| onReachTheEnd | () => void | false | - | The event of list view scroll to the end |
| itemBuilder | (index: number) => React.JSXElement | true | - | List view item builder function |
| direction | ScrollDirection | false | ScrollDirection.vertical | List view scroll direction |
| containerStyles | React.CSSProperties | false | - | Custom list view container style |
| scrollerRef | React.RefObject<HTMLDivElement> | false | - | If the list view is scrolling by element outside, you should set this property |