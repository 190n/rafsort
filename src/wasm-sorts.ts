import type { CompareFunction, SwapFunction } from './sorting';

export async function wasmBubble(length: number, compare: CompareFunction, swap: SwapFunction): Promise<void> {
    const { instance } = await WebAssembly.instantiateStreaming(fetch('/sorts.wasm'), {
        env: { compare, swap },
    });
    instance.exports.bubble_sort(length);
}
