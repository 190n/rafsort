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
