#include "shell.h"

#include "gaps.h"
#include "wasm_imports.h"

void shell_sort(uint32_t n) {
    (void) n;
    for (int g = 0; g < GAPS; g += 1) {
        uint32_t gap = gaps[g];

        for (uint32_t i = gap; i < n; i++) {
            uint32_t j = i;
            while (j >= gap && compare(i, j - gap) < 0) {
                swap(j, j - gap);
                j -= gap;
            }
        }
    }
}
