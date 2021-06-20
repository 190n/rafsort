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
