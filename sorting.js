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

export function createRafs(container, n, type, swapDelay) {
    const numberList = [];
    const minSize = 32, maxSize = 96;
    const exponentBase = (maxSize / minSize) ** (1 / (n - 1));

    for (let i = 0; i < n; i += 1) {
        numberList.push(type == 'reversed' ? (n - 1) - i : i);
    }

    if (type == 'shuffled') {
        // https://stackoverflow.com/a/6274381
        for (let i = n - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [numberList[i], numberList[j]] = [numberList[j], numberList[i]];
        }
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
        container.appendChild(img);
        if (size > largest) {
            container.style.height = `${size}px`;
            largest = size;
        }
        rafList.push([numberList[i], img]);
    }

    return rafList;
}

export async function runSort(rafList, swapDelay, compareDelay, extraDelay, keepGoing) {
    await bubbleSort(rafList.length, async (i, j) => {
        if (!keepGoing.current) {
            throw 'stopped';
        }

        console.log(`cmp ${i}, ${j}`);
        rafList[i][1].classList.add('comparing');
        rafList[j][1].classList.add('comparing');
        await delay(compareDelay);
        rafList[i][1].classList.remove('comparing');
        rafList[j][1].classList.remove('comparing');
        await delay(extraDelay);
        return rafList[i][0] - rafList[j][0];
    }, async (i, j) => {
        if (!keepGoing.current) {
            throw 'stopped';
        }

        console.log(`swp ${i}, ${j}`);
        // move around
        const lower = Math.min(i, j), higher = Math.max(i, j);
        rafList[higher][1].style.left = rafList[lower][1].style.left;
        let pixels = parseInt(rafList[lower][1].style.left.slice(0, -2));
        pixels += rafList[higher][1].width;
        rafList[lower][1].style.left = `${pixels}px`;
        [rafList[lower], rafList[higher]] = [rafList[higher], rafList[lower]];
        await delay(swapDelay + extraDelay);
    });
}
