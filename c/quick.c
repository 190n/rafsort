#include "quick.h"

#include "queue.h"
#include "stack.h"
#include "wasm_imports.h"

int64_t partition(int64_t lo, int64_t hi) {
    int64_t pivot_index = lo + ((hi - lo) / 2), i = lo - 1, j = hi + 1;
    while (i < j) {
        do {
            i += 1;
        } while (compare(i, pivot_index) < 0);

        do {
            j -= 1;
        } while (compare(j, pivot_index) > 0);

        if (i < j) {
            swap(i, j);
        }
    }

    return j;
}

void quick_sort_stack(uint32_t n) {
    int64_t lo = 0, hi = n - 1;
    // max stack size seems logarithmic; an array that would require this much space may not even
    // fit in memory
    Stack *stack = stack_create(200);
    stack_push(stack, lo);
    stack_push(stack, hi);

    while (!stack_empty(stack)) {
        stack_pop(stack, &hi);
        stack_pop(stack, &lo);
        int64_t p = partition(lo, hi);
        if (lo < p) {
            stack_push(stack, lo);
            stack_push(stack, p);
        }
        if (hi > p + 1) {
            stack_push(stack, p + 1);
            stack_push(stack, hi);
        }
    }

    stack_delete(&stack);
}

void quick_sort_queue(uint32_t n) {
    int64_t lo = 0, hi = n - 1;
    Queue *queue = queue_create(n);
    enqueue(queue, lo);
    enqueue(queue, hi);

    while (!queue_empty(queue)) {
        dequeue(queue, &lo);
        dequeue(queue, &hi);
        int64_t p = partition(lo, hi);
        if (lo < p) {
            enqueue(queue, lo);
            enqueue(queue, p);
        }
        if (hi > p + 1) {
            enqueue(queue, p + 1);
            enqueue(queue, hi);
        }
    }

    queue_delete(&queue);
}
