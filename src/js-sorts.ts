import type { CompareFunction, SwapFunction } from './sorting';

export async function bubbleSort(length: number, compare: CompareFunction, swap: SwapFunction): Promise<void> {
    let didSwap = true;
    while (didSwap) {
        didSwap = false;

        for (let i = 1; i < length; i += 1) {
            if (await compare(i, i - 1) < 0) {
                await swap(i, i - 1);
                didSwap = true;
            }
        }

        length -= 1;
    }
}

export async function bogoSort(length: number, compare: CompareFunction, swap: SwapFunction): Promise<void> {
    while (true) {
        let sorted = true;

        for (let i = 1; i < length && sorted; i += 1) {
            if (await compare(i - 1, i) > 0) {
                sorted = false;
            }
        }

        if (sorted) {
            return;
        }

        // https://stackoverflow.com/a/6274381
        for (let i = length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            await swap(i, j);
        }
    }
}

export async function sussort(length: number, compare: CompareFunction, swap: SwapFunction, array: number[]): Promise<void> {
    // pretend to check if it's sorted like bogosort does
    let sorted = true;

    for (let i = 1; i < length && sorted; i += 1) {
        if (await compare(i - 1, i) > 0) {
            sorted = false;
        }
    }

    if (sorted) {
        return;
    }

    const sortedArray = [];
    for (let i = 0; i < length; i++) {
        sortedArray.push(i);
    }

    const swapList: Array<[number, number]> = [];
    for (let i = 0; i < length; i++) {
        const i1 = sortedArray.indexOf(i), i2 = array.indexOf(i);
        swapList.unshift([i1, i2]);
        [sortedArray[i1], sortedArray[i2]] = [sortedArray[i2], sortedArray[i1]];
    }

    for (const [i, j] of swapList) {
        await swap(i, j);
    }
}

export async function selectionSort(length: number, compare: CompareFunction, swap: SwapFunction, array: number[]): Promise<void> {
    for (let i = 0; i < length; i++) {
        let iMin = i;
        for (let j = i + 1; j < length; j++) {
            if (await compare(j, iMin) < 0) {
                iMin = j;
            }
        }
        await swap(i, iMin);
    }
}
