#include "shell.h"

#include "gaps.h"
#include "wasm_imports.h"

void shell_sort(uint32_t n) {
    (void) n;
    // for (int g = 0; g < GAPS; g += 1) {
    //     uint32_t gap = gaps[g];

    //     for (uint32_t i = gap; i < n; i++) {
    //         uint32_t j = i, temp = A[i];
    //         while (j >= gap && temp < A[j - gap]) {
    //             A[j] = A[j - gap];
    //             j -= gap;
    //         }

    //         A[j] = temp;
    //     }
    // }
}
