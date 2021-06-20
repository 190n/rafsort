import type { CompareFunction, SwapFunction } from './sorting';

let wasmModule: WebAssembly.Module | null = null;

type RequestMessage = {
    type: 'compare' | 'swap',
    i: number,
    j: number,
} | {
    type: 'done',
};

export type WhichSort = 'bubble_sort' | 'quick_sort_queue' | 'quick_sort_stack' | 'shell_sort';

function wasmSort(which: WhichSort, length: number, compare: CompareFunction, swap: SwapFunction): Promise<void> {
    return new Promise(resolve => {
        (async () => {
            if (!wasmModule) {
                wasmModule = await WebAssembly.compileStreaming(fetch('/sorts.wasm'));
            }
        })().then(() => {
            const worker = new Worker('/dist/worker/worker.js'),
                buf = new SharedArrayBuffer(4),
                array = new Int32Array(buf);
            worker.onmessage = async ({ data }: MessageEvent<RequestMessage>) => {
                switch (data.type) {
                case 'compare':
                    const result = await compare(data.i, data.j);
                    console.log('about to send comparison result');
                    Atomics.store(array, 0, result);
                    Atomics.notify(array, 0);
                    console.log('sent comparison result');
                    break;
                case 'swap':
                    await swap(data.i, data.j);
                    // content of this message doesn't matter
                    Atomics.store(array, 0, 1);
                    Atomics.notify(array, 0);
                    break;
                case 'done':
                    // worker.terminate();
                    resolve();
                    break;
                }
            };

            worker.postMessage({ module: wasmModule, which, length, array });
        });
    });
}

export const wasmBubbleSort = wasmSort.bind(null, 'bubble_sort');
export const wasmQuickSortQueue = wasmSort.bind(null, 'quick_sort_queue');
export const wasmQuickSortStack = wasmSort.bind(null, 'quick_sort_stack');
export const wasmShellSort = wasmSort.bind(null, 'shell_sort');
