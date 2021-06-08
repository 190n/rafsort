const n = 15, swapDelay = 100, compareDelay = 100, minSize = 48, maxSize = 256;

const exponentBase = (maxSize / minSize) ** (1 / (n - 1));

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

bubbleSort(n, (i, j) => {
    console.log(`cmp ${i}, ${j}`);
    return new Promise(resolve => {
        rafList[i][1].classList.add('comparing');
        rafList[j][1].classList.add('comparing');
        setTimeout(() => {
            rafList[i][1].classList.remove('comparing');
            rafList[j][1].classList.remove('comparing');
            resolve(rafList[i][0] - rafList[j][0]);
        }, compareDelay);
    });
}, (i, j) => {
    console.log(`swp ${i}, ${j}`);
    // move around
    const lower = Math.min(i, j), higher = Math.max(i, j);
    rafList[higher][1].style.left = rafList[lower][1].style.left;
    let pixels = parseInt(rafList[lower][1].style.left.slice(0, -2));
    pixels += rafList[higher][1].width;
    rafList[lower][1].style.left = `${pixels}px`;
    [rafList[lower], rafList[higher]] = [rafList[higher], rafList[lower]];
    return new Promise(resolve => setTimeout(() => resolve(), swapDelay));
}).then(() => console.log(rafList));
