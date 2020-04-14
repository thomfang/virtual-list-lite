import { VirtualList } from '../src/VirtualList';

declare global {
    var init: Function;
}

export interface UserInfo {
    name: string;
    gender: string;
    age: number;
    likes: string[];
}

const virtualList = new VirtualList(100, 3, 1);

const data: UserInfo[] = [];
const LIKES = [
    'Swimming',
    'Football',
    'Dancing',
    'Singing',
    'Hiking',
    'Running'
];

let container: HTMLElement;
let scroller: HTMLElement;

function getRandomLikes() {
    const likes: string[] = [];
    if (Math.random() > 0.5) {
        return likes;
    }
    const count = Math.floor(Math.random() * 3) + 1;
    const temp = LIKES.slice();
    for (let i = 0; i < count; i++) {
        let index = Math.floor(Math.random() * temp.length);
        likes.push(temp[index]);
        temp.splice(index, 1);
    }
    return likes;
}

function loadRandomData() {
    const newItems = createNewItemsData(data.length, 20);
    data.push(...newItems);
    render();
    locked = false;
}

export function createNewItemsData(start: number, count: number) {
    const newItems: UserInfo[] = [];
    for (let i = 0; i < count; i++) {
        newItems.push({
            name: `User ${start + i + 1}`,
            age: 10 + Math.floor(Math.random() * 30),
            gender: Math.random() > 0.5 ? 'female' : 'male',
            likes: getRandomLikes()
        });
    }
    return newItems;
}

function createItemHtml(itemData: UserInfo) {
    const likesHtml = itemData.likes.length
        ? `<div class="item-footer">
      <div>Likes:</div>
        <ol>${itemData.likes.map(like => `<li>${like}</li>`).join('')}</ol>
      </div>`
        : '';
    return `<div class="item">
    <div class="item-header">
      <div class="item-left"></div>
        <div class="item-right">
          <div class="item-text-bold">${itemData.name}</div>
          <div class="item-text">${itemData.gender} | ${itemData.age}</div>
        </div>
      </div>
        ${likesHtml}
    </div>`;
}

let locked = false;

function render() {
    const res = virtualList.compute(
        container.offsetHeight,
        container.scrollTop,
        data.length,
        makeArray(scroller.children)
    );

    scroller.style.paddingTop = res.paddingHead + 'px';
    scroller.style.paddingBottom = res.paddingTail + 'px';

    if (res.shouldUpdate) {
        const list = data.slice(res.startIndex, res.endIndex);
        const html = list.map(itemData => createItemHtml(itemData)).join('');
        scroller.innerHTML = html;
    }
    if (!locked && res.reachTail) {
        locked = true;
        setTimeout(loadRandomData, 100);
    }
}

function makeArray(arrayLike: HTMLCollection) {
    return Array.prototype.slice.call(arrayLike);
}

export function init() {
    let div = document.createElement('div');
    div.innerHTML = `<div id="container">
    <div id="scroller">
    </div>
  </div>`;
    document.body.appendChild(div.firstElementChild as HTMLDivElement);
    container = document.getElementById('container') as HTMLElement;
    scroller = document.getElementById('scroller') as HTMLElement;
    container.addEventListener('scroll', () => {
        render();
    });
    loadRandomData();
}

window.init = init;
