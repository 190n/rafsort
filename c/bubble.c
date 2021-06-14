#include "bubble.h"

#include <stdbool.h>

void bubble_sort(uint32_t *A, uint32_t n) {
    bool swapped = true;
    while (swapped) {
        swapped = false;

        for (uint32_t i = 1; i < n; i += 1) {
            if (A[i] < A[i - 1]) {
                uint32_t temp = A[i];
                A[i] = A[i - 1];
                A[i - 1] = temp;
                swapped = true;
            }
        }

        n -= 1;
    }
}
