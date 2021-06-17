import type { CompareFunction, SwapFunction } from './sorting';

export function bubbleSort(length: number, compare: CompareFunction, swap: SwapFunction) {
    let didSwap = true;
    while (didSwap) {
        didSwap = false;

        for (let i = 1; i < length; i += 1) {
            if (compare(i, i - 1) < 0) {
                swap(i, i - 1);
                didSwap = true;
            }
        }

        length -= 1;
    }
}
