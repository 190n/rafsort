#include "stack.h"

#include <stdlib.h>

// by Professor Long, copied from assignment document
struct Stack {
    uint32_t top; // Index of the next empty slot.
    uint32_t capacity; // Number of items that can be pushed.
    int64_t *items; // Array of items, each with type int64_t.
};

// by Professor Long, copied from assignment document
Stack *stack_create(uint32_t capacity) {
    Stack *s = (Stack *) malloc(sizeof(Stack));
    if (s) {
        s->top = 0;
        s->capacity = capacity;
        s->items = (int64_t *) calloc(capacity, sizeof(int64_t));
        if (!s->items) {
            free(s);
            s = NULL;
        }
    }
    return s;
}

// by Professor Long, copied from assignment document
void stack_delete(Stack **s) {
    if (*s && (*s)->items) {
        free((*s)->items);
        free(*s);
        *s = NULL;
    }
    return;
}

bool stack_empty(Stack *s) {
    return s->top == 0;
}

bool stack_full(Stack *s) {
    return s->top == s->capacity;
}

uint32_t stack_size(Stack *s) {
    return s->top;
}

bool stack_push(Stack *s, int64_t x) {
    if (stack_full(s)) {
        return false;
    } else {
        s->items[s->top] = x;
        s->top++;
        return true;
    }
}

bool stack_pop(Stack *s, int64_t *x) {
    if (stack_empty(s)) {
        return false;
    } else {
        s->top--;
        // by Professor Long, copied from assignment document
        *x = s->items[s->top];
        return true;
    }
}
