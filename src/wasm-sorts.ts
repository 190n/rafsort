import type { CompareFunction, SwapFunction } from './sorting';

let wasmModule: WebAssembly.Module | null = null;

interface Exports {
    bubble_sort: (length: number) => void;
    quick_sort_queue: (length: number) => void;
    quick_sort_stack: (length: number) => void;
    shell_sort: (length: number) => void;
    memory: WebAssembly.Memory;
}

type WhichSort = 'bubble_sort' | 'quick_sort_queue' | 'quick_sort_stack' | 'shell_sort';

async function wasmSort(which: WhichSort, length: number, compare: CompareFunction, swap: SwapFunction): Promise<void> {
    if (!wasmModule) {
        wasmModule = await WebAssembly.compileStreaming(fetch('/sorts.wasm'));
    }

    const { exports } = await WebAssembly.instantiate(wasmModule, {
        env: {
            compare,
            swap,
            print(str: number) {
                const array = new Uint8Array(exports.memory.buffer, str, 256);
                const string = new TextDecoder('utf8').decode(array);
                console.log(string.split('\0')[0]);
            },
            print_number(n: number) {
                console.log(n.toString());
            }
        },
    }) as { exports: unknown } as { exports: Exports };

    exports[which](length);
}

export const wasmBubbleSort = wasmSort.bind(null, 'bubble_sort');
export const wasmQuickSortQueue = wasmSort.bind(null, 'quick_sort_queue');
export const wasmQuickSortStack = wasmSort.bind(null, 'quick_sort_stack');
export const wasmShellSort = wasmSort.bind(null, 'shell_sort');
