#include "bubble.h"

#include "wasm_imports.h"

#include <stdbool.h>

void bubble_sort(uint32_t n) {
    bool swapped = true;
    while (swapped) {
        swapped = false;

        for (uint32_t i = 1; i < n; i += 1) {
            if (compare(i, i - 1) < 0) {
                swap(i, i - 1);
                swapped = true;
            }
        }

        n -= 1;
    }
}
