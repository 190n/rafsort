import { h, Component, render } from 'https://unpkg.com/preact?module';
import htm from 'https://unpkg.com/htm?module';

const html = htm.bind(h);

let n = 15, swapDelay = 1000, compareDelay = 1000, extraDelay = 0

const minSize = 32, maxSize = 96;

const exponentBase = (maxSize / minSize) ** (1 / (n - 1));

document.getElementById('n-rafs').onmousemove = function nRafsUpdate(e) {
    n = parseInt(e.target.value);
    e.target.previousElementSibling.textContent = e.target.value;
}

nRafsUpdate({ target: document.getElementById('n-rafs') });

function delay(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
}

async function bubbleSort(length, compare, swap) {
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

const numberList = [];

for (let i = 0; i < n; i += 1) {
    numberList.push(i);
}

// shuffle
for (let i = n - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [numberList[i], numberList[j]] = [numberList[j], numberList[i]];
}

const rafUrl = 'https://cdn.discordapp.com/avatars/218965601903706113/9a672cff7729f94a5ce72de35b143ed5.webp';
let widthSoFar = 0, largest = 0;

const rafList = [];
250
for (let i = 0; i < n; i += 1) {
    const img = new Image;
    img.src = rafUrl;
    const size = Math.round(minSize * (exponentBase ** numberList[i]));
    img.width = img.height = size;
    img.classList.add('raf');
    img.style.left = `${widthSoFar}px`;
    img.style.transitionDuration = `${swapDelay}ms`;
    widthSoFar += size;
    document.getElementById('rafs').appendChild(img);
    if (size > largest) {
        document.getElementById('rafs').style.height = `${size}px`;
        largest = size;
    }
    rafList.push([numberList[i], img]);
}

bubbleSort(n, async (i, j) => {
    console.log(`cmp ${i}, ${j}`);
    rafList[i][1].classList.add('comparing');
    rafList[j][1].classList.add('comparing');
    await delay(compareDelay);
    rafList[i][1].classList.remove('comparing');
    rafList[j][1].classList.remove('comparing');
    await delay(extraDelay);
    return rafList[i][0] - rafList[j][0];
}, async (i, j) => {
    console.log(`swp ${i}, ${j}`);
    // move around
    const lower = Math.min(i, j), higher = Math.max(i, j);
    rafList[higher][1].style.left = rafList[lower][1].style.left;
    let pixels = parseInt(rafList[lower][1].style.left.slice(0, -2));
    pixels += rafList[higher][1].width;
    rafList[lower][1].style.left = `${pixels}px`;
    [rafList[lower], rafList[higher]] = [rafList[higher], rafList[lower]];
    await delay(swapDelay + extraDelay);
}).then(() => console.log(rafList));
