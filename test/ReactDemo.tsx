import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ReactVirtualList } from '../src/ReactVirtualList';
import { createNewItemsData, UserInfo } from './Demo';

export function App() {
  const [userList, setUserList] = useState<UserInfo[]>([]);
  const [page, setPage] = useState<number>(0);
  const loadNextPage = () => {
    setPage(page + 1);
  };

  useEffect(() => {
    const newItems = createNewItemsData(userList.length, 25);
    setUserList([...userList, ...newItems]);
  }, [page]);

  return (
    <ReactVirtualList
      list={userList}
      itemSize={100}
      bufferCount={3}
      onReachTail={loadNextPage}
      renderItem={(itemData: UserInfo) => (
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

ReactDOM.render(<App />, document.body);
