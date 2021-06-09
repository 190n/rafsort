// https://github.com/preactjs/preact/issues/1961
import { useState, useRef, useEffect } from 'https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module';
import { html, render } from 'https://unpkg.com/htm/preact/index.mjs?module';

import { createRafs, runSort } from './sorting.js';

const arrayTypes = {
    shuffled: 'Shuffled',
    sorted: 'Sorted',
    reversed: 'Reverse order',
};

function Controls(props) {
    const [nRafs, setNRafs] = useState(15);
    const [arrayType, setArrayType] = useState('shuffled');

    const [swapDelay, setSwapDelay] = useState(100);
    const [compareDelay, setCompareDelay] = useState(250);
    const [extraDelay, setExtraDelay] = useState(0);

    const [rafList, setRafList] = useState(null);

    const runningRef = useRef(false);
    const containerRef = useRef(null);
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
            await runSort(rafList, swapDelay, compareDelay, extraDelay, keepGoingRef);
            runningRef.current = false;
        }
    }

    return html`
        <main>
            <header>
                <h1>rafsort</h1>
            </header>
            <section id="controls">
                <p>
                    <label for="n-rafs">
                        Number of Rafs: ${nRafs}
                        <input
                            id="n-rafs"
                            type="range"
                            min="5"
                            max="50"
                            step="1"
                            value=${nRafs}
                            onchange=${e => setNRafs(parseInt(e.target.value))}
                        />
                    </label>
                    <label for="array-type">
                        Array type:
                        <select onchange=${e => setArrayType(e.target.value)}>
                            ${Object.keys(arrayTypes).map(t => html`
                                <option value=${t} selected=${t == arrayType}>${arrayTypes[t]}</option>
                            `)}
                        </select>
                    </label>
                </p>
                <p>
                    <label for="swap-delay">
                        Swap delay: ${swapDelay}ms
                        <input
                            id="swap-delay"
                            type="range"
                            min="0"
                            max="500"
                            step="25"
                            value=${swapDelay}
                            onchange=${e => setSwapDelay(parseInt(e.target.value))}
                        />
                    </label>
                    <label for="compare-delay">
                        Comparison delay: ${compareDelay}ms
                        <input
                            id="compare-delay"
                            type="range"
                            min="0"
                            max="500"
                            step="25"
                            value=${compareDelay}
                            onchange=${e => setCompareDelay(parseInt(e.target.value))}
                        />
                    </label>
                    <label for="extra-delay">
                        Additional delay: ${extraDelay}ms
                        <input
                            id="extra-delay"
                            type="range"
                            min="0"
                            max="500"
                            step="25"
                            value=${extraDelay}
                            onchange=${e => setExtraDelay(parseInt(e.target.value))}
                        />
                    </label>
                </p>
                <p>
                    Sorting algorithm:
                    <select>
                        <option>Bubble sort</option>
                        <option>sike you thought!</option>
                    </select>
                </p>
                <p>
                    <button id="create" onclick=${onCreate}>Create Rafs</button>
                    <button id="sort" onclick=${onSort}>Sort Rafs</button>
                </p>
            </section>
            <section id="rafs-wrapper">
                <div ref=${containerRef} id="rafs"></div>
            </section>
            <footer>
                <a href="https://github.com/190n/rafsort" target="_blank">Source code</a>
            </footer>
        </main>`;
}

render(html`<${Controls} />`, document.body);
