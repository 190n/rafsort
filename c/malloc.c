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
