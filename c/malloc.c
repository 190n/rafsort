// bump allocator by Surma from https://surma.dev/things/c-to-webassembly/
// CC BY 4.0

#include <malloc.h>

extern unsigned char __heap_base;

unsigned long bump_pointer = (unsigned long) &__heap_base;

void *malloc(unsigned long n) {
    unsigned long r = bump_pointer;
    bump_pointer += n;
    return (void *) r;
}

void free(void *p) {
    // lol
    (void) p;
}

// clang emits calls to this function
void *memset(void *ptr, int c, unsigned long n) {
    unsigned char *p = (unsigned char *) ptr;

    for (unsigned long i = 0; i < n; i += 1) {
        p[i] = (unsigned char) c;
    }

    return ptr;
}

void *calloc(unsigned long n, unsigned long size) {
    char *ptr = (char *) malloc(n * size);
    for (unsigned long i = 0; i < n * size; i += 1) {
        ptr[i] = 0;
    }

    return (void *) ptr;
}
