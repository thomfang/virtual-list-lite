# Virtual List

For efficiently rendering large lists data

## Usage

### VirtualList

```ts
let virtualList = new VirtualList(
  itemSize,
  bufferCount,
  remainItemCountToTriggerReachTailEvent,
  isVerticalLayout
);

container.addEventListener('scroll', () => {
  let {
    shouldUpdate,
    reachTail,
    startIndex,
    endIndex,
    paddingHead,
    paddingTail
  } = virtualList.compute(
    containerSize,
    scrollPosition,
    data.length,
    renderedItemElements
  );
});
```

### ReactVirtualList

```ts
const App = () => {
  const [userList, setUserList] = useState<UserInfo[]>([]);
    const [page, setPage] = useState<number>(0);
    const loadNextPage = () => {
      setPage(page + 1);
    };

    useEffect(() => {
      const newItems = fetchUserList(page, 25);
      setUserList([...userList, ...newItems]);
    }, [page]);

    return (
      <ReactVirtualList
        list={userList}
        itemSize={100}
        bufferCount={3}
        onReachTail={loadNextPage}
        renderItem={(itemData: UserInfo, index: number) => (
          <div className="item">
            <div className="item-header">
              <div className="item-left"></div>
              <div className="item-right">
                <div className="item-text-bold">{itemData.name}</div>
                <div className="item-text">
                  {itemData.gender} | {itemData.age}
                </div>
              </div>
              {itemData.likes.length && (
                <div className="item-footer">
                  <div>Likes:</div>
                  <ol>
                    {itemData.likes.map(like => (
                      <li>{like}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        )}
      />
    );
  }
}
```
