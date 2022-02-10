import { h, render } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';

import { createRafs, runSort, Raf, ArrayType, SortFunction } from './sorting';

import { bubbleSort, bogoSort, sussort, selectionSort, insertionSort } from './js-sorts';
import { wasmBubbleSort, wasmQuickSortQueue, wasmQuickSortStack, wasmShellSort } from './wasm-sorts';

const arrayTypes: Record<ArrayType, string> = {
    shuffled: 'Shuffled',
    sorted: 'Sorted',
    reversed: 'Reverse order',
};

type SortFunctionName = 'bubble' | 'bogo' | 'sus' | 'wasmBubble' | 'wasmQuickQueue' | 'wasmQuickStack' | 'wasmShell' | 'selection' | 'insertion';

const sortFunctions: Record<SortFunctionName, [string, SortFunction]> = {
    bubble: ['Bubble sort (JS)', bubbleSort],
    bogo: ['Bogosort (JS)', bogoSort],
    sus: ['Sussort (JS)', sussort],
    wasmBubble: ['Bubble sort (C/WASM)', wasmBubbleSort],
    wasmQuickQueue: ['Quicksort (C/WASM, with queue)', wasmQuickSortQueue],
    wasmQuickStack: ['Quicksort (C/WASM, with stack)', wasmQuickSortStack],
    wasmShell: ['Shell sort (C/WASM)', wasmShellSort],
    selection: ['Selection sort (JS)', selectionSort],
    insertion: ['Insertion sort (JS)', insertionSort],
};

export default function Controls() {
    const [nRafs, setNRafs] = useState(15);
    const [arrayType, setArrayType] = useState<ArrayType>('shuffled');

    const [swapDelay, setSwapDelay] = useState(100);
    const [compareDelay, setCompareDelay] = useState(250);
    const [extraDelay, setExtraDelay] = useState(0);

    const [sortFunction, setSortFunction] = useState<SortFunctionName>('bubble');

    const [rafList, setRafList] = useState<Raf[] | null>(null);

    const runningRef = useRef(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const keepGoingRef = useRef(true);

    function onCreate() {
        if (containerRef.current) {
            containerRef.current.textContent = '';
            setRafList(createRafs(containerRef.current, nRafs, arrayType, swapDelay));
            runningRef.current = false;
            keepGoingRef.current = false;
        }
    }

    useEffect(() => {
        if (!runningRef.current) {
            onCreate();
        }
    }, [nRafs, arrayType, swapDelay]);

    async function onSort() {
        if (runningRef.current || !rafList) {
            return;
        } else {
            runningRef.current = true;
            keepGoingRef.current = true;
            await runSort(sortFunctions[sortFunction][1], rafList, swapDelay, compareDelay, extraDelay, keepGoingRef);
            runningRef.current = false;
        }
    }

    return (
        <main>
            <header>
                <h1>rafsort</h1>
            </header>
            <section id="controls">
                <p>
                    <label htmlFor="n-rafs">
                        Number of Rafs: {nRafs}
                        <input
                            id="n-rafs"
                            type="range"
                            min="5"
                            max="50"
                            step="1"
                            value={nRafs}
                            onChange={e => setNRafs(parseInt(e.currentTarget.value))}
                        />
                    </label>
                    <label htmlFor="array-type">
                        Array type:
                        <select onChange={e => setArrayType(e.currentTarget.value as ArrayType)} id="array-type">
                            {Object.keys(arrayTypes).map(t => (
                                <option value={t} selected={t == arrayType}>{arrayTypes[t as ArrayType]}</option>
                            ))}
                        </select>
                    </label>
                </p>
                <p>
                    <label htmlFor="swap-delay">
                        Swap delay: {swapDelay}ms
                        <input
                            id="swap-delay"
                            type="range"
                            min="0"
                            max="500"
                            step="25"
                            value={swapDelay}
                            onChange={e => setSwapDelay(parseInt(e.currentTarget.value))}
                        />
                    </label>
                    <label htmlFor="compare-delay">
                        Comparison delay: {compareDelay}ms
                        <input
                            id="compare-delay"
                            type="range"
                            min="0"
                            max="500"
                            step="25"
                            value={compareDelay}
                            onChange={e => setCompareDelay(parseInt(e.currentTarget.value))}
                        />
                    </label>
                    <label htmlFor="extra-delay">
                        Additional delay: {extraDelay}ms
                        <input
                            id="extra-delay"
                            type="range"
                            min="0"
                            max="500"
                            step="25"
                            value={extraDelay}
                            onChange={e => setExtraDelay(parseInt(e.currentTarget.value))}
                        />
                    </label>
                </p>
                <p>
                    <label htmlFor="sorting-algorithm">
                        Sorting algorithm:
                        <select onChange={e => setSortFunction(e.currentTarget.value as SortFunctionName)} id="sorting-algorithm">
                            {Object.keys(sortFunctions).map(t => (
                                <option value={t} selected={t == sortFunction}>{sortFunctions[t as SortFunctionName][0]}</option>
                            ))}
                        </select>
                    </label>
                </p>
                <p>
                    <button id="create" onClick={onCreate}>Create Rafs</button>
                    <button id="sort" onClick={onSort}>Sort Rafs</button>
                </p>
            </section>
            <section id="rafs-wrapper">
                <div ref={containerRef} id="rafs"></div>
            </section>
            <footer>
                <a href="https://github.com/190n/rafsort" target="_blank">Source code</a>
            </footer>
        </main>
    );
}

render(<Controls />, document.body);
