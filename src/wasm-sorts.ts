let loaded = false;

export async function loadModule(): Promise<void> {
    const { instance } = await WebAssembly.instantiateStreaming(fetch('/sorts.wasm'));
    console.dir(instance.exports);
    loaded = true;
}
