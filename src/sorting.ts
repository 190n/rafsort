import type { Ref } from 'preact/hooks';

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
}

export type CompareFunction = (i: number, j: number) => number;
export type SwapFunction = (i: number, j: number) => void;
export type SortFunction = (length: number, compare: CompareFunction, swap: SwapFunction) => void;

export type Raf = [number, HTMLImageElement];
export type ArrayType = 'shuffled' | 'sorted' | 'reversed';

export function createRafs(container: HTMLElement, n: number, type: ArrayType, swapDelay: number): Raf[] {
    const numberList = [];
    const minSize = 32, maxSize = 96;
    const exponentBase = (maxSize / minSize) ** (1 / (n - 1));

    for (let i = 0; i < n; i += 1) {
        numberList.push(type == 'reversed' ? (n - 1) - i : i);
    }

    if (type == 'shuffled') {
        // https://stackoverflow.com/a/6274381
        for (let i = n - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [numberList[i], numberList[j]] = [numberList[j], numberList[i]];
        }
    }

    const rafUrl = '/raf.webp';
    let widthSoFar = 0, largest = 0;

    const rafList: Raf[] = [];

    for (let i = 0; i < n; i += 1) {
        const img = new Image;
        img.src = rafUrl;
        const size = Math.round(minSize * (exponentBase ** numberList[i]));
        img.width = img.height = size;
        img.classList.add('raf');
        img.style.left = `${widthSoFar}px`;
        img.style.transitionDuration = `${swapDelay}ms`;
        widthSoFar += size;
        container.appendChild(img);
        if (size > largest) {
            container.style.height = `${size}px`;
            largest = size;
        }
        rafList.push([numberList[i], img]);
    }

    return rafList;
}

export async function runSort(
    sorter: SortFunction,
    rafList: Raf[],
    swapDelay: number,
    compareDelay: number,
    extraDelay: number,
    keepGoing: Ref<boolean>
) {
    await sorter(rafList.length, (i, j) => {
        if (!keepGoing.current) {
            throw 'stopped';
        }

        console.log(`cmp ${i}, ${j}; A[${j}] = ${rafList[j][0]}`);
        rafList[i][1].classList.add('comparing');
        rafList[j][1].classList.add('comparing');
        // await delay(compareDelay);
        rafList[i][1].classList.remove('comparing');
        rafList[j][1].classList.remove('comparing');
        // await delay(extraDelay);
        return rafList[i][0] - rafList[j][0];
    }, (i, j) => {
        if (!keepGoing.current) {
            throw 'stopped';
        }

        console.log(`swp ${i}, ${j}`);
        // move around
        const lower = Math.min(i, j), higher = Math.max(i, j);
        rafList[higher][1].style.left = rafList[lower][1].style.left;
        let pixels = parseInt(rafList[lower][1].style.left.slice(0, -2));
        pixels += rafList[higher][1].width;
        for (let i = lower + 1; i < higher; i += 1) {
            pixels += rafList[i][1].width;
        }
        rafList[lower][1].style.left = `${pixels}px`;

        // move items in the middle
        const offset = rafList[higher][1].width - rafList[lower][1].width;
        for (let i = lower + 1; i < higher; i += 1) {
            let left = parseInt(rafList[i][1].style.left.slice(0, -2));
            left += offset;
            rafList[i][1].style.left = `${left}px`;
        }

        [rafList[lower], rafList[higher]] = [rafList[higher], rafList[lower]];
        // await delay(swapDelay + extraDelay);
    });

    console.log(rafList.map(r => r[0]));
    if (rafList.some(([n], i) => i != 0 && n < rafList[i - 1][0])) {
        console.log('final array not sorted!!');
    }
}
