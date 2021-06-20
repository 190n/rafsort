// https://github.com/snowpackjs/snowpack/pull/3154
// version 3.0.0 of @snowpack/plugin-webpack should make workers easier

import type { WhichSort } from '../wasm-sorts';

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
    array: Int32Array;
}

self.onmessage = async ({ data: { module, which, length, array } }: MessageEvent<InitMessage>) => {
    console.log('in worker onmessage');
    function compare(i: number, j: number): number {
        console.log('compare() called');
        array[0] = 2;

        postMessage({ type: 'compare', i, j });
        console.log('sent comparison request');
        Atomics.wait(array, 0, 2);
        console.log('stopped waiting');

        const result = array[0];
        array[0] = 2;
        return result;
    }

    function swap(i: number, j: number) {
        array[0] = 0;

        postMessage({ type: 'swap', i, j });
        Atomics.wait(array, 0, 0);

        array[0] = 0;
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
    console.log('onmessage exited');
};

// parent worker gets message with wasm module, which sort, and length
// parent worker forwards that to child
// child worker launches wasm function
// when wasm wants to compare or swap:
//     child worker posts message with the indices
//     child worker calls Atomics.wait
//     parent worker receives indices
//     parent worker forwards them to main thread
//     main thread runs animation, sends result to parent worker
//     parent worker calls Atomics.notify
// wasm function returns
// worker posts message indicating that it's done
