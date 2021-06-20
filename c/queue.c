#include "queue.h"

#include <stdlib.h>

// by Professor Long, copied from assignment document
struct Queue {
    uint32_t head; // Index of the head of the queue.
    uint32_t tail; // Index of the tail of the queue.
    uint32_t size; // The number of elements in the queue.
    uint32_t capacity; // Capacity of the queue.
    int64_t *items; // Holds the items.
};

Queue *queue_create(uint32_t capacity) {
    // mostly copied from stack_create by Professor Long in the assignment document
    Queue *q = (Queue *) malloc(sizeof(Queue));

    if (q) {
        q->head = 0;
        q->tail = 0;
        q->size = 0;
        q->capacity = capacity;

        q->items = (int64_t *) malloc(capacity * sizeof(int64_t));
        if (!q->items) {
            // failure. try to free the memory we allocated for the queue.
            free(q);
            return NULL;
        }
    }

    return q;
}

void queue_delete(Queue **q) {
    // mostly copied from stack_delete by Professor Long in the assignment document
    if (*q && (*q)->items) {
        free((*q)->items);
        free(*q);
        // write null pointer so they don't try to use the queue
        *q = NULL;
    }
    return;
}

bool queue_empty(Queue *q) {
    return q->size == 0;
}

bool queue_full(Queue *q) {
    return q->size == q->capacity;
}

uint32_t queue_size(Queue *q) {
    return q->size;
}

static inline uint32_t queue_next(uint32_t curr, uint32_t capacity) {
    return (curr + 1) % capacity;
}

bool enqueue(Queue *q, int64_t x) {
    if (queue_full(q)) {
        return false;
    } else {
        q->items[q->tail] = x;
        q->tail = queue_next(q->tail, q->capacity);
        q->size++;
        return true;
    }
}

bool dequeue(Queue *q, int64_t *x) {
    if (queue_empty(q)) {
        return false;
    } else {
        *x = q->items[q->head];
        q->head = queue_next(q->head, q->capacity);
        q->size--;
        return true;
    }
}
