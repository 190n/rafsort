// https://github.com/snowpackjs/snowpack/pull/3154
// version 3.0.0 of @snowpack/plugin-webpack should make workers easier

import type { WhichSort } from './wasm-sorts';

interface Exports {
    bubble_sort: (length: number) => void;
    quick_sort_queue: (length: number) => void;
    quick_sort_stack: (length: number) => void;
    shell_sort: (length: number) => void;
    memory: WebAssembly.Memory;
}

interface InitMessage {
    module: WebAssembly.Module;
    which: WhichSort;
    length: number;
}

const buf = new SharedArrayBuffer(4),
    arr = new Int32Array(buf);

self.onmessage = async ({ data: { module, which, length } }: MessageEvent<InitMessage>) => {
    console.log('in worker onmessage');
    function compare(i: number, j: number): number {
        console.log('compare() called');
        arr[0] = 2;

        self.onmessage = (e: MessageEvent<number>) => {
            console.log('got comparison response');
            Atomics.store(arr, 0, e.data);
            Atomics.notify(arr, 0);
        };

        postMessage({ type: 'compare', i, j });
        console.log('sent comparison request');
        Atomics.wait(arr, 0, 2);
        console.log('stopped waiting');

        const result = arr[0];
        arr[0] = 2;
        return result;
    }

    function swap(i: number, j: number) {
        arr[0] = 0;

        self.onmessage = () => {
            Atomics.store(arr, 0, 1);
            Atomics.notify(arr, 0);
        };

        postMessage({ type: 'swap', i, j });
        Atomics.wait(arr, 0, 0);

        arr[0] = 0;
    }

    const { exports } = await WebAssembly.instantiate(module, {
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
    postMessage({ type: 'done' });
};

// worker gets message with wasm module, which sort, and length
// worker launches wasm function
// when wasm wants to compare or swap:
//     worker posts message with the indices
//     worker blocks until...
//     host posts message with the result (compare) or just indicating that it's done (swap)
// wasm function returns
// worker posts message indicating that it's done
