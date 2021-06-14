#ifndef __MALLOC_H__
#define __MALLOC_H__

#include <stdint.h>

void *malloc(unsigned long size);
void *calloc(unsigned long n, unsigned long size);
void free(void *ptr);

#endif
